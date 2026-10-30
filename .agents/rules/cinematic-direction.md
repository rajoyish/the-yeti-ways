---
trigger: model_decision
description: Cinematic direction for every Yeti storyboard, video prompt, and panel image prompt. Sets the terms and project limits for shot type and angle, lighting, camera movement, VFX, transitions, and sound, the panel map that ties each 10-second video to its 3x2 grid and six panel images, and the pipeline the skills make up. Apply when writing or revising files in prompts/, image-prompts/, or carousels/.
paths:
  - "prompts/**"
  - "image-prompts/**"
  - "carousels/**"
---

# Cinematic direction

Every shot in this project is directed as well as described. Each one names its framing and angle, its light, its camera move, its visual effects, and how it hands off to the next shot, using the terms below in the same order every time. This file sets the vocabulary and the project limits. The skills that use it (`storyboard-30s-extender`, `storyboard-60s-from-story`, `create-3x2-timed-image`, `reel-carousel`, `social-media-prompt-creator`) say where each piece goes in their files. Section 6 sets the panel map that turns each 10-second video into a 3x2 grid of six panels, and section 7 sets out the pipeline the skills make up. `character-consistency.md` (how each Yeti looks) and `prompt-assembly.md` (how a prompt is put together around the character locks) still bind, and `character-consistency.md` wins wherever a direction would change a character's look.

A storyboard here is a prompt, so every move and effect in it is something we want on screen. Nothing is labelled "(Recommended)". The one exception is the `video-to-storyboard` skill, which analyzes an existing video and has to keep what it sees apart from what it suggests. When its output is the input to a storyboard skill, its recommended moves and effects are options: adopt the ones that pass the limits below and drop the rest.

## 1. Shot type: framing and angle

The Shot Type cell names the framing and then the angle, separated by a comma: `Medium Close-Up, Low Angle`.

The framing ladder, widest to tightest: Extreme Wide Shot, Wide Shot, Full Shot, Medium Wide Shot, Medium Shot, Medium Close-Up, Close-Up, Extreme Close-Up. Composition terms sit on a rung: Medium Two-Shot, Medium Three-Shot, Over-the-Shoulder, POV, Insert (a close shot of a prop or a hand).

Angles: Eye Level, Low Angle, High Angle, Dutch Angle, Bird's-Eye View. Write the angle in every Shot Type cell, including Eye Level, so each cell reads the same way.

When the camera move changes the framing (a dolly, a zoom, a crane that comes closer), the cell names both ends: `Medium Shot to Close-Up, Eye Level`. One move covers at most two rungs of the ladder. A bigger jump in three or four seconds reads as a crash zoom.

Project limits:

- Bird's-Eye View and steep High Angles look down on the top of a Yeti's head, which is where the model adds horns. Use them only when no Yeti is in the shot, or when the Yetis are small in an Extreme Wide Shot. A gentle High Angle is fine.
- Low Angle makes a character look brave and large. Give it to whoever holds the decisive beat of the shot, Yeti or story cast.
- Dutch Angle only on a beat of danger or disorientation, never in the Resolution.
- Vary the framing within each video, and never use the same framing three shots running.

## 2. Lighting

Every shot has one `Lighting:` sentence, directly after the `Environment:` sentence. It names, in this order: the key light (its source, direction, and whether it is hard or soft), the fill, the rim or back light, the contrast (high-key or low-key), the colour temperature and palette, and the mood. One sentence, 20 to 40 words.

```
Lighting: Soft warm key from the hearth at frame right, cool blue fill from the cave mouth at frame left, thin golden rim light on the fur, low-key contrast, amber and slate-blue palette, quiet and safe.
```

Rules:

- Motivated light only. Every key and rim comes from something the `Environment:` sentence puts in the world: the sun, the sky, the moon, a hearth, a lantern, glowing moss, light bouncing off snow or ice. Name the source. If a shot needs a source the environment lacks, add it to the `Environment:` sentence for the whole location, never to one shot.
- Keep the style lock true. The style lock (section 1 of `prompt-assembly.md`) asks for "soft warm illumination highlighting individual strands of fur" in every shot. A cold, dark, or stormy shot keeps a soft warm fill or rim on the fur, so the `Lighting:` sentence never contradicts the lock.
- Keep the fur readable. Each Yeti's colour must read true in every shot, so every `Lighting:` sentence keeps a soft rim or fill on the fur, whatever the story's palette. The family reference image (section 7 of `prompt-assembly.md`) is lit with warm golden light against cooler surroundings; that warm-on-cool contrast is a good default, not a requirement. A story may be lit for its own world: neon-blue night streets, green underwater light, grey monsoon rain, a red-gold festival. Low-key is tense, never horror-dark: the darkest shot of a film still has faces the viewer can read. Flat, shadowless light flattens the fur into a plain block of colour, and the `Avoid:` line in every prompt names flat lighting for that reason.
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
- Slow or steady by default. Handheld stays subtle: faces and fur stay sharp, because every clip is checked against its grid panels and panel images.
- Prefer a dolly to a zoom for an emotional push-in. A zoom flattens the fur and reads as cheap.
- Whip Pan at most once per film, and never at the start or end of a shot, because a shot's two panels in the 3x2 grid show its opening framing and the picture it closes on, and a blurred picture shows neither.
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

Rules:

- Every effect has a cause in the `Environment:` sentence or the `Action:` text. Magic is welcome when it comes from the world or a prop (a glowing leaf, a brightening lantern, light breaking through cloud), as section 10 of `prompt-assembly.md` sets out. No effect comes out of a Yeti's body apart from breath misting in cold air, and no character sends out energy, a beam, burst, blast, pulse, aura, shockwave, or force field.
- Never: explosions, fire that harms anyone, blood or injury, weapon effects, glitch effects, on-screen text, titles, or motion graphics, split screens, screen or hologram inserts, freeze frames, morphs (a morph changes a body, which the character rules forbid), strobing or flashing.
- Weather that runs through a whole location (steady snowfall, a drifting mist) belongs in the `Environment:` sentence, so every shot and image at that location carries it. The VFX cell holds the effects that belong to one shot.
- Every visible effect that makes a sound gets that sound in the audio cell: the hiss of blowing spindrift, the crackle of embers, the patter of spray.
- The storyboard skill plans which effects belong to which video, so an effect does not leak into a clip that should not have it.

Transitions:

- Between shots inside one 10-second clip, only `Hard Cut` or `Match Cut` (a cut where the next shot repeats a shape or a movement from this one). Anything that takes time (Dissolve, Fade, Wipe, Whip-Pan Transition, Morph) is out, because each shot has its own two panels in the 3x2 grid, the panels on either side of a cut are clean pictures of two different shots, and a blend between them matches neither.
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

Every video has three shots on a fixed split (`00:00 - 00:03`, `00:03 - 00:07`, `00:07 - 00:10`), and every shot's `Action:` is two beats, one sentence each. That gives six beats per video, and each beat is one panel image, generated first. The video's 3x2 grid is then composed from the six panel images, never generated: one 1920x1080 horizontal image, three panels across and two down, read left to right and top to bottom, and each shot takes two panels in a row:

| Panel | Place in the grid | Shot | Beat | Timecode | Framing and angle |
| --- | --- | --- | --- | --- | --- |
| 1 | Top left | Shot 1 | 1st | 00:00.0–00:01.5 | Shot 1's opening framing |
| 2 | Top centre | Shot 1 | 2nd | 00:01.5–00:03.0 | The framing Shot 1 ends on |
| 3 | Top right | Shot 2 | 1st | 00:03.0–00:05.0 | Shot 2's opening framing |
| 4 | Bottom left | Shot 2 | 2nd | 00:05.0–00:07.0 | The framing Shot 2 ends on |
| 5 | Bottom centre | Shot 3 | 1st | 00:07.0–00:08.5 | Shot 3's opening framing |
| 6 | Bottom right | Shot 3 | 2nd | 00:08.5–00:10.0 | The framing Shot 3 ends on |

- Beats. Each beat sentence ends on a picture a viewer could photograph: positions, poses, hands, props, eye lines, and any face that has changed. The first beat of a shot starts from the shot's opening picture and covers its first half, and the second ends on the picture the shot closes on, with the feeling its `Expressions:` sentence holds. When a Yeti's feeling changes during a shot, the beat where it changes names the new feeling, so the panels can follow it. Panel 3 ends on 00:05, the centre of the clip.
- Framing at each panel. A shot that keeps its framing holds it in both panels. A shot whose move changes the framing shows the first framing in its Shot Type cell in its first panel and the second framing in its second panel. The angle is the one the cell names. If the `Camera:` sentence ends on a different angle (a Crane Up that ends looking down), the second panel takes that angle.
- Picture size. Each panel image is a full single image in the film's aspect ratio, a horizontal 16:9 frame for a widescreen film or a vertical 9:16 frame for a vertical one. The grid is always a 1920x1080 horizontal canvas, whatever the film's shape, and each of its cells holds a panel image scaled to fit, uncropped.
- Light inside a video. The `Lighting:` sentence holds the light at the end of its shot. The light never changes during a Shot 1, because Shot 1 carries on the previous video's light. A change in a Shot 2 or a Shot 3 happens in the shot's first beat and is complete by the end of it, so the shot's second panel, and its panel image, sits under its `Lighting:` sentence as written. The shot's first panel shows the change under way, and its panel image's `Action:` says so.
- Light at the handoff. A video's Shot 1 uses the same `Lighting:` sentence, word for word, as the previous video's Shot 3, so the cut between the two clips reads as one scene. The only exception is a video marked `Scene break:`.
- Picture at the handoff. The first beat of a video's Shot 1 holds the picture the previous video's last beat ended on: the same positions, hands, props, eye lines, and faces, seen through the new shot's opening framing, with at most a small change (a face that starts to turn, a breath, a glance). Panel image 1 of each video after the first shows the same picture as panel image 6 of the video before it. A video marked `Scene break:` opens on its new location instead.
- Camera at the ends. Shot 3's move eases to a stop in the last half second, and Shot 1 of the next video eases in from rest, so the cut between the two clips does not jump.
- Effects in a panel image are frozen: flakes hang in the air, embers are points of light, spray is drops in mid-air. Slow motion, camera moves, and transitions do not exist in a still image.

## 7. The 10-second pipeline

A film is made one 10-second video at a time, and every file in the pipeline is organised around those videos. Each video has the same `## Video N - <Title>` heading in every file, and that heading is how one step hands a video to the next.

| Step | Skill | Reads | Writes |
| --- | --- | --- | --- |
| 0. Source, optional | `video-to-storyboard` | An existing video | `prompts/<slug>-source-storyboard.md` |
| 1. Storyboard | `storyboard-30s-extender` for 30 seconds, `storyboard-60s-from-story` for 60 | A short storyboard, a story, or a source storyboard | `prompts/<slug>-<30s or 60s>-storyboard.md`: its three Agent instruction cards, its Agent setup prompt, its lock paragraphs, and per video one table (three shots, two beats per shot) and an `Agent prompt:` block. The table is the master; the `Agent prompt:` block, written from it, is what Flow receives. Every saved Character is called with `@` once per Agent prompt and never described. Everything outside the tables and locks is addressed to the Agent. The file holds no image prompt |
| 2. Images | `create-3x2-timed-image` | The storyboard | `prompts/<slug>-<30s or 60s>-3x2.md`, every image prompt for the film: per video, six panel image prompts, one per panel. The panel images are generated first, then each video's grid is composed from them by `compose_grid.ps1`. The images go in `3x2-timed-storyboard-images/<slug>/`, as `Panel_<P>_V<N>.jpg` for each panel image and `Grid_V<N>.jpg` for each grid, where `V` is the video number |
| 3. Clips | The operator, in Google Flow, as `google-flow.md` sets out | The storyboard's Agent instruction cards, Agent setup prompt, and `Agent prompt:` blocks, the saved Flow Characters, location plates, and saved end frames | One 10-second Omni Flash clip per video, in a new Flow project for the film, then the scene in Scenebuilder |
| 4. Promotion | `reel-carousel` | The storyboard, its 3x2 file, and the reel link | `carousels/<slug>-carousel.md` |

Step 3 follows `google-flow.md`: a new Flow project per film (Omni Flash at 9:16 and 10 seconds, the saved Yeti Characters checked, a Character for any named story cast, one plate per location, and the storyboard's three Agent instruction cards), then one clip per video from its `Agent prompt:` block, which names the images it uses. Grids and triptychs are planning and review sheets; they are never attached to a clip, because Flow reads a multi-panel image as one picture and blends its panels, layout, and labels into the scene.

The storyboard is the single source. The panel images are drawn from its beats, lights, framings, and effects, never from a picture that exists only in the head of whoever writes them, and the grids are composed from the panel images. When a beat changes, change it in the storyboard first, then rewrite and regenerate that video's panel images and compose its grid again. The storyboard holds the video prompts and the 3x2 file holds the image prompts, and neither holds the other's. Run each step as its own skill run, in order. One step's saved file is the next step's input, and a single run that writes the storyboard and the image prompts together runs past a model's output limit.

The 3x3 grid that came before this one drew nine panels per video, three beats per shot, into `prompts/<slug>-<30s or 60s>-3x3.md`. Nine panel images do not fit in Flow's seven ingredient slots, so it is retired. A storyboard whose `Action:` cells still have three beats is revised to two with its storyboard skill, and its 3x3 file is renamed to `-3x2.md` and rewritten, before any new image is made.

The stills route that `storyboard-30s-frames` wrote into `image-prompts/<slug>-<30s or 60s>-frames.md` is retired too. Panel images 2, 4, and 6 show the same pictures, and the frames files already in `image-prompts/` stay for the record.
