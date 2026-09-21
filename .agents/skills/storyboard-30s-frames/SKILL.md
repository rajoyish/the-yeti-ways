---
name: storyboard-30s-frames
description: >-
  Trigger when the user asks for a Yeti storyboard with image prompts, still frames, or
  reference frames, says "30s storyboard with frames", "storyboard and image prompts",
  "frames for this storyboard", or runs "/storyboard-30s-frames". Takes a short storyboard
  (a file path or pasted markdown), or an existing 30-second or 60-second storyboard in
  `prompts/`, and writes the still-frame image prompts the videos are shot from: five per
  10-second video, fifteen for a 30-second film or thirty for a 60-second one, in
  `image-prompts/`, each opening with `Create image:`. Writes the 30-second storyboard
  first when it does not exist yet.
---

# Storyboard frames

The Yeti videos are shot from stills. Each 10-second Google Flow video is generated from a start image and an end image with the video's table as the motion prompt, so the images have to exist before any clip does. This skill writes the image prompts for those stills: five per video, at 00:00, 00:03, 00:05, 00:07, and 00:10 on the video's own clock. The 00:00 and 00:10 stills are the start and end images Flow is given; the 00:03, 00:05, and 00:07 stills are what the operator checks the clip against, and the fallback start image if a clip has to be re-shot from the middle.

The skill works on a 30-second storyboard from `storyboard-30s-extender` (three videos, fifteen frames) or a 60-second storyboard from `storyboard-60s-from-story` (six videos, thirty frames). Given a short storyboard instead, it writes the 30-second storyboard first. The video storyboard lives in `prompts/` and the image prompts in `image-prompts/`. The two directories never mix.

Every prompt opens with `Create image:` so it can be pasted into an image model as one request with nothing added.

Reference outputs:

- Video storyboards: `prompts/papa-yeti-warm-dome-30s-storyboard.md` and `prompts/babu-yeti-found-sled-60s-storyboard.md`.
- Image prompts: `image-prompts/papa-yeti-warm-dome-30s-frames.md`. It predates the five-frame layout and the `Create image:` prefix, so use it for how one prompt reads (locks copied, `Action:` as a held image, closing line) and this file for the frame count, the timestamps, the heading format, and the prefix.

## Rules that always apply

Everything in the "Rules that always apply" section of `.agents/skills/storyboard-30s-extender/SKILL.md` applies here, to both files. Read that section and `.agents/rules/character-consistency.md` before writing anything. For a 60-second storyboard, the same section of `.agents/skills/storyboard-60s-from-story/SKILL.md` applies as well.

Rules specific to the image prompts:

- Five frames per video, numbered in film order without restarting per video. Video N has Frames 5N-4 to 5N: Frames 1 to 5 are Video 1, 6 to 10 are Video 2, and so on. A 30-second storyboard gives fifteen frames, a 60-second storyboard thirty.
- A frame is an instant on its video's clock, not a shot. The five instants are the same in every video: `00:00`, `00:03`, `00:05`, `00:07`, `00:10`. That is the clip's first and last image, both shot boundaries, and the midpoint of the 4-second middle shot. Each instant belongs to one shot, which is where the frame's locks and shot type come from, and each has one source in the storyboard for what it shows:

  | Frame in video | Instant | Shot | Source in the storyboard |
  | --- | --- | --- | --- |
  | 1st | 00:00 | Shot 1 | The `Start frame:` line under the video's table |
  | 2nd | 00:03 | Shot 1 | The end state of Shot 1's `Action:` text |
  | 3rd | 00:05 | Shot 2 | The `Midpoint frame:` line under the video's table |
  | 4th | 00:07 | Shot 2 | The end state of Shot 2's `Action:` text |
  | 5th | 00:10 | Shot 3 | The `End frame:` line under the video's table |

- The `00:00` frame of every video after the first is the handoff: its `Start frame:` line is a word-for-word copy of the previous video's `End frame:` line, so the frame shows the same instant as the previous video's `00:10` frame, seen through this video's Shot 1 shot type. When the two shot types differ, the two pictures differ in framing only. When they are the same, the two prompts describe the same picture, and that is correct: one is the end image of the clip before, the other is the start image of this clip. A video marked `Scene break:` (60-second storyboards only) is not a handoff; its `00:00` frame shows its own `Start frame:` line.
- The `00:05` frame shows Shot 2 at its midpoint, the picture in the `Midpoint frame:` line, which the storyboard puts at the sentence boundary in Shot 2's `Action:`. In Video 2 of a 30-second film that instant is the Climax peak (film 00:15).
- A storyboard that lacks `Start frame:`, `Midpoint frame:`, or `End frame:` lines (one written before the stills workflow) gets them added first, following step 4 of the extender or step 6 of the 60-second skill, and the frames are derived from those lines. Never derive a frame from a keyframe that exists only in your head; the storyboard is the single source and the operator reads it too.
- Every lock is copied from the frame's shot character for character: the aspect ratio line, the style lock, the `Environment:` sentence, the character text, the head lock, and the `Humans:` and `Animals:` sentences. The image prompt and the video prompt for the same shot differ only in the `Create image:` prefix, the `[EXPRESSION]` slot where the frame's instant calls for a different value (next rule), the `Action:` text, and the closing still-frame line.
- The `[EXPRESSION]` slot holds the feeling the Yeti has at the frame's instant, filled from the section 5 table of `character-consistency.md`. For the end-of-shot frames (`00:03`, `00:07`, `00:10`) that is the value already in the video shot's slot, copied. For a handoff `00:00` frame it is the value in the previous video's Shot 3 slot. For Video 1's `00:00` frame, and for a scene-break `00:00` frame, it is the face the `Start frame:` line names. For the `00:05` frame it is the face the `Midpoint frame:` line names; at a Climax peak that is the peak feeling, which is not the shot's slot value (the slot holds the feeling at the end of the shot). The same rule as everywhere: no smile of any kind on a beat of danger, worry, effort, sadness, or loss.
- The `Action:` text describes a held image, not a change over time. No "then", no "begins to", no "as the light grows". Present tense, one pose per character, eye lines stated. Where the video `Action:` describes motion, freeze it at the frame's instant and describe what a viewer sees in a single photograph of that instant (a leg lifted mid-stomp, drops of water flung from feathers, a paw pointing up).
- Every `Action:` opens with the shot type and the words "still frame" (`Close-up still frame.`, `Medium two-shot still frame.`, `Wide still frame.`) and the prompt ends with `Single still storyboard frame. No text, captions, or watermark.`
- Every prompt opens with `Create image:` followed by a space and the aspect ratio lock on the same line: `Create image: Vertical 9:16 aspect ratio, full-frame vertical composition.` Nothing comes before it and nothing sits between it and the lock.
- Absence is stated, never implied. A shot without a Yeti keeps the character text and says `Neither Yeti is in this shot.` (or `No Yeti is in this shot.` to match the storyboard's wording). A shot without some of the supporting cast keeps the `Humans:` and `Animals:` sentences and says which ones are not in the shot. Image models put every described character on screen unless told not to.
- No audio text anywhere in the image prompts. The image file has no audio column and no music.

## Workflow

### 1. Get the video storyboard

Three cases:

- The input is a short storyboard (a file under `prompts/` without a `-30s-` or `-60s-` suffix, or pasted markdown). Run steps 1 to 6 of `.agents/skills/storyboard-30s-extender/SKILL.md` in full and save the result to `prompts/<kebab-case-title>-30s-storyboard.md`.
- The input is an existing `prompts/<title>-30s-storyboard.md` or `prompts/<title>-60s-storyboard.md`. Run that skill's verification checklist on it. If it predates the stills workflow and lacks the `Frames:`, `Start frame:`, `Midpoint frame:`, or `End frame:` lines, add them following that skill, and tell the user the storyboard was updated.
- The input is a prose story and the user asked for a minute. Run `.agents/skills/storyboard-60s-from-story/SKILL.md` in full first.

Do not start the image prompts until the storyboard passes its own checklist, because every frame is copied from it. A frame written against a draft that later changes is wrong.

### 2. Derive the frames

For each video table in order, walk the five instants `00:00`, `00:03`, `00:05`, `00:07`, `00:10` and write down for each:

- Frame number, video number, the instant on the video's clock, the shot it belongs to (from the table above), that row's timestamp range, and its shot type.
- The full visual cell of that shot up to and including the head lock and any `Humans:` or `Animals:` sentence. This is copied, not retyped.
- The picture at the frame's instant, from its source in the storyboard: where each character is, what each paw holds, where each eye line points, which characters and animals are in the shot.
- The `[EXPRESSION]` value for that instant, following the slot rule above.
- A short title for the frame, three to six words, naming the image ("The frozen bird", "Paws pressed, first glow", "Final huddle").

Confirm that the frame numbers you derived match the `Frames:` line under each video heading. If a keyframe line and the `Action:` text of the shot it falls in disagree, the storyboard is wrong; fix the storyboard first, then come back.

### 3. Write the image prompts

Each frame is a level-3 heading and one fenced code block holding the prompt as a single paragraph. Group frames under the same `## Video N - <Title>` headings the storyboard uses.

Heading format, with middle dots (`·`) between the parts and an en dash inside the shot's timestamp range:

```
### Frame <N> · <mm:ss> · Shot <S> (<mm:ss>–<mm:ss>) · <Shot type> · <Short title>
```

The first `<mm:ss>` is the frame's instant on the video's clock. The range in parentheses is the shot's row in the storyboard table.

Prompt order inside the code block:

1. `Create image:` and the aspect ratio lock, on one line, word for word: `Create image: Vertical 9:16 aspect ratio, full-frame vertical composition.`
2. Style lock.
3. `Environment:` sentence.
4. Character text (`Character: ...` or `On the left, ... On the right, ...`), copied from the shot with the expression slot filled for this frame's instant.
5. Head lock.
6. `Humans:` and/or `Animals:` sentence, if the storyboard has them.
7. `Action:` opening with `<Shot type> still frame.` and describing the held image at the frame's instant, including who is not in the shot.
8. `Single still storyboard frame. No text, captions, or watermark.`

### 4. Write the frames file

Save to `image-prompts/<kebab-case-title>-30s-frames.md` for a 30-second storyboard or `image-prompts/<kebab-case-title>-60s-frames.md` for a 60-second one, using the same kebab-case title as the storyboard file. This is the path the storyboard's `Frames:` lines name; if they name something else, the storyboard is wrong. Create `image-prompts/` if it does not exist. Never save image prompts under `prompts/`, and never save the storyboard under `image-prompts/`.

Use the template below. The intro paragraph names the storyboard file the frames belong to.

### 5. Verify before finishing

Run the storyboard's own checklist on the storyboard file, then check every item below on the frames file. Fix and re-check rather than reporting a partial result. `<count>` below is five times the number of videos: 15 or 30.

- [ ] `<count>` frames, headed `### Frame 1` to `### Frame <count>` in order, five under each `## Video N - <Title>` heading, and the headings match the storyboard's.
- [ ] Within each video the five frame instants are `00:00`, `00:03`, `00:05`, `00:07`, `00:10` in that order, each heading names the shot that instant belongs to (Shot 1, Shot 1, Shot 2, Shot 2, Shot 3), and the shot's timestamp range and shot type match the storyboard table.
- [ ] Each video's frame numbers match the `Frames:` line under its heading in the storyboard, and the file path on that line is this file.
- [ ] `grep -c "^Create image: Vertical 9:16 aspect ratio, full-frame vertical composition\." <file>` and `grep -c "Head lock" <file>` both return `<count>`. No prompt line starts with anything other than `Create image:`.
- [ ] For each frame, the text from the aspect ratio line through the last lock sentence is identical to the matching visual cell in the storyboard, apart from the `[EXPRESSION]` slot on `00:00` and `00:05` frames where the instant calls for a different value. Diff them, do not eyeball them.
- [ ] Every `[EXPRESSION]` value is a row from the section 5 table, matches the feeling at the frame's instant, and agrees with the face described in the `Action:`. End-of-shot frames carry the same value as their video shot. No smile on a beat of danger, worry, effort, sadness, or loss.
- [ ] Every `Action:` opens with the shot type and "still frame", describes one held instant with no motion words, and states which Yetis, humans, or animals are not in the shot.
- [ ] Every prompt ends with `Single still storyboard frame. No text, captions, or watermark.`
- [ ] Every `00:00` frame matches its video's `Start frame:` line, every `00:05` frame its `Midpoint frame:` line, and every `00:10` frame its `End frame:` line. Each handoff pair (the `00:10` frame of one video and the `00:00` frame of the next) shows the same instant, and the `00:00` frame uses its own video's Shot 1 shot type.
- [ ] No audio text, no timestamps inside a prompt, no "No dialogue." line (there is nothing to speak in a still).
- [ ] Storyboard saved in `prompts/` ending `-30s-storyboard.md` or `-60s-storyboard.md`, frames saved in `image-prompts/` with the matching `-30s-frames.md` or `-60s-frames.md` suffix, same kebab-case title on both.

## Output template for the frames file

The storyboard file uses the template of the skill that wrote it, unchanged.

````markdown
# <Title> <30s or 60s> Image Prompts

Still-frame image prompts for `prompts/<kebab-case-title>-<30s or 60s>-storyboard.md`. Five frames per video, <fifteen or thirty> in total, numbered in film order, at 00:00, 00:03, 00:05, 00:07, and 00:10 on each video's own clock. The 00:00 and 00:10 frames of each video are the start image and the end image the video is generated from in Google Flow; the 00:03, 00:05, and 00:07 frames are what the clip is checked against. Each prompt opens with `Create image:` and carries the same aspect ratio line, style lock, environment sentence, character text, head lock, and `Humans:` and `Animals:` sentences as the shot its instant belongs to, with the `Action:` rewritten as a single held image at that instant. The `[EXPRESSION]` slot in each character text is filled per frame from the table in section 5 of `.agents/rules/character-consistency.md`, matching the feeling the Yeti holds at that instant. The 00:00 frame of each video after the first is the handoff from the previous video's end image, seen through the new video's opening shot.

## Video 1 - <Title>

### Frame 1 · 00:00 · Shot 1 (00:00–00:03) · <Shot type> · <Short title>

```
Create image: Vertical 9:16 aspect ratio, full-frame vertical composition. <Style lock> Environment: <sentence>. <Character text with expression filled>. Head lock: each Yeti has a smooth, rounded, fully furred head, and the tuft of fur is the only thing on top of it; there are no horns, no antlers, no spikes, no bumps, and no headwear. <Humans: / Animals: sentences if any> Action: <Shot type> still frame. <Held image at this instant, who is not in the shot.> Single still storyboard frame. No text, captions, or watermark.
```

### Frame 2 · 00:03 · Shot 1 (00:00–00:03) · <Shot type> · <Short title>

...

### Frame 3 · 00:05 · Shot 2 (00:03–00:07) · <Shot type> · <Short title>

...

### Frame 4 · 00:07 · Shot 2 (00:03–00:07) · <Shot type> · <Short title>

...

### Frame 5 · 00:10 · Shot 3 (00:07–00:10) · <Shot type> · <Short title>

...

## Video 2 - <Title>

### Frame 6 · 00:00 · Shot 1 (00:00–00:03) · ...
### Frame 7 · 00:03 · Shot 1 (00:00–00:03) · ...
### Frame 8 · 00:05 · Shot 2 (00:03–00:07) · ...
### Frame 9 · 00:07 · Shot 2 (00:03–00:07) · ...
### Frame 10 · 00:10 · Shot 3 (00:07–00:10) · ...

## Video 3 - <Title>

### Frame 11 · 00:00 · Shot 1 (00:00–00:03) · ...
### Frame 12 · 00:03 · Shot 1 (00:00–00:03) · ...
### Frame 13 · 00:05 · Shot 2 (00:03–00:07) · ...
### Frame 14 · 00:07 · Shot 2 (00:03–00:07) · ...
### Frame 15 · 00:10 · Shot 3 (00:07–00:10) · ...

<For a 60-second storyboard, Videos 4 to 6 follow with Frames 16 to 30 in the same pattern.>
````
