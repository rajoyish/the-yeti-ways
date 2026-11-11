# Glimmer, Glimmer, Silver Star — 50-second Flow Music prompt

Create **one complete 50-second song** in [Google Flow Music](https://www.flowmusic.app/) using the prompts below. Its timing and structure follow [the storyboard](../prompts/glimmer-glimmer-silver-star-50s-storyboard.md): five 10-second verses, four lines per verse, one 2.5-second bar per line, steady 4/4 at 96 BPM. Total duration: 20 bars × 4 beats × 60 / 96 = **50.0 seconds**.

Inspiration: [Twinkle Twinkle Little Star — Super Simple Songs](https://www.youtube.com/watch?v=yCjJyiqpAuU). The creative direction is a tender, peaceful acoustic children's bedtime lullaby with soft felt piano, warm nylon guitar fingerpicking, delicate music box glockenspiel chimes, and a sweet, natural young child's treble vocal.

> [!IMPORTANT]
> **Enforcing a Child's Vocal (Preventing Adult Male Drift):**
> Acoustic guitar and felt piano often trick AI music models into defaulting to an adult male folk/indie singer-songwriter (baritone). To force Google Flow Music to produce a genuine young child's voice:
> 1. Use high-register vocal tags: `young child soprano solo`, `youthful boy soprano treble`, `delicate high-pitched child voice`.
> 2. Add explicit negative constraints: `Strictly no adult male, no baritone, no mature vibrato, no deep voice`.
> 3. Include the inline voice tag `[Voice: Innocent young child solo, sweet high treble]` inside the Lyrics field.

---

## 1. How to create the song in Flow Music

Google Flow Music offers two reliable workflows. **Method B (Compose Panel)** is recommended for 100% lyric and vocal fidelity:

### Method A — Direct Chat Prompt (New Session)
1. Open [Flow Music](https://www.flowmusic.app/) and select **New session**.
2. Paste the entire block from **Prompt 1 (Method A)** into the prompt box and select **Send**.
3. Select Lyria 3.5 if offered in the model selector.

### Method B — Compose Panel (Recommended for Exact Lyrics & Child Voice)
1. In Flow Music, start a session or select **Compose** on a track.
2. Under the **Sound** tab/box, paste the **Compose — Sound Prompt** block.
3. Under the **Lyrics** tab/box, paste the **Compose — Lyrics** block.
4. Select **Generate**.

---

## Prompt 1 (Method A) — Direct Chat Prompt

Paste this entire block into the prompt box:

```text
CRITICAL INSTRUCTION: The lead vocal MUST be a genuine young child's voice (sweet, innocent boy soprano or young girl treble in a high register C5–G5). Strictly NO adult male voice, NO baritone, NO tenor, and NO mature adult vibrato. Sing ONLY the exact lyrics provided under [Lyrics] word-for-word without adding an intro vocalise, chorus, bridge, or ad-libs.

Sound & Style: Gentle acoustic children's bedtime lullaby, warm, comforting, calm and full of quiet wonder. Steady 4/4 meter at 96 BPM in C major.
Instrumentation: Soft felt piano, warm nylon-string acoustic guitar picking, and delicate music box glockenspiel chimes. Very quiet, tender accompaniment under the vocal.
Voice: Solo young child treble voice, innocent, sweet, clear English diction, light breath, high-pitched youthful soprano. No adult vocals whatsoever.
Arrangement & Structure: Exactly 5 continuous short verses (20 bars total, ~10 seconds per verse, total duration ~50 seconds). Fast, compact lullaby phrasing without long pauses. No intro, no chorus between verses, no instrumental interludes, no bridge. Sing continuously from Verse 1 through Verse 5, and resolve the final word naturally, ending all sound cleanly at ~50 seconds without an extended outro.

Lyrics:
[Voice: Innocent young child solo, sweet high treble]
[Verse 1]
Glimmer, glimmer, silver star,
Lighting mountains from afar!
High above the snowy crest,
Shining down to guide our rest.

[Verse 2]
When the golden sun descends,
And the busy daylight ends,
Then you shine your quiet light,
Glimmer, glimmer through the night.

[Verse 3]
Down along the forest trail,
Through the quiet snowy vale,
Travelers will find their way,
Guided by your gentle ray.

[Verse 4]
Through the linen curtains wide,
Watching from the mountain side,
Keeping guard until the dawn,
When the cold and dark are gone.

[Verse 5]
Thank you for your gentle spark,
Guiding safely through the dark,
Glimmer, glimmer, star so bright,
Bless our happy home tonight.
```

---

## Method B — Compose Panel Inputs

### Compose — Sound Prompt
Paste into the **Sound** / **Style** field:

```text
Gentle acoustic children's bedtime lullaby, steady 4/4 at 96 BPM, C major. Soft felt piano, nylon-string acoustic guitar picking, and delicate music box glockenspiel chimes. Vocals: Genuine young child treble voice, sweet innocent high-pitched boy soprano (register C5–G5), clear English diction, quiet and tender bedtime delivery. Strictly NO adult male voice, NO baritone, and NO mature vibrato. Exactly 5 continuous short verses, ~10 seconds per verse, ~50 seconds total duration. Strictly no intro vocalise, no chorus, no bridge, no instrumental solos, and no outro.
```

### Compose — Lyrics
Paste into the **Lyrics** field:

```text
[Voice: Innocent young child solo, sweet high treble]
[Verse 1]
Glimmer, glimmer, silver star,
Lighting mountains from afar!
High above the snowy crest,
Shining down to guide our rest.

[Verse 2]
When the golden sun descends,
And the busy daylight ends,
Then you shine your quiet light,
Glimmer, glimmer through the night.

[Verse 3]
Down along the forest trail,
Through the quiet snowy vale,
Travelers will find their way,
Guided by your gentle ray.

[Verse 4]
Through the linen curtains wide,
Watching from the mountain side,
Keeping guard until the dawn,
When the cold and dark are gone.

[Verse 5]
Thank you for your gentle spark,
Guiding safely through the dark,
Glimmer, glimmer, star so bright,
Bless our happy home tonight.
```

---

## 2. In-App correction prompt (For your existing track)

If you already have a generated track in Flow Music where the singer is an adult male (like `glimmer.mp3`), you do not need to restart from scratch. Select that song in Flow Music and paste this correction prompt into its chat box:

```text
The current singer is an adult male baritone. Change the lead vocal to a sweet, genuine 7-year-old child's voice (innocent young treble / boy soprano in a high pitch register C5–G5). Absolutely NO adult male voice, NO baritone, and NO mature vibrato. Keep the exact same 5 verses, the same acoustic instruments, and the 50-second duration.
```

---

## 3. Alternative: Youthful Children's Choir

If the AI model continues to struggle with a solo child voice, changing to a **Children's Choir** is the most reliable way in AI music generation to eliminate adult voices:

### Sound Prompt for Children's Choir:
```text
Gentle acoustic bedtime lullaby, steady 4/4 at 96 BPM, C major. Soft felt piano, nylon-string acoustic guitar, and delicate music box glockenspiel. Vocals: Sweet, angelic children's choir (youthful school choir, young kids singing together in gentle unison, high treble voices). Strictly no adult voices. Exactly 5 continuous short verses, ~50 seconds total duration, no intro, no chorus, no outro.
```

---

## 4. Review and timing check

| Line | Song window | Verse / Video | Exact lyric | Syllables |
| --- | --- | --- | --- | :---: |
| 1 | 00:00.0–00:02.5 | Verse 1 (Video 1) | Glimmer, glimmer, silver star, | 7 |
| 2 | 00:02.5–00:05.0 | Verse 1 (Video 1) | Lighting mountains from afar! | 7 |
| 3 | 00:05.0–00:07.5 | Verse 1 (Video 1) | High above the snowy crest, | 7 |
| 4 | 00:07.5–00:10.0 | Verse 1 (Video 1) | Shining down to guide our rest. | 7 |
| 5 | 00:10.0–00:12.5 | Verse 2 (Video 2) | When the golden sun descends, | 7 |
| 6 | 00:12.5–00:15.0 | Verse 2 (Video 2) | And the busy daylight ends, | 7 |
| 7 | 00:15.0–00:17.5 | Verse 2 (Video 2) | Then you shine your quiet light, | 7 |
| 8 | 00:17.5–00:20.0 | Verse 2 (Video 2) | Glimmer, glimmer through the night. | 7 |
| 9 | 00:20.0–00:22.5 | Verse 3 (Video 3) | Down along the forest trail, | 7 |
| 10 | 00:22.5–00:25.0 | Verse 3 (Video 3) | Through the quiet snowy vale, | 7 |
| 11 | 00:25.0–00:27.5 | Verse 3 (Video 3) | Travelers will find their way, | 7 |
| 12 | 00:27.5–00:30.0 | Verse 3 (Video 3) | Guided by your gentle ray. | 7 |
| 13 | 00:30.0–00:32.5 | Verse 4 (Video 4) | Through the linen curtains wide, | 7 |
| 14 | 00:32.5–00:35.0 | Verse 4 (Video 4) | Watching from the mountain side, | 7 |
| 15 | 00:35.0–00:37.5 | Verse 4 (Video 4) | Keeping guard until the dawn, | 7 |
| 16 | 00:37.5–00:40.0 | Verse 4 (Video 4) | When the cold and dark are gone. | 7 |
| 17 | 00:40.0–00:42.5 | Verse 5 (Video 5) | Thank you for your gentle spark, | 7 |
| 18 | 00:42.5–00:45.0 | Verse 5 (Video 5) | Guiding safely through the dark, | 7 |
| 19 | 00:45.0–00:47.5 | Verse 5 (Video 5) | Glimmer, glimmer, star so bright, | 7 |
| 20 | 00:47.5–00:50.0 | Verse 5 (Video 5) | Bless our happy home tonight. | 7 |

---

## 5. Audio verification and fitting helper (Optional)

Once an approved take is downloaded, verify its leading silence and exact duration:

```bash
node .agents/skills/flow-music-song/fit_song.mjs "<path-to-downloaded-song.wav>" --duration 50
```

To trim leading silence automatically and export a fitted 50.0-second WAV ready for video editing:

```bash
node .agents/skills/flow-music-song/fit_song.mjs "<path-to-downloaded-song.wav>" --duration 50 --offset auto --out "fitted-glimmer-star-50s.wav" --split 5 --split-dir "split-clips/"
```
