---
trigger: model_decision
description: How every Yeti video prompt and still image prompt is assembled around the character locks in `character-consistency.md`. Sets the style lock, the order of the pieces, where the character locks go and how the Yetis are placed, the Expressions sentence and its table, the avoid line, the supporting cast and heroes rules, the reference image and look check, and the prompt construction rules. Apply when writing or revising files in prompts/, image-prompts/, or carousels/.
paths:
  - "prompts/**"
  - "image-prompts/**"
  - "carousels/**"
---

# Prompt assembly

`character-consistency.md` says what Papa Yeti, Mama Yeti, and Babu Yeti look like, and holds each one's Copy-Ready Google Flow Character Lock. This file says how those locks, and everything around them, are put together into a prompt. `cinematic-direction.md` sets the terms for the direction inside a prompt (framing, light, camera, effects, sound) and the pipeline. All three files bind. Where they disagree about a character's look, `character-consistency.md` wins.

The checkers in the skills (`check_grid.mjs`, `check_locks.py`) read the style lock and the avoid line from the quoted lines in sections 1 and 5, the expressions from the table in section 4, and the character locks from the `text` blocks in `character-consistency.md`, each time they run. Change a locked sentence in its own file and nowhere else.

`character-consistency.md` is the default and the only source of character locks. `character-consistency-alt.md`, in the same folder, is an alternate draft kept for reference; use it only when the user asks for it by name. Its locks open with `Character identity lock — <Name>:` rather than `<Name>: `, so the checkers do not recognise them, and a film is never built from a mix of the two files. To make the alternate the default, the user swaps the two files' contents and changes each alternate lock to open with `<Name>: `.

## 1. Style lock (in every prompt)

The render style of the whole project. It opens every prompt, straight after the aspect ratio line:
"3D animated premium shot, high-quality 3D CGI rendering, ultra-realistic soft fur texture, cinematic lighting, soft warm illumination highlighting individual strands of fur."

## 2. The order of the pieces

A video prompt is one 10-second video: its `Character locks:` block and its table, pasted together as one Flow prompt. Each row's visual cell holds, in this order:

1. The aspect ratio line.
2. The style lock.
3. The `Environment:` sentence.
4. The `Lighting:` sentence.
5. The `Characters:` sentence, or `No Yeti is in this shot.` (section 3).
6. The `Expressions:` sentence (section 4), left out when the shot has no Yeti.
7. The `Humans:`, `Animals:`, or `Creatures:` sentences, if the story has a supporting cast (section 6).
8. The avoid line (section 5).
9. `Action:`, then `Camera:`, as the storyboard skills and `cinematic-direction.md` set out.

A still prompt (a panel image or a carousel still) is one image, so it carries the character locks inline. In this order:

1. `Create image:` and the aspect ratio line.
2. The style lock.
3. The `Environment:` sentence.
4. The `Lighting:` sentence.
5. The full character lock of each Yeti in the picture, placed (section 3), or `No Yeti is in this image.`
6. The `Expressions:` sentence, left out when the picture has no Yeti.
7. The `Humans:`, `Animals:`, or `Creatures:` sentences, if any.
8. The avoid line.
9. `Action:`, `Effects:`, and the skill's closing sentence.

## 3. Character locks in a prompt

Each character lock is the `text` block under "Copy-Ready Google Flow Character Lock" in `character-consistency.md`, copied whole and character for character. It opens with the character's name (`Papa Yeti: `, `Mama Yeti: `, `Babu Yeti: `), and that name is how every other sentence in the prompt refers to the character. Never shorten, paraphrase, or merge a lock, never write a Yeti's look in any other words, and never add a smile, a pose, or a scene detail to it.

**Video prompts.** Each video has one `Character locks:` block, a fenced code block directly above its table, holding the full lock of every Yeti who appears anywhere in that video's six beats, one lock per paragraph, in the order Papa Yeti, Mama Yeti, Babu Yeti. A Yeti who is in none of the video's shots gets no lock there. The operator pastes the block and the table together, block first, as one prompt. The locks run hundreds of words each, so they go in once per prompt rather than in every row.

Each row then says which of those Yetis are in its shot, and where, in a `Characters:` sentence, left to right:

- One Yeti: `Characters: Babu Yeti.`
- Two: `Characters: Papa Yeti on the left and Babu Yeti on the right.`
- Three: `Characters: Papa Yeti on the left, Babu Yeti in the center, and Mama Yeti on the right.`
- None: `No Yeti is in this shot.`

Keep each Yeti on the same side in every shot unless the action moves them, and if it moves them, keep them there for every later shot.

**Still prompts.** The lock goes inline, placed by where the Yeti sits in the picture:

- One Yeti: the lock alone.
- Two: `On the left, <lock> On the right, <lock>`.
- Three: `On the left, <lock> In the center, <lock> On the right, <lock>`.
- None: `No Yeti is in this image.`

Only a Yeti who is in the picture gets a lock. A lock for an absent Yeti puts that Yeti on screen.

## 4. Expressions (in every prompt with a Yeti)

The faces live in their own sentence, never inside a lock. A face written into a character description outweighs anything the `Action:` says: when the description carried a fixed "wide cheerful toothy smile", the Yetis grinned while a family drifted toward a waterfall. So the locks describe no expression, and each prompt states the face of every Yeti in it in an `Expressions:` sentence, straight after the locks (a still) or the `Characters:` sentence (a video row):

```
Expressions: Papa Yeti, worried face with eyebrows drawn together and mouth closed in a tight line, no smile; Babu Yeti, alarmed face with oversized eyes opened wide and mouth open in a small gasp, no smile.
```

The Yetis appear in the same order as in the `Characters:` sentence or the placed locks, each as `<Name>, <row>`, separated by semicolons, with one full stop at the end. Every face is a row from this table, copied exactly. Papa Yeti and Mama Yeti take the grown-up column, and Babu Yeti the baby column.

| Beat | Papa Yeti and Mama Yeti | Babu Yeti |
| --- | --- | --- |
| Happy, playful, proud | wide cheerful toothy smile with square white teeth | cute playful smile |
| Relieved | relieved soft smile with square white teeth showing and eyebrows relaxed | relieved soft smile with eyes relaxed |
| Tender, comforting | gentle closed-mouth smile with soft, warm eyes | gentle closed-mouth smile with soft eyes |
| Worried | worried face with eyebrows drawn together and mouth closed in a tight line, no smile | worried face with a small frown and mouth closed in a tight line, no smile |
| Alarmed, startled | alarmed face with eyebrows raised high, eyes opened wide, and mouth open in a small gasp, no smile | alarmed face with oversized eyes opened wide and mouth open in a small gasp, no smile |
| Determined, focused | determined face with eyebrows lowered, eyes narrowed, and mouth pressed shut, no smile | determined face with a small furrowed brow and mouth pressed shut, no smile |
| Straining, effort | straining face with eyebrows lowered and square white teeth clenched in a grimace, no smile | straining face with a furrowed brow and mouth pulled into a grimace, no smile |
| Sad, sorry | sad face with eyebrows tilted up at the inner ends and mouth turned down, no smile | sad face with mouth turned down and eyes glistening, no smile |
| Curious, thinking | curious face with one eyebrow raised and mouth closed, no smile | curious face with head tilted and mouth closed in a small pout, no smile |

Pick the row that matches what the Yeti feels at the end of the shot (a video row) or at the picture's instant (a still). If the feeling changes during a shot, the `Action:` describes the change and the `Expressions:` sentence holds the destination. Never put a smile of any kind on a beat of danger, worry, effort, sadness, or loss; the cheerful smile is for beats that are happy, playful, or proud. The "no smile" words stay in the text, because the model's prior for these characters is a grin and the phrase is what overrides it. State each feeling twice, in the `Expressions:` sentence and in the `Action:`, and make the two agree.

An expression moves the face, never the design. It moves only the eyebrows, eyelids, cheeks, and mouth; the face shape, eye size and spacing, muzzle width, nose, jaw, and teeth stay the ones the lock describes. So never write a face that needs the design to change: no squashed or stretched face, no eyes shrunk to slits or grown larger than the lock gives them, no jaw dropped out of shape.

## 5. Avoid line (in every prompt)

Scene-level items that are wrong for every story in this project, and the Yeti items the model most often adds. It goes after the supporting cast sentences, or straight after the `Expressions:` sentence (or the no-Yeti sentence) when there are none:
"Avoid: photorealistic humans, scary monsters, horror elements, flat lighting, urban environments, extra Yetis, and, on any Yeti, human skin, visible pores, sharp teeth, sharp claws, white or grey fur, clothing, hats, or accessories."

Skin, clothing, and hats are scoped to the Yetis because supporting humans have skin and wear simple clothing. Harsh daylight, summer settings, dark atmospheres, and gloomy moods are left out on purpose: stories here are set in green valleys and beside waterfalls as well as in snow, and every film goes low-key at its climax, so those words would contradict a story's own `Environment:` and `Lighting:` sentences. `cinematic-direction.md` handles them instead.

## 6. The Yetis are the heroes, and the supporting cast

Papa Yeti, Mama Yeti, and Babu Yeti are the main characters of every story in this project: not their names, looks, or roles as the family at the centre of the film ever change. Papa Yeti and Mama Yeti are the hero and heroine, and Babu Yeti is the child who notices, tries, and learns. When a story comes from somewhere else with its own cast, recast it so the Yetis take the hero roles (the one who notices, the one who acts, the one who helps or rescues) and never the roles of bystanders or the ones in need. Other characters, human or animal, may be added, changed, or invented to fit the context, but none ever takes a hero beat a Yeti could take, and none ever replaces a Yeti.

Humans are drawn in the same 3D animated style as the Yetis, with rounded, friendly cartoon features and simple in-world clothing, never photoreal and never a likeness of a real person. A human child stays with an adult, never enters water, never falls, and is never alone in danger. Each supporting cast gets one locked sentence (`Humans:`, `Animals:`, or `Creatures:`) that describes every member of it, is copied word for word into every prompt of the film, and says "exactly" with the number of any group.

## 7. The family reference image and the look check

The family reference image shows the three Yetis together. It and the character locks describe the same three characters, and a model follows a picture more closely than words, so use both.

- Attach the family reference image to every panel image and carousel still generation as a character reference, whenever the image tool accepts one. For an image with one Yeti in it, that Yeti's own full-body portrait, generated from `prompts/<papa, mama, or babu>-yeti-full-body-portrait.md`, works too.
- The reference image sets how the Yetis look, never what they do. Pose, expression, framing, and light come from the prompt. An image that copies the reference's grins onto a beat that has none, or picks up a lantern or light source its `Environment:` sentence does not name, gets regenerated.
- Clips are generated from a text prompt with images attached as references, never as a start or an end frame. A clip is only as consistent as the images it is given.

Run the look check on every panel image and carousel still before it is used, and on every clip before it goes into the edit. It is the Final Consistency Checklist in `character-consistency.md`, plus:

1. Each face matches its `Expressions:` sentence.
2. The picture has exactly the Yetis its prompt names, each on the side the prompt puts it.
3. Every supporting character the prompt names is there, in the number it gives, and looks like its `Humans:` or `Animals:` sentence, and no one the prompt does not name is there.

An image or a clip that fails is regenerated, never used, and never attached to a later generation, because a wrong colour, tuft, size, or face carries into everything made from it.

## 8. Prompt construction rules

1. Copy every locked piece (the aspect ratio line, the style lock, each character lock, the `Environment:` and `Lighting:` sentences, the supporting cast sentences, the avoid line) word for word. Never shorten or drop one to save space.
2. Refer to each Yeti by name ("Papa Yeti", "Mama Yeti", "Babu Yeti") in the `Characters:`, `Expressions:`, and `Action:` text, the same way in every shot, never by colour or a nickname. The lock that opens with that name is what gives it a picture. Name each Yeti in every beat it is in, and say where it is.
3. State absence. An `Action:` names every Yeti and supporting character from the story who is not in the shot or the picture, as `<Name> is not in the shot.` or `<Name> is not in the picture.`, because a model draws every character a prompt describes unless told not to. Give the number of any group of animals or people.
4. Write `Action:` sentences that agree with the locks: paws, not hands; fur, not skin; nothing worn; Babu Yeti about half as tall as a grown-up Yeti beside him. An `Action:` that has a Yeti pull on a scarf or grip with its claws undoes the lock. Never write an action that changes a Yeti's design (a body that stretches, squashes, grows, or shrinks), and keep the three apart even in a hug or a huddle: each Yeti's own face, tuft, and paws stay visible and separate, never merged into one shape.
5. Never put a paw, prop, or other object on or above a Yeti's head unless the story needs it. Paws folded up beside the head (a sleep mime), raised overhead, or resting on the head are what the model most often turns into horns. Keep mimes at chest height, and when the story needs a head touch (a tuft ruffle), say the paw lifts away in the same sentence. An image or clip with horns, antlers, spikes, or anything on a Yeti's head besides its tuft is regenerated.
6. Never size a place or a prop by a Yeti ("a pillar as tall as a grown Yeti") in a sentence that runs in shots where that Yeti is absent. Size it by the world ("a squat stone pillar", "a boulder the height of a young pine") or by a character who is in the shot.
7. Never write a Yeti casting energy (a dome, wave, beam, burst, pulse, aura, or force field) or changing its own body. Flow's copyright filter ("interests of third-party content providers") reads that as a famous animated film's power-up. Write a magical effect as a change in light or weather near the character.
8. No dialogue in a video prompt. The audio is background music and sound effects, so the film works for a global audience.
9. Never a plain white, solid colour, or empty studio background. Every prompt has an `Environment:` sentence. The default, when a story sets none, is a quiet, snow-dusted rock cave.
10. No quality words that fight the style lock: "photorealistic", "hyperreal", "8K", or a named render engine, studio, film, or look.

## 9. Revising an older prompt file

Storyboards, 3x2 files, frames files, and carousels written before the character locks carry the older pieces: a short character text with an `[EXPRESSION]` slot ("a grown-up Yeti entirely covered in thick, fluffy, vibrant sapphire-blue fur ... [EXPRESSION], and a playful tuft of messy fur on top of his head", or the even older "vibrant blue fur"), placed as `Character: ...` or `On the left, ... On the right, ...`, followed by a `Head lock:`, a `Look lock:`, and sometimes a `Scale lock:` sentence, and `Action:` text that names the Yetis by colour. When a skill works on one of those files, it brings it up to this file's format first, without changing a story beat, a light, a framing, or a face:

1. Take each Yeti's face from its old `[EXPRESSION]` slot, and write it into an `Expressions:` sentence (section 4).
2. Replace the old character text with the placement form of section 3: a `Characters:` sentence in a video row (and the video's `Character locks:` block above its table), or the placed full locks in a still.
3. Delete the `Head lock:`, `Look lock:`, and `Scale lock:` sentences. The character locks carry all three.
4. Rename the Yetis in `Characters:` and `Action:` text: "the blue Yeti" is Papa Yeti, "the pink Yeti" Mama Yeti, and "the baby Yeti" or "the mint-green baby Yeti" Babu Yeti.
5. Keep the aspect ratio line, the style lock, the `Environment:` and `Lighting:` sentences, the supporting cast sentences, and the avoid line as they are.

Any image generated from the old prompt stays valid only if it passes the look check against the current locks; otherwise it is regenerated from the revised prompt.
