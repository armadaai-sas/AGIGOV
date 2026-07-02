#!/bin/sh
set -e
cd /app

export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=96}"

case "$1" in
  public-api)
    exec npx tsx src/server/public-api.ts
    ;;
  honeypot)
    exec npx tsx src/security/honeypot-server.ts
    ;;
  bus-worker)
    exec npx tsx src/bus/run-worker.ts
    ;;
  swarm-lite)
    exec npx tsx src/bus/run-swarm-lite.ts
    ;;
  core-lite)
    npx tsx src/server/public-api.ts &
    API_PID=$!
    npx tsx src/bus/run-swarm-lite.ts &
    SWARM_PID=$!
    trap 'kill $API_PID $SWARM_PID 2>/dev/null; exit 0' INT TERM
    wait $API_PID $SWARM_PID
    ;;
  migrate)
    npx prisma migrate deploy --schema prisma/schema.prisma
    npx tsx prisma/seed.ts
    ;;
  *)
    exec "$@"
    ;;
esac
