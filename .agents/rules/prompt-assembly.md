---
trigger: model_decision
description: How every Yeti video prompt and still image prompt is assembled. Video prompts call the saved Flow Characters by `@` name and never describe the Yetis; still image prompts carry the character locks from `character-consistency.md`. Sets the style lock, the order of the pieces, where the character locks go and how the Yetis are placed, the Expressions sentence and its table, the avoid line, the main characters and story cast rules, the reference image and look check, the prompt construction rules, and the originality rules that keep prompts clear of Flow's copyright filter. Apply when writing or revising files in prompts/, image-prompts/, or carousels/.
paths:
  - "prompts/**"
  - "image-prompts/**"
  - "carousels/**"
---

# Prompt assembly

`character-consistency.md` says what Papa Yeti, Mama Yeti, and Babu Yeti look like, and holds each one's Copy-Ready Google Flow Character Lock. This file says how a prompt is put together. The Yetis are saved Google Flow Characters (`google-flow.md`, section 2), so a video prompt calls them by `@` name and never describes them; only a still image prompt, made by an image model that has no saved Character, carries the locks. `cinematic-direction.md` sets the terms for the direction inside a prompt (framing, light, camera, effects, sound) and the pipeline. All three files bind. Where they disagree about a character's look, `character-consistency.md` wins.

The checkers in the skills (`check_grid.mjs`, `check_locks.py`) read the style lock and the avoid line from the quoted lines in sections 1 and 5, the expressions from the table in section 4, and the character locks from the `text` blocks in `character-consistency.md`, each time they run. Change a locked sentence in its own file and nowhere else.

`character-consistency.md` is the default and the only source of character locks. `character-consistency-alt.md`, in the same folder, is an alternate draft kept for reference; use it only when the user asks for it by name. Its locks open with `Character identity lock — <Name>:` rather than `<Name>: `, so the checkers do not recognise them, and a film is never built from a mix of the two files. To make the alternate the default, the user swaps the two files' contents and changes each alternate lock to open with `<Name>: `.

## 1. Style lock (in every prompt)

The render style of the whole project. It opens every prompt, straight after the aspect ratio line:
"3D animated premium shot, high-quality 3D CGI rendering, ultra-realistic soft fur texture, cinematic lighting, soft warm illumination highlighting individual strands of fur."

## 2. The order of the pieces

A video is one 10-second clip. Its table is the master the panel images and checks are built from, and the compact `Agent prompt:` block under it (section 6 of `google-flow.md`) is what Flow receives. Neither carries a character lock or describes a Yeti's look: the saved Characters do. Each row's visual cell holds, in this order:

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

**Video prompts.** A storyboard carries no character lock and no description of a Yeti's look: no `Character locks:` block, and no fur, colour, tuft, face, or build in any cell or Agent prompt. Each Yeti is a saved Flow Character, called `@Papa Yeti`, `@Mama Yeti`, or `@Babu Yeti` once, in the Agent prompt's `Cast:` line, and by plain name after that, and the Character carries the look. A second description in the prompt competes with the Character and makes it drift.

Each row says which Yetis are in its shot, and where, in a `Characters:` sentence, left to right:

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

Only a Yeti who is in the picture gets a lock. A lock for an absent Yeti puts that Yeti on screen. The image skills take the locks straight from `character-consistency.md`, never from a storyboard.

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
"Avoid: photorealistic humans, scary monsters, horror elements, flat lighting, extra Yetis, and, on any Yeti, human skin, visible pores, sharp teeth, sharp claws, hands with three or four fingers, animal paws, white or grey fur, clothing, hats, or accessories."

Skin, clothing, and hats are scoped to the Yetis because supporting humans have skin and wear simple clothing. Settings, eras, weather, and moods are left out on purpose. Every story picks its own world (a snowy ridge, a bamboo forest, a riverside market, a village street, a city rooftop), so the avoid line names only what is wrong in every story: off-model Yetis, photoreal people, and horror. A story that needs to rule out something of its own (a crowd, a vehicle, a second animal) says so in its `Action:` text, never by editing this line.

## 6. The main characters and the story cast

Two things are fixed in every story, and everything else is the story's to decide.

Fixed:

- Papa Yeti, Mama Yeti, and Babu Yeti are the main characters. Their locks, names, and family relationship never change, and no one replaces, renames, or merges them. They are the only Yetis that ever appear.
- The film is about them. The camera stays with at least one of them, and the story's main emotional turn (the choice, the discovery, the lesson, the reunion) belongs to at least one of them.

Decided by each story: the genre, the setting, the era, the tone, the plot, the music, the sound, and who does what. A Yeti can be the rescuer or the one rescued, the teacher or the student, the one who solves the problem or the one who causes it. The story cast (humans, animals, or invented creatures) can hold any role the story needs: a mentor who teaches Babu Yeti, a guide who leads the family, a rival, a friend, a stranger who helps, a character the Yetis help. A source story or video is adapted, not forced into one shape: keep its cast and roles when they work, and recast them only where the story is stronger for it.

Humans in the story cast:

- Drawn in the same stylized 3D animated style as the Yetis, with original designs, rounded, expressive cartoon features, and stylized proportions. Never photoreal, never the likeness of a real person, celebrity, or named group, and never the design of an existing film or game character (section 10).
- Dressed for the story's world and era: an old teacher's plain wrapped robe and cloth sash, a fisher's oilskin coat, a cook's apron, a climber's padded jacket, a city courier's hooded top. No logos, brand marks, or writing on any clothing or prop.
- A human child stays with an adult, never enters water, never falls, and is never alone in danger. The safety filter reads a child in peril as harm, so write worry, not terror.

Each story cast gets one locked sentence per kind (`Humans:`, `Animals:`, or `Creatures:`), written once for the film and copied word for word into every prompt. It gives each member a short handle that the `Action:` text uses every time ("the old mountain teacher", "the red fox"), describes each one's look from head to toe, and says "exactly" with the number of any group. A character who leaves the story partway is still in the sentence, and the `Action:` says when they are not in the shot (section 8, rule 3).

A story cast member saved as a Flow Character (built with `flow-character-builder`, its file in `prompts/characters/`) is not described in a storyboard: its sentence only names and places it, by its Character name, in the form `Animals: Nuri Bear on the left and Pip Penguin on the right, exactly as their saved Characters.`, plus any height it needs beside a Yeti, and the `Action:` text uses that name. The full cast sentence from its file is used only in still image prompts, where no saved Character is attached.

## 7. The family reference image and the look check

The family reference image shows the three Yetis together. It and the character locks describe the same three characters, and a model follows a picture more closely than words, so use both.

- Attach the family reference image to every panel image and carousel still generation as a character reference, whenever the image tool accepts one. Better still, attach the canonical portrait of each Yeti in the image (`references/characters/papa-yeti.png`, `mama-yeti.png`, `babu-yeti.png`, listed in `character-consistency.md`): they are the definitive look, and the locks describe them exactly. Never attach a portrait for a Yeti who is not in the image. When Babu Yeti shares the picture with a grown-up, also attach the family height chart (`references/characters/family-height-chart.png`), because each portrait shows its Yeti filling the frame and says nothing about size. The portraits are set in an ice cave, so the prompt's `Environment:` sentence, not the portrait, sets the background.
- The reference image sets how the Yetis look, never what they do. Pose, expression, framing, and light come from the prompt. An image that copies the reference's grins onto a beat that has none, or picks up a lantern or light source its `Environment:` sentence does not name, gets regenerated.
- Clips are generated from the Agent prompt with the saved Characters and a few clean images attached as ingredients (`google-flow.md`, section 4). A generated panel image is never a clip's start or end frame; only a frame saved from the previous approved clip opens the next one. A clip is only as consistent as the images it is given.

Run the look check on every panel image and carousel still before it is used, and on every clip before it goes into the edit. It is the Final Consistency Checklist in `character-consistency.md`, plus:

1. Each face matches its `Expressions:` sentence.
2. The picture has exactly the Yetis its prompt names, each on the side the prompt puts it.
3. Every supporting character the prompt names is there, in the number it gives, and looks like its `Humans:` or `Animals:` sentence, and no one the prompt does not name is there.

An image or a clip that fails is regenerated, never used, and never attached to a later generation, because a wrong colour, tuft, size, or face carries into everything made from it.

## 8. Prompt construction rules

1. Copy every locked piece (the aspect ratio line, the style lock, each character lock in a still, the `Environment:` and `Lighting:` sentences, the supporting cast sentences, the avoid line) word for word. Never shorten or drop one to save space.
2. Refer to each Yeti by name ("Papa Yeti", "Mama Yeti", "Babu Yeti") in the `Characters:`, `Expressions:`, and `Action:` text, the same way in every shot, never by colour or a nickname, and as `@Papa Yeti`, `@Mama Yeti`, `@Babu Yeti` once, in an Agent prompt's `Cast:` line, with the plain name after that. In a still, the lock that opens with that name gives it a picture; in a clip, the saved Character does. Name each Yeti in every beat it is in, and say where it is.
3. State absence. An `Action:` names every Yeti and supporting character from the story who is not in the shot or the picture, as `<Name> is not in the shot.` or `<Name> is not in the picture.`, because a model draws every character a prompt describes unless told not to. Give the number of any group of animals or people.
4. Write `Action:` sentences that agree with the locks: hands and feet, never paws, and wherever a Yeti's hand does something visible (waves, claps, grips, points, holds, presses), it is a "five-fingered hand", because image and video models default to three or four cartoon fingers unless the number is in the sentence that shows the hand; fur, not skin; nothing worn; Babu Yeti about half as tall as a grown-up Yeti beside him, with the top of his curl only at the grown-up's belly. An `Action:` that has a Yeti pull on a scarf or grip with its claws undoes the lock. Never write an action that changes a Yeti's design (a body that stretches, squashes, grows, or shrinks), and keep the three apart even in a hug or a huddle: each Yeti's own face, tuft, and hands stay visible and separate, never merged into one shape.
5. Never put a hand, prop, or other object on or above a Yeti's head unless the story needs it. Hands folded up beside the head (a sleep mime), raised overhead, or resting on the head are what the model most often turns into horns. Keep mimes at chest height, and when the story needs a head touch (a tuft ruffle), say the hand lifts away in the same sentence. An image or clip with horns, antlers, spikes, or anything on a Yeti's head besides its tuft is regenerated.
6. Never size a place or a prop by a Yeti ("a pillar as tall as a grown Yeti") in a sentence that runs in shots where that Yeti is absent. Size it by the world ("a squat stone pillar", "a boulder the height of a young pine") or by a character who is in the shot.
7. Never change a Yeti's own body (a glow from inside the fur, a transformation, a growth spurt), because the locks forbid it. Magic and wonder are welcome when they come from the world or a prop (section 10, rule 4), and the one known copyright trigger, a Yeti sending out a dome or wave of energy that reshapes the land, is never written.
8. No dialogue in a video prompt. The audio is background music and sound effects, so the film works for a global audience.
9. Never a plain white, solid colour, or empty studio background. Every prompt has an `Environment:` sentence. Each location in the story has its own `Environment:` sentence. Only when a story names no place at all, the fallback is a quiet, snow-dusted rock cave.
10. No quality words that fight the style lock: "photorealistic", "hyperreal", "8K", or a named render engine, studio, film, or look.
11. Run the originality pass in section 10 on every prompt before it goes to Flow.

## 9. Revising an older prompt file

Storyboards, 3x2 files, frames files, and carousels written before the character locks carry the older pieces: a short character text with an `[EXPRESSION]` slot ("a grown-up Yeti entirely covered in thick, fluffy, vibrant sapphire-blue fur ... [EXPRESSION], and a playful tuft of messy fur on top of his head", or the even older "vibrant blue fur"), placed as `Character: ...` or `On the left, ... On the right, ...`, followed by a `Head lock:`, a `Look lock:`, and sometimes a `Scale lock:` sentence, and `Action:` text that names the Yetis by colour. When a skill works on one of those files, it brings it up to this file's format first, without changing a story beat, a light, a framing, or a face:

1. Take each Yeti's face from its old `[EXPRESSION]` slot, and write it into an `Expressions:` sentence (section 4).
2. Replace the old character text with the placement form of section 3: a `Characters:` sentence in a video row, or the placed full locks in a still. Delete any `Character locks:` block above a storyboard table, and replace each Flow tag in a `Flow prompt:` block (`@Papa Yeti (the father: ...)`) with the bare `@` name.
3. Delete the `Head lock:`, `Look lock:`, and `Scale lock:` sentences. The character locks carry all three.
4. Rename the Yetis in `Characters:` and `Action:` text: "the blue Yeti" is Papa Yeti, "the pink Yeti" Mama Yeti, and "the baby Yeti" or "the mint-green baby Yeti" Babu Yeti.
5. Keep the aspect ratio line, the style lock, the `Environment:` and `Lighting:` sentences, the supporting cast sentences, and the avoid line as they are.

Any image generated from the old prompt stays valid only if it passes the look check against the current locks; otherwise it is regenerated from the revised prompt.

## 10. Originality and Flow's copyright filter

Papa Yeti, Mama Yeti, and Babu Yeti are original characters, and every story in this project is its own. Flow's copyright filter does not object to genres, tropes, or ideas: a training montage, a mentor's gift, a rescue at a waterfall, a chase through a market, magic in a forest are nobody's property. It refuses with "I can't generate the video you requested right now due to interests of third-party content providers" when a prompt names protected work, or when the picture it asks for is close enough to a specific protected character or scene to read as a copy. So write freely, and run this originality pass on every storyboard, panel image prompt, and still before it goes to Flow.

1. Names. No franchise, film, show, game, character, studio, director, actor, song, composer, band, artist, or brand, and no "in the style of", "-style", "inspired by", "like the scene in", or named art style or colour grade. Real-world practices, places, and traditions are not protected and may be named (kung fu, taekwondo, a Himalayan prayer-flag bridge, a Nepali village festival), but franchise phrases and character titles may not ("dragon warrior", "chosen one", "the force").
2. Designs. A story cast member may play a familiar role, but never with that role's famous design. Invent each design from scratch: species, age, build, clothing, colour, and one distinctive detail of your own. An old teacher is fine; a small elderly tortoise with a wooden staff on a peach-tree hill, or a robed raccoon-like master on a jade palace step, is a copy. Only humans, real-world animals, and creatures you invented are used, never a recognisable existing creature or mascot.
3. Signature moments. A famous scene is recognised by the combination of its setting, its key prop, its key action, and its framing. When a beat sits close to a scene you recognise from a well-known film, change at least two of the four (move the setting, swap the prop, change the action, reframe it). This matters most for storyboards adapted from an existing video by `video-to-storyboard`: the source is a guide to pace and energy, and the Yeti version makes its own choices.
4. Magic and power. Magic is welcome when it has a source in the world or in a prop: a leaf that catches the sunset and glows, a lantern that brightens, warm spring water that melts the frost, light breaking through cloud, fireflies gathering. Never write a Yeti emitting a dome, wave, beam, blast, pulse, aura, or force field from its body, and never a superhero power-up pose with energy gathering around a character. A Yeti whose humming or pressed hands send out light that reshapes the landscape is the plot device of a major animated Yeti film, and the filter matches it even with nothing named.
5. Music and sound. Describe music by genre, mood, tempo, energy, and instruments ("driving taiko drums and bamboo flute, fast and bold", "warm strings and a soft piano, slow and tender"). Never a named song, tune, composer, artist, soundtrack, or "theme", never lyrics or sung words, and never "a famous melody". Wordless vocal textures (a hummed line, a wordless choir swell, a breathy chant without words) are allowed; if a clip with one is refused, drop it first.
6. Plain description. Describe what the viewer sees and hears in plain physical terms: who moves where, what they hold, what the light does. Loaded shorthand ("an epic hero shot", "a legendary master", "a magical power") invites the model to fill the gap from famous films.

When a clip is refused anyway, the storyboard skills hold the recovery steps: hand the refused prompt to Flow's agent, which can see what the filter matched, then work through the retry list, and record the trigger in the storyboard's agent instructions so the next story avoids it. A recorded trigger is a note about one story's wording, not a new ban for every story.

