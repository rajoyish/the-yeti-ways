---
name: flow-character-builder
description: >-
  Trigger when the user gives a draft prompt or description of a character (a person, an
  animal, or an invented creature, in any style, even a realistic photo prompt) and asks
  for a Google Flow Character, a front and turnaround, a character sheet, Character panel
  prompts, or runs "/flow-character". Converts the draft into one stylized 3D CGI
  character that matches the Yetis' look, and writes one file in `prompts/characters/`
  holding everything Flow's New character screen needs: the Character name, the Portrait
  image prompt (front view, 1:1), the Body image prompt (turnaround, 16:9, made from the
  approved front), the Character info text, short fix-up edits, the cast sentence the
  storyboards use, and the checks. The user generates and approves the two images first,
  then builds the Character in Flow's Characters panel from them.
---

# Flow character builder

This skill turns a user's draft prompt into a saved Google Flow Character that can stand in a scene with Papa Yeti, Mama Yeti, and Babu Yeti. The draft can be anything: a photo prompt, a sketch of an idea, a list of traits. The output is the same every time: one stylized 3D CGI character, drawn twice on white (a front view and a turnaround), plus the text that goes into Flow's New character screen.

Flow's New character screen has, on the left, the name (click the pencil beside "Untitled character"), "Select a voice", and "Character info (optional)" ("Describe how your character acts..."; "The Flow agent can use this information to help craft scenes with your character"). On the right are two image slots, **Portrait** and **Body**, a "What do you want to change?" edit box, Format, and the image model (Nano Banana Pro). The front view goes in Portrait and the turnaround in Body.

Read before writing: `.agents/rules/google-flow.md` (section 2, the saved Characters) and section 10 of `.agents/rules/prompt-assembly.md` (originality). Never use this skill to redesign Papa Yeti, Mama Yeti, or Babu Yeti: their look is fixed in `.agents/rules/character-consistency.md` and their Characters already exist. A request for a fourth Yeti is refused, because the films only ever have those three.

## 1. Read the draft

Write down, before drafting:

- **Who it is:** species or kind, age (baby, child, adult, elder), and the role it will play if the user says.
- **Identity traits to keep:** every colour, marking, shape, and proportion the draft gives (for the penguin draft: black head, distinct white eye-ring, bright white throat and plump belly, pale pink feet, a beak, flippers). These are the character.
- **Pose to keep:** keep the draft's pose if it shows the limbs open and clear (outstretched flippers, open arms); otherwise use the standard front pose in step 3.
- **Scene to drop:** location, weather, background, props it does not own, camera and lens terms, and photo or quality words ("realistic", "photograph", "wildlife photo", "telephoto lens", "shallow depth of field", "bokeh", "8k", "photorealistic", "hyperreal"). They fight the 3D style lock and the white background. Note the draft's setting for the user; it belongs in a storyboard's `Environment:` sentence, not in the Character.
- **Gaps to fill:** eye colour and size, expression at rest, mouth or beak, surface texture (fur, feathers, scales, skin, cloth), the exact count of fingers, toes, or flipper tips, and whether there is a tail. Fill each with a choice that suits the species and the Yetis' world, and list the choices for the user.
- **Name:** the user's, or, if none is given, a short original two-word name that reads well after `@` (`Pip Penguin`, `Old Mountain Teacher`), marked as a suggestion.

## 2. Convert to the house style

Every Character must look like it belongs in the same film as the Yetis:

- Stylized 3D CGI, never photoreal: a soft, rounded, appealing cartoon body, a slightly larger head than real life (much larger for a baby), large glossy cartoon eyes with dark pupils and bright catchlights, and simplified, readable shapes. Real-world anatomy stays true to the species (a penguin has flippers and webbed feet, not hands) while the proportions go cartoon.
- Surface in ultra-realistic strand detail: fur, feathers, or hair rendered strand by strand, as the Yetis' fur is; fabric, scales, or skin smooth and slightly matte.
- One fixed palette: name every colour region once, plainly ("solid black", "bright white", "pale pink"), and say there are no other colours or markings.
- Original design. No franchise, film, mascot, or brand name, no "in the style of", and no famous design (a penguin is fine; a penguin in a bow tie with a tap-dance pose, or the look of a known animated penguin, is not). Add one small distinctive detail of your own only if the draft has none, and tell the user.
- Count every digit. State the number of fingers, toes, or flipper tips for each limb in words in every prompt ("five separate fingers on each hand", "three short webbed toes on each foot"), because image models drift on unstated counts. Humans and humanlike creatures get five fingers.
- Nothing worn unless the character's design needs it; a human gets simple, plain clothing for its world with no logos or writing.

## 3. Write the two image prompts

**Portrait (front view, 1:1).** One fenced `text` block, about 150 to 220 words, in this order:

1. `Create image: Square 1:1 aspect ratio, full-body character reference.`
2. The style line: `3D animated premium character render, high-quality 3D CGI, ultra-realistic soft <fur, feather, or hair> texture with individually rendered strands, soft even studio lighting with a gentle warm rim light.`
3. The character, head to toe: kind and age, build and proportions, every colour region, head and face (eyes, brows, nose or beak, mouth, ears, crest or tuft), limbs with their digit counts, feet, tail or "no tail", and anything worn.
4. The pose: standing upright, facing the camera straight on, the whole body from the top of the head to the feet in frame with a small margin, limbs slightly away from the body and open so every digit shows separately (or the draft's open pose), a friendly, gentle expression.
5. The background: `on a seamless pure white background with only a soft contact shadow under the feet, no floor line, no horizon, no props, no text.`
6. `Avoid:` photorealism, extra characters, extra or missing digits, a second colour that is not in the palette, clothing or accessories it does not have, scary or aggressive features, text, watermarks.

**Body (turnaround, 16:9).** One fenced `text` block, generated with the approved front image attached, in this order:

1. `Create image: Horizontal 16:9 aspect ratio, character turnaround sheet. Use the attached image as the exact character: same design, colours, proportions, face, and texture.`
2. The style line from the Portrait prompt, word for word.
3. A short identity reminder (two or three sentences: the palette, the head, the limbs with their digit counts, tail or no tail).
4. The views: `Three full-body views of the same character side by side, from left to right: an exact side view facing left, a straight back view, and a rear three-quarter view with the head turned to look back over the shoulder. All three at the same size and height, feet on the same level, each filling nearly the full image height, evenly spaced.`
5. The back: one sentence on what the back looks like (for a furred or feathered character, the same thick fur or feathers cover the whole back down to the legs; for a Yeti-like creature, no bare patch and no tail unless it has one).
6. `On one seamless pure white background with soft contact shadows, no dividers, no labels, no text, no floor line.`
7. The same `Avoid:` line.

## 4. Write the Character screen text

- **Character name:** the name, in title case, exactly as prompts will call it with `@`.
- **Voice:** `None.` The films have no dialogue. Skip "Select a voice" unless the user asks.
- **Character info:** one fenced `text` block, 120 to 200 words, for "Character info (optional)". The Flow agent reads it to craft scenes, so it says how the character acts and how it is drawn: one line of who it is and its role; its personality; how it moves (gait, gestures, the sounds it makes, never words); how it behaves around the Yetis if it shares their films; then a compact look summary (palette, head, limbs with digit counts, tail or no tail, nothing worn) and what it is never shown as (photoreal, scary, a second design, extra digits). No scene, setting, or story beat.
- **Cast sentence:** the locked `Humans:`, `Animals:`, or `Creatures:` sentence a storyboard copies when this character is in its story cast (section 6 of `prompt-assembly.md`), with its handle in lower case, ending with "exactly one".

## 5. Write the fix-up edits

Two or three short edits for Flow's "What do you want to change?" box, each starting `Edit only <the part>. Keep everything else exactly as it is.`, for the faults this character is most likely to get: wrong digit count (name each digit, one limb at a time), a floor line or horizon, a stray colour or marking, a photoreal or scary drift, a tail that should not be there. Edits fix one thing; never regenerate the whole character from text, because a full recreate redesigns it.

## 6. Save the file

Save to `prompts/characters/<kebab-case-name>-flow-character.md`, using the template below. Never overwrite an existing file without saying so. Then give the user the steps:

1. Generate the Portrait prompt in Flow with Nano Banana Pro at 1:1. Check it (step 7) and fix it with the edits. Save it as `references/characters/<kebab-case-name>-front.png`.
2. Generate the Body prompt at 16:9 with the approved front image attached. Check it and save it as `references/characters/<kebab-case-name>-turnaround.png`.
3. In the project, open Characters, click New character, name it, skip the voice, paste the Character info, upload the front image into Portrait and the turnaround into Body, and click Done. Type `@` in the prompt box to check the name resolves.

## 7. Checks

Before saving the file:

- [ ] No photo, lens, or quality words from the draft survive (`grep -iE "photo|realistic|telephoto|lens|depth of field|bokeh|8k|hyperreal" ` finds them only inside "Avoid:" or "ultra-realistic soft ... texture").
- [ ] Every identity trait from the draft is in the Portrait prompt, and every colour region is named once.
- [ ] Every prompt states the digit count of every limb in words, and says tail or no tail.
- [ ] Both prompts put the character on seamless white with no floor line, props, or text; the turnaround has three views, same size, feet level, no labels.
- [ ] No franchise, brand, or "in the style of"; the design is original.
- [ ] The Character info describes behaviour and look, no scene, and is under 200 words.

For the user, after generating each image: the whole body is in frame; the digits are the right number and separate; the palette is exactly as written with no extra markings; the face is friendly; the background is pure white with no line; in the turnaround, all three views are the same character at the same size, and the back matches the description.

## Output template

````markdown
# <Character Name> Flow Character

<One sentence: who the character is, converted from the user's draft into the stylized 3D style of the Yeti films.>

Draft changes: <the scene, photo, and quality terms dropped, the gaps filled with choices, and any detail added for originality.>

## Character name

`<Character Name>` (called `@<Character Name>` in Flow prompts)

## Portrait: front view (1:1)

Model: Nano Banana Pro, square 1:1. Goes in the Portrait slot.

```text
<Portrait prompt>
```

## Body: turnaround (16:9)

Model: Nano Banana Pro, horizontal 16:9, with the approved front image attached. Goes in the Body slot.

```text
<Body prompt>
```

## Voice

None. The films have no dialogue.

## Character info

```text
<Character info>
```

## Cast sentence for storyboards

`<Humans:, Animals:, or Creatures: sentence>`

## Fix-up edits

1. <Edit>
2. <Edit>

## Checks

- <The user-facing checks from step 7, written for this character.>
````
