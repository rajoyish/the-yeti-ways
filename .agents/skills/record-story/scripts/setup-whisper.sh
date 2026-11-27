#!/bin/sh
# record-story: make sure whisper.cpp and the ggml-medium.en model are ready.
#   sh .agents/skills/record-story/scripts/setup-whisper.sh [--check]
# --check only reports. Without it, a missing model is downloaded (about 1.5 GB) from the
# whisper.cpp repository on Hugging Face into ~/.cache/whisper-cpp/ and its SHA-1 is checked.
# whisper-cli itself is installed with Homebrew: brew install whisper-cpp (asked for, never run here).
set -e
MODEL="${WHISPER_MODEL:-$HOME/.cache/whisper-cpp/ggml-medium.en.bin}"
SHA1="8c30f0e44ce9560643ebd10bbe50cd20eafd3723"
URL="https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.en.bin"

CLI="${WHISPER_CLI:-$(command -v whisper-cli || true)}"
[ -z "$CLI" ] && [ -x /opt/homebrew/bin/whisper-cli ] && CLI=/opt/homebrew/bin/whisper-cli
if [ -z "$CLI" ]; then
  echo "whisper-cli not found. Install it with: brew install whisper-cpp" >&2
  exit 1
fi
echo "whisper-cli: $CLI ($("$CLI" --version 2>&1 | head -1))"

if [ -f "$MODEL" ]; then
  echo "model: $MODEL ($(du -h "$MODEL" | cut -f1))"
  exit 0
fi
if [ "${1-}" = "--check" ]; then
  echo "model missing: $MODEL (run this script without --check to download it, about 1.5 GB)" >&2
  exit 1
fi
mkdir -p "$(dirname "$MODEL")"
echo "Downloading ggml-medium.en.bin (about 1.5 GB) ..."
curl -fL --retry 3 -o "$MODEL.part" "$URL"
got=$(shasum -a 1 "$MODEL.part" | cut -d' ' -f1)
if [ "$got" != "$SHA1" ]; then
  rm -f "$MODEL.part"
  echo "Checksum mismatch ($got); download removed." >&2
  exit 1
fi
mv "$MODEL.part" "$MODEL"
echo "model: $MODEL (checksum OK)"
