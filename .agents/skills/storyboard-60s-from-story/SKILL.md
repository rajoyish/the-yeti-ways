---
name: storyboard-60s-from-story
description: >-
  Trigger when the user gives a short Yeti story (prose, possibly with dialogue) and asks
  for a 1-minute or 60-second storyboard, says "six 10-second videos", "1 min storyboard",
  or runs "/storyboard-60s". Turns the story into a 60-second storyboard of six 10-second
  Google Flow videos with no dialogue, each shot in Flow from a start still and an end
  still that `storyboard-30s-frames` writes the prompts for. Every spoken line becomes a
  gesture, expression, or prop action, and the audio is background music and sound
  effects only, so the clip works for a global audience.
---

# 60-second storyboard from a story

This skill takes a short prose story about the Yeti family and writes a 60-second storyboard built as six 10-second videos for Google Flow. The videos are shot from stills. `storyboard-30s-frames` turns this storyboard into five still-frame image prompts per video, thirty in total, the operator generates those images first, and each video is then generated in Flow from its start image and its end image with the video's table as the motion prompt. The start image of each video is the same instant as the end image of the one before it, so the six clips cut together as one continuous film.

The story may contain dialogue. The storyboard never does. Every line of speech is translated into something the viewer can see: a gesture, a facial expression, a prop being handled, a change of posture. Audio is background music and sound effects only.

The sibling skill `.agents/skills/storyboard-30s-extender/SKILL.md` produces the same table format at half the length. The reference output for this skill is `prompts/babu-yeti-found-sled-60s-storyboard.md`. Match its structure, including the aspect ratio lock and the head lock in every visual cell. It predates the `Stage:` and `Frames:` lines under each heading and the `Start frame:` and `Midpoint frame:` lines under each table, so add all of those.

## Rules that always apply

Read these before writing anything:

- `.agents/rules/character-consistency.md`: the style lock and the exact character text for Papa Yeti, Mama Yeti, and Babu Yeti. Copy the text verbatim into every shot. Never paraphrase it. The one part that varies is the `[EXPRESSION]` slot, filled per shot from the expression table in section 5 of that file.
- `.agents/skills/social-media-prompt-creator/SKILL.md`: platform and safety guidelines. Section 1 (the "never" list), the TikTok note on dangerous activities, and the visual tip about backgrounds apply directly.

- The Yetis are the heroes. Papa Yeti, Mama Yeti, and Babu Yeti are the main characters and never change. If the story casts someone else as the rescuer, the helper, or the character whose choice resolves it, recast it before drafting: the hero beats go to the Yetis, and the story's other characters become the supporting cast (the ones in need, the bystanders, an animal that reacts). Supporting characters may be added, changed, or invented to fit the context (an animal family in place of people), but no supporting character ever takes a hero beat a Yeti could take, and no Yeti is ever replaced. See section 6 of `character-consistency.md`.

Flow-specific constraints, learned from clips that the content filter rejected:

- No dialogue. Every audio cell ends with "No dialogue."
- No brand names, logos, packaging, labels, or on-screen text. This includes signs, maps, and posters. Replace any text-bearing prop from the story with a textless equivalent (a trail map becomes a carved wooden signpost with an arrow shape, a label becomes a plain object).
- No real devices (phones, tablets, cameras). Use in-world props.
- No stock sound effect names (record scratch, cartoon boing, sad trombone). Describe each sound from scratch.
- No plain, white, or empty backgrounds. Every shot has an "Environment:" sentence.
- No horns. The Yetis have none, but the model adds horns, antlers, or spikes to a "Yeti" when the prompt leaves the top of the head undescribed, and once a start still has them the whole clip keeps them. Every visual cell carries the head lock sentence from `character-consistency.md` right after the character text, and no `Action:` sentence puts a paw or prop on or above a Yeti's head (no paws folded up beside the head for a sleep mime, no arms raised overhead). Keep mimes at chest height. A head touch the story needs, such as a tuft ruffle, says the paw lifts away in the same sentence.
- Faces match the beat. The character text used to carry a fixed "wide cheerful toothy smile", and Flow obeyed it over anything the `Action:` sentence said, so Yetis grinned through a rescue. The smile is now an `[EXPRESSION]` slot in each character text. Fill it per shot from the table in section 5 of `character-consistency.md` with the feeling the Yeti holds at the end of the shot, and write the same feeling in the `Action:` sentence. No smile of any kind on a beat of danger, worry, effort, sadness, or loss. A smiling still carries its smile through the whole clip, and a smiling end still is the next video's start still, so a still or clip that smiles on the wrong beat gets regenerated, never used.
- Vertical 9:16 only. Flow renders 16:9 unless the prompt and the output setting both say otherwise, so every visual cell opens with the aspect ratio line and the operator sets Flow to 9:16 before generating. A clip that comes back 16:9 gets regenerated, never cropped.
- No cast energy and no film echoes. Flow has a second refusal, "I can't generate the video you requested right now due to interests of third-party content providers." That is the copyright filter, not the safety filter, and the fixes above do not clear it. It fires on named franchises, characters, studios, and art styles, on song titles, artists, lyrics, and singing, and on scene beats that copy a well-known film's signature moment even when nothing is named. A Yeti who presses paws together and sends out a dome or wave of glowing energy that changes the landscape is one of those beats (it is the plot device of a major animated Yeti film and reads as a superhero power-up). Write a magical effect as a change in light or weather that happens near the character (the light between his paws brightens, the snow softens where the light reaches) and never as something the character casts (no dome, wave, beam, burst, pulse, blast, aura, force field, or energy), and never as a change to the character's own body.
- Music as mood, not as a score cue. Name the feeling, the tempo, and one instrument, and keep that one instrument for the whole film. Once a clip has passed the filter, every later clip names the same instrument and nothing more; do not bring in a new instrument mid-film. Do not write key changes, chord names, arpeggio directions, named tunes, lyrics, or singing. Vocal sounds stay wordless.
- Humans are allowed as supporting cast. If the story mentions people (a hiker, a family, a traveller), they may appear on screen as long as the Yetis keep the hero beats. Write them in the same 3D animated style as the Yetis, with rounded, friendly cartoon features, never as photoreal people and never as a likeness of a real person, celebrity, or named group. Give them simple in-world clothing (a woven tunic, a cloth belt, a plain scarf) with no logos, writing, or modern gear, and no real devices in their hands. Describe them once in a locked `Humans:` sentence that is copied word for word into every prompt, the same way supporting animals get an `Animals:` sentence. A human child in the scene stays with an adult, never enters water, never falls, and is never alone in danger; the filter reads a child in peril as harm, so write worry, not terror.
- No risky physical action. If the story has a character high on a cliff, in a crevice, or on thin ice, bring the action down to a safe height or a gentle slope. TikTok moderates anything that reads as a dangerous stunt, especially with a child character.
- Every video table runs on its own clock, from 00:00 to 00:10. Flow reads the timestamps in a prompt as that clip's clock. A table that starts at 00:30 or 00:50 makes Flow try to render a clip far longer than 10 seconds, split the prompt into several clips, or fail with an error. The film-level position of a video lives in a `Film position:` line outside the table and is never pasted into Flow.
- Stills come first, and the storyboard is written for them. Every video has three keyframe lines under its table, `Start frame:`, `Midpoint frame:`, and `End frame:`, describing the exact picture at 00:00, 00:05, and 00:10 on that video's clock, and a `Frames:` line under its heading naming its five frames in the companion `image-prompts/<title>-60s-frames.md` file. `storyboard-30s-frames` copies its 00:00, 00:05, and 00:10 prompts from those lines and its 00:03 and 00:07 prompts from the end states of Shot 1 and Shot 2. Write every keyframe line as one picture a viewer could photograph: positions, poses, paws, props, eye lines, and the face each Yeti holds. A keyframe line that describes motion, or leaves a character's position or expression unstated, produces a still that fights the clip.

## Workflow

### 1. Read the story

Take the input as pasted prose or as a file path. Extract and write down, before drafting:

- Title (make one if the story has none) and a one-line premise.
- The moral or emotional point of the story, in one sentence. Every video must serve it.
- Which characters appear. Map the story's names to the project's: "Baby Yeti" or "Little Yeti" is Babu Yeti, "Mother" is Mama Yeti, "Father" is Papa Yeti. Then note who holds each hero beat (who notices the problem, who acts on it, whose choice resolves it). If any hero beat belongs to a non-Yeti, or the story has no Yetis, recast it now: the Yetis take the hero beats, and the story's other characters become supporting cast, kept as humans or replaced with in-world animals, whichever fits the story. Supporting humans get one locked `Humans:` sentence and supporting animals one locked `Animals:` sentence, each copied word for word into every prompt, as in `prompts/yeti-family-river-rescue-30s-storyboard.md` (humans) and `prompts/papa-yeti-warm-dome-30s-storyboard.md` (animals).
- Every location. Note where the story moves and why.
- Every prop. Flag any prop that carries text, a brand, or a real-world product.
- Every story beat in order, including who speaks, what they say, and what their body does while they say it.
- Which beat is the Inciting Incident (the one event that breaks normal) and which is the Climax (the point of highest tension, decided by what a Yeti does). Prose stories often bury the climax in a line of dialogue; find the moment the outcome turns and name it now, because the pacing in step 3 is built around it.
- The final state of the scene and the final feeling.

Nothing in this list may be dropped from the output. Every beat of the story appears in the storyboard, in order.

### 2. Convert dialogue to action

For every spoken line, decide what the viewer sees instead. Write the conversion down as a two-column list (line, visual replacement) before drafting shots. Keep the list in your working notes; it does not go in the output file.

Use the intent of the line, not its words:

| Intent of the line | Show it as |
| --- | --- |
| Excitement, "look what I found" | Holds the object up in both paws, bounces on the spot, eyes wide, looks back at the others for approval |
| Claiming, "it's mine" | Hugs the object to chest, turns half away, cheeky grin |
| A gentle "wait" | Raises one open paw, slow head shake, kneels to eye level |
| A question | Head tilt, one open paw turned up, eyebrows raised, eyes on the child |
| "No" or an admission | Looks down at own feet, shoulders drop, toe drawing a line in the snow |
| Explaining a consequence, "how would you feel if" | Mime in three parts at chest height: points at the child, mimes the scenario (cheek resting on the back of one flat paw held beside the jaw for sleep, then a thing cradled in both paws), then turns one paw over to show it empty. Paws never go up beside or above the head |
| Imagining | Hold on the character's face as the expression changes; a glance toward the thing they would lose |
| Comfort or agreement | An arm around the shoulders, a nod, a forehead touch |
| Decision | Straightens up, nods once to self, picks up the object with purpose |
| Pride or approval | Warm smile, a pat on the head, the parents exchange a look |

Do not use thought bubbles, speech bubbles, or written signs to replace dialogue. Do not use lip movement that reads as speech. Mouths may open for gasps, laughs, and sighs.

### 3. Plan six videos

The 60-second film follows the six classic stages of plot structure, in order: Exposition, Inciting Incident, Rising Action, Climax, Falling Action, Resolution. The pacing rule is fixed: the first 30 seconds build the conflict (Exposition through Climax) and the last 30 seconds release it (Falling Action and Resolution). The Climax peaks at film 00:30, the final frame of Video 3, so the `End frame:` line under Video 3 describes the peak and Video 4 opens on the release.

Split the story across six 10-second videos, one stage per video. The default mapping, with a moral tale as the worked example:

| Video | Film position | Stage | What it carries | Moral tale example |
| --- | --- | --- | --- | --- |
| 1 | 00:00 - 00:10 | Exposition | The place, the characters, what normal looks like. End on the first hint of the thing that will break it. | The family on the slope. Babu spots a shape in the snow. |
| 2 | 00:10 - 00:20 | Inciting Incident | The one event that breaks normal and gives a Yeti a problem or a want. | Babu pulls out the sled and claims it. The parents notice. |
| 3 | 00:20 - 00:30 | Rising Action into Climax | The Yetis respond and the problem gets harder, beat by beat, up to the point of highest tension. The last shot is the peak. | Papa's gentle stop and question, Babu's admission, Mama's mime of how the owner feels, and Babu's face as it lands. |
| 4 | 00:30 - 00:40 | Falling Action | The immediate consequence of the peak: the choice made, the act done. | Babu decides and sets the sled back where it was. |
| 5 | 00:40 - 00:50 | Falling Action into Resolution | The tension drains and the loose threads close. | The parents' approval. The family turns for home. |
| 6 | 00:50 - 01:00 | Resolution | The new normal, held long enough to feel. It answers Video 1. | The cave, the hearth, the last look between them. |

Adjust the mapping when the story has a different shape, but keep six videos, keep the story's order, and keep the boundary: the Climax peaks at 00:30, nothing after that point introduces a new problem, and nothing before it resolves one. A long climax may start in Video 3's second shot, but it never runs past the end of Video 3. A story with no clear inciting incident gets one in Video 2, where the problem or the want first arrives, never in Video 1.

Give each video a short title in the heading, such as "Video 1 - The Red Sled". The number and the title are separated by a spaced hyphen (` - `), never a colon. The heading carries no timestamps. The film position goes on its own `Film position:` line directly under the heading, and the stage that video carries goes on a `Stage:` line directly under that.

Add nothing the story does not already imply. Good additions: a reaction from the other parent, a small gesture of affection, a prop being set down with care. Bad additions: a new character, a new prop that changes the story, a joke that undercuts the moral, a second location the story never visits, a supporting character taking over a beat that a Yeti should carry.

### 4. Handle location changes

Each video starts from the still its predecessor ends on, so a location can only change at a video boundary and only in one of two ways:

- **Walk-through**: the last shot of the video shows the characters walking out of frame or along a path, and the first shot of the next video shows them arriving in the new environment. Use this when the two places are close (a cave mouth and the slope outside it).
- **Scene break**: the next video starts from a still of the new location instead of the previous video's end still. Use this when the story jumps (from a mountain ledge to a trail far below). Mark it with a `Scene break:` line directly under that video's `Stage:` line, write its `Start frame:` as the new environment and opening pose instead of a copy of the previous `End frame:`, and tell the operator in the agent instructions which video starts fresh so the editor expects a hard cut.

Keep location changes to two at most across the sixty seconds. Each location gets one `Environment:` sentence, decided in step 1 and never reworded within that location.

### 5. Write the shots

Each video has three shots. Every video's table starts at 00:00 and ends at 00:10, no matter where the video sits in the film. Videos 2 through 6 do not continue the clock from 00:10, 00:20, and so on. Timestamps are contiguous, with no gaps between rows, and sum to exactly 10 seconds per video. Default split is `00:00 - 00:03`, `00:03 - 00:07`, `00:07 - 00:10`, the same three ranges in all six videos. The only place `01:00` appears is the `Film position:` line of Video 6.

Vary the shot types within each video. Do not repeat the same shot type three times in a row. Use Wide Shot, Medium Shot, Medium Two-Shot, Medium Three-Shot, and Close-up.

Every visual cell follows this order, with each piece copied exactly:

1. Aspect ratio lock: `Vertical 9:16 aspect ratio, full-frame vertical composition.` Word for word, in every cell, before anything else.
2. Style lock.
3. `Environment:` sentence for the current location.
4. Character text. For one character, `Character: ...`. For two, `On the left, ... On the right, ...`. For three, `On the left, ... In the center, ... On the right, ...`. Keep the same character on the same side in every shot unless the action moves them, and if it moves them, keep them there for every later shot. Fill each character's `[EXPRESSION]` slot from the section 5 table of `character-consistency.md` with the feeling that Yeti holds at the end of the shot. The slot is the only text in a character description that changes between shots.
5. Head lock, word for word, after the last character description: `Head lock: each Yeti has a smooth, rounded, fully furred head, and the tuft of fur is the only thing on top of it; there are no horns, no antlers, no spikes, no bumps, and no headwear.`
6. Supporting cast, if any: a `Humans:` sentence and/or an `Animals:` sentence describing every supporting character, identical in every shot at every location. A shot without a Yeti replaces the character text with `No Yeti is in this shot.` and keeps the head lock and the supporting cast sentences.
7. `Action:` two to four sentences. Concrete body movement, expression, and eye line. Describe what changes during the shot, not a static pose. The expression named here must agree with the `[EXPRESSION]` slot in the character text; if the feeling changes during the shot, describe the change here and put the destination in the slot. Where a line of dialogue was, write the replacement from your step 2 list.

Shot 2 of every video is written in two halves. The sentences before its midpoint cover 00:03 to 00:05 and end on the picture in the video's `Midpoint frame:` line; the sentences after cover 00:05 to 00:07 and carry that picture to the shot's end. Put a full stop at the midpoint and let no sentence straddle it, because the still at 00:05 is taken from that boundary.

Every audio cell names the music state (starts, continues, pauses, swells, softens, resolves), any physical sound, and ends with "No dialogue." Pick one instrument palette for the whole minute and keep it. Vocal sounds are allowed if they are not words: a gasp, a giggle, a soft sigh, a happy hum.

### 6. Lock the keyframes and the continuity between videos

Every video is generated from a start image and an end image, so every video table is followed by three lines, in this order:

- `Start frame:` the exact picture at 00:00 on the video's clock. For Video 1 it is the first instant of Shot 1, before anything changes. For Videos 2 through 6 it is the `End frame:` line of the previous video, copied word for word. That is the handoff, and the two lines must be identical so the operator and `storyboard-30s-frames` have one description of that instant. The one exception is a video marked `Scene break:`, whose `Start frame:` describes the new environment and the opening pose.
- `Midpoint frame:` the exact picture at 00:05, the sentence boundary in Shot 2's `Action:`.
- `End frame:` the exact picture at 00:10, the state Shot 3's `Action:` ends on. The first shot of the next video begins from that pose. The `End frame:` under Video 3 is the Climax peak, so it describes the moment of highest tension and names the peak feeling on every face, and Video 4's first shot moves out of it rather than holding it. Video 6's `End frame:` is the held, resolved closing image of the film, with the music finishing.

Each line describes a still, not a change: where each character stands, what each paw holds, where each eye line points, which characters and animals are in the picture, and the face each Yeti holds. Nothing in a keyframe line may contradict the `Action:` text or the `[EXPRESSION]` slot of the shot it falls in.

Under each video heading, after the `Stage:` line (and after the `Scene break:` line if there is one), add a `Frames:` line naming the video's five frames in the companion frames file, as in the template: the frame range, the file path in backticks, and which frame is the start image and which the end image. Video N has Frames 5N-4 to 5N: 1 to 5, 6 to 10, 11 to 15, 16 to 20, 21 to 25, 26 to 30. Name the file whether or not it exists yet.

### 7. Write the file

Save to `prompts/<kebab-case-title>-60s-storyboard.md`. Derive the kebab-case title from the story's title, dropping any leading article. Never overwrite an existing file.

Use the template below. The "Agent instructions" section at the top is for whoever, or whatever agent, operates Google Flow. Keep it in the file.

What Flow receives is one table at a time, and only the table, plus the start and end stills generated from the frames file. Headings, `Film position:`, `Stage:`, `Scene break:`, and `Frames:` lines, `Start frame:`, `Midpoint frame:`, and `End frame:` lines, and the agent instructions stay in the file for the operator and the editor.

If the user asked only for the storyboard, say that the frames file named on the `Frames:` lines is the next step (`/storyboard-30s-frames` on this storyboard) and that the agent instructions expect it before any clip is generated.

### 8. Verify before finishing

Check every item. Fix and re-check rather than reporting a partial result.

- [ ] Six videos, each exactly 10 seconds. Every table's first row starts at `00:00` and last row ends at `00:10`. No timestamp above `00:10` appears anywhere in a table.
- [ ] Each video heading reads `## Video N - <Title>` with a spaced hyphen, has no timestamps, and a `Film position:` line sits directly under it (00:00 - 00:10 through 00:50 - 01:00), followed by a `Stage:` line naming the stage that video carries.
- [ ] Every beat of the story appears, in order.
- [ ] The six stages appear in order across the six videos: Exposition, Inciting Incident, Rising Action, Climax, Falling Action, Resolution. The Climax peaks in the last shot of Video 3, at film 00:30, and the `End frame:` under Video 3 describes that peak. No shot in Videos 4 to 6 introduces a new problem, and no shot in Videos 1 to 3 resolves one. Each `Stage:` line matches what its video's shots do.
- [ ] Every hero beat (noticing, acting, resolving) belongs to Papa Yeti, Mama Yeti, or Babu Yeti. No supporting character rescues, solves, or resolves, and no main character is missing, renamed, or replaced.
- [ ] Every spoken line has a visual replacement in an `Action:` cell. No speech, lip-sync, speech bubbles, or written words.
- [ ] Every visual cell opens with the aspect ratio lock line, before the style lock, in all eighteen shots.
- [ ] The style lock and every character description are character-for-character identical to `character-consistency.md`, apart from the `[EXPRESSION]` slot.
- [ ] Every `[EXPRESSION]` slot is filled with a row from the section 5 table, matches the beat of its shot, and agrees with the expression in its `Action:` sentence. No shot on a beat of danger, worry, effort, sadness, or loss contains a smile of any kind. `grep "toothy smile"` on the file returns only shots whose beat is happy, playful, or proud.
- [ ] The head lock sentence follows the character text in every visual cell, word for word, and no `Action:` sentence puts a paw or prop on or above a Yeti's head without the paw lifting away in the same sentence.
- [ ] Each location has one `Environment:` sentence, identical in every shot at that location.
- [ ] Left/right positions are stable.
- [ ] Every video heading is followed by a `Frames:` line naming its five frame numbers (5N-4 to 5N), its start and end frame, and the `image-prompts/<kebab-case-title>-60s-frames.md` file.
- [ ] Every video table is followed by `Start frame:`, `Midpoint frame:`, and `End frame:` lines, each describing one still with every character's position, pose, eye line, and face. The `Start frame:` of Videos 2 through 6 is word for word identical to the `End frame:` of the video before, except under a `Scene break:` line, where it describes the new location and opening pose. Each `End frame:` matches the end of its Shot 3 `Action:`, each `Midpoint frame:` matches the sentence boundary in its Shot 2 `Action:`, and Video 3's `End frame:` is the Climax peak.
- [ ] Shot 2 of every video has a full stop at its midpoint, with the sentences before it covering 00:03 to 00:05 and the sentences after it covering 00:05 to 00:07.
- [ ] Every audio cell ends with "No dialogue."
- [ ] No brands, real devices, stock sound effect names, on-screen text, signs with writing, risky heights, or empty backgrounds. Any humans are stylized, in in-world clothing, described in one `Humans:` sentence that is identical in every shot, and no human child is alone in danger.
- [ ] No character casts energy (dome, wave, beam, burst, aura), no named franchise, studio, style, song, or artist, and every audio cell describes music as mood plus instruments, not as a score cue.
- [ ] File saved in `prompts/` with a kebab-case name ending in `-60s-storyboard.md`.

## Output template

```markdown
# <Title> 60s Storyboard

<One or two sentences: what happens and the moral or emotional point.> It has been strictly formatted for AI video generation according to character styling rules, environment locks, and social media prompt guidelines. There is no dialogue; every line from the original story is carried by gesture, expression, and sound.

## Agent instructions

This storyboard is six 10-second Google Flow videos that cut together into one 60-second film. Each video is generated from two stills, its start image and its end image, with the video's table as the motion prompt. The stills come from `image-prompts/<kebab-case-title>-60s-frames.md`, which holds five image prompts per video (Frames 1 to 30) at 00:00, 00:03, 00:05, 00:07, and 00:10 on each video's clock. Follow these steps in order.

1. If `image-prompts/<kebab-case-title>-60s-frames.md` does not exist, run `/storyboard-30s-frames` on this storyboard to write it. Do not generate any clip without it.
2. Generate the thirty stills from their prompts, in order. Check each one against its prompt: vertical 9:16, no horns or headwear on any Yeti, the face the prompt names, every listed character and animal present and no one else, and for the 00:00, 00:05, and 00:10 stills the `Start frame:`, `Midpoint frame:`, and `End frame:` lines under the matching video. Regenerate a still that fails any check before using it; a wrong still is cheaper to redo than a wrong clip.
3. Set Flow's output format to vertical 9:16 before generating any clip, and check it again before each one. Flow falls back to 16:9 on a new session.
4. Generate Video 1 with Flow's frames-to-video: Frame 1 as the start image, Frame 5 as the end image, and the three Video 1 table rows pasted in order as one prompt. Do not generate the rows separately.
5. Check the clip: vertical 9:16, and at 00:03, 00:05, and 00:07 it matches Frames 2, 3, and 4 in pose, expression, and head. If it drifts, regenerate the clip before continuing; do not fix it in the edit.
6. Generate each following video the same way, using the start and end frames named on its `Frames:` line and its own table as the prompt. The start frame of each video is the same instant as the end frame of the one before it, in the new video's opening framing, so the cut is continuous. Repeat the checks against the three middle frames after every clip.
7. <If any: "Video N starts a new scene. Its start image, Frame <5N-4>, shows the new location rather than the end of Video N-1, matching the `Scene break:` line under its heading. Generate it the same way and expect a hard cut in the edit.">
8. Cut the six clips together in order with no transitions. Keep the music continuous across the cuts.

Every video's table runs on its own 00:00 - 00:10 clock. Paste one table into Flow at a time, and paste only the table. The `Film position:`, `Stage:`, and `Frames:` lines under each heading and the `Start frame:`, `Midpoint frame:`, and `End frame:` lines under each table say where the clip sits in the finished 60-second cut, which stage it carries, and what its stills show; they are for the operator and the editor, not for Flow. If Flow produces more than one clip, a clip longer than 10 seconds, or a timing error, the prompt contained timestamps above 00:10. Remove them and retry.

Every visual cell opens with `Vertical 9:16 aspect ratio, full-frame vertical composition.` Keep that line in the prompt even when Flow's output format is already set to 9:16. The setting and the line together are what stop it reverting to widescreen. If a clip renders 16:9, regenerate it with the format reset rather than cropping, because cropping throws away the top and bottom of the framing.

Do not change the aspect ratio line, style lock, environment sentences, head lock, character descriptions, or the `Humans:` and `Animals:` sentences in any prompt, video or image. Only the `Action:` text, the audio text, and the expression phrase inside each character description (the words between "small round nose," or "small button nose," and the tuft of fur) differ between shots, and the expression phrase is already set for each shot and frame to match its beat. If the image model refuses a still, the causes below apply to it too; change only that frame's `Action:` text and keep every lock. If Flow rejects a clip, read the message. "This prompt may violate our policies" is the safety filter, and the cause is almost always a brand, a real device, a named stock sound effect, on-screen text, or dialogue. "I can't generate the video you requested right now due to interests of third-party content providers" is the copyright filter, and the cause is a name, a style, a song, or an `Action:` sentence that reads like a famous film moment. Hand the prompt to Flow's agent first: it can see what the filter matched, which the message does not say. Give it this request, with the refused prompt pasted under it:

> This prompt was refused with "I can't generate the video you requested right now due to interests of third-party content providers." Find what triggered the refusal and rewrite the prompt so it passes. Keep the three rows and their timestamps (00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10). Change only the `Action:` sentences and the audio text. Do not change, shorten, or reorder the aspect ratio line, the style lock, the `Environment:` sentence, the character descriptions, the `Head lock:` sentence, the `Humans:` sentence, or the `Animals:` sentence. Keep every story beat, keep the <instrument> as the only instrument, keep "No dialogue." at the end of each audio cell, and tell me what you changed and why.

Check the agent's rewrite before generating: every locked sentence must still be there word for word, no timestamp may be above 00:10, and every audio cell must end with "No dialogue." If the agent touched a lock, paste the original lock back over its version. Once the rewritten prompt passes, copy its `Action:` and audio changes back into this storyboard so the later videos are written against what was actually generated, and note what the agent said the trigger was so the next storyboard avoids it.

If the agent cannot clear it, or there is no agent in the session, work through these retries in order, one change at a time, and stop at the first that passes: (1) replace every audio cell with "Soft background music. No dialogue."; (2) cut each `Action:` to its first sentence; (3) drop the end image and generate from the start image alone with the same prompt, then check the clip's last frame against the `End frame:` line, because the filter judges the stills along with the prompt. Never change the character text.

Aspect ratio lock: vertical 9:16 for every still and every clip, set in Flow's output format and stated in the first line of every prompt.

Head lock: no Yeti has horns, antlers, spikes, or anything on its head besides its tuft of fur. Every prompt says so after the character text. If a still or a clip comes back with anything on a Yeti's head, regenerate it before using it. A horned start image carries the horns through the whole clip, and a horned end image pulls them in by the end.

<If any: Human lock and/or Animal lock: the supporting cast sentence(s), word for word, and where each supporting character is and what it does in each video.>

Prop lock: <every prop, what it is made of, where it sits. No brands, labels, text, or packaging.> No dialogue in any shot.

Environment lock: <Location A sentence.> <If used: Location B sentence, and which videos use it.>

## Video 1 - <Title>

Film position: 00:00 - 00:10.

Stage: Exposition.

Frames: 1 to 5 in `image-prompts/<kebab-case-title>-60s-frames.md`. Start image Frame 1, end image Frame 5.

| Timestamp | Shot Type | Visual Description / Prompt | Audio / Sound FX |
| --- | --- | --- | --- |
| **00:00 - 00:03** | <Shot type> | Vertical 9:16 aspect ratio, full-frame vertical composition. <Style lock> Environment: <sentence>. <Character text>. Head lock: each Yeti has a smooth, rounded, fully furred head, and the tuft of fur is the only thing on top of it; there are no horns, no antlers, no spikes, no bumps, and no headwear. Action: <...> | <Music state, physical sounds.> No dialogue. |
| **00:03 - 00:07** | ... | ... | ... |
| **00:07 - 00:10** | ... | ... | ... |

Start frame: <exact picture at 00:00: positions, poses, paws, props, eye lines, and each Yeti's face>.

Midpoint frame: <exact picture at 00:05, the sentence boundary in Shot 2>.

End frame: <exact picture at 00:10, the state Shot 3 ends on>.

## Video 2 - <Title>

Film position: 00:10 - 00:20.

Stage: Inciting Incident.

Frames: 6 to 10 in `image-prompts/<kebab-case-title>-60s-frames.md`. Start image Frame 6, end image Frame 10.

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10 ... |

Start frame: <the Video 1 End frame, word for word>.

Midpoint frame: <...>.

End frame: <...>.

## Video 3 - <Title>

Film position: 00:20 - 00:30.

Stage: Rising Action into Climax (peaks in the last shot, film 00:30).

Frames: 11 to 15 in `image-prompts/<kebab-case-title>-60s-frames.md`. Start image Frame 11, end image Frame 15.

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10 ... |

Start frame: <the Video 2 End frame, word for word>.

Midpoint frame: <...>.

End frame: <the Climax peak, film 00:30: the moment of highest tension and the peak feeling on every face>.

## Video 4 - <Title>

Film position: 00:30 - 00:40.

Stage: Falling Action.

Frames: 16 to 20 in `image-prompts/<kebab-case-title>-60s-frames.md`. Start image Frame 16, end image Frame 20.

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10 ... |

Start frame: <the Video 3 End frame, word for word>.

Midpoint frame: <...>.

End frame: <...>.

## Video 5 - <Title>

Film position: 00:40 - 00:50.

Stage: Falling Action into Resolution.

Frames: 21 to 25 in `image-prompts/<kebab-case-title>-60s-frames.md`. Start image Frame 21, end image Frame 25.

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10 ... |

Start frame: <the Video 4 End frame, word for word>.

Midpoint frame: <...>.

End frame: <...>.

## Video 6 - <Title>

Film position: 00:50 - 01:00.

Stage: Resolution.

<If a scene break: Scene break: this video starts in <new location> rather than from the Video 5 End frame.>

Frames: 26 to 30 in `image-prompts/<kebab-case-title>-60s-frames.md`. Start image Frame 26, end image Frame 30.

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10 ... |

Start frame: <the Video 5 End frame, word for word, or the new location and opening pose after a scene break>.

Midpoint frame: <...>.

End frame: <the held, resolved closing image of the film>.
```
