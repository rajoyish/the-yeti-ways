---
trigger: always_on
description: Enforces exact character design, look, and scale consistency and naming (Papa Yeti, Mama Yeti, Babu Yeti) in all image and video generation prompts, sets the look lock, scale lock, avoid line, and look check taken from the family reference image, and keeps the three Yetis as the heroes of every story.
---

# Character Consistency Rule

When writing or generating prompts for image or video generation in this project, you MUST use the exact character descriptors and style locks provided below. Do not paraphrase or alter these descriptions, as exact wording is required to maintain character consistency across different scenes.

After the aspect ratio line the storyboard skills put first, a prompt carries these fixed pieces in this order: the style lock (section 1), the `Environment:` and `Lighting:` sentences, the character text for each Yeti in the shot (sections 2 to 4), the head lock (section 7), the look lock (section 9), the scale lock when the baby Yeti shares the shot with a grown-up Yeti (section 10), any `Humans:` or `Animals:` sentence (section 6), and the avoid line (section 11). The `Action:` text comes after them. A 3x3 grid prompt, which draws a whole 10-second video as nine panels, holds the same pieces in the order section 13 gives, and each of the nine panel image prompts written under it is a single still in the order above. Section 8 describes what the family looks like, and section 12 says how to check a panel image, a grid, or a clip against it.

## 1. Style Lock (Include in EVERY prompt)
Always append or integrate this exact visual style description:
"3D animated premium shot, high-quality 3D CGI rendering, ultra-realistic soft fur texture, cinematic lighting, soft warm illumination highlighting individual strands of fur."

Each character text has one slot, `[EXPRESSION]`, that is filled per shot from the table in section 5. Everything outside the slot is fixed.

## 2. Papa Yeti (Father / Blue Male Yeti)
When Papa Yeti is in the scene, include this EXACT text:
"a grown-up Yeti entirely covered in thick, fluffy, vibrant sapphire-blue fur with a smooth, slightly matte light-blue face and paws, round fluffy body, large expressive cartoon eyes, dark arched eyebrows, small round nose, [EXPRESSION], and a playful tuft of messy fur on top of his head."

## 3. Mama Yeti (Mother / Pink She-Yeti)
When Mama Yeti is in the scene, include this EXACT text:
"a grown-up Yeti covered in thick, fluffy, vibrant bubblegum-pink fur with a smooth, slightly matte light-pink face and paws, round fluffy body, large expressive cartoon eyes, dark arched eyebrows, small round nose, [EXPRESSION], and a playful tuft of fur swept back on top of her head."

## 4. Babu Yeti (Son / Mint Baby Yeti)
When Babu Yeti is in the scene, include this EXACT text:
"a small baby Yeti covered in thick, fluffy, vibrant mint-green fur with a smooth, slightly matte light-green face and paws, round fluffy body, oversized expressive cartoon eyes, small button nose, [EXPRESSION], and a single curly tuft of fur on top of its head."

These texts name each Yeti's exact colour (sapphire blue, bubblegum pink, mint green), give the face and paws their smooth, matte finish, mark the parents as grown-ups and Babu as small, and give Mama a swept-back tuft so her head reads differently from Papa's. Storyboards and frame files written before these words were added carry the older text ("vibrant blue", "vibrant pink", the same messy tuft on both parents) and have no look lock or avoid line. When a skill works on one of those files, it replaces the character text in every shot, image, and grid with the text above, keeps each `[EXPRESSION]` value as it was, and adds the locks from sections 9 to 11.

## 5. Expression slot (fill it per shot, from this table only)
The Yetis' faces must match the beat. The smile used to be part of the fixed character text, and the model obeyed it: Yetis grinned while a family drifted toward a waterfall, because "wide cheerful toothy smile" in the description outweighed "concern" in the `Action:` sentence. The description wins over the action every time, so the expression now lives in the description.

For every shot, pick the row that matches what the Yeti feels at the end of that shot and paste its text into `[EXPRESSION]`. If the feeling changes during the shot, the `Action:` sentence describes the change and the slot holds the destination. Never write a smile of any kind into a shot whose beat is danger, worry, effort, sadness, or loss. The cheerful smile is the default only for beats that are happy, playful, or proud.

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

The "no smile" words stay in the text. The model's prior for these characters is a grin, and the phrase is what overrides it. If a rendered clip shows a smile on a beat that has none, the slot was filled wrong or the `Action:` sentence contradicts it; fix the prompt and regenerate the clip, along with the grid or panel images it was made with if those images smile too, because a clip copies the faces in its attached images the same way it copies horns.

## 6. The Yetis are the heroes
Papa Yeti, Mama Yeti, and Babu Yeti are the main characters of every story in this project, and they never change: not their names, colours, features, or roles as the family at the centre of the film. Papa Yeti and Mama Yeti are the hero and heroine, and Babu Yeti is the child who notices, tries, and learns. When a story or storyboard comes from somewhere else with its own cast, recast it so the Yetis take the hero roles (the one who notices, the one who acts, the one who helps or rescues) and never the roles of bystanders or the ones in need. Other characters, human or animal, may be added, changed, or invented to fit the context (a human family on a raft, a bird on a branch), but no other character ever takes a hero beat that a Yeti could take, and no other character ever replaces a Yeti. Humans are drawn in the same 3D animated style as the Yetis, with rounded friendly cartoon features and simple in-world clothing, never photoreal and never a likeness of a real person. Each supporting cast gets one locked sentence (`Humans:` or `Animals:`) copied word for word into every prompt.

## 7. Head Lock (Include in EVERY prompt, right after the character text)
The Yetis have no horns. Video models add horns, antlers, or spikes to "Yeti" characters when the prompt leaves the top of the head undescribed, and once a grid panel or a panel image has them, every clip made with that image keeps them. Include this EXACT sentence after the last character description in every prompt:
"Head lock: each Yeti has a smooth, rounded, fully furred head, and the tuft of fur is the only thing on top of it; there are no horns, no antlers, no spikes, no bumps, and no headwear."

## 8. What the family looks like
This section describes the family reference image (section 12), and the locks in this file are written from it. Read it before writing any `Action:` sentence, so the action never asks for something the characters are not. It is guidance for whoever writes the prompts. Only the locked sentences go into a prompt.

- Family: Papa Yeti (blue) and Mama Yeti (pink) are the two grown-ups. Babu Yeti (mint green) is their small child, about half their height. In the reference image he stands between them, and Papa rests his paws on Babu's shoulders to keep him close.
- Style: stylized 3D animated characters with wide, friendly faces and soft, rounded bodies. They are never realistic animals, apes, or monsters, and nothing about them is photoreal except the fur texture.
- Fur: dense, individually rendered strands that make the fur soft, plush, and full. Warm light catches the tips of the strands and lights their edges, which is what the style lock's "soft warm illumination highlighting individual strands of fur" asks for.
- Face and paws: the face, fingers, and toes are smooth and slightly matte, a lighter shade of the fur colour, and they stand out against the fluffy fur around them. No human skin, no pores, no wrinkles.
- Colour: each Yeti is one saturated colour from head to toe. Papa is rich sapphire blue, Mama bright bubblegum pink, and Babu soft mint green. No white belly, no grey patches, no second colour, and no Yeti ever turns up in another Yeti's colour.
- Tufts: the tuft tells the three heads apart at a glance. Papa's is a playful messy tuft, Mama's is swept back, and Babu's is a single curl. Nothing else is on any head (section 7).
- Teeth and paws: teeth, on the beats that show them, are square and white and never pointed. Paws have soft, rounded fingers and toes and no claws.
- Clothing: none. No clothes, hats, scarves, jewellery, bags, or other accessories. A blanket or other prop that a Yeti holds, or that is wrapped around a character for a story beat, is a prop: name it in the `Action:` and keep it off every head.
- Energy: joyful, warm, and affectionate by default, with a calm, innocent kind of magic and never power or mystery, which is also why rule 8 bans cast energy. The `[EXPRESSION]` slot can make a Yeti worried, alarmed, or straining, but never menacing: no snarl, no bared fangs, no glare.

The reference image puts the family in a snowy winter forest at twilight: heavy snow on the ground and the pine branches, soft flakes falling, and warm lanterns hanging in the trees that put a golden rim on the fur against cool violet and blue shadows. Warm light on the fur against cooler surroundings is the house look, and `cinematic-direction.md` keeps it in every `Lighting:` sentence. The forest itself is the reference image's setting, not a default. Each story's `Environment:` sentence sets its own place, and the default stays the rock cave in rule 5.

## 9. Look lock (include in EVERY prompt, right after the head lock)
Image and video models pull a "Yeti" toward what the word usually means: a white, shaggy, ape-like snow monster. They also dress characters who stand in snow in scarves and hats, and they give a creature described by one colour a white belly or a second colour. The character text alone does not stop this. Include this EXACT sentence right after the head lock in every prompt, including prompts for shots with no Yeti in them:
"Look lock: each Yeti is a stylized, friendly 3D animated character with a soft, plush, rounded shape, it wears nothing but its own fur, and that fur is one solid colour from head to toe, with only the face and paws a lighter shade."

## 10. Scale lock (include when the baby Yeti shares the shot with a grown-up Yeti)
Nothing else in a prompt says how big Babu is next to his parents, so a model draws him at any size from a doll to a third grown-up. Include this EXACT sentence right after the look lock in every prompt whose shot has the baby Yeti and at least one grown-up Yeti in it:
"Scale lock: the baby Yeti is about half as tall as each grown-up Yeti in the shot."

Leave it out of every other prompt. A sentence that names a character the shot does not have invites the model to draw that character, which is also why the look lock and the avoid line say "each Yeti" and "any Yeti" rather than naming one. The same goes for every other sentence in a prompt: never size a place or a prop by a Yeti ("a pillar as tall as a grown Yeti") in a sentence that runs in shots where that Yeti is absent. Size it by the world instead ("a squat stone pillar", "a boulder the height of a young pine") or by a character who is in the shot.

## 11. Avoid line (include in EVERY prompt, after the supporting cast sentences and before the `Action:`)
The family reference image came with a list of things a model must not add. The items that concern the characters, and the ones that are wrong for every story in this project, are fixed in one sentence. Include this EXACT sentence after the last `Humans:`, `Animals:`, or `Creatures:` sentence, or straight after the look lock or scale lock when the shot has no supporting cast:
"Avoid: photorealistic humans, scary monsters, horror elements, flat lighting, urban environments, extra Yetis, and, on any Yeti, human skin, visible pores, sharp teeth, sharp claws, white or grey fur, clothing, hats, or accessories."

Skin, clothing, and hats are scoped to the Yetis because supporting humans have skin and wear simple clothing. Four items from the reference list are left out of the line on purpose: harsh daylight, summer settings, dark atmospheres, and gloomy moods. Stories here are set in green valleys and beside waterfalls as well as in snow, and every film goes low-key at its climax, so those words would contradict a story's own `Environment:` and `Lighting:` sentences. A prompt that contradicts itself is where a model starts to improvise. `cinematic-direction.md` handles them instead: the darkest shot of a film keeps a warm rim on the fur and faces the viewer can read, so it is tense without turning gloomy.

## 12. The reference image and the look check
The family reference image is the picture section 8 describes. It and the text locks describe the same three characters, and a model follows a picture more closely than words, so use both.

- Attach the family reference image to every 3x3 grid, panel image, and carousel generation as a character reference, whenever the image tool accepts one. For a panel image or a carousel still with one Yeti in it, that Yeti's own portrait works too.
- The reference image sets how the Yetis look, never what they do. Pose, expression, framing, and light come from the prompt. A panel image, a grid panel, or a carousel still that copies the reference's grins onto a beat that has none, or its lantern-lit forest into a cave, gets regenerated.
- Clips are generated from a text prompt with images attached as references: the video's 3x3 grid or its panel images. No clip starts or ends on a supplied frame. The attached images carry the look into the video, so a clip is only as consistent as the images it is given.

Run the look check on every panel of every grid, every panel image, and every carousel still before it is used, and on every clip before it goes into the edit:

1. Papa is sapphire blue, Mama bubblegum pink, and Babu mint green, each one solid colour from head to toe, with a lighter, smooth, matte face and paws. No white or grey patches, and no Yeti in another Yeti's colour.
2. Papa has the messy tuft, Mama the swept-back tuft, and Babu the single curl, and nothing else is on any head.
3. Babu is about half as tall as any grown-up Yeti beside him.
4. No Yeti wears clothing, a hat, a scarf, or an accessory, and none has sharp teeth, claws, or human-looking skin.
5. Every Yeti has the soft, rounded, stylized cartoon build, not a realistic or ape-like one.
6. The shot has exactly the Yetis its prompt names, each on the side the prompt puts it, and each face matches its `[EXPRESSION]` slot, or, in a grid panel, its `Faces:` list.

An image, a grid, or a clip that fails any item is regenerated, never used. A grid with one failing panel is regenerated whole, because the clip is made with the whole image. Never attach a failing image to a clip generation, because a wrong colour, tuft, or size carries into the clip the same way horns do.

## 13. 3x3 grid prompts
A 3x3 grid prompt, written by the `create-3x3-timed-image` skill, is one image prompt that draws a whole 10-second video as nine panels: one row per shot and one panel per beat of that shot's `Action:`. Section 6 of `cinematic-direction.md` sets the panel map. Every lock binds a grid the same way it binds a single still, with the differences below, because one prompt has to cover nine pictures.

The `[EXPRESSION]` slot in a grid's character text holds this EXACT phrase instead of a row from the section 5 table:
"the face each panel line names"

A face written into the header would sit on all nine panels, the same way the fixed smile once sat on every shot. Each panel line instead ends with a `Faces:` list that gives every Yeti in the panel its row text from the section 5 table, word for word, with "no smile" kept: `Faces: the blue Yeti, worried face with eyebrows drawn together and mouth closed in a tight line, no smile; the baby Yeti, alarmed face with oversized eyes opened wide and mouth open in a small gasp, no smile.` A panel with no Yeti in it says `No Yeti is in this panel.` and has no `Faces:` list.

- The locked sentences appear once, in the grid's header, in this order after the `Create image:` line, the layout sentence, the reference sentence, and the quality sentence: the style lock, the `Environment:` sentence, the character text for each Yeti who appears in any panel, the head lock, the look lock, the scale lock when any panel has the baby Yeti and a grown-up Yeti in it, any `Humans:`, `Animals:`, or `Creatures:` sentence, and the avoid line. Each row then opens with its shot's `Lighting:` sentence, because the light belongs to a shot and a grid holds three.
- Each character text is labelled with the colour the panels use for that Yeti (`The blue Yeti: a grown-up Yeti entirely covered in ...`), because a Yeti's side of the frame changes from panel to panel. A Yeti who is in none of the nine panels gets no character text, for the reason in section 10.

Under each grid, the same file holds nine panel image prompts, one per panel, each drawing that panel's picture as a full single image. A panel image is a single still, not a grid, so it follows the order at the top of this file: the style lock, the `Environment:` sentence, its row's `Lighting:` sentence, the character text for the Yetis in that panel and no other, placed as rule 2 says, the head lock, the look lock, the scale lock only when the panel has the baby Yeti and a grown-up Yeti, the supporting cast sentences, the avoid line, and the `Action:`. Each `[EXPRESSION]` slot holds that Yeti's row text from the panel's `Faces:` list, not the grid phrase. A panel with no Yeti says `No Yeti is in this image.` where the character text would go, and every `Action:` names who is not in the picture. Panel image P shows the same picture, faces, framing, and light as grid panel P, and carries no label text.

Rule 1 still holds: outside the slot, every character text is word for word. Rule 3 holds in its grid form: the panel's picture and its `Faces:` list state the same feeling. The panel lines name each Yeti by colour (rule 11), and the grid's closing line says each panel shows only the characters its line names.

The grid is the one image in this project that carries text: each panel's number, timecode, and title, set in the black strip above the panel and never inside the picture. Every other image, and every clip, carries none. A clip that picks up any of that text is regenerated.

## Rules for Prompt Construction:
1. Never change the fur colors, facial features, body shapes, or sizes described above. The only part of a character text that varies is the `[EXPRESSION]` slot, and it varies only between the rows of the section 5 table.
2. When multiple characters are in a scene, separate their descriptions clearly. (e.g., "On the left, [Papa Yeti's exact text]. On the right, [Mama Yeti's exact text].").
3. Only change their actions, emotions, props, and environments in the prompt. State each emotion twice: once in the `[EXPRESSION]` slot of the character text and once in the `Action:` sentence, and make sure the two agree. An `Action:` line that says "her smile fades into concern" under a character text that still says "wide cheerful toothy smile" produces a smile.
4. For video prompts, strictly exclude dialogue. Rely on background music and sound effects to communicate universally to a global audience.
5. Never use a plain white, solid color, or empty studio background. Always define a contextual environment based on the storyboard using the prefix "Environment:". The default environment, if unspecified, should be a cozy rock cave (e.g., "Environment: A quiet, snow-dusted rock cave retreat").
6. Never put a paw, prop, or other object on or above the top of a Yeti's head in an `Action:` sentence unless the story needs it. Paws folded up beside the head (a sleep mime), raised over the head, or resting on the head are what the model most often turns into horns. Keep mimes at chest height. If the story needs a head touch (a tuft ruffle), say the paw lifts away in the same sentence.
7. If a generated image or clip shows a Yeti with horns, antlers, spikes, or anything on its head besides the fur tuft, regenerate it. Never attach an image that has them to a clip generation.
8. Never write a Yeti casting energy (a dome, wave, beam, burst, pulse, aura, or force field) or changing its own body. Flow's copyright filter ("interests of third-party content providers") reads that as a famous animated film's power-up. Write a magical effect as a change in light or weather near the character, and keep the character text untouched.
9. The Yetis are the heroes of every story. Never cast a non-Yeti as the rescuer, the problem-solver, or the character whose choice resolves the story. When adapting a source that has other characters in those roles, give the roles to Papa Yeti, Mama Yeti, and Babu Yeti and move the source's characters, human or animal, into supporting roles. Never replace, rename, recolour, or drop a main character to fit a source.
10. Copy the look lock, the avoid line, and the scale lock (in shots where it applies) word for word, like the head lock. Never shorten or drop one to save space. They are what hold the look from shot to shot.
11. In an `Action:` sentence, refer to each Yeti by its colour ("the blue Yeti", "the pink Yeti", "the baby Yeti" or "the mint-green baby Yeti"), the same way in every shot, and never by name. A model has no picture for "Papa Yeti", and a name in one shot and a colour in the next can read as two different characters.
12. Write `Action:` sentences that agree with section 8: paws, not hands; fur, not skin; nothing worn; Babu small beside his parents. An `Action:` that has a Yeti pull on a scarf or grip with its claws undoes the locks above it.
