---
name: reel-carousel
description: >-
  Trigger when the user asks for a Facebook carousel, carousel stills, a reel promo post,
  or social copy for a published Yeti reel, says "4 stills from this storyboard",
  "carousel post", "caption for the reel", or runs "/reel-carousel". Takes a storyboard
  file from `prompts/` and a Facebook reel link, then writes one file in `carousels/`
  holding four square 1:1 image prompts for Google Flow that retell the storyboard, built
  from the character locks in `.agents/rules/character-consistency.md`, assembled as
  `.agents/rules/prompt-assembly.md` sets out, and lit, framed,
  and angled as their shots are, plus a Facebook caption with hashtags, a short alternate
  caption, and four on-image overlay lines.
---

# Reel carousel

A reel is already published. This skill turns its storyboard into the static post that sends people to it: four square stills that read as a board, and the caption that carries them.

Input is a storyboard the project already has in `prompts/` and the reel's Facebook link. Output is one file in `carousels/`.

The stills are generated as images in Google Flow, the same way the panel images in the storyboard's 3x2 file are, with `.agents/rules/character-consistency.md` as the reference for how the Yetis look. So a carousel prompt is built like a panel image prompt: it opens with `Create image:`, carries the full character lock of every Yeti in it and the other locked pieces in the still order of section 2 of `.agents/rules/prompt-assembly.md`, and differs only in being square. The four stills sit side by side in one post, so a Yeti that changes colour, tuft, or size between them is the first thing a viewer notices.

## Ask for these before starting

If the user ran the skill without them, ask for both in one message and wait:

1. The storyboard file, as a path in this project (for example `prompts/babu-yeti-kung-fu-dream-60s-storyboard.md`). A pasted storyboard also works, but a path is better, because the story's locked sentences must be copied from it character for character.
2. The Facebook reel link. The caption is built around it, so do not guess it, and do not write a placeholder and carry on.

Nothing else is needed. If the storyboard has a 3x2 file next to it in `prompts/` (`<slug>-<30s or 60s>-3x2.md`, holding each video's six panel images, with its grid composed from them), the skill finds it and uses it in step 2. An older film may have a reference stills file in `image-prompts/` instead (`<slug>-<30s or 60s>-frames.md`), which works the same way.

## The rule files are the source

Every character lock in a carousel prompt comes from `.agents/rules/character-consistency.md` (the default; never `character-consistency-alt.md` unless the user asks for it by name), and the style lock, the expression table, and the avoid line from `.agents/rules/prompt-assembly.md`, never from the storyboard. A storyboard is written once, and the rule files keep improving, so an older storyboard can carry character text the rules have since replaced: "vibrant blue fur", a smile fixed into the description, an `[EXPRESSION]` slot, or head, look, and scale lock sentences. The storyboard supplies the story (the place, the light, the supporting cast, the action, the effects, and each Yeti's feeling), and the rule files supply the characters. Read both rule files in full before writing anything. They bind, and they override this file wherever they disagree.

| Prompt piece | Where it comes from |
| --- | --- |
| `Create image: Square 1:1 aspect ratio, full-frame square composition.` | Fixed, word for word, first in every prompt |
| Style lock | `prompt-assembly.md`, section 1 |
| `Environment:` sentence | The storyboard shot the still comes from |
| `Lighting:` sentence | The same shot, word for word. For a storyboard older than the `Lighting:` sentence, write one following section 2 of `.agents/rules/cinematic-direction.md` |
| Character locks | `character-consistency.md`, the Copy-Ready Google Flow Character Lock of each Yeti in the still, whole, placed as section 3 of `prompt-assembly.md` sets out |
| `Expressions:` sentence | Each Yeti's face, a row from the section 4 table of `prompt-assembly.md` |
| `Humans:`, `Animals:`, or `Creatures:` sentences | The storyboard, word for word |
| Avoid line | `prompt-assembly.md`, section 5 |
| `Action:` | Written for the still, following sections 4 and 8 of `prompt-assembly.md` and the character locks |
| `Effects:` | The shot's VFX cell, frozen as section 6 of `cinematic-direction.md` describes |
| `Single square carousel image. No text, captions, or watermark.` | Fixed, word for word, last in every prompt |

Copy the locked sentences from the rule files themselves every time, not from this skill, an older carousel, or memory. The check in step 6 reads the rule files and compares every prompt against them.

## Rules that always apply

Every rule in both rule files applies. These are the ones a carousel gets wrong most often:

- Papa Yeti, Mama Yeti, and Babu Yeti are the heroes (section 6 of `prompt-assembly.md`). If the storyboard's source has another character noticing, acting, helping, or rescuing, the beat moves to a Yeti. Never drop, rename, or recolour a Yeti to fit a still.
- The face matches the beat (section 4 of `prompt-assembly.md`). Pick the row for what each Yeti feels at the still's instant, put it in the `Expressions:` sentence, and state the same feeling in the `Action:`. No smile of any kind on a beat of danger, worry, effort, sadness, or loss, and the "no smile" words stay in the text. A smile fixed into an older storyboard's character text is not a chosen face: pick the row the beat calls for.
- The `Action:` agrees with the character locks and section 8 of `prompt-assembly.md`. Each Yeti is named by name ("Papa Yeti", "Mama Yeti", "Babu Yeti"), never by colour. Paws, not hands. Nothing worn. Babu Yeti about half a grown-up's height.
- Each still is a fresh generation, so it carries the full lock of every Yeti in it. Never shorten a lock for a close-up or a wide, and never give a Yeti who is not in the still a lock.
- Nothing on or above a Yeti's head (rule 5 in section 8 of `prompt-assembly.md`). Keep mimes and held objects at chest height, and a head touch says the paw lifts away in the same sentence.
- No Yeti casts energy or changes its own body (rule 7). Write magic as a change in light or weather near the character.
- Absence is stated. Image models draw every character a prompt describes, so each `Action:` names the Yetis, humans, and animals from the storyboard that are not in the still. A supporting cast sentence goes into all four stills, including the ones where that character is off screen, the same way the storyboard carries it.
- No sentence sizes a place or a prop by a Yeti (rule 6). If an older storyboard's `Environment:` sentence does ("a pillar as tall as a grown Yeti"), reword only that phrase in the carousel prompts, size it by the world instead, and say so in the file's intro.
- No text of any kind inside an image: no dialogue, speech bubbles, captions, logos, or signs. The overlay lines at the end of the file are added in the editor, not by the image model.
- Never a plain white, solid colour, or empty studio background (rule 9). No audio text: these are stills.
- Each still is lit and framed as its shot is at that instant: the `Lighting:` sentence from the shot, the framing and angle from its Shot Type cell, the effects from its VFX cell, frozen. No camera move, transition, slow motion, or motion blur on a face.

## Workflow

### 1. Read the references

In this order: `.agents/rules/character-consistency.md` and `.agents/rules/prompt-assembly.md` in full; the storyboard in full, including its lock paragraphs above the tables (aspect ratio, character, human, animal, prop, environment, lighting, VFX) and each video's `Character locks:` block; the 3x2 file, or for an older film the reference stills file, if the storyboard has one; and `.agents/rules/cinematic-direction.md`, for the framing and angle terms, the lighting rules, the panel map in section 6, and how an effect looks when it is frozen in a still. Note which storyboard sentences are locked, because each one is copied, not retyped.

### 2. Choose the four stills

Cover the whole arc: setup, the moment of noticing, the turn or peak, the resolution or the strongest emotional beat.

- A storyboard with more shots than four, which is most of them, needs merging. Merge the weakest neighbours and keep the beats the story turns on. A storyboard with fewer than four shots gets its longest shot split into its two strongest instants. Always land on exactly four.
- Keep story order.
- Vary the framing and angle across the set: a wide, a close-up, a medium, and at least one Low Angle or High Angle. Four versions of one shot is not a board. The same limits apply as in the storyboard: no Bird's-Eye View or steep High Angle on a Yeti who is more than small in the frame.
- Let the light carry the arc. The storyboard's light already moves from soft to low-key at the Climax and back to warm gold, so four stills taken from across the film show that change. Prefer a payoff still whose light is the warmest of the four.
- Still 1 is the scroll-stopper, so give it the strongest image of the four, and Still 4 holds the payoff.
- Never spoil the ending in Still 1, and never put the reel's final reveal anywhere but Still 4.
- If the storyboard has a 3x2 file, take each carousel still from one of its panel images wherever one fits the beat, and name the source in the still's heading by its panel number. The square still then shows an instant the operator has already generated and approved, and in Flow the panel's generated image can be attached next to the family reference image, so it holds both the look and the pose. An older film with only a reference stills file works the same way, with the source named by its still number. A grid panel with no panel image under it is the last choice, because it is one sixth of an image with a label strip above it. A still that merges two shots, or has no matching source, is written fresh from the storyboard.

For each chosen still, write down the video number, the shot number within that video, the shot's own timestamp range, its film position, the panel image or reference still if it comes from one, its framing and angle at the chosen instant (a moving shot opens on one framing and ends on another), its `Lighting:` sentence, which Yetis and supporting characters are in it, the feeling each Yeti holds, and the shot's effects frozen at that instant. A multi-video storyboard runs every table on its own 00:00 to 00:10 clock, and the `Film position:` line under each heading is where that clip sits in the finished reel. Headings use film time, because the caption points at one continuous reel.

### 3. Write the four prompts

Each prompt is one fenced code block holding one paragraph, copy-paste ready, with no commentary inside. The parts, in this order, each from the source the table above gives it:

1. `Create image: Square 1:1 aspect ratio, full-frame square composition.` Nothing comes before it.
2. Style lock.
3. `Environment:` sentence. Identical across the four stills unless the storyboard changes location, in which case each still uses the environment of its own shot.
4. `Lighting:` sentence. Stills from the same location and the same moment in the story share one.
5. The full character lock of every Yeti in the still, from `character-consistency.md`. One Yeti: the lock alone. More than one: `On the left, <lock> On the right, <lock>` or `On the left, <lock> In the center, <lock> On the right, <lock>`, keeping the positions the storyboard gives them. A still with no Yeti says `No Yeti is in this image.` instead.
6. `Expressions:` sentence: each placed Yeti, in the same order, as `<Name>, <row>`, separated by semicolons, with rows from the section 4 table of `prompt-assembly.md`. Left out when the still has no Yeti.
7. `Humans:`, `Animals:`, or `Creatures:` sentences, in all four stills. If the storyboard has none and a still needs supporting cast, write one sentence following section 6 of `prompt-assembly.md` and put it in all four.
8. Avoid line.
9. `Action:` opening with `<Framing>, <Angle> square still.`, then the one held instant: where each character sits in the square, pose, props, eye lines, the face each Yeti holds (the same feeling as its `Expressions:` entry), and who is not in the still. Present tense, one pose per character, no "then", no "begins to".
10. `Effects:` the shot's effects frozen at this instant, only the ones visible then. Leave the sentence out when none are.
11. `Single square carousel image. No text, captions, or watermark.`

When a still comes from a panel image, or from a reference still in an older film, start from that prompt. Keep its text from the style lock through the avoid line, its `Action:` (with the opener changed to `square still` and the composition fitted to the square), and its `Effects:`. When it comes from a grid panel with no panel image, take the style lock, `Environment:`, `Lighting:`, supporting cast, and avoid line from the panel's storyboard shot, place the locks of the Yetis the panel shows, give each the face the panel's `Faces:` list (or its beat) gives it, and write the `Action:` from the panel's picture and the `Effects:` from its row. If the source prompt is older than the current rule files, so it carries the older character text, an `[EXPRESSION]` slot, or head, look, or scale lock sentences, revise it as section 9 of `prompt-assembly.md` sets out: the placed full locks in place of the character text, its `[EXPRESSION]` values moved into the `Expressions:` sentence, and the Yetis in the `Action:` named by name. A frames file in the old five-frame format, written for start and end frames, works as a source the same way a panel image does. A still written twice from scratch drifts.

A square loses the top and bottom of a vertical frame and the sides of a widescreen one. Say where each character sits in the square so that no head, tuft, or paw is cut off, and bring a background element into view in the `Action:` if the story needs it.

### 4. Write the Facebook post

The caption sells the carousel and the reel, in plain warm language a global audience reads without effort. Short sentences, no idioms, no slang that needs local context.

- Open with a hook, not a summary. The first line is the part visible before "See more", so it carries the tease and never the ending.
- Put a swipe cue near the top (`Swipe to see what happens →`).
- Run three to six short lines with a blank line between them. No dense paragraphs.
- Put the reel link on its own line with a clear call to watch.
- End with one engagement question that invites a comment.
- Three to six emoji in total, placed as punctuation.
- Use the real names, Papa Yeti, Mama Yeti, Babu Yeti, and never rename them, the same names the image prompts use.
- No dialogue quotes attributed to the characters.

Hashtags go in their own block at the end, 18 to 24 of them, ordered niche to broad, in three tiers: brand and series tags, niche content tags (3D animation, CGI, character animation, wholesome, family), and broad reach tags (`#reels #fbreels #facebookreels #viral #trending #explore #fyp`). The niche tags carry the discovery weight, so make them specific to this story's subject rather than generic. No banned, spammy, or engagement-bait tags, and no tag that misrepresents the content.

Then write the two extras: an alternate caption of two or three lines for A/B testing, and four on-image overlay lines, one per still, under eight words each, in story order.

### 5. Save the file

Save to `carousels/<slug>-carousel.md`. The slug is the storyboard's filename with `-30s-storyboard`, `-60s-storyboard`, or `-storyboard` cut off, so `prompts/babu-yeti-kung-fu-dream-60s-storyboard.md` becomes `carousels/babu-yeti-kung-fu-dream-carousel.md`. Create `carousels/` if it does not exist. Never save a carousel under `prompts/` or `image-prompts/`.

### 6. Verify before finishing

Run the lock check first:

```
node .agents/skills/reel-carousel/check_locks.mjs carousels/<slug>-carousel.md
```

It reads both rule files and checks each still prompt: the opening and closing lines; the style lock and avoid line, word for word; every character lock word for word, placed with `On the left, ` / `In the center, ` / `On the right, ` when there is more than one; an `Expressions:` sentence naming the placed Yetis in the same order, each face a row of the section 4 table in its column (or the no-Yeti sentence and no `Expressions:` sentence); none of the older character text or lock sentences; the order of the pieces; no `Camera:` or `Transition:` text; and the same supporting cast sentences in all four stills. It prints `OK` or the problems for each still. Fix every problem and run it again until all four print `OK`.

Then check what the script cannot. Fix what fails and re-check. Report a partial result only if something is genuinely blocked.

Each still prompt:

- [ ] `Environment:` drawn from the storyboard, not white or empty, and it sizes nothing by a Yeti.
- [ ] `Lighting:` copied from the shot (or, for an older storyboard, written from the environment's own light sources), with a soft warm light on the fur and no light from below a face.
- [ ] Each face in the `Expressions:` sentence fits the beat at this instant and agrees with the `Action:`. No smile on a beat of danger, worry, effort, sadness, or loss.
- [ ] `Action:` opens with the framing, the angle, and "square still", describes one held instant, places each character in the square on the side its lock is placed, names each Yeti by name, agrees with the character locks, and names who is not in the still. Nothing on or above any head.
- [ ] A Yeti holds the hero beat.
- [ ] Any `Effects:` sentence holds only the shot's own effects, frozen, and nothing a Yeti gives off.
- [ ] No audio text, no dialogue, no on-image text or watermark.

The file as a whole:

- [ ] Exactly four stills, in story order, each headed with its video, shot, and film timecode, and its panel image or reference still when it comes from one.
- [ ] Four different framings, at least one of them a Low or High Angle.
- [ ] Still 1 is the strongest image and does not spoil the ending; Still 4 holds the payoff.
- [ ] The intro names the rule files and says which stills come from which panel images or reference stills, and the Flow steps from the template are present.

The post:

- [ ] Hook in the first line, ending not spoiled.
- [ ] Swipe cue present.
- [ ] Reel link on its own line, and it is the link the user gave.
- [ ] One engagement question.
- [ ] 18 to 24 hashtags, niche to broad, no banned or bait tags.
- [ ] Character names correct.
- [ ] Alternate caption and four overlay lines present, overlays under eight words each.

## Output template

The placeholders in angle brackets name where each piece comes from. In the file, each one is replaced by the full text from that source.

````markdown
# <Title> Carousel

Four square stills and the Facebook post for `prompts/<storyboard-file>.md`. Reel: <reel link>.

Each prompt is built as `.agents/rules/prompt-assembly.md` sets out: the style lock, the full character lock from `.agents/rules/character-consistency.md` of each Yeti in the still, an `Expressions:` sentence with each Yeti's face for the still's beat, and the avoid line. Around them sit the environment, lighting, and supporting cast sentences of the matching storyboard shot, with the `Action:` written as a single held image in a square and the shot's effects frozen in place. <If any: Stills <n> and <n> take their instant from Video <N> panel images <p> and <p> in `prompts/<slug>-<30s or 60s>-3x2.md`.> <If the environment was reworded: what changed and why.>

To generate the stills in Google Flow:

1. Set the image output to square 1:1.
2. Attach the family reference image to every generation. For a still whose heading names a panel image, attach that panel's generated image as well.
3. Paste one prompt at a time, whole, and do not edit its locked sentences or its character locks.
4. Run the look check in section 7 of `.agents/rules/prompt-assembly.md` on each still, which starts from the Final Consistency Checklist in `.agents/rules/character-consistency.md`: each Yeti the same individual as in the reel, in its own colour with its own tuft, Babu Yeti about half a grown-up's height, nothing worn and nothing on any head, exactly the Yetis the prompt names, and the face the prompt names. Regenerate a still that fails. Then look at the four side by side, the way a viewer will, and regenerate any still where a Yeti looks different from the other three, or where two Yetis share a trait (a colour, a tuft, a face, a build) that belongs to only one of them.
5. If Flow refuses a still, change only its `Action:` and `Effects:` text and keep every locked sentence.
6. Export each still at 1080x1080 and post the four in order as a Facebook carousel.

## Still prompts

### Still 1 · Video <N> Shot <S> · film <mm:ss>–<mm:ss> · <Panel <p> · if it comes from a panel image><Framing>, <Angle> · <Short title>

```
Create image: Square 1:1 aspect ratio, full-frame square composition. <Style lock, prompt-assembly.md section 1> Environment: <sentence from the shot>. Lighting: <sentence from the shot>. <The full character lock of each Yeti in the still from character-consistency.md, as On the left, <lock> In the center, <lock> On the right, <lock> when there is more than one Yeti, or: No Yeti is in this image.> Expressions: <Name>, <face from the section 4 table>; <Name>, <face>. <Humans: / Animals: / Creatures: sentences from the storyboard, if any> <Avoid line, prompt-assembly.md section 5> Action: <Framing>, <Angle> square still. <The held image: where each character sits in the square, poses, props, eye lines, faces, and who is not in the still.> Effects: <the shot's effects frozen at this instant, if any>. Single square carousel image. No text, captions, or watermark.
```

### Still 2 · ...

### Still 3 · ...

### Still 4 · ...

## Facebook caption

```
<Hook line>

Swipe to see what happens →

<Two to four short story lines, one per line>

Watch the full reel: <reel link>

<Engagement question>

#tag1 #tag2 ... (18 to 24, niche → broad)
```

## Alternate caption

```
<Two or three lines for A/B testing>
```

## Overlay text

1. Still 1: <under 8 words>
2. Still 2: <under 8 words>
3. Still 3: <under 8 words>
4. Still 4: <under 8 words>
````
