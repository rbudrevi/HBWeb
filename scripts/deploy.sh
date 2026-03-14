#!/usr/bin/env bash
# HBWeb build + deploy to k3d cluster
# Usage: bash scripts/deploy.sh [OPTIONS]
#
# Options:
#   --host           SSH host for image transfer (default: prod1.infra.habit.bingo)
#   --cluster        k3d cluster name (default: bingohabit-prod)
#   --kubeconfig     Kubeconfig path (default: ~/.kube/bingohabit-prod.yaml)
#   --values-file    Additional values file (default: helm/hbweb/values.prod.yaml)
#   --tunnel-token   Cloudflare tunnel token (required if cloudflared.enabled=true)
#   --dry-run        Render chart only, no deploy
#
# Prerequisites: docker, k3d, helm, ssh access to --host
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

HOST="prod1.infra.habit.bingo"
CLUSTER="bingohabit-prod"
KUBECONFIG_PATH="${HOME}/.kube/bingohabit-prod.yaml"
VALUES_FILE="${REPO_ROOT}/helm/hbweb/values.prod.yaml"
TUNNEL_TOKEN=""
DRY_RUN=false

log() { echo "[deploy] $*"; }
err() { echo "[deploy] ERROR: $*" >&2; exit 1; }

while [[ $# -gt 0 ]]; do
  case $1 in
    --host)           HOST="$2"; shift 2 ;;
    --cluster)        CLUSTER="$2"; shift 2 ;;
    --kubeconfig)     KUBECONFIG_PATH="$2"; shift 2 ;;
    --values-file)    VALUES_FILE="$2"; shift 2 ;;
    --tunnel-token)   TUNNEL_TOKEN="$2"; shift 2 ;;
    --dry-run)        DRY_RUN=true; shift ;;
    *) err "Unknown option: $1" ;;
  esac
done

export KUBECONFIG="${KUBECONFIG_PATH}"

# --- Validate ---
[[ -f "${VALUES_FILE}" ]] || err "Values file not found: ${VALUES_FILE}"
command -v docker >/dev/null || err "docker not found"
command -v helm   >/dev/null || err "helm not found"

# --- Dry run ---
if [[ "${DRY_RUN}" == true ]]; then
  log "Dry run — rendering chart only"
  EXTRA_ARGS=""
  [[ -n "${TUNNEL_TOKEN}" ]] && EXTRA_ARGS="--set secrets.cloudflareTunnelToken=${TUNNEL_TOKEN}"
  helm template hbweb "${REPO_ROOT}/helm/hbweb" \
    -n web \
    -f "${VALUES_FILE}" \
    ${EXTRA_ARGS}
  exit 0
fi

# --- Build Docker image ---
log "Building Docker image hbweb:latest"
docker build -t hbweb:latest "${REPO_ROOT}"

# --- Transfer to host (air-gap) ---
log "Transferring image to ${HOST}"
docker save hbweb:latest | gzip | ssh "scott@${HOST}" docker load

# --- Import into k3d ---
log "Importing into k3d cluster ${CLUSTER}"
ssh "scott@${HOST}" "k3d image import hbweb:latest -c ${CLUSTER}"

# --- Helm deploy ---
HELM_ARGS=()
[[ -n "${TUNNEL_TOKEN}" ]] && HELM_ARGS+=(--set "secrets.cloudflareTunnelToken=${TUNNEL_TOKEN}")
[[ -f "${REPO_ROOT}/helm/hbweb/values.secrets.yaml" ]] && \
  HELM_ARGS+=(-f "${REPO_ROOT}/helm/hbweb/values.secrets.yaml")

log "Deploying via helm"
KUBECONFIG="${KUBECONFIG_PATH}" helm upgrade --install hbweb "${REPO_ROOT}/helm/hbweb" \
  --namespace web \
  --create-namespace \
  -f "${VALUES_FILE}" \
  "${HELM_ARGS[@]}"

# --- Wait for rollout ---
log "Waiting for rollout"
KUBECONFIG="${KUBECONFIG_PATH}" kubectl rollout status deployment/hbweb -n web --timeout=120s

# --- Smoke test ---
log "Smoke test"
KUBECONFIG="${KUBECONFIG_PATH}" kubectl port-forward -n web svc/hbweb 18080:3000 &
PF_PID=$!
sleep 3
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:18080/api/ping)
kill "${PF_PID}" 2>/dev/null || true
if [[ "${HTTP_STATUS}" == "200" ]]; then
  log "Smoke test PASSED (/api/ping → ${HTTP_STATUS})"
else
  err "Smoke test FAILED (/api/ping → ${HTTP_STATUS})"
fi

log "Deploy complete"
