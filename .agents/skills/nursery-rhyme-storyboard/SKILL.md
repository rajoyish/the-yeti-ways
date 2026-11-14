---
name: nursery-rhyme-storyboard
description: >-
  Create a Yeti nursery-rhyme storyboard using the user's exact lyrics,
  new AI children's vocals, and Google Flow for both sung music and video.
  Write one 10-second Flow Agent prompt per stanza or whole-line segment,
  with verbatim timed lyrics and off-screen children's singing while visible
  characters act silently. Use for "nursery rhyme", "rhyme video", "turn these
  lyrics into a song", "music video storyboard", "Yeti rhyme", or
  /nursery-rhyme-storyboard. Includes 16:9 and 9:16 cover prompts. Also adds
  silent pick-up shots (`## Pick-up N - <Title>`) to a finished rhyme film for
  the edit: a continuity fix, a missing reaction, or a bridge, cut over the
  song without changing a word of it.
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

## 1. Check inputs and preserve lyrics

- Full lyrics are required. If absent, ask only for them. Never complete a
  familiar rhyme from memory or substitute a different version.
- Audio, links, and tempo references are optional. With lyrics alone, proceed
  with a suitable arrangement and label tempo as proposed. Do not demand audio
  when lyrics are sufficient. Never claim to have heard inaccessible audio.
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

## 2. Arrange the words and time the segments

Split stanzas at the user's blank lines. Note line counts, stresses, rhymes,
repeats, imagery, and emotional progression. Choose meter, tempo, key/register,
phrasing, two to five instruments, and mood. Do not require a different melody
unless requested: a new voice or arrangement does not require new words or tune.
Avoid borrowing a modern recording's distinctive arrangement.

All lead and backing vocals must be newly AI-generated children's voices:
natural child treble, clear diction, light articulation, gentle breath, and
restrained vibrato. No adult lead/backing, voice cloning, or real-singer
impersonation. Use the same child voice, key, melody, tempo, instruments, and
mix across clips. Never remove the children's-voice requirement to avoid a
speculative filter warning.

For an available recording, optionally run
`node .agents/skills/nursery-rhyme-storyboard/analyze_reference.mjs <file> --stanzas N`.
It measures duration and **estimates** tempo with alternatives; it does not
verify meter or bar count. Listen/inspect before claiming musical features.
Never inherit an earlier unsupported "measured BPM" claim during revision.

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
   instruments, vocal character, mood, and low ambient/physical effects.
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

New file: `prompts/<rhyme-title>-<N-times-10>s-storyboard.md`. For requested
revisions, update the named file after saying so. Include, in order:

1. Title/premise: supplied lyrics unchanged, children's vocals, N Flow clips,
   music/video generated together, silent visible cast.
2. `## Song and lyric plan`: source/arrangement analysis distinguishing
   observed, estimated, and proposed values; settings; full verbatim lyrics;
   a sync map showing every line's local and film time. Report splits/fills.
3. Three `## Google Flow Agent instructions` cards with `Reference:` lines.
   Inherit Instruction 1, clarifying its no-dialogue sentence to allow off-screen
   child singing. Instruction 2 summarizes cast, openings, scene breaks, light,
   and shared music/voice. Adapt Instruction 3 for N clips, plate openings at
   scene breaks, exact words, audio checks, and no silent fallback or lyric
   rewrite after refusal. Preserve shared generation approval behavior unless
   generation is already authorized. Writing prompts does not generate clips.
4. `## Agent setup prompt`, `## Image map`, and `## Video N - <Title>` sections,
   each holding only its `Images:` line and full `Agent prompt:` block.
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
- N Video headings, N Images lines, N Agent prompts, N sync-map rows, and N in
  Instruction 3. Contiguous 00:00–00:10 shot/vocal windows and consistent child
  voice, key, meter, tempo, melody, instruments, and mix.
- Every clip requires off-screen children's singing and prohibits on-screen
  performance. No conflicting global no-singing/no-lyrics rule or adult vocal.
- Correct image/reference counts, Character files, plate creation, scene breaks,
  matching end-frame handoffs, and both covers' exact current locks.
- Pick-ups, if any: `node .agents/skills/storyboard-30s/check_pickups.mjs <file>`
  prints `OK`; each is an overlay with no lyrics or singing; Video counts,
  Instruction 3's count, and the file name are unchanged.
- Run `node .agents/skills/storyboard-30s/check_filter.mjs <file>` and read notes
  in context. Generic music-word flags do not authorize changing supplied lyrics
  or suppressing child singing. Report a genuine unresolved conflict.

Link skill/storyboard and state title, musical values and evidence status,
child voice, clip count/duration, splits/fills, and defaults. Name
`/create-flow-assets <storyboard>` for needed plates/supporting cast and report
which Character files/images exist. Generate/review clips in Google Flow with
the cards, setup, and individual prompts; check audible words, diction,
duration, voice/arrangement continuity, joins, and silent visible mouths.
Assemble approved clips in Flow with generated audio intact. Regenerate faulty
takes after applicable authorization; never substitute silence, altered words,
or a required music service. Distinguish written timing targets from actual
audio/video generated and listened to.
