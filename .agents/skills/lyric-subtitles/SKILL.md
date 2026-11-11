---
name: lyric-subtitles
description: Create animated karaoke-style lyric subtitles as a lower-third overlay (transparent ProRes 4444 .mov with alpha) for any music video, to place over the footage in Adobe Premiere Pro / any NLE. Uses free local tools: ffmpeg, whisper.cpp (word timing), Remotion (npx create-video). Use when the user asks for lyric subtitles, lyrical captions, karaoke text, sing-along lower thirds, or a song-lyrics overlay for a video.
---

# Lyric subtitles → lower-third overlay

Pipeline: **probe video → transcribe words (whisper.cpp) → align the user's lyrics to the timings → Remotion template → check stills → render preview + ProRes 4444 alpha overlay.**

The on-screen text is ALWAYS the user's lyrics text. Whisper is used only for timing.

`SKILL` below = this skill's folder, `.agents/skills/lyric-subtitles` in the repository root (Claude Code reaches it through the `.claude/skills/lyric-subtitles` link; Codex and Antigravity read `.agents/skills/` directly). Run every command from the repository root.

## Inputs to gather
1. **Video path** (required).
2. **Lyrics text** (one lyric line per row). If the user did not give it, ask for it. Only fall back to whisper's transcript if they want that, and say it may contain errors.
3. Optional overrides: language (default English), lines per card (default 2), font, colours, card on/off. Don't ask about these; use the defaults unless the user mentions them.
4. Export spec: read it from the video with ffprobe (`make_config.py` does this). Any export screenshot is just a cross-check. The overlay MUST match the sequence's resolution, fps and frame count.

## Workspace layout (one new directory per request)
Every request gets its own new run directory under `lyric-subtitles/` in the repository root, named `<YYYY-MM-DD>-<video-name-slug>` (for example `lyric-subtitles/2026-11-11-twinkle-star/`). If that name already exists, add `-2`, `-3`, … rather than reusing it. Never write into another request's run directory, except for a revision of that same request (see **Revisions**). Never create `lyrics/` or `output/` beside the source video.

Inside the run directory:
- `lyrics/`: the Remotion project
- `output/`: the deliverables
- `scratch/`: wav, words.json, lyrics.txt, check stills (use the session scratchpad instead if the assistant has one)

**Never commit any of it.** `/lyric-subtitles/` and all video/audio files (`*.mp4`, `*.mov`, `*.wav`, …) are in `.gitignore`. Before finishing, run `git status --short` and confirm nothing from the run directory, and no video or audio file, shows as untracked or staged. Never `git add` them, never use `git add -f` on them, and never commit the source video, the Remotion project, the renders, or the scratch files.

## Steps

```bash
SKILL=.agents/skills/lyric-subtitles
VID="/abs/path/video.mp4"
NAME="$(basename "${VID%.*}" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-' | sed 's/^-//;s/-$//')"
ROOT="lyric-subtitles/$(date +%F)-$NAME"; n=2; while [ -e "$ROOT" ]; do ROOT="lyric-subtitles/$(date +%F)-$NAME-$n"; n=$((n+1)); done
mkdir -p "$ROOT/output" "$ROOT/scratch"; ROOT="$(cd "$ROOT" && pwd)"; S="$ROOT/scratch"   # or the session scratchpad

# 1. Transcribe (installs whisper-cpp via brew and downloads the model to ~/.cache/whisper-cpp on first run)
bash $SKILL/scripts/transcribe.sh "$VID" $S medium.en en "<first lyric line>"
#   non-English or mixed language: model `medium` (or `large-v3`) and lang code (e.g. hi, ne, es) or `auto`

# 2. Save the user's lyrics to $S/lyrics.txt (one line per row, exact text)

# 3. Scaffold the project (npx create-video --blank, fonts, template, config from ffprobe)
bash $SKILL/scripts/setup_project.sh "$VID" "$ROOT/lyrics"

# 4. Align the lyrics to the word timings
python3 -I $SKILL/scripts/align_lyrics.py $S/words.json $S/lyrics.txt "$ROOT/lyrics/src/lyrics.json"
```

**Read the align report.**
- ~100% timed from whisper: great.
- Lines marked INTERPOLATED: their timing is estimated. Point them out to the user and check them in the preview.
- Match rate below 60%: the lyrics, language or model is probably wrong, or the song repeats sections that aren't written out in the lyrics. If choruses repeat in the audio, the lyrics text must repeat them too. Fix this before going on.

```bash
# 5. Check visually: render a few frames over the video (one per section, plus the longest line)
bash $SKILL/scripts/render.sh "$ROOT/lyrics" stills $S/frames 50 400 900
#   tile them for one look:  ffmpeg -i a.png -i b.png ... -filter_complex xstack ...
```
Look at the stills with Read. Check that:
- the text is legible over the footage
- the gold wipe matches the word being sung
- the card sits inside the safe area
- no line is clipped

Adjust `src/config.json` if needed. You can turn on `"showSafeGuides": true` temporarily to see the safe area.

```bash
# 6. Render the deliverables
bash $SKILL/scripts/render.sh "$ROOT/lyrics" preview "$ROOT/output/<Name>_Lyrics_PREVIEW.mp4"
bash $SKILL/scripts/render.sh "$ROOT/lyrics" overlay "$ROOT/output/<Name>_Lyrics_Overlay_ProRes4444_alpha.mov"
```
Verify the result:
- ffprobe shows `prores / 4444 / yuva444p*`, the right size and fps, and `nb_frames` equal to the source's frame count.
- Alpha is correct: `ffmpeg -ss 10 -i overlay.mov -frames:v 1 -vf alphaextract a.png` should show white only where the card is.

## Design defaults (template)
- **Card:** a dark-navy translucent rounded card at 1280×200 (sizes are at 1080p and scale to other resolutions). It sits 40px above the bottom of the 90% title-safe area. Keep the card on for bright footage like snow or sky; white text alone gets lost there.
- **Text:** 2 lines per card in Fredoka 600, 60px. Each word wipes white→gold left to right as it's sung, with a small pop. Cards slide up and fade between line pairs.
- **Long lines:** lines too wide for the card shrink automatically to fit.
- **Breaks:** the card hides during instrumental breaks longer than about 1.5 s, and stays on through the last frame if singing runs to the end.
- **Sparkles:** twinkling corner sparkles (`"sparkles": false` turns them off).

## Tuning (`src/config.json`, no code edits needed)
| key | effect |
|---|---|
| `linesPerCard` | 1 = single line, 2 = couplets (default), 3–4 also need `cardHeight` ≈ 90 + 60×lines |
| `leadIn` | seconds a card appears before its first word (0.35) |
| `fontFamily` / `fontWeight` | any Google Font name, e.g. "Baloo 2", "Nunito", "Poppins" |
| `fontSize`, `cardWidth`, `cardHeight`, `bottomMargin` | sizes in px at 1080p |
| `safeArea` | 0.9 title safe (default), 0.93 action safe |
| `showCard` | false = no plate; text gets a heavier shadow instead |
| `cardTop`/`cardBottom`, `textColor`, `highlightTop`/`highlightBottom` | colours, to match the video's palette |

**Global timing offset:** if every line is early or late by the same amount, shift all `s` and `e` values in `lyrics.json` with a one-line Python script. Don't re-transcribe. Single-word fixes: edit `lyrics.json` directly.

## Revisions after delivery (re-rendering)
Once the user has an overlay that works in their editor, **don't re-render unless something changed.** The render command only rebuilds the `.mov` from the project; rerunning it with no edits gives the same file.

Re-render the overlay only after one of these changes:
| Change | Where |
|---|---|
| A word or line is early/late | its `s`/`e` seconds in `lyrics/src/lyrics.json` (all lines off by the same amount: shift every value with a short Python script) |
| A typo in the lyrics | the `w` text in `lyrics/src/lyrics.json` (or fix `lyrics.txt` and rerun `align_lyrics.py`) |
| The look (font, colours, size, position, lines per card) | `lyrics/src/config.json` |
| The video was re-edited (length/fps changed) | re-export the source video, then rerun `setup_project.sh` (it relinks the video and refreshes the specs in `config.json` while keeping the style keys). If the edit changed the song timing, rerun transcribe + align too. |
| Animation behaviour itself | `lyrics/src/Composition.tsx` (only if `config.json` can't do it) |

How to do a revision (reuse that request's run directory as `ROOT`; a new video or new song is a new request with a new run directory):
1. Make the edit, then render 1–2 stills around the changed moment (`render.sh … stills`). Look at them.
2. Render the **preview** first (`render.sh … preview`) so the user can check it. Make the large ProRes file only after that.
3. Render the overlay to a **new versioned file name**, e.g. `<Name>_Lyrics_Overlay_ProRes4444_alpha_v2.mov`. Never overwrite a file the user has imported into Premiere: Premiere can keep a stale cached version or show the media as offline. Tell the user to replace the clip in their timeline with the v2 file.

What the render flags do (in case the user asks):
| Flag | Purpose |
|---|---|
| `LyricsOverlay` / `LyricsPreview` | transparent overlay / overlay on top of the source video with audio (for checking only) |
| `--codec=prores --prores-profile=4444` | ProRes 4444, the format that carries transparency into Premiere |
| `--pixel-format=yuva444p10le` | includes the alpha (transparency) channel |
| `--image-format=png` | frames are captured as PNG so alpha is kept (JPEG would drop it) |

Run from the project folder: `cd "$ROOT/lyrics" && npx remotion render LyricsOverlay ../output/<file>.mov --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png`. This is the same as `render.sh … overlay`.

## Gotchas
- `npx create-video` must be run with `--yes --blank <dir>`. Without them it stops at interactive prompts.
- Remotion won't follow a symlink in `public/`. The setup script hard-links the video, or copies it if the video is on a different drive.
- Drop-frame rates: fps comes from `r_frame_rate` (e.g. 30000/1001). Never round it to 30.
- whisper.cpp `-ml 1 -sow` gives one token per word. Its start times are close to the previous word's end, which is fine for a karaoke wipe.
- The ProRes 4444 file is large (about 16 MB/s at 1080p). That's expected.

## Hand-off message for the user
Tell them:
- The run directory for this request, and that it is git-ignored and was not committed.
- The file paths of the overlay and the preview.
- The overlay goes on the track above the video, starting at 00:00:00:00.
- If Premiere shows black around the card: Modify → Interpret Footage → Alpha: Straight.
- How the timing was made (whisper word times; your text). List any INTERPOLATED lines.
- The `config.json` keys they can change.
- The re-render command, with a clear note: they don't need to run it unless they change timing, text or styling. When they do, they should render to a new `_v2` file name rather than overwriting the clip in Premiere.
