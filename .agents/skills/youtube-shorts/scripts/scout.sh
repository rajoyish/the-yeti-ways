#!/usr/bin/env bash
# Look at the film around a timestamp to pick a shot for the Short.
# Usage: scout.sh <video> <time> [span=10] [out_dir=.]
#   <time> in seconds or m:ss / h:mm:ss (the script's [00:02:59] works without brackets)
# Writes <out_dir>/scout-<time>.jpg: one frame per second from time-span/2, tiled 5 across
# (the frame times are printed), and prints the hard cuts (scene > 0.2) in the window.
set -euo pipefail
VIDEO="$1"; T="$2"; SPAN="${3:-10}"; OUT="${4:-.}"
to_sec() { echo "$1" | tr -d '[]' | awk -F: '{s=0; for(i=1;i<=NF;i++) s=s*60+$i; print s}'; }
S=$(to_sec "$T")
START=$(awk -v s="$S" -v w="$SPAN" 'BEGIN{x=s-w/2; if(x<0)x=0; print x}')
mkdir -p "$OUT"
NAME="$OUT/scout-$(echo "$T" | tr -d '[]:')".jpg
ROWS=$(( (SPAN + 4) / 5 ))
ffmpeg -v error -y -ss "$START" -i "$VIDEO" -t "$SPAN" \
  -vf "fps=1,scale=384:-1,tile=5x$ROWS" \
  -frames:v 1 "$NAME"
# (no drawtext: not every ffmpeg build has it) frame i, left to right, top to bottom, is at START + i s
echo "contact sheet: $NAME"
printf "frame times: "; awk -v s="$START" -v n="$SPAN" 'BEGIN{for(i=0;i<n;i++) printf "%d=%.1f ", i, s+i; print ""}'
printf "cuts: "
ffmpeg -hide_banner -ss "$START" -i "$VIDEO" -t "$SPAN" -an \
  -vf "scale=320:-1,select='gt(scene\,0.2)',showinfo" -f null - 2>&1 \
  | grep -o "pts_time:[0-9.]*" | awk -F: -v s="$START" '{printf "%.2f ", s+$2}'
echo
