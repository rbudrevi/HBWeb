# AGENTS.md — HBWeb Agent Instructions

HBWeb is the BingoHabit web frontend: a React 18 SPA (Vite) + Express 5 server that serves as the public-facing landing page, legal pages, and future web client for habit.bingo.

---

## What It Is

| Property | Value |
|----------|-------|
| Public URL | `habit.bingo` (via Cloudflare tunnel) |
| Stack | React 18 + React Router 6 + TypeScript + Vite + TailwindCSS 3 + Express 5 |
| Package manager | pnpm (exact version pinned in `packageManager` field) |
| Test framework | Vitest |

**Current pages:** Index (landing), Privacy, Terms, Placeholder stubs for app flows. No authentication, no backend API calls. Standalone marketing site.

---

## Project Structure

```
client/           # React SPA
  pages/          # Route components (Index.tsx = home, privacy.tsx, terms.tsx)
  components/     # UI component library (Radix UI + Tailwind)
  App.tsx          # Router setup — add new routes here above the catch-all
server/
  index.ts        # Express app factory (createServer)
  node-build.ts   # Production entry point: serves dist/spa/ + API routes
  routes/         # API route handlers
shared/           # Types used by both client and server
helm/hbweb/       # Kubernetes Helm chart (see Deployment section below)
scripts/
  deploy.sh       # Reproducible build + deploy script
```

---

## Development

```bash
pnpm dev        # Start dev server at http://localhost:8080 (client + server)
pnpm build      # Production build → dist/spa/ + dist/server/node-build.mjs
pnpm start      # Start production server (after build)
pnpm test       # Vitest
pnpm typecheck  # TypeScript validation
```

**Hot reload gotcha:** Vite dev server and Express are unified on port 8080. Both client and server code hot-reload. API routes are prefixed `/api/`.

---

## Express 5 / path-to-regexp 8 Invariant

Express 5 uses `path-to-regexp` 8.x which requires ALL wildcards to be named. **Never use `app.get("*", ...)` for catch-all routes** — use `app.use(...)` instead.

```typescript
// WRONG — crashes with "Missing parameter name" at startup
app.get("*", handler);

// CORRECT
app.use(handler);
```

This was the root cause of the first crash on prod deployment.

---

## Runtime Dependencies Invariant

**`cors` must be in `dependencies`, not `devDependencies`.**

`vite.config.server.ts` externalizes `cors` (does not bundle it). So `cors` must be present in `node_modules` at runtime. If it's in devDependencies, `pnpm prune --prod` (run during Docker build) removes it and the server fails to start.

---

## Production Deployment

**Target:** `prod1.infra.habit.bingo` (Linode VPS, Debian 13)  
**Cluster:** `bingohabit-prod` (k3d)  
**Kubeconfig:** `~/.kube/bingohabit-prod.yaml` (on dev machine)  
**Namespace:** `web`

### Air-Gap Rule

Same as backend: images never pulled from a networked registry. Build locally → gzip transfer over SSH → k3d import.

### Quick Redeploy (code change, no secret change)

```bash
docker build -t hbweb:latest ./
docker save hbweb:latest | gzip | ssh scott@prod1.infra.habit.bingo docker load
ssh scott@prod1.infra.habit.bingo "k3d image import hbweb:latest -c bingohabit-prod"
KUBECONFIG=~/.kube/bingohabit-prod.yaml kubectl rollout restart deployment/hbweb -n web
KUBECONFIG=~/.kube/bingohabit-prod.yaml kubectl rollout status deployment/hbweb -n web --timeout=120s
```

### Full Deploy (first time or with secrets)

```bash
bash scripts/deploy.sh \
  --tunnel-token <token>
# or: token in helm/hbweb/values.secrets.yaml (gitignored), then:
bash scripts/deploy.sh
```

See `scripts/deploy.sh --help` (run without args for usage).

### Smoke Test

```bash
KUBECONFIG=~/.kube/bingohabit-prod.yaml kubectl port-forward -n web svc/hbweb 18080:3000 &
curl http://localhost:18080/api/ping   # → {"message":"ping"}
curl -o /dev/null -w "%{http_code}" http://localhost:18080/   # → 200
```

---

## Cloudflare Tunnel

HBWeb has its **own tunnel** (separate from the backend's tunnel).

| Field | Value |
|-------|-------|
| Public hostname | `habit.bingo` |
| Service (in-cluster) | `http://hbweb.web.svc.cluster.local:3000` |
| Token file | `.cftoken` (gitignored, never echo to terminal) |
| Secrets file | `helm/hbweb/values.secrets.yaml` (gitignored) |

**Setup (one-time per token):**
```bash
python3 -c "
token = open('.cftoken').read().strip()
open('helm/hbweb/values.secrets.yaml','w').write('secrets:\n  cloudflareTunnelToken: '+token+'\n')
print('ok')
"
```

Configure in Cloudflare Zero Trust → Networks → Tunnels:
1. Create tunnel, name it `hbweb-prod`
2. Copy token → `.cftoken`
3. Add Public Hostname: `habit.bingo` → Service: `http://hbweb.web.svc.cluster.local:3000`

---

## Helm Chart

Located at `helm/hbweb/`. Key design decisions:

| Decision | Value | Reason |
|----------|-------|--------|
| Namespace | `web` | Separate from backend (`default`) for blast-radius isolation |
| `imagePullPolicy` | `Never` | Air-gap rule — images always imported via `k3d image import` |
| Cloudflared enabled | `true` in prod | HBWeb has its own separate tunnel token |
| `cloudflare/cloudflared:latest` | Pulled normally | Public image, k3s nodes have internet access |

Deploy with `helm upgrade --install hbweb ./helm/hbweb -n web --create-namespace -f helm/hbweb/values.prod.yaml -f helm/hbweb/values.secrets.yaml`.

---

## Docker Build

Multi-stage build (`node:22-alpine`):

1. **builder stage:** `corepack enable` → `pnpm install --frozen-lockfile` → `pnpm build` → `pnpm prune --prod`
2. **runtime stage:** copy `dist/` + pruned `node_modules/` → non-root `hbweb` user → `node dist/server/node-build.mjs`

**Why `pnpm prune --prod` in builder (not `pnpm install --prod` in runtime):**  
The runtime stage can't always reach npm registry (network/IPv6 issues in Alpine containers). Pruning in the builder stage avoids the network dependency entirely.

**Build output:**
- `dist/spa/` — React SPA (static files)
- `dist/server/node-build.mjs` — Express server entry point (starts on `$PORT`, default 3000)

**`VITE_*` env vars** are baked at build time (not injectable at runtime). Currently `VITE_PUBLIC_BUILDER_KEY` is unused — hardcoded Builder.io CDN URLs in components. If Builder.io CMS is ever activated, pass key via `--build-arg` at Docker build time.

---

## Adding Features

### New page route
1. Create `client/pages/MyPage.tsx`
2. Add `<Route path="/my-page" element={<MyPage />} />` in `client/App.tsx` — above the catch-all `"*"` route

### New API endpoint
1. Create handler in `server/routes/my-endpoint.ts`
2. Register in `server/index.ts` inside `createServer()`
3. Use `app.get("/api/my-endpoint", handler)` — **never** `app.get("*", ...)` (Express 5 restriction)

---

## Invariants (Must Never Break)

- `cors` stays in `dependencies` (not devDep)
- All catch-all route handlers use `app.use()` not `app.get("*", ...)`
- `.cftoken` and `helm/hbweb/values.secrets.yaml` are never committed
- Image builds use the air-gap process (no networked registry on the cluster)
- `pnpm-lock.yaml` must be committed and kept in sync with `package.json`
