---
trigger: model_decision
description: Cinematic direction for every Yeti storyboard, video prompt, and panel image prompt. Sets the terms and project limits for shot type and angle, lighting, camera movement, VFX, transitions, and sound, the panel map that ties each 10-second video to its 3x2 grid and six panel images, and the pipeline the skills make up. Apply when writing or revising files in prompts/, image-prompts/, or carousels/.
paths:
  - "prompts/**"
  - "image-prompts/**"
  - "carousels/**"
---

# Cinematic direction

Every shot in this project is directed as well as described. Each one names its framing and angle, its light, its camera move, its visual effects, and how it hands off to the next shot, using the terms below in the same order every time. This file sets the vocabulary and the project limits. The skills that use it (`storyboard-30s`, `storyboard-60s`, `create-3x2-timed-image`, `reel-carousel`, `social-media-prompt-creator`) say where each piece goes in their files. Section 6 sets the panel map that turns each 10-second video into a 3x2 grid of six panels, and section 7 sets out the pipeline the skills make up. `character-consistency.md` (how each Yeti looks) and `prompt-assembly.md` (how a prompt is put together around the character locks) still bind, and `character-consistency.md` wins wherever a direction would change a character's look.

A storyboard here is a prompt, so every move and effect in it is something we want on screen. Nothing is labelled "(Recommended)". The one exception is the `video-to-storyboard` skill, which analyzes an existing video and has to keep what it sees apart from what it suggests. When its output is the input to a storyboard skill, its recommended moves and effects are options: adopt the ones that pass the limits below and drop the rest.

## 1. Shot type: framing and angle

The Shot Type cell names the framing and then the angle, separated by a comma: `Medium Close-Up, Low Angle`.

The framing ladder, widest to tightest: Extreme Wide Shot, Wide Shot, Full Shot, Medium Wide Shot, Medium Shot, Medium Close-Up, Close-Up, Extreme Close-Up. Composition terms sit on a rung: Medium Two-Shot, Medium Three-Shot, Over-the-Shoulder, POV, Insert (a close shot of a prop or a hand).

Each rung is a promise about where the frame cuts the subject. Video models read the bare names loosely, so every Agent prompt shot line writes the cut in brackets after the framing (`Medium Shot (waist up)`):

| Framing | Where the frame cuts | Use it for |
| --- | --- | --- |
| Extreme Wide Shot | The subject is tiny inside a vast setting | Establishing a place, scale, isolation |
| Wide Shot | The whole body, small, with plenty of setting around it | Placing a subject in its location |
| Full Shot | Head to feet, filling the frame's height | Full-body action and blocking |
| Medium Wide Shot | Head to knees | Walking, gesture with the body |
| Medium Shot | Waist up | Body language and face together |
| Medium Close-Up | Chest up | A face with a hand or a prop |
| Close-Up | Shoulders to the top of the head, or one object filling the frame | Feeling on a face, a key prop |
| Extreme Close-Up | Eyes, hands, or one detail, with its edges cut off by the frame | A detail that matters |

Composition. A single subject sits on the left or right third of the frame, not dead centre, with its look or its movement pointing into the open two-thirds (lead room): a character walking toward frame left sits on the right third. Two subjects share the frame on opposite thirds. Dead centre is kept for deliberate symmetry: a face in Close-Up looking straight at what it feels, an Insert, the family together at the end. The placement follows the screen direction of section 8 (rule 7), so a character keeps its side of the frame across the cuts of a sequence. The `Action:` text places each character by third (`on the right third`, `in the centre`), and the `Characters:` sentence keeps the left, centre, and right of section 3 of `prompt-assembly.md`.

Angles: Eye Level, Low Angle, High Angle, Dutch Angle, Bird's-Eye View. Write the angle in every Shot Type cell, including Eye Level, so each cell reads the same way.

When the camera move changes the framing (a dolly, a zoom, a crane that comes closer), the cell names both ends: `Medium Shot to Close-Up, Eye Level`. One move covers at most two rungs of the ladder. A bigger jump in three or four seconds reads as a crash zoom.

Project limits:

- Bird's-Eye View and steep High Angles look down on the top of a Yeti's head, which is where the model adds horns. Use them only when no Yeti is in the shot, or when the Yetis are small in an Extreme Wide Shot. A gentle High Angle is fine.
- Low Angle makes a character look brave and large. Give it to whoever holds the decisive beat of the shot, Yeti or story cast.
- Dutch Angle only on a beat of danger or disorientation, never in the Resolution.
- A Yeti who acts is framed at Full Shot or closer. A video model holds a saved Character only while it is big enough in the frame to show its face, tuft, and colour; a small Yeti in a Wide or Extreme Wide Shot comes back as a generic blue, pink, or green ape (on 2026-11-01 a Wide Shot of Papa Yeti bracing a pine trunk against a landslide returned a gorilla-shaped figure pushing a standing tree). So a Yeti does a shot's main action only at Full Shot, Medium Wide Shot, or closer. In a Wide or Extreme Wide Shot a Yeti is at most a still figure in an establishing shot; a result that needs the whole slope or valley is shown wide without the Yeti, then the film cuts in to him.
- Vary the framing within each video, never use the same framing three shots running, and never cut between two shots of the same subject at the same framing and angle (a jump cut); change the subject, or move at least two rungs or to a new angle (section 8).

## 2. Lighting

Every shot has one `Lighting:` sentence, directly after the `Environment:` sentence. It names, in this order: the key light (its source, direction, and whether it is hard or soft), the fill, the rim or back light, the contrast (high-key or low-key), the colour temperature and palette, and the mood. One sentence, 20 to 40 words.

```
Lighting: Soft warm key from the hearth at frame right, cool blue fill from the cave mouth at frame left, thin golden rim light on the fur, low-key contrast, amber and slate-blue palette, quiet and safe.
```

Rules:

- Motivated light only. Every key and rim comes from something the `Environment:` sentence puts in the world: the sun, the sky, the moon, a hearth, a lantern, glowing moss, light bouncing off snow or ice. Name the source. If a shot needs a source the environment lacks, add it to the `Environment:` sentence for the whole location, never to one shot.
- Keep the style lock true. The style lock (section 1 of `prompt-assembly.md`) asks for "soft warm illumination highlighting individual strands of fur" in every shot. A cold, dark, or stormy shot keeps a soft warm fill or rim on the fur, so the `Lighting:` sentence never contradicts the lock.
- Keep the fur readable. Each Yeti's colour must read true in every shot, so every `Lighting:` sentence keeps a soft rim or fill on the fur, whatever the story's palette. The family reference image (section 7 of `prompt-assembly.md`) is lit with warm golden light against cooler surroundings; that warm-on-cool contrast is a good default, not a requirement. A story may be lit for its own world: neon-blue night streets, green underwater light, grey monsoon rain, a red-gold festival. Low-key is tense, never horror-dark: the darkest shot of a film still has faces the viewer can read. Flat, shadowless light flattens the fur into a plain block of colour, and the `Avoid:` line in every prompt names flat lighting for that reason.
- Keep haze off the Yeti. Dust, smoke, mist, spray, rain, and a flat grey sky wash a Yeti's fur pale and grey, and a washed-out Yeti is where the model stops following its Character (on 2026-11-01 Papa Yeti came back pale periwinkle in every dust-hazed shot). In a Yeti shot, the haze stays in the distance or low on the ground on the far side of the action, the `Light:` part says `clear air around him` (or her, or them), and the key on the Yeti is clear, with the warm rim. A shot that must be thick with dust or smoke is a shot without a Yeti in it.
- Directions are frame directions: frame left, frame right, behind the subject, overhead, low from the front. The images and the clips then read them the same way.
- The light follows the story. A good default arc: the Exposition is soft and high-key, the Inciting Incident changes the light (a cloud crosses the sun, a shadow falls, the fire gutters), the Rising Action and the Climax go lower-key with harder light, the Falling Action lets the warmth come back, and the Resolution is soft and settled. Change it when the story asks: a comedy can stay bright throughout, a night story can live in moonlight and lanterns, a story that ends at dawn ends in cool morning light.
- The sentence describes the light at the end of the shot. When the light changes during a shot, the first beat of the `Action:` text describes the change. Section 6 limits where in a video that can happen.
- Each location's light sources, colour temperatures, and palette are planned once for the film by the storyboard skill, every `Lighting:` sentence at that location draws on them, and the storyboard's Instruction 2 card summarises them.
- Never: light from below a Yeti's face (it reads as horror), strobing or rapid flashing (a photosensitivity risk that platforms restrict), a face too dark to read, or a named film, studio, cinematographer, or colour grade ("like a famous film", "in the style of a studio"). The copyright filter reads a named look the same way it reads a named character.

## 3. Camera movement

Every shot has one `Camera:` sentence, at the end of the visual cell, after the `Action:` text. It names one move from this list, then its direction, its speed, and what it reveals or ends on.

| Move | What it does | Use it for |
| --- | --- | --- |
| Static | The camera holds still | A reaction, a held emotional beat, the final image |
| Pan | Turns left or right from one spot | Following a look, showing how wide a place is |
| Tilt | Turns up or down from one spot | Revealing height, or a problem above or below |
| Dolly In/Out | Travels toward or away from the subject | A push-in as a feeling lands, a pull-back that leaves a character small |
| Tracking/Trucking | Travels alongside a moving subject | Walking, running, sliding |
| Zoom In/Out | The lens tightens or widens while the camera stays put | Rarely. A deliberate comic snap |
| Crane/Jib Up/Down | Rises or lowers through the air | Establishing a place, or leaving it at the end |
| Pedestal | Rises or lowers straight up or down, without tilting | Matching a character who stands up or kneels |
| Handheld | Small, organic shake | Tension, effort, urgency |
| Steadicam/Gimbal | Smooth follow at walking pace | Following a character through a space |
| Arc | Circles around the subject | The Climax, the decisive act |
| Whip Pan | Very fast pan that blurs | A sudden look toward a sound |

```
Camera: Slow dolly in from a Medium Shot to a Close-Up on the baby Yeti's face, easing to a stop in the last half second.
```

Rules:

- One move per shot. Two moves in three seconds make a jittery camera.
- Name the move exactly: a Pan swivels a camera that stays in one spot; a Tracking shot travels through space beside, ahead of, or behind its subject. Write the one that is meant, because the model moves the camera the way the word says.
- No Dolly Zoom (a zoom against an opposing dolly). It warps the frame around its subject, and a video model stretches the character with the background, which reads as a morph.
- Slow or steady by default. Handheld stays subtle: faces and fur stay sharp, because every clip is checked against its grid panels and panel images.
- Prefer a dolly to a zoom for an emotional push-in. A zoom flattens the fur and reads as cheap.
- Whip Pan at most once per film, and never at the start or end of a shot, because a shot's panels in the 3x2 grid show its opening framing and the picture it closes on, and a blurred picture shows neither.
- A Crane Up or Pedestal Up that ends above the Yetis ends on a High Angle, so the angle limits in section 1 apply to the picture it ends on.

## 4. VFX

The VFX cell has two labels, in this order, each a short sentence.

- `Effects:` what the model renders in this shot. Say what each effect does and how it meets the light and the action. Write `Effects: None.` when the shot has none.
- `Transition:` how the shot hands off to the next one.

```
Effects: Fine snow drifts down through the hearth light and catches warm glints as it passes the baby Yeti's face, with shallow depth of field softening the cave wall behind. Transition: Hard Cut.
```

Effects this project uses:

- Weather and atmosphere: falling snow, spindrift blowing off a ridge, mist, low fog, breath vapour in cold air, rain, falling leaves or petals, drifting pollen.
- Light in the air: light shafts through mist or a cave mouth, dust motes in a sunbeam, a soft lens flare from a light source that is in the scene, a gentle glow around a hearth or lantern, glints on ice and water, rippling light reflected from water.
- Particles with a physical cause: embers rising from a hearth, water spray, powder kicked up by feet or a sled, ice dust, fireflies, glowing spores drifting off moss.
- Lens and time: shallow depth of field with soft bokeh, a rack focus from one subject to another, motion blur on fast-moving things only (never on a face), slow motion on one beat.

Focus follows the framing, so every shot states it. Close-Ups, Medium Close-Ups, and single-subject Medium Shots use shallow depth of field: the subject sharp, the background soft, which also keeps a Yeti's fur crisp against a busy setting. Extreme Wide, Wide, and Full Shots, and any depth shot with a named foreground and background (section 8, rule 1), use deep focus, everything sharp. A rack focus is the one way to move focus inside a shot, and it counts as the shot's effect. The `Effects:` sentence names the focus (`shallow depth of field softening the pines behind him`), and the Agent prompt's `Light:` part ends with `shallow focus` or `deep focus`.

Rules:

- Every effect has a cause in the `Environment:` sentence or the `Action:` text. Magic is welcome when it comes from the world or a prop (a glowing leaf, a brightening lantern, light breaking through cloud), as section 10 of `prompt-assembly.md` sets out. No effect comes out of a Yeti's body apart from breath misting in cold air, and no character sends out energy, a beam, burst, blast, pulse, aura, shockwave, or force field.
- Never: explosions, fire that harms anyone, blood or injury, weapon effects, glitch effects, on-screen text, titles, or motion graphics, split screens, screen or hologram inserts, freeze frames, morphs (a morph changes a body, which the character rules forbid), strobing or flashing.
- Weather that runs through a whole location (steady snowfall, a drifting mist) belongs in the `Environment:` sentence, so every shot and image at that location carries it. The VFX cell holds the effects that belong to one shot.
- Every visible effect that makes a sound gets that sound in the audio cell: the hiss of blowing spindrift, the crackle of embers, the patter of spray.
- The storyboard skill plans which effects belong to which video, so an effect does not leak into a clip that should not have it.

Transitions:

- Between shots inside one 10-second clip, only `Hard Cut` or `Match Cut` (a cut where the next shot repeats a shape or a movement from this one). Anything that takes time (Dissolve, Fade, Wipe, Whip-Pan Transition, Morph) is out, because every beat has its own panel in the 3x2 grid, the panels on either side of a cut are clean pictures of two different shots, and a blend between them matches neither.
- The last shot of every video says `Transition: Holds on the final frame.` The video model renders one clip; the cut to the next clip happens in the edit.
- Edit-level transitions live in the storyboard's agent instructions, never in a table: a hard cut at every handoff, a Dissolve or a fade through black only at a scene break, and a fade to black at the very end if the editor wants one. Every clip stays exactly 10 seconds in the edit, so no speed ramps or retiming there.

## 5. Sound

Every story gets its own sound. The music and the sound effects are designed for that story's world, genre, and emotional arc, the same way its environment and light are, so no two films need to sound alike.

Each film's sound is planned once by the storyboard skill and summarised in the storyboard's Instruction 2 card:

- The score palette: the genre and the instruments that fit the story's world and mood (taiko drums and bamboo flute for a mountain training run, plucked strings and hand percussion for a market chase, warm strings and soft piano for a tender reunion, music box and celesta for a bedtime story, a brass-and-percussion march for a comic parade). Pick two to five instruments; more than that turns to mush in a 10-second clip.
- How the music moves across the videos: which instruments lead in which video, where it builds, where it stops for a beat, and how it resolves. The palette can change with the story (drums drop out as the tension breaks, strings come in for the tender ending), as long as every change happens on a story beat and the music at each handoff is the same on both sides of the cut.
- The sound world of each location: the ambient bed (wind across snow, a busy market, rain on a tin roof, a river) and the materials that make the action sounds (wood, stone, water, cloth, snow).

Each audio cell, in this order:

1. The music state and what is playing: starts, continues, builds, pauses, swells, softens, or resolves, with the instruments from the film's music plan that carry it in this shot, its tempo, and its feeling. The music is background score that the characters cannot hear, unless the story puts a musician on screen.
2. The ambient bed of the location.
3. A sound for each physical action and each visible effect, described from scratch in plain words (the hollow knock of bamboo on stone, the hiss of spray), never by a stock effect name.
4. `No dialogue.`

Characters may gasp, giggle, sigh, cheer, grunt, or hum, but never form words. Music follows the originality rules in section 10 of `prompt-assembly.md`: genre, mood, tempo, and instruments, never a named song, composer, artist, soundtrack, or lyric.

## 6. The 10-second video and its 3x2 grid

Each 10-second video is one Flow generation with Gemini Omni Flash 1.1, the only Flow model that makes 10-second clips. Its prompt is the video's compact `Agent prompt:` block, written from the storyboard table, and its ingredients are the saved Flow Characters it calls with `@`, a location plate or the saved end frame of the previous clip and at most one single panel image as a composition guide, as `google-flow.md` sets out. The six panel images exist so every beat has a checked, on-model picture: they guide the clip, show the operator what each moment must look like, and are what the clip is checked against. Continuity between clips lives in the storyboard text and in the saved end frame that opens the next clip, so the direction has to agree with both.

In the current storyboards there are no tables: each shot below is one shot line of the Agent prompt, and where this section says row, cell, Shot Type cell, `Action:`, or `Lighting:` sentence, read the shot line's timestamp, framing and angle, beats, and `Light:` part. The panel images and the 3x2 grid apply only to the table-based storyboards kept in the backup. Every video has six beats on a fixed clock, and each beat is one panel image, generated first. The shots are cut from those beats: a video has three to six shots, joined by hard cuts, and each shot covers one beat or two beats in a row. That lets a video cut as a film does (the herb-gatherer alone on the trail, the wolves alone in the pines, a close-up of his face as he runs, the two Yetis watching from the ledge) while every beat keeps its own checked picture. The video's 3x2 grid is then composed from the six panel images, never generated: one 1920x1080 horizontal image, three panels across and two down, read left to right and top to bottom:

| Panel | Place in the grid | Beat | Timecode | Framing and angle |
| --- | --- | --- | --- | --- |
| 1 | Top left | 1 | 00:00.0–00:01.5 | The framing of the shot this beat belongs to, at this beat |
| 2 | Top centre | 2 | 00:01.5–00:03.0 | The same |
| 3 | Top right | 3 | 00:03.0–00:05.0 | The same |
| 4 | Bottom left | 4 | 00:05.0–00:07.0 | The same |
| 5 | Bottom centre | 5 | 00:07.0–00:08.5 | The same |
| 6 | Bottom right | 6 | 00:08.5–00:10.0 | The same |

- Shots. A shot's timestamp runs from the start of its first beat to the end of its last, using only the beat boundaries `00:00`, `00:01.5`, `00:03`, `00:05`, `00:07`, `00:08.5`, and `00:10`, so every table row reads like `00:00 - 00:03` (beats 1 and 2), `00:03 - 00:05` (beat 3 alone), or `00:08.5 - 00:10` (beat 6 alone). The rows run in order from `00:00` to `00:10` with no gap. Section 8 decides how many shots a video has and what each one frames.
- Beats. A shot's `Action:` has one sentence per beat: one for a one-beat shot, two for a two-beat shot. Each beat sentence ends on a picture a viewer could photograph: positions, poses, hands, props, eye lines, and any face that has changed. When a Yeti's feeling changes during a two-beat shot, the beat where it changes names the new feeling, so the panels can follow it. Beat 3 ends on 00:05, the centre of the clip.
- Framing at each panel. A one-beat shot holds one framing, so its Shot Type cell names one framing (`Close-Up, Eye Level`) and its panel shows it. A two-beat shot whose move changes the framing (`Wide Shot to Medium Shot, High Angle`) shows the first framing in its first panel and the second in its second; one that keeps its framing holds it in both. The angle is the one the cell names. If the `Camera:` sentence ends on a different angle (a Crane Up that ends looking down), the shot's last panel takes that angle.
- Picture size. Each panel image is a full single image in the film's aspect ratio, a horizontal 16:9 frame for a widescreen film or a vertical 9:16 frame for a vertical one. The grid is always a 1920x1080 horizontal canvas, whatever the film's shape, and each of its cells holds a panel image scaled to fit, uncropped.
- Light inside a video. The `Lighting:` sentence holds the light at the end of its shot. The light never changes during a video's first shot, because it carries on the previous video's light. Later, the light may change at a cut (the next shot simply has its own `Lighting:` sentence, at a location whose sources allow it) or inside the first beat of a two-beat shot, complete by the end of that beat, so the shot's last panel sits under its `Lighting:` sentence as written. A one-beat shot never changes the light inside itself.
- Light at the handoff. A video's first shot uses the same `Lighting:` sentence, word for word, as the previous video's last shot, so the cut between the two clips reads as one scene. The only exception is a video marked `Scene break:`.
- Picture at the handoff. The first beat of a video holds the picture the previous video's last beat ended on: the same positions, hands, props, eye lines, and faces, seen through the first shot's opening framing, with at most a small change (a face that starts to turn, a breath, a glance). Panel image 1 of each video after the first shows the same picture as panel image 6 of the video before it. A video marked `Scene break:` opens on its new location instead.
- Camera at the ends. The last shot's move eases to a stop in its last half second (or is Static), and the first shot of the next video eases in from rest, so the cut between the two clips does not jump.
- Effects in a panel image are frozen: flakes hang in the air, embers are points of light, spray is drops in mid-air. Slow motion, camera moves, and transitions do not exist in a still image.

## 7. The 10-second pipeline

A film is made one 10-second video at a time, and every file in the pipeline is organised around those videos. Each video has the same `## Video N - <Title>` heading in every file, and that heading is how one step hands a video to the next.

| Step | Skill | Reads | Writes |
| --- | --- | --- | --- |
| 0. Source, optional | `video-to-storyboard` | An existing video | `prompts/<slug>-source-storyboard.md` |
| 1. Storyboard | `storyboard-30s` for 30 seconds, `storyboard-60s` for 60 | A short storyboard, a story, or a source storyboard | `prompts/<slug>-<30s or 60s>-storyboard.md`: its three Agent instruction cards, its Agent setup prompt, its Image map, and per video only an `Images:` line and an `Agent prompt:` block (six beats, cut into three to six shots of one or two beats, framed by section 8, one line per shot). The Agent prompt is the master and what Flow receives; there is no storyboard table. Every character is called with `@` once per Agent prompt, in its `Cast:` line. The file holds no image prompt beyond the plates |
| 2. Images, optional | `create-3x2-timed-image` (and `generate-triptych-prompts` for drawn 1x3 review sheets), for every video or only the ones named | The storyboard's Agent prompts | `prompts/<slug>-<30s or 60s>-3x2.md`, every image prompt for the film: per video, six panel image prompts, one per panel. The panel images are generated first, then each video's grid is composed from them by `compose_grid.ps1`. The images go in `3x2-timed-storyboard-images/<slug>/`, as `Panel_<P>_V<N>.jpg` for each panel image and `Grid_V<N>.jpg` for each grid, where `V` is the video number |
| 3. Clips | The operator, in Google Flow, as `google-flow.md` sets out | The storyboard's Agent instruction cards, Agent setup prompt, and `Agent prompt:` blocks, the saved Flow Characters, location plates, and saved end frames | One 10-second Omni Flash clip per video, in a new Flow project for the film, then the scene in Scenebuilder |
| 4. Promotion | `reel-carousel` | The storyboard, its 3x2 file, and the reel link | `carousels/<slug>-carousel.md` |

Step 3 follows `google-flow.md`: a new Flow project per film (Omni Flash at 9:16 and 10 seconds, the saved Yeti Characters checked, a Character for any named story cast, one plate per location, and the storyboard's three Agent instruction cards), then one clip per video from its `Agent prompt:` block, which names the images it uses. Grids and triptychs are planning and review sheets; they are never attached to a clip, because Flow reads a multi-panel image as one picture and blends its panels, layout, and labels into the scene.

The storyboard is the single source. The panel images are drawn from its beats, lights, framings, and effects, never from a picture that exists only in the head of whoever writes them, and the grids are composed from the panel images. When a beat changes, change it in the storyboard first, then rewrite and regenerate that video's panel images and compose its grid again. The storyboard holds the video prompts and the 3x2 file holds the image prompts, and neither holds the other's. Run each step as its own skill run, in order. One step's saved file is the next step's input, and a single run that writes the storyboard and the image prompts together runs past a model's output limit.

The 3x3 grid that came before this one drew nine panels per video, three beats per shot, into `prompts/<slug>-<30s or 60s>-3x3.md`. Nine panel images do not fit in Flow's seven ingredient slots, so it is retired. A storyboard whose `Action:` cells still have three beats is revised to two with its storyboard skill, and its 3x3 file is renamed to `-3x2.md` and rewritten, before any new image is made.

The stills route that `storyboard-30s-frames` wrote into `image-prompts/<slug>-<30s or 60s>-frames.md` is retired too. Panel images 2, 4, and 6 show the same pictures, and the frames files already in `image-prompts/` stay for the record.

## 8. Coverage and cutting

A film is told in shots, not in one picture with everyone in it. Each shot gives the viewer one thing to look at, and the cut to the next shot is what tells the story: a man on a trail, then eyes in the pines, then his face as he hears them, then two Yetis on a ledge who saw it all. A prompt that puts every character of a scene into one frame gets back a crowded picture where nobody reads, characters at the wrong distance from each other, and, often, a second copy of a character the model could not place. These rules bind every storyboard and every Agent prompt.

1. **One subject per shot.** A shot frames one subject: one character, or one unit that acts together in the same spot (Papa Yeti and Babu Yeti side by side on the ledge, the three Grey Wolves as a pack, a mother holding her child). Everyone else in the video is out of the frame. A shot shows two separate subjects only when the story needs them in one picture: a hand-off or a touch between them, a chase where the gap between pursuer and pursued is the point, a rescue (rule 12), or a depth shot (foreground and background named as such) that shows where one stands in relation to the other. A frame never holds more than three named characters, counting each of a group.
2. **`In frame:` on every shot.** Every visual cell carries one `In frame:` sentence that names, by Character name, every character seen at any moment of the shot and ends `and no one else.` (`In frame: Old Herb-Gatherer, and no one else.`, `In frame: Papa Yeti and Babu Yeti, and no one else.`, `In frame: no characters, only the empty trail.`). The shot's `Characters:` and `Expressions:` sentences and its story cast sentence describe only those characters, and every Agent prompt shot line opens with the same `In frame:` words. A character the shot does not name is never described in it, not even to say it is absent, because a description is an invitation to draw it.
3. **Establish once, then cut in.** Each location gets at most one establishing shot per scene, a Wide or Extreme Wide Shot where the place is the subject and anyone in it is small. After it, the camera cuts in to one subject at a time. The film's last shot may pull back to a wide frame of the family together; nowhere else does one frame gather everyone.
4. **Separate places, separate shots.** Characters in different places (Yetis on a ledge, a man on the trail below, wolves in the pines) are filmed in their own shots and joined by the cut, never squeezed into one frame. Join them with an eyeline match: a Yeti looks down toward frame right, cut to what it sees (a POV or a High Angle of the trail), cut back to its reaction.
5. **Coverage.** Every video uses at least three kinds of shot: establishing; action (the subject doing the thing); reaction (a Yeti's face after an event, usually a Close-Up or Medium Close-Up); insert (a prop or hands in close-up: the pouch dropping into the snow, a hand on the snow lip); POV (what a character sees, framed from where it stands); cutaway (a parallel subject: the wolves closing in while the man walks on); and over-the-shoulder. Every important event gets an action shot and a Yeti's reaction shot.
6. **Cross-cut a chase.** When one character pursues another, or two things happen at once, alternate them shot by shot (pursued, pursuer, pursued, a Yeti watching), each in its own shot, rather than one wide frame of both.
7. **Screen direction.** Keep the 180-degree line: a character moving across the frame keeps the same direction in every shot of a sequence (the herb-gatherer always runs toward frame left, the wolves always come from frame right), and eyelines match across a cut (a Yeti who looks down to frame right is followed by a shot of the trail seen from above, and a character on the trail who looks up looks toward frame left).
8. **Each character exactly once.** One body per character per frame. Every character in a shot is placed once, in one sentence, at one spot. An over-the-shoulder shot shows its foreground character from behind only, and that character appears nowhere else in the frame. Never frame a Yeti from behind in a shot whose previous picture (the opening image, or the last panel) shows that Yeti facing the camera somewhere else, unless the beat moves it there; a model that cannot reconcile the two draws it twice.
9. **Rhythm follows the tension.** Shot length is one or two beats (section 6). Calm stretches (the Exposition, the Resolution) use two-beat shots of three to four seconds and three or four shots per video; rising tension shortens them, and a chase or a Climax cuts on one-beat shots of one and a half to two seconds, five or six per video. Every cut changes the subject, the framing by at least two rungs, or the angle.
10. **The film stays with the Yetis.** The camera may leave the Yetis for one-subject shots of the story cast (a cutaway, a POV of what they see), but never for more than two shots in a row, and every video has at least one shot of a Yeti. The main emotional turn (the choice, the realisation, the relief) plays in a Close-Up or Medium Close-Up of a Yeti's face.
11. **Plan the geography, and keep the event out of the reaction shot.** Before cutting a video with an event in it (a slide, a flood, a fall, a stampede), note where the event starts, which way it goes, and where each character stands, and keep the reacting character out of the event's source and path. A video model has no off-screen: whatever a reaction shot mentions, it draws in the frame, and behind a face turned to the camera the only place left for it is the background. So a reaction shot (a Close-Up, Medium Close-Up, or Medium Shot of a face reacting to an event): (a) turns the face three-quarters toward the frame side of the event and says the event is off-screen (`looks down toward frame left at the slide, off-screen`), never straight down the lens; (b) names a still background behind the face (`behind him only still, upright pines and the grey sky; nothing falls or moves behind him`); (c) has no `Effects:` or `Light:` words for the event (no dust, debris, water, or haze "behind him"); and (d) is set somewhere the event is not. The event gets its own action shot, and the eyeline cut joins the two (rule 4). On 2026-11-01 a Close-Up of Papa Yeti "under the overhang of exposed roots" staring "down the slope", with "brown dust drifting up past the roots behind him", in a video that started the landslide at that same forest edge, came back with the earth bank collapsing behind his head.
12. **A rescue plays in one readable picture.** When a character saves another, one shot proves the save: it frames the threat, the rescuer, and the one saved together, side-on or as a depth shot, at Full Shot or closer, with the one saved on one third, the rescuer between, and the threat coming in from the opposite side of the frame. Cause and effect show in that picture: the threat reaches the rescuer's action and stops, piles up, or turns aside short of the one saved. Give it weight, a moment where it nearly fails (feet slide back, the barrier shudders) before it holds. It is followed by the one saved looking at the rescuer, and the rescuer's face in a Close-Up or Medium Close-Up. A rescue told only in separate one-subject shots (a Yeti pushing something, then a man looking amazed) never reads as a save, because nothing on screen shows the threat would have reached him. This is one of the two-subject shots rule 1 allows.
13. **One readable action per beat, and props by their state.** A beat gives each character one action the viewer can read (grabs, runs, plants, braces), never a chain ("leaps down, lifts the trunk, and slams it crosswise into the slope, bracing it with his shoulder"): given a chain, the model draws the simplest picture that fits, and it is usually the wrong one. A prop the action depends on is named by its state and size wherever it matters (`the long, bare, fallen pine trunk lying on the ground, with no branches`), because a bare noun can be read two ways: "the fallen pine trunk" came back as a standing pine tree he pushed against.

Pick each shot's framing, angle, move, and light from what the beat should make the viewer feel:

| The beat should feel | Framing | Angle | Camera | Light |
| --- | --- | --- | --- | --- |
| Here is the place, all is calm | Extreme Wide or Wide Shot | Eye Level or gentle High Angle | Slow Crane Down, Pan, or Dolly In | Soft, high-key, the location's warm source |
| Someone is watching, unease | Medium Shot or POV | Eye Level, a Dutch Angle at most once | Static or a slow Dolly In | Low-key, a cloud over the key light |
| A threat arrives | Medium or Full Shot of the threat alone | Low Angle | Slow Tracking or Static | Hard side light, eyes catching a glint |
| Fear, alarm, a realisation | Close-Up or Medium Close-Up of a face | Eye Level | Quick Dolly In or Static | Hard key, soft rim kept on fur |
| A chase, urgency | Full or Medium Shot, cutting on one-beat shots | Eye Level or Low Angle | Tracking alongside, subtle Handheld | Swinging practical light (a lantern), low-key |
| Effort, a decision acted on | Medium Shot or Medium Two-Shot | Low Angle | Arc or slow Dolly In | Hardest light of the film, warm rim |
| A detail that matters | Insert (Close-Up of a prop or hands) | Eye Level or High Angle | Static or a short Tilt | Light picks out the prop |
| Relief, tenderness | Medium Close-Up to Close-Up | Eye Level | Slow Dolly In or Static | Warm returns, soft key |
| The end, the family together | Wide Shot | Eye Level or gentle High Angle | Slow Dolly Out or Crane Up, easing to a stop | Soft, warm, settled |
