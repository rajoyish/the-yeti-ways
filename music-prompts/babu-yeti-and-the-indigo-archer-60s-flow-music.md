# Babu Yeti and the Indigo Archer — 98s Flow Music & Sound Design Guide

The soundtrack as four separate, voice-free stems (music, ambience, foley, sound effects) for **"Babu Yeti and the Indigo Archer"**, generated in [Google Flow Music](https://www.flowmusic.app/) (Lyria 3.5) with the **Flow Music Score Runner** extension (`tools/flow-music-score-runner/`), and cut to the edited film's length: **exactly 98.267 s** (4,716,800 frames @ 48,000 Hz; the six storyboard videos and four pick-ups as cut in Premiere, ending at 01:38.27).

This film has no narration or dialogue, so there is no `story-full.wav`. The length reference is the audio of the final export, `indigo-archer-reference.wav`, taken from `112326 – Babu Yeti and the Indigo Archer_1.mp4` with ffmpeg. The cue sheet follows the **edit**, not the storyboard's 10-second clock: one row per cut segment, as read from the Premiere project's timeline.

### Project context
- **Length reference:** `/Volumes/eSSD/The Yeti Ways/112326 – Babu Yeti and the Indigo Archer/indigo-archer-reference.wav` (`98.267 s`)
- **Edited film:** `/Volumes/eSSD/The Yeti Ways/112326 – Babu Yeti and the Indigo Archer/112326 – Babu Yeti and the Indigo Archer_1.mp4`
- **Storyboard:** [babu-yeti-and-the-indigo-archer-60s-storyboard.md](../prompts/babu-yeti-and-the-indigo-archer-60s-storyboard.md)
- **Premiere project:** `/Volumes/eSSD/The Yeti Ways/112326 – Babu Yeti and the Indigo Archer/112326 – Babu Yeti and the Indigo Archer.prproj`

### Stems

| Stem | Made from | File | Premiere |
| --- | --- | --- | --- |
| Music (score & soundtrack) | the Sound Box Prompts below | `babu-yeti-and-the-indigo-archer-music-score.wav` | A2, about −14 dB (no voice to duck under) |
| Ambience (atmosphere) | the cue sheet's Ambience column | `babu-yeti-and-the-indigo-archer-ambience.wav` | A3, about −14 to −18 dB |
| Foley | the cue sheet's Foley column | `babu-yeti-and-the-indigo-archer-foley.wav` | A4, about −8 to −12 dB |
| Sound effects | the cue sheet's Sound Effects column | `babu-yeti-and-the-indigo-archer-sfx.wav` | A5, about −6 to −10 dB |

Every stem is exactly `98.267 s` long, the same as the edited film. Mute the clips' own Flow audio (A1) once the stems are in.

---

## Musical architecture & leitmotifs

| Motif / character | Lead instrumentation | Emotional quality & function |
| --- | --- | --- |
| Indigo Archer | Bamboo flute | Calm, poised resolve; leads the engagement and returns warm at the end |
| The Masked Prowlers | Low taiko drums and a low cello ostinato | Coiled menace that drives the run and the standoff, never horror |
| Babu Yeti | Plucked zither in short, light figures | Small, curious, playful; it peeks through between the drums |
| The bells and the ricochet | Bright tuned chimes (glockenspiel) | The clever turn: sparkle and comic release |
| Gratitude and home | Warm strings and soft woodwinds | Tenderness after the danger, and the cheeky final wink |

No speech anywhere: the music may carry melody throughout, but it leaves the big sound moments (the bowstring release, the bell rings, the splashes) a clear half second of space.

> [!IMPORTANT]
> Every take is generated with Compose **Instrumental** on. The Sound Box Prompts are music only; ambience, foley and sound effects come from the cue sheet and are generated as their own stems over the same movement windows.

---

## Movements

1 movement covering the whole 98.27 s film: well inside Flow Music's 3:00, and every take asks for at least 1:00, Compose's minimum (a separate 20 s ending movement was refused at 0:22). The turn from action to tenderness at 1:18 is carried by the prompt's timed cues.

### Movement 1: Shadows, the Ricochet and the Apple
- **Film Window:** `00:00.0 – 01:38.27` (edit segments V01 to V14)
- **Target Duration:** **98.27 seconds**
- **Meter & Tempo:** 4/4, 112 BPM, D minor turning to D major at 1:18
- **Sound Box Prompt:**
  ```text
  [Style: Pure Instrumental Cinematic East Asian Action Score with a Warm Finale, Strictly No Vocals, No Singing]
  Low taiko drums, low cello, bamboo flute, plucked zither, bright tuned chimes, warm strings, soft clarinet.
  Opens tense and coiled: a low sustained cello note over a slow, heavy taiko pulse, with two light plucked zither notes for the small watcher. At 0:07, the taiko quickens into a running rhythm as the masked runners close in. At 0:17, full driving martial percussion and a brisk, bold bamboo flute melody for the archer's acrobatic defence. At 0:27, the drums drop out to one held low cello note, tight and waiting. At 0:30, a quiet standoff: high taut sustained strings, very sparse, a soft low drum heartbeat. At 0:48, a brief lift as the plucked zither plays a small relieved figure. At 0:53, everything holds still on one long high string note; at 0:57, a single deep drum hit marks the release, then near-silence. At 1:03, rapid light percussion builds as the arrow flies. At 1:12, bright tuned chimes ring in quick playful runs over bouncy percussion, comic and triumphant. At 1:17, one crisp drum accent, then the drums stop. At 1:18, slower and tender in a major key: warm sustained strings and a gentle bamboo flute line for heartfelt thanks. At 1:28, a peaceful, playful passage: light plucked zither and a cheerful clarinet tune, bouncy and sweet. At 1:35, a single bright chime sparkle, then the theme resolves on a final soft major chord and fades out completely at 1:38. No vocals, no synths.
  ```

---

## Ambience, foley & sound effects cue sheet

One row per segment of the edit, in film order, with no voice-like sounds. Separate sounds with `;`. The extension turns each column into its own stem, at movement-relative times.

| Video | Film Time | Title / Scene | Ambience (Atmosphere) | Foley | Sound Effects |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **V01** | `00:00.0 - 00:06.9` | Video 1, first part: the warning arrow, villagers fall back, the blockade | Steady rain on a muddy village lane and tiled roofs, water dripping from eaves | Apple turned in small hands, soft fur against a timber post; hurried footsteps squelching through mud; wooden staves gripped, wet cloth rustle | Arrow whistling past; a thin cord snapping |
| **V02** | `00:06.9 - 00:16.7` | Pick-up 4 - The Prowlers' Run | Steady rain on a muddy village lane and tiled roofs, water dripping from eaves | Heavy running boots splashing through puddles; wet cloth swishing; a wooden staff swinging in a grip | A fast air whoosh as the runners pass close |
| **V03** | `00:16.7 - 00:26.7` | Video 2 - The Muddy Engagement | Steady rain on a muddy village lane and tiled roofs, water dripping from eaves | Running feet splashing in mud; a foot sweeping hard through a deep puddle; bodies stumbling against a wooden handcart | A big fan of water splashing up and raining down; hollow wooden knock on the cart |
| **V04** | `00:26.7 - 00:29.8` | Video 1, end: Indigo Archer steps in and draws | Steady rain on a muddy village lane and tiled roofs, water dripping from eaves | Firm footsteps into wet mud; slow wooden creak of a bow being drawn | — |
| **V05** | `00:29.8 - 00:38.3` | Video 3 - The Hat-Trick Release: the standoff | Steady rain on a muddy village lane and tiled roofs, water dripping from eaves | Wet cloth shifting; a wooden bow laid down in soft mud; fur brushing a timber railing | — |
| **V06** | `00:38.3 - 00:48.3` | Pick-up 3 - The Held Shoulder | Steady rain on a muddy village lane and tiled roofs, water dripping from eaves | Wet tunic rustling as a shoulder twists; small cloth shoes shuffling through a shallow puddle; drips falling from a hat brim | — |
| **V07** | `00:48.3 - 00:53.2` | Video 4, first part: the boy runs to safety | Steady rain on a muddy village lane and tiled roofs, water dripping from eaves | Quick light footsteps splashing across mud; soft fur rustle on the porch | — |
| **V08** | `00:53.2 - 01:03.2` | Pick-up 1 - The Release | Steady rain on a muddy village lane and tiled roofs, water dripping from eaves | Taut wooden creak of a fully drawn bow; deep twang of the released bowstring | Fast airy hiss of an arrow leaving the bow |
| **V09** | `01:03.2 - 01:08.8` | Pick-up 2 - The Arrow's Flight | Steady rain on a muddy village lane and tiled roofs, water dripping from eaves | — | Thin rising whistle of an arrow through rain; soft flutter of feathers |
| **V10** | `01:08.8 - 01:11.7` | Pick-up 2, end: the arrow flies away | Steady rain on a muddy village lane and tiled roofs, water dripping from eaves | — | Arrow whistle fading into the distance |
| **V11** | `01:11.7 - 01:16.8` | Video 4, second part: the chime ricochet and the topple | Steady rain on a muddy village lane and tiled roofs, water dripping from eaves | Four bodies landing flat in mud with heavy wet splashes; woven hats tumbling | Bright brass bell ring, then a higher silver bell ring; quick metallic ricochet ping; rapid air whooshes |
| **V12** | `01:16.8 - 01:18.3` | Video 3, end: the hat flies off | Steady rain on a muddy village lane and tiled roofs, water dripping from eaves | A woven hat tumbling through the air; small feet ducking away through mud | Sharp zip of an arrow; crisp snap of bamboo fibres |
| **V13** | `01:18.3 - 01:28.3` | Video 5 - Wildflowers and Gratitude | Rain easing to a light drizzle, soft drips from the eaves | Slow footsteps on wet ground; hands clasping; soft rustle of wildflower stems | — |
| **V14** | `01:28.3 - 01:38.3` | Video 6 - The Apple on the Eave | Drizzle stopped, gentle drips from the eaves, light breeze, distant birdsong | Cloth shoe laced and tugged tight; soft fur shifting on roof tiles; a loud crisp crunch of a fresh apple | A single soft sparkle chime |

---

## In-app corrections (Flow Music)

- **Vocals crept in:** retake the movement in the extension (Compose Instrumental is already on). If it repeats, add `Absolutely no human voice of any kind.` to that Sound Box Prompt.
- **Movement 1 too busy over the release (0:53 to 1:03):** add `From 0:53 to 1:02, near-silence: one soft high string note only.` to its Sound Box Prompt and retake.
- **An effect is missing or too loud:** edit that segment's cell in the right column (fewer, clearer sounds), save, and retake that movement in that stem's layer.
- **Music or a melody in an effect stem:** retake it; if it repeats, shorten that movement's cells to plain nouns (`bell ring`, `mud splash`).

---

## Run, verify, and place

1. Check the guide: `node .agents/skills/flow-music-score/scripts/check_score_guide.mjs music-prompts/babu-yeti-and-the-indigo-archer-60s-flow-music.md --audio "/Volumes/eSSD/The Yeti Ways/112326 – Babu Yeti and the Indigo Archer/indigo-archer-reference.wav"` (no `--storyboard`: the cue sheet has one row per edit segment, 14, not one per storyboard video, 6).
2. Generate in the extension's side panel: drop this guide and `indigo-archer-reference.wav` → **Generate & build all 4 stems** → `Downloads/flow-music-score/babu-yeti-and-the-indigo-archer/babu-yeti-and-the-indigo-archer-{music-score,ambience,foley,sfx}.wav`.
3. Verify each stem: `node .agents/skills/flow-music-score/scripts/verify_bed.mjs --bed <stem.wav> --audio "/Volumes/eSSD/The Yeti Ways/112326 – Babu Yeti and the Indigo Archer/indigo-archer-reference.wav"`
4. Premiere Pro: every stem at `00:00:00:00` on its own track (see Stems above), the clips' own audio muted, levels set by ear. If the edit changes, re-export, re-measure, and update the cue sheet's Film Times before generating again.
