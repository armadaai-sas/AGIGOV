#!/usr/bin/env bash
# Optimiza video hero para web — requiere ffmpeg.
set -euo pipefail

SRC="${1:?Uso: hero-optimize.sh source.mp4}"
OUT_DIR="$(dirname "$SRC")"
BASE="agigov-dream"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Instala ffmpeg: brew install ffmpeg"
  exit 1
fi

echo "→ WebM VP9 (hero principal)"
ffmpeg -y -i "$SRC" \
  -an -vf "scale=1280:-2" -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 \
  "$OUT_DIR/${BASE}.webm"

echo "→ MP4 H.264 (Safari)"
ffmpeg -y -i "$SRC" \
  -an -vf "scale=1280:-2" -c:v libx264 -crf 28 -preset slow -movflags +faststart \
  "$OUT_DIR/${BASE}.mp4"

echo "→ Poster WebP"
ffmpeg -y -i "$SRC" -vframes 1 -vf "scale=1280:-2" -q:v 75 \
  "$OUT_DIR/poster.webp"

echo "Listo. Actualiza HERO_FILM.poster en heroFilmConfig.ts si usas poster.webp"
