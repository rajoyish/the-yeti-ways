---
name: storyboard-30s-extender
description: >-
  Trigger when the user asks to extend, expand, or revise a short Yeti storyboard into a
  30-second version, says "30s storyboard", "three 10-second videos", or runs
  "/storyboard-30s". Takes a short storyboard (a file path or pasted markdown, including a
  source storyboard from `video-to-storyboard`) and writes a coherent 30-second storyboard
  as three 10-second Google Flow videos, with framing and angle, lighting, one camera move,
  and VFX directed on every shot. Every shot's action is written as two beats, so each
  video maps onto the six panel images that `create-3x2-timed-image` writes next and
  composes into a 3x2 grid. Each table is the master for its video, and a compact Agent prompt under it is
  what Google Flow receives, with every saved Character called with @ once, in its Cast line, and
  never described. Everything outside the tables and locks is addressed to the Flow Agent, never to
  the operator: three Agent instruction cards, a setup prompt for the plates, and one Agent prompt
  per video. Every clip is 10 seconds on
  Gemini Omni Flash 1.1, in a new Flow project, as `.agents/rules/google-flow.md` sets out. The file
  holds video prompts only: the panel image prompts go in the 3x2 file.
---

# 30-second storyboard extender

This skill turns a short storyboard (usually 10 to 15 seconds, 3 to 4 shots) into a 30-second storyboard built as three 10-second videos for Google Flow. It is step 1 of the pipeline in section 7 of `.agents/rules/cinematic-direction.md`. Each video's table is the master for one 10-second clip, and the `Agent prompt:` block under it is the text Flow receives. Every shot's `Action:` is two beats, so each video has six beats, and `create-3x2-timed-image` turns those six beats into the six panels of the video's 3x2 grid. The storyboard holds video prompts only. Every image prompt for the film, each video's six panel images, goes in `prompts/<kebab-case-title>-30s-3x2.md`, which `create-3x2-timed-image` writes, and in Flow each clip is generated, in a new project for the film, from its Agent prompt with the saved Characters and the previous clip's saved end frame, as `.agents/rules/google-flow.md` sets out. Everything else in the file is addressed to the Flow Agent, never to the operator: the three Agent instruction cards, the Agent setup prompt that generates the plates, and the Agent prompts. The continuity between the three clips lives in the storyboard text and in that end frame: the first beat of each video picks up the picture the previous video ended on.

Every shot is directed as well as described: its framing and angle, its light, one camera move, its visual effects, and the transition out of it, in the fixed terms of `.agents/rules/cinematic-direction.md`.

The reference output is `prompts/papa-yeti-five-stance-kung-fu-30s-storyboard.md`. Match its structure. It predates the character locks and the saved Characters (it carries the older character text and head lock; revise them as section 9 of `.agents/rules/prompt-assembly.md` says, and give it the Agent instruction cards, Agent setup prompt, and Agent prompts of the template below), the aspect ratio lock, the `Stage:` line under each heading, the two-beat `Action:`, and the cinematic direction (the angle in the Shot Type cell, the `Lighting:` and `Camera:` sentences, and the VFX column), so add all of those. It also carries keyframe lines from the retired start-and-end-frame workflow; leave those out.

## Rules that always apply

Read these before writing anything:

- `.agents/rules/character-consistency.md`: how Papa Yeti, Mama Yeti, and Babu Yeti look. The storyboard never copies a lock or describes a Yeti's look: each Yeti is a saved Flow Character, named in the cells and called with `@` once in each Agent prompt, and the Character carries the look. Its Allowed Variations and Prohibited Changes also bind every `Action:` and `Expressions:` sentence: faces move only the eyebrows, eyelids, cheeks, and mouth, and no action changes a Yeti's design or merges two Yetis. Use this default file, never `character-consistency-alt.md`, unless the user asks for the alternate by name (the note at the top of `prompt-assembly.md` says why).
- `.agents/rules/prompt-assembly.md`: the style lock, the order of the pieces in a visual cell, the `Characters:` and `Expressions:` sentences, the expression table (section 4), the avoid line, the main characters and story cast rules (section 6), the prompt construction rules, and the originality pass (section 10).
- `.agents/rules/cinematic-direction.md`: the terms and project limits for shot type and angle, lighting, camera movement, VFX, transitions, and sound, the panel map that ties each video to its 3x2 grid (section 6), and the pipeline (section 7).
- `.agents/rules/google-flow.md`: what Flow's docs confirm (every clip is Gemini Omni Flash 1.1, 10 seconds), the saved Characters (section 2), the new project per film (section 3), the ingredients for each clip and the saved end frame that carries continuity (section 4), the three Agent instruction cards (section 5), and the `Agent prompt:` format (section 6).
- `.agents/skills/social-media-prompt-creator/SKILL.md`: platform and safety guidelines. The output is a video prompt, so section 1 (the "never" list) and the visual tip about backgrounds apply directly.

- The Yetis are the main characters; the story decides everything else. Papa Yeti, Mama Yeti, and Babu Yeti never change: the same locks, the same names, the same family, and no one replaces them. Every other choice belongs to the story, as section 6 of `prompt-assembly.md` sets out: the genre, the setting, the music, and who does what. A Yeti may teach or be taught, rescue or be rescued, and a story cast member (human, animal, or invented creature) may hold any role the story needs, including a mentor, a guide, a rival, or the one who helps. Keep the source's cast and roles when they work, and recast only where the story is stronger for it. The film stays about the Yetis: the camera stays with at least one of them, and the main emotional turn belongs to at least one of them.
- Only 3 Yetis: Papa, Mama and Babu Yetis should be shown in the videos, no extra Yetis other than that or more than 3 Yetis.
- Humans can be cast in any role. Draw them in the same stylized 3D animated style as the Yetis, as original designs with expressive cartoon features, never photoreal, never the likeness of a real person, and never the design of an existing film or game character. Dress them for the story's world and era (an old teacher's plain wrapped robe and cloth sash, a fisher's oilskin coat, a cook's apron), with no logos or writing. Describe each kind of story cast once in a locked `Humans:`, `Animals:`, or `Creatures:` sentence, with a short handle for each member that the `Action:` text reuses, copied word for word into every prompt. A member already saved as a Flow Character (its file in `prompts/characters/`) is never described: the sentence only names and places it by its Character name, as section 6 of `prompt-assembly.md` sets out, and the `Action:` text uses that name. A human child stays with an adult, never enters water, never falls, and is never alone in danger; the safety filter reads a child in peril as harm, so write worry, not terror.

Flow-specific constraints, learned from clips that the content filter rejected:

- No dialogue. Every audio cell ends with "No dialogue."
- No brand names, logos, packaging, labels, or on-screen text.
- No real devices (phones, tablets, cameras). Use in-world props, such as a carved ice tablet.
- No stock sound effect names (record scratch, cartoon boing, sad trombone). Describe each sound from scratch.
- No plain, white, or empty backgrounds. Every shot has an "Environment:" sentence.
- No horns. The Yetis have none, but the model adds horns, antlers, or spikes to a "Yeti" when the prompt leaves the top of the head undescribed, and once a grid panel or a panel image has them, the clip made with that image keeps them. Every character lock says the tuft is the only thing on the Yeti's head, and no `Action:` sentence puts a hand or prop on or above a Yeti's head (no hands folded up beside the head for a sleep mime, no arms raised overhead). Keep mimes at chest height. A head touch the story needs, such as a tuft ruffle, says the hand lifts away in the same sentence.
- Same look in every shot. Left to itself, a model turns a "Yeti" into a white, ape-like snow monster, dresses characters standing in snow in scarves and hats, and draws Babu at any size from a doll to a third grown-up, and each clip copies whatever its attached grid or panel images show. Each Yeti is a saved Flow Character that holds its colour, tuft, face, build, and the fact that it wears nothing, so no sentence in the storyboard describes or changes them, and every visual cell carries the avoid line from section 5 of `prompt-assembly.md`. Size is the one thing a Character cannot carry, so the height sentence in each Agent prompt's `Cast:` line carries it; no height chart is attached to a card or a clip. The `Characters:`, `Expressions:`, and `Action:` text names each Yeti by name ("Papa Yeti", "Mama Yeti", "Babu Yeti"), never by colour, and agrees with the Characters (five-fingered hands and five-toed feet, never paws; nothing worn; Babu Yeti about half a grown-up's height, with the top of his curl only at a grown-up's belly). No sentence sizes a place or a prop by a Yeti ("a pillar as tall as a grown Yeti"), because that sentence runs in every shot and puts the Yeti into the ones where it is absent.
- Faces match the beat. The character text used to carry a fixed "wide cheerful toothy smile", and Flow obeyed it over anything the `Action:` sentence said, so Yetis grinned through a rescue. The Characters carry no expression, and each visual cell states every Yeti's face in an `Expressions:` sentence. Fill it per shot from the table in section 4 of `prompt-assembly.md` with the feeling each Yeti holds at the end of the shot, and write the same feeling in the `Action:` sentence. No smile of any kind on a beat of danger, worry, effort, sadness, or loss. A smiling grid panel or panel image carries its smile into the clip made with it, so an image or clip that smiles on the wrong beat gets regenerated, never used.
- Vertical 9:16 only. Flow renders 16:9 unless the prompt and the output setting both say otherwise, so every visual cell opens with the aspect ratio line and the operator sets Flow to 9:16 before generating. A clip that comes back 16:9 gets regenerated, never cropped.
- Original, not copied. Flow's second refusal, "I can't generate the video you requested right now due to interests of third-party content providers", is the copyright filter, not the safety filter. It does not object to genres or tropes (a training run, a mentor's gift, a rescue, magic); it objects to names and to near-copies of a specific character or scene. Run the originality pass in section 10 of `prompt-assembly.md` on every video: no names of protected work and no "in the style of", every story cast design invented from scratch, at least two of setting, key prop, key action, and framing changed wherever a beat sits close to a famous scene, magic that comes from the world or a prop rather than energy sent out of a Yeti, and music described by genre, mood, tempo, and instruments.
- Direction goes to Flow too. The Agent prompt is written from the whole row, VFX cell included, so every word in the `Lighting:`, `Camera:`, `Effects:`, and `Transition:` text is an instruction the filters read. No energy sent out by a character, no explosion, and no strobe effect, no named film, studio, or colour grade, and no edit instruction (a fade, a dissolve, a speed change) inside a table or an Agent prompt. The edit uses hard cuts, and the file holds no edit instructions.
- No pipe character (`|`) inside a cell. A stray pipe splits the cell and shifts every column after it.
- Sound designed for the story. Every film gets its own score and sound world, planned once for the film in step 1 (section 5 of `cinematic-direction.md`) and summarised in Instruction 2: a palette of two to five instruments chosen for the story's world and mood, how the music moves across the videos, and each location's ambient bed. Do not reuse a past film's palette by habit. The palette may change on story beats (drums drop out when the tension breaks, strings come in for the ending), and the music at each handoff is the same on both sides of the cut. Each audio cell names the instruments playing in that shot, their tempo, and their feeling. Never a named song, composer, artist, or soundtrack, never lyrics or sung words, and no key changes, chord names, or arpeggio directions; wordless vocal textures are allowed.
- Every video table runs on its own clock, from 00:00 to 00:10. Flow reads the timestamps in a prompt as that clip's clock. A table that starts at 00:10 or 00:20 makes Flow try to render a 20- or 30-second clip, split the prompt into several clips, or fail with an error. The film-level position of a video lives in a `Film position:` line outside the table and is never pasted into Flow.
- Beats come first, and the grid is built from them. Every shot's `Action:` is exactly two sentences, one per beat, and each beat becomes one panel of the video's 3x2 grid, as the panel map in section 6 of `cinematic-direction.md` sets out: three shots, six beats, six panels per video. `create-3x2-timed-image` builds each grid, and a full-size image of each panel, from these beats. Six beats give each moment of the clip its own checked picture, which the operator checks the clip against. Write every beat to end on one picture a viewer could photograph: positions, poses, hands, props, eye lines, and any face that changes. A beat that only describes motion, or leaves a character's position unstated, produces a panel that fights the clip.
- No keyframe lines, and continuity carried by the saved end frame. The storyboard carries no `Frames:`, `Start frame:`, `Midpoint frame:`, or `End frame:` lines, and no generated image is ever set as a clip's first or last frame. What opens each clip after the first is the real last frame of the previous approved clip, saved in Flow, as section 4 of `.agents/rules/google-flow.md` sets out, so the first beat of each video after the first describes exactly the picture the previous video's last beat ended on, and the last beat of each video ends on a clean, held picture worth saving.
- Video prompts only. Apart from the plates in the Agent setup prompt, the storyboard holds no image prompt: no `Create image:` line, no `Grid:` or `Stills:` line, and no step for generating or checking an image. Every image prompt goes in the 3x2 file that `create-3x2-timed-image` writes, and the clips do not need it: the storyboard never names it as a step.
- Agent prompt under every table. Flow receives a compact `Agent prompt:` block, not the table: the table is the master that the panel images and the checks are built from, and it repeats pieces that would bury the few words each shot needs. Under each table write the `Agent prompt:` block that section 6 of `.agents/rules/google-flow.md` sets out. Its first line tells the Agent which video to generate and names its opening image. Its `Cast:` line calls every saved Character, Yeti or story cast, with `@` once; every later mention is the plain Character name (`Babu Yeti`, `Nuri Bear`), never `@` again and never a description. Keep it in step with the table: the same shots, beats, faces, light, camera, and sound, shortened, never added to.
- Written for the Agent. Nothing in the file is an instruction to the operator: no Flow setup section, no `Ingredients:` line, no "With the Agent on, add" line, and no steps for creating the project, checking Characters, uploading, checking, upscaling, or assembling. Those live in `.agents/rules/google-flow.md`. What the file says to Flow, it says to the Agent: the instruction cards, the setup prompt, and the Agent prompts.
- Agent instructions in every storyboard. The file writes the three cards of section 5 of `.agents/rules/google-flow.md` under `## Google Flow Agent instructions`: Instruction 1 and Instruction 3 word for word (with the number of videos filled in), and Instruction 2 written for this film from its tables and the plan from step 1, under about 250 words, naming characters by their saved Character names, the opening image of each video, and any likely filter trigger with its fallback wording.
- Agent setup prompt. Under `## Agent setup prompt`, one `text` block asks the Agent to generate each location plate with Nano Banana Pro, vertical 9:16, names each `Plate - <Location>`, gives each plate's prompt as section 3 of `.agents/rules/google-flow.md` sets out (without the `Create image:` prefix, since the block's first sentence asks for the image), and says not to generate any video yet. It is the one image prompt a storyboard holds.
- Every clip is 10 seconds on Gemini Omni Flash 1.1, vertical 9:16, made in a new Flow project for the film. No step or prompt names another model, length, or orientation.

## Workflow

### 1. Read the short storyboard

Take the input as a file path under `prompts/` or as pasted markdown. Extract and write down, before drafting:

- Title and one-line premise.
- Environment sentence, exactly as written.
- Which characters appear, which side of the frame each one is on, and what role each one plays (who notices the problem, who acts on it, who resolves it, who teaches, who helps). Map the source's lead to the Yeti the user names (a small creature or child is usually Babu Yeti, a father figure Papa Yeti, a mother figure Mama Yeti), and keep, change, or invent story cast for the rest: humans, real-world animals, or creatures of your own, whichever fits the story. Each kind gets one locked `Humans:`, `Animals:`, or `Creatures:` sentence, copied word for word into every prompt, as in `prompts/yeti-family-river-rescue-30s-storyboard.md` (humans) and `prompts/papa-yeti-warm-dome-30s-storyboard.md` (animals).
- Every prop.
- Every story beat, in order, including facial expressions and gestures.
- Which beat is the Inciting Incident (the one event that breaks normal) and which is the Climax (the point of highest tension, decided by what a Yeti does). A short storyboard often has both inside a few seconds; the 30-second version gives each its own room.
- Audio: the music's genre, instruments, tempo, and how it resolves, and the sound world of each place. They become the film's music plan, designed for this story: every audio cell follows it, and Instruction 2 summarises it.
- Every location the story visits, in order, and the light at each: time of day, weather, and every light source the location holds (sun, sky, hearth, lantern, street lamps, glowing moss). Each location gets its own `Environment:` sentence (step 3), and the light becomes the film's lighting plan: every `Lighting:` sentence draws on it, and Instruction 2 summarises it. Plan which effects belong to which video the same way, so an effect never leaks into a clip that should not have it. These plans are working notes, not sections of the file. If a location needs a source it lacks, add it to that location's `Environment:` sentence now.
- Any camera moves, effects, and transitions the source names, with a note on which ones pass the limits in `cinematic-direction.md`.
- The final state of the scene.

The input may be a source storyboard from `video-to-storyboard`: a five-column table (`Timestamp | Shot Type | Visual Description | VFX | Audio / Sound FX`) with `**Environment:**`, `**Lighting:**`, `**Subjects & Action:**`, and `**Camera Movement:**` in the visual cells and `**Observed:**`, `**Transition:**`, and `**Recommended:**` in the VFX cells. Read it the same way. Its environments become the `Environment:` sentences, one per location, kept or changed to suit the Yeti version. Its lighting becomes the lighting plan. Its subjects and action become the beats, with the Yeti the user names in the lead role and the rest of the cast kept, changed, or invented to suit the story. Run the originality pass in section 10 of `prompt-assembly.md` on it: the source is a guide to pace, energy, and sound, not a scene to copy. Its camera moves and observed effects are kept where they pass the limits and replaced where they do not (a fire beam becomes a thrown snowball, an explosion becomes a cloud of powder snow off a falling slab). Its recommended moves and effects are options, not beats. Its dialogue becomes gesture, as in step 2 of `storyboard-60s-from-story`.

Nothing in this list may be dropped from the output. The 30-second version contains every beat of the short one, in the same order, with new beats added around and after them.

### 2. Plan three videos

The 30-second film follows the six classic stages of plot structure, in order: Exposition, Inciting Incident, Rising Action, Climax, Falling Action, Resolution. The pacing rule is fixed: the first 15 seconds build the conflict (Exposition through Climax) and the last 15 seconds release it (Falling Action and Resolution). The Climax peaks at film 00:15, which is 00:05 on Video 2's clock: the end of the first beat of Video 2's Shot 2, and panel 3 of Video 2's grid, the last panel of its top row.

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
| 00:13 - 00:17 | Video 2, shot 2 | Climax, peaking at 00:15 at the end of the shot's first beat: the point of highest tension, decided by what a Yeti does | Low-key and hardest. A Low Angle Dolly In or an Arc around the Yeti who acts |
| 00:17 - 00:23 | Video 2, shot 3 and Video 3, shot 1 | Falling Action: the immediate consequences, the tension draining | Warmth returns. A slow Dolly Out or a Static hold |
| 00:23 - 00:30 | Video 3, shots 2 and 3 | Resolution: the new normal, held. The added beat that deepens the ending lives here | Soft, warm, golden, high-key. A Crane Up or slow Dolly Out that leaves the family small and warm, or a Static hold |

Adapt the light and camera to the story, within the limits of `cinematic-direction.md`. The light only changes where section 6 of that file allows: never during a Shot 1, and in a Shot 2 or a Shot 3 only during its first beat.

Video 2's middle shot is the hinge. Its first beat builds to the peak and ends on it (the moment of highest tension, with the peak feeling named on every face), and its second beat begins the release. Its `Expressions:` sentence holds the feeling at the end of the shot, which is the first feeling of the Falling Action, not the peak. Nothing after 00:15 introduces a new problem, and nothing before it resolves one.

Give each video a short title in the heading, such as "Video 1 - The Spill". The number and the title are separated by a spaced hyphen (` - `), never a colon. The heading carries no timestamps. The film position goes on its own `Film position:` line directly under the heading, the stages that video carries go on a `Stage:` line directly under that. The 3x2 file and every image in it reuse this heading, so choose the title once and never change it.

The new beats must grow from what is already there. Good extensions: the other character reacts, the two characters do the last action together, a prop is put to a second use, a small gesture of affection closes the scene. Bad extensions: a location, character, or prop that changes the story rather than deepening it, a joke that undercuts the mood, a stretch where the camera leaves the Yetis for long.

### 3. Write the shots

Each video has three shots. Every video's table starts at 00:00 and ends at 00:10, no matter where the video sits in the film. Video 2 and Video 3 do not continue the clock from 00:10 or 00:20. The split is fixed: `00:00 - 00:03`, `00:03 - 00:07`, `00:07 - 00:10`, the same three ranges in all three videos, because the panel timecodes in every grid are built on it. Normalize input timestamps that have gaps or a different split to these three ranges.

Each table has five columns: `| Timestamp | Shot Type | Visual Description / Prompt | VFX | Audio / Sound FX |`. Every cell uses the same labels in the same order in every row, and no cell contains a pipe character.

The Shot Type cell names the framing from the ladder in section 1 of `cinematic-direction.md`, then the angle: `Wide Shot, Eye Level`, `Medium Two-Shot, Low Angle`, `Close-Up, Eye Level`. When the camera move changes the framing, name both ends: `Medium Shot to Close-Up, Eye Level`. Vary the framing across each video, and do not repeat the same framing three times in a row. The grid takes each panel's framing from this cell, as section 6 of `cinematic-direction.md` sets out. Include exactly one close-up shot per video to capture the facial expressions or emotions of the main or side characters relevant to the scene.

No `Character locks:` block goes above a table, and no cell describes a Yeti's look: the saved Characters carry it (section 3 of `prompt-assembly.md`). Directly under the video's `Stage:` line goes a `Characters:` line naming everyone in the video, and the table follows.

Every visual cell follows this order, with each piece copied exactly:

1. Aspect ratio lock: `Vertical 9:16 aspect ratio, full-frame vertical composition.` Word for word, in every cell, before anything else.
2. Style lock, from section 1 of `prompt-assembly.md`.
3. `Environment:` sentence for the shot's location. Each location the story visits has one sentence, decided in step 1 and identical, word for word, in every shot at that location, including any hearth, props, or set dressing you add. A location can change at a cut between shots, since both panels of a shot share its location, or at a video boundary under a `Scene break:` line (step 4). Three or four locations is plenty for 30 seconds; give each at least one full shot.
4. `Lighting:` one sentence naming the key, fill, and rim, their quality and direction, the contrast, the colour temperature and palette, and the mood, as section 2 of `cinematic-direction.md` sets out. Every source it names is in the `Environment:` sentence, and it keeps a soft rim or fill on the fur so each Yeti's colour reads true. It holds the light at the end of the shot.
5. `Characters:` sentence naming the Yetis in the shot and where each stands, left to right, in the forms section 3 of `prompt-assembly.md` gives (`Characters: Babu Yeti.`, `Characters: Papa Yeti on the left and Babu Yeti on the right.`, `Characters: Papa Yeti on the left, Babu Yeti in the center, and Mama Yeti on the right.`). Keep the same Yeti on the same side in every shot unless the action moves them, and if it moves them, keep them there for every later shot. A shot without a Yeti says `No Yeti is in this shot.` instead.
6. `Expressions:` sentence giving each Yeti in the shot, in the same order, a face from the section 4 table of `prompt-assembly.md`: the feeling that Yeti holds at the end of the shot (`Expressions: Papa Yeti, <row>; Babu Yeti, <row>.`). Left out in a shot with no Yeti.
7. Story cast, if any: a `Humans:`, `Animals:`, or `Creatures:` sentence for each kind, describing every member of the story cast, identical in every shot across all three videos.
8. Avoid line, word for word, from section 5 of `prompt-assembly.md`, after the supporting cast sentences (or after the `Expressions:` sentence, or the no-Yeti sentence, when there are none).
9. `Action:` exactly two sentences, one per beat, in order. Each beat is concrete body movement, expression, and eye line, and ends on a picture (step 3's beat rules below). Expand the `Action:` block with highly detailed, descriptive physical actions and movements based on the video prompt's context. The feeling named in the second beat must agree with the `Expressions:` sentence; if a feeling changes during the shot, the beat where it changes names the new feeling, and the `Expressions:` sentence holds the destination. If the light changes, the first beat says so, and the `Lighting:` sentence holds the new light.
10. `Camera:` one sentence naming one move from the list in section 3 of `cinematic-direction.md`, then its direction, its speed, and what it reveals or ends on. The move matches the Shot Type cell: a move that changes the framing starts on the first framing named there and ends on the second.

The two beats of each shot become the shot's two panels in the grid, so write them to the panel map in section 6 of `cinematic-direction.md`:

- Beat 1 starts from the shot's opening picture, covers the first half of the shot, and ends on a picture seen in the shot's opening framing. In Shot 1 of Video 2 and Video 3, it holds the picture the previous video's last beat ended on, with the same positions, hands, props, eye lines, and faces and at most a small change (a face that starts to change, a turn of the head). In Shot 2 it ends on 00:05, the centre of the clip; in Video 2 that is the Climax peak.
- Beat 2 covers the second half and ends on the picture the shot closes on, seen in the shot's closing framing, with the feeling in the `Expressions:` sentence. In Shot 3 it is the video's closing picture, which the next video's first beat picks up.
- Each beat is one sentence with a full stop at its end, and no sentence straddles two beats. A beat may carry two linked actions (a hand that reaches, then lifts the bird free) as long as it ends on one picture. Name each Yeti in every beat it is in, by name, and say where it is. A character who leaves or enters the frame does so inside a beat, and the beat says so.
- A Yeti the shot's `Characters:` sentence names is in the shot, and a Yeti who is not in the shot is left out of its `Characters:` and `Expressions:` sentences and named in its `Action:` as `<Name> is not in the shot.` A Yeti named as present who is absent puts that Yeti on screen.

Every VFX cell holds two labelled sentences, in this order:

- `Effects:` what Flow renders in this shot, from the effects in section 4 of `cinematic-direction.md`: what each effect does and how it meets the light and the action. Every effect has a cause in the `Environment:` sentence or the `Action:` text, and none comes from a Yeti. `Effects: None.` when the shot has none.
- `Transition:` `Hard Cut.` or `Match Cut.` (with what it matches) for Shots 1 and 2, and `Holds on the final frame.` for Shot 3. The cut to the next video happens in the edit.

Every audio cell names the music state (starts, continues, builds, pauses, swells, resolves) and the instruments from the music plan carrying it, the ambient sound of the place, a sound for each physical action and each visible effect, and ends with "No dialogue."

### 4. Lock the continuity between videos

No clip starts or ends on a supplied image, so each handoff between videos is held by the text of both tables. Follow section 6 of `cinematic-direction.md`:

- Picture. The first beat of Shot 1 in Video 2 holds the picture the second beat of Video 1's Shot 3 ends on: the same characters in the same places, the same hands and props, the same eye lines, and the same faces. Video 3's first beat picks up Video 2's last beat the same way. Only the framing may differ, because each shot has its own. Panel 1 of each grid then shows the same picture as panel 6 of the grid before it.
- Face. The feeling a Yeti holds at the start of a video's Shot 1 is the feeling in the previous video's Shot 3 `Expressions:` sentence. If it changes in Shot 1, the beat where it changes says so.
- Light. The `Lighting:` sentence of Video 2's Shot 1 is Video 1's Shot 3 `Lighting:` sentence, word for word, and Video 3's Shot 1 copies Video 2's Shot 3 the same way. The light never changes during a Shot 1, and a change in a Shot 2 or a Shot 3 happens in its first beat.
- Camera. Every Shot 3 `Camera:` sentence ends by easing to a stop, and every Shot 1 `Camera:` sentence in Videos 2 and 3 starts from rest.
- Scene break. When the story jumps to a new place or time between videos, mark the next video with a `Scene break: <what changes>.` line directly under its `Stage:` line. Its first beat opens in the new location on a new picture instead of holding the previous one, and its Shot 1 `Lighting:` sentence is that location's own; the picture and light rules above do not apply across that cut. Use it only where the story jumps; that video's Agent prompt opens on the new location's plate, and Instruction 2 names which video starts a new scene.

### 5. Write the file

Save to `prompts/<kebab-case-title>-30s-storyboard.md`. Derive the kebab-case title from the short storyboard's title, dropping the word "storyboard" and any leading article. Never overwrite the short storyboard.

Use the template below. Everything in it that is not a table is addressed to the Flow Agent. The `## Google Flow Agent instructions` section holds the three cards for Flow's Agent instructions panel (section 5 of `.agents/rules/google-flow.md`), and the `## Agent setup prompt` section holds the one prompt that generates the plates. The file has no film locks section: the tables carry every sentence word for word, and Instruction 2 carries the summary the Agent needs.

What Flow receives is one video at a time: its `Agent prompt:` block and nothing else, which names its own opening image. The tables, headings, the `Film position:`, `Stage:`, and `Scene break:` lines stay in the file for the image skills and the editor; the Agent instruction cards and the setup prompt go into Flow once per project. The steps for setting up the project and checking clips live in `.agents/rules/google-flow.md`, never in the storyboard.

Then name the next step. If the user asked only for the storyboard, say that the clips can be generated in Flow straight from this file, and that `/create-3x2-timed-image` on this storyboard is optional: it writes the image prompts, six panel images for each video, and composes each video's 3x2 grid from the generated panel images, for checking clips or guiding a hard beat. Run it as its own step, not in this run. If the user asked for the images too, finish and verify this file first, then run `create-3x2-timed-image` on it.

### 6. Revise an older storyboard

Five kinds of older storyboard need this step. One written before the grid pipeline has `Frames:` lines under its headings and `Start frame:`, `Midpoint frame:`, and `End frame:` lines under its tables, and its agent instructions tell the operator to set start and end images. One written before the storyboard held video prompts only has `Grid:` and `Stills:` lines under its headings, and its agent instructions say how to generate and check grids and reference stills. One written for the retired 3x3 grid has three beats in every `Action:`, and its agent instructions name a `-3x3.md` file and panel images 3, 6, and 9. And any storyboard written before the character locks has short character text with an `[EXPRESSION]` slot, `Head lock:`, `Look lock:`, and `Scale lock:` sentences in its cells, and names the Yetis by colour. And any storyboard written before the saved Characters has a `Character locks:` block above each table, Flow tags with descriptions in its Flow prompts (`@Papa Yeti (the father: ...)`), and a single `## Agent instructions` section. When this skill or `create-3x2-timed-image` works on any of them, bring it up to this skill's format first, without changing a story beat, a light, a framing, or a face:

1. If it has `Character locks:` blocks or Flow tags, delete every `Character locks:` block, replace each Flow tag with its bare `@` name, add the `Cast:` height sentence where Babu Yeti shares a shot with a grown-up, and turn each `Flow prompt:` block into the template's `Agent prompt:` block. Replace any `## Agent instructions` or `## Flow setup` section with the template's `## Google Flow Agent instructions` (three cards), and `## Agent setup prompt` sections, carrying the light, music, cast, and opening images into Instruction 2 and every film-specific note (a recorded filter trigger) into it too. Delete any `## Film locks` section and lock paragraphs once that is done.
1a. If its Flow prompts are in the older format (a `Flow prompt:` block with an `Ingredients:` line above it and "With the Agent on, add" under it, and `@` on every mention), rewrite each as an `Agent prompt:` block: its opening line names the video and the images from the old `Ingredients:` line, `@` stays only in the `Cast:` line, and every other mention is the plain name. Replace any story cast sentence describing a saved Character with the placement-only sentence of section 6 of `prompt-assembly.md`.
2. If it predates the character locks, revise it as section 9 of `prompt-assembly.md` sets out: replace each cell's character text with a `Characters:` sentence and its `[EXPRESSION]` values with an `Expressions:` sentence, delete the head, look, and scale lock sentences, and rename the Yetis in every `Action:` from colour to name. Update the film locks to the template's.
3. If it has keyframe lines, rewrite each `Action:` as two beats that follow step 3. Use the deleted keyframe lines as the pictures: Shot 1's first beat opens on the `Start frame:` picture, Shot 2's first beat ends on the `Midpoint frame:` picture, and Shot 3's second beat is the `End frame:` picture.
4. If its `Action:` cells have three beats, rewrite each as two. Keep the picture the first beat opens on and the picture the third beat closes on, and fold the middle beat into the neighbour it belongs with, keeping its actions and faces. In Shot 1 of Video 2 and Video 3, fold it forward into the second beat, so the first beat still holds the handoff picture. In Video 2's Shot 2, keep the Climax peak at the end of the first beat.
5. Delete every `Frames:`, `Start frame:`, `Midpoint frame:`, `End frame:`, `Grid:`, and `Stills:` line, and any `Create image:` prompt.
6. Replace any older agent instructions with the template's sections, dropping any lock paragraphs and carrying over any film-specific note (a likely filter trigger, a changed aspect ratio) that does not rely on start or end frames. Move any note about the images themselves (which characters may appear in which images, an image that has to be regenerated) into the intro of the 3x2 file. A note that names grid rows or panel numbers from the 3x3 grid is renumbered to the six-panel map.
7. Run the checklist in step 7, and tell the user the storyboard was updated.

A frames file in `image-prompts/`, from the start-and-end-frame workflow or the retired stills route, is left in place for the record. The panel images in the 3x2 file replace it.

### 7. Verify before finishing

Check every item. Fix and re-check rather than reporting a partial result.

- [ ] Three videos, each exactly 10 seconds. Every table has three rows, `00:00 - 00:03`, `00:03 - 00:07`, and `00:07 - 00:10`, in that order. No timestamp above `00:10` appears anywhere in a table.
- [ ] Each video heading reads `## Video N - <Title>` with a spaced hyphen, has no timestamps, and is followed, in order, by a `Film position:` line (00:00 - 00:10, 00:10 - 00:20, 00:20 - 00:30), and a `Stage:` line naming the stages that video carries.
- [ ] No keyframe lines remain: `grep -cE "^(Frames|Start frame|Midpoint frame|End frame):" <file>` returns 0, and the only opening image any Agent prompt names, after Video 1 and outside a scene break, is the saved end frame of the previous approved clip, never a generated image.
- [ ] The file holds video prompts only: `grep -cE "^(Grid|Stills):|Create image:" <file>` returns 0, and no step for generating or checking an image appears; the clips do not depend on `prompts/<kebab-case-title>-30s-3x2.md`. `grep -ciE "3x3|nine panel|panel images 3, 6" <file>` returns 0.
- [ ] Every beat of the short storyboard appears, in order.
- [ ] The six stages appear in order across the nine shots: Exposition, Inciting Incident, Rising Action, Climax, Falling Action, Resolution. The Climax peaks at film 00:15, at the end of the first beat of Video 2's Shot 2, and that beat names the peak feeling on every face. No beat after it introduces a new problem, and no beat before it resolves one. Each `Stage:` line matches what its video's shots do.
- [ ] Every `Action:` is exactly two sentences, one per beat, each ending on a picture, so each video has six beats for the six panels of its grid. Every Yeti in a beat is named by name and placed. The second beat of each shot ends on the feeling in that shot's `Expressions:` sentence. No shot's `Characters:` sentence names a Yeti its `Action:` says is not in it.
- [ ] Papa Yeti, Mama Yeti, and Babu Yeti are their saved Characters, never renamed, replaced, or described, the camera stays with at least one of them, and the main emotional turn belongs to at least one of them. Every story cast member has a role the story needs and is described in its locked cast sentence.
- [ ] Every visual cell opens with the aspect ratio lock line, before the style lock, in all nine shots.
- [ ] No character lock or Yeti description anywhere: `grep -cE "^Character locks:|\(the (father|mother|baby):|sapphire|bubblegum|mint-green|spiral curl|messy upward tuft" <file>` returns 0, outside a story cast sentence for a cast member with no saved Character. In every Agent prompt, each saved Character's `@` name appears exactly once, in the `Cast:` line, and every other mention is the plain name: `grep -o '@[A-Z][a-z]* [A-Z][a-z]*' <file>` finds only `Cast:` lines, the intro, Instruction 1, and the `Character lock:`.
- [ ] The file has no `## Flow setup` section and no instruction for the operator: `grep -cE "^## Flow setup|^Ingredients:|With the Agent on, add|^Flow prompt:" <file>` returns 0. It has `## Google Flow Agent instructions` with exactly three `### Instruction` cards, each with a `Reference:` line and one `text` block, then `## Agent setup prompt` with one `text` block, and no `## Film locks` section or lock paragraphs (`grep -cE "^## Film locks|^(Lighting|Music|VFX|Environment|Prop|Cast|Character|Aspect ratio) lock:" <file>` returns 0). Instruction 1 and Instruction 3 are word for word from section 5 of `.agents/rules/google-flow.md` (Instruction 3 with "3" filled in). Instruction 2 is under about 250 words, names characters by their saved Character names, names each video's opening image, and agrees with the tables.
- [ ] Every Agent prompt's first line names Omni Flash, vertical 9:16, and 10 seconds, and nothing in the file names another model, length, or orientation.
- [ ] The style lock is character-for-character identical to section 1 of `prompt-assembly.md` in every cell.
- [ ] Every visual cell with a Yeti has a `Characters:` sentence after the `Lighting:` sentence and an `Expressions:` sentence after it, naming the same Yetis in the same order. A cell with no Yeti says `No Yeti is in this shot.` and has no `Expressions:` sentence. `grep -cE "Head lock:|Look lock:|Scale lock:|\[EXPRESSION\]" <file>` returns 0.
- [ ] Every face in an `Expressions:` sentence is a row from the section 4 table of `prompt-assembly.md`, in the right column for that Yeti, matches the beat of its shot, and agrees with the expression in its `Action:` text. No shot on a beat of danger, worry, effort, sadness, or loss contains a smile of any kind. `grep "toothy smile"` on the file returns only shots whose beat is happy, playful, or proud.
- [ ] The avoid line follows the supporting cast in every visual cell, word for word: `grep '^| \*\*00:' <file> | grep -c "Avoid: "` returns 9.
- [ ] No `Action:` sentence puts a hand or prop on or above a Yeti's head without the hand lifting away in the same sentence.
- [ ] Every `Action:` beat, and every Agent prompt line, where a Yeti's hand does something visible (waves, claps, grips, points, holds, presses, reaches) says "five-fingered hand" or "five-fingered hands", and no sentence calls a Yeti's hands or feet paws.
- [ ] Every `Characters:`, `Expressions:`, and `Action:` sentence names each Yeti by name, never by colour, and every `Action:` agrees with the Characters: five-fingered hands and five-toed feet, never paws, nothing worn, Babu Yeti about half a grown-up's height, with the top of his curl only at a grown-up's belly. No sentence sizes a place or a prop by a Yeti.
- [ ] Each location has one `Environment:` sentence, identical in every shot at that location, and a location changes only at a cut between shots or under a `Scene break:` line.
- [ ] Left/right positions are stable.
- [ ] Every table has the five-column header `| Timestamp | Shot Type | Visual Description / Prompt | VFX | Audio / Sound FX |`, and every row has exactly six pipe characters, so no cell contains one. `awk -F'|' '/^\| \*\*00:/ && NF != 7' <file>` prints nothing.
- [ ] Every Shot Type cell names a framing from the ladder and an angle, and a shot whose move changes the framing names both ends, at most two rungs apart. No Bird's-Eye View or steep High Angle on a shot where a Yeti is more than small in the frame, and no Dutch Angle in the Resolution.
- [ ] Every visual cell has one `Lighting:` sentence directly after the `Environment:` sentence and one `Camera:` sentence at the end, after the `Action:` text. `grep '^| \*\*00:' <file> | grep -o "Lighting: " | wc -l` returns 9, and the same count for `"Camera: "`, `"Effects: "`, and `"Transition: "` returns 9 each.
- [ ] Every `Lighting:` sentence names only sources in the `Environment:` sentence, keeps a soft rim or fill on the fur so each Yeti's colour reads true, and follows the story's light arc (section 2 of `cinematic-direction.md`). No light from below a face, no strobing or flashing, no named film or grade.
- [ ] The light never changes during a Shot 1, and a change in a Shot 2 or a Shot 3 is described in its first beat. The Shot 1 `Lighting:` sentence of Videos 2 and 3 is word for word the Shot 3 `Lighting:` sentence of the video before, except under a `Scene break:` line.
- [ ] The first beat of Shot 1 in Videos 2 and 3 holds the same picture, with the same positions, hands, props, eye lines, and faces, as the last beat of the previous video's Shot 3, except under a `Scene break:` line, where it opens on the new location.
- [ ] Every `Camera:` sentence names one move from the list, with direction and speed, and agrees with its Shot Type cell. Every Shot 3 move eases to a stop, and every Shot 1 move in Videos 2 and 3 starts from rest. Whip Pan at most once, never at a shot's start or end.
- [ ] Every VFX cell has `Effects:` then `Transition:`. Every effect is on the list in section 4 of `cinematic-direction.md` and has a cause in the environment or the action, and no effect is energy, an explosion, a flash, on-screen text, a morph, or anything coming from a Yeti other than breath misting in the cold. Shots 1 and 2 end on `Hard Cut.` or `Match Cut.`, and every Shot 3 on `Holds on the final frame.` No fade, dissolve, or speed change inside a table.
- [ ] Every effect that makes a sound has that sound in the audio cell of the same row.
- [ ] Every audio cell ends with "No dialogue."
- [ ] Every video has an `Agent prompt:` block directly under its table, built as section 6 of `.agents/rules/google-flow.md` sets out: a first line naming the video, Omni Flash, 10 seconds, vertical 9:16, and its opening image (`Plate - <Location>` for Video 1 or a scene break, otherwise `End frame V<N-1>`); the style lock and the avoid line word for word; a `Cast:` line calling each saved Character with `@` once, with no description, and the Babu height sentence wherever he shares a shot with a grown-up; plain names after that; the three timestamps of its table in order; and the same beats, faces, light, camera, and sound as its table, with nothing added. No step that attaches a 3x2 grid or a triptych to a clip.
- [ ] No brands, real devices, stock sound effect names, on-screen text, or empty backgrounds. Any humans are stylized original 3D designs dressed for the story's world with no logos or writing, described in one `Humans:` sentence that is identical in every shot, and no human child is alone in danger.
- [ ] The originality pass in section 10 of `prompt-assembly.md` passes: no named protected work and no "in the style of", every story cast design is original, no beat copies a famous scene's setting, prop, action, and framing together, no character sends out energy, and every audio cell describes the music by the instruments, tempo, and feeling from the film's music plan, with no named song or artist.
- [ ] File saved in `prompts/` with a kebab-case name ending in `-30s-storyboard.md`.

## Output template

````markdown
# <Title> 30s Storyboard

<One or two sentences: what happens and the emotional tone. Keep the short storyboard's premise.> It has been strictly formatted for AI video generation according to character styling rules, environment locks, cinematic direction, and social media prompt guidelines.

Everything below is written for the Google Flow Agent: three instruction cards for the project, one setup prompt, and one Agent prompt per video. The saved Characters <@ name of each character in the film> carry every character's look, so nothing here describes them.

## Google Flow Agent instructions

### Instruction 1 - Yeti family series

Reference: None

```text
<Instruction 1 from section 5 of `.agents/rules/google-flow.md`, word for word.>
```

### Instruction 2 - <Title> story

Reference: `Plate - <first location>`

```text
<Written for this film as section 5 of `.agents/rules/google-flow.md` sets out, under about 250 words: the premise and tone; which characters, by their saved Character names, are in which videos and their roles; each location, its plate, and its videos; each video's opening image; the light; the music palette and how it moves; the key props; any scene break; any likely filter trigger with its fallback wording. No description of how any character looks.>
```

### Instruction 3 - Clip rules

Reference: None

```text
<Instruction 3 from section 5 of `.agents/rules/google-flow.md`, word for word, with three as the number of videos.>
```

## Agent setup prompt

```text
Generate <one image, or one image per location> with Nano Banana Pro, vertical 9:16, and name <it, or each> "Plate - <Location>". <What each plate is for, e.g. the empty location Video 1 opens on.> Do not generate any video yet.
Vertical 9:16 aspect ratio, full-frame vertical composition. <Style lock> <The location's Environment: sentence> <The Lighting: sentence of the first shot there> No characters, people, or animals are in this image.
```

---

## Video 1 - <Title>

Film position: 00:00 - 00:10.

Stage: Exposition, Inciting Incident, start of Rising Action.

Characters: <exactly who is in this video, e.g. Papa Yeti, Babu Yeti, and the story cast handles, and no one else>

| Timestamp | Shot Type | Visual Description / Prompt | VFX | Audio / Sound FX |
| --- | --- | --- | --- | --- |
| **00:00 - 00:03** | <Framing>, <Angle> | Vertical 9:16 aspect ratio, full-frame vertical composition. <Style lock> Environment: <sentence>. Lighting: <key, fill, rim, quality and direction, contrast, colour temperature and palette, mood>. Characters: <each Yeti in the shot by name, placed left to right, or: No Yeti is in this shot.> Expressions: <Name>, <face from the section 4 table>; <Name>, <face>. <Humans: / Animals: sentences if any> <Avoid line, word for word, from section 5 of `prompt-assembly.md`> Action: <Beat 1, one sentence covering the first half of the shot and ending on a picture with highly detailed, descriptive physical actions and movements.> <Beat 2, one sentence ending on the shot's closing picture, with highly detailed, descriptive physical actions and movements, and the feeling in the Expressions: sentence.> Camera: <one move, direction, speed, what it reveals or ends on>. | Effects: <what renders, how it meets the light and action, or None>. Transition: Hard Cut. | <Music state, ambient sound, sounds for each action and effect.> No dialogue. |
| **00:03 - 00:07** | ... | ... Action: <two beats; the first ends on 00:05, the centre of the clip> ... | Effects: ... Transition: Hard Cut. | ... |
| **00:07 - 00:10** | ... | ... Action: <two beats; the second is the video's closing picture> Camera: <move>, easing to a stop in the last half second. | Effects: ... Transition: Holds on the final frame. | ... |

Agent prompt:

```text
Generate Video <N> - <Title> as one 10-second Omni Flash video, vertical 9:16, exactly as written below. Open on the image <Plate - <Location> for Video 1 or a scene break, otherwise End frame V<N-1>>.<If a beat needs a composition guide: " Also use the image Panel_<P>_V<N> as a composition guide.">
<The compact clip prompt, written from the table above as section 6 of `.agents/rules/google-flow.md` sets out: format and style line; Cast line calling each saved Character with @ once, with its starting place and no description; Setting line; one line per shot with its timestamp, Shot Type, beats, camera, and light, using plain names; a Sound line; and the Avoid line.>
```

---

## Video 2 - <Title>

Film position: 00:10 - 00:20.

Stage: Rising Action, Climax (peaks at 00:05 on this clock, film 00:15, at the end of Shot 2's first beat), start of Falling Action.

<If the story jumps here: Scene break: <what changes>.>

Characters: <exactly who is in this video, e.g. Papa Yeti, Babu Yeti, and the story cast handles, and no one else>

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10. Shot 1's first beat picks up Video 1's closing picture, under Video 1's Shot 3 light ... |

Agent prompt:

```text
Generate Video <N> - <Title> as one 10-second Omni Flash video, vertical 9:16, exactly as written below. Open on the image <Plate - <Location> for Video 1 or a scene break, otherwise End frame V<N-1>>.<If a beat needs a composition guide: " Also use the image Panel_<P>_V<N> as a composition guide.">
<The compact clip prompt, written from the table above as section 6 of `.agents/rules/google-flow.md` sets out: format and style line; Cast line calling each saved Character with @ once, with its starting place and no description; Setting line; one line per shot with its timestamp, Shot Type, beats, camera, and light, using plain names; a Sound line; and the Avoid line.>
```

---

## Video 3 - <Title>

Film position: 00:20 - 00:30.

Stage: Falling Action, Resolution.

Characters: <exactly who is in this video, e.g. Papa Yeti, Babu Yeti, and the story cast handles, and no one else>

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10. Shot 3's last beat is the held, resolved closing image of the film, with the music finishing ... |

Agent prompt:

```text
Generate Video <N> - <Title> as one 10-second Omni Flash video, vertical 9:16, exactly as written below. Open on the image <Plate - <Location> for Video 1 or a scene break, otherwise End frame V<N-1>>.<If a beat needs a composition guide: " Also use the image Panel_<P>_V<N> as a composition guide.">
<The compact clip prompt, written from the table above as section 6 of `.agents/rules/google-flow.md` sets out: format and style line; Cast line calling each saved Character with @ once, with its starting place and no description; Setting line; one line per shot with its timestamp, Shot Type, beats, camera, and light, using plain names; a Sound line; and the Avoid line.>
```
````
