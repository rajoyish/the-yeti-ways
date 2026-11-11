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
  or /story-to-storyboard. Includes 16:9 and 9:16 cover prompts.
---

# Draft story to a narrated, spoken Yeti film

This skill adapts a draft story into a film of N videos, each exactly 10 seconds, where N is whatever the whole story needs. Each video is one `Agent prompt:` block for Google Flow (Omni 1.2 Flash), generated with sound: background music, sound effects, an off-screen Narrator, and characters who speak their lines on screen. Papa Yeti, Mama Yeti, and Babu Yeti are always the heroes. No character of the draft appears in the film: each one is recast as a new character of a different kind.

Read `.agents/skills/storyboard-30s/SKILL.md` in full, the rules it lists (`.agents/rules/character-consistency.md`, `prompt-assembly.md`, `cinematic-direction.md`, `google-flow.md`, and the `social-media-prompt-creator` skill), its "Keeping clear of Flow's filters" section, and its `references/cover-images.md`. Use everything they set out: saved Characters and `@` names, the style lock, the avoid line, the expression table, Character names for the story cast, coverage and staging, beats on the fixed clock, light and effects, end-frame handoffs, scene breaks, plates, the Image map and `Images:` lines, the 7-reference budget, the three instruction cards, covers, and the verification checklist. This skill overrides only what follows: the fixed number of videos, the plot clock across the film, the no-dialogue rule and its `Sound:` ending, Instruction 1's and Instruction 3's wording about dialogue, the word count of an Agent prompt, and the casting of a source story. Keep these exceptions local to this skill and to the films it writes; never edit the shared rules to match them.

The reference output is `prompts/babu-yeti-sour-mango-trick-150s-storyboard.md`, made from a fox-crow-monkey fable: match its sections, its `Voices:` and `Speech:` lines, and its script table.

## 1. Read the draft and recast it

Take the draft as pasted text or a file path. Before writing, record in your working notes every character (named, unnamed, groups, and any narrator voice), every place, every prop, every event in order, every quoted line, the moral or point of the story, and the ending. Nothing on that list is dropped: the film keeps every event of the draft, in the same order.

Then build the **cast map**: one row per draft character, giving its role in the plot (hero, helper, rival, the one who is tricked, bystander) and who plays it in the film.

1. **The Yetis are the heroes.** The characters the story is about and the audience roots for (the one with the idea, the one who acts, the one who learns) are played by Yetis. Choose by role: a small, young, clever, or curious hero is Babu Yeti; a strong, steady, fatherly, or elder hero is Papa Yeti; a caring, wise, motherly, or patient hero is Mama Yeti. Two heroes who are friends or partners can be two Yetis. At least one Yeti is in every video, and the main emotional turn belongs to a Yeti, in a Close-Up or Medium Close-Up.
2. **A Yeti never plays the villain, the fool, or the one who loses.** The rival, the bully, the selfish one, the one who is tricked, and the bystanders are story cast. When the draft has more heroes than the three Yetis, the extra heroes become story cast allies. When it has fewer, the remaining Yetis may join as family where the story is stronger for it (often in the ending), never as filler, and never as a fourth Yeti.
3. **Never the same character as the draft.** Every draft character is replaced by a new character of a different kind: a different species for an animal, a different trade, age, or kind for a human, and a new invented design for a creature. The film contains none of the draft's species or character types anywhere, not as a lead, a group, or a background extra, and none of its names. A fox fable has no fox in it. Keep the role's job in the plot: whoever owned the tree in the draft still lives in a tree, and whoever flew still has a way to travel. Quoted lines that name a draft character ("Brother Monkey") are rewritten with the new Character name.
4. **Any character Flow allows, in stylized 3D CGI.** The story cast may be humans, real-world animals, or creatures you invent, all drawn in the same stylized 3D animated style as the Yetis, as original designs (section 6 and section 10 of `prompt-assembly.md`): never photoreal, never a real person's likeness, never an existing film, game, or mascot design. Prefer a world that suits the Yetis (Himalayan forests, valleys, villages, snowfields) unless the draft's place is part of its point. Reuse a file in `prompts/characters/` when one fits the role and is not one of the draft's kinds; otherwise choose a new Character name that no file there uses.
5. **Heroes stay heroes.** The Yetis may be clever, cheeky, and playful, and they may outwit a bully, but they are never cruel, never mocking someone weaker, and never win by greed. When the draft's heroes win by a trick or a lie, keep the trick (it is the fun of the story), give it a reason that helps others (hungry neighbours, a shared place), and add one closing beat in which a Yeti turns toward kindness: sharing, inviting, apologising, or forgiving. The moral is spoken once, by the Narrator, in the last video.
6. **Fill what the draft forgot.** A prose draft leaves out what a film must show: where the heroes come from, why they want what they want, the light and time of day, how a character leaves and returns, and an ending picture. Add these from the story's own world, never a new problem, location, or character that changes the plot. Turn anything the safety filter would refuse (harm, weapons, a child in peril, cruelty) into effort, worry, and comedy, as the storyboard-30s filter section sets out.

Write the cast map, the list of changes and additions, and the moral into the file's `## Story adaptation` section (step 5), so the user can see every recasting decision.

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

Plan the light, the effects, and the music across the whole film (step 4) before writing the first prompt, and keep the reference budget: at most 7 per video, counting its images and every `@` name in its `Cast:` line. The Narrator is a voice, not a Character, and uses no reference.

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

1. `# <Title> <N × 10>s Storyboard`, then a premise paragraph (what happens, the tone, the moral), then a paragraph saying it is N videos of 10 seconds with narration, dialogue, music, and sound effects generated in Flow, and that the saved Characters carry every look.
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

## 6. When a clip is refused

Follow the storyboard-30s filter section and the retry list in section 4 of `google-flow.md`, with one change: the spoken lines are part of the story, so a retry never removes them silently. Try, one change at a time: (1) shorten the `Sound:` line to `Soft background music, kept low under the voices. No lyrics, no singing, no other voices.`, keeping `Voices:` and `Speech:`; (2) remove the effect wording; (3) cut each shot to its main physical action; (4) reword the one spoken line the Agent names as the trigger, keeping its meaning, and change the `## Script` table to match; (5) move an on-screen line off-screen. Tell the user which line changed. Record the trigger and its fallback in Instruction 2.

## 7. Verify before finishing

Run every check in step 7 of storyboard-30s, reading "three videos" as N videos and "3" in Instruction 3 as N, with the exceptions above (the `Sound:` ending, the word count, Instruction 1 and 3 wording). Then check:

- [ ] The cast map covers every draft character; no draft species, character type, or name appears anywhere in the film (`grep -i` each one: only the `## Story adaptation` table may contain them); every hero role is a Yeti; no Yeti plays the villain, the fool, or the loser; only the three Yetis appear.
- [ ] Every event of the draft is in the film, in order; additions only deepen it; the moral is spoken once by the Narrator in the last video.
- [ ] N `## Video` headings, N `Images: attach` lines, N `Agent prompt:` lines, and N in Instruction 3; the file name ends `-<N × 10>s-storyboard.md`.
- [ ] Every video has a Yeti shot, three to six shots on the beat boundaries, and at most 7 references; the Climax sits around two thirds of the film.
- [ ] Every spoken word is in a `Speech:` line and in the `## Script` table, identical in both; every speaker is in that video's `Voices:` line with the voice from `## Voice cast`, word for word.
- [ ] `node .agents/skills/story-to-storyboard/check_speech.mjs <file>` prints `OK`: windows inside `00:00.5` to `00:09.5`, no overlaps, at most about 2.8 words per second and 22 words per video, every on-screen line inside a shot whose `In frame:` names the speaker, the Narrator always off-screen, voices identical across videos, script table matching.
- [ ] `node .agents/skills/storyboard-30s/check_filter.mjs <file>` prints `OK`, and every `Note:` was read and the beat changed or judged clear.
- [ ] Both covers pass the cover guide.

## 8. Hand off

Link the file and state: the title, N videos and the running time, the cast map in one line, what was added to the draft and why, the voices, and the music palette. List each story cast member with whether it already has a file in `prompts/characters/`, and say that `/flow-character-builder <this storyboard>` builds the rest under exactly those names, taking each voice from the `## Voice cast` table, and that `/create-flow-assets <this storyboard>` makes the plates and the cast images. Say the clips are generated in Flow from this file: the three cards and the setup prompt once, then one Agent prompt per video with the images its `Images:` line names, checking each take for the spoken words, lip-sync on the right character only, the voice matching earlier clips, and the music low under speech. Distinguish what was written from what was generated: writing prompts never generates a clip or proves a voice.
