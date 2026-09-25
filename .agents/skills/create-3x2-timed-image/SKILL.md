---
name: create-3x2-timed-image
description: >-
  Trigger when the user asks for 3x2 grids, cinematic 3x2 timed storyboard prompts, a 3x2
  storyboard image, panel images, reference images, or image prompts for a Yeti storyboard,
  says "6 panels per video", "6 images per video", "create yeti image", "create 3x2", or
  "create 3x3" (the grid's old name), or runs "/create-3x2-timed-image". Takes a 30-second
  or 60-second Yeti storyboard from `prompts/` and writes every image prompt for the film
  to `prompts/<slug>-<30s or 60s>-3x2.md`. For each 10-second video it writes one
  cinematic 3x2 timed storyboard prompt, a 16:9 image with exactly six panels (two per
  shot, one per beat), and six panel image prompts, one full single image per panel, so
  the six panel images and the family reference image fill Flow's seven ingredient slots.
  Checks the file with `check_grid.py`, then generates the grids and panel images with the
  family reference image attached and saves them to `3x2-timed-storyboard-images/<slug>/`.
---

# Create 3x2 timed grids and panel images

This is step 2 of the pipeline in section 7 of `.agents/rules/cinematic-direction.md`. The storyboard holds the video prompts and nothing else: every 10-second video is one table, three shots, and two beats in each shot's `Action:`. This skill writes every image prompt the film needs into one file next to the storyboard. For each video it writes two things:

- The grid: one cinematic 3x2 timed storyboard prompt that draws the whole clip as one horizontal 16:9 image with six panels, three across and two down, so the operator can see the clip before generating it.
- The panel images: six prompts, one per grid panel, each drawing that panel's picture as a full single image with every lock in it. They show each beat at full size, and the six of them, with the family reference image, are the seven images the panel route attaches to the clip.

Google Flow takes at most seven ingredient images for one clip. Six panels per video is what lets every beat of the clip go in as its own image, with the family reference image as the seventh. No grid panel and no panel image is a start or an end frame.

The mapping is fixed, and it is the same for every video:

- One grid and six panel images per video. A 30-second storyboard gives three grids and 18 panel images, and a 60-second storyboard six grids and 36 panel images. Never more and never fewer.
- Six panels per grid, exactly, in reading order: panels 1, 2, and 3 across the top row and panels 4, 5, and 6 across the bottom row. Panels 1 and 2 are Shot 1, panels 3 and 4 are Shot 2, and panels 5 and 6 are Shot 3. Within a shot, the first panel is its first beat and the second panel its second beat.
- One beat per panel. A panel never merges two beats, never splits one, and never crosses the cut between two shots, so the six panels are six distinct pictures.
- Panel image P is grid panel P at full size: the same characters in the same places, the same faces, the same framing and angle, and the same light.
- The grid is always horizontal 16:9. Its panels hold pictures in the film's aspect ratio, and so do the panel images: 16:9 for a widescreen film, 9:16 for a vertical one.

The panel timecodes and framings come from the panel map in section 6 of `cinematic-direction.md`. How the locks sit in a grid prompt and in a panel image prompt comes from section 13 of `.agents/rules/character-consistency.md`. Both files bind, and they win over this one wherever they disagree.

The storyboard never holds an image prompt, and this file never holds a video prompt. The storyboard's agent instructions send the operator here for the images each clip is generated with, and this file's intro says how to generate and check them.

## Rules that always apply

Read `.agents/rules/character-consistency.md` in full (section 13 above all), `.agents/rules/cinematic-direction.md` (sections 1, 2, 4, and 6), and the "Rules that always apply" section of the skill that wrote the storyboard (`storyboard-30s-extender` or `storyboard-60s-from-story`). Every rule there about horns, looks, faces, energy, humans, brands, and text applies to a grid and to a panel image.

Rules for both kinds of prompt:

- The storyboard is the single source. Every panel's picture, face, framing, light, and effects comes from the storyboard's table for that video. Never invent a beat, a light, or a framing that the storyboard does not hold. If a panel cannot be drawn from the storyboard, fix the storyboard first, then write the grid and its panel images.
- Copy, never retype. The aspect ratio lines, the style lock, the `Environment:` sentence, the `Lighting:` sentences, the character text, the head lock, the look lock, the scale lock, the supporting cast sentences, and the avoid line are copied from the storyboard and the rule file character for character. The fixed sentences below are copied from this file.
- One `Environment:` sentence per video. A video never changes location partway through, so its grid and its six panel images share one.
- Two aspect ratios, kept apart. The grid always opens with the fixed grid aspect line below, because the grid image is 16:9 whatever the film's shape. Each panel image opens with the storyboard's own aspect ratio line: `Create image: Vertical 9:16 aspect ratio, full-frame vertical composition.` for the vertical Yeti shorts, and `Create image: Horizontal 16:9 aspect ratio, full-frame widescreen composition.` for a widescreen film. The grid's layout sentence tells the image model which shape each panel's picture takes.
- Faces follow the beats, as step 2 sets out. No smile of any kind on a beat of danger, worry, effort, sadness, or loss.
- No quality words that fight the locks. "Photorealistic", "hyperreal", or a named render engine, studio, or film look contradicts the look lock and the avoid line, and a named product or look trips the copyright filter. The quality sentence below is the only one a grid uses, and a panel image uses none.

Rules specific to the grids:

- The only text in the image is each panel's number, timecode, and title, in the black strip above the panel. No speech bubbles, captions, signs, logos, or watermarks, and nothing written inside a picture.
- Titles are two to four words in capitals, distinct within the grid, and name the picture ("THE LOST KIT", "ICE SPLITS", "FAMILY HUDDLE").

Rules specific to the panel images:

- Each panel image is a single still of its panel, with the pieces in the order at the top of `character-consistency.md`: the style lock, the `Environment:` sentence, its shot's `Lighting:` sentence, the character text for each Yeti in that panel and no other, the head lock, the look lock, the scale lock when the panel has the baby Yeti and a grown-up Yeti, the supporting cast sentences, and the avoid line. A Yeti who is in the shot but not in the panel gets no character text, for the reason in section 10 of that file.
- Each Yeti's `[EXPRESSION]` slot holds the face its grid panel's `Faces:` list gives it, so panel images 2, 4, and 6 carry the shot's own slot values and panel images 1, 3, and 5 carry the faces of their beats.
- The Yetis are placed as the panel's picture places them, in the storyboard's form (rule 2 of `character-consistency.md`): `Character: <text>` for one Yeti, `On the left, <text> On the right, <text>` for two, and `On the left, <text> In the center, <text> On the right, <text>` for three. A panel with no Yeti carries the no-Yeti sentence below where the character text would go.
- The `Action:` opens with the panel's framing and angle and the word "still" (`Medium Shot, High Angle still.`) and describes the grid panel's picture as one held instant: present tense, one pose per character, eye lines stated, no "then" and no "begins to".
- Absence is stated, never implied. The `Action:` names every Yeti and every supporting character from the storyboard who is not in the picture, because an image model draws every character the prompt describes unless told not to.
- The `Effects:` sentence holds only the effects from the shot's `Effects:` text that are visible at the panel's instant, frozen as section 6 of `cinematic-direction.md` describes. An effect that belongs to the shot's second beat (a crack that has not opened yet, spray from a run that has not started) stays out of its first panel. Leave the sentence out when no effect is visible.
- No label text. A panel image carries no number, timecode, or title, and it ends with the closing sentence below.

## Fixed grid sentences

Copy these word for word, in this order, into every grid prompt. `check_grid.py` reads them from this section, so change them here and nowhere else.

Grid aspect line, straight after `Create image:` in every grid, whatever the film's shape:
"Horizontal 16:9 aspect ratio, full-frame widescreen composition."

Layout sentence for a widescreen 16:9 film, straight after the grid aspect line:
"Layout: one image divided into a 3x2 storyboard grid of six equal panels, three across and two down, read left to right and top to bottom like a professional film pre-production board; each panel holds one horizontal 16:9 picture with a thin black strip above it holding the panel's number, timecode, and title in small, clean white letters, the panels are separated by thin black borders, and no text is inside any picture."

Layout sentence for a vertical 9:16 film, in the same place:
"Layout: one image divided into a 3x2 storyboard grid of six equal panels, three across and two down, read left to right and top to bottom like a professional film pre-production board; each panel holds one vertical 9:16 picture centred on black, with a thin black strip above it holding the panel's number, timecode, and title in small, clean white letters, the panels are separated by thin black borders, and no text is inside any picture."

Reference sentence, after the layout sentence:
"Reference: the attached family reference image sets how each Yeti looks and never what it does; every pose, face, framing, and light comes from the panel lines."

Quality sentence, after the reference sentence:
"Quality: 8K UHD detail, pristine sharpness, sharp focus in every panel, vivid true colours, and a clean, readable composition."

Closing line, the last line of every grid prompt:
"Exactly six panels, three across and two down, each a distinct picture that shows only the characters its line names, and no text anywhere except each panel's number, timecode, and title in the strip above it; no logos, watermarks, captions, or speech bubbles."

## Fixed panel image sentences

Copy these word for word into every panel image prompt. `check_grid.py` reads them from this section, so change them here and nowhere else.

No-Yeti sentence, in place of the character text when the panel has no Yeti:
"No Yeti is in this image."

Closing sentence, the last sentence of every panel image prompt:
"Single still reference image. No text, captions, or watermark."

## Workflow

### 1. Get the storyboard

The input is `prompts/<slug>-30s-storyboard.md` or `prompts/<slug>-60s-storyboard.md`, as a path. Read it in full, including the agent instructions and every lock paragraph.

- If the user gives a short storyboard, a story, or a source storyboard instead, stop and name step 1: `/storyboard-30s-extender` or `/storyboard-60s-from-story`. Do not write the storyboard and the image prompts in one run; a single run that writes both runs past a model's output limit.
- If the storyboard still has `Frames:`, `Start frame:`, `Midpoint frame:`, `End frame:`, `Grid:`, or `Stills:` lines, an `Action:` that is not two sentences (a storyboard written for the old 3x3 grid has three), agent instructions that name a `-3x3.md` file or panel images 3, 6, and 9, or agent instructions that say how to generate or check images, it predates the current format. Revise it first with step 6 of `storyboard-30s-extender` or step 8 of `storyboard-60s-from-story`, save it, and tell the user.
- Run the storyboard skill's own checklist on the file. Every grid and panel image is copied from it, so an image prompt written against a storyboard that later changes is wrong.
- Carry the storyboard's image-side notes into this file's intro: which characters and props may appear in which videos, a likely image filter trigger, and any image made before the storyboard last changed that has to be regenerated.

The slug is the storyboard's filename without `-30s-storyboard.md` or `-60s-storyboard.md`. The length is `30s` or `60s`, from the same filename. An older film may also have a `prompts/<slug>-<30s or 60s>-3x3.md` file from the nine-panel grid. Rename it to `-3x2.md` with `git mv` and rewrite it; never keep both.

### 2. Map each video to six panels

For each `## Video N - <Title>` in the storyboard, in order, walk its three table rows and split each `Action:` into its two sentences. Write down, for each of the six panels:

- Panel number (1 to 6), timecode, and shot, from the panel map in section 6 of `cinematic-direction.md`:

  | Panel | Place in the grid | Shot | Beat | Timecode |
  | --- | --- | --- | --- | --- |
  | 1, 2 | Top left, top centre | Shot 1 (`00:00–00:03`) | 1st, 2nd sentence of Shot 1's `Action:` | `00:00.0–00:01.5`, `00:01.5–00:03.0` |
  | 3, 4 | Top right, bottom left | Shot 2 (`00:03–00:07`) | 1st, 2nd sentence of Shot 2's `Action:` | `00:03.0–00:05.0`, `00:05.0–00:07.0` |
  | 5, 6 | Bottom centre, bottom right | Shot 3 (`00:07–00:10`) | 1st, 2nd sentence of Shot 3's `Action:` | `00:07.0–00:08.5`, `00:08.5–00:10.0` |

- The framing and angle, from the shot's Shot Type cell: the opening framing in the shot's first panel and the closing framing in its second, as section 6 of `cinematic-direction.md` sets out. A shot that holds its framing uses it in both.
- The picture: the beat sentence frozen at the end of its beat, as one held image. Where each character is in the panel, what each paw holds, where each eye line points, and which Yetis, humans, and animals are in it and which are not. Present tense, one pose per character, no "then" and no "begins to". Name each Yeti by colour.
- The face of each Yeti in the panel, as a row from the section 5 table of `character-consistency.md`:
  - Panels 2, 4, and 6: the value in that shot's `[EXPRESSION]` slot, copied.
  - Panels 1, 3, and 5: the row that matches the feeling the beat names for that Yeti. When the beat names none, the Yeti keeps the face it had in the panel before. For panel 1 of Video 1, that is Shot 1's slot value; for panel 1 of any later video, it is the previous video's Shot 3 slot value, because the handoff keeps the face. A Yeti who enters in a beat that names no feeling takes its shot's slot value.
  - At the Climax peak (panel 3 of Video 2 in a 30-second film, panel 6 of Video 3 in a 60-second film), the face is the peak feeling the beat names.
- The shot's `Lighting:` sentence, copied. If the shot changes the light in its first beat, the first panel's picture says the change is under way.
- The shot's effects: its `Effects:` text frozen, as section 6 of `cinematic-direction.md` describes, and for each panel the part of it that is visible at that instant. Leave it out when the shot has `Effects: None.`
- A title for the panel.

Then check the mapping before writing a word of prompt:

- Six panels, two per shot, every beat used once.
- The six pictures are distinct. Two panels that describe the same picture mean two beats in the storyboard say the same thing; fix the storyboard, not the grid.
- Panel 1 of each video after the first shows the same picture as panel 6 of the video before, in its own framing, unless the video is marked `Scene break:`.
- Every Yeti in a panel has character text in its shot. A panel that shows a Yeti its storyboard shot leaves out, or a shot whose character text names a Yeti its `Action:` says is not there, means the storyboard is wrong; fix it first.

### 3. Write the grid prompts

Each grid prompt is one fenced code block. Its first line is the header paragraph; after a blank line come the shots, each a `Shot` line followed by its two `Panel` lines and a blank line; the last line is the closing line.

Header paragraph, in this order:

1. `Create image:` and the grid aspect line, on one line.
2. The layout sentence for the film's shape: the 16:9 one when the storyboard's aspect ratio line says 16:9, the 9:16 one when it says 9:16.
3. The reference sentence.
4. The quality sentence.
5. The style lock.
6. The `Environment:` sentence.
7. The character text for each Yeti who appears in any of the six panels, in the order blue, pink, baby, each labelled with its colour: `The blue Yeti: <section 2 text>`, `The pink Yeti: <section 3 text>`, `The baby Yeti: <section 4 text>`. The `[EXPRESSION]` slot holds the grid phrase from section 13 of `character-consistency.md`, "the face each panel line names". A Yeti in none of the six panels gets no character text.
8. The head lock.
9. The look lock.
10. The scale lock, when any panel has the baby Yeti and a grown-up Yeti in it.
11. The storyboard's `Humans:`, `Animals:`, or `Creatures:` sentences, if it has them.
12. The avoid line.

Shot line, one per shot:

```
Shot <s> · <start>–<end> · <Shot Type cell>. Lighting: <the shot's Lighting: sentence>. Effects: <the shot's effects, frozen>.
```

Panel line, two per shot:

```
Panel <n> · <timecode> · <TITLE> · <Framing>, <Angle>. <The held picture, with every character placed.> Faces: the <colour> Yeti, <section 5 row text>; the <colour> Yeti, <section 5 row text>.
```

The `Faces:` list names every Yeti in the panel, and only those, as `the blue Yeti`, `the pink Yeti`, or `the baby Yeti`, separated by semicolons. A panel with no Yeti ends `No Yeti is in this panel.` instead.

### 4. Write the panel image prompts

Under each grid, write its six panel images in order. Each one is a level-3 heading, an `Image:` line, and one fenced code block holding the prompt as a single paragraph.

Heading, with the grid panel's timecode, framing, angle, and title in sentence case:

```
### Panel <P> · <timecode> · <Framing>, <Angle> · <Title in sentence case>
```

Image line, naming where the generated image is saved:

```
Image: `3x2-timed-storyboard-images/<slug>/Video N - <Title> - Panel P.jpg`.
```

Prompt order inside the code block:

1. `Create image:` and the storyboard's aspect ratio line, on one line.
2. The style lock.
3. The `Environment:` sentence.
4. The shot's `Lighting:` sentence.
5. The character text for each Yeti in the panel, placed and with its `Faces:` value in the slot, or the no-Yeti sentence.
6. The head lock.
7. The look lock.
8. The scale lock, if the panel has the baby Yeti and a grown-up Yeti in it.
9. The storyboard's `Humans:`, `Animals:`, or `Creatures:` sentences, if it has them.
10. The avoid line.
11. `Action:` `<Framing>, <Angle> still.` and the panel's picture as a held instant, ending with who is not in it.
12. `Effects:` the shot's effects visible at this instant, frozen, if any are.
13. The closing sentence.

### 5. Write the file

Save to `prompts/<slug>-<30s or 60s>-3x2.md`, next to the storyboard. Use the template below. The `## Video N - <Title>` headings are the storyboard's, word for word, so every file in the pipeline names each video the same way. Under each heading come the `Film position:`, `Stage:`, `Video prompt:`, and `Image:` lines, the grid prompt, and then the six panel images. Never write into the storyboard.

If the model's output limit is near, write and save one video at a time, its grid and its six panel images together, appending to the file, and run the checker once all of them are in.

### 6. Verify before generating

Run the checker:

```
python3 .agents/skills/create-3x2-timed-image/check_grid.py prompts/<slug>-<30s or 60s>-3x2.md
```

It finds the storyboard by name and checks both files. For the storyboard: no start or end frame lines, no `Grid:` or `Stills:` lines, no `Create image:` prompt, and no mention of the old 3x3 grid; three rows per table on the fixed split; two sentences in every `Action:`; and no shot with character text for a Yeti its `Action:` says is not in it. For each grid: one grid per storyboard video, under the same heading; the grid aspect line, the layout sentence for the film's shape, the other fixed sentences, and every lock word for word and in order; the `Environment:` sentence, supporting cast, `Lighting:` sentences, and Shot Type cells copied from the storyboard; three `Shot` lines and exactly six panels, numbered and timed to the panel map; each panel's framing against its shot; distinct titles and pictures; every character text against sections 2 to 4 with the grid phrase in its slot; every `Faces:` entry a section 5 row for the right Yeti, only Yetis that have character text in the panel's shot, and the faces in panels 2, 4, and 6 equal to the storyboard's slots; the scale lock where it belongs; and no `Camera:`, `Transition:`, or audio text. For each video's panel images: exactly six, in order, each heading matching its grid panel's timecode, framing, angle, and title; the `Image:` path; the storyboard's aspect ratio line, the style lock, the `Environment:` sentence, and the shot's `Lighting:` sentence; a character text for exactly the Yetis in the grid panel's `Faces:` list, each with that face in its slot and placed in the storyboard's form, or the no-Yeti sentence; the head lock, look lock, supporting cast, and avoid line; the scale lock where the panel needs it; the `Action:` opener; the closing sentence; and all of it in order. It prints `OK` or the problems for each video and exits with status 1 if anything fails. Fix every problem and run it again until every video prints `OK`. It also prints `Note:` lines for things to look at that are not always wrong, such as a panel 1 face that differs from the panel 6 face before it.

Then check what the script cannot:

- [ ] Every panel's picture is the beat it comes from, frozen at the end of the beat, with no motion words, and it agrees with its `Faces:` list.
- [ ] Every Yeti in a picture is named by colour and placed in the panel, and no picture puts a paw or prop on or above a Yeti's head.
- [ ] Every panel's picture agrees with section 8 of `character-consistency.md`: paws, not hands, nothing worn, and the baby Yeti about half as tall as a grown-up Yeti beside him.
- [ ] Panel 1 of each video after the first shows the same picture as panel 6 of the video before, unless the video is marked `Scene break:`.
- [ ] Every shot's `Effects:` text is the shot's own effects, frozen, and nothing a Yeti gives off.
- [ ] Titles are two to four words, in capitals, and name the picture.
- [ ] Every panel image's `Action:` shows the same picture as its grid panel, with the Yetis on the sides its character text names, and states which Yetis and supporting characters are not in it.
- [ ] Every panel image's `Effects:` sentence holds only the shot's effects that are visible at that instant, and none from a later beat.

### 7. Generate the images

Generate only when the user asks for images, or ran the skill to get them. The family reference image is needed for this step and no other; if the user has not attached it, ask for it now and wait.

For each video, in order:

1. Generate the grid with the image tool (`generate_image` in Antigravity): the prompt is the whole grid code block, `ImagePaths` holds the absolute path of the family reference image, and `ImageName` is the slug and the video number in snake_case (`yeti_glacier_rescue_video_1`).
2. Check the grid: horizontal 16:9; six panels, three across and two down, in order, each picture in the film's aspect ratio; the labels in the strips above the pictures and nothing written inside them; and every panel through the look check in section 12 of `character-consistency.md`, with each face against its `Faces:` list. A grid with one failing panel is regenerated whole.
3. Save it to the path its `Image:` line names, `3x2-timed-storyboard-images/<slug>/Video N - <Title>.jpg`, using the heading word for word. Create the folder if it does not exist, then copy the generated file there (with `run_command` in Antigravity): `mkdir -p "3x2-timed-storyboard-images/<slug>" && cp "<generated image>" "3x2-timed-storyboard-images/<slug>/Video N - <Title>.jpg"`. Never use a generic name such as `video_1.jpg`.
4. Generate the six panel images the same way, one at a time: the prompt is the panel's whole code block, the family reference image is attached, the output is set to the film's aspect ratio, and `ImageName` adds the panel number (`yeti_glacier_rescue_video_1_panel_3`).
5. Check each panel image against its prompt and its grid panel: the film's aspect ratio, the same picture, faces, framing, and light as the panel, no text in it, and the look check in section 12 of `character-consistency.md`. Regenerate any that fail.
6. Save each to the path its `Image:` line names, `3x2-timed-storyboard-images/<slug>/Video N - <Title> - Panel P.jpg`.

If the session has no image tool, stop after step 6 of the workflow and tell the user how to generate the images in Google Flow: set the output to 16:9 for a grid and to the film's aspect ratio for a panel image, attach the family reference image, paste one prompt at a time, whole, run the checks above, and save each image under the name its `Image:` line gives.

### 8. Report

Tell the user the file path, the number of grids and panel images, and which images were generated and saved. Name the next step: the storyboard's agent instructions, which generate each 10-second clip in Flow from its table with the video's six panel images and the family reference image attached, or its grid and the family reference image.

## Output template

````markdown
# <Title> <30s or 60s> 3x2 Grids and Panel Images

Image prompts for `prompts/<slug>-<30s or 60s>-storyboard.md`, which holds the video prompts. Each 10-second video has, under its own heading:

- One cinematic 3x2 timed storyboard prompt: one horizontal 16:9 image with exactly six panels, three across and two down, where panels 1 and 2 are Shot 1, panels 3 and 4 are Shot 2, and panels 5 and 6 are Shot 3, and each panel is one beat of that shot's `Action:`, timed and framed by the panel map in section 6 of `.agents/rules/cinematic-direction.md`. It carries the locks as section 13 of `.agents/rules/character-consistency.md` sets out, with each Yeti's face given per panel in a `Faces:` list.
- Six panel image prompts, one per grid panel, each drawing that panel's picture as a full single image with every lock, the shot's light, and the panel's faces in the `[EXPRESSION]` slots.

<Three or six> grids and <18 or 36> panel images in total. The images are saved to `3x2-timed-storyboard-images/<slug>/`: each grid as `Video N - <Title>.jpg` and each panel image as `Video N - <Title> - Panel P.jpg`. <One sentence on the film's shape: the grids are 16:9, and the panels and panel images are <vertical 9:16 or horizontal 16:9> frames.>

To make a video's images:

1. Generate the grid and the six panel images one prompt at a time, each with the family reference image attached as a character reference and the prompt pasted whole. Set the image output to 16:9 for the grid and to the film's aspect ratio for each panel image.
2. Check every image against its prompt and against the look check in section 12 of `.agents/rules/character-consistency.md`: each Yeti in its own colour with its own tuft, the baby Yeti about half as tall as a grown-up beside him, nothing worn and nothing on any head, no extra Yeti, the face the prompt names, the framing, angle, and light the prompt names, and every listed character and animal present and no one else. A grid also has six panels, three across and two down, in order, with labels only in the strips above the pictures, and each panel image shows the same picture as its grid panel with no text in it. Regenerate any image that fails, and a grid with one failing panel whole; a wrong image is cheaper to redo than a wrong clip.
3. <Film-specific image checks carried over from the storyboard: which characters and props may appear in which videos, and any image made before the storyboard last changed that has to be regenerated.>
4. If the image model refuses a prompt, the filter causes in the storyboard's agent instructions apply to it too. Change only that prompt's picture and effects text and keep every lock.

To use them in Google Flow, set the output format to the film's aspect ratio, generate the video's clip in ingredients-to-video mode with the video's table from the storyboard pasted as the prompt, and attach one of these:

- Panel route: the six panel images and the family reference image. That is seven images, the most Flow accepts for one clip, and it gives Flow every beat of the clip at full size.
- Grid route: the grid image and the family reference image.

Never attach more than seven images, and never set a grid or a panel image as a start or an end frame. Check the clip against the six panels, each at its timecode.

## Video 1 - <Title>

Film position: 00:00 - 00:10.

Stage: <the storyboard's Stage: line>.

Video prompt: the Video 1 table in `prompts/<slug>-<30s or 60s>-storyboard.md`.

Image: `3x2-timed-storyboard-images/<slug>/Video 1 - <Title>.jpg`.

```
Create image: Horizontal 16:9 aspect ratio, full-frame widescreen composition. <Layout sentence for the film's shape> <Reference sentence> <Quality sentence> <Style lock> Environment: <sentence>. The blue Yeti: <section 2 text with "the face each panel line names" in the slot> The pink Yeti: <section 3 text, same slot> The baby Yeti: <section 4 text, same slot> <Head lock> <Look lock> <Scale lock, if any panel has the baby Yeti and a grown-up Yeti> <Humans: / Animals: / Creatures: sentences, if any> <Avoid line>

Shot 1 · 00:00–00:03 · <Shot Type cell>. Lighting: <Shot 1 Lighting: sentence>. Effects: <Shot 1 effects, frozen>.
Panel 1 · 00:00.0–00:01.5 · <TITLE> · <Opening framing>, <Angle>. <Held picture of beat 1.> Faces: the <colour> Yeti, <row text>.
Panel 2 · 00:01.5–00:03.0 · <TITLE> · <Closing framing>, <Angle>. <Held picture of beat 2.> Faces: ...

Shot 2 · 00:03–00:07 · <Shot Type cell>. Lighting: <Shot 2 Lighting: sentence>. Effects: <Shot 2 effects, frozen>.
Panel 3 · 00:03.0–00:05.0 · ...
Panel 4 · 00:05.0–00:07.0 · ...

Shot 3 · 00:07–00:10 · <Shot Type cell>. Lighting: <Shot 3 Lighting: sentence>. Effects: <Shot 3 effects, frozen>.
Panel 5 · 00:07.0–00:08.5 · ...
Panel 6 · 00:08.5–00:10.0 · ...

<Closing line>
```

### Panel 1 · 00:00.0–00:01.5 · <Framing>, <Angle> · <Title in sentence case>

Image: `3x2-timed-storyboard-images/<slug>/Video 1 - <Title> - Panel 1.jpg`.

```
Create image: <storyboard's aspect ratio line> <Style lock> Environment: <sentence>. Lighting: <Shot 1 Lighting: sentence>. <Character text for each Yeti in panel 1, placed, with its Faces: value in the slot, or: No Yeti is in this image.> <Head lock> <Look lock> <Scale lock, if panel 1 has the baby Yeti and a grown-up Yeti> <Humans: / Animals: / Creatures: sentences, if any> <Avoid line> Action: <Framing>, <Angle> still. <Panel 1's picture as a held instant, and who is not in it.> Effects: <the shot's effects visible at this instant, frozen, if any>. Single still reference image. No text, captions, or watermark.
```

### Panel 2 · 00:01.5–00:03.0 · <Framing>, <Angle> · <Title in sentence case>

...

<Panels 3 to 6 follow in the same pattern, each under its shot's Lighting: sentence.>

## Video 2 - <Title>

...

<The remaining videos follow in the same pattern.>
````
