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
  Each table is that video's Flow prompt, and the file holds video prompts only: the panel
  image prompts go in the 3x2 file, and clips are generated with those images attached,
  never from start or end frames. Every spoken line becomes a gesture, expression, or prop
  action, and the audio is background music and sound effects only, so the clip works for
  a global audience.
---

# 60-second storyboard from a story

This skill takes a short prose story about the Yeti family and writes a 60-second storyboard built as six 10-second videos for Google Flow. It is step 1 of the pipeline in section 7 of `.agents/rules/cinematic-direction.md`. Each video's table is the text prompt for one 10-second clip. Every shot's `Action:` is two beats, so each video has six beats, and `create-3x2-timed-image` turns those six beats into the six panels of the video's 3x2 grid. The storyboard holds video prompts only. Every image prompt for the film, each video's six panel images, goes in `prompts/<kebab-case-title>-60s-3x2.md`, which `create-3x2-timed-image` writes, and in Flow each clip is generated from its table with those images attached as references. No clip starts or ends on a supplied frame, so the continuity between the six clips lives in the storyboard text: the first beat of each video picks up the picture the previous video ended on.

The story may contain dialogue. The storyboard never does. Every line of speech is translated into something the viewer can see: a gesture, a facial expression, a prop being handled, a change of posture. Audio is background music and sound effects only.

Every shot is directed as well as described: its framing and angle, its light, one camera move, its visual effects, and the transition out of it, in the fixed terms of `.agents/rules/cinematic-direction.md`.

The sibling skill `.agents/skills/storyboard-30s-extender/SKILL.md` produces the same table format at half the length. The reference output for this skill is `prompts/babu-yeti-found-sled-60s-storyboard.md`. Match its structure, including the aspect ratio lock in every visual cell. It predates the character locks (it carries the older character text and head lock; revise them as section 9 of `.agents/rules/prompt-assembly.md` says), the `Stage:` line under each heading, the two-beat `Action:`, and the cinematic direction (the angle in the Shot Type cell, the `Lighting:` and `Camera:` sentences, and the VFX column), so add all of those. It also carries keyframe lines from the retired start-and-end-frame workflow; leave those out. `prompts/yeti-glacier-rescue-60s-storyboard.md` is in the current format apart from its character text, which predates the character locks. It is video prompts only and shows the cinematic direction, the agent instructions, and a `VFX lock:` paragraph in full. It is widescreen 16:9, so take everything from it except its aspect ratio.

## Rules that always apply

Read these before writing anything:

- `.agents/rules/character-consistency.md`: how Papa Yeti, Mama Yeti, and Babu Yeti look, and each one's Copy-Ready Google Flow Character Lock. Copy each lock verbatim into the `Character locks:` block of every video the Yeti appears in. Never paraphrase, shorten, or add to it. Its Allowed Variations and Prohibited Changes also bind every `Action:` and `Expressions:` sentence: faces move only the eyebrows, eyelids, cheeks, and mouth, and no action changes a Yeti's design or merges two Yetis. Use this default file, never `character-consistency-alt.md`, unless the user asks for the alternate by name (the note at the top of `prompt-assembly.md` says why).
- `.agents/rules/prompt-assembly.md`: the style lock, the order of the pieces in a visual cell, the `Characters:` and `Expressions:` sentences, the expression table (section 4), the avoid line, the heroes and supporting cast rules, and the prompt construction rules.
- `.agents/rules/cinematic-direction.md`: the terms and project limits for shot type and angle, lighting, camera movement, VFX, transitions, and sound, the panel map that ties each video to its 3x2 grid (section 6), and the pipeline (section 7).
- `.agents/skills/social-media-prompt-creator/SKILL.md`: platform and safety guidelines. Section 1 (the "never" list), the TikTok note on dangerous activities, and the visual tip about backgrounds apply directly.

- The Yetis are the heroes. Papa Yeti, Mama Yeti, and Babu Yeti are the main characters and never change. If the story casts someone else as the rescuer, the helper, or the character whose choice resolves it, recast it before drafting: the hero beats go to the Yetis, and the story's other characters become the supporting cast (the ones in need, the bystanders, an animal that reacts). Supporting characters may be added, changed, or invented to fit the context (an animal family in place of people), but no supporting character ever takes a hero beat a Yeti could take, and no Yeti is ever replaced. See section 6 of `prompt-assembly.md`.

Flow-specific constraints, learned from clips that the content filter rejected:

- No dialogue. Every audio cell ends with "No dialogue."
- No brand names, logos, packaging, labels, or on-screen text. This includes signs, maps, and posters. Replace any text-bearing prop from the story with a textless equivalent (a trail map becomes a carved wooden signpost with an arrow shape, a label becomes a plain object).
- No real devices (phones, tablets, cameras). Use in-world props.
- No stock sound effect names (record scratch, cartoon boing, sad trombone). Describe each sound from scratch.
- No plain, white, or empty backgrounds. Every shot has an "Environment:" sentence.
- No horns. The Yetis have none, but the model adds horns, antlers, or spikes to a "Yeti" when the prompt leaves the top of the head undescribed, and once a grid panel or a panel image has them, the clip made with that image keeps them. Every character lock says the tuft is the only thing on the Yeti's head, and no `Action:` sentence puts a paw or prop on or above a Yeti's head (no paws folded up beside the head for a sleep mime, no arms raised overhead). Keep mimes at chest height. A head touch the story needs, such as a tuft ruffle, says the paw lifts away in the same sentence.
- Same look in every shot. Left to itself, a model turns a "Yeti" into a white, ape-like snow monster, dresses characters standing in snow in scarves and hats, and draws Babu at any size from a doll to a third grown-up, and each clip copies whatever its attached grid or panel images show. Over six videos, six grids, and 36 panel images the drift adds up. Every video's prompt opens with the full character lock of each Yeti in it, copied from `character-consistency.md`, and every visual cell carries the avoid line from section 5 of `prompt-assembly.md`. The locks hold each Yeti's colour, tuft, face, build, size, and the fact that it wears nothing, so no other sentence restates or changes them. The `Characters:`, `Expressions:`, and `Action:` text names each Yeti by name ("Papa Yeti", "Mama Yeti", "Babu Yeti"), never by colour, and agrees with the locks (paws, not hands; nothing worn; Babu Yeti about half a grown-up's height). No sentence sizes a place or a prop by a Yeti ("a pillar as tall as a grown Yeti"), because that sentence runs in every shot at its location and puts the Yeti into the ones where it is absent.
- Faces match the beat. The character text used to carry a fixed "wide cheerful toothy smile", and Flow obeyed it over anything the `Action:` sentence said, so Yetis grinned through a rescue. The locks now describe no expression, and each visual cell states every Yeti's face in an `Expressions:` sentence. Fill it per shot from the table in section 4 of `prompt-assembly.md` with the feeling each Yeti holds at the end of the shot, and write the same feeling in the `Action:` sentence. No smile of any kind on a beat of danger, worry, effort, sadness, or loss. A smiling grid panel or panel image carries its smile into the clip made with it, so an image or clip that smiles on the wrong beat gets regenerated, never used.
- Vertical 9:16 only. Flow renders 16:9 unless the prompt and the output setting both say otherwise, so every visual cell opens with the aspect ratio line and the operator sets Flow to 9:16 before generating. A clip that comes back 16:9 gets regenerated, never cropped.
- No cast energy and no film echoes. Flow has a second refusal, "I can't generate the video you requested right now due to interests of third-party content providers." That is the copyright filter, not the safety filter, and the fixes above do not clear it. It fires on named franchises, characters, studios, and art styles, on song titles, artists, lyrics, and singing, and on scene beats that copy a well-known film's signature moment even when nothing is named. A Yeti who presses paws together and sends out a dome or wave of glowing energy that changes the landscape is one of those beats (it is the plot device of a major animated Yeti film and reads as a superhero power-up). Write a magical effect as a change in light or weather that happens near the character (the light between his paws brightens, the snow softens where the light reaches) and never as something the character casts (no dome, wave, beam, burst, pulse, blast, aura, force field, or energy), and never as a change to the character's own body.
- Direction goes to Flow too. The whole row, VFX cell included, is pasted as the prompt, so every word in the `Lighting:`, `Camera:`, `Effects:`, and `Transition:` text is an instruction the filters read. No energy, explosion, or strobe effect, no named film, studio, or colour grade, and no edit instruction (a fade, a dissolve, a speed change) inside a table. Those go in the agent instructions.
- No pipe character (`|`) inside a cell. A stray pipe splits the cell and shifts every column after it.
- Music as mood, not as a score cue. Name the feeling, the tempo, and one instrument, and keep that one instrument for the whole film. Once a clip has passed the filter, every later clip names the same instrument and nothing more; do not bring in a new instrument mid-film. Do not write key changes, chord names, arpeggio directions, named tunes, lyrics, or singing. Vocal sounds stay wordless.
- Humans are allowed as supporting cast. If the story mentions people (a hiker, a family, a traveller), they may appear on screen as long as the Yetis keep the hero beats. Write them in the same 3D animated style as the Yetis, with rounded, friendly cartoon features, never as photoreal people and never as a likeness of a real person, celebrity, or named group. Give them simple in-world clothing (a woven tunic, a cloth belt, a plain scarf) with no logos, writing, or modern gear, and no real devices in their hands. Describe them once in a locked `Humans:` sentence that is copied word for word into every prompt, the same way supporting animals get an `Animals:` sentence. A human child in the scene stays with an adult, never enters water, never falls, and is never alone in danger; the filter reads a child in peril as harm, so write worry, not terror.
- No risky physical action. If the story has a character high on a cliff, in a crevice, or on thin ice, bring the action down to a safe height or a gentle slope. TikTok moderates anything that reads as a dangerous stunt, especially with a child character.
- Every video table runs on its own clock, from 00:00 to 00:10. Flow reads the timestamps in a prompt as that clip's clock. A table that starts at 00:30 or 00:50 makes Flow try to render a clip far longer than 10 seconds, split the prompt into several clips, or fail with an error. The film-level position of a video lives in a `Film position:` line outside the table and is never pasted into Flow.
- Beats come first, and the grid is built from them. Every shot's `Action:` is exactly two sentences, one per beat, and each beat becomes one panel of the video's 3x2 grid, as the panel map in section 6 of `cinematic-direction.md` sets out: three shots, six beats, six panels per video. `create-3x2-timed-image` builds each grid, and a full-size image of each panel, from these beats. The count is fixed by Flow, which takes at most seven ingredient images for one clip: a video's six panel images and the family reference image. Write every beat to end on one picture a viewer could photograph: positions, poses, paws, props, eye lines, and any face that changes. A beat that only describes motion, or leaves a character's position unstated, produces a panel that fights the clip.
- No start or end frames. Clips are generated with the grid or its panel images attached as references, so the storyboard carries no `Frames:`, `Start frame:`, `Midpoint frame:`, or `End frame:` lines, and the agent instructions never tell the operator to set a start or an end image. The continuity those lines used to hold now lives in the beats: the first beat of every video after the first describes the picture the previous video's last beat ended on, unless the video is marked `Scene break:`.
- Video prompts only. The storyboard holds no image prompt: no `Create image:` line, no `Grid:` or `Stills:` line, and no step for generating or checking an image. Every image prompt goes in the 3x2 file that `create-3x2-timed-image` writes, and the agent instructions name that file so the operator knows where each clip's images come from. The lock paragraphs say what the clips must show; the 3x2 file's intro says how to check the images against them.

## Workflow

### 1. Read the story

Take the input as pasted prose or as a file path. The input may also be a source storyboard from `video-to-storyboard`: a five-column table (`Timestamp | Shot Type | Visual Description | VFX | Audio / Sound FX`) with `**Environment:**`, `**Lighting:**`, `**Subjects & Action:**`, and `**Camera Movement:**` in the visual cells and `**Observed:**`, `**Transition:**`, and `**Recommended:**` in the VFX cells. Treat it as the story, told shot by shot. Its environment becomes the `Environment:` sentence, recast to the Yeti world. Its lighting becomes the lighting plan. Its subjects and action become the beats, recast so the Yetis hold the hero beats. Its camera moves and observed effects are kept where they pass the limits in `cinematic-direction.md` and replaced where they do not (a fire beam becomes a thrown snowball, an explosion becomes a cloud of powder snow off a falling slab). Its recommended moves and effects are options, not beats. Its dialogue goes through step 2 like any other.

Extract and write down, before drafting:

- Title (make one if the story has none) and a one-line premise.
- The moral or emotional point of the story, in one sentence. Every video must serve it.
- Which characters appear. Map the story's names to the project's: "Baby Yeti" or "Little Yeti" is Babu Yeti, "Mother" is Mama Yeti, "Father" is Papa Yeti. Then note who holds each hero beat (who notices the problem, who acts on it, whose choice resolves it). If any hero beat belongs to a non-Yeti, or the story has no Yetis, recast it now: the Yetis take the hero beats, and the story's other characters become supporting cast, kept as humans or replaced with in-world animals, whichever fits the story. Supporting humans get one locked `Humans:` sentence and supporting animals one locked `Animals:` sentence, each copied word for word into every prompt, as in `prompts/yeti-family-river-rescue-30s-storyboard.md` (humans) and `prompts/papa-yeti-warm-dome-30s-storyboard.md` (animals).
- Every location. Note where the story moves and why.
- Every prop. Flag any prop that carries text, a brand, or a real-world product.
- The light at each location: time of day, weather, and every light source the environment holds (sun, sky, hearth, lantern, glowing moss). These become the `Lighting lock:` in the agent instructions. If a location needs a source it lacks, add it to that location's `Environment:` sentence now.
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
| Explaining a consequence, "how would you feel if" | Mime in three parts at chest height, one per beat: points at the child, mimes the scenario (cheek resting on the back of one flat paw held beside the jaw for sleep, then a thing cradled in both paws), then turns one paw over to show it empty. Paws never go up beside or above the head |
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

Add nothing the story does not already imply. Good additions: a reaction from the other parent, a small gesture of affection, a prop being set down with care. Bad additions: a new character, a new prop that changes the story, a joke that undercuts the moral, a second location the story never visits, a supporting character taking over a beat that a Yeti should carry.

### 4. Handle location changes

Each video's first beat picks up the picture its predecessor ended on, so a location can only change at a video boundary and only in one of two ways:

- **Walk-through**: the last beat of the video shows the characters walking out of frame or along a path, and the first beat of the next video shows them arriving in the new environment. Use this when the two places are close (a cave mouth and the slope outside it).
- **Scene break**: the next video opens in the new location instead of picking up the previous video's last beat. Use this when the story jumps (from a mountain ledge to a trail far below). Mark it with a `Scene break:` line directly under that video's `Stage:` line, write its first beat as the new environment and the opening pose, and tell the operator in the agent instructions which video starts fresh so the editor expects a hard cut.

Keep location changes to two at most across the sixty seconds. Each location gets one `Environment:` sentence, decided in step 1 and never reworded within that location. A video never changes location partway through, because its six panel images share one `Environment:` sentence. Light hands off the same way the picture does. After a walk-through, the next video's Shot 1 keeps the previous Shot 3 `Lighting:` sentence word for word, and the new location's light starts with the first shot set there. A scene break starts under its own light, set out in the `Lighting lock:`.

### 5. Write the shots

Each video has three shots. Every video's table starts at 00:00 and ends at 00:10, no matter where the video sits in the film. Videos 2 through 6 do not continue the clock from 00:10, 00:20, and so on. The split is fixed: `00:00 - 00:03`, `00:03 - 00:07`, `00:07 - 00:10`, the same three ranges in all six videos, because the panel timecodes in every grid are built on it. The only place `01:00` appears is the `Film position:` line of Video 6.

Each table has five columns: `| Timestamp | Shot Type | Visual Description / Prompt | VFX | Audio / Sound FX |`. Every cell uses the same labels in the same order in every row, and no cell contains a pipe character.

The Shot Type cell names the framing from the ladder in section 1 of `cinematic-direction.md`, then the angle: `Wide Shot, Eye Level`, `Medium Three-Shot, Low Angle`, `Close-Up, Eye Level`. When the camera move changes the framing, name both ends: `Medium Shot to Close-Up, Eye Level`. Vary the framing within each video, and do not repeat the same framing three times in a row. The grid takes each panel's framing from this cell, as section 6 of `cinematic-direction.md` sets out.

Above each table, directly under the video's `Stage:` line (and its `Scene break:` line, if it has one), goes its `Character locks:` block: the line `Character locks:` and then one fenced code block holding the full Copy-Ready Google Flow Character Lock of every Yeti who appears in any of the video's six beats, copied from `character-consistency.md` character for character, one lock per paragraph, in the order Papa Yeti, Mama Yeti, Babu Yeti. A Yeti who is in none of the video's shots gets no lock in it. The block and the table are pasted into Flow together, block first, as one prompt (section 3 of `prompt-assembly.md`).

Every visual cell follows this order, with each piece copied exactly:

1. Aspect ratio lock: `Vertical 9:16 aspect ratio, full-frame vertical composition.` Word for word, in every cell, before anything else.
2. Style lock, from section 1 of `prompt-assembly.md`.
3. `Environment:` sentence for the current location.
4. `Lighting:` one sentence naming the key, fill, and rim, their quality and direction, the contrast, the colour temperature and palette, and the mood, as section 2 of `cinematic-direction.md` sets out. Every source it names is in the `Environment:` sentence, and it keeps a soft warm light on the fur. It holds the light at the end of the shot.
5. `Characters:` sentence naming the Yetis in the shot and where each stands, left to right, in the forms section 3 of `prompt-assembly.md` gives (`Characters: Babu Yeti.`, `Characters: Papa Yeti on the left and Babu Yeti on the right.`, `Characters: Papa Yeti on the left, Babu Yeti in the center, and Mama Yeti on the right.`). Every Yeti it names has a lock in the video's `Character locks:` block. Keep the same Yeti on the same side in every shot unless the action moves them, and if it moves them, keep them there for every later shot. A shot without a Yeti says `No Yeti is in this shot.` instead.
6. `Expressions:` sentence giving each Yeti in the shot, in the same order, a face from the section 4 table of `prompt-assembly.md`: the feeling that Yeti holds at the end of the shot (`Expressions: Papa Yeti, <row>; Babu Yeti, <row>.`). Left out in a shot with no Yeti.
7. Supporting cast, if any: a `Humans:` sentence and/or an `Animals:` sentence describing every supporting character, identical in every shot at every location.
8. Avoid line, word for word, from section 5 of `prompt-assembly.md`, after the supporting cast sentences (or after the `Expressions:` sentence, or the no-Yeti sentence, when there are none).
9. `Action:` exactly two sentences, one per beat, in order. Each beat is concrete body movement, expression, and eye line, and ends on a picture (the beat rules below). The feeling named in the second beat must agree with the `Expressions:` sentence; if a feeling changes during the shot, the beat where it changes names the new feeling, and the `Expressions:` sentence holds the destination. If the light changes, the first beat says so, and the `Lighting:` sentence holds the new light. Where a line of dialogue was, write the replacement from your step 2 list.
10. `Camera:` one sentence naming one move from the list in section 3 of `cinematic-direction.md`, then its direction, its speed, and what it reveals or ends on. The move matches the Shot Type cell: a move that changes the framing starts on the first framing named there and ends on the second.

The two beats of each shot become the shot's two panels in the grid, so write them to the panel map in section 6 of `cinematic-direction.md`:

- Beat 1 starts from the shot's opening picture, covers the first half of the shot, and ends on a picture seen in the shot's opening framing. In Shot 1 of Videos 2 to 6, it holds the picture the previous video's last beat ended on, with the same positions, paws, props, eye lines, and faces and at most a small change (a face that starts to change, a turn of the head), except under a `Scene break:` line. In Shot 2 it ends on 00:05, the centre of the clip.
- Beat 2 covers the second half and ends on the picture the shot closes on, seen in the shot's closing framing, with the feeling in the `Expressions:` sentence. In Shot 3 it is the video's closing picture, which the next video's first beat picks up. In Video 3 it is the Climax peak.
- Each beat is one sentence with a full stop at its end, and no sentence straddles two beats. A beat may carry two linked actions (a slide into the hollow, then an arm around the child) as long as it ends on one picture. Name each Yeti in every beat it is in, by name, and say where it is. A character who leaves or enters the frame does so inside a beat, and the beat says so.
- A Yeti the shot's `Characters:` sentence names is in the shot, and a Yeti who is not in the shot is left out of its `Characters:` and `Expressions:` sentences and named in its `Action:` as `<Name> is not in the shot.` A Yeti named as present who is absent puts that Yeti on screen.

Every VFX cell holds two labelled sentences, in this order:

- `Effects:` what Flow renders in this shot, from the effects in section 4 of `cinematic-direction.md`: what each effect does and how it meets the light and the action. Every effect has a cause in the `Environment:` sentence or the `Action:` text, and none comes from a Yeti. `Effects: None.` when the shot has none.
- `Transition:` `Hard Cut.` or `Match Cut.` (with what it matches) for Shots 1 and 2, and `Holds on the final frame.` for Shot 3. The cut to the next video happens in the edit.

Every audio cell names the music state (starts, continues, pauses, swells, softens, resolves), the ambient sound of the place, a sound for each physical action and each visible effect, and ends with "No dialogue." Pick one instrument palette for the whole minute and keep it. Vocal sounds are allowed if they are not words: a gasp, a giggle, a soft sigh, a happy hum.

### 6. Lock the continuity between videos

No clip starts or ends on a supplied image, so each handoff between videos is held by the text of both tables. Follow section 6 of `cinematic-direction.md`:

- Picture. The first beat of each video's Shot 1 holds the picture the second beat of the previous video's Shot 3 ends on: the same characters in the same places, the same paws and props, the same eye lines, and the same faces. Only the framing may differ, because each shot has its own. Panel 1 of each grid then shows the same picture as panel 6 of the grid before it. The one exception is a video marked `Scene break:`, whose first beat describes the new environment and the opening pose.
- Face. The feeling a Yeti holds at the start of a video's Shot 1 is the feeling in the previous video's Shot 3 `Expressions:` sentence. If it changes in Shot 1, the beat where it changes says so.
- Light. The `Lighting:` sentence of each video's Shot 1 is the previous video's Shot 3 `Lighting:` sentence, word for word, except under a `Scene break:` line. The light never changes during a Shot 1, and a change in a Shot 2 or a Shot 3 happens in its first beat.
- Camera. Every Shot 3 `Camera:` sentence ends by easing to a stop, and every Shot 1 `Camera:` sentence in Videos 2 to 6 starts from rest.
- Climax. Video 3's last beat is the Climax peak, so Video 3's Shot 3 carries the hardest light and the strongest move of the film (a Low Angle push-in or an Arc), and its second beat names the peak feeling on every face. Video 4's Shot 1 opens on that picture under that same light, and moves out of it rather than holding it, before the warmth returns later in Video 4.

### 7. Write the file

Save to `prompts/<kebab-case-title>-60s-storyboard.md`. Derive the kebab-case title from the story's title, dropping any leading article. Never overwrite an existing file.

Use the template below. The "Agent instructions" section at the top is for whoever, or whatever agent, operates Google Flow. Keep it in the file. Its `Lighting lock:` paragraph names each location's light sources, colour temperatures, and palette from step 1 and how the light moves across the six videos. Its `VFX lock:` paragraph names which effects belong to which video, so an effect never leaks into a clip that should not have it.

What Flow receives is one video at a time, its `Character locks:` block and its table and nothing else, plus the images from the 3x2 file for the route the operator chose. Headings, the `Film position:`, `Stage:`, and `Scene break:` lines, and the agent instructions stay in the file for the operator and the editor.

Then name the next step. If the user asked only for the storyboard, say that `/create-3x2-timed-image` on this storyboard writes the image prompts, six panel images for each of the six videos, and composes each video's 3x2 grid from the generated panel images, and that the agent instructions expect those images before any clip is generated. Run it as its own step, not in this run. If the user asked for the images too, finish and verify this file first, then run `create-3x2-timed-image` on it.

### 8. Revise an older storyboard

Four kinds of older storyboard need this step. One written before the grid pipeline has `Frames:` lines under its headings and `Start frame:`, `Midpoint frame:`, and `End frame:` lines under its tables, and its agent instructions tell the operator to set start and end images. One written before the storyboard held video prompts only has `Grid:` and `Stills:` lines under its headings, and its agent instructions say how to generate and check grids and reference stills. One written for the retired 3x3 grid has three beats in every `Action:`, and its agent instructions name a `-3x3.md` file and panel images 3, 6, and 9. And any storyboard written before the character locks has short character text with an `[EXPRESSION]` slot, `Head lock:`, `Look lock:`, and `Scale lock:` sentences in its cells, and names the Yetis by colour. When this skill or `create-3x2-timed-image` works on any of them, bring it up to this skill's format first, without changing a story beat, a light, a framing, or a face:

1. If it predates the character locks, revise it as section 9 of `prompt-assembly.md` sets out: add a `Character locks:` block above each table, replace each cell's character text with a `Characters:` sentence and its `[EXPRESSION]` values with an `Expressions:` sentence, delete the head, look, and scale lock sentences, and rename the Yetis in every `Action:` from colour to name. Update the agent instructions' lock paragraphs to the template's.
2. If it has keyframe lines, rewrite each `Action:` as two beats that follow step 5. Use the deleted keyframe lines as the pictures: Shot 1's first beat opens on the `Start frame:` picture, Shot 2's first beat ends on the `Midpoint frame:` picture, and Shot 3's second beat is the `End frame:` picture.
3. If its `Action:` cells have three beats, rewrite each as two. Keep the picture the first beat opens on and the picture the third beat closes on, and fold the middle beat into the neighbour it belongs with, keeping its actions and faces. In Shot 1 of every video after the first, fold it forward into the second beat, so the first beat still holds the handoff picture.
4. Delete every `Frames:`, `Start frame:`, `Midpoint frame:`, `End frame:`, `Grid:`, and `Stills:` line, and any `Create image:` prompt.
5. Replace the agent instructions with the template's, carrying over every lock paragraph and any film-specific note (a likely filter trigger and its fix, a changed aspect ratio) that does not rely on start or end frames. Take the image checks out of the lock paragraphs, and move any note about the images themselves (which characters may appear in which images, an image that has to be regenerated) into the intro of the 3x2 file. A note that names grid rows or panel numbers from the 3x3 grid is renumbered to the six-panel map. A film with its own `Aspect ratio lock:` (`prompts/yeti-glacier-rescue-60s-storyboard.md` is 16:9) keeps its aspect ratio line everywhere the template says 9:16.
6. Run the checklist in step 9, and tell the user the storyboard was updated.

A frames file in `image-prompts/`, from the start-and-end-frame workflow or the retired stills route, is left in place for the record. The panel images in the 3x2 file replace it.

### 9. Verify before finishing

Check every item. Fix and re-check rather than reporting a partial result.

- [ ] Six videos, each exactly 10 seconds. Every table has three rows, `00:00 - 00:03`, `00:03 - 00:07`, and `00:07 - 00:10`, in that order. No timestamp above `00:10` appears anywhere in a table.
- [ ] Each video heading reads `## Video N - <Title>` with a spaced hyphen, has no timestamps, and is followed, in order, by a `Film position:` line (00:00 - 00:10 through 00:50 - 01:00), a `Stage:` line naming the stage that video carries, and a `Scene break:` line if it has one.
- [ ] No start or end frame logic remains: `grep -cE "^(Frames|Start frame|Midpoint frame|End frame):" <file>` returns 0, and no step in the agent instructions sets a start image, an end image, or frames-to-video.
- [ ] The file holds video prompts only: `grep -cE "^(Grid|Stills):|Create image:" <file>` returns 0, and the agent instructions name `prompts/<kebab-case-title>-60s-3x2.md` for each clip's images but give no steps for generating or checking an image. `grep -ciE "3x3|nine panel|panel images 3, 6" <file>` returns 0.
- [ ] Every beat of the story appears, in order.
- [ ] The six stages appear in order across the six videos: Exposition, Inciting Incident, Rising Action, Climax, Falling Action, Resolution. The Climax peaks in the last beat of Video 3, at film 00:30, and that beat names the peak feeling on every face. No beat in Videos 4 to 6 introduces a new problem, and no beat in Videos 1 to 3 resolves one. Each `Stage:` line matches what its video's shots do.
- [ ] Every `Action:` is exactly two sentences, one per beat, each ending on a picture, so each video has six beats for the six panels of its grid. Every Yeti in a beat is named by name and placed. The second beat of each shot ends on the feeling in that shot's `Expressions:` sentence. No shot's `Characters:` sentence names a Yeti its `Action:` says is not in it.
- [ ] Every hero beat (noticing, acting, resolving) belongs to Papa Yeti, Mama Yeti, or Babu Yeti. No supporting character rescues, solves, or resolves, and no main character is missing, renamed, or replaced.
- [ ] Every spoken line has a visual replacement in an `Action:` cell. No speech, lip-sync, speech bubbles, or written words.
- [ ] Every visual cell opens with the aspect ratio lock line, before the style lock, in all eighteen shots.
- [ ] Every video has a `Character locks:` block directly above its table, holding the full lock of every Yeti its `Characters:` sentences name and of no other Yeti, each character-for-character identical to the `text` block in `character-consistency.md`, in the order Papa Yeti, Mama Yeti, Babu Yeti.
- [ ] The style lock is character-for-character identical to section 1 of `prompt-assembly.md` in every cell.
- [ ] Every visual cell with a Yeti has a `Characters:` sentence after the `Lighting:` sentence and an `Expressions:` sentence after it, naming the same Yetis in the same order. A cell with no Yeti says `No Yeti is in this shot.` and has no `Expressions:` sentence. `grep -cE "Head lock:|Look lock:|Scale lock:|\[EXPRESSION\]" <file>` returns 0.
- [ ] Every face in an `Expressions:` sentence is a row from the section 4 table of `prompt-assembly.md`, in the right column for that Yeti, matches the beat of its shot, and agrees with the expression in its `Action:` text. No shot on a beat of danger, worry, effort, sadness, or loss contains a smile of any kind. `grep "toothy smile"` on the file returns only shots whose beat is happy, playful, or proud.
- [ ] The avoid line follows the supporting cast in every visual cell, word for word: `grep '^| \*\*00:' <file> | grep -c "Avoid: "` returns 18.
- [ ] No `Action:` sentence puts a paw or prop on or above a Yeti's head without the paw lifting away in the same sentence.
- [ ] Every `Characters:`, `Expressions:`, and `Action:` sentence names each Yeti by name, never by colour, and every `Action:` agrees with the locks: paws, not hands, nothing worn, Babu Yeti about half a grown-up's height. No sentence sizes a place or a prop by a Yeti.
- [ ] Each location has one `Environment:` sentence, identical in every shot at that location, and no video changes location partway through.
- [ ] Left/right positions are stable.
- [ ] Every table has the five-column header `| Timestamp | Shot Type | Visual Description / Prompt | VFX | Audio / Sound FX |`, and every row has exactly six pipe characters, so no cell contains one. `awk -F'|' '/^\| \*\*00:/ && NF != 7' <file>` prints nothing.
- [ ] Every Shot Type cell names a framing from the ladder and an angle, and a shot whose move changes the framing names both ends, at most two rungs apart. No Bird's-Eye View or steep High Angle on a shot where a Yeti is more than small in the frame, and no Dutch Angle in the Resolution.
- [ ] Every visual cell has one `Lighting:` sentence directly after the `Environment:` sentence and one `Camera:` sentence at the end, after the `Action:` text. `grep '^| \*\*00:' <file> | grep -o "Lighting: " | wc -l` returns 18, and the same count for `"Camera: "`, `"Effects: "`, and `"Transition: "` returns 18 each.
- [ ] Every `Lighting:` sentence names only sources in its location's `Environment:` sentence, keeps a soft warm light on the fur, and follows the arc (soft and high-key in the Exposition, low-key at the Climax, warm and golden in the Resolution). No light from below a face, no strobing or flashing, no named film or grade.
- [ ] The light never changes during a Shot 1, and a change in a Shot 2 or a Shot 3 is described in its first beat. The Shot 1 `Lighting:` sentence of Videos 2 to 6 is word for word the Shot 3 `Lighting:` sentence of the video before, except under a `Scene break:` line.
- [ ] The first beat of Shot 1 in Videos 2 to 6 holds the same picture, with the same positions, paws, props, eye lines, and faces, as the last beat of the previous video's Shot 3, except under a `Scene break:` line, where it describes the new location and the opening pose.
- [ ] Every `Camera:` sentence names one move from the list, with direction and speed, and agrees with its Shot Type cell. Every Shot 3 move eases to a stop, and every Shot 1 move in Videos 2 to 6 starts from rest. Whip Pan at most once, never at a shot's start or end.
- [ ] Every VFX cell has `Effects:` then `Transition:`. Every effect is on the list in section 4 of `cinematic-direction.md` and has a cause in the environment or the action, and no effect is energy, an explosion, a flash, on-screen text, a morph, or anything coming from a Yeti other than breath misting in the cold. Shots 1 and 2 end on `Hard Cut.` or `Match Cut.`, and every Shot 3 on `Holds on the final frame.` No fade, dissolve, or speed change inside a table.
- [ ] Every effect that makes a sound has that sound in the audio cell of the same row.
- [ ] Every audio cell ends with "No dialogue."
- [ ] No brands, real devices, stock sound effect names, on-screen text, signs with writing, risky heights, or empty backgrounds. Any humans are stylized, in in-world clothing, described in one `Humans:` sentence that is identical in every shot, and no human child is alone in danger.
- [ ] No character casts energy (dome, wave, beam, burst, aura), no named franchise, studio, style, song, or artist, and every audio cell describes music as mood plus instruments, not as a score cue.
- [ ] File saved in `prompts/` with a kebab-case name ending in `-60s-storyboard.md`.

## Output template

````markdown
# <Title> 60s Storyboard

<One or two sentences: what happens and the moral or emotional point.> It has been strictly formatted for AI video generation according to character styling rules, environment locks, cinematic direction, and social media prompt guidelines. There is no dialogue; every line from the original story is carried by gesture, expression, and sound.

## Agent instructions

This storyboard is six 10-second Google Flow videos that cut together into one 60-second film. The file holds the video prompts only: each video's `Character locks:` block and table, pasted together, are the text prompt for one Flow generation. The images each clip is generated with, the video's six panel images and the 3x2 grid composed from them, are listed in `prompts/<kebab-case-title>-60s-3x2.md` under the same `## Video N - <Title>` heading, with the steps for generating and checking them. No clip starts or ends on a supplied frame.

Follow these steps in order.

1. Before generating a clip, generate its video's six panel images, check them, and compose its grid from them, as `prompts/<kebab-case-title>-60s-3x2.md` says. If that file does not exist, run `/create-3x2-timed-image` on this storyboard to write it. Do not generate a clip without its images.
2. Set Flow's output format to vertical 9:16 before generating any clip, and check it again before each one. Flow falls back to 16:9 on a new session.
3. Generate Video 1 in Flow's ingredients-to-video mode. Attach the Video 1 images for the route you pick in the 3x2 file: the six panel images (`Panel_1_V1.jpg` to `Panel_6_V1.jpg`) and the family reference image, which is seven images and the most Flow accepts for one clip, or the composed grid (`Grid_V1.jpg`) and the family reference image. Paste the Video 1 `Character locks:` block and then its three table rows, in order, as one prompt, VFX cells included. Do not generate the rows separately, do not leave the locks out, and do not set a start or an end frame.
4. Check the clip: vertical 9:16, and it matches its video's grid panels and panel images in pose, expression, colour, tuft, size, head, framing, and light, each at its timecode. No Yeti changes colour, grows or shrinks, or picks up clothing partway through, and none of the grid's label text appears. The camera moves the way each `Camera:` sentence says, and no effect appears that its `Effects:` sentence does not name. If it drifts, regenerate the clip before continuing; do not fix it in the edit.
5. Generate each following video the same way, with its own images and its own `Character locks:` block and table as the prompt. Its first beat picks up the picture the video before it ended on, under the same light. Put the end of the previous clip beside the start of the new one and regenerate the new clip if the cut jumps in position, face, colour, or light. Repeat the checks in step 4 after every clip.
6. <If any: "Video N starts a new scene, as the `Scene break:` line under its heading says. Its first beat opens in the new location rather than on the end of Video N-1, so expect a hard cut in the edit, or a short dissolve if the editor prefers.">
7. Cut the six clips together in order with hard cuts and no other transitions, apart from a scene break, which may take a short dissolve. Keep the music continuous across the cuts. Apply one colour grade to the whole cut, matched to the palette in the `Lighting lock:` paragraph, so the six clips read as one film. Do not retime any clip; each one stays exactly 10 seconds.

Every video's table runs on its own 00:00 - 00:10 clock. Paste one video into Flow at a time: its `Character locks:` block and its table, and nothing else. The `Film position:` and `Stage:` lines under each heading say where the clip sits in the finished 60-second cut and which stage it carries; they are for the operator and the editor, not for Flow. If Flow produces more than one clip, a clip longer than 10 seconds, or a timing error, the prompt contained timestamps above 00:10. Remove them and retry.

Every visual cell opens with `Vertical 9:16 aspect ratio, full-frame vertical composition.` Keep that line in the prompt even when Flow's output format is already set to 9:16. The setting and the line together are what stop it reverting to widescreen. If a clip renders 16:9, regenerate it with the format reset rather than cropping, because cropping throws away the top and bottom of the framing.

Do not change the character locks, the aspect ratio line, style lock, `Environment:` sentences, `Lighting:` sentences, `Characters:` sentences, avoid line, or the `Humans:` and `Animals:` sentences in any prompt. The images in the 3x2 file were generated with those locks and under that light, so a clip prompt with different ones fights the images attached to it. Only the `Expressions:` sentences, the `Action:` text, the `Camera:` and VFX text, and the audio text differ between shots, and each `Expressions:` sentence is already set to match its beat. If Flow rejects a clip, read the message. "This prompt may violate our policies" is the safety filter, and the cause is almost always a brand, a real device, a named stock sound effect, on-screen text, dialogue, or an effect that reads as harm (fire, a blast, a flash). "I can't generate the video you requested right now due to interests of third-party content providers" is the copyright filter, and the cause is a name, a style, a song, a named look, or an `Action:` or `Effects:` sentence that reads like a famous film moment. Hand the prompt to Flow's agent first: it can see what the filter matched, which the message does not say. Give it this request, with the refused prompt pasted under it:

> This prompt was refused with "I can't generate the video you requested right now due to interests of third-party content providers." Find what triggered the refusal and rewrite the prompt so it passes. Keep the three rows and their timestamps (00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10), and keep each `Action:` at two sentences, one per beat. Change only the `Action:` sentences, the `Camera:` sentences, the VFX cells, and the audio text. Do not change, shorten, or reorder the character locks above the table, the aspect ratio line, the style lock, the `Environment:` sentence, the `Lighting:` sentences, the `Characters:` and `Expressions:` sentences, the `Avoid:` sentence, the `Humans:` sentence, or the `Animals:` sentence. Keep every story beat, keep the <instrument> as the only instrument, keep "No dialogue." at the end of each audio cell, and tell me what you changed and why.

Check the agent's rewrite before generating: every locked sentence must still be there word for word, no timestamp may be above 00:10, every `Action:` must still have two beats, and every audio cell must end with "No dialogue." If the agent touched a lock, paste the original lock back over its version. Once the rewritten prompt passes, copy its `Action:`, `Camera:`, VFX, and audio changes back into this storyboard, rewrite that video's panel images in the 3x2 file to match, regenerate them, and compose its grid again, and note what the agent said the trigger was so the next storyboard avoids it. The later videos are then written against what was actually generated.

If the agent cannot clear it, or there is no agent in the session, work through these retries in order, one change at a time, and stop at the first that passes: (1) replace every audio cell with "Soft background music. No dialogue."; (2) replace every VFX cell with `Effects: None. Transition: Hard Cut.` (`Holds on the final frame.` in the last row); (3) cut each `Action:` beat to its main clause, keeping two beats; (4) remove the `Avoid:` sentence from the clip prompt only, since a word like "horror" or "sharp teeth" can trip a filter even in a list of things to avoid, and the attached images keep it and carry the look into the clip; (5) swap the attached images for the other route's (the grid and the family reference image for the six panel images and the family reference image, or the other way round), or generate from the table alone with no images attached and check the clip against the panel images, because the filter judges the attached images along with the prompt. Never change or drop a character lock, the `Lighting:` sentences, or any other lock.

Aspect ratio lock: vertical 9:16 for every clip, set in Flow's output format and stated in the first line of every prompt.

Character lock: every Yeti in a video has its full Copy-Ready Google Flow Character Lock from `.agents/rules/character-consistency.md`, word for word, in that video's `Character locks:` block, and every shot names who is in it in a `Characters:` sentence and gives each face in an `Expressions:` sentence. Papa Yeti is sapphire blue with a messy upward tuft, Mama Yeti bubblegum pink with a swept-back tuft, and Babu Yeti mint green with a single curl and about half their height. None has horns or anything on its head besides its tuft, and none wears anything. <Name which Yetis have a lock in which videos.> Run the look check in section 7 of `.agents/rules/prompt-assembly.md` on every clip. A clip with anything on a Yeti's head, or with any Yeti off its lock, is regenerated and never used, and if its attached images have the fault too, they are regenerated first, because an image carries its faults into the clip made with it.

<If any: Human lock and/or Animal lock: the supporting cast sentence(s), word for word, and where each supporting character is and what it does in each video.>

Prop lock: <every prop, what it is made of, where it sits. No brands, labels, text, or packaging.> No dialogue in any shot.

Environment lock: <Location A sentence.> <If used: Location B sentence, and which videos use it.>

Lighting lock: <for each location, every light source, where it sits in the frame, its colour temperature, and the palette. Then how the light moves across the film: which video the light changes in, what changes it, and what it becomes.> Every clip keeps a soft warm light on the fur. The light at each handoff is the same on both sides of the cut.

VFX lock: <each effect and the video it belongs to. Weather that runs through a whole location is in that location's `Environment:` sentence and is not listed here.> No effect comes from a Yeti, and none appears in a video that this paragraph does not give it to.

## Video 1 - <Title>

Film position: 00:00 - 00:10.

Stage: Exposition.

Character locks:

```
<The full Copy-Ready Google Flow Character Lock of each Yeti in this video, from `.agents/rules/character-consistency.md`, word for word, one per paragraph, in the order Papa Yeti, Mama Yeti, Babu Yeti.>
```

| Timestamp | Shot Type | Visual Description / Prompt | VFX | Audio / Sound FX |
| --- | --- | --- | --- | --- |
| **00:00 - 00:03** | <Framing>, <Angle> | Vertical 9:16 aspect ratio, full-frame vertical composition. <Style lock> Environment: <sentence>. Lighting: <key, fill, rim, quality and direction, contrast, colour temperature and palette, mood>. Characters: <each Yeti in the shot by name, placed left to right, or: No Yeti is in this shot.> Expressions: <Name>, <face from the section 4 table>; <Name>, <face>. <Humans: / Animals: sentences if any> Avoid: photorealistic humans, scary monsters, horror elements, flat lighting, urban environments, extra Yetis, and, on any Yeti, human skin, visible pores, sharp teeth, sharp claws, white or grey fur, clothing, hats, or accessories. Action: <Beat 1, one sentence covering the first half of the shot and ending on a picture.> <Beat 2, one sentence ending on the shot's closing picture, with the feeling in the Expressions: sentence.> Camera: <one move, direction, speed, what it reveals or ends on>. | Effects: <what renders, how it meets the light and action, or None>. Transition: Hard Cut. | <Music state, ambient sound, sounds for each action and effect.> No dialogue. |
| **00:03 - 00:07** | ... | ... Action: <two beats; the first ends on 00:05, the centre of the clip> ... | Effects: ... Transition: Hard Cut. | ... |
| **00:07 - 00:10** | ... | ... Action: <two beats; the second is the video's closing picture> Camera: <move>, easing to a stop in the last half second. | Effects: ... Transition: Holds on the final frame. | ... |

## Video 2 - <Title>

Film position: 00:10 - 00:20.

Stage: Inciting Incident.

Character locks: <the block, as in Video 1, for the Yetis in this video>

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10. Shot 1's first beat picks up Video 1's closing picture, under Video 1's Shot 3 light ... |

## Video 3 - <Title>

Film position: 00:20 - 00:30.

Stage: Rising Action into Climax (peaks in the last beat of Shot 3, film 00:30).

Character locks: <the block, as in Video 1, for the Yetis in this video>

| ... three shots. Shot 3's last beat is the Climax peak: the moment of highest tension, with the peak feeling on every face ... |

## Video 4 - <Title>

Film position: 00:30 - 00:40.

Stage: Falling Action.

Character locks: <the block, as in Video 1, for the Yetis in this video>

| ... three shots. Shot 1's first beat opens on the Climax peak picture under the same light and moves out of it ... |

## Video 5 - <Title>

Film position: 00:40 - 00:50.

Stage: Falling Action into Resolution.

Character locks: <the block, as in Video 1, for the Yetis in this video>

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10 ... |

## Video 6 - <Title>

Film position: 00:50 - 01:00.

Stage: Resolution.

<If a scene break: Scene break: this video opens in <new location> rather than on Video 5's closing picture.>

Character locks: <the block, as in Video 1, for the Yetis in this video>

| ... three shots. Shot 1's first beat picks up Video 5's closing picture, or opens in the new location after a scene break. Shot 3's last beat is the held, resolved closing image of the film, with the music finishing ... |
````
