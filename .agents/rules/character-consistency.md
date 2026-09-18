---
trigger: always_on
description: Enforces exact character design consistency and naming (Papa Yeti, Mama Yeti, Babu Yeti) in all image and video generation prompts, and keeps the three Yetis as the heroes of every story.
---

# Character Consistency Rule

When writing or generating prompts for image or video generation in this project, you MUST use the exact character descriptors and style locks provided below. Do not paraphrase or alter these descriptions, as exact wording is required to maintain character consistency across different scenes.

## 1. Style Lock (Include in EVERY prompt)
Always append or integrate this exact visual style description:
"3D animated premium shot, high-quality 3D CGI rendering, ultra-realistic soft fur texture, cinematic lighting, soft warm illumination highlighting individual strands of fur."

Each character text has one slot, `[EXPRESSION]`, that is filled per shot from the table in section 5. Everything outside the slot is fixed.

## 2. Papa Yeti (Father / Blue Male Yeti)
When Papa Yeti is in the scene, include this EXACT text:
"a Yeti entirely covered in thick, fluffy, vibrant blue fur with a light-blue face and paws, round fluffy body, large expressive cartoon eyes, dark arched eyebrows, small round nose, [EXPRESSION], and a playful tuft of messy fur on top of his head."

## 3. Mama Yeti (Mother / Pink She-Yeti)
When Mama Yeti is in the scene, include this EXACT text:
"a Yeti covered in thick, fluffy, vibrant pink fur with a light-pink face and paws, round fluffy body, large expressive cartoon eyes, dark arched eyebrows, small round nose, [EXPRESSION], and a playful tuft of messy fur on top of her head."

## 4. Babu Yeti (Son / Mint Baby Yeti)
When Babu Yeti is in the scene, include this EXACT text:
"a baby Yeti covered in thick, fluffy, vibrant mint-green fur with a light-green face and paws, round fluffy body, oversized expressive cartoon eyes, small button nose, [EXPRESSION], and a single curly tuft of fur on top of its head."

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

The "no smile" words stay in the text. The model's prior for these characters is a grin, and the phrase is what overrides it. If a rendered clip shows a smile on a beat that has none, the slot was filled wrong or the `Action:` sentence contradicts it; fix the prompt and regenerate rather than extending from the smiling frame, because an expression carries into the next clip the same way horns do.

## 6. The Yetis are the heroes
Papa Yeti, Mama Yeti, and Babu Yeti are the main characters of every story in this project, and they never change: not their names, colours, features, or roles as the family at the centre of the film. Papa Yeti and Mama Yeti are the hero and heroine, and Babu Yeti is the child who notices, tries, and learns. When a story or storyboard comes from somewhere else with its own cast, recast it so the Yetis take the hero roles (the one who notices, the one who acts, the one who helps or rescues) and never the roles of bystanders or the ones in need. Other characters, human or animal, may be added, changed, or invented to fit the context (a human family on a raft, a bird on a branch), but no other character ever takes a hero beat that a Yeti could take, and no other character ever replaces a Yeti. Humans are drawn in the same 3D animated style as the Yetis, with rounded friendly cartoon features and simple in-world clothing, never photoreal and never a likeness of a real person. Each supporting cast gets one locked sentence (`Humans:` or `Animals:`) copied word for word into every prompt.

## 7. Head Lock (Include in EVERY prompt, right after the character text)
The Yetis have no horns. Video models add horns, antlers, or spikes to "Yeti" characters when the prompt leaves the top of the head undescribed, and once a frame has them every clip that extends from that frame keeps them. Include this EXACT sentence after the last character description in every prompt:
"Head lock: each Yeti has a smooth, rounded, fully furred head, and the tuft of fur is the only thing on top of it; there are no horns, no antlers, no spikes, no bumps, and no headwear."

## Rules for Prompt Construction:
1. Never change the fur colors, facial features, or body shapes described above. The only part of a character text that varies is the `[EXPRESSION]` slot, and it varies only between the rows of the section 5 table.
2. When multiple characters are in a scene, separate their descriptions clearly. (e.g., "On the left, [Papa Yeti's exact text]. On the right, [Mama Yeti's exact text].").
3. Only change their actions, emotions, props, and environments in the prompt. State each emotion twice: once in the `[EXPRESSION]` slot of the character text and once in the `Action:` sentence, and make sure the two agree. An `Action:` line that says "her smile fades into concern" under a character text that still says "wide cheerful toothy smile" produces a smile.
4. For video prompts, strictly exclude dialogue. Rely on background music and sound effects to communicate universally to a global audience.
5. Never use a plain white, solid color, or empty studio background. Always define a contextual environment based on the storyboard using the prefix "Environment:". The default environment, if unspecified, should be a cozy rock cave (e.g., "Environment: A quiet, snow-dusted rock cave retreat").
6. Never put a paw, prop, or other object on or above the top of a Yeti's head in an `Action:` sentence unless the story needs it. Paws folded up beside the head (a sleep mime), raised over the head, or resting on the head are what the model most often turns into horns. Keep mimes at chest height. If the story needs a head touch (a tuft ruffle), say the paw lifts away in the same sentence.
7. If a generated image or clip shows a Yeti with horns, antlers, spikes, or anything on its head besides the fur tuft, regenerate it. Never extend a new clip from a frame that has them.
8. Never write a Yeti casting energy (a dome, wave, beam, burst, pulse, aura, or force field) or changing its own body. Flow's copyright filter ("interests of third-party content providers") reads that as a famous animated film's power-up. Write a magical effect as a change in light or weather near the character, and keep the character text untouched.
9. The Yetis are the heroes of every story. Never cast a non-Yeti as the rescuer, the problem-solver, or the character whose choice resolves the story. When adapting a source that has other characters in those roles, give the roles to Papa Yeti, Mama Yeti, and Babu Yeti and move the source's characters, human or animal, into supporting roles. Never replace, rename, recolour, or drop a main character to fit a source.
