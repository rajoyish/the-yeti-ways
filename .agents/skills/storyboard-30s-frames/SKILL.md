---
name: storyboard-30s-frames
description: >-
  Trigger when the user asks for a 30-second Yeti storyboard with image prompts, still
  frames, or reference frames, says "30s storyboard with frames", "storyboard and image
  prompts", or runs "/storyboard-30s-frames". Takes a short storyboard (a file path or
  pasted markdown) and writes two files: the 30-second storyboard as three 10-second
  Google Flow videos in `prompts/`, and one still-frame image prompt per shot, nine in
  total, in `image-prompts/`.
---

# 30-second storyboard with frames

This skill does everything `storyboard-30s-extender` does, then adds a second deliverable: a still-frame image prompt for each of the nine shots. The video storyboard goes to `prompts/` and the image prompts go to `image-prompts/`. The two directories never mix.

The image prompts exist so the operator can generate a reference still for any shot before or instead of the clip: to check a pose, an expression, or the head lock cheaply, to hand Flow a start image when extend keeps failing (retry 3 in the storyboard's agent instructions), and to pick a thumbnail for the post.

Reference outputs:

- Video storyboard: `prompts/papa-yeti-warm-dome-30s-storyboard.md`.
- Image prompts: `image-prompts/papa-yeti-warm-dome-30s-frames.md`. Match its structure exactly.

## Rules that always apply

Everything in the "Rules that always apply" section of `.agents/skills/storyboard-30s-extender/SKILL.md` applies here, to both files. Read that section and `.agents/rules/character-consistency.md` before writing anything.

Rules specific to the image prompts:

- One frame per shot, nine frames, numbered 1 to 9 in film order. Frame numbers never restart per video. Frame 1 is Video 1 Shot 1, Frame 4 is Video 2 Shot 1, Frame 7 is Video 3 Shot 1.
- A frame shows the last moment of its shot, the state the storyboard describes at the end of the `Action:` text. That is the moment Flow freeze-frames when a clip is extended, so Frame 3 must match the `End frame:` line under Video 1 word for meaning, Frame 6 must match the `End frame:` line under Video 2, and Frame 9 is the closing image of the film.
- Every lock is copied from the matching video shot's visual cell character for character: the aspect ratio line, the style lock, the `Environment:` sentence, the character text with its filled `[EXPRESSION]` slot, the head lock, and the `Humans:` and `Animals:` sentences. The image prompt for a shot and the video prompt for the same shot differ only in the `Action:` text and the closing still-frame line.
- The `Action:` text describes a held image, not a change over time. No "then", no "begins to", no "as the light grows". Present tense, one pose per character, eye lines stated. Where the video `Action:` describes motion, freeze it at its end point and describe what a viewer sees in a single photograph of that instant (a leg lifted mid-stomp, drops of water flung from feathers, a paw pointing up).
- Every `Action:` opens with the shot type and the words "still frame" (`Close-up still frame.`, `Medium two-shot still frame.`, `Wide still frame.`) and the prompt ends with `Single still storyboard frame. No text, captions, or watermark.`
- Absence is stated, never implied. A shot without a Yeti keeps the character text and says `Neither Yeti is in this shot.` (or `No Yeti is in this shot.` to match the storyboard's wording). A shot without some of the supporting cast keeps the `Humans:` and `Animals:` sentences and says which ones are not in the shot. Image models put every described character on screen unless told not to.
- No audio text anywhere in the image prompts. The image file has no audio column and no music.
- The expression slot in a frame is the same value as in the matching video shot. The still shows the face the clip ends on.

## Workflow

### 1. Write the video storyboard

Run steps 1 to 6 of `.agents/skills/storyboard-30s-extender/SKILL.md` in full and save the result to `prompts/<kebab-case-title>-30s-storyboard.md`. Do not start the image prompts until that file passes its own verification checklist, because every frame is copied from it. A frame written against a draft that later changes is wrong.

### 2. Derive the nine frames

For each video table in order, and each row in order, write down:

- Frame number (1 to 9), video number, shot number within the video, the row's timestamp range, and its shot type.
- The full visual cell up to and including the head lock and any `Humans:` or `Animals:` sentence. This is copied, not retyped.
- The end state of the `Action:` text: where each character is, what each paw holds, where each eye line points, which characters and animals are in the shot.
- A short title for the frame, three to six words, naming the image ("The frozen bird", "Paws pressed, first glow", "Final huddle").

For Frames 3 and 6, compare the end state against the `End frame:` line under that video. If they disagree, the storyboard is wrong; fix the storyboard first, then come back.

### 3. Write the image prompts

Each frame is a level-3 heading and one fenced code block holding the prompt as a single paragraph. Group frames under the same `## Video N - <Title>` headings the storyboard uses.

Heading format, with middle dots (`·`) between the parts and an en dash inside the timestamp range:

```
### Frame <N> · Shot <S> (<mm:ss>–<mm:ss>) · <Shot type> · <Short title>
```

Prompt order inside the code block:

1. Aspect ratio lock, word for word.
2. Style lock.
3. `Environment:` sentence.
4. Character text (`Character: ...` or `On the left, ... On the right, ...`), copied from the shot with its expression slot already filled.
5. Head lock.
6. `Humans:` and/or `Animals:` sentence, if the storyboard has them.
7. `Action:` opening with `<Shot type> still frame.` and describing the held image, including who is not in the shot.
8. `Single still storyboard frame. No text, captions, or watermark.`

### 4. Write the frames file

Save to `image-prompts/<kebab-case-title>-30s-frames.md`, using the same kebab-case title as the storyboard file. Create `image-prompts/` if it does not exist. Never save image prompts under `prompts/`, and never save the storyboard under `image-prompts/`.

Use the template below. The intro paragraph names the storyboard file the frames belong to.

### 5. Verify before finishing

Run the storyboard checklist from `storyboard-30s-extender` on the storyboard file, then check every item below on the frames file. Fix and re-check rather than reporting a partial result.

- [ ] Nine frames, headed `### Frame 1` to `### Frame 9` in order, grouped under three `## Video N - <Title>` headings that match the storyboard's headings.
- [ ] Each frame heading carries the shot number within its video, the row's timestamp range, and the row's shot type, all matching the storyboard table.
- [ ] `grep -c "Vertical 9:16" <file>` and `grep -c "Head lock" <file>` both return 9.
- [ ] For each frame, the text from the aspect ratio line through the last lock sentence is identical to the matching visual cell in the storyboard. Diff them, do not eyeball them.
- [ ] Every `Action:` opens with the shot type and "still frame", describes one held instant with no motion words, and states which Yetis, humans, or animals are not in the shot.
- [ ] Every prompt ends with `Single still storyboard frame. No text, captions, or watermark.`
- [ ] Frame 3 matches the `End frame:` line under Video 1 and Frame 6 matches the `End frame:` line under Video 2.
- [ ] No audio text, no timestamps inside a prompt, no "No dialogue." line (there is nothing to speak in a still).
- [ ] Storyboard saved in `prompts/` ending `-30s-storyboard.md`, frames saved in `image-prompts/` ending `-30s-frames.md`, same kebab-case title on both.

## Output template for the frames file

The storyboard file uses the template in `storyboard-30s-extender` unchanged.

````markdown
# <Title> 30s Image Prompts

Still-frame image prompts for `prompts/<kebab-case-title>-30s-storyboard.md`. One frame per shot, nine in total, numbered in film order. Each prompt carries the same aspect ratio line, style lock, environment sentence, character text, head lock, and `Humans:` and `Animals:` sentences as the matching video shot, with the `Action:` rewritten as a single held image. The `[EXPRESSION]` slot in each character text is filled per frame from the table in section 5 of `.agents/rules/character-consistency.md`, matching the feeling the Yeti holds in that frame.

## Video 1 - <Title>

### Frame 1 · Shot 1 (00:00–00:03) · <Shot type> · <Short title>

```
Vertical 9:16 aspect ratio, full-frame vertical composition. <Style lock> Environment: <sentence>. <Character text with expression filled>. Head lock: each Yeti has a smooth, rounded, fully furred head, and the tuft of fur is the only thing on top of it; there are no horns, no antlers, no spikes, no bumps, and no headwear. <Humans: / Animals: sentences if any> Action: <Shot type> still frame. <Held image at the end of the shot, who is not in the shot.> Single still storyboard frame. No text, captions, or watermark.
```

### Frame 2 · Shot 2 (00:03–00:07) · <Shot type> · <Short title>

...

### Frame 3 · Shot 3 (00:07–00:10) · <Shot type> · <Short title>

...

## Video 2 - <Title>

### Frame 4 · Shot 1 (00:00–00:03) · ...
### Frame 5 · Shot 2 (00:03–00:07) · ...
### Frame 6 · Shot 3 (00:07–00:10) · ...

## Video 3 - <Title>

### Frame 7 · Shot 1 (00:00–00:03) · ...
### Frame 8 · Shot 2 (00:03–00:07) · ...
### Frame 9 · Shot 3 (00:07–00:10) · ...
````
