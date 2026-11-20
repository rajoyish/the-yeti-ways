#!/usr/bin/env bash
# Download Mouse Memoirs Regular and its license from the Google Fonts repository.
# Usage: bash download_font.sh <project_dir>
set -euo pipefail
FONT_DIR="$1/public/fonts"
BASE="https://raw.githubusercontent.com/google/fonts/main/ofl/mousememoirs"
mkdir -p "$FONT_DIR"
for FILE in MouseMemoirs-Regular.ttf OFL.txt; do
  DEST="$FONT_DIR/$FILE"
  [ "$FILE" != OFL.txt ] || DEST="$FONT_DIR/MouseMemoirs-OFL.txt"
  if [ ! -s "$DEST" ]; then
    TEMP="$(mktemp "$FONT_DIR/.mouse-memoirs.XXXXXX")"
    trap 'rm -f "$TEMP"' EXIT
    curl --fail --location --retry 2 --silent --show-error "$BASE/$FILE" -o "$TEMP"
    test -s "$TEMP"
    mv "$TEMP" "$DEST"
    trap - EXIT
  fi
done
echo "Mouse Memoirs Regular ready: $FONT_DIR/MouseMemoirs-Regular.ttf"
