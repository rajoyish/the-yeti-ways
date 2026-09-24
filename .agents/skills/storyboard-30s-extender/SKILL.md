---
name: storyboard-30s-extender
description: >-
  Trigger when the user asks to extend, expand, or revise a short Yeti storyboard into a
  30-second version, says "30s storyboard", "three 10-second videos", or runs
  "/storyboard-30s". Takes a short storyboard (a file path or pasted markdown, including a
  source storyboard from `video-to-storyboard`) and writes a coherent 30-second storyboard
  as three 10-second Google Flow videos, with framing and angle, lighting, one camera move,
  and VFX directed on every shot. Every shot's action is written as three beats, so each
  video maps onto the nine panels of the 3x3 grid that `create-3x3-timed-image` writes
  next. Each table is that video's Flow prompt, and the file holds video prompts only: the
  grid and panel image prompts go in the 3x3 file, and clips are generated with those
  images attached, never from start or end frames.
---

# 30-second storyboard extender

This skill turns a short storyboard (usually 10 to 15 seconds, 3 to 4 shots) into a 30-second storyboard built as three 10-second videos for Google Flow. It is step 1 of the pipeline in section 7 of `.agents/rules/cinematic-direction.md`. Each video's table is the text prompt for one 10-second clip. Every shot's `Action:` is three beats, so each video has nine beats, and `create-3x3-timed-image` turns those nine beats into the nine panels of the video's 3x3 grid. The storyboard holds video prompts only. Every image prompt for the film, each video's grid and its nine panel images, goes in `prompts/<kebab-case-title>-30s-3x3.md`, which `create-3x3-timed-image` writes, and in Flow each clip is generated from its table with those images attached as references. No clip starts or ends on a supplied frame, so the continuity between the three clips lives in the storyboard text: the first beat of each video picks up the picture the previous video ended on.

Every shot is directed as well as described: its framing and angle, its light, one camera move, its visual effects, and the transition out of it, in the fixed terms of `.agents/rules/cinematic-direction.md`.

The reference output is `prompts/papa-yeti-five-stance-kung-fu-30s-storyboard.md`. Match its structure. It predates the aspect ratio lock, the `Stage:` line under each heading, the three-beat `Action:`, and the cinematic direction (the angle in the Shot Type cell, the `Lighting:` and `Camera:` sentences, and the VFX column), so add all of those. It also carries keyframe lines from the retired start-and-end-frame workflow; leave those out.

## Rules that always apply

Read these before writing anything:

- `.agents/rules/character-consistency.md`: the style lock and the exact character text for Papa Yeti, Mama Yeti, and Babu Yeti. Copy the text verbatim into every shot. Never paraphrase it. The one part that varies is the `[EXPRESSION]` slot, filled per shot from the expression table in section 5 of that file.
- `.agents/rules/cinematic-direction.md`: the terms and project limits for shot type and angle, lighting, camera movement, VFX, transitions, and sound, the panel map that ties each video to its 3x3 grid (section 6), and the pipeline (section 7).
- `.agents/skills/social-media-prompt-creator/SKILL.md`: platform and safety guidelines. The output is a video prompt, so section 1 (the "never" list) and the visual tip about backgrounds apply directly.

- The Yetis are the heroes. Papa Yeti, Mama Yeti, and Babu Yeti are the main characters and never change. When the short storyboard was adapted from a source with other characters, or when it casts someone else as the rescuer, the helper, or the one who solves the problem, recast it before extending: the hero beats go to the Yetis (Babu notices, Papa or Mama acts, the family finishes together), and the source's characters become the supporting cast (the ones in need, the bystanders, an animal that reacts). Supporting characters may be added, changed, or invented to fit the context, but no supporting character ever takes a hero beat a Yeti could take, and no Yeti is ever replaced. See section 6 of `character-consistency.md`.
- Humans are allowed as supporting cast. A story may put people on screen (a family on a raft, a traveller on a path) as long as the Yetis keep the hero beats. Write them in the same 3D animated style as the Yetis, with rounded, friendly cartoon features, never as photoreal people and never as a likeness of a real person, celebrity, or named group. Give them simple in-world clothing (a woven tunic, a cloth belt, a plain scarf) with no logos, writing, or modern gear, and no real devices in their hands. Describe them once in a locked `Humans:` sentence that is copied word for word into every prompt, the same way supporting animals get an `Animals:` sentence. A human child in the scene stays with an adult, never enters water, never falls, and is never alone in danger; the filter reads a child in peril as harm, so write worry, not terror.

Flow-specific constraints, learned from clips that the content filter rejected:

- No dialogue. Every audio cell ends with "No dialogue."
- No brand names, logos, packaging, labels, or on-screen text.
- No real devices (phones, tablets, cameras). Use in-world props, such as a carved ice tablet.
- No stock sound effect names (record scratch, cartoon boing, sad trombone). Describe each sound from scratch.
- No plain, white, or empty backgrounds. Every shot has an "Environment:" sentence.
- No horns. The Yetis have none, but the model adds horns, antlers, or spikes to a "Yeti" when the prompt leaves the top of the head undescribed, and once a grid panel or a panel image has them, the clip made with that image keeps them. Every visual cell carries the head lock sentence from `character-consistency.md` right after the character text, and no `Action:` sentence puts a paw or prop on or above a Yeti's head (no paws folded up beside the head for a sleep mime, no arms raised overhead). Keep mimes at chest height. A head touch the story needs, such as a tuft ruffle, says the paw lifts away in the same sentence.
- Same look in every shot. Left to itself, a model turns a "Yeti" into a white, ape-like snow monster, dresses characters standing in snow in scarves and hats, and draws Babu at any size from a doll to a third grown-up, and each clip copies whatever its attached grid or panel images show. Every visual cell carries the look lock and the avoid line from sections 9 and 11 of `character-consistency.md`, and every shot where the baby Yeti and a grown-up Yeti are both in frame carries the scale lock from section 10. The `Action:` text refers to each Yeti by colour, never by name, and agrees with section 8 of that file (paws, not hands; nothing worn; Babu about half a grown-up's height). No sentence outside the character text sizes a place or a prop by a Yeti ("a pillar as tall as a grown Yeti"), because that sentence runs in every shot and puts the Yeti into the ones where it is absent.
- Faces match the beat. The character text used to carry a fixed "wide cheerful toothy smile", and Flow obeyed it over anything the `Action:` sentence said, so Yetis grinned through a rescue. The smile is now an `[EXPRESSION]` slot in each character text. Fill it per shot from the table in section 5 of `character-consistency.md` with the feeling the Yeti holds at the end of the shot, and write the same feeling in the `Action:` sentence. No smile of any kind on a beat of danger, worry, effort, sadness, or loss. A smiling grid panel or panel image carries its smile into the clip made with it, so an image or clip that smiles on the wrong beat gets regenerated, never used.
- Vertical 9:16 only. Flow renders 16:9 unless the prompt and the output setting both say otherwise, so every visual cell opens with the aspect ratio line and the operator sets Flow to 9:16 before generating. A clip that comes back 16:9 gets regenerated, never cropped.
- No cast energy and no film echoes. Flow has a second refusal, "I can't generate the video you requested right now due to interests of third-party content providers." That is the copyright filter, not the safety filter, and the fixes above do not clear it. It fires on named franchises, characters, studios, and art styles, on song titles, artists, lyrics, and singing, and on scene beats that copy a well-known film's signature moment even when nothing is named. A Yeti who presses paws together and sends out a dome or wave of glowing energy that changes the landscape is one of those beats (it is the plot device of a major animated Yeti film and reads as a superhero power-up). Write a magical effect as a change in light or weather that happens near the character (the light between his paws brightens, the snow softens where the light reaches) and never as something the character casts (no dome, wave, beam, burst, pulse, blast, aura, force field, or energy), and never as a change to the character's own body.
- Direction goes to Flow too. The whole row, VFX cell included, is pasted as the prompt, so every word in the `Lighting:`, `Camera:`, `Effects:`, and `Transition:` text is an instruction the filters read. No energy, explosion, or strobe effect, no named film, studio, or colour grade, and no edit instruction (a fade, a dissolve, a speed change) inside a table. Those go in the agent instructions.
- No pipe character (`|`) inside a cell. A stray pipe splits the cell and shifts every column after it.
- Music as mood, not as a score cue. Name the feeling, the tempo, and one instrument, and keep that one instrument for the whole film. Once a clip has passed the filter, every later clip names the same instrument and nothing more; do not bring in a new instrument mid-film. Do not write key changes, chord names, arpeggio directions, named tunes, lyrics, or singing. Vocal sounds stay wordless.
- Every video table runs on its own clock, from 00:00 to 00:10. Flow reads the timestamps in a prompt as that clip's clock. A table that starts at 00:10 or 00:20 makes Flow try to render a 20- or 30-second clip, split the prompt into several clips, or fail with an error. The film-level position of a video lives in a `Film position:` line outside the table and is never pasted into Flow.
- Beats come first, and the grid is built from them. Every shot's `Action:` is exactly three sentences, one per beat, and each beat becomes one panel of the video's 3x3 grid, as the panel map in section 6 of `cinematic-direction.md` sets out: three shots, nine beats, nine panels per video. `create-3x3-timed-image` builds each grid, and a full-size image of each panel, from these beats. Write every beat to end on one picture a viewer could photograph: positions, poses, paws, props, eye lines, and any face that changes. A beat that only describes motion, or leaves a character's position unstated, produces a panel that fights the clip.
- No start or end frames. Clips are generated with the grid or its panel images attached as references, so the storyboard carries no `Frames:`, `Start frame:`, `Midpoint frame:`, or `End frame:` lines, and the agent instructions never tell the operator to set a start or an end image. The continuity those lines used to hold now lives in the beats: the first beat of Video 2 and Video 3 describes the picture the previous video's last beat ended on.
- Video prompts only. The storyboard holds no image prompt: no `Create image:` line, no `Grid:` or `Stills:` line, and no step for generating or checking an image. Every image prompt goes in the 3x3 file that `create-3x3-timed-image` writes, and the agent instructions name that file so the operator knows where each clip's images come from. The lock paragraphs say what the clips must show; the 3x3 file's intro says how to check the images against them.

## Workflow

### 1. Read the short storyboard

Take the input as a file path under `prompts/` or as pasted markdown. Extract and write down, before drafting:

- Title and one-line premise.
- Environment sentence, exactly as written.
- Which characters appear, which side of the frame each one is on, and who holds each hero beat (who notices the problem, who acts on it, who resolves it). If any hero beat belongs to a non-Yeti, or the source has no Yetis at all, recast it now: Yetis take the hero beats, and the source's characters become supporting cast, kept as humans or replaced with in-world animals, whichever fits the story. Supporting humans get one locked `Humans:` sentence and supporting animals one locked `Animals:` sentence, each copied word for word into every prompt, as in `prompts/yeti-family-river-rescue-30s-storyboard.md` (humans) and `prompts/papa-yeti-warm-dome-30s-storyboard.md` (animals).
- Every prop.
- Every story beat, in order, including facial expressions and gestures.
- Which beat is the Inciting Incident (the one event that breaks normal) and which is the Climax (the point of highest tension, decided by what a Yeti does). A short storyboard often has both inside a few seconds; the 30-second version gives each its own room.
- Audio mood (instrument, tempo, how it resolves).
- The light: time of day, weather, and every light source the environment holds (sun, sky, hearth, lantern, glowing moss). These become the `Lighting lock:` in the agent instructions. If the scene needs a source it lacks, add it to the `Environment:` sentence now.
- Any camera moves, effects, and transitions the source names, with a note on which ones pass the limits in `cinematic-direction.md`.
- The final state of the scene.

The input may be a source storyboard from `video-to-storyboard`: a five-column table (`Timestamp | Shot Type | Visual Description | VFX | Audio / Sound FX`) with `**Environment:**`, `**Lighting:**`, `**Subjects & Action:**`, and `**Camera Movement:**` in the visual cells and `**Observed:**`, `**Transition:**`, and `**Recommended:**` in the VFX cells. Read it the same way. Its environment becomes the `Environment:` sentence, recast to the Yeti world. Its lighting becomes the lighting plan. Its subjects and action become the beats, recast so the Yetis hold the hero beats. Its camera moves and observed effects are kept where they pass the limits and replaced where they do not (a fire beam becomes a thrown snowball, an explosion becomes a cloud of powder snow off a falling slab). Its recommended moves and effects are options, not beats. Its dialogue becomes gesture, as in step 2 of `storyboard-60s-from-story`.

Nothing in this list may be dropped from the output. The 30-second version contains every beat of the short one, in the same order, with new beats added around and after them.

### 2. Plan three videos

The 30-second film follows the six classic stages of plot structure, in order: Exposition, Inciting Incident, Rising Action, Climax, Falling Action, Resolution. The pacing rule is fixed: the first 15 seconds build the conflict (Exposition through Climax) and the last 15 seconds release it (Falling Action and Resolution). The Climax peaks at film 00:15, which is 00:05 on Video 2's clock: the middle beat of Video 2's Shot 2, and panel 5, the centre of Video 2's grid.

Split the story across three 10-second videos. The default mapping:

| Video | Film position | Stages | Role | Source |
| --- | --- | --- | --- | --- |
| 1 | 00:00 - 00:10 | Exposition, Inciting Incident, start of Rising Action | Setup and the first turn | Opening beats of the short storyboard, given room to breathe |
| 2 | 00:10 - 00:20 | Rising Action, Climax, start of Falling Action | The core action, and the hinge of the film | The middle and climax of the short storyboard |
| 3 | 00:20 - 00:30 | Falling Action, Resolution | Resolution and a new payoff | The short storyboard's ending, then one new beat that deepens it |

Shot by shot, with the fixed split from step 3:

| Film time | Video and shot | Stage | Default light and camera |
| --- | --- | --- | --- |
| 00:00 - 00:03 | Video 1, shot 1 | Exposition: the place, the characters, what normal looks like | Soft high-key light. A slow establishing move (Crane Down, Dolly In, or Pan) |
| 00:03 - 00:07 | Video 1, shot 2 | Inciting Incident: the one event that breaks normal | The light shifts (a cloud, a shadow, a guttering fire) in the shot's first beat. A Tilt or Pan to the problem, or a Static hold on the face that sees it |
| 00:07 - 00:13 | Video 1, shot 3 and Video 2, shot 1 | Rising Action: the Yetis respond and the problem gets harder with each beat | Lower key, harder side light, cooler colour. Tracking, Steadicam, or subtle Handheld |
| 00:13 - 00:17 | Video 2, shot 2 | Climax, peaking at 00:15 in the shot's middle beat: the point of highest tension, decided by what a Yeti does | Low-key and hardest. A Low Angle Dolly In or an Arc around the Yeti who acts |
| 00:17 - 00:23 | Video 2, shot 3 and Video 3, shot 1 | Falling Action: the immediate consequences, the tension draining | Warmth returns. A slow Dolly Out or a Static hold |
| 00:23 - 00:30 | Video 3, shots 2 and 3 | Resolution: the new normal, held. The added beat that deepens the ending lives here | Soft, warm, golden, high-key. A Crane Up or slow Dolly Out that leaves the family small and warm, or a Static hold |

Adapt the light and camera to the story, within the limits of `cinematic-direction.md`. The light only changes where section 6 of that file allows: never during a Shot 1, and in a Shot 2 or a Shot 3 only during its first beat.

Video 2's middle shot is the hinge. Its first beat builds to the peak, its middle beat is the peak (the moment of highest tension, with the peak feeling named on every face), and its third beat begins the release. Its `[EXPRESSION]` slot holds the feeling at the end of the shot, which is the first feeling of the Falling Action, not the peak. Nothing after 00:15 introduces a new problem, and nothing before it resolves one.

Give each video a short title in the heading, such as "Video 1 - The Spill". The number and the title are separated by a spaced hyphen (` - `), never a colon. The heading carries no timestamps. The film position goes on its own `Film position:` line directly under the heading, the stages that video carries go on a `Stage:` line directly under that. The 3x3 file and every image in it reuse this heading, so choose the title once and never change it.

The new beats must grow from what is already there. Good extensions: the other character reacts, the two characters do the last action together, a prop is put to a second use, a small gesture of affection closes the scene. Bad extensions: a new location, a new character, a new prop that changes the story, a joke that undercuts the mood, a supporting character taking over a beat that a Yeti should carry.

### 3. Write the shots

Each video has three shots. Every video's table starts at 00:00 and ends at 00:10, no matter where the video sits in the film. Video 2 and Video 3 do not continue the clock from 00:10 or 00:20. The split is fixed: `00:00 - 00:03`, `00:03 - 00:07`, `00:07 - 00:10`, the same three ranges in all three videos, because the panel timecodes in every grid are built on it. Normalize input timestamps that have gaps or a different split to these three ranges.

Each table has five columns: `| Timestamp | Shot Type | Visual Description / Prompt | VFX | Audio / Sound FX |`. Every cell uses the same labels in the same order in every row, and no cell contains a pipe character.

The Shot Type cell names the framing from the ladder in section 1 of `cinematic-direction.md`, then the angle: `Wide Shot, Eye Level`, `Medium Two-Shot, Low Angle`, `Close-Up, Eye Level`. When the camera move changes the framing, name both ends: `Medium Shot to Close-Up, Eye Level`. Vary the framing across each video, and do not repeat the same framing three times in a row. The grid takes each panel's framing from this cell, as section 6 of `cinematic-direction.md` sets out.

Every visual cell follows this order, with each piece copied exactly:

1. Aspect ratio lock: `Vertical 9:16 aspect ratio, full-frame vertical composition.` Word for word, in every cell, before anything else.
2. Style lock.
3. `Environment:` sentence. Identical in every shot across all three videos, including any hearth, props, or set dressing you add. Decide it once in step 1 and never vary the wording.
4. `Lighting:` one sentence naming the key, fill, and rim, their quality and direction, the contrast, the colour temperature and palette, and the mood, as section 2 of `cinematic-direction.md` sets out. Every source it names is in the `Environment:` sentence, and it keeps a soft warm light on the fur. It holds the light at the end of the shot.
5. Character text. For one character, `Character: ...`. For two, `On the left, ... On the right, ...`. Keep the same character on the same side in every shot unless the action moves them, and if it moves them, keep them there for every later shot. Fill each character's `[EXPRESSION]` slot from the section 5 table of `character-consistency.md` with the feeling that Yeti holds at the end of the shot. The slot is the only text in a character description that changes between shots.
6. Head lock, word for word, after the last character description: `Head lock: each Yeti has a smooth, rounded, fully furred head, and the tuft of fur is the only thing on top of it; there are no horns, no antlers, no spikes, no bumps, and no headwear.`
7. Look lock, word for word, after the head lock: `Look lock: each Yeti is a stylized, friendly 3D animated character with a soft, plush, rounded shape, it wears nothing but its own fur, and that fur is one solid colour from head to toe, with only the face and paws a lighter shade.`
8. Scale lock, word for word, after the look lock, only in shots where the baby Yeti and at least one grown-up Yeti are both in frame: `Scale lock: the baby Yeti is about half as tall as each grown-up Yeti in the shot.`
9. Supporting cast, if any: a `Humans:` sentence and/or an `Animals:` sentence describing every supporting character, identical in every shot across all three videos. A shot without a Yeti replaces the character text with `No Yeti is in this shot.` and keeps the head lock, the look lock, the supporting cast sentences, and the avoid line.
10. Avoid line, word for word, after the supporting cast sentences (or after the look lock or scale lock when there are none): `Avoid: photorealistic humans, scary monsters, horror elements, flat lighting, urban environments, extra Yetis, and, on any Yeti, human skin, visible pores, sharp teeth, sharp claws, white or grey fur, clothing, hats, or accessories.`
11. `Action:` exactly three sentences, one per beat, in order. Each beat is concrete body movement, expression, and eye line, and ends on a picture (step 3's beat rules below). The feeling named in the third beat must agree with the `[EXPRESSION]` slot in the character text; if a feeling changes during the shot, the beat where it changes names the new feeling, and the slot holds the destination. If the light changes, the first beat says so, and the `Lighting:` sentence holds the new light.
12. `Camera:` one sentence naming one move from the list in section 3 of `cinematic-direction.md`, then its direction, its speed, and what it reveals or ends on. The move matches the Shot Type cell: a move that changes the framing starts on the first framing named there and ends on the second.

The three beats of each shot become the three panels of that shot's row in the grid, so write them to the panel map in section 6 of `cinematic-direction.md`:

- Beat 1 starts from the shot's opening picture and covers the first third of the shot. In Shot 1 of Video 2 and Video 3, it opens on the picture the previous video's last beat ended on, with the same positions, paws, props, eye lines, and faces.
- Beat 2 covers the middle third. In Shot 2 it sits on 00:05, the centre of the clip; in Video 2 that is the Climax peak.
- Beat 3 covers the last third and ends on the picture the shot closes on, with the feeling in the `[EXPRESSION]` slot. In Shot 3 it is the video's closing picture, which the next video's first beat picks up.
- Each beat is one sentence with a full stop at its end, and no sentence straddles two beats. Name each Yeti in every beat it is in, by colour, and say where it is. A character who leaves or enters the frame does so inside a beat, and the beat says so.

Every VFX cell holds two labelled sentences, in this order:

- `Effects:` what Flow renders in this shot, from the effects in section 4 of `cinematic-direction.md`: what each effect does and how it meets the light and the action. Every effect has a cause in the `Environment:` sentence or the `Action:` text, and none comes from a Yeti. `Effects: None.` when the shot has none.
- `Transition:` `Hard Cut.` or `Match Cut.` (with what it matches) for Shots 1 and 2, and `Holds on the final frame.` for Shot 3. The cut to the next video happens in the edit.

Every audio cell names the music state (starts, continues, pauses, swells, resolves), the ambient sound of the place, a sound for each physical action and each visible effect, and ends with "No dialogue."

### 4. Lock the continuity between videos

No clip starts or ends on a supplied image, so each handoff between videos is held by the text of both tables. Follow section 6 of `cinematic-direction.md`:

- Picture. The first beat of Shot 1 in Video 2 describes the picture the third beat of Video 1's Shot 3 ends on: the same characters in the same places, the same paws and props, the same eye lines, and the same faces. Video 3's first beat picks up Video 2's last beat the same way. Only the framing may differ, because each shot has its own. Panel 1 of each grid then shows the same instant as panel 9 of the grid before it.
- Face. The feeling a Yeti holds at the start of a video's Shot 1 is the feeling in the previous video's Shot 3 `[EXPRESSION]` slot. If it changes in Shot 1, the beat where it changes says so.
- Light. The `Lighting:` sentence of Video 2's Shot 1 is Video 1's Shot 3 `Lighting:` sentence, word for word, and Video 3's Shot 1 copies Video 2's Shot 3 the same way. The light never changes during a Shot 1, and a change in a Shot 2 or a Shot 3 happens in its first beat.
- Camera. Every Shot 3 `Camera:` sentence ends by easing to a stop, and every Shot 1 `Camera:` sentence in Videos 2 and 3 starts from rest.

### 5. Write the file

Save to `prompts/<kebab-case-title>-30s-storyboard.md`. Derive the kebab-case title from the short storyboard's title, dropping the word "storyboard" and any leading article. Never overwrite the short storyboard.

Use the template below. The "Agent instructions" section at the top is for whoever, or whatever agent, operates Google Flow. Keep it in the file. Its `Lighting lock:` paragraph names the light sources, colour temperatures, and palette from step 1 and how the light moves across the three videos. Its `VFX lock:` paragraph names which effects belong to which video, so an effect never leaks into a clip that should not have it.

What Flow receives is one table at a time, and only the table, plus the images from the 3x3 file for the route the operator chose. Headings, the `Film position:` and `Stage:` lines, and the agent instructions stay in the file for the operator and the editor.

Then name the next step. If the user asked only for the storyboard, say that `/create-3x3-timed-image` on this storyboard writes the image prompts, a nine-panel grid and nine panel images for each video, and that the agent instructions expect those images before any clip is generated. Run it as its own step, not in this run. If the user asked for the images too, finish and verify this file first, then run `create-3x3-timed-image` on it.

### 6. Revise an older storyboard

Two kinds of older storyboard need this step. One written before the 3x3 pipeline has `Frames:` lines under its headings and `Start frame:`, `Midpoint frame:`, and `End frame:` lines under its tables, and its agent instructions tell the operator to set start and end images. One written before the storyboard held video prompts only has `Grid:` and `Stills:` lines under its headings, and its agent instructions say how to generate and check grids and reference stills. When this skill or `create-3x3-timed-image` works on either, bring it up to this skill's format first, without changing a story beat, a lock, a light, or a framing:

1. If it has keyframe lines, rewrite each `Action:` as three beats that follow step 3. Use the deleted keyframe lines as the pictures: Shot 1's first beat opens on the `Start frame:` picture, Shot 2's middle beat is the `Midpoint frame:` picture, and Shot 3's third beat is the `End frame:` picture.
2. Delete every `Frames:`, `Start frame:`, `Midpoint frame:`, `End frame:`, `Grid:`, and `Stills:` line, and any `Create image:` prompt.
3. Replace the agent instructions with the template's, carrying over every lock paragraph and any film-specific note (a likely filter trigger, a changed aspect ratio) that does not rely on start or end frames. Take the image checks out of the lock paragraphs, and move any note about the images themselves (which characters may appear in which images, an image that has to be regenerated) into the intro of the 3x3 file.
4. Run the checklist in step 7, and tell the user the storyboard was updated.

A frames file in `image-prompts/`, from the start-and-end-frame workflow or the retired stills route, is left in place for the record. The panel images in the 3x3 file replace it.

### 7. Verify before finishing

Check every item. Fix and re-check rather than reporting a partial result.

- [ ] Three videos, each exactly 10 seconds. Every table has three rows, `00:00 - 00:03`, `00:03 - 00:07`, and `00:07 - 00:10`, in that order. No timestamp above `00:10` appears anywhere in a table.
- [ ] Each video heading reads `## Video N - <Title>` with a spaced hyphen, has no timestamps, and is followed, in order, by a `Film position:` line (00:00 - 00:10, 00:10 - 00:20, 00:20 - 00:30), and a `Stage:` line naming the stages that video carries.
- [ ] No start or end frame logic remains: `grep -cE "^(Frames|Start frame|Midpoint frame|End frame):" <file>` returns 0, and no step in the agent instructions sets a start image, an end image, or frames-to-video.
- [ ] The file holds video prompts only: `grep -cE "^(Grid|Stills):|Create image:" <file>` returns 0, and the agent instructions name `prompts/<kebab-case-title>-30s-3x3.md` for each clip's images but give no steps for generating or checking an image.
- [ ] Every beat of the short storyboard appears, in order.
- [ ] The six stages appear in order across the nine shots: Exposition, Inciting Incident, Rising Action, Climax, Falling Action, Resolution. The Climax peaks at film 00:15, in the middle beat of Video 2's Shot 2, and that beat names the peak feeling on every face. No beat after it introduces a new problem, and no beat before it resolves one. Each `Stage:` line matches what its video's shots do.
- [ ] Every `Action:` is exactly three sentences, one per beat, each ending on a picture, so each video has nine beats for the nine panels of its grid. Every Yeti in a beat is named by colour and placed. The third beat of each shot ends on the feeling in that shot's `[EXPRESSION]` slot.
- [ ] Every hero beat (noticing, acting, resolving) belongs to Papa Yeti, Mama Yeti, or Babu Yeti. No supporting character rescues, solves, or resolves, and no main character is missing, renamed, or replaced.
- [ ] Every visual cell opens with the aspect ratio lock line, before the style lock, in all nine shots.
- [ ] The style lock and every character description are character-for-character identical to `character-consistency.md`, apart from the `[EXPRESSION]` slot.
- [ ] Every `[EXPRESSION]` slot is filled with a row from the section 5 table, matches the beat of its shot, and agrees with the expression in its `Action:` text. No shot on a beat of danger, worry, effort, sadness, or loss contains a smile of any kind. `grep "toothy smile"` on the file returns only shots whose beat is happy, playful, or proud.
- [ ] The head lock sentence follows the character text in every visual cell, word for word, and no `Action:` sentence puts a paw or prop on or above a Yeti's head without the paw lifting away in the same sentence.
- [ ] The look lock follows the head lock and the avoid line follows the supporting cast in every visual cell, word for word: `grep '^| \*\*00:' <file> | grep -c "Look lock: "` and the same count for `"Avoid: "` return 9. The scale lock is in every shot where the baby Yeti and a grown-up Yeti are both in frame, and in no other shot.
- [ ] Every `Action:` refers to each Yeti by colour, never by name, and agrees with section 8 of `character-consistency.md`: paws, not hands, nothing worn, Babu about half a grown-up's height. No sentence outside the character text sizes a place or a prop by a Yeti.
- [ ] The `Environment:` sentence is identical in every shot.
- [ ] Left/right positions are stable.
- [ ] Every table has the five-column header `| Timestamp | Shot Type | Visual Description / Prompt | VFX | Audio / Sound FX |`, and every row has exactly six pipe characters, so no cell contains one. `awk -F'|' '/^\| \*\*00:/ && NF != 7' <file>` prints nothing.
- [ ] Every Shot Type cell names a framing from the ladder and an angle, and a shot whose move changes the framing names both ends, at most two rungs apart. No Bird's-Eye View or steep High Angle on a shot where a Yeti is more than small in the frame, and no Dutch Angle in the Resolution.
- [ ] Every visual cell has one `Lighting:` sentence directly after the `Environment:` sentence and one `Camera:` sentence at the end, after the `Action:` text. `grep '^| \*\*00:' <file> | grep -o "Lighting: " | wc -l` returns 9, and the same count for `"Camera: "`, `"Effects: "`, and `"Transition: "` returns 9 each.
- [ ] Every `Lighting:` sentence names only sources in the `Environment:` sentence, keeps a soft warm light on the fur, and follows the arc (soft and high-key in the Exposition, low-key at the Climax, warm and golden in the Resolution). No light from below a face, no strobing or flashing, no named film or grade.
- [ ] The light never changes during a Shot 1, and a change in a Shot 2 or a Shot 3 is described in its first beat. The Shot 1 `Lighting:` sentence of Videos 2 and 3 is word for word the Shot 3 `Lighting:` sentence of the video before.
- [ ] The first beat of Shot 1 in Videos 2 and 3 describes the same picture, with the same positions, paws, props, eye lines, and faces, as the last beat of the previous video's Shot 3.
- [ ] Every `Camera:` sentence names one move from the list, with direction and speed, and agrees with its Shot Type cell. Every Shot 3 move eases to a stop, and every Shot 1 move in Videos 2 and 3 starts from rest. Whip Pan at most once, never at a shot's start or end.
- [ ] Every VFX cell has `Effects:` then `Transition:`. Every effect is on the list in section 4 of `cinematic-direction.md` and has a cause in the environment or the action, and no effect is energy, an explosion, a flash, on-screen text, a morph, or anything coming from a Yeti other than breath misting in the cold. Shots 1 and 2 end on `Hard Cut.` or `Match Cut.`, and every Shot 3 on `Holds on the final frame.` No fade, dissolve, or speed change inside a table.
- [ ] Every effect that makes a sound has that sound in the audio cell of the same row.
- [ ] Every audio cell ends with "No dialogue."
- [ ] No brands, real devices, stock sound effect names, on-screen text, or empty backgrounds. Any humans are stylized, in in-world clothing, described in one `Humans:` sentence that is identical in every shot, and no human child is alone in danger.
- [ ] No character casts energy (dome, wave, beam, burst, aura), no named franchise, studio, style, song, or artist, and every audio cell describes music as mood plus instruments, not as a score cue.
- [ ] File saved in `prompts/` with a kebab-case name ending in `-30s-storyboard.md`.

## Output template

```markdown
# <Title> 30s Storyboard

<One or two sentences: what happens and the emotional tone. Keep the short storyboard's premise.> It has been strictly formatted for AI video generation according to character styling rules, environment locks, cinematic direction, and social media prompt guidelines.

## Agent instructions

This storyboard is three 10-second Google Flow videos that cut together into one 30-second scene. The file holds the video prompts only: each video's table is the text prompt for one Flow generation. The images each clip is generated with, the video's 3x3 grid and its nine panel images, are in `prompts/<kebab-case-title>-30s-3x3.md` under the same `## Video N - <Title>` heading, with the steps for generating and checking them. No clip starts or ends on a supplied frame.

Follow these steps in order.

1. Before generating a clip, generate its video's images and check them as `prompts/<kebab-case-title>-30s-3x3.md` says. If that file does not exist, run `/create-3x3-timed-image` on this storyboard to write it. Do not generate a clip without its images.
2. Set Flow's output format to vertical 9:16 before generating any clip, and check it again before each one. Flow falls back to 16:9 on a new session.
3. Generate Video 1 in Flow's ingredients-to-video mode. Attach the Video 1 images for the route you pick in the 3x3 file: the grid image and the family reference image, or panel images 3, 6, and 9. Paste the three Video 1 table rows in order as one prompt, VFX cells included. Do not generate the rows separately, and do not set a start or an end frame.
4. Check the clip: vertical 9:16, and it matches its video's grid panels and panel images in pose, expression, colour, tuft, size, head, framing, and light, each at its timecode. No Yeti changes colour, grows or shrinks, or picks up clothing partway through, and none of the grid's label text appears. The camera moves the way each `Camera:` sentence says, and no effect appears that its `Effects:` sentence does not name. If it drifts, regenerate the clip before continuing; do not fix it in the edit.
5. Generate Video 2 the same way, with its own images and its own table. Its first beat picks up the picture Video 1 ended on, under the same light. Put the end of the Video 1 clip beside the start of the new clip and regenerate the new clip if the cut jumps in position, face, colour, or light. Repeat the checks in step 4.
6. Generate Video 3 the same way, and repeat the checks.
7. Cut the three clips together in order with hard cuts and no other transitions. Keep the audio continuous across the cuts. Apply one colour grade to the whole cut, matched to the palette in the `Lighting lock:` paragraph, so the three clips read as one film. Do not retime any clip; each one stays exactly 10 seconds.

Every video's table runs on its own 00:00 - 00:10 clock. Paste one table into Flow at a time, and paste only the table. The `Film position:` and `Stage:` lines under each heading say where the clip sits in the finished 30-second cut and which stages it carries; they are for the operator and the editor, not for Flow. If Flow produces more than one clip, a clip longer than 10 seconds, or a timing error, the prompt contained timestamps above 00:10. Remove them and retry.

Every visual cell opens with `Vertical 9:16 aspect ratio, full-frame vertical composition.` Keep that line in the prompt even when Flow's output format is already set to 9:16. The setting and the line together are what stop it reverting to widescreen. If a clip renders 16:9, regenerate it with the format reset rather than cropping, because cropping throws away the top and bottom of the framing.

Do not change the aspect ratio line, style lock, environment sentence, `Lighting:` sentences, head lock, look lock, scale lock, avoid line, character descriptions, or the `Humans:` and `Animals:` sentences in any prompt. The images in the 3x3 file were generated under that light and with those locks, so a clip prompt with different ones fights the images attached to it. Only the `Action:` text, the `Camera:` and VFX text, the audio text, and the expression phrase inside each character description (the words between "small round nose," or "small button nose," and the tuft of fur) differ between shots, and the expression phrase is already set for each shot to match its beat. If Flow rejects a clip, read the message. "This prompt may violate our policies" is the safety filter, and the cause is almost always a brand, a real device, a named stock sound effect, on-screen text, dialogue, or an effect that reads as harm (fire, a blast, a flash). "I can't generate the video you requested right now due to interests of third-party content providers" is the copyright filter, and the cause is a name, a style, a song, a named look, or an `Action:` or `Effects:` sentence that reads like a famous film moment. Hand the prompt to Flow's agent first: it can see what the filter matched, which the message does not say. Give it this request, with the refused prompt pasted under it:

> This prompt was refused with "I can't generate the video you requested right now due to interests of third-party content providers." Find what triggered the refusal and rewrite the prompt so it passes. Keep the three rows and their timestamps (00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10), and keep each `Action:` at three sentences, one per beat. Change only the `Action:` sentences, the `Camera:` sentences, the VFX cells, and the audio text. Do not change, shorten, or reorder the aspect ratio line, the style lock, the `Environment:` sentence, the `Lighting:` sentences, the character descriptions, the `Head lock:` sentence, the `Look lock:` sentence, the `Scale lock:` sentence, the `Avoid:` sentence, the `Humans:` sentence, or the `Animals:` sentence. Keep every story beat, keep the <instrument> as the only instrument, keep "No dialogue." at the end of each audio cell, and tell me what you changed and why.

Check the agent's rewrite before generating: every locked sentence must still be there word for word, no timestamp may be above 00:10, every `Action:` must still have three beats, and every audio cell must end with "No dialogue." If the agent touched a lock, paste the original lock back over its version. Once the rewritten prompt passes, copy its `Action:`, `Camera:`, VFX, and audio changes back into this storyboard, rewrite that video's grid and panel images in the 3x3 file to match, and note what the agent said the trigger was so the next storyboard avoids it. The later videos are then written against what was actually generated.

If the agent cannot clear it, or there is no agent in the session, work through these retries in order, one change at a time, and stop at the first that passes: (1) replace every audio cell with "Soft background music. No dialogue."; (2) replace every VFX cell with `Effects: None. Transition: Hard Cut.` (`Holds on the final frame.` in the last row); (3) cut each `Action:` beat to its main clause, keeping three beats; (4) remove the `Avoid:` sentence from the clip prompt only, since a word like "horror" or "sharp teeth" can trip a filter even in a list of things to avoid, and the attached images keep it and carry the look into the clip; (5) swap the attached images for the other route's (the grid for panel images 3, 6, and 9, or the other way round), or generate from the table alone with no images attached and check the clip against the panel images, because the filter judges the attached images along with the prompt. Never change the character text, the `Lighting:` sentences, or any other lock.

Aspect ratio lock: vertical 9:16 for every clip, set in Flow's output format and stated in the first line of every prompt.

Head lock: no Yeti has horns, antlers, spikes, or anything on its head besides its tuft of fur. Every prompt says so after the character text. If a clip comes back with anything on a Yeti's head, regenerate it, and if its attached images have it too, regenerate them first, because a horned image carries the horns into the clip made with it.

Look lock: every Yeti is the stylized 3D cartoon described in section 8 of `.agents/rules/character-consistency.md`. Papa is sapphire blue with a messy tuft, Mama is bubblegum pink with a swept-back tuft, and Babu is mint green with a single curl and about half their height, each one solid colour with a smooth, matte, lighter face and paws, and none of them wears anything. Every prompt carries the look lock and the avoid line, and every shot with the baby Yeti and a grown-up Yeti in it carries the scale lock. <Name the shots that carry the scale lock.> Run the look check on every clip. A clip that fails it is regenerated and never used.

<If any: Human lock and/or Animal lock: the supporting cast sentence(s), word for word, and where each supporting character is and what it does in each video.>

Prop lock: <every prop, what it is made of, where it sits. No brands, labels, or packaging.> No dialogue in any shot.

Lighting lock: <every light source in the environment, where it sits in the frame, its colour temperature, and the palette. Then how the light moves across the film: which video the light changes in, what changes it, and what it becomes.> Every clip keeps a soft warm light on the fur. The light at each handoff is the same on both sides of the cut.

VFX lock: <each effect and the video it belongs to. Weather that runs through the whole location is in the `Environment:` sentence and is not listed here.> No effect comes from a Yeti, and none appears in a video that this paragraph does not give it to.

## Video 1 - <Title>

Film position: 00:00 - 00:10.

Stage: Exposition, Inciting Incident, start of Rising Action.

| Timestamp | Shot Type | Visual Description / Prompt | VFX | Audio / Sound FX |
| --- | --- | --- | --- | --- |
| **00:00 - 00:03** | <Framing>, <Angle> | Vertical 9:16 aspect ratio, full-frame vertical composition. <Style lock> Environment: <sentence>. Lighting: <key, fill, rim, quality and direction, contrast, colour temperature and palette, mood>. <Character text>. Head lock: each Yeti has a smooth, rounded, fully furred head, and the tuft of fur is the only thing on top of it; there are no horns, no antlers, no spikes, no bumps, and no headwear. Look lock: each Yeti is a stylized, friendly 3D animated character with a soft, plush, rounded shape, it wears nothing but its own fur, and that fur is one solid colour from head to toe, with only the face and paws a lighter shade. <Scale lock: the baby Yeti is about half as tall as each grown-up Yeti in the shot. (only when both are in frame)> <Humans: / Animals: sentences if any> Avoid: photorealistic humans, scary monsters, horror elements, flat lighting, urban environments, extra Yetis, and, on any Yeti, human skin, visible pores, sharp teeth, sharp claws, white or grey fur, clothing, hats, or accessories. Action: <Beat 1, one sentence ending on a picture.> <Beat 2, one sentence ending on a picture.> <Beat 3, one sentence ending on the shot's closing picture, with the feeling in the slot.> Camera: <one move, direction, speed, what it reveals or ends on>. | Effects: <what renders, how it meets the light and action, or None>. Transition: Hard Cut. | <Music state, ambient sound, sounds for each action and effect.> No dialogue. |
| **00:03 - 00:07** | ... | ... Action: <three beats; the middle beat sits on 00:05> ... | Effects: ... Transition: Hard Cut. | ... |
| **00:07 - 00:10** | ... | ... Action: <three beats; the third is the video's closing picture> Camera: <move>, easing to a stop in the last half second. | Effects: ... Transition: Holds on the final frame. | ... |

## Video 2 - <Title>

Film position: 00:10 - 00:20.

Stage: Rising Action, Climax (peaks at 00:05 on this clock, film 00:15, in the middle beat of Shot 2), start of Falling Action.

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10. Shot 1's first beat picks up Video 1's closing picture, under Video 1's Shot 3 light ... |

## Video 3 - <Title>

Film position: 00:20 - 00:30.

Stage: Falling Action, Resolution.

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10. Shot 3's last beat is the held, resolved closing image of the film, with the music finishing ... |
```
