---
name: flow-music-score
description: >-
  Write the Google Flow Music guide for a Yeti film's soundtrack, made as four
  separate voice-free stems, each exactly as long as its prerecorded voice
  track (story-full.wav): Music (score & soundtrack), Ambience (atmosphere),
  Foley, and Sound effects. Built from the storyboard and speech blocks;
  saves music-prompts/<film>-flow-music.md in the exact format the Flow Music
  Score Runner Chrome extension (tools/flow-music-score-runner) reads:
  movements of at most 3:00 with Film Window, tempo and Sound Box Prompt,
  plus a per-video cue sheet with Ambience, Foley and Sound Effects columns.
  Measures the voice track with ffmpeg, validates the guide, verifies every
  exported stem, and joins the four stems into one mix (a bed to duck under
  the voice in Adobe Premiere Pro, or the finished soundtrack of a film with
  no narration). Use for "background music",
  "score the film", "sound effects", "ambience", "foley", "stems",
  "soundtrack", "match the voice audio length", or /flow-music-score.
---

# Flow Music soundtrack stems for a voiced Yeti film

Write **one guide** from which the **Flow Music Score Runner** extension (`tools/flow-music-score-runner/`) makes the film's soundtrack in Google Flow Music as **four separate stems**. Each stem is voice-free and is cut to **exactly the length of the voice-only recording**, so in Premiere every track starts at `00:00:00:00` and ends on the same frame as the voice:

| Stem | What it holds | Source in the guide | Output |
| --- | --- | --- | --- |
| **Music** (score & soundtrack) | Instrumental music only: no effects, no ambience | each movement's **Sound Box Prompt** | `<film>-music-score.wav` |
| **Ambience** (atmosphere) | The place's continuous bed: wind, birdsong, crickets, rain, a hall's room tone | cue sheet **Ambience** column | `<film>-ambience.wav` |
| **Foley** | Sounds the characters perform, in sync with action: footsteps, cloth and fur, hands, handled props (coins, bowls, cups, a spade) | cue sheet **Foley** column | `<film>-foley.wav` |
| **Sound effects** | Distinct events that are not a character's body or handled prop: door knocks, a gate creak, a kettle, wing whooshes, a treasure cascade, a magical shimmer | cue sheet **Sound Effects** column | `<film>-sfx.wav` |

Separate stems let the editor duck only the music under the voice, keep ambience low and steady, and set foley and effects by ear. After the stems are built and verified, the skill also joins them into **one mix**, `<film>-mix.wav` (see **Mix the stems** below): a single, balanced bed for an editor who would rather place one track and duck it under the voice in Premiere. A fifth extension layer, **Music + all effects (one mix)**, is different: it asks Flow Music for the older single combined bed in one take.

The guide is the deliverable. Generate audio only when the user asks; then follow **Run the extension** below.

Worked example (legacy 5-column cue sheet, music made as one mix): `music-prompts/papa-yeti-two-coins-of-wisdom-640s-flow-music.md` (64 videos, 634.050 s, 5 movements). Take each film's numbers from its own sources.

## Inputs

| Input | Typical path | Used for |
| --- | --- | --- |
| Storyboard | `prompts/<film>-storyboard.md` | `## Video N - Title` sections: plates, each `Sound:` line (music, then ambience and effects), each shot's action and `Effects:` |
| Speech blocks | `speech-prompts/<film>-speech-blocks.md` | The story's beats and emotions, line by line, to shape the music |
| Film timeline (if present) | `speech-prompts/<film>-film-timeline.json` | Who speaks in each video (found automatically next to the speech blocks) |
| Reference voice track | the film folder's `story-full.wav` | The exact length; speech and pauses, measured with ffmpeg |

If the user gives no WAV path, look for its name in the storyboard and in the timeline (`master`), and ask for its folder. Never estimate the length from the storyboard: the voice track's sample count is the length.

**Output:** `music-prompts/<storyboard name without "-storyboard">-flow-music.md`, e.g. `prompts/papa-yeti-two-coins-of-wisdom-640s-storyboard.md` → `music-prompts/papa-yeti-two-coins-of-wisdom-640s-flow-music.md`. If it exists, read it first and update it. Tell the user if the movements change, because stems already made for the old windows no longer fit.

**Tools:** Node 18+ and **ffmpeg / ffprobe** on PATH (macOS `brew install ffmpeg`, Windows `winget install Gyan.FFmpeg`, Linux `apt install ffmpeg`). The scripts need no npm packages. They read the guide through the extension's own `tools/flow-music-score-runner/plan.js`, so whatever passes the check is exactly what the extension sends.

## What Flow Music can do (tested 2026-11-16)

- **Compose** (top right of a session) takes Lyrics (**Instrumental** switch), Sound (a description of at most **3,000 characters**; the **Advanced** switch shows **BPM, Length, Seed, Model**), and Details (title). **Length** is `m:ss`, from **1:00** to **3:00**: a shorter ask is raised to 1:00 and the extension stops (seen 2026-11-23, 0:22 → 1:00), so the runner never asks for less than 1:00 and a film under about 2:56 is one movement. Models: **Lyria 3.5** (default) and Lyria 3 Pro.
- One Compose run makes one song in 20 s to 2.5 min. Sometimes Flow Music makes two and asks "Which do you prefer?"; the extension picks the first and keeps both.
- Music comes back close to the asked length (+0.5 to +2 s). Effects-only takes vary more (113 to 151 s for asks of 2:04 to 2:34), so effect layers ask for 8 s of headroom, and the extension retakes a take that is still too short once, with a longer Length.
- Download WAV gives 48 kHz stereo 16-bit. There is no official API: the extension drives the Compose panel in the user's signed-in tab.

So a film longer than about 2:56 is made in **movements**, and the same windows serve all four stems. The extension asks for each window plus **4 s** of overlap (a 3 s crossfade plus 1 s spare), so a window must be **≤ 176 s** (the last ≤ 178 s; effect layers' headroom is clipped to 3:00 automatically). It crossfades the takes and cuts each stem to the reference's exact sample count.

## Workflow

### 1. Gather (ffmpeg)

```bash
node .agents/skills/flow-music-score/scripts/gather.mjs \
  --storyboard prompts/<film>-storyboard.md \
  --blocks speech-prompts/<film>-speech-blocks.md \
  --audio "/path/to/story-full.wav" > scratch/<film>-score-brief.md
```

The brief has:
- the exact reference length;
- one row per video: window, place, speakers, **speech %** measured from the WAV, longest pause, and the storyboard's music, ambience and effects;
- every pause of 1.5 s or more;
- a **suggested movement split** that keeps each window under the limit, cuts where the place changes, and avoids cutting mid-sentence.

Read the brief and the speech blocks before writing.

### 2. Choose the movements

Start from the suggestion and adjust to the story's acts:

- Windows start at `00:00.0`, touch end to end, and fall on **video boundaries** (multiples of the clip length).
- Each window is **≤ 176 s**. The last is **≤ 178 s** and ends at the reference length to two decimals (`10:34.05`).
- Use 3 to 6 movements for a 6 to 11 minute film. Prefer a cut where the place or mood changes and the narrator pauses.
- Name each movement after its act: `### Movement 2: The Two Sellers of Wisdom`.

### 3. Write each Sound Box Prompt (the Music stem: music only)

````text
[Style: Pure Instrumental Himalayan Folk Score, Strictly No Vocals, No Singing]
<3–5 instruments for this movement>.
<Opening mood and texture>. At 0:25, <change tied to the story beat>. At 0:50, … <how it carries on>. No vocals, no synths.
````

- **Music only.** No birdsong, wind, crickets, footsteps, or other sounds: those belong in the cue sheet's stems. The extension also tells Flow Music "no sound effects, no ambience".
- **Instrumental only.** Words like voice, vocal, sing, choir, hum, chant, lyrics or whisper may appear only negated (`no vocals`). The checker fails any other use.
- **Leitmotifs.** Give each main character or place one instrument and keep it across movements (Papa Yeti's bowed fiddle, Tashi Marmot's sly oboe, the treasure's hammered dulcimer). Take them from the storyboard's `Sound:` lines so picture and score agree.
- **Cue times are movement-relative** (`At 1:20` = 80 s into the movement). Video *k* in a movement that starts at video *f* begins at `(k − f) × clip length`. Never put film-clock times (`02:20.0`) in a prompt.
- **Under speech.** Where the brief shows over 70 % speech, keep the music sparse, low-mid and steady, with no new melody starting under words. Put swells, flourishes and tempo changes at the listed pauses and on beats the story stresses.
- **Endings.** A non-final movement must not end; describe it carrying its mood on (the extension asks it to keep playing through the crossfade). Only the last movement resolves.
- **Tempo.** Give one `NN BPM` in **Meter & Tempo**; its first number goes into Compose's BPM field.
- **Length.** About 900–1,500 characters per prompt.

### 4. Write the cue sheet (the Ambience, Foley and Sound Effects stems)

One row per storyboard video, in order, with no gaps, and **three effect columns**:

```markdown
| Video | Film Time | Title / Scene | Ambience (Atmosphere) | Foley | Sound Effects |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **V07** | `01:00 - 01:10` | A Few Grains | Gentle mountain wind, distant birdsong | Rice grains rolling in a wooden bowl; soft fur rustle | — |
| **V48** | `07:50 - 08:00` | Three Firm Knocks | Quiet village lane, light breeze | — | Three loud hollow knocks on a bamboo door |
```

- **Ambience:** the continuous bed of the place (from the storyboard's `Sound:` ambience and its setting): air, wind, birds, insects, water, crowd-free room tone, a hall's reverb. Write it in every row, even when it doesn't change; the extension mentions it only when it changes, and the stem never drops to silence.
- **Foley:** what a character's body or a handled prop makes, in the order it happens on screen: footsteps (on what surface), cloth, fur and feathers, hands, sitting, kneeling, setting down, pouring, coins in a palm, a bowl tapped, a lid opened, a spade in turf.
- **Sound Effects:** distinct events that are not a body or a handled prop: knocks, a gate or fence creak, a kettle boiling, a wing whoosh, a tail-fan snap, a treasure cascade, a magical sparkle, thunder.
- When a sound could fit either column, put it where the editor would want to set its level: footsteps are always foley, and a door knock is always a sound effect.
- **No voice-like sounds** in any column: no sighs, breaths, sniffs, gasps, laughs, humming (even of bees or lanterns), cries, whispers or voices. Use the action's non-vocal sound instead (`a sigh` → `soft fur rustle as shoulders drop`). The extension drops such sounds and the checker lists each one.
- Separate sounds with `;`. Commas inside one sound are fine (`quick, light footsteps`). Write `—` for an empty cell.
- The last row ends at the reference length (`10:30 - 10:34`).

A legacy 5-column sheet (`| Ambience | Foley |`) still works, but its Foley column is split into foley and sound effects by keyword. Write the three columns for any new or updated guide.

### 5. Assemble the guide

Use `references/guide-template.md`. It has:
- the title and context;
- the stem table and Premiere layout;
- the musical architecture (leitmotif table);
- one `### Movement N: Title` block per movement, with **Film Window**, **Target Duration**, **Meter & Tempo** and **Sound Box Prompt**;
- the 6-column cue sheet;
- correction prompts;
- the run, verify and Premiere sections.

Keep the field labels, the code-block fences and the cue-sheet columns exactly as in the template, because the extension parses them.

### 6. Check

```bash
node .agents/skills/flow-music-score/scripts/check_score_guide.mjs music-prompts/<film>-flow-music.md \
  --audio "/path/to/story-full.wav" --storyboard prompts/<film>-storyboard.md [--show f02]
```

It lists the movements and every stem's jobs (Length and prompt size). Fix every `ERROR`. Clear the `WARN`s too unless there is a reason not to, and say which you left and why. `--show <id>` prints the exact prompt the extension will paste. Ids are `m01…` for music, `a01…` for ambience, `f01…` for foley and `s01…` for sound effects.

## Run the extension (when the user asks for the audio)

1. Install once: `chrome://extensions` → **Developer mode** → **Load unpacked** → `tools/flow-music-score-runner` (see its `README.md`). The user must do this, because browser automation cannot open `chrome://` pages.
2. In Chrome, sign in to `https://www.flowmusic.app` and open an existing **session**.
3. Open the extension's side panel and drop in the guide and `story-full.wav`.
4. Click **Generate & build all 4 stems**. It runs Music → Ambience → Foley → Sound effects. For each layer it generates every missing movement, retakes any take too short to fill its window once, and builds that stem. The files land in `Downloads/flow-music-score/<film>/`: `<film>-music-score.wav`, `-ambience.wav`, `-foley.wav` and `-sfx.wav` (48 kHz, 24-bit stereo, peak −1 dBFS, exact length), each with a `.json` report, plus the raw takes in `takes/`.
5. To redo one stem or one movement, pick its **Layer**, tick the movement, click **Generate selected**, then **Build this layer's WAV**. **Edit** on a row can also reuse an existing Flow Music song link or a WAV file.

If you are driving the browser yourself and the extension isn't installed, you can run its files in the Flow Music tab: load `hook.js`, `content.js`, `plan.js` and `score.js`, build jobs with `ScorePlan.buildPlan(md, { duration, layer })`, and call `window.__FMR.generate(job)` and `captureWav(songId)`, then `Score.planLayout` / `render` / `encodeWav`. Several scripted downloads in a row can make Chrome block automatic downloads for the site; ask the user to allow them rather than changing browser settings. Say plainly what was generated and what wasn't, and never claim you listened to the audio.

## Verify (ffmpeg) and hand over

Run this for each stem:

```bash
node .agents/skills/flow-music-score/scripts/verify_bed.mjs \
  --bed "<film>-<stem>.wav" --audio "/path/to/story-full.wav" [--preview scratch/<film>-<stem>-preview.wav --bed-db -18]
```

It confirms that the stem's length equals the voice track's to within one sample, that it is PCM WAV, and reports its loudness and true peak. For the music stem it also flags near-silent stretches. Foley and sound-effects stems are meant to be quiet between sounds, so ignore that warning for them. `--preview` renders the voice over the stem for listening. Ask the user to listen for any vocals or music in the effect stems, and for effects that mask the speech: a model cannot hear the result.

## Mix the stems (ffmpeg)

Always make the mix once all four stems pass `verify_bed.mjs`:

```bash
node .agents/skills/flow-music-score/scripts/mix_stems.mjs \
  --dir ~/Downloads/flow-music-score/<film> --audio "/path/to/story-full.wav"
```

It writes `<film>-mix.wav` (48 kHz, 24-bit stereo, exactly the reference's sample count) and `<film>-mix.json` (every setting and measurement) beside the stems:

| Setting | Default | Why |
| --- | --- | --- |
| Music | −4 dB | Leads the bed, under the voice |
| Ambience | −9 dB, high-pass 80 Hz at 12 dB/oct | A steady, quiet bed; the high-pass keeps rumble out of the drums |
| Foley | 0 dB | Quiet and sparse already |
| Sound effects | +1 dB | Clear hits |
| Loudness | **−20 LUFS, true peak ≤ −3 dBTP** | Sits under −14 to −16 LUFS dialogue before ducking, with headroom for the voice |

Options:
- `--gains music=-4,ambience=-9,foley=0,sfx=1` changes the balance (each stem arrives peak-normalised to −1 dBFS, so these set the relative levels).
- `--hp off` or `--hp 100` changes the ambience high-pass.
- `--no-voice` is for a film with **no narration or dialogue** (the reference is then the edit's own audio, as for `babu-yeti-and-the-indigo-archer-60s`): the mix is the finished soundtrack, at **−14 LUFS, true peak ≤ −1.5 dBTP**, and needs no ducking.
- `--dips "56.5-58.5:-6,71.7-78.3:-5"` lowers the music only, between two film times in seconds, with 0.3 s ramps. Use it in a no-voice film to make room for the big sound moments (a bowstring release, bells, a crunch), taken from the cue sheet; a voiced film normally leaves this to Premiere's ducking.
- `--target` and `--tp` override the loudness and the true-peak limit.
- `--sync "/path/to/picture-effects.wav" --sync-gain 0` adds a fifth layer that is already in sync with the picture: the edit's own effects exported from Premiere as audio only, with any voices removed. Flow Music takes cannot place a hit to the frame, so arrow shots, kicks, punches and impacts that the generated stems miss or smear come from this layer. It must be exactly the reference's length. Because it carries its own ambience bed, lower the generated ambience, foley and effects when you use it (for example `--gains music=-6,ambience=-14,foley=-4,sfx=-3 --sync-gain 2`), and say that its content (no voices, no stray music) needs a listen.

Check it with `verify_bed.mjs --bed <film>-mix.wav --audio <reference>` like a stem. When the user wants a level changed ("rain 2 dB quieter", "bells louder"), change the gains or dips and run it again; the stems are never altered.

**Premiere Pro, with the mix:** put `story-full.wav` on A1 (Dialogue) and `<film>-mix.wav` on A2 at `00:00:00:00`, and leave the four stems off the timeline (or muted). Tag the mix **Music** in Essential Sound, Clip Volume 0 dB, and turn on **Ducking**: Duck against **Dialogue** only, Sensitivity **6.0**, Duck Amount **−8 dB**, Fade Duration **400 ms**, Fade Position **0.0**, then **Generate Keyframes**. Because the mix holds the foley and effects too, a deeper duck also hides them under the voice: if a sound under a line matters, delete that keyframe pair or raise that stretch by hand. Put a Hard Limiter at −1 dB on the Mix track and export with Loudness Normalization at −14 LUFS (−1 dBTP). In a `--no-voice` film there is nothing to duck against: place the mix on A2, Ducking off, and export as it is.

**Premiere Pro, with the stems:** place every stem at `00:00:00:00`, one per track, under `story-full.wav`. They all end on the same frame as the voice.

| Track | Stem | Essential Sound tag | Starting level |
| --- | --- | --- | --- |
| A1 | `story-full.wav` | Dialogue | 0 dB (Loudness Auto-Match; Hard Limiter at −1 dB on the track) |
| A2 | Music | Music: Ducking against Dialogue, then **Generate Keyframes** | about −16 dB; duck −6 to −8 dB, 300–400 ms fades |
| A3 | Ambience | Ambience | about −14 to −18 dB, no ducking, or a light −3 dB duck |
| A4 | Foley | SFX | about −8 to −12 dB, set by ear |
| A5 | Sound effects | SFX | about −6 to −10 dB, set by ear |

Mix to about −16 to −14 LUFS for the whole film with Loudness Normalization on export (true peak −1 dBTP).

## Final checklist

- [ ] The length comes from `story-full.wav` via ffprobe, and the last Film Window ends there.
- [ ] Windows are contiguous and on video boundaries, each ≤ 176 s (the last ≤ 178 s).
- [ ] Sound Box Prompts are music only and instrumental, with movement-relative `At m:ss` cues, kept quiet under dense narration, and only the last one resolves.
- [ ] The cue sheet has one row per video, with Ambience in every row, Foley and Sound Effects in their own columns, and no voice-like sounds.
- [ ] `check_score_guide.mjs` passes, and after building, `verify_bed.mjs` passes for all four stems.
- [ ] `mix_stems.mjs` has made `<film>-mix.wav` (with `--no-voice` and any `--dips` for a film without narration), it is exactly the reference length, and `verify_bed.mjs` passes for it.
- [ ] The hand-over names both ways to place the audio in Premiere: the mix on A2 ducked against Dialogue, or the four stems on A2 to A5.
