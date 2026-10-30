---
trigger: always_on
description: Locks the permanent visual identity of Papa Yeti, Mama Yeti, and Babu Yeti so Google Flow reproduces the exact same three characters in every image and video generation. Covers identity only, never camera, scene, lighting, action, or story.
---

# Character Consistency Rules

## Purpose

This file controls only character identity and visual continuity for the three main characters: Papa Yeti, Mama Yeti, and Babu Yeti. It defines what each character permanently looks like and what must never change between generations.

It does not govern camera, framing, shot type, duration, transitions, scene lighting, environments, weather, time of day, actions, story events, or dialogue. Those belong to other rules and to each individual prompt, and they may change freely from one video to the next. Whatever changes in the scene, the characters inside it do not.

Every trait below belongs to one of three tiers:

- **Immutable identity traits** define who the character is. They stay identical in every generation, and no scene prompt can override them.
- **Default visual styling traits** are the character's normal presentation. They stay unchanged unless a prompt explicitly asks for a temporary variation that leaves the identity intact.
- **Variable scene traits** are expressions, poses, actions, surroundings, and temporary interactions. They change freely without touching facial identity, age, colour, proportions, fur design, or distinguishing features.

When a prompt conflicts with an immutable identity trait, the identity trait wins.

## Canonical portraits

Each Yeti's look is defined by its canonical portrait, and the text below describes that portrait exactly. Where the text and the portrait ever disagree, the portrait wins and the text is corrected to match it.

| Character | Canonical portrait |
| --- | --- |
| Papa Yeti | `references/characters/papa-yeti.png` |
| Mama Yeti | `references/characters/mama-yeti.png` |
| Babu Yeti | `references/characters/babu-yeti.png` |

All three are front-view, full-body, standing portraits with a cheerful open smile, lit by a soft warm glow from behind in a pale ice cave. They are the images attached as character references (the Flow Characters in `google-flow.md`, and every panel image and still), so the background is not part of the character: never carry the ice cave into a scene that is not set there.

## Global Character Consistency Rules

1. **Same individual, every time.** Each character must be the exact same individual in every generation, not merely a character with similar colour, fur, size, or general features. A viewer must recognise them instantly as the same Papa Yeti, Mama Yeti, or Babu Yeti.
2. **Copy the lock verbatim, where a lock is used.** Each lock is the description of the character's saved Google Flow Character, and is pasted word for word into every still image prompt that includes that character. Never paraphrase, shorten, or summarise it. Video prompts and storyboards carry no lock: they call the saved Character by its `@` name (`@Papa Yeti`) and never describe its look, because the Character carries it (`google-flow.md`, section 2).
3. **Include only the characters in the shot.** Paste a lock, or call a Character with `@`, only for characters who appear. A lock or an `@` name for an absent character invites the model to add that character.
4. **Identity outranks scene style.** Lighting, colour grading, mood, weather, perspective, lens, and motion may change how a character is lit or seen, but never their fur colour, facial geometry, proportions, tuft, or age.
5. **Expressions move the face, not the design.** A character may smile, frown, gasp, or strain. An expression moves only the eyebrows, eyelids, cheeks, and mouth; the skull shape, cheek volume, eye size and spacing, muzzle width, nose, jaw, teeth shape, and brow shape stay the same underneath it.
6. **Shared family traits are not interchangeable traits.** All three Yetis share one species design (see below), but each has a unique fur colour, tuft, body silhouette, and age that must never be transferred to another.
7. **No redesigns.** Never beautify, age, de-age, masculinise, feminise, humanise, slim, bulk up, realistify, or otherwise create an alternate version of any character.
8. **Stylized characters, detailed fur.** The fur may be rendered in ultra-realistic strand detail, but the characters themselves stay stylized cartoon designs, never biologically realistic animals.
9. **Reference images carry identity, not scenes.** The canonical portraits (above) define how each character looks. When one is attached, it never sets the pose, expression, background, or lighting of the new generation.
10. **Reject drift.** Any generation where a character's identity has drifted is regenerated, never used, and never attached as a reference for later generations.

### Shared species design (true of all three Yetis)

- Stylized, friendly 3D animated character rendered in high-quality 3D CGI, with ultra-realistic, soft, individually rendered fur strands on a soft, plush, rounded cartoon body.
- Smooth, rounded, fully furred head with no human hairline; the fur tuft is the only thing on top of it. No horns, antlers, spikes, bumps, human hair, or headwear, ever. Small rounded ears may show at the sides of the head only where a character's portrait shows them (Papa Yeti's do; Mama Yeti's and Babu Yeti's are hidden in fur).
- Fur is one solid saturated colour from head to toe. Only the face, hands, and feet are a lighter shade of that same colour. No white belly, no grey fur, no patches, no markings, no second colour. Darker or lighter tones come only from light, shadow, depth, and strand direction.
- Face, hands, and feet: smooth, slightly matte, softly lit from within, edges blending naturally into the surrounding fur. No human skin, visible pores, wrinkles, or glossy plastic look.
- Eyes: large, evenly aligned, bright, glossy cartoon eyes with dark pupils, clean white sclera, and bright catchlights. The iris colour belongs to each character and never crosses: Papa Yeti deep blue, Mama Yeti warm dark brown, Babu Yeti blue-grey.
- Eyebrows: dark, soft-edged, clearly visible, gently arched at rest; never angry, menacing, or severe by design. Colour and thickness belong to each character: Papa Yeti very dark navy and thick, Mama Yeti dark plum-brown and neat, Babu Yeti dark green-grey and thick.
- Nose: rounded, softly modelled, a shade darker than the face, never wet, realistic, or animal-like. Size and shade belong to each character: Papa Yeti large and bulbous, Mama Yeti small and rosy pink, Babu Yeti a grey-green button.
- Teeth, when visible: clean, white, evenly aligned cartoon teeth with blunt, rounded edges. Papa Yeti and Babu Yeti have one slightly taller, blunt, rounded corner tooth at each end of the row; Mama Yeti's row is even. Never sharp, pointed, fang-like, irregular, or realistic.
- Hands and feet: soft, chunky, stylized cartoon hands and feet shaped like human hands and feet, in proportion to the cartoon body and in the light shade of the character's fur colour, with no claws. They are never realistic human hands: no knuckle wrinkles, nails, or long slender fingers. Exactly two arms and two legs. Every hand has a thumb and four short, rounded fingers: five separate fingers on each hand, ten in all. Every foot has five short, separate, rounded toes: ten in all. Never three or four cartoon fingers, never mitten hands, never animal paws, and never merged, fused, missing, webbed, or extra fingers or toes. Prompts call them hands and feet, never paws, because "paws" makes models draw animal paws and four-fingered cartoon hands, and wherever a hand does something visible (waves, claps, grips, points, holds) the prompt says "five-fingered hand". The canonical portraits show the hands relaxed and partly curled, so not every finger is visible in them; the five-finger rule holds regardless, and the Flow Character images show the hands open with every finger visible (`google-flow.md`).
- Tail: none. All Yetis are completely tailless. No tail, stub, puff, animal tail, or rear appendage of any kind; the back is covered from shoulders to knees in the same thick, long, shaggy fur as the rest of the body, flowing straight down over the lower back and seat like one continuous fur coat. The only bare areas on any Yeti are the face, the hands, and the feet: never a bare, hairless, or skin-coloured patch on the back, seat, belly, or legs. When describing a Yeti's back, never use the words smooth, rear, hips, or bottom, which models render as bare skin; describe the fur instead. Prompts, still images, and videos must never feature, depict, or describe any tail on any Yeti.
- Wardrobe: none. Each Yeti wears nothing but its own fur: no clothing, hats, scarves, jewellery, bags, footwear, or accessories. Props a Yeti holds in a scene are scene props, not part of the character.
- Never an ape, a realistic animal, a wild beast, a frightening snow monster, a tailed creature, or a white shaggy Yeti.

---

## Character 1 — Papa Yeti

The father. The sapphire-blue grown-up Yeti.

### Immutable Identity

- **Species and style:** stylized 3D animated grown-up Yeti, high-quality 3D CGI, ultra-realistic soft individually stranded fur on a soft, plush, rounded cartoon body.
- **Apparent age:** fully grown adult; warm, fatherly presence. Never youthful, elderly, or baby-like.
- **Fur colour:** one solid, vibrant, saturated sapphire blue (a rich royal blue) over the entire body, head to toe.
- **Face, hand, and foot colour ("skin tone"):** smooth, slightly matte light periwinkle blue, a lighter shade of the same sapphire blue.
- **Face shape and structure:** wide, soft face with full rounded cheeks and a broad light-blue muzzle area. Small rounded light-blue ears show at the sides of the head, partly tucked into the fur. Head is proportionally large and expressive, connected to the body by dense neck and shoulder fur.
- **Eyes:** large, expressive cartoon eyes, evenly aligned, bright and glossy, with dark pupils, deep-blue irises, and clean white sclera.
- **Eyebrows:** very dark navy, thick, soft-edged, highly visible, gently arched.
- **Nose:** large, rounded, bulbous, softly modelled, a shade darker blue than the light-blue face.
- **Mouth and teeth:** naturally broad mouth; when open, an even row of clean, square, rounded white teeth with one slightly taller, blunt, rounded corner tooth at each end, and a dark inner mouth. Teeth never sharp, pointed, or fang-like.
- **Head tuft:** a tall, playful tuft of messy sapphire-blue fur on top of the head, made of many soft, wavy, unruly locks flaring upward and outward. It is the only thing on the head.
- **Height and proportions:** the largest of the three Yetis. About twice Babu Yeti's height.
- **Build and silhouette:** large, solid, broad-shouldered silhouette; generous, round, fluffy belly; thick sturdy legs; oversized rounded feet; long, heavy arms that hang to the knees. Completely tailless. Sturdy and grounded, never muscular, aggressive, ape-like, or monstrous.
- **Fur grooming structure:** shorter and tidier on the forehead and face; medium length on the upper head and arms; robustly full and thick around the cheeks, jawline, chest, shoulders, belly, forearms, thighs, and lower legs. A full, thick sapphire-blue beard of fur hangs from the jaw and chin onto the upper chest and comes to a soft point (never a separate white beard). Chest fur flows downward in broad sections.
- **Hands and feet:** soft, chunky, stylized cartoon light-blue hands and feet shaped like human hands and feet, with no claws. Each hand has a thumb and four short fingers: five separate, rounded fingers per hand (10 total). Each foot has five separate, rounded toes (10 total). Never three or four fingers, mitten hands, or animal paws; no merged, missing, webbed, or extra fingers or toes.
- **Tail:** none. Completely tailless body with no tail, stub, puff, or rear appendage of any kind.
- **Distinguishing marks:** none. No patches, markings, scars, or spots.

### Default Visual Styling

These remain unchanged unless a prompt explicitly overrides them for a specific shot.

- Resting expression: friendly, open, fatherly, with a wide cheerful toothy smile of square white teeth.
- Resting posture: upright, calm, confident, welcoming, and proudly protective.
- Wardrobe: none. Fur only.
- Accessories: none.

### Allowed Variations

- Facial expression (happy, worried, alarmed, determined, straining, sad, curious, relieved), as long as the face's underlying geometry, eyes, brows, nose, and teeth shape remain Papa Yeti's.
- Mouth open or closed, teeth shown or hidden; eyebrows and eyelids moving with the expression without changing their permanent shape, thickness, spacing, or colour.
- Pose, gesture, action, and movement.
- Viewing angle, distance, and framing.
- Environment, weather, time of day, and scene lighting falling on the fur.
- Snow, water, or dust temporarily resting on or dampening the fur, without changing its colour.
- Props he holds or carries in a scene.

### Prohibited Changes

- Any fur colour other than solid sapphire blue, including drift toward navy, pale blue, or teal; any white, grey, cream, or second-colour area; a white beard, grey muzzle, or white belly.
- Changing the messy upward tuft into a side-swept wave, a single curl, a flat head, or removing it.
- Horns, antlers, spikes, bumps, hats, or anything else on the head.
- Any tail of any kind (no tail, stub, puff, bushy tail, or animal tail).
- Any digit count other than 5 fingers (4 fingers + 1 opposable thumb) per hand (10 total) or 5 toes per foot (10 total); merged, fused, missing, webbed, or extra fingers or toes.
- Slimming, shrinking, or softening his broad-shouldered, heavy, large build; making him baby-like or as small as Babu Yeti.
- Making him look younger, older, feminine, or like a different father character.
- Clothing, scarves, jewellery, bags, or accessories.
- Sharp or pointed teeth, fangs, claws, human skin, visible pores, wrinkles, or a tail.
- Narrowing, lengthening, flattening, sharpening, or otherwise redesigning his face; changing eye colour, eye size, eye spacing, brow shape, nose size, muzzle width, mouth placement, or face width; removing his beard or his small side ears.
- An ape-like, realistic-animal, beastly, or monstrous look.

### Copy-Ready Google Flow Character Lock

```text
Papa Yeti: a stylized, friendly 3D animated grown-up father Yeti rendered in high-quality 3D CGI with ultra-realistic, soft, individually stranded fur, matching his canonical portrait exactly. He is entirely covered in thick, fluffy, vibrant sapphire-blue fur, one solid rich royal sapphire-blue colour from head to toe, with a smooth, slightly matte light periwinkle-blue face and light periwinkle-blue hands and feet that blend naturally into the fur. He has a large, solid, broad-shouldered silhouette, a generous round fluffy belly, long heavy arms that hang to his knees, thick sturdy legs, and oversized rounded feet; he is the largest Yeti in the family, about twice the height of the baby Yeti. His proportionally large, smooth, rounded, fully furred head has a wide, soft face with full rounded cheeks and a broad light-blue muzzle, small rounded light-blue ears that show at the sides of his head, large glossy cartoon eyes with dark pupils, deep-blue irises, and clean white sclera, very dark navy, thick, soft-edged, gently arched eyebrows, and a large, rounded, bulbous nose a shade darker blue than his face. When his mouth is open it shows an even row of clean, square, rounded white teeth with one slightly taller, blunt, rounded corner tooth at each end. His fur is short and tidy on the forehead and face, and thick and full around the cheeks, jaw, chest, shoulders, belly, forearms, and legs, with a full, thick sapphire-blue beard of fur that hangs from his jaw and chin onto his upper chest and comes to a soft point. On top of his head is a tall, playful tuft of messy sapphire-blue fur made of many soft, wavy, unruly locks flaring upward and outward; the tuft is the only thing on his head. His hands are soft, chunky, stylized cartoon hands shaped like human hands, each with a thumb and four short, rounded fingers, five separate fingers on every hand, and his feet are broad, stylized cartoon feet with five short, separate, rounded toes on each foot; no claws, never three or four fingers, never animal paws. He has no tail. He wears nothing but his own fur. Always generate the exact same individual with identical facial identity, facial geometry, age, fur colour, face, hand, and foot shade, tuft, body proportions, and distinguishing features, so he is recognisably the same Papa Yeti in every generation and not a replacement, a relative, an alternate design, or merely a similar blue Yeti; expressions move only his eyebrows, eyelids, cheeks, and mouth, and no expression, pose, lighting, or camera angle alters his face shape, eye spacing, muzzle, nose, proportions, or colour. Do not reinterpret, redesign, replace, merge, beautify, age, de-age, or create an alternate version of this character. Never give him white or grey fur, a white beard or belly, a second fur colour, patches, horns, antlers, spikes, bumps, a hat or headwear, clothing, accessories, sharp or pointed teeth, fangs, claws, merged, missing, or extra fingers or toes, human skin, visible pores, a tail, a slimmer or smaller build, or an ape-like, realistic-animal, or monstrous look, never give him the pink Yeti's side-swept wave tuft or the baby Yeti's single curl, and never feminise or humanise him.
```

---

## Character 2 — Mama Yeti

The mother. The bubblegum-pink grown-up Yeti.

### Immutable Identity

- **Species and style:** stylized 3D animated grown-up Yeti, high-quality 3D CGI, ultra-realistic soft individually stranded fur on a soft, plush, rounded cartoon body.
- **Apparent age:** fully grown adult; loving, nurturing, motherly presence. Never youthful, elderly, or baby-like.
- **Fur colour:** one solid, vibrant, saturated bubblegum pink over the entire body, head to toe.
- **Face, hand, and foot colour ("skin tone"):** smooth, slightly matte light pink, a lighter shade of the same bubblegum pink, with a soft rosy flush on the cheeks.
- **Face shape and structure:** wide, soft face with full rounded cheeks and a broad light-pink muzzle area. Head is proportionally expressive and friendly, blending seamlessly into the body through soft, dense neck and shoulder fur.
- **Eyes:** large, expressive cartoon eyes, evenly aligned, bright and glossy, with dark pupils, warm dark-brown irises, clean white sclera, and a neat dark upper lash line along each upper eyelid.
- **Eyebrows:** dark plum-brown, neat, medium-thick, soft-edged, highly visible, softly arched.
- **Nose:** small, round, softly modelled, a deeper rosy pink than the light-pink face.
- **Mouth and teeth:** gently upward-curving mouth; when open, one even row of clean, square, rounded white teeth with a dark inner mouth and no taller corner teeth. Teeth never sharp, pointed, or fang-like.
- **Head tuft:** a smooth, glossy tuft of bubblegum-pink fur that rises from the forehead and sweeps up and over to one side in a single soft wave with lightly flicked tips. It is the only thing on the head.
- **Height and proportions:** a grown-up, clearly taller than Babu Yeti (about twice his height), with a softer, rounder, gentler silhouette than Papa Yeti.
- **Build and silhouette:** soft, rounded, pear-shaped silhouette; gently sloping shoulders; big, plush, round fluffy belly; short sturdy legs; rounded feet; long, heavy arms that hang to the knees with a graceful outward curve. Completely tailless. Sturdy and nurturing, never thin, model-like, human-shaped, muscular, or masculine.
- **Fur grooming structure:** shorter and tidier on the forehead and face; medium length on the upper head and arms; full and rounded around the cheeks, jawline, chest, shoulders, belly, forearms, thighs, and lower legs. A soft, cloud-like fullness around the lower cheeks and jaw with no beard-like shape. Chest fur flows smoothly downward.
- **Hands and feet:** soft, chunky, stylized cartoon light-pink hands and feet shaped like human hands and feet, with no claws. Each hand has a thumb and four short fingers: five separate, rounded fingers per hand (10 total). Each foot has five separate, rounded toes (10 total). Never three or four fingers, mitten hands, or animal paws; no merged, missing, webbed, or extra fingers or toes.
- **Tail:** none. Completely tailless body with no tail, stub, puff, or rear appendage of any kind.
- **Distinguishing marks:** none. No patches, markings, scars, or spots.

### Default Visual Styling

These remain unchanged unless a prompt explicitly overrides them for a specific shot.

- Resting expression: loving, open, motherly, with a wide cheerful toothy smile of square white teeth.
- Resting posture: upright, warm, nurturing, welcoming, and gently confident.
- Wardrobe: none. Fur only.
- Accessories: none.

### Allowed Variations

- Facial expression (happy, worried, alarmed, determined, straining, sad, curious, relieved), as long as the face's underlying geometry, eyes, brows, nose, and teeth shape remain Mama Yeti's.
- Mouth open or closed, teeth shown or hidden; eyebrows and eyelids moving with the expression without changing their permanent shape, thickness, spacing, or colour.
- Pose, gesture, action, and movement.
- Viewing angle, distance, and framing.
- Environment, weather, time of day, and scene lighting falling on the fur.
- Snow, water, or dust temporarily resting on or dampening the fur, without changing its colour.
- Props she holds or carries in a scene.

### Prohibited Changes

- Any fur colour other than solid bubblegum pink; drifting toward magenta, red, purple, peach, or pastel white; any white, grey, cream, or second-colour area.
- Changing the side-swept wave tuft into an upward messy tuft, a single curl, a straight-back sweep, a flat head, or removing it.
- Horns, antlers, spikes, bumps, bows, flowers, hats, or anything else on the head.
- Any tail of any kind (no tail, stub, puff, bushy tail, or animal tail).
- Any digit count other than 5 fingers (4 fingers + 1 opposable thumb) per hand (10 total) or 5 toes per foot (10 total); merged, fused, missing, webbed, or extra fingers or toes.
- A beard-like jaw shape, broad heavy shoulders, or Papa Yeti's large, bulky silhouette.
- Making her look younger, older, masculine, glamorised, or like a different mother character.
- Long or separate eyelashes, eyeshadow, lipstick, or any makeup beyond her neat upper lash line; blue or grey irises; clothing, scarves, jewellery, bags, or accessories.
- Sharp or pointed teeth, fangs, claws, human skin, visible pores, wrinkles, or a tail.
- Narrowing, lengthening, flattening, sharpening, or otherwise redesigning her face; changing eye colour, eye size, eye spacing, brow shape, nose size, muzzle width, mouth placement, or face width.
- An ape-like, realistic-animal, beastly, or monstrous look.

### Copy-Ready Google Flow Character Lock

```text
Mama Yeti: a stylized, friendly 3D animated grown-up mother Yeti rendered in high-quality 3D CGI with ultra-realistic, soft, individually stranded fur, matching her canonical portrait exactly. She is covered in thick, fluffy, vibrant bubblegum-pink fur, one solid bubblegum-pink colour from head to toe, with a smooth, slightly matte light-pink face with a soft rosy flush on the cheeks and light-pink hands and feet that blend naturally into the fur. She has a soft, rounded, pear-shaped silhouette with gently sloping shoulders, a big plush round fluffy belly, long heavy arms that hang to her knees with a graceful outward curve, short sturdy legs, and rounded feet; she is a grown-up, about twice the height of the baby Yeti, softer and rounder in shape than the blue Yeti. Her smooth, rounded, fully furred head has a wide, soft face with full rounded cheeks and a broad light-pink muzzle, large glossy cartoon eyes with dark pupils, warm dark-brown irises, clean white sclera, and a neat dark upper lash line along each upper eyelid, dark plum-brown, neat, softly arched eyebrows, and a small round nose a deeper rosy pink than her face. When her mouth is open it shows one even row of clean, square, rounded white teeth. Her fur is short and tidy on the forehead and face, and full and rounded around the cheeks, jaw, chest, shoulders, belly, forearms, and legs, forming a soft cloud-like fullness around the lower cheeks and jaw with no beard shape. On top of her head is a smooth, glossy tuft of bubblegum-pink fur that rises from her forehead and sweeps up and over to one side in a single soft wave with lightly flicked tips; the tuft is the only thing on her head. Her hands are soft, chunky, stylized cartoon hands shaped like human hands, each with a thumb and four short, rounded fingers, five separate fingers on every hand, and her feet are broad, stylized cartoon feet with five short, separate, rounded toes on each foot; no claws, never three or four fingers, never animal paws. She has no tail. She wears nothing but her own fur. Always generate the exact same individual with identical facial identity, facial geometry, age, fur colour, face, hand, and foot shade, tuft, body proportions, and distinguishing features, so she is recognisably the same Mama Yeti in every generation and not a replacement, a relative, an alternate design, or merely a similar pink Yeti; expressions move only her eyebrows, eyelids, cheeks, and mouth, and no expression, pose, lighting, or camera angle alters her face shape, eye spacing, muzzle, nose, proportions, or colour. Do not reinterpret, redesign, replace, merge, beautify, age, de-age, or create an alternate version of this character. Never give her magenta, red, purple, white, or grey fur, a second fur colour, patches, horns, antlers, spikes, bumps, bows, a hat or headwear, long separate eyelashes, eyeshadow, lipstick, or makeup, blue or grey eyes, clothing, accessories, a beard-like jaw, a bulky broad-shouldered build, sharp or pointed teeth, fangs, claws, merged, missing, or extra fingers or toes, human skin, visible pores, a tail, or an ape-like, realistic-animal, or monstrous look, never give her the blue Yeti's messy upward tuft or the baby Yeti's single curl, and never masculinise or humanise her.
```

---

## Character 3 — Babu Yeti

The son. The mint-green baby Yeti.

### Immutable Identity

- **Species and style:** stylized 3D animated baby Yeti, high-quality 3D CGI, ultra-realistic soft individually stranded fur on a soft, plush, rounded cartoon body.
- **Apparent age:** a small baby / very young child; innocent and slightly playful. Never older, never teenage or adult-like, and never a miniature adult.
- **Fur colour:** one solid, vibrant, saturated mint green over the entire body, head to toe.
- **Face, hand, and foot colour ("skin tone"):** smooth, slightly matte pale mint green, a lighter shade of the same mint green, with a soft rosy blush on the cheeks.
- **Face shape and structure:** wide, soft face with full rounded cheeks and a broad light-green muzzle area. Head is oversized relative to the body, larger in proportion than a grown-up Yeti's, to show his youth, connected to the body by dense neck and shoulder fur.
- **Eyes:** oversized, expressive cartoon eyes, evenly aligned, bright and glossy, with dark pupils, blue-grey irises with bright sparkling catchlights, and clean white sclera. Proportionally larger in the face than the grown-ups' eyes.
- **Eyebrows:** dark green-grey, thick, soft-edged, highly visible, gently arched.
- **Nose:** rounded button nose, softly modelled, a soft grey-green slightly darker than the pale mint-green face.
- **Mouth and teeth:** broad, upward-curving mouth; when open, clean, square, rounded white teeth with one slightly taller, blunt, rounded corner tooth at each end, and a dark inner mouth. Teeth never sharp, pointed, or fang-like.
- **Head tuft:** the fur on top of the head sweeps up into a single curly tuft of mint-green fur, one distinct, soft spiral curl. It is the only thing on the head.
- **Height and proportions:** small; about half the height of Papa Yeti or Mama Yeti. Beside a grown-up on the same ground, the top of his head, curl included, reaches only to the grown-up's belly, never to the grown-up's chest, shoulders, or face. Never doll-sized, never grown-up-sized.
- **Build and silhouette:** small, soft, rounded baby silhouette; a thick, fluffy ruff of fur around the neck; fluffy round tummy; short chubby legs; proportionately large rounded feet; long, heavy arms for his size. Completely tailless.
- **Fur grooming structure:** shorter and tidier on the forehead and face; medium length on the upper head and arms; full and rounded around the cheeks, jawline, chest, shoulders, belly, forearms, thighs, and lower legs. A fluffy fullness around the lower cheeks and jaw with no beard-like shape. Chest fur flows downward in broad sections.
- **Hands and feet:** soft, chunky, stylized cartoon light-green hands and feet shaped like human hands and feet, with no claws. Each hand has a thumb and four short fingers: five separate, rounded fingers per hand (10 total). Each foot has five separate, rounded toes (10 total). Never three or four fingers, mitten hands, or animal paws; no merged, missing, webbed, or extra fingers or toes.
- **Tail:** none. Completely tailless body with no tail, stub, puff, or rear appendage of any kind.
- **Distinguishing marks:** none. No patches, markings, scars, or spots.

### Default Visual Styling

These remain unchanged unless a prompt explicitly overrides them for a specific shot.

- Resting expression: friendly, open, innocent, with a cute playful smile.
- Resting posture: upright, calm, welcoming, innocent, and slightly playful.
- Wardrobe: none. Fur only.
- Accessories: none.

### Allowed Variations

- Facial expression (happy, worried, alarmed, determined, straining, sad, curious, relieved), as long as the face's underlying geometry, oversized eyes, brows, button nose, and teeth shape remain Babu Yeti's.
- Mouth open or closed, teeth shown or hidden; eyebrows and eyelids moving with the expression without changing their permanent shape, thickness, spacing, or colour.
- Pose, gesture, action, and movement.
- Viewing angle, distance, and framing.
- Environment, weather, time of day, and scene lighting falling on the fur.
- Snow, water, or dust temporarily resting on or dampening the fur, without changing its colour.
- Props he holds or carries in a scene.

### Prohibited Changes

- Any fur colour other than solid mint green; drifting toward teal, lime, dark green, turquoise, or blue; any white, grey, cream, or second-colour area.
- Changing the single curl into a messy upward tuft, a side-swept wave, several curls, a flat head, or removing it.
- Horns, antlers, spikes, bumps, hats, or anything else on the head.
- Any tail of any kind (no tail, stub, puff, bushy tail, or animal tail).
- Any digit count other than 5 fingers (4 fingers + 1 opposable thumb) per hand (10 total) or 5 toes per foot (10 total); merged, fused, missing, webbed, or extra fingers or toes.
- Growing him to grown-up size, shrinking him to toy or doll size, or giving him adult proportions (a smaller head, smaller eyes, a mature jaw, a grown-up torso, long legs, broad shoulders).
- Making him look older, teenage, adult, or like a different child character.
- Clothing, a nappy, scarves, pacifiers, jewellery, bags, or accessories.
- Sharp or pointed teeth, fangs, claws, human skin, visible pores, wrinkles, or a tail.
- Narrowing, lengthening, flattening, sharpening, or otherwise redesigning his baby face; changing eye colour, eye size, eye spacing, brow shape, nose size, muzzle width, mouth placement, or face width.
- An ape-like, realistic-animal, beastly, or monstrous look.

### Copy-Ready Google Flow Character Lock

```text
Babu Yeti: a stylized, friendly 3D animated small baby Yeti rendered in high-quality 3D CGI with ultra-realistic, soft, individually stranded fur, matching his canonical portrait exactly. He is covered in thick, fluffy, vibrant mint-green fur, one solid mint-green colour from head to toe, with a smooth, slightly matte pale mint-green face with a soft rosy blush on the cheeks and pale mint-green hands and feet that blend naturally into the fur. He has a small, soft, rounded baby silhouette with a thick fluffy ruff of fur around his neck, a fluffy round tummy, long heavy arms for his size, short chubby legs, and proportionately large rounded feet; he is about half the height of a grown-up Yeti: when he stands beside one, the top of his head, curl included, reaches only to the grown-up's belly, never to the grown-up's chest or shoulders. His oversized, smooth, rounded, fully furred head is large in proportion to his body to show his youth, with a wide, soft face, full rounded cheeks, and a broad pale-green muzzle, oversized glossy cartoon eyes with dark pupils, blue-grey irises with bright sparkling catchlights, and clean white sclera, dark green-grey, thick, soft-edged, gently arched eyebrows, and a rounded button nose in a soft grey-green slightly darker than his face. When his mouth is open it shows clean, square, rounded white teeth with one slightly taller, blunt, rounded corner tooth at each end. His fur is short and tidy on the forehead and face, and full and rounded around the cheeks, jaw, chest, shoulders, tummy, forearms, and legs, with a fluffy fullness around the lower cheeks and jaw and no beard shape. On top of his head the fur sweeps up into a single curly tuft of mint-green fur, one distinct soft spiral curl; the tuft is the only thing on his head. His hands are soft, chunky, stylized cartoon hands shaped like human hands, each with a thumb and four short, rounded fingers, five separate fingers on every hand, and his feet are broad, stylized cartoon feet with five short, separate, rounded toes on each foot; no claws, never three or four fingers, never animal paws. He has no tail. He wears nothing but his own fur. Always generate the exact same individual with identical facial identity, facial geometry, age, fur colour, face, hand, and foot shade, tuft, body proportions, and distinguishing features, so he is recognisably the same Babu Yeti in every generation and not a replacement, a sibling, an alternate design, a generic baby Yeti, or merely a similar green baby Yeti; expressions move only his eyebrows, eyelids, cheeks, and mouth, and no expression, pose, lighting, or camera angle alters his face shape, eye spacing, muzzle, nose, proportions, size, or colour. Do not reinterpret, redesign, replace, merge, beautify, age, de-age, or create an alternate version of this character. Never give him teal, lime, turquoise, blue, white, or grey fur, a second fur colour, patches, horns, antlers, spikes, bumps, a hat or headwear, clothing, a nappy, accessories, adult proportions, a grown-up size, sharp or pointed teeth, fangs, claws, merged, missing, or extra fingers or toes, human skin, visible pores, a tail, or an ape-like, realistic-animal, or monstrous look, never give him the blue Yeti's messy tuft or the pink Yeti's side-swept wave tuft, and never adultify or humanise him.
```

---

## Multi-Character Consistency Rules

1. **Three individuals, not one recoloured model.** Papa Yeti, Mama Yeti, and Babu Yeti each have their own face, build, age, scale, and tuft. Never generate one generic Yeti and tell the three apart only by fur colour.
2. **One lock per character, kept separate.** When two or three Yetis share a shot, paste each character's full lock as its own block and tie each to a clear position or role in the prompt (for example, "On the left, Papa Yeti: … On the right, Mama Yeti: …"). Never combine locks into one merged description.
3. **Colours never cross.** Papa is only sapphire blue, Mama only bubblegum pink, Babu only mint green. No Yeti may appear in another's colour, in a blended colour, or with patches of another's colour. No two Yetis may share a colour.
4. **Tufts never cross.** Papa: tall messy upward tuft of many unruly locks. Mama: smooth tuft swept up and over to one side in a single wave. Babu: single spiral curl. The tuft is the fastest way to tell the heads apart and must never be swapped, copied, or averaged.
5. **Silhouettes never cross.** Papa: largest, broad-shouldered, heavy, with a full pointed beard of fur and small ears at the sides of his head. Mama: soft, rounded, pear-shaped, gently sloping shoulders, cloud-like jaw with no beard shape. Babu: small, chubby baby with an oversized head and oversized eyes. Never give one character another's build, jaw shape, head proportion, or eye size.
6. **Scale stays fixed.** Babu is about half the height of each grown-up. Papa and Mama are both grown-ups, with Papa the larger and broader of the two. These relationships hold whenever they appear together: Babu never grows to their height, and neither grown-up shrinks toward his. Measure it by the body, not by a fraction: standing on the same ground, the top of Babu's head, curl included, reaches a grown-up's belly. A video model sizes every Character to fill its own reference image, so no single Yeti's Character carries scale; the family height chart (`references/characters/family-height-chart.png`, section 3 of `google-flow.md`) and a height sentence in every shot Babu shares with a grown-up carry it.
7. **Count stays fixed.** Generate exactly the Yetis the prompt names: no duplicates, no extra Yetis, no missing ones, no fourth family member.
8. **No face averaging, no hybrids.** Each character keeps their own facial identity even when standing close, touching, or overlapping. Never blend faces, eyes, brows, or smiles between characters, merge two characters into one body, exchange limbs, or share a tuft.
9. **Consistent reference labels.** Refer to each character the same way in every prompt of a project (for example, always "Papa Yeti" or always "the blue Yeti"). Switching labels between shots can read as a different character.
10. **Shared traits are the species, not the identity.** Glossy cartoon eyes, dark brows, blunt white teeth, clawless cartoon hands with a thumb and four short fingers each and cartoon feet with five short toes each, tailless bodies, and fur-only wardrobe are common to all three; they must never be used to make the three characters look interchangeable.

## Final Consistency Checklist

Before every generation, confirm:

- [ ] A still: each character in the picture has their full Copy-Ready Character Lock pasted verbatim, each its own block tied to its position, and no lock is included for an absent character. A clip: each character is called by its `@` Character name, with no description of its look, and no absent character is named.
- [ ] Fur colours: Papa sapphire blue, Mama bubblegum pink, Babu mint green, each solid head to toe with only a lighter face and paws.
- [ ] Tufts: Papa messy and upward, Mama a smooth wave swept up to one side, Babu a single spiral curl, and nothing else on any head.
- [ ] Faces: Papa deep-blue eyes, large bulbous nose, small side ears, pointed beard; Mama dark-brown eyes with a neat lash line, rosy cheeks, even teeth; Babu blue-grey eyes, rosy cheek blush, grey-green button nose; each matches its canonical portrait.
- [ ] Builds: Papa large and broad, Mama soft and rounded, Babu small with an oversized head, at about half the grown-ups' height, the top of his curl level with a grown-up's belly whenever they stand together.
- [ ] Hands and feet: chunky stylized cartoon hands and feet, with a thumb and four short fingers on every hand (five fingers, 10 total) and five toes on every foot (10 total), every finger separate wherever a hand is open; no claws, no three- or four-fingered cartoon hands, no mitten hands or animal paws, and no merged, fused, missing, webbed, or extra fingers or toes.
- [ ] No clothing, hats, accessories, horns, claws, merged or extra digits, sharp teeth, tails, human skin, or white or grey fur anywhere.
- [ ] Nothing else in the prompt (scene, style, mood, action, or lighting) contradicts or overrides any lock.
- [ ] No identity trait (colour, face, tuft, build, age, or scale) has been swapped, merged, or transferred between characters.
- [ ] Expressions and poses suit the scene without distorting any character's underlying face or proportions.
- [ ] Any attached reference image shows the correct, on-model characters.

After generation, confirm each character is recognisably the same individual as in previous generations. If any item fails, regenerate, and never reuse the failed result as a reference.
