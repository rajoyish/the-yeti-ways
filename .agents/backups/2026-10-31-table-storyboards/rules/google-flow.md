---
trigger: model_decision
description: How a Yeti film is generated in Google Flow, based on Flow's own help docs. Fixes the model (Gemini Omni Flash 1.1) and the 10-second clip, the saved Flow Characters that carry every Yeti's look, the new project per film, the Agent settings and the Agent instruction cards each storyboard writes, the setup prompt and the compact Agent prompt for each clip, continuity between clips, credits, and the checks. Apply when writing a storyboard's Flow sections, or when the user asks how to generate clips in Flow.
paths:
  - "prompts/**"
---

# Google Flow

This file says how a storyboard becomes clips in Google Flow. `character-consistency.md` says how the Yetis look, `prompt-assembly.md` how a prompt is put together, and `cinematic-direction.md` how a shot is directed. This file takes the storyboard those three produce and sets out what goes into Flow, in what order, with which settings.

## 1. What Flow's docs confirm

Checked against the Flow help center (https://support.google.com/flow/?hl=en#topic=16908930) on 2026-10-30: Get started (16353333), Use the Google Flow Agent (17093911), Create videos (16353334), Edit videos & build scenes (16935718), Models & supported features (16352836), Manage credits (16526234), and Projects, assets & collections (16935308). Re-check the model and credits pages when Flow changes; everything below follows from them.

- **Only Gemini Omni Flash 1.1 makes 10-second clips.** Its menu label is "Omni Flash". It supports text to video, frames to video (a start frame, or a start and an end frame), and ingredients to video at 4, 6, 8, or 10 seconds, in both orientations, at 720p or a 360p draft. Veo 3.1 Lite and Fast make ingredient clips of 8 seconds only, and Veo 3.1 Quality takes no ingredients. Every clip in this project is Omni Flash, 10 seconds.
- **Characters are the consistency feature, and ours are built.** A Character bundles a description, one or two images, a name, and an optional voice into one reusable asset. A prompt calls it with `@` and its name (`@Papa Yeti`). The Character carries the look, so a prompt that calls a Character does not describe it again.
- **Ingredients should be clean.** Subject references go on "a plain or segmented background"; location and style references should not "contain extra subjects"; the text prompt "should complement, not contradict, your visual inputs" and should refer to the ingredients it was given. A prompt describes "the subject, action, environment, lighting, and style", in English.
- **The Agent.** Click Agent in the prompt box to turn it on; the Expand icon opens its side panel. Agent queries cost no credits (there is a daily query limit); the media it generates does, and it is saved to the open project. It can plan, write prompts, generate images and videos and choose the model, edit selected media, make batches of variations, rename files, and group media into collections. Sessions save per project.
- **Agent instructions** apply to the whole project, to "improve consistency in the Agent's behavior". Each instruction is a card with an on/off toggle, an Instruction title, one Reference image, and a guideline text box ("Create a guideline for your agent"); "+ Add instruction" adds another card, and Done saves them. The docs give no length limit, so keep each guideline short and to one subject.
- **Agent settings** (Settings, at the bottom of the prompt box): "Confirm before generating" (Always or Never), and default video settings for orientation, number of outputs, and video model. Generation length is not among them, so the instruction cards and every Flow prompt state the 10 seconds.
- **Credits.** Omni Flash, 10 seconds: 15 credits at 720p, 7 at 360p. A Pro or Ultra plan upscales an Omni 360p clip to 720p for 0 credits, and any clip to 1080p for 0 credits. Credits fail back within an hour when a generation fails or hits a filter.
- **Continuity tools.** Any paused frame can be saved ("Save frame") and reused as an ingredient, a start frame, or an end frame. Extend works on Veo clips only; for Omni it is "coming soon". Scenebuilder orders clips, trims them, previews the scene, and downloads it.
- **Project settings** include "Return silent videos". It stays off: every clip carries its music and sound effects.

## 2. The saved Characters

The three Yetis are saved Flow Characters, named exactly `Papa Yeti`, `Mama Yeti`, and `Babu Yeti`. Each has its description from its Copy-Ready Google Flow Character Lock in `character-consistency.md`, its 1:1 front image with both hands open and five fingers showing, and its 16:9 turnaround (side, back, rear three-quarter) with a furred back and no tail, saved in `references/characters/` as `<papa, mama, or babu>-yeti-front` and `<papa, mama, or babu>-yeti-turnaround` (.png or .jpg). Save any approved view there that is still only in Flow, so the image skills can attach it. They show on Flow's home screen and in every project's Characters panel.

Because the Characters carry the look:

- A storyboard and an Agent prompt never describe a Yeti's colour, tuft, face, build, or fur. They name the Yeti and describe only what it does, where it is, and what its face shows. An Agent prompt calls each Character with `@` once, in its `Cast:` line, and uses the plain name after that (section 6).
- Each Character's look is set in one place. If a Yeti drifts across several clips, fix the Character (its images or its description), never the prompts.
- Scale is the one thing a Character cannot carry: each image shows one Yeti filling its frame, so Flow sizes them all alike. A height sentence in the `Cast:` line of every Agent prompt where Babu Yeti shares a shot with a grown-up, and the size rule in Instruction 1, carry it (section 6). The family height chart (`references/characters/family-height-chart.png`) is for still images only (section 7 of `prompt-assembly.md`); it is never attached to a card or a clip.

Rebuilding a Character (only when one has to be replaced): edit its canonical portrait with Nano Banana Pro, never regenerate it from text, because a fresh text-to-image Yeti is where tails, horns, and wrong colours appear. Fix hands with a hands-only edit, one hand at a time if needed, naming the thumb, index, middle, ring, and little finger. Check every view against the Final Consistency Checklist in `character-consistency.md` and count five fingers and five toes before saving it.

A story cast member (a human, an animal, or an invented creature with a name in the storyboard) gets its own Character in the film's project, named by its Character name from the storyboard (`Old Mountain Teacher`), spelled exactly as the storyboard and its file in `prompts/characters/` spell it (section 6 of `prompt-assembly.md`). The `flow-character-builder` skill writes everything for it, from a draft or straight from the storyboard's cast sentences: the Portrait prompt (front view, 1:1), the Body prompt (turnaround, 16:9), the Character info, and the cast sentence. From the moment it has a file there, the Agent prompts treat it like a Yeti: the `Cast:` line calls it as `@<Character Name>` with no description (section 6). The storyboard's tables keep its full cast sentence, because the image skills copy it into still prompts, which have no saved Character, and the tables are never pasted into Flow.

## 3. One project per film

Every film is made in its own new Flow project, so its assets, Agent session, and instructions never mix with another film's.

1. **New project.** "+ New project", renamed to the film's title.
2. **Settings.** Model Omni Flash (Gemini Omni Flash 1.1), Video, Ingredients, orientation vertical 9:16, generation length 10 seconds, 360p for drafts, one or two outputs. "Return silent videos" off.
3. **Agent settings.** Turn the Agent on, open Settings at the bottom of the prompt box, set the default video model to Omni Flash, orientation vertical, and "Confirm before generating" to Always, so nothing spends credits without your approval.
4. **Characters.** Open the Characters panel and check the film's Yetis are there under their exact names, typing `@` in the prompt box to confirm each one resolves. Create a Character for each named story cast member.
5. **Plates.** Paste the storyboard's `Agent setup prompt` into the Agent. It generates one clean 9:16 image of each location in the storyboard with nobody in it, named `Plate - <Location>`. Each plate prompt is `Vertical 9:16 aspect ratio, full-frame vertical composition.` (the setup prompt's first sentence asks for the image, so it has no `Create image:` prefix), the style lock, the location's `Environment:` sentence, the `Lighting:` sentence of the first shot there, and `No characters, people, or animals are in this image.`
6. **Agent instructions.** Add the storyboard's instruction cards (section 5): "+ Add instruction" once per card, paste its title into Instruction title, attach its reference image, paste its guideline, toggle it on, and click Done.
7. **Uploads.** Upload any panel images you plan to use as composition guides. Group the plates and guides into one collection for the film.

## 4. Generating each clip

One clip per video, in order. Each clip gets the video's `Agent prompt:` block, pasted into the prompt box with the Agent on. Its first line names the video and every image the clip uses. The storyboard's `## Image map` lists the same images for every video (and the plate for the Instruction 2 card), and the `Images:` line directly above each `Agent prompt:` repeats that video's row, so the operator attaches exactly those images in the prompt box, opening image first, before pasting, and checks the Agent used them. After pasting, the operator runs Flow Character Linker (the **@ Link** pill, Alt+Shift+L, or the toolbar icon) so every `@Name` in the `Cast:` line becomes a Character chip; any name its toast lists as unmatched has no saved Character in this project yet.

1. **Ingredients.** The Agent prompt's first line names them. As few as do the job, each a single clean image:
   - The Characters the video names, called with `@` in the prompt (they attach when called).
   - The opening picture: for Video 1, and any video under a `Scene break:` line, the plate of its first location; for every other video, `End frame V<N-1>`, the frame saved from the end of the previous approved clip. A video that cuts to a new location partway through also gets that location's plate.
   - At most one single 9:16 panel image from the 3x2 file as a composition guide, for a beat that is hard to get from words. Never a 3x2 grid or a triptych: Flow reads a multi-panel image as one picture and blends its panels, borders, and labels into the clip.
2. **Prompt.** With the Agent on, paste the `Agent prompt:` block, approve the generation when it asks, and check it kept the model, the orientation, the 10 seconds, and the opening image.
3. **Check.** Vertical 9:16, exactly 10 seconds, the shots in order at their timestamps, each showing only the characters its `In frame:` list names, none of them twice, every Yeti on its Character, Babu Yeti's curl no higher than a grown-up's belly in any frame they share, five fingers on every open hand, a furred back and no tail in any shot from behind, nobody the prompt does not name, no text or borders, faces and light as written. Then run the look check in section 7 of `prompt-assembly.md`. A clip that fails is regenerated, never used and never saved from.
4. **Upscale.** Draft at 360p until a clip passes, then upscale that same clip to 720p (0 credits on Pro or Ultra) rather than regenerating it, because a new generation is a new clip. Upscale to 1080p for the final cut if you want it.
5. **Save the end frame.** The `Clip rules` card asks the Agent to save the approved clip's last clean frame (the held picture of the last shot, not a motion-blurred one) as `End frame V<N>`. If it cannot, pause the clip there, "Save frame", and name it `End frame V<N>`. It opens the next video. Before approving the next clip, put its first frame beside this one and regenerate it if the cut jumps in position, face, colour, or light.
6. **Assemble.** Add the approved clips to a scene in Scenebuilder in order, untrimmed so each stays 10 seconds, preview the cuts, and download. Grading and any fade happen in the edit.

If Flow refuses a clip, the `Clip rules` instruction card (section 5) tells the Agent how to find the trigger, and section 10 of `prompt-assembly.md` holds the originality rules the copyright filter is checked against. Check the Agent's rewrite keeps the timestamps, the names, the style sentence, and the Avoid line. If it cannot clear it, retry one change at a time and stop at the first that passes: (1) replace the Sound line with "Soft background music. No dialogue, no lyrics."; (2) remove the effect wording; (3) cut each shot to its main physical action; (4) remove the Avoid line from the clip prompt only; (5) drop the panel image guide. Copy any change that passes back into the table, and record the trigger in the storyboard's Instruction 2 so the next story avoids it.

## 5. Agent instruction cards

Every storyboard writes its film's Agent instructions, in a `## Google Flow Agent instructions` section, as three cards to paste into Flow's Agent instructions panel. Each card is written as:

````markdown
### Instruction <n> - <Instruction title>

Reference: <the image to attach, by its Flow name and its file path, or "None">

```text
<the guideline text>
```
````

Keep each guideline under about 250 words, on one subject, in plain sentences the Agent can follow. Never paste a rule file, a character lock, a storyboard table, or a Yeti description into a card: the Characters carry the look, and each clip's Flow prompt carries the story.

**Instruction 1 - Yeti family series.** Reference: None. The guideline is this text, word for word, in every film:

```text
This project makes one original 3D animated short film about a family of three Yetis. Every video is made with Gemini Omni Flash 1.1 (Omni Flash), vertical 9:16, exactly 10 seconds long, with music and sound effects and no dialogue. Draft at 360p unless I ask for 720p.

The Yetis are the saved Characters @Papa Yeti, @Mama Yeti, and @Babu Yeti. Use only the ones my prompt names, and draw each exactly as its saved Character. Never redesign, recolour, or restyle them, and never add another Yeti, a duplicate, or anyone my prompt does not name. Their sizes never change: whenever Babu Yeti stands with a grown-up, the top of his curl reaches only the grown-up's belly, and he is never placed nearer the camera than a grown-up beside him.

Every Yeti hand has five separate fingers, never three or four, and no claws. Every Yeti back is thick fur from shoulders to knees with no tail. Nothing is ever on a Yeti's head but its own tuft, and they wear nothing.

Style: stylized 3D CGI with ultra-realistic soft fur strands and cinematic light with a soft rim on the fur. No on-screen text, captions, logos, borders, or split screens.
```

**Instruction 2 - <Film title> story.** Reference: the plate of the film's first location. The guideline is written for each film from its tables and plan, in this order: one sentence of premise and tone; which Yetis and story cast are in which videos, and each one's role; each location in one short sentence and the videos it is used in; the light, in one or two sentences; the music palette and how it moves; the key props; and which video starts a new scene, if any. It names characters by their saved Character names and says nothing about how they look. It also names each video's opening image and any recorded filter trigger with its fallback wording.

**Instruction 3 - Clip rules.** Reference: None. The guideline is this text, word for word, with the film's number of videos filled in. The storyboard holds no steps for the operator apart from its Image map and the `Images:` line above each Agent prompt, which say which images go in the prompt box for each paste: everything else it says is addressed to the Agent, in these cards, the setup prompt, and the Agent prompts.

```text
This film is <3 or 6> videos, generated one at a time and in order. For each video I paste a prompt that names the video, the image it opens on, and three to six timestamped shots on its own 00:00 to 00:10 clock, joined by hard cuts. Generate it as one 10-second Omni Flash video, vertical 9:16, as written: keep its shots, order, timestamps, camera moves, faces, light, and sound, and do not rewrite, extend, or add to it unless I ask. Never treat a timestamp as a reason to make a longer video or to split the prompt into several videos.

Each prompt calls every character with @ once, in its Cast line. Every later mention of that name without @ is the same character, drawn exactly as its saved Character. If an @ name in the Cast line is not a saved Character, draw that character from the description that follows it there.

Each shot line begins "In frame:" and shows only the characters it names there, each exactly once, in one body, at one place. Never add a character the shot does not name, a second copy of a character, or anyone from the Cast line who is not in that shot. Cut between shots; never gather the whole cast into one frame unless a shot names them all.

Video 1 opens on the location plate its prompt names. When I approve a video, save its last clean, held frame as "End frame V<number>"; if you cannot save a frame, tell me. Each later video opens on the end frame its prompt names: match its positions, faces, light, and colours exactly at the first frame. Use only the images a prompt names; never use a grid, collage, or multi-panel image as a reference.

Ask before every generation. Name new clips "V<number> - <title> - take <n>".

If a generation is refused, tell me which words or images most likely triggered it, quote them, and propose the smallest rewrite that keeps the timestamps, the names, the setting, the beats, the light, and the music. "Interests of third-party content providers" means a name, a style, a song, or a beat too close to a famous film; "may violate our policies" means a brand, a device, on-screen text, dialogue, or an effect that reads as harm.
```

## 6. The Agent prompt

The storyboard table is the master: the image skills build every panel image from it. What Flow receives for a clip is one compact `Agent prompt:` block written from that table, directly under it, in the same `## Video N` section. It is pasted into the prompt box with the Agent on, and it is the only thing pasted for that clip.

The block, in this order, in one fenced block, about 300 to 900 words: the style lock, the `Setting:` line, and the avoid line are copied whole, so the shot lines carry the length, and they get shorter as the shot count grows (about 45 to 75 words each):

```text
Generate Video <N> - <Title> as one 10-second Omni Flash video, vertical 9:16, exactly as written below. Open on the image <Plate - <Location> for Video 1 or a scene break, otherwise End frame V<N-1>>. <If any: Also use the images <Plate - <Location> of a location the video cuts to>, <one Panel_<P>_V<N> as a composition guide>.>
Vertical 9:16 video, 10 seconds, <three to six> shots joined by hard cuts. <Style lock>
Cast: <every character in the video, Yeti and story cast, as @<Character Name>, once each, in the order they first appear, with no place in the frame (each shot line places its own characters); a group as "exactly <n> <plural name>, each @<singular name>"; a story cast member with no file in prompts/characters/ followed by a short description from its cast sentence>, exactly as their saved Characters. Each shot shows only the characters its In frame list names. <When Babu Yeti shares a shot with a grown-up: "Babu Yeti is a small baby; the top of his curl reaches only to the grown-ups' bellies."> <Any height sentence for the story cast, by plain name.> No other characters.
Setting: <the video's Environment: sentence(s), without the label>.
<00:00-00:03>, <Framing> (<where the frame cuts, from section 1 of cinematic-direction.md>), <Angle>. In frame: <the shot's In frame: list, word for word>. <Action: its beats, cut to their essential physical action, where each character in frame is, and faces, using plain names>. <Camera: sentence, shortened>. <If the row's Effects: is not None: Effects: <the VFX cell's Effects: text, shortened to what renders, without the focus sentence>.> Light: <Lighting: sentence, shortened to its key, mood, and palette>, <shallow or deep> focus.
<one line per shot, in order, each with its own timestamp from the table>.
<the last shot's line>, ending on a held frame.
Sound: <the music state and instruments for each shot, in one or two sentences>. <The main sound effects>. No dialogue, no lyrics.
Avoid: <the avoid line from section 5 of prompt-assembly.md, without the label>, on-screen text, captions, borders, split screens.
```

Rules for the Agent prompt:

- It carries every part of `cinematic-direction.md` that its table holds, shot by shot: the framing with its cut and the angle (section 1), the placement on the thirds in the beats (section 1), the `Light:` (section 2), the camera move (section 3), the `Effects:` and the focus (section 4), the music and sounds (section 5), the timestamps and the held last frame (section 6), and the `In frame:` list (section 8). A shot whose `Effects:` is `None.` has no `Effects:` part.
- It agrees with its table: the same shots, framings, beats, faces, light, camera, effects, and sound, in the same order. It shortens; it never adds a beat, a character, a prop, or an effect the table does not have.
- `@` on every character, once. Every character in the video, each Yeti and every story cast member, is written `@<Character Name>` once, in the `Cast:` line, always, whether or not its Character is saved yet. The operator links the prompt with Flow Character Linker (`tools/flow-character-linker`), which turns each `@Name` into a Character chip, the same as picking it from the `@` picker; a name with no saved Character stays plain text and the extension's toast lists it, which is how a missing Character shows up. So:
  - A story cast member with a file in `prompts/characters/` (its Character is built or being built) is `@<Character Name>` and its starting place, with no description: the Character carries the look.
  - A story cast member with no file is `@<Character Name>`, its starting place, and a short description taken from its cast sentence, because nothing else carries its look yet.
  - A group of identical members is written `exactly <n> <plural name>, each @<singular name>` (`exactly three Grey Wolves, each @Grey Wolf`), because the extension matches the Character title as whole words, so `@Grey Wolves` would not link `Grey Wolf`.
  - The `@` goes directly before the name, after a space or at the start, never inside a word or before a possessive (`@Snowy Owl's` links nothing useful); the name is spelled exactly as the Character is saved.
  - Every later mention uses the same name without `@` (`Babu Yeti`, `Nuri Bear`), never a colour, a description, a different name, or "the creature" or "he" at the start of a shot. If one Character drifts in a clip, add `@` before its name in the shot where it drifts.
- No sentence describes a saved Character's fur, colour, tuft, face, or build: the Character carries them, and a second description in the prompt competes with it.
- Three short reminders stay, because they fix what video models get wrong even with a Character attached, and they describe actions, not looks: a Yeti hand that does something visible (waves, claps, grips, points, holds, presses, reaches) is a "five-fingered hand"; a Yeti seen from behind, from the side, walking away, or climbing has "thick fur covering the whole back and no tail" after its name; and whenever Babu Yeti shares a shot with a grown-up, the line places him in body terms ("Babu Yeti, his curl reaching only to Papa Yeti's belly"), on the same ground at the same distance from the camera, and, where the story allows, with an action that shows the difference (reaching up to hold a hand, a grown-up kneeling to him, riding on a grown-up's shoulders).
- Timestamps run 00:00 to 00:10 and match the table's rows, one shot line per row, written with a hyphen and no spaces (`00:03-00:05`, `00:08.5-00:10`).
- Each shot line opens with its `In frame:` list from the table, word for word, and names no other character. The `Cast:` line places no one: a starting place for every character in the `Cast:` line is how a whole cast ends up in one frame, or one character in it twice.
- The style lock and the avoid line are copied whole. Everything else may be shortened.
- No pipe characters, no markdown inside the block, and no instructions for the operator: every sentence is for the Agent.

The storyboard's `## Agent setup prompt` is one more block of the same kind, pasted once before Video 1: it asks the Agent to generate each location plate (section 3, step 5), names each one, and says not to generate any video yet.

## 7. Why grids and long prompts are never sent to Flow

Grids and triptychs are planning and review sheets, never clip ingredients: Flow reads a multi-panel image as one picture and blends its panels, layout, backgrounds, and labels into the clip, and a 16:9 sheet fights a 9:16 clip. Character locks, cast sentences for saved Characters, and full tables are never pasted either: a Character already carries the look, a second description competes with it, and at hundreds of words per Yeti the few words each shot needs get buried. Rule files and storyboards are never attached to the Agent; the instruction cards and the Flow prompts carry what it needs.
