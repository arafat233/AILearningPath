# ── Build stage ──────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --omit=dev

# ── Runtime stage ─────────────────────────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --chown=appuser:appgroup --from=deps /app/node_modules ./node_modules
COPY --chown=appuser:appgroup backend/ ./

ENV NODE_ENV=production
EXPOSE 5000

# Use node directly in prod (PM2 handles clustering outside Docker
# when deployed to a single VM; inside Docker use one process per container)
CMD ["node", "server.js"]
