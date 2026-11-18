# Humpty Dumpty — 220-second Flow Music Prompt

Create **one complete 220-second (03:40) continuous nursery rhyme song** in [Google Flow Music](https://www.flowmusic.app/) using the prompts below. Its timing, lyrics, and 22-video visual structure follow [the storyboard](../prompts/humpty-dumpty-220s-16x9-storyboard.md): 11 stanzas counting down from ten to zero, two 10-second videos per stanza (4 lines per 20 seconds, exactly two 2.5-second bars per line), steady 4/4 meter at 96 BPM in C major. Total duration: 88 bars × 4 beats × 60 / 96 = **220.0 seconds (03:40)**.

Inspiration track: `/Users/rajoyish/Downloads/Humpty Dumpty Nursery Rhyme - 3D Animation English Rhymes for children.mp3` by CVS 3D Rhymes & Kids Songs (148.9s). Auditioned and verified qualities: bouncy 4/4 walking pulse at ~92–96 BPM in bright C major; clear, youthful child soprano lead; upbeat mallets (marimba/xylophone), pizzicato strings, glockenspiel chimes, light wood percussion, and whimsical cartoon sound accents.

---

### The Madal (मादल) — Indigenous Nepalese Folk Percussion Heartbeat

To honor the Himalayan origin of the Yeti family, this arrangement integrates the **Madal** (also spelled *maadal*), the national percussion instrument of Nepal, widely celebrated as the rhythmic heartbeat of Nepalese folk music.

- **Dual-Headed Design:** Carved from a hollowed wooden log, the Madal features two distinct drumheads wrapped in double-layered goat skin, each weighted with a central black tuning paste (*khari*, made of iron filings, soot, and starch):
  - **Left Head (*Bāyāñ*):** Larger, delivering a warm, deep, resonant woody bass thump that grounds the walking pulse.
  - **Right Head (*Dhyān/Dāyāñ*):** Smaller, high-tuned, producing crisp, singing rim slaps and open metallic ringing tones (*Ta*, *Tin*).
- **Acoustic Function in Humpty Dumpty:** The Madal serves as the gentle, organic acoustic engine of the track. It blends seamlessly with the upright piano, pizzicato cello, wooden block percussion, and glockenspiel, providing buoyant rhythmic forward motion and cultural authenticity while remaining tenderly balanced beneath the young children's singing.

> [!IMPORTANT]
> **Enforcing Young Child Vocals & Preventing Model Drift:**
> 1. Generative AI music models often default to adult folk/indie singer-songwriters (baritone/tenor) when paired with acoustic instruments. To enforce a natural child treble voice, prompts use high-register descriptors: `young child soprano solo`, `school children's choir in gentle unison`, `youthful high-pitched treble (C5–G5)`.
> 2. Negative constraints explicitly forbid adult voices: `Strictly NO adult male voice, NO baritone, NO mature adult vibrato`.
> 3. The inline tag `[Voice: Sweet young children's group in unison, high treble soprano]` is placed at the top of the lyrics block.
> 4. To prevent lyric hallucination (such as invented chorus refrains or pop filler), **no raw timestamps or line-clocks are included inside the model prompts**. Exact timing is tracked via the Review & Listening Table below.

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
CRITICAL INSTRUCTION: The lead vocal MUST be a genuine young children's group singing in gentle unison (or a sweet, innocent young child soprano treble in register C5–G5). Strictly NO adult male voice, NO baritone, NO tenor, and NO mature adult vibrato. Sing ONLY the exact lyrics provided under [Lyrics] word-for-word without adding an intro vocalise, chorus, bridge, ad-libs, or spoken counting.

Sound & Style: Gentle, bouncy acoustic children's nursery rhyme, warm, cheerful, and full of playful counting joy. Steady 4/4 meter at 96 BPM in C major.
Instrumentation: Madal (the national percussion instrument of Nepal, a two-headed folk hand drum providing an organic rhythmic heartbeat with warm low bass thumps and crisp ringing rim slaps), upright piano, pizzicato cello, wooden block percussion, and delicate glockenspiel chimes. Very clean, bouncy, voice-forward acoustic accompaniment.
Voice: Small young children's choir in gentle unison, sweet, innocent, clear English diction, light breath, high-pitched youthful child treble. No adult vocals whatsoever.
Arrangement & Structure: Exactly 11 continuous 4-line counting verses (88 bars total, ~20 seconds per 4-line verse, total duration ~220 seconds / 03:40). Phrasing is steady and compact (2 bars per line). Sing continuously from Verse 1 through Verse 11 in numerical sequence without an intro, without a chorus between verses, without instrumental solo interludes, and without a bridge. Resolve cleanly on the final word "again" at ~220 seconds without an extended outro.

Lyrics:
[Voice: Sweet young children's group in unison, high treble soprano]
[Verse 1]
Ten Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 2]
Nine Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 3]
Eight Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 4]
Seven Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 5]
Six Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 6]
Five Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 7]
Four Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 8]
Three Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 9]
Two Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 10]
One Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 11]
No Humpty Dumpty sat on a wall,
No Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Didn't put Humpty together again.
```

---

## Method B — Compose Panel Inputs

### Compose — Sound Prompt
Paste into the **Sound** / **Style** field:

```text
Gentle acoustic children's nursery rhyme, steady 4/4 at 96 BPM, C major. Madal (Nepalese two-headed folk hand drum, rhythmic heartbeat with warm low bass thumps and crisp high ringing head slaps), upright piano, pizzicato cello, wooden block percussion, and delicate glockenspiel chimes. Vocals: Genuine young children's choir in gentle unison, sweet innocent high-pitched child treble (register C5–G5), clear English diction, playful bedtime nursery delivery. Strictly NO adult male voice, NO baritone, and NO mature vibrato. Exactly 11 continuous 4-line countdown verses, ~20 seconds per verse, ~220 seconds total duration. Strictly no intro vocalise, no chorus, no bridge, no instrumental solos, and no extended outro.
```

### Compose — Lyrics
Paste into the **Lyrics** field:

```text
[Voice: Sweet young children's group in unison, high treble soprano]
[Verse 1]
Ten Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 2]
Nine Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 3]
Eight Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 4]
Seven Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 5]
Six Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 6]
Five Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 7]
Four Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 8]
Three Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 9]
Two Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 10]
One Humpty Dumpty sat on a wall,
One Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Couldn't put Humpty together again.

[Verse 11]
No Humpty Dumpty sat on a wall,
No Humpty Dumpty had a great fall.
All the king's horses and all the king's men
Didn't put Humpty together again.
```

---

## Review & Listening Table

Use this table to check line alignment and song timing after generating in Flow Music. Every video corresponds to 10 seconds (two 5-second lyric phrases):

| Video | Film Window | Stanza / Half | Exact Lyric Line | Target Song Window |
| :--- | :--- | :--- | :--- | :--- |
| **Video 1** | 00:00–00:10 | Verse 1 (A) | Ten Humpty Dumpty sat on a wall,<br>One Humpty Dumpty had a great fall. | 00:00.0–00:05.0<br>00:05.0–00:10.0 |
| **Video 2** | 00:10–00:20 | Verse 1 (B) | All the king's horses and all the king's men<br>Couldn't put Humpty together again. | 00:10.0–00:15.0<br>00:15.0–00:20.0 |
| **Video 3** | 00:20–00:30 | Verse 2 (A) | Nine Humpty Dumpty sat on a wall,<br>One Humpty Dumpty had a great fall. | 00:20.0–00:25.0<br>00:25.0–00:30.0 |
| **Video 4** | 00:30–00:40 | Verse 2 (B) | All the king's horses and all the king's men<br>Couldn't put Humpty together again. | 00:30.0–00:35.0<br>00:35.0–00:40.0 |
| **Video 5** | 00:40–00:50 | Verse 3 (A) | Eight Humpty Dumpty sat on a wall,<br>One Humpty Dumpty had a great fall. | 00:40.0–00:45.0<br>00:45.0–00:50.0 |
| **Video 6** | 00:50–01:00 | Verse 3 (B) | All the king's horses and all the king's men<br>Couldn't put Humpty together again. | 00:50.0–00:55.0<br>00:55.0–01:00.0 |
| **Video 7** | 01:00–01:10 | Verse 4 (A) | Seven Humpty Dumpty sat on a wall,<br>One Humpty Dumpty had a great fall. | 01:00.0–01:05.0<br>01:05.0–01:10.0 |
| **Video 8** | 01:10–01:20 | Verse 4 (B) | All the king's horses and all the king's men<br>Couldn't put Humpty together again. | 01:10.0–01:15.0<br>01:15.0–01:20.0 |
| **Video 9** | 01:20–01:30 | Verse 5 (A) | Six Humpty Dumpty sat on a wall,<br>One Humpty Dumpty had a great fall. | 01:20.0–01:25.0<br>01:25.0–01:30.0 |
| **Video 10** | 01:30–01:40 | Verse 5 (B) | All the king's horses and all the king's men<br>Couldn't put Humpty together again. | 01:30.0–01:35.0<br>01:35.0–01:40.0 |
| **Video 11** | 01:40–01:50 | Verse 6 (A) | Five Humpty Dumpty sat on a wall,<br>One Humpty Dumpty had a great fall. | 01:40.0–01:45.0<br>01:45.0–01:50.0 |
| **Video 12** | 01:50–02:00 | Verse 6 (B) | All the king's horses and all the king's men<br>Couldn't put Humpty together again. | 01:50.0–01:55.0<br>01:55.0–02:00.0 |
| **Video 13** | 02:00–02:10 | Verse 7 (A) | Four Humpty Dumpty sat on a wall,<br>One Humpty Dumpty had a great fall. | 02:00.0–02:05.0<br>02:05.0–02:10.0 |
| **Video 14** | 02:10–02:20 | Verse 7 (B) | All the king's horses and all the king's men<br>Couldn't put Humpty together again. | 02:10.0–02:15.0<br>02:15.0–02:20.0 |
| **Video 15** | 02:20–02:30 | Verse 8 (A) | Three Humpty Dumpty sat on a wall,<br>One Humpty Dumpty had a great fall. | 02:20.0–02:25.0<br>02:25.0–02:30.0 |
| **Video 16** | 02:30–02:40 | Verse 8 (B) | All the king's horses and all the king's men<br>Couldn't put Humpty together again. | 02:30.0–02:35.0<br>02:35.0–02:40.0 |
| **Video 17** | 02:40–02:50 | Verse 9 (A) | Two Humpty Dumpty sat on a wall,<br>One Humpty Dumpty had a great fall. | 02:40.0–02:45.0<br>02:45.0–02:50.0 |
| **Video 18** | 02:50–03:00 | Verse 9 (B) | All the king's horses and all the king's men<br>Couldn't put Humpty together again. | 02:50.0–02:55.0<br>02:55.0–03:00.0 |
| **Video 19** | 03:00–03:10 | Verse 10 (A) | One Humpty Dumpty sat on a wall,<br>One Humpty Dumpty had a great fall. | 03:00.0–03:05.0<br>03:05.0–03:10.0 |
| **Video 20** | 03:10–03:20 | Verse 10 (B) | All the king's horses and all the king's men<br>Couldn't put Humpty together again. | 03:10.0–03:15.0<br>03:15.0–03:20.0 |
| **Video 21** | 03:20–03:30 | Verse 11 (A) | No Humpty Dumpty sat on a wall,<br>No Humpty Dumpty had a great fall. | 03:20.0–03:25.0<br>03:25.0–03:30.0 |
| **Video 22** | 03:30–03:40 | Verse 11 (B) | All the king's horses and all the king's men<br>Didn't put Humpty together again. | 03:30.0–03:35.0<br>03:35.0–03:40.0 |

---

## In-App Correction Prompts

If Flow Music deviates during a session, paste the corresponding repair prompt into the track's chat box:

### Correction 1 — Adult Voice or Wrong Style Replacement
```text
The current generation uses an adult voice. Please regenerate with genuine young children singing in gentle unison (high treble C5–G5 soprano). Remove any adult male or female vibrato. Keep the acoustic instrumentation light: Madal (Nepalese folk hand drum with gentle low bass thumps and crisp high rim taps), upright piano, pizzicato cello, wooden block percussion, and glockenspiel.
```

### Correction 2 — Wrong Lyrics or Hallucinated Refrain
```text
The vocal added words that are not in the prompt. Please regenerate and sing ONLY the exact provided lyrics word-for-word from [Verse 1] through [Verse 11]. Strictly DO NOT add an intro vocalise, chorus, bridge, or spoken counting.
```

### Correction 3 — Timing, Pacing, and Madal Balance
```text
Maintain a steady 4/4 meter at exactly 96 BPM. Ensure the Madal provides a steady, gentle heartbeat pulse throughout the entire 220 seconds without overpowering the delicate children's voices. End the music cleanly on the final word "again" at ~220 seconds without an extended outro.
```

---

## Verification Helper

After downloading the approved WAV/MP3 file from Google Flow Music:
1. Check leading silence and exact duration:
   ```bash
   node .agent/skills/flow-music-song/fit_song.mjs music-prompts/humpty-dumpty-220s-16x9.wav 220.0
   ```
2. If there is leading silence before the first word, trim it to start precisely at 00:00.0.
3. Import the song into your NLE (Adobe Premiere Pro) and align it with the 22 video clips (each clip = exactly 10.0 seconds).
