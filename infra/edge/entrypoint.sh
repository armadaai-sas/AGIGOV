#!/bin/sh
set -e

cd /app

if [ ! -f /data/edge.db ]; then
  echo "[Edge] Inicializando SQLite edge..."
  EDGE_DATABASE_URL="file:/data/edge.db" npx prisma db push --schema prisma-edge/schema.prisma
fi

case "$1" in
  bootstrap)
    exec npx tsx src/edge/bootstrap.ts
    ;;
  sync-daemon)
    exec npx tsx src/edge/sync-daemon.ts
    ;;
  lorawan-handler)
    exec npx tsx src/ingest/lorawan-handler.ts
    ;;
  *)
    exec "$@"
    ;;
esac
