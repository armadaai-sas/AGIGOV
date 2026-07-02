# Multi-stage edge node — ARM64 compatible (Oracle Always Free)
FROM node:22-bookworm-slim AS build

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev=false

COPY prisma prisma/
COPY prisma-edge prisma-edge/
COPY src src/
COPY tsconfig.json ./

RUN npm run db:generate

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/src ./src
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma-edge ./prisma-edge
COPY --from=build /app/tsconfig.json ./
COPY infra/edge/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh && mkdir -p /data /keys

ENV EDGE_DATABASE_URL="file:/data/edge.db"

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
CMD ["sync-daemon"]
