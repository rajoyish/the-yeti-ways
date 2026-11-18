---
name: nursery-rhyme-storyboard
description: >-
  Create a Yeti nursery-rhyme storyboard using the user's exact lyrics,
  new AI children's vocals, and Google Flow for both sung music and video.
  Captures melody, key, meter, and instrumentation by listening to attached
  audio or YouTube video references, and recommends unique instruments
  (such as Nepalese/Himalayan folk instruments or handcrafted acoustic toys)
  to make the song distinctive. Writes one 10-second Flow Agent prompt per stanza
  or whole-line segment, with verbatim timed lyrics and off-screen children's
  singing while visible characters act silently. Use for "nursery rhyme",
  "rhyme video", "turn these lyrics into a song", "music video storyboard",
  "Yeti rhyme", or /nursery-rhyme-storyboard. Asks first whether the film is
  vertical 9:16 or horizontal 16:9. Includes 16:9 and 9:16 cover prompts.
  Also adds silent pick-up shots (`## Pick-up N - <Title>`) to a finished rhyme
  film for the edit: a continuity fix, a missing reaction, or a bridge, cut over
  the song without changing a word of it.
---

# Supplied lyrics to a Google Flow song film

Preserve the user's lyrics and create a new AI vocal rendition. Google Flow
generates video, accompaniment, and children's singing together in each clip.
The singer is off-screen; visible characters act silently. A new rendition
does not mean new lyrics. Do not require a separate music tool or audio overlay.

Read `.agents/skills/storyboard-30s/SKILL.md` in full and its required project
rules; read its `references/cover-images.md` for covers. Inherit its visual
direction, saved Characters, plates, image map, reference budget, continuity,
and covers. This skill overrides its fixed three-video duration, six-beat
clock, no-lyrics endings, and any originality rule that would rewrite supplied
lyrics. Keep these exceptions local; do not change shared storyboard rules.

## 0. Choose the orientation

Before planning, settle the film's orientation as step 0 of `storyboard-30s`
sets out: use it if the request names it (9:16, vertical, Reels, Shorts,
TikTok; or 16:9, horizontal, widescreen, YouTube); keep an existing
storyboard's orientation for a revision or pick-ups; otherwise ask once, "Which
aspect ratio should this film be: vertical 9:16 (Reels, Shorts, TikTok) or
horizontal 16:9 (YouTube, widescreen)?", with the assistant's question tool
where it has one (AskUserQuestion in Claude Code), and wait. Ask it in the same
message as any request for missing lyrics, so the user answers once. Fill in
`<orientation>`, `<Orientation>`, and `<Aspect ratio line>` from the
Orientation part of section 3 of `.agents/rules/google-flow.md` in every card,
plate, and Agent prompt, and compose every shot for that frame.

## 1. Check inputs and preserve lyrics

- Full lyrics are required. If absent, ask only for them. Never complete a
  familiar rhyme from memory or substitute a different version.
- Audio files, video files, YouTube links, and tempo references are optional but
  frequently provided. When an audio file, video, or URL is supplied, **do not
  bypass it or state that listening capability is unavailable**. Follow Section 2
  to audition the audio, analyze its melody, key, tempo, and instrumentation, and
  incorporate verified findings. With lyrics alone, proceed with a proposed
  arrangement suitable for the poetic meter and Yeti world.
- Preserve every word, punctuation mark, line, stanza, repetition, and their
  order, including unusual grammar/spelling. Do not correct, translate,
  paraphrase, omit, add refrains, or insert Yeti names unless explicitly asked.
  Visual Character names never replace lyric nouns.
- Keep a known rhyme's title; a visual subtitle is optional. A revision keeps
  the requested path unless a rename is requested. Say when replacing its file.
- Delimit sung words with `Lyrics to sing verbatim:` and `End lyrics.`. Timing
  labels and headings are instructions, never sung text.
- If supplied words create a genuine content constraint, explain and ask for
  the smallest necessary decision instead of silently rewriting them. Adapt
  visuals safely where that leaves the words intact.

Defaults: Babu Yeti leads when a child viewpoint fits; canonical family;
gentle solo AI child treble for lullabies, a small children's unison group
for brighter songs; immediate vocals and no separate intro/outro. State defaults
in the handoff.

## 2. Listen to reference, capture musical identity, and recommend unique instruments

### 2a. Auditioning audio and YouTube video references

When an audio file, video file, or online video link is provided, inspect and
audition it to capture its musical foundation:

1. **For Local Audio / Video Files:**
   - Use `read_file` to audition and listen directly via multimodal audio processing.
   - Run `node .agents/skills/nursery-rhyme-storyboard/analyze_reference.mjs <file> --stanzas N`
     to extract duration, estimate tempo candidates (BPM), and detect key tonality (Major / Minor).
   - Use `ffprobe` to verify audio duration, metadata tags, and channel layout.
2. **For YouTube / Web Video URLs:**
   - Pass the URL directly to `analyze_reference.mjs <url> --stanzas N` (it downloads
     audio using `yt-dlp` automatically), or run `yt-dlp -x --audio-format mp3 -o "/tmp/yeti_ref_%(id)s.%(ext)s" <url>`
     and then audition the resulting audio with `read_file`.
3. **What to Listen For and Capture:**
   - **Key & Tonality:** Root note and mode (e.g. C Major, G Major, F Major), child vocal register (e.g. C4–D5 or D4–E5 treble).
   - **Melody & Phrasing:** Melodic contour (stepwise, arpeggiated, nursery call-and-response), phrase lengths (e.g. 2 bars per line), cadence resolution, and word stress.
   - **Meter & Rhythm:** Time signature (4/4 walking bounce, 3/4 lullaby waltz, 6/8 swing, 2/4 march), rhythmic groove (straight eighths vs. syncopated bounce), and tempo (BPM).
   - **Existing Instrumentation:** Lead melodic instruments (synth marimba, bells, piano, guitar), harmonic accompaniment, rhythm section, bassline, and incidental sound effects (slide whistles, comical pops).
   - **Vocal Quality & Delivery:** Solo child treble vs. unison children's group, clarity of diction, youthful energy, light breath, restrained vibrato.
   - **Form & Boundaries:** Intro length (if any), verse duration, pauses between stanzas, and outro.

Document these verified musical observations in the storyboard's
`## Song and lyric plan` under `### Reference and arrangement evidence` in a row
named `Auditioned reference analysis`, replacing any generic unverified disclaimers.

---

### 2b. Recommending unique instruments based on melody and instrumentation

Traditional nursery rhyme tracks often suffer from generic synthetic presets
(such as standard General MIDI marimbas, plastic synth pianos, and canned drum loops).
The Yeti Ways films are set in the high Himalayas, celebrating the warmth,
handcrafted play, and natural wonder of the Yeti family.

Always evaluate the source arrangement, identify musical opportunities (such as
introducing organic acoustic warmth, grounding a walking bassline, adding playful
percussive bounce, or weaving lyrical mountain countermelodies), and **recommend
unique complementary instruments**:

#### 1. Himalayan & Nepalese Folk Palette (Connecting Yetis to their indigenous heritage)
- **Madal (मादल, also spelled maadal):** The national percussion instrument of
  Nepal, widely recognized as the rhythmic heartbeat of Nepalese folk music. A
  two-headed barrel wooden hand drum with a warm low bass thump on the left head
  (*Bāyāñ*) and a crisp, ringing harmonic slap on the right head (*Dhyān/Dāyāñ*)
  treated with black iron-filing paste (*khari*). It provides an organic, earthy
  walking pulse that replaces mechanical beats and grounds the rhyme without
  overwhelming delicate child voices.
- **Bansuri (बाँसुरी):** Traditional Nepalese bamboo transverse flute. Weaves airy,
  lyrical countermelodies and gentle mountain ornamentation between vocal phrases,
  evoking Himalayan breezes.
- **Tungna / Sarangi (टुङ्ना / सारङ्गी):** Traditional Nepalese plucked wooden lute
  (*Tungna*) or carved bowed folk fiddle (*Sarangi*). Adds intimate, rustic mountain
  string timbre and sweet melodic warmth.
- **Murchunga (मुर्चुङ्गा):** Traditional Nepalese jaw harp. Delivers playful,
  bouncing, mouth-resonant twangs, ideal for countdown drops, comical hops, or
  quirky character reactions.
- **Tibetan Singing Bowls (सिङ्गिङ बोल) & Tingsha Cymbals:** Resonant tuned brass
  harmonics and delicate bell chimes, perfect for bedtime lullabies, starry skies,
  and gentle transition cues.

#### 2. Tactile Handcrafted Acoustic Palette (Reflecting the Yeti craft terrace)
- **Kalimba (Thumb Piano) & Glockenspiel:** Clear, bell-like wooden droplet notes
  and crystalline chimes that double child-friendly melodic hooks.
- **Pizzicato Cello & Upright Bass:** Plucky, bouncy wooden bass articulation that
  gives walking rhythms acoustic warmth.
- **Felt / Upright Piano:** Warm, muted hammer-strike tones that offer cozy,
  reassuring harmony.
- **Accordion / Melodica:** Breathable acoustic reed chords that sustain harmonies
  organically without synth harshness.

#### 3. Selection & Integration Rules
- **Defined Musical Role:** The recommended unique instrument must serve a clear
  function (e.g. *Rhythmic Heartbeat*, *Melodic Counterpoint*, or *Atmospheric Texture*).
- **Voice-Forward Mix:** It must never mask or compete with the children's voices.
- **Explicit Documentation:** Document the instrument in:
  1. The storyboard's `## Song and lyric plan` table with a dedicated row
     (e.g. `Madal feature (Nepali folk percussion)`).
  2. The Master Agent Card (Instruction 2).
  3. Every clip prompt's `Sound:` line with its specific playing character
     (e.g. `...and Madal (Nepalese two-headed folk hand drum providing an organic rhythmic heartbeat)...`).

---

### 2c. Arrange the words and time the segments

Split stanzas at the user's blank lines. Note line counts, stresses, rhymes,
repeats, imagery, and emotional progression. Choose meter, tempo, key/register,
phrasing, two to five instruments (including the recommended unique instrument),
and mood. Do not require a different melody unless requested: a new voice or
arrangement does not require new words or tune. Avoid borrowing a modern
recording's distinctive arrangement.

All lead and backing vocals must be newly AI-generated children's voices:
natural child treble, clear diction, light articulation, gentle breath, and
restrained vibrato. No adult lead/backing, voice cloning, or real-singer
impersonation. Use the same child voice, key, melody, tempo, instruments, and
mix across clips. Never remove the children's-voice requirement to avoid a
speculative filter warning.

Default to one stanza per 10-second clip. Calculate
`BPM = 60 × main pulses per segment / 10`; four bars of 4/4 give 16 pulses and
96 BPM. Four lines can use one bar each, starting at 00:00, 00:02.5, 00:05,
00:07.5. This is compact proposed phrasing, not a verified reference arrangement
or a guarantee that Flow will hit every timestamp.

Keep diction intelligible. If a stanza cannot fit comfortably, split at a
whole-line boundary into further 10-second clips, preserve all words/order,
and report the new duration. Respect a requested duration when feasible;
explain a genuine conflict rather than cutting words. Fill short segments by
sustaining an existing syllable or accompaniment, never adding/repeating words.
Do not force an arbitrary tempo tolerance at the expense of intelligibility.

With L lines, line k starts at `(k - 1) × 10 / L`; half-line points fall midway.
Plan 3–6 shots on these boundaries, 4–8 visual beats, one readable action per
beat, and cuts on musical pulses. Each clip uses its own 00:00–00:10 clock;
film duration is N × 10 seconds. `create-3x2-timed-image` has a different fixed
six-beat clock and does not directly apply.

## 3. Cast and direct the lyric story

Make pictures answer the supplied words line by line. Reuse supporting cast
names/files in `prompts/characters/`. Old Herb-Gatherer may portray "the traveler"
without changing the sung noun. Ordinary stars/objects need no Character unless
personified. Never rename the canonical Yetis or add another Yeti.

Keep a Yeti in every video and its emotional turn in a Yeti Close-Up/Medium
Close-Up. Inherit expression wording, five-fingered hands, height relationships,
back-fur reminders, shot coverage, and reference limits. Let the rhyme determine
the arc; do not force danger or an action-film climax into a lullaby.

End-frame openings match the previous held picture, pose, faces, and first-shot
light. New location/time opens on its plate and is listed as a scene break in
Instruction 2. If words recall night after a sunrise stanza, identify the recap
and use a night plate rather than implying continuous time.

## 4. Include singing in every Flow Agent prompt

Keep the inherited first line, format/style lock, `Cast:`, `Setting:`, and
shot lines with a held final picture. Then include, in order:

1. `Sound:` requiring Flow to generate accompaniment and off-screen AI
   children's singing together with this video; repeat meter, BPM, key,
   the full instrument ensemble (including the recommended unique instrument and
   its acoustic role), vocal character, mood, and low ambient/physical effects.
2. `Vocal timing:` mapping every line to its local time window, clear diction,
   exact words once, immediate entry, no added vocalizations, and final words
   completed within the clip. Audio/melody continuity is a target to verify.
3. `Lyrics to sing verbatim:`, that segment's unchanged lines, then `End lyrics.`
4. `Performance:` the singer is off-screen and unrelated to visible mouths;
   visible cast holds closed mouths/still expressions and never sings, hums,
   chants, mouths words, or lip-syncs. No spoken dialogue or narration.
5. `Avoid:` the locked scene-level avoid line from prompt-assembly.md, then
   `, on-screen text, captions, borders, split screens, on-screen singing,
   lip-syncing, rhythmic mouth movements, adult vocals, added or altered words.`

Never use `Sound: no music.`, a global `No singing`/`No lyrics`, a prohibition
on putting lyrics in prompts, or instructions to add music later. The silent
performance rule applies only to visible characters. Each prompt contains its
own stanza and full arrangement, not the entire song or an external music
prompt. Allow roughly 300–1000 words including audio and lyrics as needed.
Do not invent automatic voice-locking or audio-reference features. If the
current Flow interface cannot preserve audio continuity, report that limitation
instead of promising a seamless result or silently changing the workflow.

## 5. Write the file

New file: `prompts/<rhyme-title>-<N-times-10>s-storyboard.md`, or
`prompts/<rhyme-title>-<N-times-10>s-16x9-storyboard.md` for a horizontal film. For requested
revisions, update the named file after saying so. Include, in order:

1. Title/premise: supplied lyrics unchanged, children's vocals, N Flow clips
   in the film's orientation, music/video generated together, silent visible cast.
2. `## Song and lyric plan`:
   - `### Reference and arrangement evidence` table: source/arrangement analysis
     distinguishing observed, estimated, and proposed values; when an audio or
     video reference was provided, include the `Auditioned reference analysis` row
     with verified key, tempo, melody, and instruments; include a dedicated row
     for the recommended unique instrument (e.g. `Madal feature (Nepali folk percussion)`)
     detailing its acoustic role and cultural significance; settings;
   - `### Supplied lyrics — verbatim`: full verbatim lyrics block;
   - `### Sync map`: a sync map showing every line's local and film time. Report splits/fills.
3. Three `## Google Flow Agent instructions` cards with `Reference:` lines.
   Inherit Instruction 1, clarifying its no-dialogue sentence to allow off-screen
   child singing. Instruction 2 summarizes cast, openings, scene breaks, light,
   and shared music/voice (including the recommended unique instrument). Adapt
   Instruction 3 for N clips, plate openings at scene breaks, exact words,
   audio checks, and no silent fallback or lyric rewrite after refusal. Preserve
   shared generation approval behavior unless generation is already authorized.
   Writing prompts does not generate clips.
4. `## Agent setup prompt`, `## Image map`, and `## Video N - <Title>` sections,
   each holding only its `Images:` line and full `Agent prompt:` block with complete
   `Sound:` line naming all instruments.
5. `## Cover image` and `## Cover image - 9:16 vertical`: current full canonical
   locks, exact @ names, story-specific compositions, no text, and truthful
   reference availability. Covers stay outside the video continuity chain.

Keep existing project clip model/settings without claiming they are verified
current specifications. No required external music prompt, audio overlay, or
external editing step. Write long files in batches if needed; never substitute
"same as Video N" for a full prompt.

## 5a. Pick-up shots

When the user asks for pick-ups (a missing shot, a missing reaction, a
cutaway, a bridge, or B-roll) after the clips are made, read
`.agents/skills/storyboard-30s/references/pickup-shots.md` and follow it. Add
each as `## Pick-up <n> - <Title>` after the last video and before the covers,
with its `Pick-up:` line, `Images:` line, `Agent prompt:` block, Image map row,
and one Instruction 2 sentence. In a song film every pick-up is an **overlay**:
its picture replaces a stretch of one clip's picture while that clip's sung
audio plays on, so the song's words, order, and length never change. Its
`Sound:` line is the same accompaniment (tempo, key, instruments) with no
singing; it has no `Vocal timing:`, `Lyrics to sing verbatim:`, or
`Performance:` line, every mouth stays closed, and its avoid line adds
`, talking, moving mouths, singing`. The sync map and the lyric checks count
the numbered videos only.

## 6. Verify and hand off

Apply storyboard-30s checks with the duration, clock, audio, cards, and word-count
exceptions above, then check:

- Compare the canonical lyric block to user input exactly, normalizing line
  endings only. Extract each clip's delimited lyrics and join in order; compare
  to the input, allowing only documented whole-line split stanza boundaries.
  No missing, added, reordered, corrected, or unintended repeated line.
- When an audio or video reference was provided, verify that the storyboard's
  reference table records verified audition findings (key, tempo, phrasing,
  instrumentation, vocal style) and never a generic "unverified listening limit"
  disclaimer.
- Verify that a unique complementary instrument (e.g. Madal, Bansuri, Tungna,
  Sarangi, Murchunga, Kalimba) was recommended based on the musical analysis,
  documented with its acoustic role in the reference table, and included in
  Instruction 2 and in every video's `Sound:` block.
- N Video headings, N Images lines, N Agent prompts, N sync-map rows, and N in
  Instruction 3. Contiguous 00:00–00:10 shot/vocal windows and consistent child
  voice, key, meter, tempo, melody, instruments, and mix.
- Every clip requires off-screen children's singing and prohibits on-screen
  performance. No conflicting global no-singing/no-lyrics rule or adult vocal.
- One orientation throughout: every first line, format line, plate line,
  Instruction 1, and Instruction 3 say the film's, the other orientation appears
  only in the cover sections, and the file name has `-16x9-` exactly when the
  film is horizontal.
- Correct image/reference counts, Character files, plate creation, scene breaks,
  matching end-frame handoffs, and both covers' exact current locks.
- Pick-ups, if any: `node .agents/skills/storyboard-30s/check_pickups.mjs <file>`
  prints `OK`; each is an overlay with no lyrics or singing; Video counts,
  Instruction 3's count, and the file name are unchanged.
- Run `node .agents/skills/storyboard-30s/check_filter.mjs <file>` and read notes
  in context. Generic music-word flags do not authorize changing supplied lyrics
  or suppressing child singing. Report a genuine unresolved conflict.

Link skill/storyboard and state title, orientation, musical values, verified
audition findings, recommended unique instruments and their musical roles,
child voice, clip count/duration, splits/fills, and defaults. Name
`/create-flow-assets <storyboard>` for needed plates/supporting cast and report
which Character files/images exist. Generate/review clips in Google Flow with
the cards, setup, and individual prompts; check audible words, diction,
duration, voice/arrangement continuity, joins, and silent visible mouths.
Assemble approved clips in Flow with generated audio intact. Regenerate faulty
takes after applicable authorization; never substitute silence, altered words,
or a required music service. Distinguish written timing targets from actual
audio/video generated and listened to.
