---
trigger: model_decision
description: Cinematic direction for every Yeti storyboard, video prompt, 3x2 grid prompt, and panel image prompt. Sets the terms and project limits for shot type and angle, lighting, camera movement, VFX, transitions, and sound, the panel map that ties each 10-second video to its 3x2 grid and six panel images, and the pipeline the skills make up. Apply when writing or revising files in prompts/, image-prompts/, or carousels/.
paths:
  - "prompts/**"
  - "image-prompts/**"
  - "carousels/**"
---

# Cinematic direction

Every shot in this project is directed as well as described. Each one names its framing and angle, its light, its camera move, its visual effects, and how it hands off to the next shot, using the terms below in the same order every time. This file sets the vocabulary and the project limits. The skills that use it (`storyboard-30s-extender`, `storyboard-60s-from-story`, `create-3x2-timed-image`, `reel-carousel`, `social-media-prompt-creator`) say where each piece goes in their files. Section 6 sets the panel map that turns each 10-second video into a 3x2 grid of six panels, and section 7 sets out the pipeline the skills make up. `character-consistency.md` still binds, and it wins wherever the two disagree.

A storyboard here is a prompt, so every move and effect in it is something we want on screen. Nothing is labelled "(Recommended)". The one exception is the `video-to-storyboard` skill, which analyzes an existing video and has to keep what it sees apart from what it suggests. When its output is the input to a storyboard skill, its recommended moves and effects are options: adopt the ones that pass the limits below and drop the rest.

## 1. Shot type: framing and angle

The Shot Type cell names the framing and then the angle, separated by a comma: `Medium Close-Up, Low Angle`.

The framing ladder, widest to tightest: Extreme Wide Shot, Wide Shot, Full Shot, Medium Wide Shot, Medium Shot, Medium Close-Up, Close-Up, Extreme Close-Up. Composition terms sit on a rung: Medium Two-Shot, Medium Three-Shot, Over-the-Shoulder, POV, Insert (a close shot of a prop or a paw).

Angles: Eye Level, Low Angle, High Angle, Dutch Angle, Bird's-Eye View. Write the angle in every Shot Type cell, including Eye Level, so each cell reads the same way.

When the camera move changes the framing (a dolly, a zoom, a crane that comes closer), the cell names both ends: `Medium Shot to Close-Up, Eye Level`. One move covers at most two rungs of the ladder. A bigger jump in three or four seconds reads as a crash zoom.

Project limits:

- Bird's-Eye View and steep High Angles look down on the top of a Yeti's head, which is where the model adds horns. Use them only when no Yeti is in the shot, or when the Yetis are small in an Extreme Wide Shot. A gentle High Angle is fine.
- Low Angle makes a character look brave and large. Give it to the Yeti who holds the hero beat.
- Dutch Angle only on a beat of danger or disorientation, never in the Resolution.
- Vary the framing within each video, and never use the same framing three shots running.

## 2. Lighting

Every shot has one `Lighting:` sentence, directly after the `Environment:` sentence. It names, in this order: the key light (its source, direction, and whether it is hard or soft), the fill, the rim or back light, the contrast (high-key or low-key), the colour temperature and palette, and the mood. One sentence, 20 to 40 words.

```
Lighting: Soft warm key from the hearth at frame right, cool blue fill from the cave mouth at frame left, thin golden rim light on the fur, low-key contrast, amber and slate-blue palette, quiet and safe.
```

Rules:

- Motivated light only. Every key and rim comes from something the `Environment:` sentence puts in the world: the sun, the sky, the moon, a hearth, a lantern, glowing moss, light bouncing off snow or ice. Name the source. If a shot needs a source the environment lacks, add it to the `Environment:` sentence for the whole location, never to one shot.
- Keep the style lock true. The style lock asks for "soft warm illumination highlighting individual strands of fur" in every shot. A cold, dark, or stormy shot keeps a soft warm fill or rim on the fur, so the `Lighting:` sentence never contradicts the lock.
- Keep the house look. The family reference image (section 8 of `character-consistency.md`) has warm golden light catching the fur tips against cooler blue and violet surroundings, and that warm-on-cool contrast is what keeps the fur colours reading true from shot to shot. Low-key is tense, never gloomy or horror-dark: the darkest shot of a film still has its warm rim and faces the viewer can read. Flat, shadowless light and harsh overhead midday sun with no rim flatten the fur into a plain block of colour, and the `Avoid:` line in every prompt names flat lighting for that reason.
- Directions are frame directions: frame left, frame right, behind the subject, overhead, low from the front. The images and the clips then read them the same way.
- The light follows the story. Exposition is soft and high-key. The Inciting Incident changes the light (a cloud crosses the sun, a shadow falls, the fire gutters). Rising Action and the Climax go low-key: harder side light, deeper shadows, cooler colour. Falling Action lets the warmth come back, and the Resolution is soft, warm, and golden.
- The sentence describes the light at the end of the shot. When the light changes during a shot, the first beat of the `Action:` text describes the change. Section 6 limits where in a video that can happen.
- Each location's light sources, colour temperatures, and palette are set once, in a `Lighting lock:` paragraph in the storyboard's agent instructions, and every `Lighting:` sentence at that location draws on them.
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

- Every effect has a cause in the `Environment:` sentence or the `Action:` text, and none comes from a Yeti's body, apart from breath misting in cold air. Magic is written as a change in light or weather near a character (the frost on the branch sparkles as the sun reaches it), never as something a Yeti casts. The no-energy rule in `character-consistency.md` covers every word in this cell: no energy, beam, burst, blast, pulse, aura, shockwave, or force field.
- Never: explosions, fire that harms anyone, blood or injury, weapon effects, glitch effects, on-screen text, titles, or motion graphics, split screens, screen or hologram inserts, freeze frames, morphs (a morph changes a body, which the character rules forbid), strobing or flashing.
- Weather that runs through a whole location (steady snowfall, a drifting mist) belongs in the `Environment:` sentence, so every shot and image at that location carries it. The VFX cell holds the effects that belong to one shot.
- Every visible effect that makes a sound gets that sound in the audio cell: the hiss of blowing spindrift, the crackle of embers, the patter of spray.
- A `VFX lock:` paragraph in the storyboard's agent instructions lists which effects belong to which video, so an effect does not leak into a clip that should not have it.

Transitions:

- Between shots inside one 10-second clip, only `Hard Cut` or `Match Cut` (a cut where the next shot repeats a shape or a movement from this one). Anything that takes time (Dissolve, Fade, Wipe, Whip-Pan Transition, Morph) is out, because each shot has its own two panels in the 3x2 grid, the panels on either side of a cut are clean pictures of two different shots, and a blend between them matches neither.
- The last shot of every video says `Transition: Holds on the final frame.` The video model renders one clip; the cut to the next clip happens in the edit.
- Edit-level transitions live in the storyboard's agent instructions, never in a table: a hard cut at every handoff, a Dissolve or a fade through black only at a scene break, and a fade to black at the very end if the editor wants one. Every clip stays exactly 10 seconds in the edit, so no speed ramps or retiming there.

## 5. Sound

Each audio cell, in this order:

1. The music state: starts, continues, swells, pauses, softens, or resolves. The music is background score that the characters cannot hear. The one-instrument rule and the mood-not-score-cue rule in the storyboard skills still apply.
2. The ambient bed of the location: wind across snow, a crackling hearth, a river, birds in the pines.
3. A sound for each physical action and each visible effect, described from scratch, never by a stock effect name.
4. `No dialogue.`

Characters may gasp, giggle, sigh, or hum, but never form words.

## 6. The 10-second video and its 3x2 grid

Each 10-second video is one Flow generation, made from its storyboard table with images attached as references: the video's six panel images and the family reference image, or the video's 3x2 grid and the family reference image. Flow takes at most seven ingredient images for one clip, which is why a video has six panels and not more. No clip starts or ends on a supplied frame, so continuity lives in the storyboard text and in those images, and the direction has to agree with both.

Every video has three shots on a fixed split (`00:00 - 00:03`, `00:03 - 00:07`, `00:07 - 00:10`), and every shot's `Action:` is two beats, one sentence each. That gives six beats per video, and each beat is one panel of the video's 3x2 grid. The grid is one horizontal 16:9 image, three panels across and two down, read left to right and top to bottom, and each shot takes two panels in a row:

| Panel | Place in the grid | Shot | Beat | Timecode | Framing and angle |
| --- | --- | --- | --- | --- | --- |
| 1 | Top left | Shot 1 | 1st | 00:00.0–00:01.5 | Shot 1's opening framing |
| 2 | Top centre | Shot 1 | 2nd | 00:01.5–00:03.0 | The framing Shot 1 ends on |
| 3 | Top right | Shot 2 | 1st | 00:03.0–00:05.0 | Shot 2's opening framing |
| 4 | Bottom left | Shot 2 | 2nd | 00:05.0–00:07.0 | The framing Shot 2 ends on |
| 5 | Bottom centre | Shot 3 | 1st | 00:07.0–00:08.5 | Shot 3's opening framing |
| 6 | Bottom right | Shot 3 | 2nd | 00:08.5–00:10.0 | The framing Shot 3 ends on |

- Beats. Each beat sentence ends on a picture a viewer could photograph: positions, poses, paws, props, eye lines, and any face that has changed. The first beat of a shot starts from the shot's opening picture and covers its first half, and the second ends on the picture the shot closes on, with the feeling its `[EXPRESSION]` slot holds. When a Yeti's feeling changes during a shot, the beat where it changes names the new feeling, so the panels can follow it. Panel 3 ends on 00:05, the centre of the clip.
- Framing at each panel. A shot that keeps its framing holds it in both panels. A shot whose move changes the framing shows the first framing in its Shot Type cell in its first panel and the second framing in its second panel. The angle is the one the cell names. If the `Camera:` sentence ends on a different angle (a Crane Up that ends looking down), the second panel takes that angle.
- Picture size. The grid is always 16:9, whatever the film's shape. Each panel holds a picture in the film's aspect ratio, a horizontal 16:9 frame for a widescreen film or a vertical 9:16 frame for a vertical one, and each panel image is a full single image in that same shape.
- Light inside a video. The `Lighting:` sentence holds the light at the end of its shot. The light never changes during a Shot 1, because Shot 1 carries on the previous video's light. A change in a Shot 2 or a Shot 3 happens in the shot's first beat and is complete by the end of it, so the shot's second panel, and its panel image, sits under its `Lighting:` sentence as written. The shot's first panel shows the change under way, and its panel line says so.
- Light at the handoff. A video's Shot 1 uses the same `Lighting:` sentence, word for word, as the previous video's Shot 3, so the cut between the two clips reads as one scene. The only exception is a video marked `Scene break:`.
- Picture at the handoff. The first beat of a video's Shot 1 holds the picture the previous video's last beat ended on: the same positions, paws, props, eye lines, and faces, seen through the new shot's opening framing, with at most a small change (a face that starts to turn, a breath, a glance). Panel 1 of each grid after the first shows the same picture as panel 6 of the grid before it. A video marked `Scene break:` opens on its new location instead.
- Camera at the ends. Shot 3's move eases to a stop in the last half second, and Shot 1 of the next video eases in from rest, so the cut between the two clips does not jump.
- Effects in a grid panel or a panel image are frozen: flakes hang in the air, embers are points of light, spray is drops in mid-air. Slow motion, camera moves, and transitions do not exist in a still image.

## 7. The 10-second pipeline

A film is made one 10-second video at a time, and every file in the pipeline is organised around those videos. Each video has the same `## Video N - <Title>` heading in every file, and that heading is how one step hands a video to the next.

| Step | Skill | Reads | Writes |
| --- | --- | --- | --- |
| 0. Source, optional | `video-to-storyboard` | An existing video | `prompts/<slug>-source-storyboard.md` |
| 1. Storyboard | `storyboard-30s-extender` for 30 seconds, `storyboard-60s-from-story` for 60 | A short storyboard, a story, or a source storyboard | `prompts/<slug>-<30s or 60s>-storyboard.md`: one table per video, three shots, two beats per shot. Each table is that video's Flow prompt, and the file holds no image prompt |
| 2. Images | `create-3x2-timed-image` | The storyboard | `prompts/<slug>-<30s or 60s>-3x2.md`, every image prompt for the film: per video, one 16:9 grid prompt with exactly six panels and six panel image prompts, one per panel. The images go in `3x2-timed-storyboard-images/<slug>/`, as `Video N - <Title>.jpg` for the grid and `Video N - <Title> - Panel P.jpg` for each panel |
| 3. Clips | The operator, in Google Flow | The storyboard's agent instructions | One 10-second clip per video |
| 4. Promotion | `reel-carousel` | The storyboard, its 3x2 file, and the reel link | `carousels/<slug>-carousel.md` |

Step 3 has two routes, and the operator picks one per video. Both paste the video's table as the text prompt, and both attach images as references, never as a start or an end frame. Flow accepts at most seven images for one clip:

- Panel route: attach the video's six panel images and the family reference image, seven in all. The panel images were generated with the family reference image attached, so they carry its look, and together they show Flow every beat of the clip at full size, each in its framing and light.
- Grid route: attach the video's 3x2 grid image and the family reference image. The grid shows Flow all six beats in order in one picture.

The storyboard is the single source. The grids and the panel images are drawn from its beats, lights, framings, and effects, never from a picture that exists only in the head of whoever writes them. When a beat changes, change it in the storyboard first, then rewrite that video's grid and panel images. The storyboard holds the video prompts and the 3x2 file holds the image prompts, and neither holds the other's. Run each step as its own skill run, in order. One step's saved file is the next step's input, and a single run that writes the storyboard and the image prompts together runs past a model's output limit.

The 3x3 grid that came before this one drew nine panels per video, three beats per shot, into `prompts/<slug>-<30s or 60s>-3x3.md`. Nine panel images do not fit in Flow's seven ingredient slots, so it is retired. A storyboard whose `Action:` cells still have three beats is revised to two with its storyboard skill, and its 3x3 file is renamed to `-3x2.md` and rewritten, before any new image is made.

The stills route that `storyboard-30s-frames` wrote into `image-prompts/<slug>-<30s or 60s>-frames.md` is retired too. Panel images 2, 4, and 6 show the same pictures, and the frames files already in `image-prompts/` stay for the record.
