---
name: youtube-shorts
description: Cut a vertical 9:16 YouTube Short (30 or 60 seconds) from a finished Yeti film using a user-provided Shorts script (timed beats with Visual, On-Screen Text and Voiceover). Picks the shots from the film at the script's timestamps, crops them to 9:16 with ffmpeg, voices the voiceover in Google AI Studio through the AI Studio Voice Runner extension, lays the film's approved music bed (or a Flow Music cue from the Flow Music Score Runner) under it, and renders headlines, word-by-word captions and a freeze-frame CTA with Remotion (npx create-video). Use for "make a short", "YouTube Shorts", "30-second short", "60-second short", "teaser for the full story", "vertical cut from the film", or /youtube-shorts.
---

# YouTube Shorts from a finished film

Pipeline: **script → `short.json` (beats, headlines, shots) → speech blocks → voice in AI Studio → whisper word timings → 9:16 shot cuts → Remotion render → ffmpeg mix → check.**

`SKILL` = `.agents/skills/youtube-shorts` (Claude Code reaches it through `.claude/skills/youtube-shorts`). Run every command from the repository root. The scripts need Node.js, ffmpeg/ffprobe, `whisper-cli` (whisper.cpp) with `~/.cache/whisper-cpp/ggml-medium.en.bin` (or `WHISPER_MODEL=`), and network access for `npx create-video` and Google Fonts.

## Inputs

1. **The Shorts script**: timed beats, each with a Visual (film timestamps such as `[00:02:59]`), On-Screen Text, and Voiceover. Ask for it if missing.
2. **The film**: the final export (`Final__<film>.mp4`, usually 16:9 1920x1080) in the film's folder on the eSSD.
3. **Length**: 30 or 60 seconds; take it from the script, otherwise ask.
4. Optional: the full video's link (for the speech-blocks note), a narrator voice (default **Charon**), a music choice (default: the film's approved bed).

## Run directory

One per Short, beside the film: `<film folder>/shorts/<slug>/`, where `<slug>` is `<film-slug>-short-30s` or `-60s`; add `-2`, `-3`, ... if it exists. It holds `short.json`, `short/` (Remotion), `vo/`, `work/`, `output/`. None of it goes in git. Only the speech-blocks file (`speech-prompts/`) and, when made, the Flow Music guide (`music-prompts/`) live in the repository.

```bash
bash SKILL/scripts/setup.sh "<film folder>/shorts/<slug>"
```

`setup.sh` scaffolds the Remotion project with `npx create-video --yes --blank`, installs `@remotion/google-fonts` at the same version, copies `SKILL/template/Composition.tsx`, and starts `short.json` from `SKILL/template/short.example.json` (a complete, rendered 30-second example: read it before writing a new one).

## Step 1: write `short.json`

| Field | Meaning |
| --- | --- |
| `title`, `slug`, `length` (30 or 60), `fullVideo` | names and target length |
| `source` | the film, relative to the run directory (`../../Final__<film>.mp4`) |
| `vo` | the voiceover WAV, default `vo/story-full.wav` |
| `voice` | `{ "name": "Charon", "style": "Urgent, intrigued YouTube Shorts storyteller, punchy and quick, building suspense" }` |
| `bed` | `{ "file": "../../<film>-music-sfx-bed.wav", "start": <s>, "gainDb": -15 }`, or `null` for voice only |
| `music` | title, tempo and Sound Box prompt for an optional Flow Music cue (step 4) |
| `tail` | seconds held on the CTA after the last word (1.2) |
| `sections[]` | one per script beat: `text` (voiceover, verbatim), `headline` (on-screen text lines, verbatim, emoji kept), `cta` (true on the last), `shots[]` |

Each shot: `id`, `from`/`to` (film seconds or `m:ss`, inside one camera shot), `cx` (0-1, horizontal centre of the 9:16 crop), `at` (the word in this section's `text` the cut lands on; the first shot starts the section), and `hold` (seconds frozen at the end, on the last shot only).

Choosing shots:
- Find each script timestamp with `bash SKILL/scripts/scout.sh "<film>" 2:59 10 <scratch>`: a labelled contact sheet (one frame per second) and the hard cuts in the window. Look at every sheet. The script's timestamps are approximate; keep `from`/`to` between two cuts.
- Set `cx` from the sheet: the crop keeps 608 of 1920 px (32 %), so centre it on the speaker or the action. Keep faces whole.
- Put a cut on every noun the voiceover introduces (a character, an object, a place); 1.2 to 3 s per shot. Add shots the script does not list when a line names something on screen (for example the jealous neighbour).
- 30 s ≈ 95 to 105 words over 4 beats; 60 s ≈ 180 to 200 words over 6 to 8 beats. Keep the script's hook in the first 3 seconds and the CTA last.
- Characters appear only as the film shows them; never alter, recolour or reframe a Yeti so it goes off-model (`.agents/rules/character-consistency.md`).

```bash
node SKILL/scripts/short.mjs check "<run>/short.json"
```

## Step 2: voiceover (AI Studio Voice Runner)

Flow Music makes music only; it cannot voice a script. The voice is made in Google AI Studio (Gemini 3.8 Flash TTS) with the project's **AI Studio Voice Runner** extension (`tools/ai-studio-voice-runner/`).

```bash
node SKILL/scripts/short.mjs blocks "<run>/short.json"
```

writes `speech-prompts/<slug>-speech-blocks.md` (one Narrator block per section) and prints the single-take text.

- **The user runs the extension** (preferred): open `https://aistudio.google.com/generate-speech`, click The Master Storyteller, click once in the page, open the Voice Runner side panel, drop the speech-blocks file, **Generate selected parts**. It saves `Downloads/speech-takes/<slug>-speech-blocks/story-full.wav`.
- **The agent drives Chrome**: browser automation cannot open `chrome-extension://` pages, so the agent runs the extension's own steps in the AI Studio tab with `SKILL/scripts/ai-studio-take.js` (PREPARE with the voice, style and single-take text filled in → a real mouse click on **Run** → WAIT → SAVE). Say so to the user. Work in a new tab of the agent's own tab group; check the take's duration is plausible (about words / 3.3 s).

Copy the WAV to `<run>/vo/story-full.wav`. For a timing draft before the voice exists, `build --temp-vo` makes a macOS `say` placeholder; never deliver it as final.

## Step 3: build and render

```bash
node SKILL/scripts/short.mjs build "<run>/short.json" --render
```

1. whisper.cpp word timings of the voiceover, aligned in order to the script words (the script text is what appears; whisper only times it). `work/transcript.txt` is what was heard.
2. Each section starts on its first word; each shot cuts on its `at` word and runs to the next cut. Shots are cropped to 9:16 at `cx`, scaled to 1080x1920 (lanczos), 30 fps. A shot shorter than its slot is slowed by up to 15 %, then holds its last frame (reported as `note:`; fix it with a longer shot or a later cue).
3. `short/public/plan.json` drives `Composition.tsx`: slow push-in and a punch at each cut, the section headline popping in at the top (last line yellow), 1 to 3-word uppercase captions at 59 % height with the spoken word in yellow, the last shot frozen (white flash, desaturate) under the CTA with a bouncing 👇.
4. Remotion renders the picture; ffmpeg lays the VO at full level over the bed (ducked by a sidechain compressor, faded in and out) and normalises to -14 LUFS, true peak -1.5 dBTP. Output: `<run>/output/<slug>-9x16.mp4`.

**Text style (the user's choice): no outlines or strokes on any text; only the soft drop shadow in the template.** Keep it when changing the template.

## Step 4 (optional): a new Flow Music cue

Default music is the film's approved bed (`bed` in `short.json`; pick a `start` whose mood fits, and never regenerate the film's own score). For a fresh cue:

```bash
node SKILL/scripts/short.mjs music "<run>/short.json"
```

writes `music-prompts/<slug>-flow-music.md` (it needs the voiceover first): one movement and one cue row whose window ends exactly on the voice track, as the runner requires. Check it with `node .agents/skills/flow-music-score/scripts/check_score_guide.mjs music-prompts/<slug>-flow-music.md --audio "<run>/vo/story-full.wav"`; the "no ambience" and "no foley and no sound effects" warnings are expected for a music-only cue. In the **Flow Music Score Runner** extension (`tools/flow-music-score-runner/`), drop that guide and `<run>/vo/story-full.wav`, set Layer to **Music**, generate, and build; it saves `Downloads/flow-music-score/<slug>/<slug>-music-score.wav`, exactly the voice track's length. Set `bed.file` to it, `bed.start` to 0 and `gainDb` to about -12, then rebuild.

## Step 5: check before reporting

- Six frames across the render (`ffmpeg -i out.mp4 -vf "select='eq(n,60)+eq(n,250)+...',scale=300:-1,tile=6x1"`): every crop holds its subject, the headline and caption never overlap or wrap badly, one caption word lit at a time, the CTA arrow shows.
- `work/transcript.txt` against the script: every word spoken (homophones such as "linked"/"link" are fine).
- The `loudness:` line reads about -14 LUFS.
- `ffprobe`: 1080x1920, 30 fps, AAC 48 kHz, duration within a few seconds of 30 or 60.
- Report what was not checked (for example, that nobody listened to the take).

## Revisions

Edit `short.json` (shots, cues, headlines) or `Composition.tsx` in the run directory and run `build --render` again; it reuses the voiceover. A new voiceover: replace `vo/story-full.wav` and rebuild; every cut and caption follows the new word times.
