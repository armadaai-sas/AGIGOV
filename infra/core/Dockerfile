FROM node:22-bookworm-slim AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY prisma prisma/
COPY prisma-edge prisma-edge/
COPY src src/
COPY docs/WHITEPAPER.md docs/WHITEPAPER.md
COPY tsconfig.json ./

RUN npm run db:generate && npm prune --omit=dev

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=96

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/src ./src
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma-edge ./prisma-edge
COPY --from=build /app/docs ./docs
COPY --from=build /app/tsconfig.json ./
COPY infra/core/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh && mkdir -p /data

ENTRYPOINT ["/entrypoint.sh"]
CMD ["public-api"]
