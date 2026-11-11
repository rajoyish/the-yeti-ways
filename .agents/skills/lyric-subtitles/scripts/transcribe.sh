#!/usr/bin/env bash
# Word-level transcription of a video's audio with whisper.cpp (free, local).
# Usage: transcribe.sh <video> <out_dir> [model] [language] [prompt]
#   model:    medium.en (default, English) | medium | large-v3 (multilingual)
#   language: en (default) | auto | hi | ne | es ...
#   prompt:   optional first line of lyrics to bias recognition
# Output: <out_dir>/words.json (whisper.cpp JSON, one token per word)
set -euo pipefail
VIDEO="$1"; OUT="$2"; MODEL="${3:-medium.en}"; LANG_CODE="${4:-en}"; PROMPT="${5:-}"
MODEL_DIR="$HOME/.cache/whisper-cpp"
MODEL_FILE="$MODEL_DIR/ggml-$MODEL.bin"
mkdir -p "$OUT" "$MODEL_DIR"

command -v ffmpeg >/dev/null || { echo "ffmpeg missing: brew install ffmpeg"; exit 1; }
command -v whisper-cli >/dev/null || brew install whisper-cpp

if [ ! -s "$MODEL_FILE" ]; then
  echo "Downloading whisper model $MODEL ..."
  curl -L --fail -o "$MODEL_FILE" "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-$MODEL.bin"
fi

ffmpeg -v error -y -i "$VIDEO" -vn -ar 16000 -ac 1 "$OUT/audio16k.wav"

ARGS=(-m "$MODEL_FILE" -f "$OUT/audio16k.wav" -ml 1 -sow -oj -of "$OUT/words" -l "$LANG_CODE")
[ -n "$PROMPT" ] && ARGS+=(--prompt "$PROMPT")
whisper-cli "${ARGS[@]}" >/dev/null 2>&1
echo "Wrote $OUT/words.json"
