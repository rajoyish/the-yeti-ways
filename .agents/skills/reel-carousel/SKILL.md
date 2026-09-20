---
name: reel-carousel
description: >-
  Trigger when the user asks for a Facebook carousel, carousel stills, a reel promo post,
  or social copy for a published Yeti reel, says "4 stills from this storyboard",
  "carousel post", "caption for the reel", or runs "/reel-carousel". Takes a storyboard
  file from `prompts/` and a Facebook reel link, then writes one file in `carousels/`
  holding four square 1:1 image prompts that retell the storyboard, a Facebook caption
  with hashtags, a short alternate caption, and four on-image overlay lines.
---

# Reel carousel

A reel is already published. This skill turns its storyboard into the static post that sends people to it: four square stills that read as a board, and the caption that carries them.

Input is a storyboard the project already has in `prompts/` and the reel's Facebook link. Output is one file in `carousels/`.

The stills are for an image model, not Flow. They are square, not vertical, and they carry no audio and no dialogue.

## Ask for these before starting

If the user ran the skill without them, ask for both in one message and wait:

1. The storyboard file, as a path in this project (for example `prompts/babu-yeti-kung-fu-dream-60s-storyboard.md`). A pasted storyboard also works, but a path is better, because the locks must be copied from it character for character.
2. The Facebook reel link. The caption is built around it, so do not guess it, and do not write a placeholder and carry on.

Nothing else is needed. The operator attaches the character reference image to the image tool at generation time; this skill works from the text locks.

## Rules that always apply

Read `.agents/rules/character-consistency.md` before writing anything. It binds, and it overrides this file wherever the two disagree.

- Papa Yeti, Mama Yeti, and Babu Yeti are the heroes. If the storyboard's source has another character noticing, acting, helping, or rescuing, the beat moves to a Yeti and the other character goes to the supporting cast. Never drop, rename, or recolour a Yeti to fit a frame.
- Fur colours, facial features, and body shapes never change. `[EXPRESSION]` is the only variable part of a character text.
- Nothing on or above the top of a Yeti's head. Keep mimes and held objects at chest height. If a head touch is unavoidable, say the paw lifts away in the same sentence.
- No Yeti casts energy (dome, wave, beam, burst, pulse, aura, force field) and no Yeti changes its own body. Write magic as a change in light or weather near the character.
- Humans are drawn in the same 3D animated style, rounded and friendly, never photoreal and never a likeness of a real person.
- No dialogue, speech bubbles, captions, subtitles, logos, or written text inside any image. The overlay lines at the end of the file are added by the operator in the editor, not by the image model.
- Drop the storyboard's audio column entirely. These are stills.
- Never a plain white, solid colour, or empty studio background.

## Workflow

### 1. Read both references

Read the storyboard file in full, including its lock paragraphs above the tables (environment lock, prop lock, position lock, creature lock, expression lock). Then read `.agents/rules/character-consistency.md`. Note which sentences are locked, because every one of them is copied, not retyped.

### 2. Choose the four stills

Cover the whole arc: setup, the moment of noticing, the turn or peak, the resolution or the strongest emotional beat.

- A storyboard with more shots than four, which is most of them, needs merging. Merge the weakest neighbours and keep the beats the story turns on. A storyboard with fewer than four shots gets its longest shot split into its two strongest frames. Always land on exactly four.
- Keep story order.
- Vary the framing across the set: wide, close-up, medium, low angle. Four versions of one shot is not a board.
- Still 1 is the scroll-stopper, so give it the strongest image of the four, and Still 4 holds the payoff.
- Never spoil the ending in Still 1, and never put the reel's final reveal anywhere but Still 4.

For each chosen still, write down the video number, the shot number within that video, the shot's own timestamp range, and its film position. A multi-video storyboard runs every table on its own 00:00 to 00:10 clock, and the `Film position:` line under each heading is where that clip sits in the finished reel. Headings use film time, because the caption points at one continuous reel.

### 3. Write the four prompts

Each prompt is one fenced code block, copy-paste ready, no commentary inside the block. Blocks hold these parts in this exact order:

1. Style lock, word for word from section 1 of `.agents/rules/character-consistency.md`.
2. `Environment:` sentence, copied from the matching shot in the storyboard. Identical across all four stills unless the storyboard itself changes location, in which case the stills use the environment of the shot each one comes from.
3. Character text for every Yeti in the shot, copied from sections 2, 3, and 4 with the `[EXPRESSION]` slot filled. With more than one Yeti, separate them (`On the left, ... In the center, ... On the right, ...`), and follow the storyboard's position lock where it has one.
4. `Head lock:` the exact sentence from section 7, immediately after the last character text.
5. `Humans:`, `Animals:`, or `Creatures:` sentence for any supporting cast, copied word for word from the storyboard and repeated identically in every still. If the storyboard has no such sentence and a still needs supporting cast, write the sentence once on the first still that needs it and reuse it verbatim.
6. `Action:` what happens in this one frozen frame: pose, camera angle, lens feel, lighting, props, depth of field, and motion blur or flung snow if the instant calls for it. Present tense, one pose per character, eye lines stated. No "then", no "begins to". State who is not in the frame, because image models draw every character the prompt names unless told not to.
7. Framing line: `Square 1:1 composition, 1080x1080px,` plus where the subject sits in the frame.

The expression is where these go wrong. Pick the row from the section 5 table that matches what the character feels at the end of that frame, paste it into `[EXPRESSION]`, and state the same emotion again in the `Action:` sentence. The two must agree, because the description beats the action every time. Never write a smile of any kind into a beat of danger, worry, effort, sadness, or loss, and keep the "no smile" wording in the text, since that phrase is what overrides the model's default grin.

If the storyboard already has a still-frame file in `image-prompts/`, reuse the matching frame's locks and `Action:` text as the starting point and change only what the square crop and the merge require. A frame written twice from scratch drifts.

### 4. Write the Facebook post

The caption sells the carousel and the reel, in plain warm language a global audience reads without effort. Short sentences, no idioms, no slang that needs local context.

- Open with a hook, not a summary. The first line is the part visible before "See more", so it carries the tease and never the ending.
- Put a swipe cue near the top (`Swipe to see what happens →`).
- Run three to six short lines with a blank line between them. No dense paragraphs.
- Put the reel link on its own line with a clear call to watch.
- End with one engagement question that invites a comment.
- Three to six emoji in total, placed as punctuation.
- Use the real names, Papa Yeti, Mama Yeti, Babu Yeti, and never rename them.
- No dialogue quotes attributed to the characters.

Hashtags go in their own block at the end, 18 to 24 of them, ordered niche to broad, in three tiers: brand and series tags, niche content tags (3D animation, CGI, character animation, wholesome, family), and broad reach tags (`#reels #fbreels #facebookreels #viral #trending #explore #fyp`). The niche tags carry the discovery weight, so make them specific to this story's subject rather than generic. No banned, spammy, or engagement-bait tags, and no tag that misrepresents the content.

Then write the two extras: an alternate caption of two or three lines for A/B testing, and four on-image overlay lines, one per still, under eight words each, in story order.

### 5. Save the file

Save to `carousels/<slug>-carousel.md`. The slug is the storyboard's filename with `-30s-storyboard`, `-60s-storyboard`, or `-storyboard` cut off, so `prompts/babu-yeti-kung-fu-dream-60s-storyboard.md` becomes `carousels/babu-yeti-kung-fu-dream-carousel.md`. Create `carousels/` if it does not exist. Never save a carousel under `prompts/` or `image-prompts/`.

### 6. Verify before finishing

Check every item, fix what fails, and re-check. Report a partial result only if something is genuinely blocked.

Each still prompt:

- [ ] Style lock verbatim.
- [ ] `Environment:` present, drawn from the storyboard, not white or empty.
- [ ] Character text verbatim for every Yeti in the shot, `[EXPRESSION]` filled from the section 5 table.
- [ ] Expression agrees with the `Action:` sentence, and no smile sits on a beat of danger, worry, effort, sadness, or loss.
- [ ] Head lock sentence verbatim, right after the last character text.
- [ ] `Humans:` / `Animals:` / `Creatures:` sentence present and identical across the stills that carry it.
- [ ] Nothing on or above any head.
- [ ] A Yeti holds the hero beat.
- [ ] `Action:` describes one held instant and names who is not in the frame.
- [ ] Ends with the `Square 1:1 composition, 1080x1080px,` framing line.
- [ ] No audio text, no dialogue, no on-image text or watermark.

The file as a whole:

- [ ] Exactly four stills, in story order, each headed with its video, shot, and film timecode.
- [ ] Four different framings.
- [ ] `grep -c "Head lock" <file>` returns 4, and `grep -c "1080x1080px" <file>` returns 4.
- [ ] Still 1 is the strongest image and does not spoil the ending; Still 4 holds the payoff.

The post:

- [ ] Hook in the first line, ending not spoiled.
- [ ] Swipe cue present.
- [ ] Reel link on its own line, and it is the link the user gave.
- [ ] One engagement question.
- [ ] 18 to 24 hashtags, niche to broad, no banned or bait tags.
- [ ] Character names correct.
- [ ] Alternate caption and four overlay lines present, overlays under eight words each.

## Output template

````markdown
# <Title> Carousel

Four square stills and the Facebook post for `prompts/<storyboard-file>.md`. Reel: <reel link>.

Each prompt carries the style lock, the environment sentence, the character text with its `[EXPRESSION]` slot filled, the head lock, and the supporting cast sentence from the matching storyboard shot, with the `Action:` rewritten as a single held image at 1:1. Post the four stills in order as a Facebook carousel.

## Still prompts

### Still 1 · Video <N> Shot <S> · film <mm:ss>–<mm:ss> · <Shot type> · <Short title>

```
3D animated premium shot, high-quality 3D CGI rendering, ultra-realistic soft fur texture, cinematic lighting, soft warm illumination highlighting individual strands of fur. Environment: <sentence>. <Character text with expression filled>. Head lock: each Yeti has a smooth, rounded, fully furred head, and the tuft of fur is the only thing on top of it; there are no horns, no antlers, no spikes, no bumps, and no headwear. <Humans: / Animals: / Creatures: sentence if any> Action: <Shot type>. <The held image, camera angle, lighting, props, depth of field, who is not in the frame.> Square 1:1 composition, 1080x1080px, <where the subject sits in the frame>.
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
