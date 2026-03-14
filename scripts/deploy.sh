#!/usr/bin/env bash
# HBWeb build + deploy to k3d prod cluster
# Requires only: SSH access to server + docker (for local image build).
# All k8s/helm operations execute on the server. No local kubectl or helm needed.
#
# Usage: bash scripts/deploy.sh [OPTIONS]
#
# Options:
#   --host           SSH host (default: prod1.infra.habit.bingo)
#   --cluster        k3d cluster name (default: bingohabit-prod)
#   --ssh-user       SSH username (default: scott)
#   --values-file    Production values file (default: helm/hbweb/values.prod.yaml)
#   --tunnel-token   Cloudflare tunnel token (last resort; normally extracted from cluster)
#   --dry-run        Render chart on server only, no deploy
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

HOST="prod1.infra.habit.bingo"
CLUSTER="bingohabit-prod"
SSH_USER="scott"
VALUES_FILE="${REPO_ROOT}/helm/hbweb/values.prod.yaml"
LOCAL_SECRETS_FILE="${REPO_ROOT}/helm/hbweb/values.secrets.yaml"
CFTOKEN_FILE="${REPO_ROOT}/.cftoken"
TUNNEL_TOKEN_ARG=""
DRY_RUN=false

log() { echo "[deploy] $*"; }
err() { echo "[deploy] ERROR: $*" >&2; exit 1; }

srv() { ssh "${SSH_USER}@${HOST}" "$@"; }

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    --host)          HOST="$2"; shift 2 ;;
    --cluster)       CLUSTER="$2"; shift 2 ;;
    --ssh-user)      SSH_USER="$2"; shift 2 ;;
    --values-file)   VALUES_FILE="$2"; shift 2 ;;
    --tunnel-token)  TUNNEL_TOKEN_ARG="$2"; shift 2 ;;
    --dry-run)       DRY_RUN=true; shift ;;
    *) err "Unknown option: $1" ;;
  esac
done

# ─── Prerequisite checks ──────────────────────────────────────────────────────
command -v docker >/dev/null || err "docker not found (required for local image build)"
[[ -f "${VALUES_FILE}" ]] || err "Values file not found: ${VALUES_FILE}"

log "Checking SSH to ${SSH_USER}@${HOST}"
srv "true" || err "Cannot SSH to ${SSH_USER}@${HOST}"

# ─── Ensure helm on server ────────────────────────────────────────────────────
if ! srv "command -v helm >/dev/null 2>&1"; then
  log "helm not found on server — installing"
  srv "curl -fsSL https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash" \
    || err "helm install failed on server"
fi

# ─── Remote temp directory (cleaned up on exit) ───────────────────────────────
REMOTE_TMP=$(srv "mktemp -d")
cleanup_remote() { srv "rm -rf ${REMOTE_TMP}" 2>/dev/null || true; }
trap cleanup_remote EXIT

REMOTE_CHART="${REMOTE_TMP}/chart"
REMOTE_VALUES="${REMOTE_TMP}/values.yaml"
REMOTE_SECRETS="${REMOTE_TMP}/secrets.yaml"

# ─── Transfer chart and prod values to server ─────────────────────────────────
log "Transferring chart to server"
tar czf - -C "${REPO_ROOT}/helm" hbweb \
  | srv "tar xzf - -C ${REMOTE_TMP} && mv ${REMOTE_TMP}/hbweb ${REMOTE_CHART}"
scp -q "${VALUES_FILE}" "${SSH_USER}@${HOST}:${REMOTE_VALUES}"

# ─── Resolve tunnel token and write remote secrets ────────────────────────────
# Resolution order:
#   1. values.secrets.yaml present locally → scp as-is
#   2. Cluster secret exists on server → extract via kubectl
#   3. .cftoken file in repo root
#   4. --tunnel-token flag
if [[ -f "${LOCAL_SECRETS_FILE}" ]]; then
  log "Transferring local secrets to server"
  scp -q "${LOCAL_SECRETS_FILE}" "${SSH_USER}@${HOST}:${REMOTE_SECRETS}"
else
  log "Local secrets absent — resolving tunnel token"

  # Try cluster first (only the b64-encoded value crosses SSH; decoded on server)
  ENCODED=$(srv "kubectl get secret hbweb-cloudflared-secret \
    -n web -o jsonpath='{.data.tunnel-token}' 2>/dev/null || true")

  if [[ -n "${ENCODED}" ]]; then
    log "Extracting token from cluster secret"
    srv "python3 -c \"
import base64
t = base64.b64decode('${ENCODED}').decode().strip()
with open('${REMOTE_SECRETS}', 'w') as f:
    f.write('secrets:\n  cloudflareTunnelToken: ' + t + '\n')
\""
  else
    TOKEN=""
    if [[ -f "${CFTOKEN_FILE}" ]]; then
      TOKEN=$(cat "${CFTOKEN_FILE}")
      log "Using token from .cftoken"
    elif [[ -n "${TUNNEL_TOKEN_ARG}" ]]; then
      TOKEN="${TUNNEL_TOKEN_ARG}"
      log "Using token from --tunnel-token flag"
    else
      err "No tunnel token found. Options:
  1. Deploy from machine that has helm/hbweb/values.secrets.yaml
  2. Place token in .cftoken (gitignored)
  3. Pass --tunnel-token <token>"
    fi
    # Heredoc streams over encrypted SSH channel — token never in a process arg
    srv "cat > ${REMOTE_SECRETS}" <<EOF
secrets:
  cloudflareTunnelToken: ${TOKEN}
EOF
  fi
fi

# ─── Dry run ──────────────────────────────────────────────────────────────────
if [[ "${DRY_RUN}" == true ]]; then
  log "Dry run — rendering chart on server"
  srv "helm template hbweb ${REMOTE_CHART} -n web -f ${REMOTE_VALUES} -f ${REMOTE_SECRETS}"
  exit 0
fi

# ─── Build image ──────────────────────────────────────────────────────────────
log "Building Docker image hbweb:latest"
docker build -t hbweb:latest "${REPO_ROOT}"

# ─── Transfer image (air-gap) ─────────────────────────────────────────────────
log "Streaming image to ${HOST}"
docker save hbweb:latest | gzip | srv "docker load"

# ─── Import into k3d ──────────────────────────────────────────────────────────
log "Importing into k3d cluster ${CLUSTER}"
srv "k3d image import hbweb:latest -c ${CLUSTER}"

# ─── Helm deploy ──────────────────────────────────────────────────────────────
log "Running helm upgrade"
srv "helm upgrade --install hbweb ${REMOTE_CHART} \
  --namespace web \
  --create-namespace \
  -f ${REMOTE_VALUES} \
  -f ${REMOTE_SECRETS}"

# ─── Wait for rollout ─────────────────────────────────────────────────────────
log "Waiting for rollout"
srv "kubectl rollout status deployment/hbweb -n web --timeout=120s"

# ─── Smoke test (inside cluster — no port-forward or local curl needed) ───────
log "Smoke test"
PING=$(srv "kubectl exec -n web deployment/hbweb -- \
  wget -qO- http://localhost:3000/api/ping 2>/dev/null" || echo "FAILED")
HTTP=$(srv "kubectl exec -n web deployment/hbweb -- \
  wget -qS --spider http://localhost:3000/ 2>&1 | awk '/HTTP\//{print \$2}' | tail -1" \
  || echo "000")

if echo "${PING}" | grep -q "message" && [[ "${HTTP}" == "200" ]]; then
  log "Smoke test PASSED  /api/ping=${PING}  /=${HTTP}"
else
  err "Smoke test FAILED  /api/ping=${PING}  /=${HTTP}"
fi

log "Deploy complete"
