#!/usr/bin/env bash
# Render stills / preview / final overlay from a lyric-subtitles project.
# Usage:
#   render.sh <project_dir> stills <out_dir> <frame> [frame...]   # check frames over video
#   render.sh <project_dir> preview <out.mp4>                     # overlay burned on video, with audio
#   render.sh <project_dir> overlay <out.mov>                     # FINAL: ProRes 4444 + alpha
set -euo pipefail
PROJ="$1"; MODE="$2"; shift 2
cd "$PROJ"
case "$MODE" in
  stills)
    OUT="$1"; shift; mkdir -p "$OUT"
    for f in "$@"; do
      npx remotion still LyricsPreview "$OUT/frame_$f.png" --frame="$f" >/dev/null 2>&1 \
        || { echo "still $f failed"; npx remotion still LyricsPreview "$OUT/frame_$f.png" --frame="$f" 2>&1 | tail -20; exit 1; }
      echo "$OUT/frame_$f.png"
    done ;;
  preview)
    npx remotion render LyricsPreview "$1" --codec=h264 --crf=18 2>&1 | tail -1 ;;
  overlay)
    npx remotion render LyricsOverlay "$1" --codec=prores --prores-profile=4444 \
      --pixel-format=yuva444p10le --image-format=png 2>&1 | tail -1
    ffprobe -v error -select_streams v:0 \
      -show_entries stream=codec_name,profile,pix_fmt,width,height,r_frame_rate,nb_frames \
      -of compact "$1" ;;
  *) echo "unknown mode $MODE"; exit 1 ;;
esac
