#!/usr/bin/env bash
# Scaffold a Remotion project for lyric subtitles and wire in the template.
# Usage: setup_project.sh <video> <project_dir>
# Creates <project_dir> (Remotion blank template), installs fonts/layout utils,
# copies the template composition, links the video to public/source.mp4 and
# writes src/config.json from ffprobe (fps, duration, size).
set -euo pipefail
VIDEO="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
PROJ="$2"
SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"

if [ ! -f "$PROJ/package.json" ]; then
  npx -y create-video@latest --yes --blank "$PROJ" </dev/null >/dev/null
fi
cd "$PROJ"
npm i >/dev/null 2>&1
npx remotion add @remotion/google-fonts >/dev/null 2>&1 || true
npx remotion add @remotion/layout-utils >/dev/null 2>&1 || true

cp "$SKILL_DIR/template/Composition.tsx" src/Composition.tsx
mkdir -p public
rm -f public/source.mp4
# hard link (symlinks are not followed by the Remotion bundler); copy if cross-device
ln "$VIDEO" public/source.mp4 2>/dev/null || cp "$VIDEO" public/source.mp4

python3 -I "$SKILL_DIR/scripts/make_config.py" "$VIDEO" src/config.json
[ -f src/lyrics.json ] || echo "[]" > src/lyrics.json
echo "Project ready: $(pwd)"
