---
name: reel-carousel
description: >-
  Trigger when the user asks for a Facebook carousel, carousel stills, a reel promo post,
  or social copy for a published Yeti reel, says "4 stills from this storyboard",
  "carousel post", "caption for the reel", or runs "/reel-carousel". Takes a storyboard
  file from `prompts/` and a Facebook reel link, then writes one file in `carousels/`
  holding four square 1:1 image prompts for Google Flow that retell the storyboard, built
  from the character locks in `.agents/rules/character-consistency.md` and lit, framed,
  and angled as their shots are, plus a Facebook caption with hashtags, a short alternate
  caption, and four on-image overlay lines.
---

# Reel carousel

A reel is already published. This skill turns its storyboard into the static post that sends people to it: four square stills that read as a board, and the caption that carries them.

Input is a storyboard the project already has in `prompts/` and the reel's Facebook link. Output is one file in `carousels/`.

The stills are generated as images in Google Flow, the same way the grids and panel images in the storyboard's 3x2 file are, with `.agents/rules/character-consistency.md` as the reference for how the Yetis look. So a carousel prompt is built like a panel image prompt: it opens with `Create image:`, carries every lock the rule file sets in the order the rule file sets them, and differs only in being square. The four stills sit side by side in one post, so a Yeti that changes colour, tuft, or size between them is the first thing a viewer notices.

## Ask for these before starting

If the user ran the skill without them, ask for both in one message and wait:

1. The storyboard file, as a path in this project (for example `prompts/babu-yeti-kung-fu-dream-60s-storyboard.md`). A pasted storyboard also works, but a path is better, because the story's locked sentences must be copied from it character for character.
2. The Facebook reel link. The caption is built around it, so do not guess it, and do not write a placeholder and carry on.

Nothing else is needed. If the storyboard has a 3x2 file next to it in `prompts/` (`<slug>-<30s or 60s>-3x2.md`, holding each video's grid and six panel images), the skill finds it and uses it in step 2. An older film may have a reference stills file in `image-prompts/` instead (`<slug>-<30s or 60s>-frames.md`), which works the same way.

## The rule file is the source

Every character sentence in a carousel prompt comes from `.agents/rules/character-consistency.md`, never from the storyboard. A storyboard is written once, and the rule file keeps improving, so an older storyboard can carry character text the rule has since replaced: "vibrant blue fur" instead of the current wording, a smile fixed into the description, no head lock. The storyboard supplies the story (the place, the light, the supporting cast, the action, the effects), and the rule file supplies the characters. Read the rule file in full before writing anything. It binds, and it overrides this file wherever the two disagree.

| Prompt piece | Where it comes from |
| --- | --- |
| `Create image: Square 1:1 aspect ratio, full-frame square composition.` | Fixed, word for word, first in every prompt |
| Style lock | Rule, section 1 |
| `Environment:` sentence | The storyboard shot the still comes from |
| `Lighting:` sentence | The same shot, word for word. For a storyboard older than the `Lighting:` sentence, write one following section 2 of `.agents/rules/cinematic-direction.md` |
| Character text | Rule, sections 2 to 4, with `[EXPRESSION]` filled from the section 5 table |
| Head lock | Rule, section 7 |
| Look lock | Rule, section 9 |
| Scale lock | Rule, section 10, only when the baby Yeti and a grown-up Yeti are both in the still |
| `Humans:`, `Animals:`, or `Creatures:` sentences | The storyboard, word for word |
| Avoid line | Rule, section 11 |
| `Action:` | Written for the still, following sections 5 and 8 and rules 2, 3, 6, 11, and 12 of the rule file |
| `Effects:` | The shot's VFX cell, frozen as section 6 of `cinematic-direction.md` describes |
| `Single square carousel image. No text, captions, or watermark.` | Fixed, word for word, last in every prompt |

Copy the locked sentences from the rule file itself every time, not from this skill, an older carousel, or memory. The check in step 6 reads the rule file and compares every prompt against it.

## Rules that always apply

Every rule in the rule file applies. These are the ones a carousel gets wrong most often:

- Papa Yeti, Mama Yeti, and Babu Yeti are the heroes (section 6 and rule 9). If the storyboard's source has another character noticing, acting, helping, or rescuing, the beat moves to a Yeti. Never drop, rename, or recolour a Yeti to fit a still.
- The face matches the beat (section 5 and rule 3). Pick the row for what each Yeti feels at the still's instant, and state the same feeling in the `Action:`. No smile of any kind on a beat of danger, worry, effort, sadness, or loss, and the "no smile" words stay in the text. A smile fixed into an older storyboard's character text is not a filled slot: pick the row the beat calls for.
- The `Action:` agrees with section 8 and rules 11 and 12. Each Yeti is named by colour ("the blue Yeti", "the pink Yeti", "the baby Yeti"), never by name. Paws, not hands. Nothing worn. Babu about half a grown-up's height.
- Nothing on or above a Yeti's head (rule 6). Keep mimes and held objects at chest height, and a head touch says the paw lifts away in the same sentence.
- No Yeti casts energy or changes its own body (rule 8). Write magic as a change in light or weather near the character.
- Absence is stated. Image models draw every character a prompt describes, so each `Action:` names the Yetis, humans, and animals from the storyboard that are not in the still. A supporting cast sentence goes into all four stills, including the ones where that character is off screen, the same way the storyboard carries it.
- No sentence sizes a place or a prop by a Yeti (section 10). If an older storyboard's `Environment:` sentence does ("a pillar as tall as a grown Yeti"), reword only that phrase in the carousel prompts, size it by the world instead, and say so in the file's intro.
- No text of any kind inside an image: no dialogue, speech bubbles, captions, logos, or signs. The overlay lines at the end of the file are added in the editor, not by the image model.
- Never a plain white, solid colour, or empty studio background (rule 5). No audio text: these are stills.
- Each still is lit and framed as its shot is at that instant: the `Lighting:` sentence from the shot, the framing and angle from its Shot Type cell, the effects from its VFX cell, frozen. No camera move, transition, slow motion, or motion blur on a face.

## Workflow

### 1. Read the references

In this order: `.agents/rules/character-consistency.md` in full; the storyboard in full, including its lock paragraphs above the tables (aspect ratio, head, look, human, animal, prop, environment, lighting, VFX); the 3x2 file, or for an older film the reference stills file, if the storyboard has one; and `.agents/rules/cinematic-direction.md`, for the framing and angle terms, the lighting rules, the panel map in section 6, and how an effect looks when it is frozen in a still. Note which storyboard sentences are locked, because each one is copied, not retyped.

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
5. Character text for every Yeti in the still, from the rule file, with the `[EXPRESSION]` slot filled. With more than one Yeti, separate them (`On the left, ... In the center, ... On the right, ...`) and keep the positions the storyboard gives them.
6. Head lock.
7. Look lock.
8. Scale lock, only when the baby Yeti and a grown-up Yeti are both in the still.
9. `Humans:`, `Animals:`, or `Creatures:` sentences, in all four stills. If the storyboard has none and a still needs supporting cast, write one sentence following section 6 of the rule file and put it in all four.
10. Avoid line.
11. `Action:` opening with `<Framing>, <Angle> square still.`, then the one held instant: where each character sits in the square, pose, props, eye lines, the face each Yeti holds (the same feeling as its slot), and who is not in the still. Present tense, one pose per character, no "then", no "begins to".
12. `Effects:` the shot's effects frozen at this instant, only the ones visible then. Leave the sentence out when none are.
13. `Single square carousel image. No text, captions, or watermark.`

When a still comes from a panel image, or from a reference still in an older film, start from that prompt. Keep its text from the style lock through the avoid line, its `Action:` (with the opener changed to `square still` and the composition fitted to the square), and its `Effects:`. When it comes from a grid panel with no panel image, take the style lock through the avoid line from the panel's storyboard shot, fill each `[EXPRESSION]` slot with the value the panel's `Faces:` list gives that Yeti (a grid's header holds a fixed phrase in the slot, never a face), and write the `Action:` from the panel's picture and the `Effects:` from its row. If the source file is older than the current rule file, so its character text or locks differ from the rule, take those pieces from the rule instead and keep the source's `[EXPRESSION]` values. A frames file in the old five-frame format, written for start and end frames, works as a source the same way a panel image does. A still written twice from scratch drifts.

A square loses the top and bottom of a vertical frame and the sides of a widescreen one. Say where each character sits in the square so that no head, tuft, or paw is cut off, and bring a background element into view in the `Action:` if the story needs it.

### 4. Write the Facebook post

The caption sells the carousel and the reel, in plain warm language a global audience reads without effort. Short sentences, no idioms, no slang that needs local context.

- Open with a hook, not a summary. The first line is the part visible before "See more", so it carries the tease and never the ending.
- Put a swipe cue near the top (`Swipe to see what happens →`).
- Run three to six short lines with a blank line between them. No dense paragraphs.
- Put the reel link on its own line with a clear call to watch.
- End with one engagement question that invites a comment.
- Three to six emoji in total, placed as punctuation.
- Use the real names, Papa Yeti, Mama Yeti, Babu Yeti, and never rename them. Names belong in the caption; the image prompts name the Yetis by colour.
- No dialogue quotes attributed to the characters.

Hashtags go in their own block at the end, 18 to 24 of them, ordered niche to broad, in three tiers: brand and series tags, niche content tags (3D animation, CGI, character animation, wholesome, family), and broad reach tags (`#reels #fbreels #facebookreels #viral #trending #explore #fyp`). The niche tags carry the discovery weight, so make them specific to this story's subject rather than generic. No banned, spammy, or engagement-bait tags, and no tag that misrepresents the content.

Then write the two extras: an alternate caption of two or three lines for A/B testing, and four on-image overlay lines, one per still, under eight words each, in story order.

### 5. Save the file

Save to `carousels/<slug>-carousel.md`. The slug is the storyboard's filename with `-30s-storyboard`, `-60s-storyboard`, or `-storyboard` cut off, so `prompts/babu-yeti-kung-fu-dream-60s-storyboard.md` becomes `carousels/babu-yeti-kung-fu-dream-carousel.md`. Create `carousels/` if it does not exist. Never save a carousel under `prompts/` or `image-prompts/`.

### 6. Verify before finishing

Run the lock check first:

```
python3 .agents/skills/reel-carousel/check_locks.py carousels/<slug>-carousel.md
```

It reads the rule file and checks each still prompt: the opening and closing lines; the style lock, head lock, look lock, and avoid line, word for word; the scale lock in every still where the baby Yeti and a grown-up Yeti share the frame and in no other; every character text against sections 2 to 4, with an expression from the section 5 table; the order of the pieces; no `Camera:` or `Transition:` text; and the same supporting cast sentences in all four stills. It prints `OK` or the problems for each still. Fix every problem and run it again until all four print `OK`.

Then check what the script cannot. Fix what fails and re-check. Report a partial result only if something is genuinely blocked.

Each still prompt:

- [ ] `Environment:` drawn from the storyboard, not white or empty, and it sizes nothing by a Yeti.
- [ ] `Lighting:` copied from the shot (or, for an older storyboard, written from the environment's own light sources), with a soft warm light on the fur and no light from below a face.
- [ ] Each `[EXPRESSION]` value fits the beat at this instant and agrees with the `Action:`. No smile on a beat of danger, worry, effort, sadness, or loss.
- [ ] `Action:` opens with the framing, the angle, and "square still", describes one held instant, places each character in the square, names each Yeti by colour, agrees with section 8 of the rule file, and names who is not in the still. Nothing on or above any head.
- [ ] A Yeti holds the hero beat.
- [ ] Any `Effects:` sentence holds only the shot's own effects, frozen, and nothing a Yeti gives off.
- [ ] No audio text, no dialogue, no on-image text or watermark.

The file as a whole:

- [ ] Exactly four stills, in story order, each headed with its video, shot, and film timecode, and its panel image or reference still when it comes from one.
- [ ] Four different framings, at least one of them a Low or High Angle.
- [ ] Still 1 is the strongest image and does not spoil the ending; Still 4 holds the payoff.
- [ ] The intro names the rule file and says which stills come from which panel images or reference stills, and the Flow steps from the template are present.

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

Each prompt is built from `.agents/rules/character-consistency.md`: the style lock, the character text with its `[EXPRESSION]` slot filled for the still's beat, the head lock, the look lock, the scale lock where the baby Yeti and a grown-up Yeti share the still, and the avoid line. Around them sit the environment, lighting, and supporting cast sentences of the matching storyboard shot, with the `Action:` written as a single held image in a square and the shot's effects frozen in place. <If any: Stills <n> and <n> take their instant from Video <N> panel images <p> and <p> in `prompts/<slug>-<30s or 60s>-3x2.md`.> <If the environment was reworded: what changed and why.>

To generate the stills in Google Flow:

1. Set the image output to square 1:1.
2. Attach the family reference image to every generation. For a still whose heading names a panel image, attach that panel's generated image as well.
3. Paste one prompt at a time, whole, and do not edit its locked sentences.
4. Run the look check in section 12 of `.agents/rules/character-consistency.md` on each still: each Yeti in its own colour with its own tuft, Babu about half a grown-up's height, nothing worn and nothing on any head, exactly the Yetis the prompt names, and the face the prompt names. Regenerate a still that fails. Then look at the four side by side, the way a viewer will, and regenerate any still where a Yeti looks different from the other three.
5. If Flow refuses a still, change only its `Action:` and `Effects:` text and keep every locked sentence.
6. Export each still at 1080x1080 and post the four in order as a Facebook carousel.

## Still prompts

### Still 1 · Video <N> Shot <S> · film <mm:ss>–<mm:ss> · <Panel <p> · if it comes from a panel image><Framing>, <Angle> · <Short title>

```
Create image: Square 1:1 aspect ratio, full-frame square composition. <Style lock, rule section 1> Environment: <sentence from the shot>. Lighting: <sentence from the shot>. <Character text from rule sections 2 to 4 with the expression filled, as On the left, ... In the center, ... On the right, ... when there is more than one Yeti> <Head lock, rule section 7> <Look lock, rule section 9> <Scale lock, rule section 10, only when the baby Yeti and a grown-up Yeti are both in the still> <Humans: / Animals: / Creatures: sentences from the storyboard, if any> <Avoid line, rule section 11> Action: <Framing>, <Angle> square still. <The held image: where each character sits in the square, poses, props, eye lines, faces, and who is not in the still.> Effects: <the shot's effects frozen at this instant, if any>. Single square carousel image. No text, captions, or watermark.
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
