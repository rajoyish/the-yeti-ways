#!/usr/bin/env bash
# Scaffold a YouTube Short run directory.
# Usage: setup.sh <run_dir>
# Creates <run_dir>/short (Remotion blank project via npx create-video), installs
# @remotion/google-fonts, copies the template composition, and copies
# short.example.json to <run_dir>/short.json when no config exists yet.
set -euo pipefail
RUN="$1"
SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$RUN"/{vo,work,output}
cd "$RUN"
if [ ! -f short/package.json ]; then
  npx -y create-video@latest --yes --blank short </dev/null >/dev/null
fi
cd short
npm i >/dev/null 2>&1
# keep every @remotion package on the exact version create-video installed
V=$(node -p 'require("./node_modules/remotion/package.json").version')
npm i "@remotion/google-fonts@$V" >/dev/null 2>&1
cp "$SKILL_DIR/template/Composition.tsx" src/Composition.tsx
mkdir -p public
cd ..
[ -f short.json ] || cp "$SKILL_DIR/template/short.example.json" short.json
echo "Run directory ready: $(pwd) (Remotion $V)"
