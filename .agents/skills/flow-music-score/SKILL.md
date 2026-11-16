---
name: flow-music-score
description: >-
  Write the Google Flow Music guide for a Yeti film's background music and
  sound effects together, with no voices, timed to its prerecorded voice
  track (story-full.wav), from the storyboard and speech blocks. Saves
  music-prompts/<film>-flow-music.md in the exact format the Flow Music Score
  Runner Chrome extension (tools/flow-music-score-runner) reads: movements of
  at most 3:00 with Film Window, tempo and Sound Box Prompt, plus a per-video
  SFX & Foley cue sheet. Measures the voice track with ffmpeg, validates the
  guide, and verifies the exported WAV is exactly as long as the voice track
  for Adobe Premiere Pro. Use for "background music", "score the film",
  "music and sound effects", "music bed", "Flow Music score", "match the
  voice audio length", or /flow-music-score.
---

# Flow Music score for a voiced Yeti film

Write **one guide** that lets the **Flow Music Score Runner** extension (`tools/flow-music-score-runner/`) generate the film's **instrumental music and sound effects as one mixed bed** in Google Flow Music, and join it into **one WAV exactly as long as the voice-only recording**. The guide is the deliverable. Generate audio only when the user asks; then follow **Run the extension** below.

Example of a finished guide: `music-prompts/papa-yeti-two-coins-of-wisdom-640s-flow-music.md` (64 videos, 634.050 s, 5 movements). Take each new film's numbers from its own sources, not from the example.

## Inputs

| Input | Typical path | Used for |
| --- | --- | --- |
| Storyboard | `prompts/<film>-storyboard.md` | `## Video N - Title` sections: plates, each `Sound:` line (music, then ambience and effects), each shot's `Effects:` |
| Speech blocks | `speech-prompts/<film>-speech-blocks.md` | The story's beats and emotions, line by line, to shape the music |
| Film timeline (if present) | `speech-prompts/<film>-film-timeline.json` | Who speaks in each video (found automatically next to the speech blocks) |
| Reference voice track | the film folder's `story-full.wav` | The exact length; speech and pauses, measured with ffmpeg |

If the user gives no WAV path, look in the storyboard and the timeline (`master`) for its name and ask for its folder. Never estimate the length from the storyboard: the voice track's sample count is the length.

**Output:** `music-prompts/<storyboard name without "-storyboard">-flow-music.md`, e.g. `prompts/papa-yeti-two-coins-of-wisdom-640s-storyboard.md` → `music-prompts/papa-yeti-two-coins-of-wisdom-640s-flow-music.md`. If it exists, read it first and update it rather than starting over; tell the user if its movements change, because takes already made for the old windows no longer fit.

**Tools:** Node 18+ and **ffmpeg / ffprobe** on PATH (macOS `brew install ffmpeg`, Windows `winget install Gyan.FFmpeg`, Linux `apt install ffmpeg`). The scripts need no npm packages; they read the guide through the extension's own `tools/flow-music-score-runner/plan.js`, so what passes the check is exactly what the extension sends.

## What Flow Music can do (tested 2026-11-16)

- **Compose** (top-right of a session) takes Lyrics (**Instrumental** switch), Sound (a description of at most **3,000 characters**; **Advanced** switch shows **BPM, Length, Seed, Model**), and Details (title). **Length** is `m:ss` and stops at **3:00**. Models: **Lyria 3.5** (default) and Lyria 3 Pro.
- One Compose run makes one song in about 20 s to 2.5 min. Sometimes Flow Music makes two and asks "Which do you prefer?"; the extension picks the first and keeps both.
- Songs come back close to the asked length, usually 0.5 to 2 s longer. Download WAV gives 48 kHz stereo 16-bit.
- There is no official API. The extension drives the Compose panel in the user's signed-in tab.

So a film longer than about 2:56 is scored in **movements**. The extension asks for each window plus **4 s** of overlap (crossfade 3 s + 1 s spare), so a window must be **≤ 176 s** (the last one ≤ 178 s). It then crossfades the takes and cuts the bed to the reference's exact sample count.

**How music and effects get combined.** Each movement's prompt is your **Sound Box Prompt** (music only) plus, added by the extension, the **SFX cue sheet rows** of the videos inside that window, written as movement-relative times (`0:40 Sharp metallic ring of a gold coin`). Flow Music renders both in one take. So **never write effects into the Sound Box Prompt**, and never write music into the cue sheet.

## Workflow

### 1. Gather (ffmpeg)

```bash
node .agents/skills/flow-music-score/scripts/gather.mjs \
  --storyboard prompts/<film>-storyboard.md \
  --blocks speech-prompts/<film>-speech-blocks.md \
  --audio "/path/to/story-full.wav" > scratch/<film>-score-brief.md
```

This prints the exact reference length, a row per video (window, place, speakers, **speech %** measured from the WAV, longest pause, the storyboard's music, ambience and effects), every pause of 1.5 s or more, and a **suggested movement split** that keeps each window under the limit, cuts where the place changes, and avoids cutting mid-sentence. Read the brief and the speech blocks before writing.

### 2. Choose the movements

Start from the suggestion and adjust to the story's acts:

- Windows start at `00:00.0`, touch end to end, and fall on **video boundaries** (multiples of the clip length).
- Each window **≤ 176 s**; the last **≤ 178 s** and ends at the reference length to two decimals (`10:34.05`).
- 3 to 6 movements for a 6 to 11 minute film. Prefer a cut where the place or mood changes and the narrator pauses.
- Name each movement after its act: `### Movement 2: The Two Sellers of Wisdom`.

### 3. Write each Sound Box Prompt (music only)

````text
[Style: Pure Instrumental Himalayan Folk Bed, Strictly No Vocals, No Singing]
<3–5 instruments for this movement>.
<Opening mood and texture>. At 0:25, <change tied to the story beat>. At 0:50, … At 2:10, <how it carries on>. No vocals, no synths.
````

- **Instrumental only.** Words like voice, vocal, sing, choir, hum, chant, lyrics or whisper may appear only negated (`no vocals`). The checker fails any other use.
- **Leitmotifs.** Give each main character or place one instrument and keep it across movements (e.g. Papa Yeti's bowed fiddle, Tashi Marmot's sly oboe, treasure's hammered dulcimer). Take them from the storyboard's `Sound:` lines so picture and score agree.
- **Cue times are movement-relative** (`At 1:20` = 80 s into the movement). Compute them from the video windows: video *k* in a movement starting at video *f* begins at `(k − f) × clip length`. Never use film-clock times (`02:20.0`) in a prompt.
- **Under speech.** Where the brief shows high speech % (narration over 70 %), keep the music sparse, low-mid and steady, with no new melodies starting under words. Put swells, flourishes and tempo changes at the listed pauses and on beats the story stresses.
- **Endings.** A non-final movement must not end: describe it carrying its mood on (the extension asks it to keep playing for the crossfade). Only the last movement resolves, with a final chord at its end.
- **Tempo.** Give one `NN BPM` in **Meter & Tempo**; the first number is put into Compose's BPM field.
- **Length.** Keep each Sound Box Prompt to about **1,000–1,500 characters**, so that with its folded cue rows the movement stays under 3,000. The checker's `fx level` must be `0`: at 1 the extension shortens the foley, at 2 it drops it.

### 4. Write the SFX & Foley cue sheet (effects only)

One row per storyboard video, in order, with no gaps:

```markdown
| **V07** | `01:00 - 01:10` | A Few Grains | Gentle wind | Rice grains rolling against a wooden bowl; soft cloth rustle |
```

- **Ambience:** the place's bed (birdsong, wind, crickets, hall reverb), from the storyboard's `Sound:` ambience. Repeating the same ambience is fine; the extension mentions it only when it changes.
- **Foley:** the visible actions, from the `Sound:` effect sentences and each shot's `Effects:` (coin clinks, a gate creak, footsteps, a spade in turf), in the order they happen.
- **No voice-like sounds:** no sighs, breaths, sniffs, gasps, laughs, humming (even of bees or lanterns), cries, whispers or voices. Swap them for the action's non-vocal sound (`a sigh` → `soft fur rustle as shoulders drop`). The extension drops such clauses and the checker lists each one.
- Separate sounds with `,` or `;`. Each clause is placed, or filtered, on its own.
- The last row ends at the reference length (`10:30 - 10:34`).

### 5. Assemble the guide

Use `references/guide-template.md`: the title and context; the musical architecture (leitmotif table); one `### Movement N: Title` block per movement with **Film Window**, **Target Duration**, **Meter & Tempo** and **Sound Box Prompt**; the cue sheet; correction prompts; and the run, verify and Premiere sections. Keep the field labels and code-block fences exactly as in the template, because the extension parses them.

### 6. Check

```bash
node .agents/skills/flow-music-score/scripts/check_score_guide.mjs music-prompts/<film>-flow-music.md \
  --audio "/path/to/story-full.wav" --storyboard prompts/<film>-storyboard.md [--show m02]
```

Fix every `ERROR`. Clear the `WARN`s too unless there is a reason not to (say which and why). `--show m02` prints the exact prompt the extension will paste for that movement.

## Run the extension (when the user asks for the audio)

1. Install once: `chrome://extensions` → **Developer mode** → **Load unpacked** → `tools/flow-music-score-runner` (see its `README.md`). The user must do this; browser automation cannot open `chrome://` pages.
2. In Chrome, sign in to `https://www.flowmusic.app` and open an existing **session**.
3. Open the extension's side panel. Drop the guide and `story-full.wav`. Tick the movements and click **Generate selected**, then **Build score WAV** → `Downloads/flow-music-score/<film>/<film>-music-sfx-bed.wav` (48 kHz, 24-bit stereo, peak −1 dBFS), a `.json` report, and the raw takes in `takes/`.
4. Retake a movement that sounds wrong (tick it, Generate, Build again). **Edit** on a row can reuse an existing Flow Music song link or a WAV file.

If you are driving the browser yourself and the extension is not installed, you may run its files in the Flow Music tab (load `hook.js`, `content.js`, `plan.js`, `score.js` and call `window.__FMR.generate(job)` / `captureWav(songId)`, then `Score.planLayout` / `render` / `encodeWav`). Several scripted downloads in a row can make Chrome block automatic downloads for the site: ask the user to allow them rather than changing browser settings. Say plainly what was generated and what was not, and never claim you listened to audio.

## Verify (ffmpeg) and hand over

```bash
node .agents/skills/flow-music-score/scripts/verify_bed.mjs \
  --bed "<film>-music-sfx-bed.wav" --audio "/path/to/story-full.wav" --preview scratch/<film>-preview-mix.wav --bed-db -18
```

It confirms the bed's length equals the voice track's to within one sample, that it is PCM WAV, its loudness and true peak, and any near-silent stretches. With `--preview` it renders the voice over the bed for listening. Ask the user to listen for any vocals in the bed and for effects that mask speech; a model cannot hear the result.

**Premiere Pro:** import the bed and place it at `00:00:00:00` on its own track under `story-full.wav`; both end on the same frame. Start around −18 to −20 dB and set it by ear, with Essential Sound → Music → Ducking if dialogue needs room.

## Final checklist

- [ ] Length from `story-full.wav` via ffprobe; the last Film Window ends there.
- [ ] Windows contiguous, on video boundaries, each ≤ 176 s (last ≤ 178 s).
- [ ] Sound Box Prompts: music only, instrumental, movement-relative `At m:ss` cues, quiet under dense narration, only the last one resolves, `fx level 0`.
- [ ] Cue sheet: one row per video, ambience + foley only, no voice-like sounds.
- [ ] `check_score_guide.mjs` passes; after building, `verify_bed.mjs` passes.
