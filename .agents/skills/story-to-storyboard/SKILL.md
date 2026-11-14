---
name: story-to-storyboard
description: >-
  Turn a user's draft story (a fable, folk tale, bedtime story, or any plot in
  prose) into a full-length Yeti storyboard of as many 10-second Google Flow
  Agent video prompts as the story needs, with off-screen narration, spoken
  dialogue, a designed music score, and sound effects. The Yetis are always the
  heroes; every character of the draft is recast as a new, different character
  in stylized 3D CGI. Use for "turn this story into a storyboard", "make a film
  from my story", "story with narration and dialogue", "adapt this fable",
  or /story-to-storyboard. Includes 16:9 and 9:16 cover prompts. Also saves
  the full adapted story, retold in prose with the new cast, in `stories/` for
  later reference. Also adds
  pick-up shots (`## Pick-up N - <Title>`) to a finished film for the edit:
  a continuity fix, a missing reaction, or a bridge between two scenes. Use
  for "pick-up", "pickup shot", "missing shot", or "bridge these videos".
  Also makes the film to recorded audio (section 9): from a `stories/` file
  voiced in Google AI Studio (story-full.wav), one 10-second Flow clip per
  10 seconds of that audio, every narrated event enacted at the moment it is
  narrated, every line lip-synced at its recorded time, and the Flow audio
  replaced by the AI Studio audio in the edit. Use for "video from the
  audio", "make the film to the narration", "sync the videos to the AI
  Studio audio", "audio storyboard", or a story file plus its story-full.wav.
---

# Draft story to a narrated, spoken Yeti film

This skill adapts a draft story into a film of N videos, each exactly 10 seconds, where N is whatever the whole story needs. Each video is one `Agent prompt:` block for Google Flow (Omni 1.2 Flash), generated with sound: background music, sound effects, an off-screen Narrator, and characters who speak their lines on screen. Papa Yeti, Mama Yeti, and Babu Yeti are always the heroes. No character of the draft appears in the film: each one is recast as a new character of a different kind.

Read `.agents/skills/storyboard-30s/SKILL.md` in full, the rules it lists (`.agents/rules/character-consistency.md`, `prompt-assembly.md`, `cinematic-direction.md`, `google-flow.md`, and the `social-media-prompt-creator` skill), its "Keeping clear of Flow's filters" section, and its `references/cover-images.md`. Use everything they set out: saved Characters and `@` names, the style lock, the avoid line, the expression table, Character names for the story cast, coverage and staging, beats on the fixed clock, light and effects, end-frame handoffs, scene breaks, plates, the Image map and `Images:` lines, the 7-reference budget, the three instruction cards, covers, and the verification checklist. This skill overrides only what follows: the fixed number of videos, the plot clock across the film, the no-dialogue rule and its `Sound:` ending, Instruction 1's and Instruction 3's wording about dialogue, the word count of an Agent prompt, and the casting of a source story. Keep these exceptions local to this skill and to the films it writes; never edit the shared rules to match them.

The reference output is `prompts/babu-yeti-sour-mango-trick-150s-storyboard.md`, made from a fox-crow-monkey fable: match its sections, its `Voices:` and `Speech:` lines, and its script table.

**Two ways to make the film.** Sections 1 to 8 make a **Flow-voiced film**: the storyboard writes a short script, and Flow speaks it in each clip. Section 9 makes an **audio-first film**: the whole story in `stories/` is voiced in Google AI Studio first (`/ai-studio-tts` and the AI Studio Voice Runner extension), and the film is cut to that recording: the audio sets the number of clips, every clip's words and times, and where its shots cut, and the AI Studio audio replaces Flow's in the edit. Use section 9 whenever the user has, or plans, the AI Studio audio of the story, or asks for the narration and dialogue of the story file itself; otherwise sections 1 to 8. Section 9 reuses sections 3 to 6 except where it says otherwise.

## 1. Read the draft and recast it

Take the draft as pasted text or a file path. Before writing, record in your working notes every character (named, unnamed, groups, and any narrator voice), every place, every prop, every event in order, every quoted line, the moral or point of the story, and the ending. Nothing on that list is dropped: the film keeps every event of the draft, in the same order.

Then build the **cast map**: one row per draft character, giving its role in the plot (hero, helper, rival, the one who is tricked, bystander) and who plays it in the film.

1. **The Yetis are the heroes.** The characters the story is about and the audience roots for (the one with the idea, the one who acts, the one who learns) are played by Yetis. Choose by role: a small, young, clever, or curious hero is Babu Yeti; a strong, steady, fatherly, or elder hero is Papa Yeti; a caring, wise, motherly, or patient hero is Mama Yeti. Two heroes who are friends or partners can be two Yetis. At least one Yeti is in every video, and the main emotional turn belongs to a Yeti, in a Close-Up or Medium Close-Up.
2. **A Yeti never plays the villain, the fool, or the one who loses.** The rival, the bully, the selfish one, the one who is tricked, and the bystanders are story cast. When the draft has more heroes than the three Yetis, the extra heroes become story cast allies. When it has fewer, the remaining Yetis may join as family where the story is stronger for it (often in the ending), never as filler, and never as a fourth Yeti.
3. **Never the same character as the draft.** Every draft character is replaced by a new character of a different kind: a different species for an animal, a different trade, age, or kind for a human, and a new invented design for a creature. The film contains none of the draft's species or character types anywhere, not as a lead, a group, or a background extra, and none of its names. A fox fable has no fox in it. Keep the role's job in the plot: whoever owned the tree in the draft still lives in a tree, and whoever flew still has a way to travel. Quoted lines that name a draft character ("Brother Monkey") are rewritten with the new Character name.
4. **Any character Flow allows, in stylized 3D CGI.** The story cast may be humans, real-world animals, or creatures you invent, all drawn in the same stylized 3D animated style as the Yetis, as original designs (section 6 and section 10 of `prompt-assembly.md`): never photoreal, never a real person's likeness, never an existing film, game, or mascot design. Prefer a world that suits the Yetis (Himalayan forests, valleys, villages, snowfields) unless the draft's place is part of its point. Reuse a file in `prompts/characters/` when one fits the role and is not one of the draft's kinds; otherwise choose a new Character name that no file there uses.
5. **Heroes stay heroes.** The Yetis may be clever, cheeky, and playful, and they may outwit a bully, but they are never cruel, never mocking someone weaker, and never win by greed. When the draft's heroes win by a trick or a lie, keep the trick (it is the fun of the story), give it a reason that helps others (hungry neighbours, a shared place), and add one closing beat in which a Yeti turns toward kindness: sharing, inviting, apologising, or forgiving. The moral is spoken once, by the Narrator, in the last video.
6. **Fill what the draft forgot.** A prose draft leaves out what a film must show: where the heroes come from, why they want what they want, the light and time of day, how a character leaves and returns, and an ending picture. Add these from the story's own world, never a new problem, location, or character that changes the plot. Turn anything the safety filter would refuse (harm, weapons, a child in peril, cruelty) into effort, worry, and comedy, as the storyboard-30s filter section sets out.

Write the cast map, the list of changes and additions, and the moral into the file's `## Story adaptation` section (step 5), so the user can see every recasting decision. The full converted story itself is written as its own file in `stories/` (step 5a).

## 2. Plan the film: as many videos as the story needs

There is no fixed length. Count the videos from the story:

- One video per event that needs its own picture: an arrival, a plan, a question and its answer, a toss and a taste, a temper, a departure, a feast. A draft paragraph is usually one or two videos.
- Speech sets a floor. A video holds at most about 22 spoken words in all (section 3), so a stretch of dialogue that runs longer is split over more videos, never squeezed.
- Each video still has six beats on the fixed clock of `cinematic-direction.md` section 6 (`00:00`, `00:01.5`, `00:03`, `00:05`, `00:07`, `00:08.5`, `00:10`), cut into three to six shots. Do not pad a video with extra beats to make it longer, and do not crowd two events into one video to make the film shorter.
- No upper limit. When the count passes 30 videos (five minutes), tell the user the count and the running time with the handoff; do not cut story to stay under it.

The film follows the six plot stages in order, spread over the film by the story rather than by a fixed clock:

| Part of the film | Stage | What it does |
| --- | --- | --- |
| First 10 to 15 percent | Exposition | The place, the heroes, the normal, opened by the Narrator |
| Next 5 to 10 percent | Inciting Incident | The one event that breaks normal |
| Up to about two thirds | Rising Action | The plan, the attempts, the complications |
| Around two thirds | Climax | The point of highest tension, decided by what a Yeti does or causes; its peak lands at the end of a beat inside one video |
| Most of the rest | Falling Action | The consequences and the loose threads |
| Last one or two videos | Resolution | The new normal, the kindness beat, and the Narrator's moral, ending on a held picture |

Nothing after the Climax video introduces a new problem, and nothing before it resolves the main one. Give each video a short title (`## Video 7 - Papa Agrees`), chosen once and never changed. The film's position of each video, its stage, and its plan stay in your notes and in Instruction 2, never under a heading or inside an Agent prompt; every Agent prompt runs on its own `00:00` to `00:10` clock.

Plan the light, the effects, and the music across the whole film (step 4) before writing the first prompt, and keep the reference budget: at most 3 linked Characters per video (every `@` name in its `Cast:` line, the Yetis in the video always first) and at most 7 references (those Characters plus its images). Story cast beyond the 3 Character slots is described-only in that video, as storyboard-30s sets out; never unlink a Yeti to make room for a speaking story cast member. The Narrator is a voice, not a Character, and uses no reference.

## 3. Narration and dialogue

This skill overrides the project's no-dialogue rule (section 5 of `cinematic-direction.md`, rule 8 of section 8 of `prompt-assembly.md`, and the `No dialogue, no lyrics.` ending in storyboard-30s) for the films it writes. Flow generates the voices together with the picture, music, and sound in each clip, so every spoken word is in that clip's Agent prompt.

**The script.**

- Write the lines in plain, warm, simple English for a young global audience: short sentences, everyday words, one idea per line. Keep the draft's best lines and catchphrases, adapted to the new names and trimmed to fit the time; never add a joke that undercuts the mood. Speech is in US English unless the user asks for another language.
- The **Narrator** is an off-screen storyteller and never appears. Use narration where a picture alone cannot carry the story: the opening ("Once upon a time..."), a jump in time or place, what a character secretly thinks or plans, and the moral at the end. Usually one Narrator line at most per video (the first and last videos may have two), and many videos have none: the characters and pictures carry the story.
- **Dialogue** belongs to the characters on screen. A Yeti speaks in its own voice; story cast speak only when the role needs words, and animals that do not speak in the story make their own sounds (a bleat, a squeak), written in the `Sound:` line.
- Inside the quotation marks, a character may call another by the short name people would say aloud ("Kobi", "Papa"); everywhere outside the quotes (shot lines, `Cast:`, `Voices:`, speaker labels, Instruction 2) the full Character name is used, spelled exactly as section 6 of `prompt-assembly.md` sets out.
- Nothing is ever sung, and no line quotes a song, a film, or a real person. No insult beyond a gentle, silly one ("phooey", "too sour"), no threat, and no word from the risk families in the filter section.

**Timing**, on each clip's own clock:

- Each line has a time window. The first word starts no earlier than `00:00.5` and the last ends by `00:09.5`, so a cut between clips never clips a word.
- Speak at a natural pace: at most about 2.8 words per second of the window (a 10-word line needs about 3.5 seconds), and at most about 22 spoken words per video in all.
- One voice at a time: windows never overlap, and leave a small gap between lines.
- An **on-screen** line sits wholly inside one shot whose `In frame:` list names the speaker, framed at a Medium Shot or closer with the face turned toward the camera at least three-quarters, and the beat in that shot line says the character speaks ("Babu Yeti whispers up to Papa Yeti"). A line heard while the speaker is out of frame is **off-screen**, and every mouth in that shot stays closed. Narration is always off-screen and may run across a cut.
- Faces still come from the expression table in section 4 of `prompt-assembly.md`; speaking only adds mouth movement in time with the words. A character with a "mouth closed" expression who speaks in that shot uses the expression's eyes and brows and an open, talking mouth.

**Voices.** Give every speaker one voice description, chosen once for the film: its pitch, warmth, pace, and manner, in plain words (`a small, bright, high little voice, quick and eager, with a giggle in it`). Never "sounds like", "in the voice of", or any actor, singer, or character. A voice description never contains a semicolon. The same words, letter for letter, go into the `## Voice cast` table, every `Voices:` line, and the voice of each saved Character (Flow's "Select a voice" on the Character screen, closest match). Babu Yeti's voice is small and young; it never says "child" or "kid".

**In the Agent prompt**, three lines carry the sound, after the shot lines and before `Avoid:`, plus one line after `Setting:`:

- `Voices:` straight after `Setting:`, listing only the speakers in this video in order of first line: `Voices: Narrator (off-screen, never shown): <voice>; Babu Yeti: <voice>; Papa Yeti: <voice>.`
- `Speech:` after the last shot line: every line in time order as `<start>-<end>, <Speaker>, <on screen or off-screen><, manner such as whispering>: "<exact words>"`, then the fixed sentence `Each line is spoken once, exactly as written, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.`
- `Sound:` the music state and instruments shot by shot, the ambient bed, a sound for each action and each visible effect, the music `kept low under every spoken line`, and the ending `No lyrics, no singing, no other voices.` A video with no speech has no `Voices:` or `Speech:` line, and its `Sound:` ends `No dialogue, no lyrics.`
- `Avoid:` the avoid line from section 5 of `prompt-assembly.md`, then `, on-screen text, captions, subtitles, borders, split screens, moving mouths on characters who are not speaking, overlapping voices, singing.`

An Agent prompt is about 400 to 1100 words with its speech. Captions or subtitles, if the user wants them, are added in the edit from the script table, never in Flow.

## 4. Music and sound effects

Design the score for this story as section 5 of `cinematic-direction.md` sets out, and plan it across the whole film in your notes before writing:

- A palette of two to five instruments chosen for the story's world and mood. In a long film, give each hero or the main rival a short motif on one instrument (a bamboo flute for Babu Yeti's idea, a bassoon for the grumpy rival), and bring a new instrument in only on a story beat (warm strings for the kindness beat).
- How the music moves: which instruments lead in which videos, where it builds to the Climax, the one beat where it stops, how it resolves in the last video. The music at each handoff is the same on both sides of the cut.
- The ambient bed of each location, and the materials of the action sounds (leaves, wood, fruit, grass, stone), each described from scratch: the soft thud of a ripe mango landing in grass, never a stock effect name.
- Comic beats get comic sound in plain words (a low wobbling bassoon note as a face puckers), never a named effect.
- Under speech, the music drops low and no effect covers a word; between lines it can rise.

Summarise the palette, the motifs, and the arc in Instruction 2.

## 5. Write the file

Save to `prompts/<kebab-case-title>-<N × 10>s-storyboard.md` (a 15-video film is `-150s-storyboard.md`). Lead the title with the Yeti who carries the story (`Babu Yeti and the Sour Mango Trick`). Never overwrite an existing file without saying so.

The file holds, in order:

1. `# <Title> <N × 10>s Storyboard`, then a premise paragraph (what happens, the tone, the moral), then a paragraph saying it is N videos of 10 seconds with narration, dialogue, music, and sound effects generated in Flow, and that the saved Characters carry every look, then the line `Adapted story: [stories/<kebab-case-title>-story.md](../stories/<kebab-case-title>-story.md)`.
2. `## Story adaptation`: the cast map as a table (`| Draft character | Role in the plot | Film character | Why |`), the Narrator as a row, then a short list of what was changed or added and why, and the moral in one sentence.
3. `## Voice cast`: a table (`| Speaker | Voice | Where it is set |`) with each speaker's voice description, letter for letter as in the `Voices:` lines, and where the voice is set (the saved Character's voice, or "every Voices line" for the Narrator).
4. `## Script`: a table (`| Video | Clip time | Film time | Speaker | Line |`) of every spoken line in film order, the line in double quotes, word for word as in the `Speech:` lines. Film time is the clip time plus `(N - 1) × 10` seconds, written `m:ss.s`. It is the record for captions and for checking takes.
5. `## Google Flow Agent instructions`: the three cards of section 5 of `google-flow.md`, with these changes:
   - Instruction 1: word for word, except that `with music and sound effects and no dialogue` becomes `with music, sound effects, and only the narration and dialogue my prompt writes, word for word`, and the orientation is the film's.
   - Instruction 2: written for this film, under about 250 words: premise and tone; the Yetis and story cast by Character name, with their videos and roles; the Narrator as an off-screen voice; the location(s) and their videos; each opening image (Video 1 on its plate, each later video on `End frame V<N-1>` unless it is a scene break); the light arc; the music palette, motifs, and arc; the key props; the Climax video; and any likely filter trigger with its fallback.
   - Instruction 3: word for word with N filled in, plus this paragraph after its first paragraph: `Each prompt's Voices line gives each speaker's voice, the same in every video. Its Speech line gives every spoken word, who says it, and when, on the clip's own clock. Speak each line once, exactly as written, in English, one voice at a time, with the music kept low under it. The Narrator is an off-screen voice and never appears. Only the speaking character's mouth moves, and only while it is in frame. Never add words, voices, or singing that the prompt does not write.` In its last paragraph, `keeps the timestamps, the names, the setting, the beats, the light, and the music` becomes `keeps the timestamps, the names, the setting, the beats, the light, the music, and the spoken lines`, and `on-screen text, dialogue, or an effect that reads as harm` becomes `on-screen text, a spoken line that reads as a threat or an insult, or an effect that reads as harm`.
6. `## Agent setup prompt`, `## Image map`, and one `## Video N - <Title>` section per video holding only its `Images:` line and its `Agent prompt:` block, as storyboard-30s sets out. The Agent prompt's lines, in order: the first line, the format line with the style lock, `Cast:`, `Setting:`, `Voices:` (if the video has speech), the shot lines, `Speech:` (if any), `Sound:`, `Avoid:`.
7. `## Cover image` and `## Cover image - 9:16 vertical`, from `references/cover-images.md`: the film's comic or emotional hook, full current locks for each visible Yeti, the story cast's descriptions, no text, and a truthful `Cover references:` line.

Vertical 9:16 is the default; a horizontal film is made only when the user asks, and then every card and prompt says horizontal 16:9 as `prompts/yeti-plateau-cup-300s-storyboard.md` does. Write a long file in parts if needed, but every Agent prompt is complete: never "same as Video N".

## 5a. Write the adapted story

Alongside the storyboard, save the full converted story as a separate file, so the user can reread, reuse, or rework the story later without the prompt material around it. Save it to `stories/<kebab-case-title>-story.md`, using the same `<kebab-case-title>` as the storyboard but no duration and no orientation (one story serves the 150s storyboard and its `-16x9-` version alike). Create `stories/` if it does not exist. If the file already exists, say so and ask before overwriting; when the storyboard is a new version of the same story, update the story to match it.

The file holds, in order:

1. `# <Title>`, the same title as the storyboard without the duration, then one italic line: `Adapted from the user's draft for the storyboard [prompts/<storyboard file>](../prompts/<storyboard file>).` Name every storyboard file of this story (both orientations) when there is more than one.
2. `## Cast`: one line per character in the film, Yetis first, each as `**<Character name>**: <who they are in the story, in a sentence>`, plus the Narrator. Film character names only.
3. `## Story`: the whole converted story, retold as warm, readable prose for a young audience, in the film's order and with the film's cast, places, props, and additions. It follows the videos from first to last and leaves out nothing that happens on screen, and it adds nothing the film does not show or say. Every spoken line in the `## Script` table appears in the story in double quotes, word for word, spoken by the same character (the Narrator's lines become the storyteller's own sentences, quoted or woven in, with their words kept). Use paragraphs, not video headings, timestamps, shot types, camera, sound, or any Flow wording. It ends with the moral, word for word as the Narrator speaks it.
4. `## Moral`: the moral in one sentence, the same as in `## Story adaptation`.
5. `## Original draft`: the user's draft exactly as given, unedited, in a `text` code block, so the source stays on record beside the adaptation. This is the only place in the story file where the draft's species, character types, and names may appear.

Pick-ups do not change the story file, unless a pick-up adds a spoken line; then add that line to the story where it plays in the edit.

## 5b. Pick-up shots

When the user asks for pick-ups (a missing shot, a missing reaction, a cutaway, a bridge, or B-roll) after the videos are made, read `.agents/skills/storyboard-30s/references/pickup-shots.md` and follow it. Add each as `## Pick-up <n> - <Title>` after the last video and before the covers (`## Pick-up 1 - Kobi's Search` in `prompts/babu-yeti-sour-mango-trick-150s-16x9-storyboard.md`), with its `Pick-up:` line, `Images:` line, `Agent prompt:` block, Image map row, and one Instruction 2 sentence. The file name, the title's length, N in Instruction 3, and every film time in `## Script` stay those of the numbered videos. A pick-up carries no narration or dialogue unless the user asks for a line; then it is an insert, its `Voices:` and `Speech:` lines follow section 3, and its Script row goes after every video's rows with `Pick-up <n>` in the Video column and `in the edit` as the film time. A pick-up laid over a clip whose words keep playing is an overlay, with no speech and every mouth closed.

## 6. When a clip is refused

Follow the storyboard-30s filter section and the retry list in section 4 of `google-flow.md`, with one change: the spoken lines are part of the story, so a retry never removes them silently. Try, one change at a time: (1) shorten the `Sound:` line to `Soft background music, kept low under the voices. No lyrics, no singing, no other voices.`, keeping `Voices:` and `Speech:`; (2) remove the effect wording; (3) cut each shot to its main physical action; (4) reword the one spoken line the Agent names as the trigger, keeping its meaning, and change the `## Script` table to match; (5) move an on-screen line off-screen. Tell the user which line changed. Record the trigger and its fallback in Instruction 2.

## 7. Verify before finishing

Run every check in step 7 of storyboard-30s, reading "three videos" as N videos and "3" in Instruction 3 as N, with the exceptions above (the `Sound:` ending, the word count, Instruction 1 and 3 wording). Then check:

- [ ] The cast map covers every draft character; no draft species, character type, or name appears anywhere in the film (`grep -i` each one: only the `## Story adaptation` table may contain them); every hero role is a Yeti; no Yeti plays the villain, the fool, or the loser; only the three Yetis appear.
- [ ] Every event of the draft is in the film, in order; additions only deepen it; the moral is spoken once by the Narrator in the last video.
- [ ] N `## Video` headings, N `Images: attach` lines, N `Agent prompt:` lines, and N in Instruction 3; the file name ends `-<N × 10>s-storyboard.md`.
- [ ] Every video has a Yeti shot, three to six shots on the beat boundaries, at most 3 linked Characters with every Yeti in the video among them, and at most 7 references; the Climax sits around two thirds of the film.
- [ ] Every spoken word is in a `Speech:` line and in the `## Script` table, identical in both; every speaker is in that video's `Voices:` line with the voice from `## Voice cast`, word for word.
- [ ] `node .agents/skills/story-to-storyboard/check_speech.mjs <file>` prints `OK`: windows inside `00:00.5` to `00:09.5`, no overlaps, at most about 2.8 words per second and 22 words per video, every on-screen line inside a shot whose `In frame:` names the speaker, the Narrator always off-screen, voices identical across videos, script table matching.
- [ ] `node .agents/skills/storyboard-30s/check_filter.mjs <file>` prints `OK`, and every `Note:` was read and the beat changed or judged clear.
- [ ] Pick-ups, if any: `node .agents/skills/storyboard-30s/check_pickups.mjs <file>` prints `OK`, `check_speech.mjs` covers their speech, and the N counts above count `## Video` sections only (`Images: attach` and `Agent prompt:` lines count N plus the pick-ups).
- [ ] Both covers pass the cover guide.
- [ ] `stories/<kebab-case-title>-story.md` exists and links the storyboard, and the storyboard links it back; its `## Story` covers every video in order; every line of `## Script` appears in it word for word with the same speaker; its moral matches the Narrator's; no draft species, character type, or name appears in it outside `## Original draft`, and that section is the draft exactly as given.

## 8. Hand off

Link the storyboard file and the adapted story file in `stories/`, and state: the title, N videos and the running time, the cast map in one line, what was added to the draft and why, the voices, and the music palette. List each story cast member with whether it already has a file in `prompts/characters/`, and say that `/flow-character-builder <this storyboard>` builds the rest under exactly those names, taking each voice from the `## Voice cast` table, and that `/create-flow-assets <this storyboard>` makes the plates and the cast images. Say the clips are generated in Flow from this file: the three cards and the setup prompt once, then one Agent prompt per video with the images its `Images:` line names, checking each take for the spoken words, lip-sync on the right character only, the voice matching earlier clips, and the music low under speech. Distinguish what was written from what was generated: writing prompts never generates a clip or proves a voice.

## 9. Audio-first film: the picture made to the recorded story

The story file in `stories/` is the script, word for word, and its Google AI Studio recording is the clock. Every clip is exactly 10 seconds and covers its own 10 seconds of that recording, so the film is as long as the audio and nothing in the narration or dialogue is cut, skipped, stretched, or rewritten. Flow still generates each clip with speech, because its mouths move only to speech it generates itself; that speech is written to match the recording word for word and second for second, and the recording replaces Flow's audio in the edit.

**What can and cannot be synchronised** (checked 2026-11-14). Flow cannot take an audio file as an ingredient: its asset picker holds images, videos, voices, Characters, and avatars, and Omni 1.2 Flash makes its lip movement from the speech it generates (Google's API notes: no audio references in the current version). Flow's **Voices** are 30 of the same Gemini voices AI Studio uses (Iapetus, Erinome, Puck, Kore, Gacrux, Fenrir, ...; not the newer ones such as Riko, Zeno, or Cruz). So lip sync is made, not guaranteed: same words, same times, same voice, a speaker framed close only while it speaks, and a preview of every take against the recording before it is approved (step 5). Where a line still drifts, the take is regenerated, never re-timed: every clip stays exactly 10 seconds.

### Step 1 - Voice the story

1. `/ai-studio-tts <story file>` writes `speech-prompts/<slug>-speech-blocks.md`: narration in the Narrator's voice, each quoted line its own block, the Yetis on their fixed voices (Iapetus, Erinome, Puck), the Narrator on Charon by default, every other speaker on one of the 30 Google Flow voices in `.agents/skills/ai-studio-tts/references/voices.md`.
2. In the AI Studio Voice Runner side panel, load that file, tick **One speech block per run** (exact time for every line, and no run can skip words), generate every part, and join. The takes folder `Downloads/speech-takes/<slug>/` then holds `story-full.wav`, `story-manifest.json`, and `parts/`. Listen to `story-full.wav` once through for the words.

An existing recording made without that option works too (the line times are then matched from its pauses, step 2).

### Step 2 - Build the film's timeline

```text
node tools/ai-studio-voice-runner/film-audio.mjs --blocks speech-prompts/<slug>-speech-blocks.md --audio <takes>/story-full.wav
```

It keeps `story-full.wav` exactly as it is and writes:

- `speech-prompts/<slug>-film-timeline.md` and `.json`: the audio's length and the number of clips N (its length divided by 10, rounded up), every block and sentence at its time, a copy-ready `## Script` table, and per clip a copy-ready `Speech:` line and its **cut points** (the pauses inside the clip).
- `<takes>/clips/clip-NN.wav` (each clip's 10 seconds of the recording) and `<takes>/lines/<block>-<speaker>.wav` (each spoken line on its own).

Lip sync rests on the line times, so check them before writing: play each file in `lines/` against the timeline's **Line check** table. Every file must hold exactly its line, first word to last, in its speaker's voice. Matching by pauses can place an excited or very short line one phrase early or late inside a long take (2026-11-14: one line of 27 in the first two-coins recording). Write the true start of any wrong line, in seconds of the recording, into `speech-prompts/<slug>-timing-fixes.json` (`{ "B029": 370.69 }`), run the command again, and listen again. With **One speech block per run** and its `story-manifest.json`, every line is anchored to its own take and nothing needs fixing.

`--fit-lines` (with `--takes <folder>`) builds a new master, `story-film.wav`, that lengthens the pause before any spoken line that would cross a cut (at most 2.5 s, never a word), so every line sits inside one clip. It changes the running time by those pauses, so use it only when the user prefers it to the reaction-shot handling below.

### Step 3 - Plan the film from the timeline

Sections 1 and 2 are replaced: the story is already cast (its `## Cast`) and already in order, and the number of videos is the timeline's N, never chosen. Video N covers film time `(N - 1) × 10` to `N × 10` seconds. Read the story file and the whole timeline first, and plan in your notes:

- **Scenes and places.** Which clips each location of the story holds, each one's plate (`Plate - <Location>`; reuse the plates and `Setting:` sentences of an earlier storyboard of the same story, word for word), and the scene breaks, where the narration jumps in place or time.
- **What each clip shows.** Every sentence in a clip's `Speech:` line is a beat the picture **enacts while it is spoken**: the shot on screen from that sentence's start to its end shows the event, action, emotion, or reaction it narrates, done by the characters it names, never a character merely standing in frame. "Mama Yeti looked across at the grand house and sighed" (`00:03.8-00:07.4`) is a shot in that window of Mama Yeti turning to look across at the grand house and sighing, with no talking mouth. Narration of a place ("Behind his whitewashed wall stood a grand painted house") is a shot of that place. A narrated thought ("Blue Magpie thought, I'll trick him!") is a close shot of the thinker's face showing it, mouth closed. A sentence that runs on across a cut is enacted on both sides of it, the second clip continuing the action from the first clip's end frame.
- **Feeling and light** follow the story's own words (worried, determined, afraid, relieved), with the expression table of section 4 of `prompt-assembly.md`, and the light arc of the story's times of day.
- **Music.** Plan the score as section 4 sets out, but Flow's music is removed with its voices, so the final film's music is a separate bed laid in the edit (`assemble.mjs --bed`). Keep each clip's `Sound:` line short and low under the speech: it guides Flow's pacing, not the final mix.

### Step 4 - Write the storyboard

Save to `prompts/<slug>-<N × 10>s-storyboard.md`, its title `# <Title> <N × 10>s Storyboard`, with the sections of section 5 in its order, these changes applying:

- The opening paragraphs say the film is cut to the AI Studio recording (`story-full.wav`, its length), link the story file, the speech-blocks file, and the timeline, and say the Flow audio is replaced by the recording in the edit. `## Story adaptation` is replaced by one paragraph naming the story file as the script.
- `## Voice cast`: `| Speaker | Voice | AI Studio voice | Flow Character voice |`. The Voice column is the plain-words description used in every `Voices:` line (section 3 rules); the AI Studio voice is the speech-blocks file's; the Flow Character voice is that same voice when it is In Flow (set it on the saved Character's "Select a voice"), otherwise the closest In Flow voice by description, pitch, and gender. The Narrator has no Character.
- `## Script`: the timeline's `## Script` table, copied as it is.
- **Instruction 1**: as section 5 writes it. **Instruction 3**: as section 5 writes it, with N filled in, except that its added paragraph is: `This film is cut to a recorded narration and dialogue that will replace each video's sound. Each prompt's Speech line gives every recorded word and its exact time on the clip's own clock. Speak each line exactly then, exactly as written, in English, one voice at a time, with the music kept low. The Narrator is an off-screen voice and never appears; while the Narrator speaks, every mouth on screen stays closed, and the picture shows what the narration says as it is said. Only a character whose own line is being spoken moves its mouth, only during that line, and only while it is in frame. Never add words, voices, or singing that the prompt does not write.`
- **Each video's Agent prompt** follows section 3 and `google-flow.md` section 6, except:
  - **Shots cut on the audio, not on the fixed beat clock.** Three to six shots from `00:00` to `00:10`, each at least 1.5 seconds. Cut on one of the clip's cut points (rounded to a tenth of a second) or a sentence's start where one fits; under narration a cut may also fall mid-sentence, on the picture the words reach. A cut never falls inside an on-screen spoken line. The shot lines' timestamps use those times (`00:00-00:03.8`, `00:03.8-00:07.9`).
  - **Yetis in every stretch.** A clip whose narration is wholly about a place or the story cast may have no Yeti, but never two such clips in a row: give the second a Yeti watching or reacting (a Close-Up on the porch looking up at the grand house), as section 8 rule 10 of `cinematic-direction.md` wants.
  - **The `Speech:` line is the timeline's line for that clip, copied as it is**, its fixed sentence included (`... at exactly these times, ...`). Never rewrite, shorten, merge, or re-time an entry; a fragment that continues from the last clip or runs on into the next is spoken as the fragment it is.
  - **On-screen lines.** An entry marked `on screen` sits wholly inside one shot whose `In frame:` names the speaker, who is framed Medium Close-Up or Close-Up, face toward the camera at least three-quarters, still (no walking, no turning away) for the whole line, and the shot's beat says the character speaks, with its manner from the story (`Mama Yeti looks across at the grand house and says, with a sigh, ...`). That shot starts at least 0.3 seconds before the line (or at `00:00` when the line continues from the last clip) and runs past its end where the cut points allow. Everyone else in the shot keeps a closed mouth.
  - **A line crossing a cut** (`off-screen, over a reaction shot` in the timeline): in the clip holding the smaller share, the shot under that fragment shows the listener reacting, or the place, with the speaker out of frame; in the other clip the speaker is on screen as above. This is how a film cuts across a line, and it keeps every lip-synced word inside one generated clip.
  - **Narration.** Narration entries are `off-screen`, the Narrator in the `Voices:` line; no shot shows a mouth moving under them.
  - **The handoff.** The first shot of each clip continues the picture and action of the previous clip's end frame, especially when a narrated sentence runs across the cut; a scene break follows the narration's jump.
  - **A cut at the handoff.** When a clip must open on a different subject from the previous clip's end frame (a line crossing the cut: the reaction shot on one side, the speaker on the other), the cut between the two clips is that cut. Its first line then uses `End frame V<N-1>` and the location's plate together as references for the place, light, and positions, and says the video opens on a new shot, never that its first frame matches the end frame: `Generate it in Reference-to-Video (R2V, Ingredients) mode, never First Frame (I2V) mode: use the images End frame V<N-1> and Plate - <Location> and every @ Character in the Cast line together as references for the place, the light, and where everyone is, and open on the new shot the first shot line describes, a cut away from End frame V<N-1>.` Its `Images:` line and Image map row list both images.
  - **The last clip.** Its speech ends before `00:10`; its last shot holds the story's ending picture from the end of the speech. The film is cut at the recording's end (`assemble.mjs`), or held a little longer with `--tail`.
- Covers, the setup prompt, the Image map, the `Images:` lines, the Character and reference budgets, and the filter rules are unchanged.

A film of more than about 6 videos is written in batches of about 6, in order, each batch checked before the next (step 6, with `--partial`), until all N are written. Never write "same as Video N".

### Step 5 - Generate, preview, and assemble

Generate each clip as `google-flow.md` sets out. Download each approved take into one folder, named as the Agent names it (`V7 - <title> - take 2.mp4`). Before approving a take, preview it with its recording:

```text
node tools/ai-studio-voice-runner/assemble.mjs --timeline speech-prompts/<slug>-film-timeline.json --clips <folder> --preview 7
```

Watch `previews/V07-preview.mp4` (the Flow picture with that clip's recording, Flow's own speech faint underneath). Approve it only if every on-screen mouth moves with its recorded line, starts and stops within about a fifth of a second of it, no mouth moves under narration, and the picture shows each narrated beat as it is said; otherwise regenerate. When all N clips are approved:

```text
node tools/ai-studio-voice-runner/assemble.mjs --timeline speech-prompts/<slug>-film-timeline.json --clips <folder> --out <film>.mp4 --bed <music>.wav
```

It joins the clips in order, removes Flow's audio, lays the recording under the picture from 0:00 and the music bed under it (`--bed-db`, default -16 dB), and cuts the film at the recording's end (`--tail 2` holds the last frame two seconds longer). The film runs exactly as long as the recording; ffmpeg must be installed.

### Step 6 - Verify

- [ ] `node tools/ai-studio-voice-runner/film-audio.mjs ...` ran on the current recording, and every file in `lines/` was heard and is right (or fixed in `timing-fixes.json`).
- [ ] `node .agents/skills/story-to-storyboard/check_speech.mjs <storyboard> --timeline speech-prompts/<slug>-film-timeline.json` prints `OK` (add `--partial` while batches remain): N videos for N clips, every `Speech:` line equal to its clip of the timeline in words, speakers, on- or off-screen, and times, every on-screen line inside one shot naming its speaker, voices identical across videos, and the `## Script` table matching.
- [ ] `node .agents/skills/storyboard-30s/check_filter.mjs <storyboard>` prints `OK`, except for a word inside a recorded `Speech:` line, which cannot change ("The road wound up", read as an injury). Never quote such a word in a shot line; leave it in the `Speech:` line, note it in Instruction 2, and if Flow refuses the clip, retry with the shortened `Sound:` line and the effect wording removed first (section 6).
- [ ] Every sentence of narration is enacted in its window: read each clip's `Speech:` line against its shot lines.
- [ ] Every cut sits on a cut point or a sentence start, never inside a spoken line, and every shot is at least 1.5 seconds.
- [ ] The step 7 checks of storyboard-30s that are not about the beat clock, the fixed number of videos, or the word count.

### Step 7 - Hand off

Link the storyboard, the story file, the speech-blocks file, and the timeline. State the recording's length, N, the lines that cross a cut and how each is shot, any timing fix, the Flow Character voice of each speaker, and which videos are written if the film is still in batches. Say how to make it: the cards and setup prompt once, one Agent prompt per clip in order, a preview of every take with its recording before approving it, then `assemble.mjs` with a music bed. Say plainly that lip sync is aimed for, not guaranteed, because Flow makes mouths move to its own speech, and that the preview is where it is checked.
