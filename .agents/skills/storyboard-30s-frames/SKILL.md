---
name: storyboard-30s-frames
description: >-
  Retired. Do not use for new work. Trigger only when the user runs
  "/storyboard-30s-frames" by name, and then point them to `create-3x3-timed-image`,
  which writes each video's grid and nine panel images in `prompts/<slug>-<30s or 60s>-3x3.md`.
  Panel images 3, 6, and 9 replace the three reference stills per video this skill used
  to write to `image-prompts/`.
---

# Reference stills (retired)

This skill is retired. The stills route it served is gone from the pipeline in section 7 of `.agents/rules/cinematic-direction.md`: `create-3x3-timed-image` now writes every image prompt for a film into `prompts/<slug>-<30s or 60s>-3x3.md`, a grid and nine panel images per video, and panel images 3, 6, and 9 show the same pictures these stills did. Storyboards no longer carry `Stills:` lines. If the user runs this skill, tell them so and offer `/create-3x3-timed-image` instead. The frames files already in `image-prompts/` stay for the record, and the text below stays so they can still be read.

This skill is the stills route in step 2 of the pipeline in section 7 of `.agents/rules/cinematic-direction.md`. Each 10-second Google Flow video is generated from its storyboard table with images attached as references. On the grid route, that image is the video's 3x3 grid from `create-3x3-timed-image`. On the stills route, it is the three stills this skill writes the prompts for: one per shot, each showing the picture the shot closes on. No still is a start or an end frame, and none is set as one in Flow.

The skill works the same way on a 30-second storyboard from `storyboard-30s-extender` (three videos, nine stills) and a 60-second storyboard from `storyboard-60s-from-story` (six videos, eighteen stills). Both use the same table, the same three shots per video, and the same three beats per shot, so nothing below changes with the length except the still count and the file suffix. The storyboard lives in `prompts/` next to its 3x3 grid file, and the still prompts live in `image-prompts/`.

Every prompt opens with `Create image:` so it can be pasted into an image model as one request with nothing added. Each still is the shot it belongs to, frozen on its last beat: the same locks, the same light, the same `[EXPRESSION]` slot, the framing the shot ends on, and the shot's effects frozen in place. A still that is lit, framed, or faced differently from its shot fights the clip it is attached to.

Reference output for how one prompt reads (locks copied, `Action:` as a held image, closing line): `image-prompts/papa-yeti-warm-dome-30s-frames.md`. It was written for start and end frames, with five frames per video, so take the prompt style from it and the count, headings, and instants from this file.

## Rules that always apply

Everything in the "Rules that always apply" section of the skill that wrote the storyboard (`storyboard-30s-extender` or `storyboard-60s-from-story`) applies here. Read that section, `.agents/rules/character-consistency.md`, and `.agents/rules/cinematic-direction.md` (section 6 above all) before writing anything.

Rules specific to the stills:

- Three stills per video, one per shot, numbered in film order without restarting per video. Video N has Stills 3N-2 to 3N: Stills 1 to 3 are Video 1, 4 to 6 are Video 2, and so on. A 30-second storyboard gives nine stills, a 60-second storyboard eighteen.
- Each still shows its shot's closing beat, the third sentence of the shot's `Action:`, frozen at the end of the shot (00:03, 00:07, or 00:10 on the video's clock). That is the same picture as panel 3, 6, or 9 of the video's 3x3 grid:

  | Still in video | Shot | Instant | Beat | Grid panel | Framing and angle |
  | --- | --- | --- | --- | --- | --- |
  | 1st | Shot 1 | 00:03 | Shot 1's third beat | Panel 3 | The framing Shot 1 ends on |
  | 2nd | Shot 2 | 00:07 | Shot 2's third beat | Panel 6 | The framing Shot 2 ends on |
  | 3rd | Shot 3 | 00:10 | Shot 3's third beat | Panel 9 | The framing Shot 3 ends on |

- Framing comes from the Shot Type cell. `Medium Shot, Low Angle` holds that framing for the whole shot, so the still takes it. `Medium Shot to Close-Up, Low Angle` ends on `Close-Up, Low Angle`, so the still takes that. If the `Camera:` sentence ends on a different angle (a Crane Up that ends looking down), the still takes that angle.
- Every lock is copied from the still's shot character for character, and nothing between the aspect ratio line and the avoid line changes: the aspect ratio line, the style lock, the `Environment:` sentence, the `Lighting:` sentence, the character text with its `[EXPRESSION]` slot as the shot fills it, the head lock, the look lock, the scale lock where the shot has one, the `Humans:`, `Animals:`, or `Creatures:` sentences, and the avoid line. The `Lighting:` sentence and the slot both hold the end of the shot, which is the still's instant, so both copy without edits. The still prompt and the shot's visual cell differ only in the `Create image:` prefix, the `Action:` text, the `Camera:` sentence (left out, because a still does not move), the `Effects:` sentence (frozen, below), and the closing line.
- The stills decide how the Yetis look in the clips made with them. A still with the wrong colour, the wrong tuft, a Babu as big as his father, or a scarf makes the clip wrong, and the model drifts most between stills, because each one is a fresh generation. So every still carries the full locks, nothing is shortened for a close-up or a wide, the family reference image is attached to every generation, and every still passes the look check in section 12 of `character-consistency.md` before it is used. Every `Action:` agrees with section 8 of that file: paws, not hands, nothing worn, and Babu about half as tall as a grown-up Yeti beside him.
- The aspect ratio line is the one the storyboard uses. The Yeti shorts are vertical, `Vertical 9:16 aspect ratio, full-frame vertical composition.`, and that is the default. A film whose storyboard sets another format keeps its own line, copied from its visual cells.
- The `Action:` text describes a held image, not a change over time. No "then", no "begins to", no "as the light grows". Present tense, one pose per character, eye lines stated. Freeze the third beat at the end of the shot and describe what a viewer sees in a single photograph of that instant.
- Every `Action:` opens with the still's framing and angle and the word "still" (`Close-Up, Low Angle still.`, `Medium Two-Shot, Eye Level still.`), and the prompt ends with `Single still reference image. No text, captions, or watermark.`
- The `Effects:` sentence is the shot's `Effects:` text frozen at the end of the shot, as section 6 of `cinematic-direction.md` describes: falling snow hangs as flakes in the air, embers are points of light, spray is drops in mid-air, a lens flare or light shaft stays as it is, shallow depth of field and bokeh stay. Slow motion does not exist in a still, and motion blur stays only on a fast-moving thing, never on a face. Keep only the effects still visible at that instant, and leave the sentence out when none are. The `Transition:` text never goes into a still prompt.
- Every prompt opens with `Create image:` followed by a space and the aspect ratio lock on the same line, for example `Create image: Vertical 9:16 aspect ratio, full-frame vertical composition.` Nothing comes before it and nothing sits between it and the lock.
- Absence is stated, never implied. A shot without a Yeti keeps the shot's wording (`No Yeti is in this shot.`). A still whose shot has supporting cast keeps the `Humans:`, `Animals:`, or `Creatures:` sentences and says which of those characters are not in the picture, and a Yeti who has left the frame by the third beat is named as not in the picture. Image models put every described character on screen unless told not to.
- The grid and the stills agree. If the video's 3x3 grid file exists, each still shows the same picture, the same faces, and the same framing as its panel (3, 6, or 9), and takes that panel's title in sentence case. If they disagree, one of them was not drawn from the storyboard; fix that one.
- No audio text anywhere in the still prompts. The file has no audio column and no music.

## Workflow

### 1. Get the storyboard

The input is `prompts/<slug>-30s-storyboard.md` or `prompts/<slug>-60s-storyboard.md`, as a path.

- If the user gives a short storyboard, a story, or a source storyboard instead, stop and name step 1: `/storyboard-30s-extender` or `/storyboard-60s-from-story`. Do not write the storyboard and the stills in one run; a single run that writes both runs past a model's output limit.
- If the storyboard still has `Frames:`, `Start frame:`, `Midpoint frame:`, or `End frame:` lines, or an `Action:` that is not three sentences, it was written for start and end frames. Revise it first with step 6 of `storyboard-30s-extender` or step 8 of `storyboard-60s-from-story`, save it, and tell the user. The same goes for a storyboard that predates the look lock: its character text says "vibrant blue fur" or "vibrant pink fur", or its cells have no `Look lock:` or `Avoid:` sentence. Replace the character text in every cell with the current text from sections 2 to 4 of `character-consistency.md`, keeping each `[EXPRESSION]` value, add the look lock, the scale lock where the baby Yeti shares the shot with a grown-up Yeti, and the avoid line, and reword any sentence outside the character text that sizes a place or a prop by a Yeti (section 10 of that file).
- Run the storyboard skill's own checklist on the file. Do not start the stills until it passes, because every still is copied from it.

### 2. Derive the stills

For each video table in order, walk its three shots and write down for each still:

- Still number, video number, shot number, and that row's timestamp range.
- The framing and angle the shot ends on, from the rule above.
- The full visual cell of that shot from the aspect ratio line up to and including the avoid line. This is copied, not retyped.
- The picture at the end of the shot, from the shot's third beat: where each character is, what each paw holds, where each eye line points, and which characters and animals are in the picture and which are not.
- The shot's `Effects:` text frozen at the end of the shot, or nothing if no effect is visible then.
- A short title, three to six words, naming the image ("The frozen bird", "Paws pressed, first glow", "Final huddle"), or the grid panel's title in sentence case when the grid exists.

Confirm that the still numbers you derived match the `Stills:` line under each video heading. If a third beat does not end on a picture you can photograph, or the face it describes disagrees with the shot's `[EXPRESSION]` slot, the storyboard is wrong; fix the storyboard first, then come back.

### 3. Write the still prompts

Each still is a level-3 heading and one fenced code block holding the prompt as a single paragraph. Group stills under the same `## Video N - <Title>` headings the storyboard uses.

Heading format, with middle dots (`·`) between the parts and an en dash inside the shot's timestamp range:

```
### Still <N> · Shot <S> (<mm:ss>–<mm:ss>) · Panel <P> · <Framing>, <Angle> · <Short title>
```

The range in parentheses is the shot's row in the storyboard table. The panel is the matching grid panel (3, 6, or 9). The framing and angle are the ones the shot ends on.

Prompt order inside the code block:

1. `Create image:` and the storyboard's aspect ratio line, on one line, word for word.
2. Style lock.
3. `Environment:` sentence.
4. `Lighting:` sentence, copied from the shot.
5. Character text (`Character: ...`, `On the left, ... On the right, ...`, or `On the left, ... In the center, ... On the right, ...`), copied from the shot with its `[EXPRESSION]` slot as the shot fills it.
6. Head lock.
7. Look lock.
8. Scale lock, if the shot has one.
9. `Humans:`, `Animals:`, and/or `Creatures:` sentences, if the storyboard has them.
10. Avoid line.
11. `Action:` opening with `<Framing>, <Angle> still.` and describing the held image at the end of the shot, including who is not in it.
12. `Effects:` the shot's effects frozen at this instant, if any are visible.
13. `Single still reference image. No text, captions, or watermark.`

### 4. Write the stills file

Save to `image-prompts/<slug>-30s-frames.md` for a 30-second storyboard or `image-prompts/<slug>-60s-frames.md` for a 60-second one, using the same slug as the storyboard file. This is the path the storyboard's `Stills:` lines name; if they name something else, the storyboard is wrong. Create `image-prompts/` if it does not exist. Never save still prompts under `prompts/`, and never save the storyboard or its grids under `image-prompts/`.

If the file already exists in the old format (`### Frame 1` headings, five per video, written for start and end frames), ask the user before replacing it. It may hold the prompts for stills they have already generated.

Use the template below. The intro paragraph names the storyboard file the stills belong to.

### 5. Verify before finishing

Run the storyboard's own checklist on the storyboard file, then check every item below on the stills file. Fix and re-check rather than reporting a partial result. `<count>` below is three times the number of videos: 9 or 18.

- [ ] `<count>` stills, headed `### Still 1` to `### Still <count>` in order, three under each `## Video N - <Title>` heading, and the headings match the storyboard's. `grep -c "^### Frame " <file>` returns 0.
- [ ] Within each video the three stills are Shots 1, 2, and 3 in order, each heading names its shot's timestamp range from the storyboard table and its grid panel (3, 6, 9), and each still number matches the `Stills:` line under its video in the storyboard.
- [ ] Each heading's framing and angle is the one its shot ends on, and the `Action:` opener names the same framing and angle.
- [ ] `grep -c "^Create image: <the storyboard's aspect ratio line>" <file>`, `grep -c "Head lock" <file>`, `grep -c "Look lock" <file>`, `grep -c "Avoid: " <file>`, and `grep -c "Lighting: " <file>` all return `<count>`. `grep -c "Scale lock" <file>` returns the number of stills whose shot has the baby Yeti and a grown-up Yeti in it. No prompt line starts with anything other than `Create image:`.
- [ ] For each still, the text from the aspect ratio line through the avoid line, `Lighting:` sentence and `[EXPRESSION]` slots included, is identical to the matching visual cell in the storyboard. Diff them, do not eyeball them.
- [ ] Every character text is the current text from sections 2 to 4 of `character-consistency.md`: `grep -cE "vibrant (blue|pink) fur" <file>` returns 0. No sentence outside the character text sizes a place or a prop by a Yeti.
- [ ] Every `Action:` agrees with section 8 of `character-consistency.md`: paws, not hands, no skin, no claws, nothing worn, and Babu never drawn as big as a grown-up Yeti.
- [ ] Every `Action:` opens with the framing, the angle, and "still", describes the shot's third beat as one held instant with no motion words, agrees with the shot's `[EXPRESSION]` slot, and states which Yetis, humans, animals, or creatures are not in the picture.
- [ ] Every `Effects:` sentence names only effects from its shot's `Effects:` text, frozen, with no slow motion and no motion blur on a face. No `Camera:` or `Transition:` text in any prompt: `grep -cE "Camera: |Transition: " <file>` returns 0.
- [ ] Every prompt ends with `Single still reference image. No text, captions, or watermark.`
- [ ] If the 3x3 grid file exists, each still shows the same picture, faces, and framing as its panel.
- [ ] No audio text, no timestamps inside a prompt, no "No dialogue." line (there is nothing to speak in a still).
- [ ] Storyboard saved in `prompts/` ending `-30s-storyboard.md` or `-60s-storyboard.md`, stills saved in `image-prompts/` with the matching `-30s-frames.md` or `-60s-frames.md` suffix, same slug on both.

## Output template for the stills file

The storyboard file uses the template of the skill that wrote it, unchanged.

````markdown
# <Title> <30s or 60s> Reference Stills

Reference still prompts for `prompts/<slug>-<30s or 60s>-storyboard.md`. Three stills per 10-second video, one per shot, <nine or eighteen> in total, numbered in film order. Each still shows the picture its shot closes on (the shot's third beat, at 00:03, 00:07, or 00:10 on the video's clock), the same picture as panel 3, 6, or 9 of the video's 3x3 grid in `prompts/<slug>-<30s or 60s>-3x3.md`. Each prompt opens with `Create image:` and carries the same aspect ratio line, style lock, environment sentence, lighting sentence, character text with its `[EXPRESSION]` slot, head lock, look lock, scale lock (where the shot has one), supporting cast sentences, and avoid line as its shot, with the `Action:` rewritten as a single held image framed as the shot ends, and the shot's effects frozen in an `Effects:` sentence.

These stills are for the stills route. In Google Flow, generate a video in ingredients-to-video mode with its three stills attached as reference images and its storyboard table pasted as the prompt. Never set a still as a start or an end frame.

Attach the family reference image to every still generation as a character reference, and run the look check in section 12 of `.agents/rules/character-consistency.md` on every still before using it: each Yeti's colour, tuft, and size, nothing worn, no extra Yeti, and the face the prompt names. A still that fails is regenerated, because the clip copies its look from the images attached to it.

## Video 1 - <Title>

### Still 1 · Shot 1 (00:00–00:03) · Panel 3 · <Framing>, <Angle> · <Short title>

```
Create image: <Aspect ratio line> <Style lock> Environment: <sentence>. Lighting: <sentence copied from the shot>. <Character text copied from the shot, slot included>. Head lock: each Yeti has a smooth, rounded, fully furred head, and the tuft of fur is the only thing on top of it; there are no horns, no antlers, no spikes, no bumps, and no headwear. Look lock: each Yeti is a stylized, friendly 3D animated character with a soft, plush, rounded shape, it wears nothing but its own fur, and that fur is one solid colour from head to toe, with only the face and paws a lighter shade. <Scale lock: the baby Yeti is about half as tall as each grown-up Yeti in the shot. (only if the shot has one)> <Humans: / Animals: / Creatures: sentences if any> Avoid: photorealistic humans, scary monsters, horror elements, flat lighting, urban environments, extra Yetis, and, on any Yeti, human skin, visible pores, sharp teeth, sharp claws, white or grey fur, clothing, hats, or accessories. Action: <Framing>, <Angle> still. <The shot's third beat, held at the end of the shot, and who is not in the picture.> Effects: <the shot's effects, frozen at this instant, if any>. Single still reference image. No text, captions, or watermark.
```

### Still 2 · Shot 2 (00:03–00:07) · Panel 6 · <Framing>, <Angle> · <Short title>

...

### Still 3 · Shot 3 (00:07–00:10) · Panel 9 · <Framing>, <Angle> · <Short title>

...

## Video 2 - <Title>

### Still 4 · Shot 1 (00:00–00:03) · Panel 3 · ...
### Still 5 · Shot 2 (00:03–00:07) · Panel 6 · ...
### Still 6 · Shot 3 (00:07–00:10) · Panel 9 · ...

## Video 3 - <Title>

### Still 7 · Shot 1 (00:00–00:03) · Panel 3 · ...
### Still 8 · Shot 2 (00:03–00:07) · Panel 6 · ...
### Still 9 · Shot 3 (00:07–00:10) · Panel 9 · ...

<For a 60-second storyboard, Videos 4 to 6 follow with Stills 10 to 18 in the same pattern.>
````
