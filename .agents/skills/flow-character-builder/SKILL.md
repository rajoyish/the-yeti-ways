---
name: flow-character-builder
description: >-
  Trigger when the user asks for a Google Flow Character, a front and turnaround, a
  character sheet, Character panel prompts, or Characters for a storyboard's cast, or runs
  "/flow-character-builder" or "/flow-character". Works from either input: (1) a draft
  prompt or description of one character (a person, an animal, or an invented creature, in
  any style, even a realistic photo prompt), which it revises and improves; or (2) a
  storyboard file from `prompts/`, from which it reads the story cast (Instruction 2's Story cast line, the Agent
  prompts' Cast lines, and their shot lines) and builds a Character for
  each member, or only the ones the user names. Each character becomes one stylized 3D CGI
  design that matches the Yetis' look, in one file in `prompts/characters/` holding
  everything Flow's New character screen needs: the Character name, the Portrait image
  prompt (front view, 1:1), the Body image prompt (turnaround, 16:9, made from the approved
  front), the Character info text, short fix-up edits, the cast sentences the storyboards
  use, and the checks. The user generates and approves the two images first, then builds
  the Character in Flow's Characters panel from them.
---

# Flow character builder

This skill turns a character into a saved Google Flow Character that can stand in a scene with Papa Yeti, Mama Yeti, and Babu Yeti. The output is the same every time: one stylized 3D CGI character, drawn twice on white (a front view and a turnaround), plus the text that goes into Flow's New character screen, saved as one file per character.

Flow's New character screen has, on the left, the name (click the pencil beside "Untitled character"), "Select a voice", and "Character info (optional)" ("Describe how your character acts..."; "The Flow agent can use this information to help craft scenes with your character"). On the right are two image slots, **Portrait** and **Body**, a "What do you want to change?" edit box, Format, and the image model (Nano Banana Pro). The front view goes in Portrait and the turnaround in Body.

Read before writing: `.agents/rules/google-flow.md` (section 2, the saved Characters) and sections 6 (the story cast and its Character names) and 10 (originality) of `.agents/rules/prompt-assembly.md`.

**The name is the link.** This skill and the storyboard skills (`storyboard-30s`, `storyboard-60s`) work on the same characters, so a Character's name is spelled exactly the same in the storyboard (its cast sentence, every `Action:`, the `Characters:` lines, Instruction 2, every `Cast:` line), in its file here, and in Flow. In storyboard mode the name is copied from the storyboard, never re-chosen; in draft mode the name chosen here is the one every later storyboard uses. Section 6 of `prompt-assembly.md` sets the rules for a name. Never use this skill to redesign Papa Yeti, Mama Yeti, or Babu Yeti: their look is fixed in `.agents/rules/character-consistency.md` and their Characters already exist. A request for a fourth Yeti is refused, because the films only ever have those three.

**The reference budget.** Omni Flash takes at most 7 references per clip, and every saved Character called in a prompt is one of them, whether it holds one image or two (Portrait and Body): Flow counts "character entities" one each, next to the image plates (section 1 of `.agents/rules/google-flow.md`). Papa Yeti, Mama Yeti, and Babu Yeti are the films' main characters, so their 3 slots are reserved in every video, whether or not all three appear in it. That leaves 4 references per video for everything else:

- the opening image (a plate or the previous clip's end frame), which every video has: 1;
- a second plate, if the video cuts to a second location: 1;
- the story cast Characters the video calls with `@`: the rest.

So a video can call at most 3 story cast Characters, or 2 when it uses a second plate. A group of identical members (`each @Grey Wolf`) is one Character and counts once. A story cast member beyond the budget is kept **described-only**: it gets no Character and no file, the storyboard writes it in the `Cast:` line without `@`, described in words, and it uses no reference. Prefer described-only for members who are on screen in one shot, stay in the background, or need no exact look across videos; build Characters for the members the story turns on and those seen in more than one video. Every Character this skill builds is one more `@` name in the videos it appears in, so check the budget before building, and tell the user when a Character cannot be called in some video without going over.

## 0. Pick the mode

Look at what the user gave:

- **Draft mode:** a prompt, description, idea, or list of traits for a character, pasted in the message or in a file that is not a storyboard. Go to step 1A. One draft makes one character; if the draft holds several distinct characters, build each one as its own file.
- **Storyboard mode:** a path to a storyboard in `prompts/` (`*-storyboard.md`), or a request like "make Characters for the cast of <film>". Go to step 1B. If the user names only some cast members ("just the owl"), build only those.
- **Both:** a storyboard plus the user's own notes on a character ("the owl should be smaller, with grey ear tufts"). Use storyboard mode, and apply the notes on top of that member's storyboard description as the user's revisions.

If the input is neither a character description nor a storyboard (for example a 3x2 or triptych file), say so and ask for the storyboard or a draft. Never guess a character the input does not describe.

## 1A. Read and improve a draft

Write down, before drafting:

- **Who it is:** species or kind, age (baby, child, adult, elder), and the role it will play if the user says.
- **Identity traits to keep:** every colour, marking, shape, and proportion the draft gives (for the penguin draft: black head, distinct white eye-ring, bright white throat and plump belly, pale pink feet, a beak, flippers). These are the character.
- **Pose to keep:** keep the draft's pose if it shows the limbs open and clear (outstretched flippers, open arms); otherwise use the standard front pose in step 3.
- **Scene to drop:** location, weather, background, props it does not own, camera and lens terms, and photo or quality words ("realistic", "photograph", "wildlife photo", "telephoto lens", "shallow depth of field", "bokeh", "8k", "photorealistic", "hyperreal"). They fight the 3D style lock and the white background. Note the draft's setting for the user; it belongs in a storyboard's `Environment:` sentence, not in the Character.
- **Problems to fix:** anything in the draft that would break the films' rules: a franchise, brand, or famous design; "in the style of"; a scary, gory, or aggressive look; a weapon; a real person's likeness; writing or logos on clothing; vague or conflicting colours ("bluish-green or teal"); a trait that contradicts another. Keep the intent and rewrite the trait (a "fierce" wolf becomes a wary, lean wolf with narrowed eyes; a sword becomes nothing, or a plain wooden staff if the role needs one). List each fix for the user.
- **Gaps to fill:** eye colour and size, expression at rest, mouth or beak, surface texture (fur, feathers, scales, skin, cloth), the exact count of fingers, toes, or flipper tips, and whether there is a tail. Fill each with a choice that suits the species and the Yetis' world, and list the choices for the user.
- **Name:** the user's, or, if none is given, a short original two- or three-word name that reads well after `@` and as a proper noun in a sentence (`Pip Penguin`, `Old Mountain Teacher`), marked as a suggestion. It follows section 6 of `prompt-assembly.md`: title case, no "the", no "Yeti", not a real person or a known character. List `prompts/characters/` first: if a file there already uses the name, say so and either revise that file (if it is the same character) or choose another name. Tell the user that storyboards will call the character by this exact name.

Then go to step 2.

## 1B. Read a storyboard's cast

1. **Read the storyboard** and find the story cast in three places:
   - the `Cast:` paragraph of `Instruction 2` (the Story cast list: every member's Character name and the videos they are in);
   - the Agent prompts' `Cast:` lines: every member's `@` name, and, for a member with no file in `prompts/characters/`, its short description (if the descriptions differ between videos, use the fullest one and tell the user which videos disagree);
   - the shot lines of the Agent prompts, for each member's role, how it moves, what it carries, what its beats show about its body (talons that grip, hands that hold), and who it stands beside.
   An older table storyboard (see `.agents/backups/2026-10-31-table-storyboards/`) also has `Humans:`, `Animals:`, and `Creatures:` sentences in its table rows and `Action:` text; read those the same way.
2. **List the members.** One entry per Character name (`Old Herb-Gatherer`, `Snowy Owl`), copied from the storyboard exactly, letter for letter, hyphens and capitals included. An older storyboard that calls its cast by lower-case handles (`the old herb-gatherer`) has no names yet: the name is the handle in title case without "the" (`Old Herb-Gatherer`), and the storyboard is renamed to match (step 4 below). Skip:
   - Papa Yeti, Mama Yeti, and Babu Yeti (they already exist);
   - anyone already saved as a Character: the sentence only names them "exactly as their saved Characters", or `prompts/characters/<kebab-case-name>-flow-character.md` already exists for that name (say so, and offer to revise that file instead);
   - background extras with no Character name and no description (a distant crowd, birds in the sky). They stay in the `Environment:` text.
3. **Groups.** A group of identical members ("exactly three Grey Wolves") is one Character under the storyboard's singular name (`Grey Wolf`), with a note that the storyboard calls it with its count. If the members of a group are told apart (a big wolf and two small ones), build one Character per different design.
3a. **Check the budget, video by video.** For each video, count its images (the opening image, plus a second plate if its first line names one) and its story cast members, counting a group once, and compare with the 4 free references above. Where a video has more story cast than it can call, mark members as described-only until it fits, choosing by the rule above (one-shot, background, or no exact look needed first); a member who must be a Character in one video and is over budget in another is a Character, and that other video calls it described-only only if the story allows (otherwise say so and suggest cutting it from that video or splitting the video). Already-saved Characters count like any other.
4. **Show the list to the user before writing**, one line each: the Character name, the kind, the videos it is in, and whether it will be a Character or kept described-only, plus a line per video with its count (`Video 3: 1 image + 3 Yetis + 3 story cast Characters = 7 of 7`), plus anything skipped and why. Build only the members marked as Characters. If the storyboard used lower-case handles, say so here and list each handle with its new name; once the user confirms, rename every mention in the storyboard as step 1b of the storyboard skills' older-storyboard update sets out (the handle becomes the name; nothing else in the storyboard changes), and tell the user. If the user asked for specific members, or there is only one member with names already in place, go straight on.
5. **Each member's draft is its storyboard description.** Treat it as the draft in step 1A, with these differences:
   - Every trait the storyboard gives is locked: same colours, markings, clothing, carried props it owns (a lantern it always holds), age, and size words. The Character must match what the storyboard's clips and stills already show. Improve only by filling gaps (digit counts, eye colour, tail, texture, the back) and by fixing rule breaks (as in step 1A), and list both.
   - A trait the storyboard leaves out is not invented if a shot shows it otherwise (read the shot lines: if the owl "lifts the pouch in its talons", it has talons; if the girl "pulls the quilt up with both hands", her hands are free in the front pose).
   - **Name** is the storyboard's Character name, copied exactly. If the user wants a different name, the new name must be changed in the storyboard too, in every place it appears, so the two still match; say so and do both, or neither.
   - **Role and behaviour** for the Character info come from the storyboard: what the member does, its mood, how it moves, and how it treats the Yetis. Leave out the plot and the setting.
   - **Height beside a Yeti:** if the storyboard places the member beside a Yeti with a size ("reaches Papa Yeti's knee", "about Babu Yeti's height"), keep it for the Character info and for the `Cast:` line entry in step 4. A Character image cannot carry scale, so it lives in the storyboard sentence.

Then go to step 2 for each member, one file each.

## 2. Convert to the house style

Every Character must look like it belongs in the same film as the Yetis:

- Stylized 3D CGI, never photoreal: a soft, rounded, appealing cartoon body, a slightly larger head than real life (much larger for a baby), large glossy cartoon eyes with dark pupils and bright catchlights, and simplified, readable shapes. Real-world anatomy stays true to the species (a penguin has flippers and webbed feet, not hands) while the proportions go cartoon.
- Surface in ultra-realistic strand detail: fur, feathers, or hair rendered strand by strand, as the Yetis' fur is; fabric, scales, or skin smooth and slightly matte.
- One fixed palette: name every colour region once, plainly ("solid black", "bright white", "pale pink"), and say there are no other colours or markings.
- Original design. No franchise, film, mascot, or brand name, no "in the style of", and no famous design (a penguin is fine; a penguin in a bow tie with a tap-dance pose, or the look of a known animated penguin, is not). Add one small distinctive detail of your own only if the draft has none, and tell the user. In storyboard mode, add nothing the storyboard's shots would contradict.
- Count every digit. State the number of fingers, toes, or flipper tips for each limb in words in every prompt ("five separate fingers on each hand", "three short webbed toes on each foot"), because image models drift on unstated counts. Humans and humanlike creatures get five fingers.
- Nothing worn unless the character's design needs it; a human gets simple, plain clothing for its world with no logos or writing.
- Friendly at rest. A member who plays a threat (a wolf, a rival) is drawn wary or stern at most, never snarling, bloody, or monstrous; the scene's acting supplies the menace. A human child is gentle and safe-looking, never shown hurt or ill in the Character images.

## 3. Write the two image prompts

**Portrait (front view, 1:1).** One fenced `text` block, about 150 to 220 words, in this order:

1. `Create image: Square 1:1 aspect ratio, full-body character reference.`
2. The style line: `3D animated premium character render, high-quality 3D CGI, ultra-realistic soft <fur, feather, or hair> texture with individually rendered strands, soft even studio lighting with a gentle warm rim light.`
3. The character, head to toe: kind and age, build and proportions, every colour region, head and face (eyes, brows, nose or beak, mouth, ears, crest or tuft), limbs with their digit counts, feet, tail or "no tail", and anything worn or always carried.
4. The pose: standing upright, facing the camera straight on, the whole body from the top of the head to the feet in frame with a small margin, limbs slightly away from the body and open so every digit shows separately (or the draft's open pose), a friendly, gentle expression. A carried prop is held in one hand, clear of the body, with the other hand open.
5. The background: `on a seamless pure white background with only a soft contact shadow under the feet, no floor line, no horizon, no props, no text.`
6. `Avoid:` photorealism, extra characters, extra or missing digits, a second colour that is not in the palette, clothing or accessories it does not have, scary or aggressive features, text, watermarks.

**Body (turnaround, 16:9).** One fenced `text` block, generated with the approved front image attached, in this order:

1. `Create image: Horizontal 16:9 aspect ratio, character turnaround sheet. Use the attached image as the exact character: same design, colours, proportions, face, and texture.`
2. The style line from the Portrait prompt, word for word.
3. A short identity reminder (two or three sentences: the palette, the head, the limbs with their digit counts, tail or no tail).
4. The views: `Three full-body views of the same character side by side, from left to right: an exact side view facing left, a straight back view, and a rear three-quarter view with the head turned to look back over the shoulder. All three at the same size and height, feet on the same level, each filling nearly the full image height, evenly spaced.`
5. The back: one sentence on what the back looks like (for a furred or feathered character, the same thick fur or feathers cover the whole back down to the legs; for a clothed human, the back of the clothing, plain, with no writing; for a Yeti-like creature, no bare patch and no tail unless it has one).
6. `On one seamless pure white background with soft contact shadows, no dividers, no labels, no text, no floor line.`
7. The same `Avoid:` line.

## 4. Write the Character screen text

- **Character name:** the name, in title case, exactly as prompts will call it with `@`.
- **Voice:** `None.` The films have no dialogue. Skip "Select a voice" unless the user asks.
- **Character info:** one fenced `text` block, 120 to 200 words, for "Character info (optional)". The Flow agent reads it to craft scenes, so it says how the character acts and how it is drawn: one line of who it is and its role; its personality; how it moves (gait, gestures, the sounds it makes, never words); how it behaves around the Yetis if it shares their films; its height beside them if known; then a compact look summary (palette, head, limbs with digit counts, tail or no tail, what it wears or always carries) and what it is never shown as (photoreal, scary, a second design, extra digits). No scene, setting, or story beat.
- **Cast sentences:** two, both in the `Humans:`, `Animals:`, or `Creatures:` form of `prompt-assembly.md` section 6:
  - **Full sentence**, for still image prompts, where no saved Character is attached: it opens with the Character name, exactly as spelled everywhere else, then the look head to toe, and names no other character (no "Babu Yeti's friend"), because storyboards copy it into shots where that other character is absent; ending with "exactly one" (or the group's count: `Animals: exactly three Grey Wolves, lean stylized cartoon grey wolves with ...`). In storyboard mode, start from the storyboard's sentence for this member and change it only where step 1B filled a gap or fixed a rule break, so the stills match the Character.
  - **`Cast:` line entry**, for the Agent prompts: `@<Character Name>`, with no description and no place (each shot line places it), plus, if the story needs one, a height sentence for the `Cast:` line (`Nuri Bear, on her hind legs, is about as tall as Babu Yeti's shoulders.`); for a group, `exactly <n> <plural name>, each @<singular name>`. Every Agent prompt writes it this way from the moment this file exists, saved or not: the Flow Character Linker extension turns `@<Character Name>` into a Character chip once the Character is saved, and leaves it as plain text until then (section 6 of `google-flow.md`).

## 5. Write the fix-up edits

Two or three short edits for Flow's "What do you want to change?" box, each starting `Edit only <the part>. Keep everything else exactly as it is.`, for the faults this character is most likely to get: wrong digit count (name each digit, one limb at a time), a floor line or horizon, a stray colour or marking, a photoreal or scary drift, a tail that should not be there, a missing carried prop. Edits fix one thing; never regenerate the whole character from text, because a full recreate redesigns it.

## 6. Save the file

Save each character to `prompts/characters/<kebab-case-name>-flow-character.md`, where the kebab-case name is the Character name in lower case with spaces turned into hyphens (`Old Herb-Gatherer` becomes `old-herb-gatherer-flow-character.md`), so a storyboard's name always leads to its file. Use the template below. Never overwrite an existing file without saying so. In storyboard mode, write the `Source:` line with the storyboard's path.

In draft mode, also tell the user, in one line, that a video can call at most 3 story cast Characters next to the three Yetis (2 if it uses a second plate), because Omni Flash takes 7 references and the Yetis hold 3.

Then give the user the steps, once for all the files:

1. Generate each Portrait prompt in Flow with Nano Banana Pro at 1:1. Check it (step 7) and fix it with the edits. Save it as `references/characters/<kebab-case-name>-front.png`.
2. Generate each Body prompt at 16:9 with the approved front image attached. Check it and save it as `references/characters/<kebab-case-name>-turnaround.png`.
3. In the film's project, open Characters, click New character, name it, skip the voice, paste the Character info, upload the front image into Portrait and the turnaround into Body, and click Done. Type `@` in the prompt box to check the name resolves.

In storyboard mode, the file is not finished until the storyboard agrees with it. After saving the files (and after the user confirmed the list in step 1B), update the storyboard for each member built, as `prompt-assembly.md` section 6 sets out, and tell the user what changed:

0. Make the budget hold: in every video, the images plus the 3 reserved Yeti slots plus the story cast called with `@` come to 7 or fewer. Write each described-only member in its `Cast:` lines without `@`, by its Character name and a short description, and update the `References:` count on each video's `Images:` line and in the Image map (a described-only member adds nothing).
1. In every Agent prompt's `Cast:` line, replace the member's entry with `@<Character Name>`, no description and no place, and add the name to the `<names> exactly as their saved Characters.` sentence. Members not built (no file) keep `@<Character Name>` and their short description.
2. In Instruction 2, move the members built from "described in each prompt" to "saved as Characters".
3. The storyboard holds no table, so nothing else changes. (In an older table storyboard, also replace the member's part of each `Humans:`, `Animals:`, or `Creatures:` sentence in its table rows with the Full sentence's description from its file, word for word.)

Never touch the shot lines (or an older storyboard's `Action:` text): the names already match. Then tell the user to link each pasted Agent prompt with Flow Character Linker (the **@ Link** pill or Alt+Shift+L); any name its toast lists as unmatched is a Character not yet saved in the project.

## 7. Checks

Before saving each file:

- [ ] No photo, lens, or quality words from the draft survive (`grep -iE "photo|realistic|telephoto|lens|depth of field|bokeh|8k|hyperreal" ` finds them only inside "Avoid:" or "ultra-realistic soft ... texture").
- [ ] Every identity trait from the draft (or the storyboard sentence) is in the Portrait prompt, and every colour region is named once.
- [ ] In storyboard mode, nothing contradicts the storyboard's sentence or its `Action:` text, and every change is listed under "Draft changes".
- [ ] Every prompt states the digit count of every limb in words, and says tail or no tail.
- [ ] Both prompts put the character on seamless white with no floor line, props it does not own, or text; the turnaround has three views, same size, feet level, no labels.
- [ ] No franchise, brand, real person, or "in the style of"; the design is original and friendly at rest.
- [ ] The Character info describes behaviour and look, no scene, and is under 200 words.
- [ ] Neither a Yeti nor an already-saved Character got a new file.
- [ ] In storyboard mode, no video goes over budget: its images plus the 3 reserved Yeti slots plus its story cast called with `@` come to 7 or fewer (at most 4 for images and story cast together), every member over budget is described-only (no file, no `@`), and each video's `References:` count is updated.
- [ ] The Character name is spelled exactly as the storyboard spells it (storyboard mode: `grep -c "<Character Name>" <storyboard>` is above 0, and no lower-case handle for it is left), in the heading, the `Character name` section, both cast sentences, and the file name.

For the user, after generating each image: the whole body is in frame; the digits are the right number and separate; the palette is exactly as written with no extra markings; the face is friendly; the background is pure white with no line; in the turnaround, all three views are the same character at the same size, and the back matches the description.

## Output template

````markdown
# <Character Name> Flow Character

<One sentence: who the character is, converted from the user's draft (or the storyboard's cast) into the stylized 3D style of the Yeti films.>

Source: <"User draft" or the storyboard path, for example `prompts/babu-yeti-moonlit-herb-rescue-30s-storyboard.md` (Videos 1 to 3)>

Draft changes: <the scene, photo, and quality terms dropped, the rule breaks fixed, the gaps filled with choices, and any detail added for originality.>

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

## Cast sentences for storyboards

Full, for still image prompts:

`<Humans:, Animals:, or Creatures: full sentence>`

`Cast:` line entry, for the Agent prompts:

`@<Character Name>`

## Fix-up edits

1. <Edit>
2. <Edit>

## Checks

- <The user-facing checks from step 7, written for this character.>
````
