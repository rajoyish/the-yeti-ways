---
name: storyboard-60s-from-story
description: >-
  Trigger when the user gives a short Yeti story (prose, possibly with dialogue) or a
  source storyboard from `video-to-storyboard` and asks for a 1-minute or 60-second
  storyboard, says "six 10-second videos", "1 min storyboard", or runs "/storyboard-60s".
  Turns the story into a 60-second storyboard of six 10-second Google Flow videos with no
  dialogue, with framing and angle, lighting, one camera move, and VFX directed on every
  shot. Every shot's action is written as two beats, so each video maps onto the six
  panel images that `create-3x2-timed-image` writes next and composes into a 3x2 grid.
  Each table is the master for its video, and an Ingredients line and a compact Flow prompt
  under it are what Google Flow receives, with the Yetis called by their saved Characters'
  @ names and never described. The file also writes the film's Flow setup and its three
  Google Flow Agent instruction cards (title, reference image, guideline). Every clip is 10
  seconds on Gemini Omni Flash 1.1, in a new Flow project, as `.agents/rules/google-flow.md`
  sets out. The file holds video prompts only: the panel image prompts go in the 3x2 file. Every spoken line becomes a gesture, expression, or prop
  action, and the audio is background music and sound effects only, so the clip works for
  a global audience.
---

# 60-second storyboard from a story

This skill takes a short prose story about the Yeti family and writes a 60-second storyboard built as six 10-second videos for Google Flow. It is step 1 of the pipeline in section 7 of `.agents/rules/cinematic-direction.md`. Each video's table is the master for one 10-second clip, and the `Flow prompt:` block under it is the text Flow receives. Every shot's `Action:` is two beats, so each video has six beats, and `create-3x2-timed-image` turns those six beats into the six panels of the video's 3x2 grid. The storyboard holds video prompts only. Every image prompt for the film, each video's six panel images, goes in `prompts/<kebab-case-title>-60s-3x2.md`, which `create-3x2-timed-image` writes, and in Flow each clip is generated from its Flow prompt with the film's saved Characters and the previous clip's saved end frame, as `.agents/rules/google-flow.md` sets out. The continuity between the six clips lives in the storyboard text and in that end frame: the first beat of each video picks up the picture the previous video ended on.

The story may contain dialogue. The storyboard never does. Every line of speech is translated into something the viewer can see: a gesture, a facial expression, a prop being handled, a change of posture. Audio is background music and sound effects only.

Every shot is directed as well as described: its framing and angle, its light, one camera move, its visual effects, and the transition out of it, in the fixed terms of `.agents/rules/cinematic-direction.md`.

The sibling skill `.agents/skills/storyboard-30s-extender/SKILL.md` produces the same table format at half the length. The reference output for this skill is `prompts/babu-yeti-found-sled-60s-storyboard.md`. Match its structure, including the aspect ratio lock in every visual cell. It predates the character locks and the saved Characters (it carries the older character text and head lock; revise them as section 9 of `.agents/rules/prompt-assembly.md` says, and give it the Flow setup, Agent instruction cards, `Ingredients:` lines, and `@`-name Flow prompts of the template below), the `Stage:` line under each heading, the two-beat `Action:`, and the cinematic direction (the angle in the Shot Type cell, the `Lighting:` and `Camera:` sentences, and the VFX column), so add all of those. It also carries keyframe lines from the retired start-and-end-frame workflow; leave those out. `prompts/yeti-glacier-rescue-60s-storyboard.md` is in the current format apart from its character text, which predates the character locks. It is video prompts only and shows the cinematic direction and a `VFX lock:` paragraph in full, but predates the Flow setup and Agent instruction cards. It is widescreen 16:9, so take everything from it except its aspect ratio.

## Rules that always apply

Read these before writing anything:

- `.agents/rules/character-consistency.md`: how Papa Yeti, Mama Yeti, and Babu Yeti look. The storyboard never copies a lock or describes a Yeti's look: each Yeti is a saved Flow Character, named in the cells and called by its `@` name in the Flow prompts, and the Character carries the look. Its Allowed Variations and Prohibited Changes also bind every `Action:` and `Expressions:` sentence: faces move only the eyebrows, eyelids, cheeks, and mouth, and no action changes a Yeti's design or merges two Yetis. Use this default file, never `character-consistency-alt.md`, unless the user asks for the alternate by name (the note at the top of `prompt-assembly.md` says why).
- `.agents/rules/prompt-assembly.md`: the style lock, the order of the pieces in a visual cell, the `Characters:` and `Expressions:` sentences, the expression table (section 4), the avoid line, the main characters and story cast rules (section 6), the prompt construction rules, and the originality pass (section 10).
- `.agents/rules/cinematic-direction.md`: the terms and project limits for shot type and angle, lighting, camera movement, VFX, transitions, and sound, the panel map that ties each video to its 3x2 grid (section 6), and the pipeline (section 7).
- `.agents/rules/google-flow.md`: what Flow's docs confirm (every clip is Gemini Omni Flash 1.1, 10 seconds), the saved Characters (section 2), the new project per film (section 3), the ingredients for each clip and the saved end frame that carries continuity (section 4), the three Agent instruction cards (section 5), and the `Ingredients:` line and `Flow prompt:` format (section 6).
- `.agents/skills/social-media-prompt-creator/SKILL.md`: platform and safety guidelines. Section 1 (the "never" list), the TikTok note on dangerous activities, and the visual tip about backgrounds apply directly.

- The Yetis are the main characters; the story decides everything else. Papa Yeti, Mama Yeti, and Babu Yeti never change: the same locks, the same names, the same family, and no one replaces them. Every other choice belongs to the story, as section 6 of `prompt-assembly.md` sets out: the genre, the setting, the music, and who does what. A Yeti may teach or be taught, rescue or be rescued, and a story cast member (human, animal, or invented creature) may hold any role the story needs, including a mentor, a guide, a rival, or the one who helps. Keep the source's cast and roles when they work, and recast only where the story is stronger for it. The film stays about the Yetis: the camera stays with at least one of them, and the main emotional turn belongs to at least one of them.
- Only 3 Yetis: Papa, Mama and Babu Yetis should be shown in the videos, no extra Yetis other than that or more than 3 Yetis.

Flow-specific constraints, learned from clips that the content filter rejected:

- No dialogue. Every audio cell ends with "No dialogue."
- No brand names, logos, packaging, labels, or on-screen text. This includes signs, maps, and posters. Replace any text-bearing prop from the story with a textless equivalent (a trail map becomes a carved wooden signpost with an arrow shape, a label becomes a plain object).
- No real devices (phones, tablets, cameras). Use in-world props.
- No stock sound effect names (record scratch, cartoon boing, sad trombone). Describe each sound from scratch.
- No plain, white, or empty backgrounds. Every shot has an "Environment:" sentence.
- No horns. The Yetis have none, but the model adds horns, antlers, or spikes to a "Yeti" when the prompt leaves the top of the head undescribed, and once a grid panel or a panel image has them, the clip made with that image keeps them. Every character lock says the tuft is the only thing on the Yeti's head, and no `Action:` sentence puts a hand or prop on or above a Yeti's head (no hands folded up beside the head for a sleep mime, no arms raised overhead). Keep mimes at chest height. A head touch the story needs, such as a tuft ruffle, says the hand lifts away in the same sentence.
- Same look in every shot. Left to itself, a model turns a "Yeti" into a white, ape-like snow monster, dresses characters standing in snow in scarves and hats, and draws Babu at any size from a doll to a third grown-up, and each clip copies whatever its attached grid or panel images show. Over six videos, six grids, and 36 panel images the drift adds up. Each Yeti is a saved Flow Character that holds its colour, tuft, face, build, and the fact that it wears nothing, so no sentence in the storyboard describes or changes them, and every visual cell carries the avoid line from section 5 of `prompt-assembly.md`. Size is the one thing a Character cannot carry, so the height sentence below and the family height chart carry it. The `Characters:`, `Expressions:`, and `Action:` text names each Yeti by name ("Papa Yeti", "Mama Yeti", "Babu Yeti"), never by colour, and agrees with the Characters (five-fingered hands and five-toed feet, never paws; nothing worn; Babu Yeti about half a grown-up's height, with the top of his curl only at a grown-up's belly). No sentence sizes a place or a prop by a Yeti ("a pillar as tall as a grown Yeti"), because that sentence runs in every shot at its location and puts the Yeti into the ones where it is absent.
- Faces match the beat. The character text used to carry a fixed "wide cheerful toothy smile", and Flow obeyed it over anything the `Action:` sentence said, so Yetis grinned through a rescue. The Characters carry no expression, and each visual cell states every Yeti's face in an `Expressions:` sentence. Fill it per shot from the table in section 4 of `prompt-assembly.md` with the feeling each Yeti holds at the end of the shot, and write the same feeling in the `Action:` sentence. No smile of any kind on a beat of danger, worry, effort, sadness, or loss. A smiling grid panel or panel image carries its smile into the clip made with it, so an image or clip that smiles on the wrong beat gets regenerated, never used.
- Vertical 9:16 only. Flow renders 16:9 unless the prompt and the output setting both say otherwise, so every visual cell opens with the aspect ratio line and the operator sets Flow to 9:16 before generating. A clip that comes back 16:9 gets regenerated, never cropped.
- Original, not copied. Flow's second refusal, "I can't generate the video you requested right now due to interests of third-party content providers", is the copyright filter, not the safety filter. It does not object to genres or tropes (a training run, a mentor's gift, a rescue, magic); it objects to names and to near-copies of a specific character or scene. Run the originality pass in section 10 of `prompt-assembly.md` on every video: no names of protected work and no "in the style of", every story cast design invented from scratch, at least two of setting, key prop, key action, and framing changed wherever a beat sits close to a famous scene, magic that comes from the world or a prop rather than energy sent out of a Yeti, and music described by genre, mood, tempo, and instruments.
- Direction goes to Flow too. The Flow prompt is written from the whole row, VFX cell included, so every word in the `Lighting:`, `Camera:`, `Effects:`, and `Transition:` text is an instruction the filters read. No energy sent out by a character, no explosion, and no strobe effect, no named film, studio, or colour grade, and no edit instruction (a fade, a dissolve, a speed change) inside a table or a Flow prompt. Those go in the Flow setup, for the editor.
- No pipe character (`|`) inside a cell. A stray pipe splits the cell and shifts every column after it.
- Sound designed for the story. Every film gets its own score and sound world, set once in the `Music lock:` paragraph of the film locks (section 5 of `cinematic-direction.md`): a palette of two to five instruments chosen for the story's world and mood, how the music moves across the videos, and each location's ambient bed. Do not reuse a past film's palette by habit. The palette may change on story beats (drums drop out when the tension breaks, strings come in for the ending), and the music at each handoff is the same on both sides of the cut. Each audio cell names the instruments playing in that shot, their tempo, and their feeling. Never a named song, composer, artist, or soundtrack, never lyrics or sung words, and no key changes, chord names, or arpeggio directions; wordless vocal textures are allowed.
- Humans can be cast in any role. Draw them in the same stylized 3D animated style as the Yetis, as original designs with expressive cartoon features, never photoreal, never the likeness of a real person, and never the design of an existing film or game character. Dress them for the story's world and era (an old teacher's plain wrapped robe and cloth sash, a fisher's oilskin coat, a cook's apron), with no logos or writing. Describe each kind of story cast once in a locked `Humans:`, `Animals:`, or `Creatures:` sentence, with a short handle for each member that the `Action:` text reuses, copied word for word into every prompt. A human child stays with an adult, never enters water, never falls, and is never alone in danger; the safety filter reads a child in peril as harm, so write worry, not terror.
- No risky physical action. If the story has a character high on a cliff, in a crevice, or on thin ice, bring the action down to a safe height or a gentle slope. TikTok moderates anything that reads as a dangerous stunt, especially with a child character.
- Every video table runs on its own clock, from 00:00 to 00:10. Flow reads the timestamps in a prompt as that clip's clock. A table that starts at 00:30 or 00:50 makes Flow try to render a clip far longer than 10 seconds, split the prompt into several clips, or fail with an error. The film-level position of a video lives in a `Film position:` line outside the table and is never pasted into Flow.
- Beats come first, and the grid is built from them. Every shot's `Action:` is exactly two sentences, one per beat, and each beat becomes one panel of the video's 3x2 grid, as the panel map in section 6 of `cinematic-direction.md` sets out: three shots, six beats, six panels per video. `create-3x2-timed-image` builds each grid, and a full-size image of each panel, from these beats. Six beats give each moment of the clip its own checked picture, which the operator checks the clip against. Write every beat to end on one picture a viewer could photograph: positions, poses, hands, props, eye lines, and any face that changes. A beat that only describes motion, or leaves a character's position unstated, produces a panel that fights the clip.
- No keyframe lines, and continuity carried by the saved end frame. The storyboard carries no `Frames:`, `Start frame:`, `Midpoint frame:`, or `End frame:` lines, and no generated image is ever set as a clip's first or last frame. What opens each clip after the first is the real last frame of the previous approved clip, saved in Flow, as section 4 of `.agents/rules/google-flow.md` sets out, so the first beat of each video after the first describes exactly the picture the previous video's last beat ended on, and the last beat of each video ends on a clean, held picture worth saving.
- Video prompts only. The storyboard holds no image prompt: no `Create image:` line, no `Grid:` or `Stills:` line, and no step for generating or checking an image. Every image prompt goes in the 3x2 file that `create-3x2-timed-image` writes, and the Flow setup names that file so the operator knows where the panel images are. The lock paragraphs say what the clips must show; the 3x2 file's intro says how to check the images against them.
- Ingredients and Flow prompt under every table. Flow receives a compact `Flow prompt:` block, not the table: the table is the master that the panel images and the checks are built from, and it repeats pieces that would bury the few words each shot needs. Under each table write the `Ingredients:` line and the `Flow prompt:` block that section 6 of `.agents/rules/google-flow.md` sets out, with each character called by its bare `@` name (`@Papa Yeti`) and never described, and keep it in step with the table: the same shots, beats, faces, light, camera, and sound, shortened, never added to.
- Agent instructions in every storyboard. The file writes the three cards of section 5 of `.agents/rules/google-flow.md` under `## Google Flow Agent instructions`: Instruction 1 and Instruction 3 word for word (with the number of videos filled in), and Instruction 2 written for this film from its locks, under about 250 words, naming characters only by `@` name.
- Every clip is 10 seconds on Gemini Omni Flash 1.1, vertical 9:16, made in a new Flow project for the film. No step or prompt names another model, length, or orientation.

## Workflow

### 1. Read the story

Take the input as pasted prose or as a file path. The input may also be a source storyboard from `video-to-storyboard`: a five-column table (`Timestamp | Shot Type | Visual Description | VFX | Audio / Sound FX`) with `**Environment:**`, `**Lighting:**`, `**Subjects & Action:**`, and `**Camera Movement:**` in the visual cells and `**Observed:**`, `**Transition:**`, and `**Recommended:**` in the VFX cells. Treat it as the story, told shot by shot. Its environment becomes the `Environment:` sentence, kept or changed to suit the Yeti version. Its lighting becomes the lighting plan. Its subjects and action become the beats, with the Yeti the story names in the lead and the rest of the cast kept, changed, or invented to suit; run the originality pass in section 10 of `prompt-assembly.md` on it, since the source is a guide to pace, energy, and sound, not a scene to copy. Its camera moves and observed effects are kept where they pass the limits in `cinematic-direction.md` and replaced where they do not (a fire beam becomes a thrown snowball, an explosion becomes a cloud of powder snow off a falling slab). Its recommended moves and effects are options, not beats. Its dialogue goes through step 2 like any other.

Extract and write down, before drafting:

- Title (make one if the story has none) and a one-line premise.
- The moral or emotional point of the story, in one sentence. Every video must serve it.
- Which characters appear. Map the story's names to the project's: "Baby Yeti" or "Little Yeti" is Babu Yeti, "Mother" is Mama Yeti, "Father" is Papa Yeti. Then note what role each character plays (who notices the problem, who acts on it, whose choice resolves it, who teaches, who helps). Keep the story's roles where they work, and keep, change, or invent the rest of the cast as humans, real-world animals, or creatures of your own, whichever fits. Each kind gets one locked `Humans:`, `Animals:`, or `Creatures:` sentence, copied word for word into every prompt, as in `prompts/yeti-family-river-rescue-30s-storyboard.md` (humans) and `prompts/papa-yeti-warm-dome-30s-storyboard.md` (animals).
- Every location. Note where the story moves and why.
- Every prop. Flag any prop that carries text, a brand, or a real-world product.
- The light at each location: time of day, weather, and every light source the environment holds (sun, sky, hearth, lantern, glowing moss). These become the `Lighting lock:` in the film locks. If a location needs a source it lacks, add it to that location's `Environment:` sentence now.
- Every story beat in order, including who speaks, what they say, and what their body does while they say it.
- Which beat is the Inciting Incident (the one event that breaks normal) and which is the Climax (the point of highest tension, decided by what a Yeti does). Prose stories often bury the climax in a line of dialogue; find the moment the outcome turns and name it now, because the pacing in step 3 is built around it.
- The final state of the scene and the final feeling.

Nothing in this list may be dropped from the output. Every beat of the story appears in the storyboard, in order.

### 2. Convert dialogue to action

For every spoken line, decide what the viewer sees instead. Write the conversion down as a two-column list (line, visual replacement) before drafting shots. Keep the list in your working notes; it does not go in the output file.

Use the intent of the line, not its words:

| Intent of the line | Show it as |
| --- | --- |
| Excitement, "look what I found" | Holds the object up in both hands, bounces on the spot, eyes wide, looks back at the others for approval |
| Claiming, "it's mine" | Hugs the object to chest, turns half away, cheeky grin |
| A gentle "wait" | Raises one open hand, slow head shake, kneels to eye level |
| A question | Head tilt, one open hand turned up, eyebrows raised, eyes on the child |
| "No" or an admission | Looks down at own feet, shoulders drop, toe drawing a line in the snow |
| Explaining a consequence, "how would you feel if" | Mime in three parts at chest height, one per beat: points at the child, mimes the scenario (cheek resting on the back of one flat hand held beside the jaw for sleep, then a thing cradled in both hands), then turns one hand over to show it empty. Hands never go up beside or above the head |
| Imagining | Hold on the character's face as the expression changes; a glance toward the thing they would lose |
| Comfort or agreement | An arm around the shoulders, a nod, a forehead touch |
| Decision | Straightens up, nods once to self, picks up the object with purpose |
| Pride or approval | Warm smile, a pat on the head, the parents exchange a look |

Do not use thought bubbles, speech bubbles, or written signs to replace dialogue. Do not use lip movement that reads as speech. Mouths may open for gasps, laughs, and sighs.

### 3. Plan six videos

The 60-second film follows the six classic stages of plot structure, in order: Exposition, Inciting Incident, Rising Action, Climax, Falling Action, Resolution. The pacing rule is fixed: the first 30 seconds build the conflict (Exposition through Climax) and the last 30 seconds release it (Falling Action and Resolution). The Climax peaks at film 00:30: the last beat of Video 3's Shot 3, which is panel 6 of Video 3's grid. Video 4's first beat opens on that same peak picture and moves out of it into the release.

Split the story across six 10-second videos, one stage per video. The default mapping, with a moral tale as the worked example:

| Video | Film position | Stage | What it carries | Default light and camera | Moral tale example |
| --- | --- | --- | --- | --- | --- |
| 1 | 00:00 - 00:10 | Exposition | The place, the characters, what normal looks like. End on the first hint of the thing that will break it. | Soft high-key light. A slow establishing move (Crane Down, Dolly In, or Pan), then closer framings | The family on the slope. Babu spots a shape in the snow. |
| 2 | 00:10 - 00:20 | Inciting Incident | The one event that breaks normal and gives a Yeti a problem or a want. | The light shifts (a cloud, a shadow, a guttering fire) in the first beat of a Shot 2 or a Shot 3. A Tilt or Pan to the problem, or a Static hold on the face that sees it | Babu pulls out the sled and claims it. The parents notice. |
| 3 | 00:20 - 00:30 | Rising Action into Climax | The Yetis respond and the problem gets harder, beat by beat, up to the point of highest tension. The last beat is the peak. | Lower key, harder side light, cooler colour. Tracking or subtle Handheld, and a Low Angle Dolly In or an Arc on the peak | Papa's gentle stop and question, Babu's admission, Mama's mime of how the owner feels, and Babu's face as it lands. |
| 4 | 00:30 - 00:40 | Falling Action | The immediate consequence of the peak: the choice made, the act done. | Warmth starts to return. Steady moves, a slow Dolly Out, or a Static hold | Babu decides and sets the sled back where it was. |
| 5 | 00:40 - 00:50 | Falling Action into Resolution | The tension drains and the loose threads close. | Warmer and softer. Steadicam follow or Tracking as the family moves | The parents' approval. The family turns for home. |
| 6 | 00:50 - 01:00 | Resolution | The new normal, held long enough to feel. It answers Video 1. | Soft, warm, golden, high-key. A Crane Up or slow Dolly Out that leaves the family small and warm, or a Static hold | The cave, the hearth, the last look between them. |

Adapt the light and camera to the story, within the limits of `cinematic-direction.md`. The light only changes where section 6 of that file allows: never during a Shot 1, and in a Shot 2 or a Shot 3 only during its first beat.

Adjust the mapping when the story has a different shape, but keep six videos, keep the story's order, and keep the boundary: the Climax peaks at 00:30, nothing after that point introduces a new problem, and nothing before it resolves one. A long climax may start in Video 3's second shot, but it never runs past the end of Video 3. A story with no clear inciting incident gets one in Video 2, where the problem or the want first arrives, never in Video 1.

Give each video a short title in the heading, such as "Video 1 - The Red Sled". The number and the title are separated by a spaced hyphen (` - `), never a colon. The heading carries no timestamps. The film position goes on its own `Film position:` line directly under the heading, the stage that video carries goes on a `Stage:` line directly under that. The 3x2 file and every image in it reuse this heading, so choose the title once and never change it.

Add nothing the story does not already imply. Good additions: a reaction from the other parent, a small gesture of affection, a prop being set down with care. Bad additions: a character, prop, or location that changes the story rather than deepening it, a joke that undercuts the moral, a stretch where the camera leaves the Yetis for long.

### 4. Handle location changes

Each video's first beat picks up the picture its predecessor ended on, so a location can only change at a video boundary and only in one of two ways:

- **Walk-through**: the last beat of the video shows the characters walking out of frame or along a path, and the first beat of the next video shows them arriving in the new environment. Use this when the two places are close (a cave mouth and the slope outside it).
- **Scene break**: the next video opens in the new location instead of picking up the previous video's last beat. Use this when the story jumps (from a mountain ledge to a trail far below). Mark it with a `Scene break:` line directly under that video's `Stage:` line, write its first beat as the new environment and the opening pose, and tell the operator in the Flow setup which video starts fresh so the editor expects a hard cut.

Give the story as many locations as it needs, but give each at least one full shot, and keep to about five across the sixty seconds so each one registers. Each location gets one `Environment:` sentence, decided in step 1 and never reworded within that location. A location can also change at a cut between two shots inside a video, since both panels of a shot share its location; the shot after the cut opens in the new place with that place's `Environment:` and `Lighting:` sentences. Light hands off the same way the picture does. After a walk-through, the next video's Shot 1 keeps the previous Shot 3 `Lighting:` sentence word for word, and the new location's light starts with the first shot set there. A scene break starts under its own light, set out in the `Lighting lock:`.

### 5. Write the shots

Each video has three shots. Every video's table starts at 00:00 and ends at 00:10, no matter where the video sits in the film. Videos 2 through 6 do not continue the clock from 00:10, 00:20, and so on. The split is fixed: `00:00 - 00:03`, `00:03 - 00:07`, `00:07 - 00:10`, the same three ranges in all six videos, because the panel timecodes in every grid are built on it. The only place `01:00` appears is the `Film position:` line of Video 6.

Each table has five columns: `| Timestamp | Shot Type | Visual Description / Prompt | VFX | Audio / Sound FX |`. Every cell uses the same labels in the same order in every row, and no cell contains a pipe character.

The Shot Type cell names the framing from the ladder in section 1 of `cinematic-direction.md`, then the angle: `Wide Shot, Eye Level`, `Medium Three-Shot, Low Angle`, `Close-Up, Eye Level`. When the camera move changes the framing, name both ends: `Medium Shot to Close-Up, Eye Level`. Vary the framing within each video, and do not repeat the same framing three times in a row. The grid takes each panel's framing from this cell, as section 6 of `cinematic-direction.md` sets out. Include exactly one close-up shot per video to capture the facial expressions or emotions of the main or side characters relevant to the scene.

No `Character locks:` block goes above a table, and no cell describes a Yeti's look: the saved Characters carry it (section 3 of `prompt-assembly.md`). Directly under the video's `Stage:` line (and its `Scene break:` line, if it has one) goes a `Characters:` line naming everyone in the video, and the table follows.

Every visual cell follows this order, with each piece copied exactly:

1. Aspect ratio lock: `Vertical 9:16 aspect ratio, full-frame vertical composition.` Word for word, in every cell, before anything else.
2. Style lock, from section 1 of `prompt-assembly.md`.
3. `Environment:` sentence for the current location.
4. `Lighting:` one sentence naming the key, fill, and rim, their quality and direction, the contrast, the colour temperature and palette, and the mood, as section 2 of `cinematic-direction.md` sets out. Every source it names is in the `Environment:` sentence, and it keeps a soft rim or fill on the fur so each Yeti's colour reads true. It holds the light at the end of the shot.
5. `Characters:` sentence naming the Yetis in the shot and where each stands, left to right, in the forms section 3 of `prompt-assembly.md` gives (`Characters: Babu Yeti.`, `Characters: Papa Yeti on the left and Babu Yeti on the right.`, `Characters: Papa Yeti on the left, Babu Yeti in the center, and Mama Yeti on the right.`). Keep the same Yeti on the same side in every shot unless the action moves them, and if it moves them, keep them there for every later shot. A shot without a Yeti says `No Yeti is in this shot.` instead.
6. `Expressions:` sentence giving each Yeti in the shot, in the same order, a face from the section 4 table of `prompt-assembly.md`: the feeling that Yeti holds at the end of the shot (`Expressions: Papa Yeti, <row>; Babu Yeti, <row>.`). Left out in a shot with no Yeti.
7. Story cast, if any: a `Humans:`, `Animals:`, or `Creatures:` sentence for each kind, describing every member of the story cast, identical in every shot at every location.
8. Avoid line, word for word, from section 5 of `prompt-assembly.md`, after the supporting cast sentences (or after the `Expressions:` sentence, or the no-Yeti sentence, when there are none).
9. `Action:` exactly two sentences, one per beat, in order. Each beat is concrete body movement, expression, and eye line, and ends on a picture (the beat rules below). Expand the `Action:` block with highly detailed, descriptive physical actions and movements based on the video prompt's context. The feeling named in the second beat must agree with the `Expressions:` sentence; if a feeling changes during the shot, the beat where it changes names the new feeling, and the `Expressions:` sentence holds the destination. If the light changes, the first beat says so, and the `Lighting:` sentence holds the new light. Where a line of dialogue was, write the replacement from your step 2 list.
10. `Camera:` one sentence naming one move from the list in section 3 of `cinematic-direction.md`, then its direction, its speed, and what it reveals or ends on. The move matches the Shot Type cell: a move that changes the framing starts on the first framing named there and ends on the second.

The two beats of each shot become the shot's two panels in the grid, so write them to the panel map in section 6 of `cinematic-direction.md`:

- Beat 1 starts from the shot's opening picture, covers the first half of the shot, and ends on a picture seen in the shot's opening framing. In Shot 1 of Videos 2 to 6, it holds the picture the previous video's last beat ended on, with the same positions, hands, props, eye lines, and faces and at most a small change (a face that starts to change, a turn of the head), except under a `Scene break:` line. In Shot 2 it ends on 00:05, the centre of the clip.
- Beat 2 covers the second half and ends on the picture the shot closes on, seen in the shot's closing framing, with the feeling in the `Expressions:` sentence. In Shot 3 it is the video's closing picture, which the next video's first beat picks up. In Video 3 it is the Climax peak.
- Each beat is one sentence with a full stop at its end, and no sentence straddles two beats. A beat may carry two linked actions (a slide into the hollow, then an arm around the child) as long as it ends on one picture. Name each Yeti in every beat it is in, by name, and say where it is. A character who leaves or enters the frame does so inside a beat, and the beat says so.
- A Yeti the shot's `Characters:` sentence names is in the shot, and a Yeti who is not in the shot is left out of its `Characters:` and `Expressions:` sentences and named in its `Action:` as `<Name> is not in the shot.` A Yeti named as present who is absent puts that Yeti on screen.

Every VFX cell holds two labelled sentences, in this order:

- `Effects:` what Flow renders in this shot, from the effects in section 4 of `cinematic-direction.md`: what each effect does and how it meets the light and the action. Every effect has a cause in the `Environment:` sentence or the `Action:` text, and none comes from a Yeti. `Effects: None.` when the shot has none.
- `Transition:` `Hard Cut.` or `Match Cut.` (with what it matches) for Shots 1 and 2, and `Holds on the final frame.` for Shot 3. The cut to the next video happens in the edit.

Every audio cell names the music state (starts, continues, pauses, swells, softens, resolves), the ambient sound of the place, a sound for each physical action and each visible effect, and ends with "No dialogue." Name the instruments from the `Music lock:` that carry the shot, with their tempo and feeling; the palette is designed for this story and may change on story beats, as section 5 of `cinematic-direction.md` sets out. Vocal sounds are allowed if they are not words: a gasp, a giggle, a soft sigh, a happy hum.

### 6. Lock the continuity between videos

No clip starts or ends on a supplied image, so each handoff between videos is held by the text of both tables. Follow section 6 of `cinematic-direction.md`:

- Picture. The first beat of each video's Shot 1 holds the picture the second beat of the previous video's Shot 3 ends on: the same characters in the same places, the same hands and props, the same eye lines, and the same faces. Only the framing may differ, because each shot has its own. Panel 1 of each grid then shows the same picture as panel 6 of the grid before it. The one exception is a video marked `Scene break:`, whose first beat describes the new environment and the opening pose.
- Face. The feeling a Yeti holds at the start of a video's Shot 1 is the feeling in the previous video's Shot 3 `Expressions:` sentence. If it changes in Shot 1, the beat where it changes says so.
- Light. The `Lighting:` sentence of each video's Shot 1 is the previous video's Shot 3 `Lighting:` sentence, word for word, except under a `Scene break:` line. The light never changes during a Shot 1, and a change in a Shot 2 or a Shot 3 happens in its first beat.
- Camera. Every Shot 3 `Camera:` sentence ends by easing to a stop, and every Shot 1 `Camera:` sentence in Videos 2 to 6 starts from rest.
- Climax. Video 3's last beat is the Climax peak, so Video 3's Shot 3 carries the hardest light and the strongest move of the film (a Low Angle push-in or an Arc), and its second beat names the peak feeling on every face. Video 4's Shot 1 opens on that picture under that same light, and moves out of it rather than holding it, before the warmth returns later in Video 4.

### 7. Write the file

Save to `prompts/<kebab-case-title>-60s-storyboard.md`. Derive the kebab-case title from the story's title, dropping any leading article. Never overwrite an existing file.

Use the template below. The `## Flow setup` section at the top is for whoever operates Google Flow: the new project, its settings, the Characters to check, the plates, and the per-clip steps. The `## Google Flow Agent instructions` section holds the three cards to paste into Flow's Agent instructions panel (section 5 of `.agents/rules/google-flow.md`). The `## Film locks` section holds the lock paragraphs the image skills and the Instruction 2 card are written from. Its `Lighting lock:` paragraph names each location's light sources, colour temperatures, and palette from step 1 and how the light moves across the six videos. Its `VFX lock:` paragraph names which effects belong to which video, so an effect never leaks into a clip that should not have it.

What Flow receives is one video at a time: its `Flow prompt:` block and nothing else, with the ingredients on its `Ingredients:` line. The tables, headings, the `Film position:`, `Stage:`, and `Scene break:` lines, the Flow setup, and the film locks stay in the file for the operator, the image skills, and the editor; the Agent instruction cards go into Flow once per project.

Then name the next step. If the user asked only for the storyboard, say that `/create-3x2-timed-image` on this storyboard writes the image prompts, six panel images for each of the six videos, and composes each video's 3x2 grid from the generated panel images, and that the Flow setup expects those images before any clip is generated. Run it as its own step, not in this run. If the user asked for the images too, finish and verify this file first, then run `create-3x2-timed-image` on it.

### 8. Revise an older storyboard

Five kinds of older storyboard need this step. One written before the grid pipeline has `Frames:` lines under its headings and `Start frame:`, `Midpoint frame:`, and `End frame:` lines under its tables, and its agent instructions tell the operator to set start and end images. One written before the storyboard held video prompts only has `Grid:` and `Stills:` lines under its headings, and its agent instructions say how to generate and check grids and reference stills. One written for the retired 3x3 grid has three beats in every `Action:`, and its agent instructions name a `-3x3.md` file and panel images 3, 6, and 9. And any storyboard written before the character locks has short character text with an `[EXPRESSION]` slot, `Head lock:`, `Look lock:`, and `Scale lock:` sentences in its cells, and names the Yetis by colour. And any storyboard written before the saved Characters has a `Character locks:` block above each table, Flow tags with descriptions in its Flow prompts (`@Papa Yeti (the father: ...)`), and a single `## Agent instructions` section. When this skill or `create-3x2-timed-image` works on any of them, bring it up to this skill's format first, without changing a story beat, a light, a framing, or a face:

1. If it has `Character locks:` blocks or Flow tags, delete every `Character locks:` block, replace each Flow tag with its bare `@` name, add the `Cast:` height sentence where Babu Yeti shares a shot with a grown-up, and write an `Ingredients:` line above each `Flow prompt:` block and the Agent-mode line under it. Replace the `## Agent instructions` section with the template's `## Flow setup`, `## Google Flow Agent instructions` (three cards), and `## Film locks` sections, carrying every lock paragraph over into the film locks (rewriting the `Character lock:` paragraph to the template's) and every film-specific note (a recorded filter trigger) into the Flow setup.
2. If it predates the character locks, revise it as section 9 of `prompt-assembly.md` sets out: replace each cell's character text with a `Characters:` sentence and its `[EXPRESSION]` values with an `Expressions:` sentence, delete the head, look, and scale lock sentences, and rename the Yetis in every `Action:` from colour to name. Update the film locks to the template's.
3. If it has keyframe lines, rewrite each `Action:` as two beats that follow step 5. Use the deleted keyframe lines as the pictures: Shot 1's first beat opens on the `Start frame:` picture, Shot 2's first beat ends on the `Midpoint frame:` picture, and Shot 3's second beat is the `End frame:` picture.
4. If its `Action:` cells have three beats, rewrite each as two. Keep the picture the first beat opens on and the picture the third beat closes on, and fold the middle beat into the neighbour it belongs with, keeping its actions and faces. In Shot 1 of every video after the first, fold it forward into the second beat, so the first beat still holds the handoff picture.
5. Delete every `Frames:`, `Start frame:`, `Midpoint frame:`, `End frame:`, `Grid:`, and `Stills:` line, and any `Create image:` prompt.
6. Replace any older agent instructions with the template's sections, carrying over every lock paragraph and any film-specific note (a likely filter trigger and its fix, a changed aspect ratio) that does not rely on start or end frames. Take the image checks out of the lock paragraphs, and move any note about the images themselves (which characters may appear in which images, an image that has to be regenerated) into the intro of the 3x2 file. A note that names grid rows or panel numbers from the 3x3 grid is renumbered to the six-panel map. A film with its own `Aspect ratio lock:` (`prompts/yeti-glacier-rescue-60s-storyboard.md` is 16:9) keeps its aspect ratio line everywhere the template says 9:16.
7. Run the checklist in step 9, and tell the user the storyboard was updated.

A frames file in `image-prompts/`, from the start-and-end-frame workflow or the retired stills route, is left in place for the record. The panel images in the 3x2 file replace it.

### 9. Verify before finishing

Check every item. Fix and re-check rather than reporting a partial result.

- [ ] Six videos, each exactly 10 seconds. Every table has three rows, `00:00 - 00:03`, `00:03 - 00:07`, and `00:07 - 00:10`, in that order. No timestamp above `00:10` appears anywhere in a table.
- [ ] Each video heading reads `## Video N - <Title>` with a spaced hyphen, has no timestamps, and is followed, in order, by a `Film position:` line (00:00 - 00:10 through 00:50 - 01:00), a `Stage:` line naming the stage that video carries, and a `Scene break:` line if it has one.
- [ ] No keyframe lines remain: `grep -cE "^(Frames|Start frame|Midpoint frame|End frame):" <file>` returns 0, and the only first frame the Flow setup ever uses is the saved end frame of the previous approved clip, never a generated image.
- [ ] The file holds video prompts only: `grep -cE "^(Grid|Stills):|Create image:" <file>` returns 0, and the Flow setup names `prompts/<kebab-case-title>-60s-3x2.md` for each clip's images but give no steps for generating or checking an image. `grep -ciE "3x3|nine panel|panel images 3, 6" <file>` returns 0.
- [ ] Every beat of the story appears, in order.
- [ ] The six stages appear in order across the six videos: Exposition, Inciting Incident, Rising Action, Climax, Falling Action, Resolution. The Climax peaks in the last beat of Video 3, at film 00:30, and that beat names the peak feeling on every face. No beat in Videos 4 to 6 introduces a new problem, and no beat in Videos 1 to 3 resolves one. Each `Stage:` line matches what its video's shots do.
- [ ] Every `Action:` is exactly two sentences, one per beat, each ending on a picture, so each video has six beats for the six panels of its grid. Every Yeti in a beat is named by name and placed. The second beat of each shot ends on the feeling in that shot's `Expressions:` sentence. No shot's `Characters:` sentence names a Yeti its `Action:` says is not in it.
- [ ] Papa Yeti, Mama Yeti, and Babu Yeti are their saved Characters, never renamed, replaced, or described, the camera stays with at least one of them, and the main emotional turn belongs to at least one of them. Every story cast member has a role the story needs and is described in its locked cast sentence.
- [ ] Every spoken line has a visual replacement in an `Action:` cell. No speech, lip-sync, speech bubbles, or written words.
- [ ] Every visual cell opens with the aspect ratio lock line, before the style lock, in all eighteen shots.
- [ ] No character lock or Yeti description anywhere: `grep -cE "^Character locks:|\(the (father|mother|baby):|sapphire|bubblegum|mint-green|spiral curl|messy upward tuft" <file>` returns 0, outside a story cast sentence. Every Yeti in a Flow prompt is a bare `@` name.
- [ ] The file has `## Flow setup`, `## Google Flow Agent instructions` with exactly three `### Instruction` cards, each with a `Reference:` line and one `text` block, and `## Film locks`. Instruction 1 and Instruction 3 are word for word from section 5 of `.agents/rules/google-flow.md` (Instruction 3 with "6" filled in). Instruction 2 is under about 250 words, names characters only by `@` name, and agrees with the film locks.
- [ ] The Flow setup names Omni Flash, vertical 9:16, 10 seconds, and a new project for the film, and nothing in the file names another model, length, or orientation.
- [ ] The style lock is character-for-character identical to section 1 of `prompt-assembly.md` in every cell.
- [ ] Every visual cell with a Yeti has a `Characters:` sentence after the `Lighting:` sentence and an `Expressions:` sentence after it, naming the same Yetis in the same order. A cell with no Yeti says `No Yeti is in this shot.` and has no `Expressions:` sentence. `grep -cE "Head lock:|Look lock:|Scale lock:|\[EXPRESSION\]" <file>` returns 0.
- [ ] Every face in an `Expressions:` sentence is a row from the section 4 table of `prompt-assembly.md`, in the right column for that Yeti, matches the beat of its shot, and agrees with the expression in its `Action:` text. No shot on a beat of danger, worry, effort, sadness, or loss contains a smile of any kind. `grep "toothy smile"` on the file returns only shots whose beat is happy, playful, or proud.
- [ ] The avoid line follows the supporting cast in every visual cell, word for word: `grep '^| \*\*00:' <file> | grep -c "Avoid: "` returns 18.
- [ ] No `Action:` sentence puts a hand or prop on or above a Yeti's head without the hand lifting away in the same sentence.
- [ ] Every `Action:` beat, and every Flow prompt line, where a Yeti's hand does something visible (waves, claps, grips, points, holds, presses, reaches) says "five-fingered hand" or "five-fingered hands", and no sentence calls a Yeti's hands or feet paws.
- [ ] Every `Characters:`, `Expressions:`, and `Action:` sentence names each Yeti by name, never by colour, and every `Action:` agrees with the Characters: five-fingered hands and five-toed feet, never paws, nothing worn, Babu Yeti about half a grown-up's height, with the top of his curl only at a grown-up's belly. No sentence sizes a place or a prop by a Yeti.
- [ ] Each location has one `Environment:` sentence, identical in every shot at that location, and a location changes only at a cut between shots, after a walk-through, or under a `Scene break:` line.
- [ ] Left/right positions are stable.
- [ ] Every table has the five-column header `| Timestamp | Shot Type | Visual Description / Prompt | VFX | Audio / Sound FX |`, and every row has exactly six pipe characters, so no cell contains one. `awk -F'|' '/^\| \*\*00:/ && NF != 7' <file>` prints nothing.
- [ ] Every Shot Type cell names a framing from the ladder and an angle, and a shot whose move changes the framing names both ends, at most two rungs apart. No Bird's-Eye View or steep High Angle on a shot where a Yeti is more than small in the frame, and no Dutch Angle in the Resolution.
- [ ] Every visual cell has one `Lighting:` sentence directly after the `Environment:` sentence and one `Camera:` sentence at the end, after the `Action:` text. `grep '^| \*\*00:' <file> | grep -o "Lighting: " | wc -l` returns 18, and the same count for `"Camera: "`, `"Effects: "`, and `"Transition: "` returns 18 each.
- [ ] Every `Lighting:` sentence names only sources in its location's `Environment:` sentence, keeps a soft rim or fill on the fur so each Yeti's colour reads true, and follows the story's light arc (section 2 of `cinematic-direction.md`). No light from below a face, no strobing or flashing, no named film or grade.
- [ ] The light never changes during a Shot 1, and a change in a Shot 2 or a Shot 3 is described in its first beat. The Shot 1 `Lighting:` sentence of Videos 2 to 6 is word for word the Shot 3 `Lighting:` sentence of the video before, except under a `Scene break:` line.
- [ ] The first beat of Shot 1 in Videos 2 to 6 holds the same picture, with the same positions, hands, props, eye lines, and faces, as the last beat of the previous video's Shot 3, except under a `Scene break:` line, where it describes the new location and the opening pose.
- [ ] Every `Camera:` sentence names one move from the list, with direction and speed, and agrees with its Shot Type cell. Every Shot 3 move eases to a stop, and every Shot 1 move in Videos 2 to 6 starts from rest. Whip Pan at most once, never at a shot's start or end.
- [ ] Every VFX cell has `Effects:` then `Transition:`. Every effect is on the list in section 4 of `cinematic-direction.md` and has a cause in the environment or the action, and no effect is energy, an explosion, a flash, on-screen text, a morph, or anything coming from a Yeti other than breath misting in the cold. Shots 1 and 2 end on `Hard Cut.` or `Match Cut.`, and every Shot 3 on `Holds on the final frame.` No fade, dissolve, or speed change inside a table.
- [ ] Every effect that makes a sound has that sound in the audio cell of the same row.
- [ ] Every audio cell ends with "No dialogue."
- [ ] Every video has an `Ingredients:` line and a `Flow prompt:` block directly under its table, then the Agent-mode line, built as section 6 of `.agents/rules/google-flow.md` sets out: the style lock and the avoid line word for word, each character by its bare `@` name with no description, the Babu height sentence in the `Cast:` line wherever he shares a shot with a grown-up, and `Family height chart` on the `Ingredients:` line of those videos, the three timestamps of its table in order, and the same beats, faces, light, camera, and sound as its table, with nothing added. No `Generate a video using the attached materials` line, and no step that attaches a 3x2 grid or a triptych to a clip.
- [ ] No brands, real devices, stock sound effect names, on-screen text, signs with writing, risky heights, or empty backgrounds. Any humans are stylized original 3D designs dressed for the story's world with no logos or writing, described in one `Humans:` sentence that is identical in every shot, and no human child is alone in danger.
- [ ] The originality pass in section 10 of `prompt-assembly.md` passes: no named protected work and no "in the style of", every story cast design is original, no beat copies a famous scene's setting, prop, action, and framing together, no character sends out energy, and every audio cell describes the music by the instruments, tempo, and feeling from the `Music lock:`, with no named song or artist.
- [ ] File saved in `prompts/` with a kebab-case name ending in `-60s-storyboard.md`.

## Output template

````markdown
# <Title> 60s Storyboard

<One or two sentences: what happens and the moral or emotional point.> It has been strictly formatted for AI video generation according to character styling rules, environment locks, cinematic direction, and social media prompt guidelines. There is no dialogue; every line from the original story is carried by gesture, expression, and sound.

## Flow setup

This storyboard is six 10-second Google Flow videos that cut together into one 60-second film, made in a new Flow project with the saved Yeti Characters, as `.agents/rules/google-flow.md` sets out. Each video has a table, the master its panel images are built from, then an `Ingredients:` line and a `Flow prompt:` block, the only text Flow receives for that clip. The six checked panel images for each video are in `prompts/<kebab-case-title>-60s-3x2.md` under the same `## Video N - <Title>` heading; if that file does not exist, run `/create-3x2-timed-image` on this storyboard first.

1. New project named "<Title>". Settings: Omni Flash (Gemini Omni Flash 1.1), Video, Ingredients, vertical 9:16, 10 seconds, 360p for drafts. "Return silent videos" off. Turn the Agent on and, in its Settings, set the default video model to Omni Flash, orientation vertical, and "Confirm before generating" to Always.
2. Characters: type `@` and check <the @ names of the Yetis in this film> resolve to the saved Characters. <If any: create a Character for each named story cast member: its handle as the name, its cast sentence from the `Cast lock:` as the description, and a full-body portrait on a plain light-grey background.>
3. Plates: generate <Plate - <Location> for each location in the `Environment lock:`>, as section 3 of `google-flow.md` says.
4. Agent instructions: add the three cards under "Google Flow Agent instructions", each with its title, reference image, and guideline, toggled on.
5. Upload <`Family height chart` (`references/characters/family-height-chart.png`), if Babu Yeti shares a shot with a grown-up, and> any panel image named on an `Ingredients:` line.

Then, for each video in order: attach the ingredients on its `Ingredients:` line, paste its `Flow prompt:` block (with the Agent on, add the line under it), and check, upscale, save `End frame V<N>`, and assemble in Scenebuilder as section 4 of `google-flow.md` says. Compare each clip with its six panel images at their timecodes. <If any: Video <N> opens a new scene, on its plate rather than the previous end frame.>

Every Flow prompt runs on its own 00:00 - 00:10 clock; the `Film position:` and `Stage:` lines are for the operator and the editor, never for Flow. If a clip comes out the wrong length, check the model and the length setting first. If a clip needs a change, change the table first, then rewrite the Flow prompt from it and regenerate any panel image the change touches. If Flow refuses a clip, ask the Agent what triggered it (the `Clip rules` card tells it how to answer) and check its rewrite keeps the timestamps, the `@` names, the style sentence, and the Avoid line. If it cannot clear it, retry one change at a time and stop at the first that passes: (1) replace the Sound line with "Soft background music. No dialogue, no lyrics."; (2) remove the effect wording; (3) cut each shot to its main physical action; (4) remove the Avoid line from the clip prompt only; (5) remove the panel image guide. Copy any change that passes back into the table, and note the trigger here so the next story avoids it.

## Google Flow Agent instructions

Paste each card into Flow's Agent instructions panel ("+ Add instruction" for each): the title into Instruction title, the image into Reference, and the text into the guideline box.

### Instruction 1 - Yeti family series

Reference: `Family height chart` (`references/characters/family-height-chart.png`)

```text
<Instruction 1 from section 5 of `.agents/rules/google-flow.md`, word for word.>
```

### Instruction 2 - <Title> story

Reference: `Plate - <first location>`

```text
<Written for this film as section 5 of `.agents/rules/google-flow.md` sets out, under about 250 words: the premise and tone; which characters, by @ name, are in which videos and their roles; each location and its videos; the light; the music palette and how it moves; the key props; any scene break. No description of how any Yeti looks.>
```

### Instruction 3 - Clip rules

Reference: None

```text
<Instruction 3 from section 5 of `.agents/rules/google-flow.md`, word for word, with six as the number of videos.>
```

## Film locks

Aspect ratio lock: vertical 9:16 for every clip, set in Flow's settings and stated in the first line of every prompt.

Character lock: the Yetis are the saved Flow Characters @Papa Yeti, @Mama Yeti, and @Babu Yeti. Their look lives in those Characters and in `.agents/rules/character-consistency.md`, and is never described in this file. <Name which Yetis are in which videos.> Babu Yeti's curl reaches only to a grown-up's belly in every shot they share.

<If any: Cast lock: the `Humans:`, `Animals:`, and `Creatures:` sentences, word for word, and each member's role in the story, where it is, and what it does in each video.>

Prop lock: <every prop, what it is made of, where it sits. No brands, labels, or packaging.> No dialogue in any shot.

Lighting lock: <every light source in the environment, where it sits in the frame, its colour temperature, and the palette. Then how the light moves across the film: which video the light changes in, what changes it, and what it becomes.> Every clip keeps a soft rim or fill on the fur so each Yeti's colour reads true. The light at each handoff is the same on both sides of the cut.

Music lock: <the score palette for this story (the genre and two to five instruments), which instruments lead in each video, where the music builds, pauses, and resolves, and the ambient bed and action materials of each location.> The music at each handoff is the same on both sides of the cut.

Environment lock: <each location's `Environment:` sentence, word for word, its plate name, and the shots that use it.>

VFX lock: <each effect and the video it belongs to. Weather that runs through the whole location is in the `Environment:` sentence and is not listed here.> No effect comes from a Yeti, and none appears in a video that this paragraph does not give it to.

---

## Video 1 - <Title>

Film position: 00:00 - 00:10.

Stage: Exposition.

Characters: <exactly who is in this video, e.g. Papa Yeti, Babu Yeti, and the story cast handles, and no one else>

| Timestamp | Shot Type | Visual Description / Prompt | VFX | Audio / Sound FX |
| --- | --- | --- | --- | --- |
| **00:00 - 00:03** | <Framing>, <Angle> | Vertical 9:16 aspect ratio, full-frame vertical composition. <Style lock> Environment: <sentence>. Lighting: <key, fill, rim, quality and direction, contrast, colour temperature and palette, mood>. Characters: <each Yeti in the shot by name, placed left to right, or: No Yeti is in this shot.> Expressions: <Name>, <face from the section 4 table>; <Name>, <face>. <Humans: / Animals: sentences if any> <Avoid line, word for word, from section 5 of `prompt-assembly.md`> Action: <Beat 1, one sentence covering the first half of the shot and ending on a picture with highly detailed, descriptive physical actions and movements.> <Beat 2, one sentence ending on the shot's closing picture, with highly detailed, descriptive physical actions and movements, and the feeling in the Expressions: sentence.> Camera: <one move, direction, speed, what it reveals or ends on>. | Effects: <what renders, how it meets the light and action, or None>. Transition: Hard Cut. | <Music state, ambient sound, sounds for each action and effect.> No dialogue. |
| **00:03 - 00:07** | ... | ... Action: <two beats; the first ends on 00:05, the centre of the clip> ... | Effects: ... Transition: Hard Cut. | ... |
| **00:07 - 00:10** | ... | ... Action: <two beats; the second is the video's closing picture> Camera: <move>, easing to a stop in the last half second. | Effects: ... Transition: Holds on the final frame. | ... |

Ingredients: <the @ names of the characters in this video>, <Plate - <Location> for Video 1 or a scene break, otherwise End frame V<N-1>>, <Family height chart, if Babu Yeti shares a shot with a grown-up>, <at most one Panel_<P>_V<N>, if a beat needs a composition guide>.

Flow prompt:

```text
<The compact prompt Flow receives for this clip, written from the table above as section 6 of `.agents/rules/google-flow.md` sets out: format and style line, Cast line with each character's @ name and starting place and no description, Setting line, one line per shot with its timestamp, Shot Type, beats, camera, and light, a Sound line, and the Avoid line.>
```

With the Agent on, add: Generate this as one 10-second Omni Flash video, vertical 9:16, exactly as written.

---

## Video 2 - <Title>

Film position: 00:10 - 00:20.

Stage: Inciting Incident.

Characters: <exactly who is in this video, e.g. Papa Yeti, Babu Yeti, and the story cast handles, and no one else>

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10. Shot 1's first beat picks up Video 1's closing picture, under Video 1's Shot 3 light ... |

Ingredients: <the @ names of the characters in this video>, <Plate - <Location> for Video 1 or a scene break, otherwise End frame V<N-1>>, <Family height chart, if Babu Yeti shares a shot with a grown-up>, <at most one Panel_<P>_V<N>, if a beat needs a composition guide>.

Flow prompt:

```text
<The compact prompt Flow receives for this clip, written from the table above as section 6 of `.agents/rules/google-flow.md` sets out: format and style line, Cast line with each character's @ name and starting place and no description, Setting line, one line per shot with its timestamp, Shot Type, beats, camera, and light, a Sound line, and the Avoid line.>
```

With the Agent on, add: Generate this as one 10-second Omni Flash video, vertical 9:16, exactly as written.

---

## Video 3 - <Title>

Film position: 00:20 - 00:30.

Stage: Rising Action into Climax (peaks in the last beat of Shot 3, film 00:30).

Characters: <exactly who is in this video, e.g. Papa Yeti, Babu Yeti, and the story cast handles, and no one else>

| ... three shots. Shot 3's last beat is the Climax peak: the moment of highest tension, with the peak feeling on every face ... |

Ingredients: <the @ names of the characters in this video>, <Plate - <Location> for Video 1 or a scene break, otherwise End frame V<N-1>>, <Family height chart, if Babu Yeti shares a shot with a grown-up>, <at most one Panel_<P>_V<N>, if a beat needs a composition guide>.

Flow prompt:

```text
<The compact prompt Flow receives for this clip, written from the table above as section 6 of `.agents/rules/google-flow.md` sets out: format and style line, Cast line with each character's @ name and starting place and no description, Setting line, one line per shot with its timestamp, Shot Type, beats, camera, and light, a Sound line, and the Avoid line.>
```

With the Agent on, add: Generate this as one 10-second Omni Flash video, vertical 9:16, exactly as written.

---

## Video 4 - <Title>

Film position: 00:30 - 00:40.

Stage: Falling Action.

Characters: <exactly who is in this video, e.g. Papa Yeti, Babu Yeti, and the story cast handles, and no one else>

| ... three shots. Shot 1's first beat opens on the Climax peak picture under the same light and moves out of it ... |

Ingredients: <the @ names of the characters in this video>, <Plate - <Location> for Video 1 or a scene break, otherwise End frame V<N-1>>, <Family height chart, if Babu Yeti shares a shot with a grown-up>, <at most one Panel_<P>_V<N>, if a beat needs a composition guide>.

Flow prompt:

```text
<The compact prompt Flow receives for this clip, written from the table above as section 6 of `.agents/rules/google-flow.md` sets out: format and style line, Cast line with each character's @ name and starting place and no description, Setting line, one line per shot with its timestamp, Shot Type, beats, camera, and light, a Sound line, and the Avoid line.>
```

With the Agent on, add: Generate this as one 10-second Omni Flash video, vertical 9:16, exactly as written.

---

## Video 5 - <Title>

Film position: 00:40 - 00:50.

Stage: Falling Action into Resolution.

Characters: <exactly who is in this video, e.g. Papa Yeti, Babu Yeti, and the story cast handles, and no one else>

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10 ... |

Ingredients: <the @ names of the characters in this video>, <Plate - <Location> for Video 1 or a scene break, otherwise End frame V<N-1>>, <Family height chart, if Babu Yeti shares a shot with a grown-up>, <at most one Panel_<P>_V<N>, if a beat needs a composition guide>.

Flow prompt:

```text
<The compact prompt Flow receives for this clip, written from the table above as section 6 of `.agents/rules/google-flow.md` sets out: format and style line, Cast line with each character's @ name and starting place and no description, Setting line, one line per shot with its timestamp, Shot Type, beats, camera, and light, a Sound line, and the Avoid line.>
```

With the Agent on, add: Generate this as one 10-second Omni Flash video, vertical 9:16, exactly as written.

---

## Video 6 - <Title>

Film position: 00:50 - 01:00.

Stage: Resolution.

<If a scene break: Scene break: this video opens in <new location> rather than on Video 5's closing picture.>

Characters: <exactly who is in this video, e.g. Papa Yeti, Babu Yeti, and the story cast handles, and no one else>

| ... three shots. Shot 1's first beat picks up Video 5's closing picture, or opens in the new location after a scene break. Shot 3's last beat is the held, resolved closing image of the film, with the music finishing ... |

Ingredients: <the @ names of the characters in this video>, <Plate - <Location> for Video 1 or a scene break, otherwise End frame V<N-1>>, <Family height chart, if Babu Yeti shares a shot with a grown-up>, <at most one Panel_<P>_V<N>, if a beat needs a composition guide>.

Flow prompt:

```text
<The compact prompt Flow receives for this clip, written from the table above as section 6 of `.agents/rules/google-flow.md` sets out: format and style line, Cast line with each character's @ name and starting place and no description, Setting line, one line per shot with its timestamp, Shot Type, beats, camera, and light, a Sound line, and the Avoid line.>
```

With the Agent on, add: Generate this as one 10-second Omni Flash video, vertical 9:16, exactly as written.
````
