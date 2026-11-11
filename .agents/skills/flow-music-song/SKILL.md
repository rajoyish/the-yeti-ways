---
name: flow-music-song
description: >-
  Write copy-and-paste Google Flow Music prompts for one complete song timed
  to a Yeti nursery-rhyme or music storyboard. Includes exact lyric windows,
  a full-song generation prompt, Compose tab inputs, and in-app correction
  prompts. Saves a guide in music-prompts/. Use for "Flow Music", "make the song",
  "replacement song", "music for the storyboard", or /flow-music-song.
---

# Storyboard to a prompt-only Flow Music song

Write prompts that create **one complete, continuous song in Google Flow Music** matching the storyboard’s lyrics, musical direction, duration and line timing. The deliverable is a concise Markdown guide containing ready-to-paste prompts and verification tables. Do not generate audio or edit the storyboard unless requested.

The normal workflow is: paste the prompt into Google Flow Music (or enter into Compose mode), generate, listen against the review table, request corrections in Flow Music if needed, then download the approved song.

Example structure: `music-prompts/glimmer-glimmer-silver-star-50s-flow-music.md`. Derive each new song’s values from its own storyboard rather than copying numbers from an example.

## How Google Flow Music works and preventing lyric drift

Google Flow Music (`flowmusic.app`, powered by Lyria / Lyria 3.5) uses a conversational AI producer agent to interpret prompts:

1. **Avoid timestamp / line-clock clutter in model prompts:**
   Google Flow Music does not have a parser that binds audio generation to text timestamps (e.g. `00:00.0–00:02.5`). When prompts are filled with dense line-clock pseudo-code, the producer agent misinterprets the text as a thematic script or creative brief rather than literal lyrics. This causes Flow Music to write a completely different song with invented lyrics, titles, and standard pop structures (such as intro vocalises, choruses, bridges, and outros, e.g. "Counting Every Breath").
   - **Do NOT put millisecond line-clock timestamps inside the prompt text sent to the music model.**
   - Put line-by-line timing windows in the **Review & Listening Table** in the guide for the user to verify audio after generation.
   - Describe duration, tempo, meter, and structure in the prompt in clean musical terms (e.g., `Steady 4/4 at 96 BPM, exactly five 10-second verses, total duration ~50 seconds, stop immediately after the final lyric without outro`).

2. **Enforce exact verbatim lyrics:**
   Every prompt must include strict, unambiguous anti-hallucination instructions:
   - `Sing ONLY these exact supplied lyrics word-for-word.`
   - `DO NOT invent, rewrite, summarize, or substitute lyrics.`
   - `DO NOT add an [Intro] vocalise (e.g. "mmm", "la la la"), [Chorus], [Bridge], or [Outro].`
   - `Follow the exact section order: [Verse 1] through [Verse N].`

3. **Provide both Direct Chat and Compose Panel workflows:**
   Google Flow Music supports two creation methods:
   - **Method A — Direct Chat Prompt (All-in-One):** For the main prompt box in a new session. Contains concise musical styling and the verbatim lyric block with strict anti-hallucination rules.
   - **Method B — Compose Panel (Recommended for Exact Lyrics):** The official, most deterministic interface for custom lyrics. Provide:
     - **Sound Prompt:** Genre, tempo, key, instruments, vocal description, and structural pacing.
     - **Lyrics Block:** Verbatim lyrics tagged with `[Verse 1]`..`[Verse N]`, completely free of non-sung instructions or timestamps so Lyria sings only the intended text.

4. **Enforcing Child / Youthful Vocals (Preventing Adult Male Drift):**
   Acoustic arrangements (felt piano, nylon guitar) heavily bias generative AI models toward adult male singer-songwriters (folk/indie baritones). To reliably enforce a young child's voice:
   - Use high-register descriptors: `young child soprano solo`, `youthful boy soprano treble`, `innocent high-pitched child vocal (C5–G5)`.
   - Explicitly forbid adult vocals: `Strictly no adult male voice, no baritone, no mature adult vibrato`.
   - Include an inline vocal performance tag at the top of the lyrics block (e.g. `[Voice: Innocent young child solo, sweet high treble]`).
   - If a solo child voice proves stubborn in a model run, offer a `children's choir` or `school choir singing in gentle unison` alternative, which AI models render with higher consistency.

## Read and reconcile the storyboard

Read the song/lyric plan, verbatim lyric block, sync map, clip durations, shot boundaries, and every video’s `Sound:` and `Vocal timing:` instructions. Resolve inconsistencies from the source; report unresolved conflicts instead of silently choosing new timing. Score-only storyboards get an instrumental prompt with the corresponding musical cues.

Build one internal timing ledger with exact lyric text, verse/clip, local start/end, and absolute song start/end for each line. Absolute time is preceding clips’ total duration plus local time. Preserve intentional rests; do not assume equal line windows or ten-second clips unless specified.

Check musical arithmetic using the storyboard meter and tempo. For 4/4: bar duration = 240 / BPM seconds; bars = song duration × BPM / 240. Validate individual lines, verses and total length, not only the final sum. Do not round away a mismatch.

Preserve the storyboard’s voice, key/register, instruments, melody direction and phrasing. Public-domain lyrics do not automatically require an unmodified traditional arrangement. Compact one-bar phrases must not compete with a longer familiar tune or added refrain. Keep an approved melody when available. Do not invent a final-word hold or a home-note cadence at every cut; finishing by a deadline need not mean holding until it.

Copy supplied lyrics character for character, including unusual wording and punctuation. Pronunciation guidance belongs outside the lyric text. Do not correct, complete, repeat, modernize or replace lines. Preserve the requested child voice; do not silently substitute an adult after a refusal.

## Inspiration and product facts

When supplied, open the inspiration link and record its verified title/channel and URL in a short note. Distinguish metadata from audio actually auditioned or measured. Describe the desired general musical qualities without claiming to have heard an inaccessible recording. The storyboard supplies timing; inspiration must not override it. Keep recording, performer and channel names out of generation prompts; request a new performance rather than imitation of a particular singer or recording.

Check the current official sources when preparing the guide:
- [Get started](https://support.google.com/flow/answer/17083868?hl=en&co=GENIE.Platform%3DDesktop)
- [Create & manage songs](https://support.google.com/flow/answer/17084348?hl=en)
- [Help index](https://support.google.com/flow/?hl=en#topic=16908930)
- [Flow Music](https://www.flowmusic.app/)

Verified features:
- **New session** > prompt > **Send** creates a song via chat.
- **Compose** offers dedicated fields for **Lyrics** and **Sound**, which is the most reliable way to enforce custom lyrics without agent hallucination.
- **Songs** > song > prompt box allows iterative chat revisions.
- **More** > **Download** offers output formats (prefer WAV if available). Recommend Lyria 3.5 if offered.

Exact timing is the generation target. Text prompts cannot guarantee millisecond audio alignment. Use the review table to inspect generated audio. If needed, post-generation alignment or trimming can be verified using `fit_song.mjs`.

## Write a short, usable guide

Save `music-prompts/<storyboard filename without -storyboard.md>-flow-music.md`. Revise an existing file in place when requested.

Use this order:

1. **Title, Purpose & Storyboard Link:** State the song title, film duration, tempo, meter, and key. Link the storyboard and the inspiration track with its verified musical qualities. Include a short diagnostic alert explaining why Flow Music may have previously generated different lyrics (e.g. "Counting Every Breath") and how the new prompt resolves it.
2. **Procedure:** Step-by-step instructions for generating via Direct Chat (Method A) or the Compose Panel (Method B).
3. **Prompt 1 — Direct Chat Prompt (All-in-One):** Clean, self-contained prompt with sound, vocals, structure, anti-rewrite commands, and verbatim lyrics.
4. **Compose Panel Blocks (Method B):**
   - **Sound Box:** Copy-ready prompt containing style, tempo, instruments, and vocal tone.
   - **Lyrics Box:** Clean, copy-ready lyrics tagged with section headers (`[Verse 1]`..`[Verse N]`) and zero instructions/timestamps.
5. **Review & Listening Table:** Table mapping every lyric line to its song window (start–end), verse/video, and exact wording.
6. **In-App Correction Prompts:** Immediate repair prompts for the AI chat:
   - Wrong words / invented song replacement prompt.
   - Unwanted intro / chorus / outro removal prompt.
   - Timing and pacing adjustment prompt.
7. **Optional Verification Helper:** Note explaining how to check leading silence and exact duration on downloaded audio using `fit_song.mjs`.

## Verify before delivery

- Verify that Prompt 1 and the Compose Lyrics block contain the storyboard lyrics character-for-character.
- Confirm that no raw timestamps or line clocks are inside the model prompt blocks, preventing AI lyric hallucination.
- Verify the review table matches the storyboard sync map and total duration.
- Confirm both Direct Chat and Compose workflows are included and clearly labeled.
- Link the changed files and report the intended duration and timing.
