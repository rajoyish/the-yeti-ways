# Guide template

Copy this structure into `music-prompts/<film>-flow-music.md`. Text in `<angle brackets>` is filled in; everything else (headings, bold field labels, the ```` ```text ```` fences, and the cue-table columns) stays exactly as shown, because `tools/flow-music-score-runner/plan.js` parses it:

- Film name: the `# ` title up to ` —`.
- Movements: `### Movement N: Title`, then `**Film Window:**` with `` `MM:SS.s – MM:SS.ss` ``, `**Meter & Tempo:**` containing one `NN BPM`, and `**Sound Box Prompt:**` followed by a ```` ```text ```` block.
- Cue rows: `| **Vnn** | `MM:SS - MM:SS` | Title | Ambience | Foley | Sound Effects |` (write `—` in an empty cell).

````markdown
# <Film Title> — <N>s Flow Music & Sound Design Guide

The soundtrack as four separate, voice-free stems (music, ambience, foley, sound effects) for **"<Film Title>"**, generated in [Google Flow Music](https://www.flowmusic.app/) (Lyria 3.5) with the **Flow Music Score Runner** extension (`tools/flow-music-score-runner/`), and cut to the voice-only recording **story-full.wav: exactly <duration> s** (<frames> frames @ <rate> Hz; <videos> videos of <clip> s, the last ending at <MM:SS.ss>).

### Project context
- **Voice track:** `<absolute path>/story-full.wav` (`<duration> s`)
- **Storyboard:** [<storyboard file>](../prompts/<storyboard file>)
- **Speech blocks:** [<speech blocks file>](../speech-prompts/<speech blocks file>)
- **Premiere project:** `<absolute path to .prproj>` (if known)

### Stems

| Stem | Made from | File | Premiere |
| --- | --- | --- | --- |
| Music (score & soundtrack) | the Sound Box Prompts below | `<film-slug>-music-score.wav` | A2, about −16 dB, ducked against Dialogue |
| Ambience (atmosphere) | the cue sheet's Ambience column | `<film-slug>-ambience.wav` | A3, about −14 to −18 dB |
| Foley | the cue sheet's Foley column | `<film-slug>-foley.wav` | A4, about −8 to −12 dB |
| Sound effects | the cue sheet's Sound Effects column | `<film-slug>-sfx.wav` | A5, about −6 to −10 dB |

Every stem is exactly `<duration> s` long, the same as `story-full.wav` on A1.

---

## Musical architecture & leitmotifs

| Motif / character | Lead instrumentation | Emotional quality & function |
| --- | --- | --- |
| <Hero>'s theme | <instrument> | <quality> |
| <Rival / trickster> | <instrument> | <quality> |
| <Place or turning point> | <instrument> | <quality> |

Speech density: <summary from the brief, e.g. "narration covers 80–94 % of most videos; the longest pause is 1.6 s at 06:19.0">. The music stays sparse and low-mid under speech and moves at the pauses.

> [!IMPORTANT]
> Every take is generated with Compose **Instrumental** on. The Sound Box Prompts are music only; ambience, foley and sound effects come from the cue sheet and are generated as their own stems over the same movement windows.

---

## Movements

<k> movements, each at most 3:00 including the 4 s crossfade overlap: <list of windows and seconds, summing to <duration> s>.

### Movement 1: <Act title>
- **Film Window:** `00:00.0 – <MM:SS.s>` (Videos 1 to <n>)
- **Target Duration:** **<seconds> seconds**
- **Meter & Tempo:** 4/4, <NN> BPM, <key>
- **Sound Box Prompt:**
  ```text
  [Style: Pure Instrumental <genre> Bed, Strictly No Vocals, No Singing]
  <Instruments>.
  <Opening>. At 0:25, <beat>. At 0:50, <beat>. … <Carries on into the next movement without a final ending>. No vocals, no synths.
  ```

---

### Movement <k>: <Final act title>
- **Film Window:** `<MM:SS.s> – <MM:SS.ss = reference length>` (Videos <a> to <z>)
- **Target Duration:** **<seconds> seconds**
- **Meter & Tempo:** <meter>, <NN> BPM, <key>
- **Sound Box Prompt:**
  ```text
  [Style: Pure Instrumental <genre> Finale, Strictly No Vocals, No Singing]
  <Instruments>.
  <…>. At <m:ss>, the theme resolves on a final soft chord and fades out completely at <m:ss = window length>. No vocals, no singing.
  ```

---

## Ambience, foley & sound effects cue sheet

Per video, with no voice-like sounds. Separate sounds with `;`. The extension turns each column into its own stem, at movement-relative times.

| Video | Film Time | Title / Scene | Ambience (Atmosphere) | Foley | Sound Effects |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **V01** | `00:00 - 00:10` | <Title> | <continuous bed of the place> | <body / handled-prop sounds>; <…> | <distinct events> |
| **V<nn>** | `<MM:SS> - <MM:SS = reference length, rounded>` | <Title> | <ambience> | <foley or —> | <sound effect or —> |

---

## In-app corrections (Flow Music)

- **Vocals crept in:** retake the movement in the extension (Compose Instrumental is already on). If it repeats, add `Absolutely no human voice of any kind.` to that Sound Box Prompt.
- **Too busy under narration:** add `Sparse, soft, low-mid accompaniment; no melody under the first <n> seconds.` to the Sound Box Prompt and retake.
- **An effect is missing or too loud:** edit that video's cell in the right column (fewer, clearer sounds), save, and retake that movement in that stem's layer.
- **Music or a melody in an effect stem:** retake it; if it repeats, shorten that movement's cells to plain nouns (`gate creak`, `three door knocks`).

---

## Run, verify, and place

1. Check the guide: `node .agents/skills/flow-music-score/scripts/check_score_guide.mjs music-prompts/<this file> --audio "<path>/story-full.wav" --storyboard prompts/<storyboard file>`
2. Generate in the extension's side panel: drop this guide and `story-full.wav` → **Generate & build all 4 stems** → `Downloads/flow-music-score/<film-slug>/<film-slug>-{music-score,ambience,foley,sfx}.wav`.
3. Verify each stem: `node .agents/skills/flow-music-score/scripts/verify_bed.mjs --bed <stem.wav> --audio "<path>/story-full.wav"`
4. Premiere Pro: every stem at `00:00:00:00` on its own track under `story-full.wav` (see Stems above), levels set by ear.
````
