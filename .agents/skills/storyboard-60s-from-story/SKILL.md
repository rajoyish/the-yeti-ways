---
name: storyboard-60s-from-story
description: >-
  Trigger when the user gives a short Yeti story (prose, possibly with dialogue) and asks
  for a 1-minute or 60-second storyboard, says "six 10-second videos", "1 min storyboard",
  or runs "/storyboard-60s". Turns the story into a 60-second storyboard of six 10-second
  Google Flow videos with no dialogue. Every spoken line becomes a gesture, expression,
  or prop action, and the audio is background music and sound effects only, so the clip
  works for a global audience.
---

# 60-second storyboard from a story

This skill takes a short prose story about the Yeti family and writes a 60-second storyboard built as six 10-second videos for Google Flow. Each video extends from the last frame of the one before it, so the six clips cut together as one continuous film.

The story may contain dialogue. The storyboard never does. Every line of speech is translated into something the viewer can see: a gesture, a facial expression, a prop being handled, a change of posture. Audio is background music and sound effects only.

The sibling skill `.agents/skills/storyboard-30s-extender/SKILL.md` produces the same table format at half the length. The reference output for this skill is `prompts/babu-yeti-found-sled-60s-storyboard.md`. Match its structure, including the aspect ratio lock and the head lock in every visual cell.

## Rules that always apply

Read these before writing anything:

- `.agents/rules/character-consistency.md`: the style lock and the exact character text for Papa Yeti, Mama Yeti, and Babu Yeti. Copy the text verbatim into every shot. Never paraphrase it. The one part that varies is the `[EXPRESSION]` slot, filled per shot from the expression table in section 5 of that file.
- `.agents/skills/social-media-prompt-creator/SKILL.md`: platform and safety guidelines. Section 1 (the "never" list), the TikTok note on dangerous activities, and the visual tip about backgrounds apply directly.

- The Yetis are the heroes. Papa Yeti, Mama Yeti, and Babu Yeti are the main characters and never change. If the story casts someone else as the rescuer, the helper, or the character whose choice resolves it, recast it before drafting: the hero beats go to the Yetis, and the story's other characters become the supporting cast (the ones in need, the bystanders, an animal that reacts). Supporting characters may be added, changed, or invented to fit the context (an animal family in place of people), but no supporting character ever takes a hero beat a Yeti could take, and no Yeti is ever replaced. See section 6 of `character-consistency.md`.

Flow-specific constraints, learned from clips that the content filter rejected:

- No dialogue. Every audio cell ends with "No dialogue."
- No brand names, logos, packaging, labels, or on-screen text. This includes signs, maps, and posters. Replace any text-bearing prop from the story with a textless equivalent (a trail map becomes a carved wooden signpost with an arrow shape, a label becomes a plain object).
- No real devices (phones, tablets, cameras). Use in-world props.
- No stock sound effect names (record scratch, cartoon boing, sad trombone). Describe each sound from scratch.
- No plain, white, or empty backgrounds. Every shot has an "Environment:" sentence.
- No horns. The Yetis have none, but the model adds horns, antlers, or spikes to a "Yeti" when the prompt leaves the top of the head undescribed, and once a frame has them every extended clip keeps them. Every visual cell carries the head lock sentence from `character-consistency.md` right after the character text, and no `Action:` sentence puts a paw or prop on or above a Yeti's head (no paws folded up beside the head for a sleep mime, no arms raised overhead). Keep mimes at chest height. A head touch the story needs, such as a tuft ruffle, says the paw lifts away in the same sentence.
- Faces match the beat. The character text used to carry a fixed "wide cheerful toothy smile", and Flow obeyed it over anything the `Action:` sentence said, so Yetis grinned through a rescue. The smile is now an `[EXPRESSION]` slot in each character text. Fill it per shot from the table in section 5 of `character-consistency.md` with the feeling the Yeti holds at the end of the shot, and write the same feeling in the `Action:` sentence. No smile of any kind on a beat of danger, worry, effort, sadness, or loss. A smiling frame extends into a smiling next clip, so a clip that smiles on the wrong beat gets regenerated, never extended.
- Vertical 9:16 only. Flow renders 16:9 unless the prompt and the output setting both say otherwise, so every visual cell opens with the aspect ratio line and the operator sets Flow to 9:16 before generating. A clip that comes back 16:9 gets regenerated, never cropped.
- No cast energy and no film echoes. Flow has a second refusal, "I can't generate the video you requested right now due to interests of third-party content providers." That is the copyright filter, not the safety filter, and the fixes above do not clear it. It fires on named franchises, characters, studios, and art styles, on song titles, artists, lyrics, and singing, and on scene beats that copy a well-known film's signature moment even when nothing is named. A Yeti who presses paws together and sends out a dome or wave of glowing energy that changes the landscape is one of those beats (it is the plot device of a major animated Yeti film and reads as a superhero power-up). Write a magical effect as a change in light or weather that happens near the character (the light between his paws brightens, the snow softens where the light reaches) and never as something the character casts (no dome, wave, beam, burst, pulse, blast, aura, force field, or energy), and never as a change to the character's own body.
- Music as mood, not as a score cue. Name the feeling, the tempo, and one instrument, and keep that one instrument for the whole film. Once a clip has passed the filter, every later clip names the same instrument and nothing more; do not bring in a new instrument mid-film. Do not write key changes, chord names, arpeggio directions, named tunes, lyrics, or singing. Vocal sounds stay wordless.
- Humans are allowed as supporting cast. If the story mentions people (a hiker, a family, a traveller), they may appear on screen as long as the Yetis keep the hero beats. Write them in the same 3D animated style as the Yetis, with rounded, friendly cartoon features, never as photoreal people and never as a likeness of a real person, celebrity, or named group. Give them simple in-world clothing (a woven tunic, a cloth belt, a plain scarf) with no logos, writing, or modern gear, and no real devices in their hands. Describe them once in a locked `Humans:` sentence that is copied word for word into every prompt, the same way supporting animals get an `Animals:` sentence. A human child in the scene stays with an adult, never enters water, never falls, and is never alone in danger; the filter reads a child in peril as harm, so write worry, not terror.
- No risky physical action. If the story has a character high on a cliff, in a crevice, or on thin ice, bring the action down to a safe height or a gentle slope. TikTok moderates anything that reads as a dangerous stunt, especially with a child character.
- Every video table runs on its own clock, from 00:00 to 00:10. Flow reads the timestamps in a prompt as that clip's clock. A table that starts at 00:30 or 00:50 makes Flow try to render a clip far longer than 10 seconds, split the prompt into several clips, or fail with an error. The film-level position of a video lives in a `Film position:` line outside the table and is never pasted into Flow.

## Workflow

### 1. Read the story

Take the input as pasted prose or as a file path. Extract and write down, before drafting:

- Title (make one if the story has none) and a one-line premise.
- The moral or emotional point of the story, in one sentence. Every video must serve it.
- Which characters appear. Map the story's names to the project's: "Baby Yeti" or "Little Yeti" is Babu Yeti, "Mother" is Mama Yeti, "Father" is Papa Yeti. Then note who holds each hero beat (who notices the problem, who acts on it, whose choice resolves it). If any hero beat belongs to a non-Yeti, or the story has no Yetis, recast it now: the Yetis take the hero beats, and the story's other characters become supporting cast, kept as humans or replaced with in-world animals, whichever fits the story. Supporting humans get one locked `Humans:` sentence and supporting animals one locked `Animals:` sentence, each copied word for word into every prompt, as in `prompts/yeti-family-river-rescue-30s-storyboard.md` (humans) and `prompts/papa-yeti-warm-dome-30s-storyboard.md` (animals).
- Every location. Note where the story moves and why.
- Every prop. Flag any prop that carries text, a brand, or a real-world product.
- Every story beat in order, including who speaks, what they say, and what their body does while they say it.
- The final state of the scene and the final feeling.

Nothing in this list may be dropped from the output. Every beat of the story appears in the storyboard, in order.

### 2. Convert dialogue to action

For every spoken line, decide what the viewer sees instead. Write the conversion down as a two-column list (line, visual replacement) before drafting shots. Keep the list in your working notes; it does not go in the output file.

Use the intent of the line, not its words:

| Intent of the line | Show it as |
| --- | --- |
| Excitement, "look what I found" | Holds the object up in both paws, bounces on the spot, eyes wide, looks back at the others for approval |
| Claiming, "it's mine" | Hugs the object to chest, turns half away, cheeky grin |
| A gentle "wait" | Raises one open paw, slow head shake, kneels to eye level |
| A question | Head tilt, one open paw turned up, eyebrows raised, eyes on the child |
| "No" or an admission | Looks down at own feet, shoulders drop, toe drawing a line in the snow |
| Explaining a consequence, "how would you feel if" | Mime in three parts at chest height: points at the child, mimes the scenario (cheek resting on the back of one flat paw held beside the jaw for sleep, then a thing cradled in both paws), then turns one paw over to show it empty. Paws never go up beside or above the head |
| Imagining | Hold on the character's face as the expression changes; a glance toward the thing they would lose |
| Comfort or agreement | An arm around the shoulders, a nod, a forehead touch |
| Decision | Straightens up, nods once to self, picks up the object with purpose |
| Pride or approval | Warm smile, a pat on the head, the parents exchange a look |

Do not use thought bubbles, speech bubbles, or written signs to replace dialogue. Do not use lip movement that reads as speech. Mouths may open for gasps, laughs, and sighs.

### 3. Plan six videos

Split the story across six 10-second videos. The default mapping for a moral tale:

| Video | Film position | Role | What it carries |
| --- | --- | --- | --- |
| 1 | 00:00 - 00:10 | Hook | Establish the place and the discovery. End on the moment of wanting. |
| 2 | 00:10 - 00:20 | Want | The child claims the thing. The parents notice. |
| 3 | 00:20 - 00:30 | Pause | The first parent's gentle stop and question. The child's admission. |
| 4 | 00:30 - 00:40 | Lesson | The second parent's mimed explanation. The child imagines and feels it. |
| 5 | 00:40 - 00:50 | Choice | The child decides and acts on it. |
| 6 | 00:50 - 01:00 | Warmth | The return home. The feeling of the ending, held. |

Adjust the mapping when the story has a different shape, but keep six videos and keep the story's order. Give each video a short title in the heading, such as "Video 1 - The Red Sled". The number and the title are separated by a spaced hyphen (` - `), never a colon. The heading carries no timestamps. The film position goes on its own `Film position:` line directly under the heading.

Add nothing the story does not already imply. Good additions: a reaction from the other parent, a small gesture of affection, a prop being set down with care. Bad additions: a new character, a new prop that changes the story, a joke that undercuts the moral, a second location the story never visits, a supporting character taking over a beat that a Yeti should carry.

### 4. Handle location changes

Flow extends each video from the last frame of the previous one, so a location can only change at a video boundary and only in one of two ways:

- **Walk-through**: the last shot of the video shows the characters walking out of frame or along a path, and the first shot of the next video shows them arriving in the new environment. Use this when the two places are close (a cave mouth and the slope outside it).
- **Scene break**: the next video is generated fresh from its own prompt instead of extending. Use this when the story jumps (from a mountain ledge to a trail far below). Mark it with a `Scene break:` line instead of an `End frame:` line, and tell the operator in the agent instructions which video starts fresh.

Keep location changes to two at most across the sixty seconds. Each location gets one `Environment:` sentence, decided in step 1 and never reworded within that location.

### 5. Write the shots

Each video has three shots. Every video's table starts at 00:00 and ends at 00:10, no matter where the video sits in the film. Videos 2 through 6 do not continue the clock from 00:10, 00:20, and so on. Timestamps are contiguous, with no gaps between rows, and sum to exactly 10 seconds per video. Default split is `00:00 - 00:03`, `00:03 - 00:07`, `00:07 - 00:10`, the same three ranges in all six videos. The only place `01:00` appears is the `Film position:` line of Video 6.

Vary the shot types within each video. Do not repeat the same shot type three times in a row. Use Wide Shot, Medium Shot, Medium Two-Shot, Medium Three-Shot, and Close-up.

Every visual cell follows this order, with each piece copied exactly:

1. Aspect ratio lock: `Vertical 9:16 aspect ratio, full-frame vertical composition.` Word for word, in every cell, before anything else.
2. Style lock.
3. `Environment:` sentence for the current location.
4. Character text. For one character, `Character: ...`. For two, `On the left, ... On the right, ...`. For three, `On the left, ... In the center, ... On the right, ...`. Keep the same character on the same side in every shot unless the action moves them, and if it moves them, keep them there for every later shot. Fill each character's `[EXPRESSION]` slot from the section 5 table of `character-consistency.md` with the feeling that Yeti holds at the end of the shot. The slot is the only text in a character description that changes between shots.
5. Head lock, word for word, after the last character description: `Head lock: each Yeti has a smooth, rounded, fully furred head, and the tuft of fur is the only thing on top of it; there are no horns, no antlers, no spikes, no bumps, and no headwear.`
6. Supporting cast, if any: a `Humans:` sentence and/or an `Animals:` sentence describing every supporting character, identical in every shot at every location. A shot without a Yeti replaces the character text with `No Yeti is in this shot.` and keeps the head lock and the supporting cast sentences.
7. `Action:` two to four sentences. Concrete body movement, expression, and eye line. Describe what changes during the shot, not a static pose. The expression named here must agree with the `[EXPRESSION]` slot in the character text; if the feeling changes during the shot, describe the change here and put the destination in the slot. Where a line of dialogue was, write the replacement from your step 2 list.

Every audio cell names the music state (starts, continues, pauses, swells, softens, resolves), any physical sound, and ends with "No dialogue." Pick one instrument palette for the whole minute and keep it. Vocal sounds are allowed if they are not words: a gasp, a giggle, a soft sigh, a happy hum.

### 6. Lock the continuity between videos

The last shot of Videos 1 through 5 must end on a state that can be freeze-framed and handed to Flow as the starting image of the next video. Add an `End frame:` line directly under each of those five tables describing the exact pose, positions, and props visible in the final frame. The first shot of the next video begins from that pose.

Where step 4 calls for a scene break, write `Scene break:` instead, describing the new environment and the opening pose so the operator can generate the video fresh.

Video 6 ends on a held, resolved image with the music finishing.

### 7. Write the file

Save to `prompts/<kebab-case-title>-60s-storyboard.md`. Derive the kebab-case title from the story's title, dropping any leading article. Never overwrite an existing file.

Use the template below. The "Agent instructions" section at the top is for whoever, or whatever agent, operates Google Flow. Keep it in the file.

What Flow receives is one table at a time, and only the table. Headings, `Film position:` lines, `End frame:` and `Scene break:` lines, and the agent instructions stay in the file for the operator and the editor.

### 8. Verify before finishing

Check every item. Fix and re-check rather than reporting a partial result.

- [ ] Six videos, each exactly 10 seconds. Every table's first row starts at `00:00` and last row ends at `00:10`. No timestamp above `00:10` appears anywhere in a table.
- [ ] Each video heading reads `## Video N - <Title>` with a spaced hyphen, has no timestamps, and a `Film position:` line sits directly under it (00:00 - 00:10 through 00:50 - 01:00).
- [ ] Every beat of the story appears, in order.
- [ ] Every hero beat (noticing, acting, resolving) belongs to Papa Yeti, Mama Yeti, or Babu Yeti. No supporting character rescues, solves, or resolves, and no main character is missing, renamed, or replaced.
- [ ] Every spoken line has a visual replacement in an `Action:` cell. No speech, lip-sync, speech bubbles, or written words.
- [ ] Every visual cell opens with the aspect ratio lock line, before the style lock, in all eighteen shots.
- [ ] The style lock and every character description are character-for-character identical to `character-consistency.md`, apart from the `[EXPRESSION]` slot.
- [ ] Every `[EXPRESSION]` slot is filled with a row from the section 5 table, matches the beat of its shot, and agrees with the expression in its `Action:` sentence. No shot on a beat of danger, worry, effort, sadness, or loss contains a smile of any kind. `grep "toothy smile"` on the file returns only shots whose beat is happy, playful, or proud.
- [ ] The head lock sentence follows the character text in every visual cell, word for word, and no `Action:` sentence puts a paw or prop on or above a Yeti's head without the paw lifting away in the same sentence.
- [ ] Each location has one `Environment:` sentence, identical in every shot at that location.
- [ ] Left/right positions are stable.
- [ ] `End frame:` or `Scene break:` lines under Videos 1 through 5 match the action in their final shot and the opening action of the next video.
- [ ] Every audio cell ends with "No dialogue."
- [ ] No brands, real devices, stock sound effect names, on-screen text, signs with writing, risky heights, or empty backgrounds. Any humans are stylized, in in-world clothing, described in one `Humans:` sentence that is identical in every shot, and no human child is alone in danger.
- [ ] No character casts energy (dome, wave, beam, burst, aura), no named franchise, studio, style, song, or artist, and every audio cell describes music as mood plus instruments, not as a score cue.
- [ ] File saved in `prompts/` with a kebab-case name ending in `-60s-storyboard.md`.

## Output template

```markdown
# <Title> 60s Storyboard

<One or two sentences: what happens and the moral or emotional point.> It has been strictly formatted for AI video generation according to character styling rules, environment locks, and social media prompt guidelines. There is no dialogue; every line from the original story is carried by gesture, expression, and sound.

## Agent instructions

This storyboard is six 10-second Google Flow videos that cut together into one 60-second film. Follow these steps in order.

1. Set Flow's output format to vertical 9:16 before generating anything, and check it again before each clip. Flow falls back to 16:9 on a new session.
2. Generate Video 1 from its three shots as one 10-second clip. Paste the three table rows in order as a single prompt; do not generate them separately.
3. Check the clip is vertical 9:16 and that its final frame matches the `End frame:` line under the Video 1 table. If either is wrong, regenerate Video 1 before continuing.
4. Generate each following video by extending from the final frame of the one before it, using that video's table as the prompt. Repeat both checks after every clip.
5. <If any: "Video N starts a new scene. Do not extend it. Generate it fresh from its own prompt, matching the `Scene break:` line under the Video N-1 table. Confirm the output format is still 9:16, because a fresh generation is where it most often reverts.">
6. Cut the six clips together in order with no transitions. Keep the music continuous across the cuts.

Every video's table runs on its own 00:00 - 00:10 clock. Paste one table into Flow at a time, and paste only the table. The `Film position:` line under each heading is where the clip sits in the finished 60-second cut; it is for the editor, not for Flow. If Flow produces more than one clip, a clip longer than 10 seconds, or a timing error, the prompt contained timestamps above 00:10. Remove them and retry.

Every visual cell opens with `Vertical 9:16 aspect ratio, full-frame vertical composition.` Keep that line in the prompt even when Flow's output format is already set to 9:16. The setting and the line together are what stop it reverting to widescreen. If a clip renders 16:9, regenerate it with the format reset rather than cropping, because cropping throws away the top and bottom of the framing.

Do not change the aspect ratio line, style lock, environment sentences, head lock, character descriptions, or the `Humans:` and `Animals:` sentences in any prompt. Only the `Action:` text, the audio text, and the expression phrase inside each character description (the words between "small round nose," or "small button nose," and the tuft of fur) differ between shots, and the expression phrase is already set for each shot to match its beat. If Flow rejects a clip, read the message. "This prompt may violate our policies" is the safety filter, and the cause is almost always a brand, a real device, a named stock sound effect, on-screen text, or dialogue. "I can't generate the video you requested right now due to interests of third-party content providers" is the copyright filter, and the cause is a name, a style, a song, or an `Action:` sentence that reads like a famous film moment. Hand the prompt to Flow's agent first: it can see what the filter matched, which the message does not say. Give it this request, with the refused prompt pasted under it:

> This prompt was refused with "I can't generate the video you requested right now due to interests of third-party content providers." Find what triggered the refusal and rewrite the prompt so it passes. Keep the three rows and their timestamps (00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10). Change only the `Action:` sentences and the audio text. Do not change, shorten, or reorder the aspect ratio line, the style lock, the `Environment:` sentence, the character descriptions, the `Head lock:` sentence, the `Humans:` sentence, or the `Animals:` sentence. Keep every story beat, keep the <instrument> as the only instrument, keep "No dialogue." at the end of each audio cell, and tell me what you changed and why.

Check the agent's rewrite before generating: every locked sentence must still be there word for word, no timestamp may be above 00:10, and every audio cell must end with "No dialogue." If the agent touched a lock, paste the original lock back over its version. Once the rewritten prompt passes, copy its `Action:` and audio changes back into this storyboard so the later videos are written against what was actually generated, and note what the agent said the trigger was so the next storyboard avoids it.

If the agent cannot clear it, or there is no agent in the session, work through these retries in order, one change at a time, and stop at the first that passes: (1) replace every audio cell with "Soft background music. No dialogue."; (2) cut each `Action:` to its first sentence; (3) download the final frame of the previous clip as an image and generate this video from that frame instead of with extend, using the same prompt, because extend sends the previous clip along with the prompt and the filter judges both. Never change the character text.

Aspect ratio lock: vertical 9:16 for every clip, set in Flow's output format and stated in the first line of every prompt.

Head lock: no Yeti has horns, antlers, spikes, or anything on its head besides its tuft of fur. Every prompt says so after the character text. If a clip comes back with anything on a Yeti's head, regenerate that clip before extending from it. A horned frame passed to the next clip carries the horns through the rest of the film.

<If any: Human lock and/or Animal lock: the supporting cast sentence(s), word for word, and where each supporting character is and what it does in each video.>

Prop lock: <every prop, what it is made of, where it sits. No brands, labels, text, or packaging.> No dialogue in any shot.

Environment lock: <Location A sentence.> <If used: Location B sentence, and which videos use it.>

## Video 1 - <Title>

Film position: 00:00 - 00:10.

| Timestamp | Shot Type | Visual Description / Prompt | Audio / Sound FX |
| --- | --- | --- | --- |
| **00:00 - 00:03** | <Shot type> | Vertical 9:16 aspect ratio, full-frame vertical composition. <Style lock> Environment: <sentence>. <Character text>. Head lock: each Yeti has a smooth, rounded, fully furred head, and the tuft of fur is the only thing on top of it; there are no horns, no antlers, no spikes, no bumps, and no headwear. Action: <...> | <Music state, physical sounds.> No dialogue. |
| **00:03 - 00:07** | ... | ... | ... |
| **00:07 - 00:10** | ... | ... | ... |

End frame: <exact pose, positions, props visible in the last frame>.

## Video 2 - <Title>

Film position: 00:10 - 00:20.

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10 ... |

End frame: <...>.

## Video 3 - <Title>

Film position: 00:20 - 00:30.

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10 ... |

End frame: <...>.

## Video 4 - <Title>

Film position: 00:30 - 00:40.

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10 ... |

End frame: <...>.

## Video 5 - <Title>

Film position: 00:40 - 00:50.

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10 ... |

End frame or Scene break: <...>.

## Video 6 - <Title>

Film position: 00:50 - 01:00.

| ... three shots, 00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10 ... |
```
