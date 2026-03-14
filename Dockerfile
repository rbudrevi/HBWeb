# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Enable corepack for exact pnpm version from package.json
RUN corepack enable

# Install dependencies first (cache layer)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# Prune devDependencies so runtime stage gets only production modules
RUN pnpm prune --prod

# Runtime stage
FROM node:22-alpine AS runtime
WORKDIR /app

# Copy built artifacts and pruned production node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Non-root user for security
RUN addgroup -S hbweb && adduser -S hbweb -G hbweb
USER hbweb

EXPOSE 3000
ENV PORT=3000 \
    NODE_ENV=production

CMD ["node", "dist/server/node-build.mjs"]

