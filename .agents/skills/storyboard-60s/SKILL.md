---
name: storyboard-60s
description: >-
  Create, expand, or revise a 60-second Yeti storyboard from a story or source
  storyboard as six 10-second Google Flow Agent video prompts. Also write
  story-specific horizontal 16:9 and vertical 9:16 cover photo prompts with full
  character locks and @ character tags. Use for "60s storyboard", "six 10-second videos", or
  /storyboard-60s, including adding or revising a cover for an existing
  60-second storyboard. Video prompts keep saved Characters and no dialogue;
  cover prompts are standalone promotional stills.
---

# 60-second storyboard from a story

This skill takes a short prose story about the Yeti family and writes a 60-second storyboard built as six 10-second videos for Google Flow. Each video is one `Agent prompt:` block, the text Flow receives and the master for its 10-second clip: six beats, cut into three to six one-subject shots, each shot one line carrying its framing, `In frame:` list, beats, camera, effects, and light. The video sections hold no storyboard table or panel image prompts. After the final video, the file includes two standalone cover photo prompts: horizontal 16:9 and vertical 9:16. In Flow each clip is generated from its Agent prompt with the film's saved Characters and the previous clip's saved end frame, as `.agents/rules/google-flow.md` sets out. The video workflow is addressed to the Flow Agent except the Image map and the video `Images:` lines, which tell the operator what to attach. The final cover sections are addressed to an image model and have their own reference notes. The continuity between the six clips lives in the Agent prompts and in that end frame: the first beat of each video picks up the picture the previous video ended on. The table-based version of this skill is kept in `.agents/backups/2026-10-31-table-storyboards/`.

The story may contain dialogue. The storyboard never does. Every line of speech is translated into something the viewer can see: a gesture, a facial expression, a prop being handled, a change of posture. Audio is background music and sound effects only.

Every shot is directed as well as described: its framing and angle, its light, one camera move, its visual effects, and the transition out of it, in the fixed terms of `.agents/rules/cinematic-direction.md`.

The sibling skill `.agents/skills/storyboard-30s/SKILL.md` produces the same Agent-prompt-only format at half the length; its reference output, `prompts/babu-yeti-moonlit-herb-rescue-30s-storyboard.md`, shows the structure to match. `prompts/babu-yeti-found-sled-60s-storyboard.md` shows a six-video story's pacing only. Both older files use retired formats: never copy their tables, character text, keyframe lines, or lock paragraphs.

## Shared cover workflow and assistant compatibility

Read `.agents/skills/storyboard-30s/references/cover-images.md` when writing or revising this storyboard. It defines the cover concept, both formats, full still-image locks, reference handling, generation when requested, and cover checks. Every cover prompt has a `Cast:` line immediately after its style lock, calling each visible character with `@` exactly once; later mentions use plain names, and the full locks remain intact. Use `prompts/yeti-plateau-cup-300s-storyboard.md` for its cover approach, adapted to this story's mood and setting.

This is a standard `SKILL.md` shared by Codex, Claude Code, and Antigravity through `.agents/skills/` and the aliases maintained by `.agents/link-agents.sh`. Resolve project paths from the repository root. All three assistants can write the complete prompts; actual image generation requires an image capability in the current session. See `.agents/README.md` for discovery and verification.

## Rules that always apply

Read these before writing anything:

- `.agents/rules/character-consistency.md`: how Papa Yeti, Mama Yeti, and Babu Yeti look. A video prompt never copies a lock or describes a Yeti's look; cover stills carry the full locks as the shared cover guide requires. In videos, each Yeti is a saved Flow Character, named in the shot lines and called with `@` once in each Agent prompt's `Cast:` line, and the Character carries the look. Its Allowed Variations and Prohibited Changes also bind every `Action:` and `Expressions:` sentence: faces move only the eyebrows, eyelids, cheeks, and mouth, and no action changes a Yeti's design or merges two Yetis. Use this default file, never `character-consistency-alt.md`, unless the user asks for the alternate by name (the note at the top of `prompt-assembly.md` says why).
- `.agents/rules/prompt-assembly.md`: the style lock, the order of the pieces in a visual cell, the `Characters:` and `Expressions:` sentences, the expression table (section 4), the avoid line, the main characters and story cast rules (section 6), the prompt construction rules, and the originality pass (section 10).
- `.agents/rules/cinematic-direction.md`: the terms and project limits for shot type and angle, lighting, camera movement, VFX, transitions, and sound, the panel map that ties each video to its 3x2 grid (section 6), and the pipeline (section 7).
- `.agents/rules/google-flow.md`: what Flow's docs confirm (every clip is Gemini Omni 1.2 Flash, named `Omni 1.2 Flash`, 10 seconds), the saved Characters (section 2), the new project per film (section 3), the ingredients for each clip and the saved end frame that carries continuity (section 4), the three Agent instruction cards (section 5), and the `Agent prompt:` format (section 6).
- `.agents/skills/social-media-prompt-creator/SKILL.md`: platform and safety guidelines. Section 1 (the "never" list), the TikTok note on dangerous activities, and the visual tip about backgrounds apply directly.

- The Yetis are the main characters; the story decides everything else. Papa Yeti, Mama Yeti, and Babu Yeti never change: the same locks, the same names, the same family, and no one replaces them. Every other choice belongs to the story, as section 6 of `prompt-assembly.md` sets out: the genre, the setting, the music, and who does what. A Yeti may teach or be taught, rescue or be rescued, and a story cast member (human, animal, or invented creature) may hold any role the story needs, including a mentor, a guide, a rival, or the one who helps. Keep the source's cast and roles when they work, and recast only where the story is stronger for it. The film stays about the Yetis: the camera may cut away to the story cast, but never for more than two shots in a row, every video has at least one shot of a Yeti, and the main emotional turn belongs to at least one of them, played in a Close-Up or Medium Close-Up of a Yeti's face (rule 10 of section 8 of `cinematic-direction.md`).
- Only 3 Yetis: Papa, Mama and Babu Yetis should be shown in the videos, no extra Yetis other than that or more than 3 Yetis.

Flow-specific constraints, learned from clips that the content filter rejected:

- No dialogue. Every `Sound:` line ends with "No dialogue, no lyrics."
- No brand names, logos, packaging, labels, or on-screen text. This includes signs, maps, and posters. Replace any text-bearing prop from the story with a textless equivalent (a trail map becomes a carved wooden signpost with an arrow shape, a label becomes a plain object).
- No real devices (phones, tablets, cameras). Use in-world props.
- No stock sound effect names (record scratch, cartoon boing, sad trombone). Describe each sound from scratch.
- No plain, white, or empty backgrounds. Every shot has an "Environment:" sentence.
- No horns. The Yetis have none, but the model adds horns, antlers, or spikes to a "Yeti" when the prompt leaves the top of the head undescribed, and once a grid panel or a panel image has them, the clip made with that image keeps them. Every character lock says the tuft is the only thing on the Yeti's head, and no `Action:` sentence puts a hand or prop on or above a Yeti's head (no hands folded up beside the head for a sleep mime, no arms raised overhead). Keep mimes at chest height. A head touch the story needs, such as a tuft ruffle, says the hand lifts away in the same sentence.
- Same look in every shot. Left to itself, a model turns a "Yeti" into a white, ape-like snow monster, dresses characters standing in snow in scarves and hats, and draws Babu at any size from a doll to a third grown-up. Each Yeti is a saved Flow Character that holds its colour, tuft, face, build, and the fact that it wears nothing, so no sentence in a video prompt describes or changes them, and every Agent prompt ends with the avoid line from section 5 of `prompt-assembly.md`. Size is the one thing a Character cannot carry, so the height sentence in each `Cast:` line, and Babu Yeti's curl placed at a grown-up's belly in every shot line they share, carry it. Every shot line names each Yeti by name ("Papa Yeti", "Mama Yeti", "Babu Yeti"), never by colour, and agrees with the Characters (five-fingered hands and five-toed feet, never paws; nothing worn; Babu Yeti about half a grown-up's height). No sentence sizes a place or a prop by a Yeti ("a pillar as tall as a grown Yeti"), because the `Setting:` line runs in every shot and would put the Yeti into the ones where it is absent.
- Faces match the beat. The character text used to carry a fixed "wide cheerful toothy smile", and Flow obeyed it over everything else, so Yetis grinned through a rescue. The Characters carry no expression, so every shot line states each Yeti's face in the beat where it shows, worded from the expression table in section 4 of `prompt-assembly.md` for the feeling that Yeti holds ("worried, eyebrows drawn together, no smile"). No smile of any kind on a beat of danger, worry, effort, sadness, or loss, and the "no smile" words stay in, because they override the model's grin. A clip that smiles on the wrong beat gets regenerated, never used.
- Vertical 9:16 only. Flow renders 16:9 unless the prompt and the output setting both say otherwise, so every Agent prompt's first two lines say vertical 9:16, and the operator sets Flow to 9:16 before generating. A clip that comes back 16:9 gets regenerated, never cropped.
- 720p by default. Omni 1.2 Flash renders at 720p or a 360p draft, Flow's Agent settings hold no resolution, and the help pages name no default, so the Agent goes by what the cards and prompts say (a card that said "Draft at 360p" got 360p clips). So every Agent prompt's first line and format line say 720p, Instruction 1 and Instruction 3 say it word for word, and nothing in the file asks for 360p. A clip that comes back at 360p but otherwise passes is upscaled to 720p in Flow (0 credits, Pro or Ultra only), never regenerated (section 4 of `.agents/rules/google-flow.md`).
- Original, not copied, and clear of the safety filter. Follow the section "Keeping clear of Flow's filters" below while planning, and run its checker before saving.
- Direction goes to Flow too. Every word of a shot line's camera move, `Effects:`, and `Light:` parts is an instruction the filters read. No energy sent out by a character, no explosion, and no strobe effect, no named film, studio, or colour grade, and no edit instruction (a fade, a dissolve, a speed change) inside an Agent prompt. The edit uses hard cuts, and the file holds no edit instructions.
- No pipe character (`|`), heading, bullet, or other markdown inside an Agent prompt: it is plain sentences, pasted as is into Flow's prompt box.
- Sound designed for the story. Every film gets its own score and sound world, planned once for the film in step 1 (section 5 of `cinematic-direction.md`) and summarised in Instruction 2: a palette of two to five instruments chosen for the story's world and mood, how the music moves across the videos, and each location's ambient bed. Do not reuse a past film's palette by habit. The palette may change on story beats (drums drop out when the tension breaks, strings come in for the ending), and the music at each handoff is the same on both sides of the cut. Each `Sound:` line names the instruments playing, shot by shot, their tempo, and their feeling. Never a named song, composer, artist, or soundtrack, never lyrics or sung words, and no key changes, chord names, or arpeggio directions; wordless vocal textures are allowed.
- Humans can be cast in any role. Draw them in the same stylized 3D animated style as the Yetis, as original designs with expressive cartoon features, never photoreal, never the likeness of a real person, and never the design of an existing film or game character. Dress them for the story's world and era (an old teacher's plain wrapped robe and cloth sash, a fisher's oilskin coat, a cook's apron), with no logos or writing. Every story cast member has one Character name (title case, no "the": `Old Herb-Gatherer`, `Snowy Owl`, `Nuri Bear`), the same name `flow-character-builder` saves its Flow Character under, spelled exactly the same in Instruction 2, every `Cast:` line, every shot line, and its file in `prompts/characters/`, as section 6 of `prompt-assembly.md` sets out. Never a lower-case handle (`the snowy owl`), a short form, or a second label. Give each member a locked entry in your working notes (its Character name and its look head to toe, naming no other character); for a member with a file in `prompts/characters/`, that is the "Full" sentence in its file, word for word. In the Agent prompts, every member is `@<Character Name>` in the `Cast:` line, saved or not, unless the video's reference budget keeps it described-only (next bullet but one), as section 6 of `google-flow.md` sets out: a member with a file gets only its name there, a member with no file gets a short description drawn from its entry, and a group is `exactly <n> <plural name>, each @<singular name>`. No shot line describes anyone's look. A human child stays with an adult, never enters water, never falls, and is never alone in danger; the safety filter reads a child in peril as harm, so write worry, not terror.
- No risky physical action. If the story has a character high on a cliff, in a crevice, or on thin ice, bring the action down to a safe height or a gentle slope. TikTok moderates anything that reads as a dangerous stunt, especially with a child character.
- Every Agent prompt runs on its own clock, from 00:00 to 00:10. Flow reads the timestamps in a prompt as that clip's clock. A prompt whose shots start at 00:10 or 00:30 makes Flow try to render a clip far longer than 10 seconds, split the prompt into several clips, or fail with an error. A video's place in the film and its plot stages live in your plan and in Instruction 2, never in the file under the video's heading and never in an Agent prompt.
- Beats come first, and the shots are cut from them. Every video has six beats on the fixed clock of section 6 of `cinematic-direction.md`. The beats are cut into three to six shots of one or two beats each, and each shot line carries one sentence per beat.
- Cinematic, not a tableau. A clip that shows every character of the scene in one frame reads as a staged photo, places characters at the wrong distance from each other, and makes the model draw a character twice. Cut each video as a director would, by the coverage rules in section 8 of `cinematic-direction.md`: one subject per shot, an `In frame:` list on every shot line that names everyone in it and no one else, one establishing shot per location and then cut in, characters in different places in different shots joined by eyeline cuts, a chase cross-cut shot by shot, screen direction kept, every event shown in an action shot and a Yeti's reaction shot, and shot lengths that follow the tension.
- Six beats, six pictures. Write every beat to end on one picture a viewer could photograph: positions on the thirds, poses, hands, props, eye lines, and any face that changes. A beat that only describes motion, or leaves a character's position unstated, gives Flow nothing to hold the shot on.
- No keyframe lines, and continuity carried by the saved end frame. The storyboard carries no `Frames:`, `Start frame:`, `Midpoint frame:`, or `End frame:` lines, and no generated image is ever set as a clip's first or last frame. What opens each clip after the first is the real last frame of the previous approved clip, saved in Flow, as section 4 of `.agents/rules/google-flow.md` sets out, so the first beat of each video after the first describes exactly the picture the previous video's last beat ended on, and the last beat of each video ends on a clean, held picture worth saving.
- Video sections contain video prompts only: no panel, grid, still, or keyframe prompts under a video heading. The location plates in the Agent setup prompt and the two final cover sections are the only image-prompt exceptions. Read `.agents/skills/storyboard-30s/references/cover-images.md` and append its story-specific cover prompts to every new or revised storyboard. A cover-only request follows that guide without rewriting the videos.
- Agent prompts only, no storyboard table. Each video in the file is its `## Video N - <Title>` heading, its `Images:` line, and its `Agent prompt:` block, and nothing else: no markdown storyboard table, and no `Film position:`, `Stage:`, `Characters:`, or `Scene break:` line under the heading. The Agent prompt is the master for its video: everything that used to be spread across a table's rows (the framing with its cut, the angle, the `In frame:` list, the beats with their placement and faces, the camera move, the effects, the light and focus, the sound) is written into it, shot line by shot line, as section 6 of `.agents/rules/google-flow.md` sets out, and the planning behind it stays in your working notes. Its first line tells the Agent which video to generate and names its opening image. Its `Cast:` line calls every character in the video, Yeti or story cast, with `@` once and places no one; every shot line opens with that shot's `In frame:` list; every later mention is the plain Character name (`Babu Yeti`, `Nuri Bear`), never `@` again and never a description of a saved Character.
- At most 7 references per clip. Omni 1.2 Flash takes at most 7 references in one generation: every image in the prompt box (the opening plate or end frame, a second plate, a panel guide) counts one, and every linked Character counts one (section 1 and section 4 of `.agents/rules/google-flow.md`). A Video 3 with two plates and six Characters hit 8, Flow refused it, and the clip made after the Agent's workaround lost the Yetis' colours. So plan every video's cast and locations to 7 or fewer before writing it, counting every `@` name in its `Cast:` line whether its Character is saved yet or not, and a group (`each @Grey Wolf`) once. Papa Yeti, Mama Yeti, and Babu Yeti hold 3 of the 7 in every video, whether or not all three appear, so the images and the story cast share 4: the opening image takes 1, leaving at most 3 story cast members called with `@` (2 with a second plate). A member beyond that is described-only, as `flow-character-builder` sets out: no Character, written in the `Cast:` line without `@` and described in words, and it does not count; choose the one-shot or background members for that. When a video would go over, cut in the storyboard, in this order: a panel guide; a second plate (let the `Setting:` sentence carry that location); a story cast member the video or that shot can do without; a Yeti from a shot that does not need it, or the beat to another video. A video that visits two locations with a big cast is where this bites: give the second location fewer characters, or its own video. Never leave the choice to the Agent.
- Written for the Agent, with one map for the operator. Apart from the `## Image map` section and the `Images:` line above each `Agent prompt:` (next bullet), nothing in the video workflow is an instruction to the operator; cover reference notes are separate: no Flow setup section, no `Ingredients:` line, no "With the Agent on, add" line, and no steps for creating the project, checking Characters, uploading, checking, upscaling, or assembling. Those live in `.agents/rules/google-flow.md`. What the file says to Flow, it says to the Agent: the instruction cards, the setup prompt, and the Agent prompts.
- Agent instructions in every storyboard. The file writes the three cards of section 5 of `.agents/rules/google-flow.md` under `## Google Flow Agent instructions`: Instruction 1 and Instruction 3 word for word (with the number of videos filled in), and Instruction 2 written for this film from the plan in step 1, under about 250 words, naming characters by their Character names, the videos each is in, each location and its videos, each video's opening image, which video starts a new scene, and any likely filter trigger with its fallback wording. It is the only place the film's structure is written down.
- Image map. The operator has to know, for every paste, which images go in Flow's prompt box, so the file says it twice, in plain words. Under `## Image map`, straight after the Agent setup prompt, one table lists every place an image is attached: the Instruction 2 card (its `Reference:` plate) and every video, each with the images it takes, in order, the opening image first, and what each is for (`opening image`, `the location the last shot cuts to`, `composition guide for Shot 2`). A video that opens on an end frame says so and names the video it is saved from, and says "no plate", so no one attaches a plate it does not use. The table ends with one line: the Characters attach from each Agent prompt's `Cast:` line, never by hand, and a grid, a triptych, or any image the map does not name is never attached. Then, in every video, directly above `Agent prompt:`, one `Images:` line repeats that video's row: `Images: attach <image> (opening image)<, then <image> (<what for>)> in the prompt box, nothing else. References: <n> image(s) + <n> Characters = <n> of 7.` The count is the video's images plus every `@` name in its `Cast:` line, saved or not, and is never above 7. The map, the `Images:` lines, Instruction 2's locations and opening images, and each Agent prompt's first line name the same images, in the same order, and none of them names an image the Agent setup prompt does not create, apart from the `End frame V<N>` images and any panel image guide.
- Agent setup prompt. Under `## Agent setup prompt`, one `text` block asks the Agent to generate each location plate with Nano Banana Pro, vertical 9:16, names each `Plate - <Location>`, gives each plate's prompt as section 3 of `.agents/rules/google-flow.md` sets out (without the `Create image:` prefix, since the block's first sentence asks for the image), and says not to generate any video yet. Every asset is named where it is made, so nobody has to guess which prompt makes which image: the first sentence lists every plate name, in the order the prompts follow, and each plate prompt is its own line that opens with its exact plate name and a colon (`Plate - Cloud Lotus Garden: Vertical 9:16 aspect ratio, ...`), the same name, letter for letter, that Instruction 2, the Image map, the `Images:` lines, and the Agent prompts' first lines use. Name each location once, in title case, after the place itself (`Plate - Starway Sky`, never `Plate 2`, `Plate - New Location`, or a name that describes a character). A setup prompt that a film adds to after its first paste (a new location for added videos) says which plates may already exist and to generate only the missing ones. It creates the location plates only; the separate cover prompts follow the final video.
- The model named exactly: `Omni 1.2 Flash`. Flow's model menu lists "Omni 1.2 Flash" and "Omni 1.1 Flash" (marked "Leaving Dec 5"), so a bare "Omni Flash" lets the Agent pick either version. Every Agent prompt's first line and format line name `Omni 1.2 Flash`, Instruction 1 and Instruction 3 say it word for word, and nothing in the file says "Omni Flash" without "1.2" or asks for Omni 1.1 Flash (the only mention of 1.1 is Instruction 1's "never Omni 1.1 Flash"). The length stays 10 seconds. Omni 1.2 Flash can make up to 15 seconds, but the user's Google AI Pro plan makes 10-second clips only, so no prompt asks for 15 seconds or any length but 10, and every shot clock still runs 00:00 to 00:10. A clip that comes back on Omni 1.1 Flash, or at any length but 10 seconds, is regenerated.
- Every clip is 10 seconds on Gemini Omni 1.2 Flash, vertical 9:16, 720p, made in a new Flow project for the film. No video-generation step or video prompt names another model, length, orientation, or resolution. Plates and cover stills use image models, and the horizontal cover is 16:9.

## Keeping clear of Flow's filters

Flow refuses a prompt in two ways. "This prompt may violate our policies" is the safety filter. "I can't generate the video you requested right now due to interests of third-party content providers. Please edit your prompt and try again." is the copyright filter: it compares the whole request, the text, every image in the prompt box, and the linked Characters, with protected films, shows, games, and characters, and refuses whatever reads as a copy of one. No wording can guarantee a pass, because Google does not publish what the filter matches, but every refusal this project has had so far had a cause written below, so a storyboard that follows this section has none of them.

What Google's own pages say, checked on 2026-11-02:

- Create videos (https://support.google.com/flow/answer/16353334): "Be specific about the subject, action, environment, lighting, and style." "Your text prompt should complement, not contradict, your visual inputs." "Make sure your prompt references the frames or ingredients you've provided." "Make sure location and style references don't contain extra subjects." "A consistent look and feel across all your ingredient images helps the model blend them more effectively." "Certain image types may not be supported."
- Use the Google Flow Agent (https://support.google.com/flow/answer/17093911): "Usage of the Agent is subject to Google's content policies." The Agent can "refine prompts", so it is the first place a refused prompt goes (Instruction 3 asks it to name the trigger).
- Generative AI Prohibited Use Policy (https://policies.google.com/terms/generative-ai/use-policy): no content that "Violates the rights of others, including privacy and intellectual property rights", no "Impersonating an individual (living or dead)", nothing that facilitates "Violence or the incitement of violence", "Hatred or hate speech", "Harassment, bullying, intimidation", "Sexually explicit content", "child sexual abuse or exploitation", "self-harm", or "illegal activities", and no "Circumvention of abuse protections or safety filters".

Neither help page explains the third-party message, so the rules below come from the policy and from this project's refused clips. The last policy item sets how they are used: a prompt clears the copyright filter by being original, never by disguising a copy. A rewrite that keeps a famous scene and only swaps its words is circumvention, and it is refused again anyway. Change the picture.

1. **Originality first.** Run the originality pass in section 10 of `.agents/rules/prompt-assembly.md` while planning, not after: no name of a film, show, game, studio, character, song, or artist anywhere in a `text` block; no "in the style of", "-style", "inspired by", or named look; every story cast design invented from scratch; and wherever a beat sits close to a scene you recognise, at least two of its setting, key prop, key action, and framing changed.
2. **Known triggers.** Plan around these from step 1. Each one has refused a clip in this project or is one of the most recognisable pictures in its genre.

   | Pattern | Why it reads as a copy | Write instead |
   | --- | --- | --- |
   | A Yeti makes plants glow, tremble, bloom, or grow, or a slope turns green around him, or light or a wave spreads from his hands or humming into the land | The plot device of a well-known animated Yeti film. Hillside Roots Video 6 was refused three times for it, and once for a lone sapling cradled and planted at sunset | Plants stay ordinary and still; a Yeti plants by hand with a tool, brisk and practical; any glow is the place's own light (moss, a lantern, the sun) and nothing a Yeti does changes it |
   | "Monster", "beast", "snow monster", "abominable", "Bigfoot" anywhere outside the locked avoid line, or an image whose name or Flow caption calls a Yeti one | A big, blue, furry, smiling "monster" is a famous animated character. Flow captioned a Papa Yeti frame "Blue furry monster smiling outdoors", and the Agent opened the refused clip on it by that caption | Every Yeti by its Character name, every time; every image named by its storyboard name (`Plate - <Location>`, `Start frame V<N>`, `End frame V<N>`) before the Agent sees it, and Instruction 2 says so whenever the film uses a supplied frame |
   | A pose frozen in mid-air while the camera circles it in extreme slow motion | The signature special-effect shot of a famous live-action film | The action at real speed, or one short slow-motion beat with a static or side-tracking camera; never a full orbit around a frozen pose |
   | A small animal or child training in martial arts with an old master in a mountain temple or courtyard, with robes and a staff | A famous animated martial-arts franchise (Kung Fu Dream was refused) | A plain, named real-world practice (taekwondo, tai chi) done as physical action, in a setting and with props of the story's own; any mentor an invented design |
   | A creature befriended, ridden, or flown with that is a dragon; a white, furry, flying dragon | Several famous dragon films (White Dragon was refused) | An invented creature of the story's own, or a dragon-shaped prop named by its material (a carved wooden kite) |
   | A creature summoning a giant leaf, a pillar of light, or a power-up for a mid-air rescue | A superhero power-up (Giant Leaf Rescue was refused) | The rescue by a physical cause in the world: a branch, a gust, a rope, a Yeti's two hands |
   | A baby held up to the sky from a rock; singing on ice or building an ice palace; a snowman friend | Famous animated scenes | Change at least two of setting, prop, action, and framing |

3. **Images are judged with the prompt.** Every image in the prompt box goes to the filter with the text, and Flow captions each upload. So: attach only images made in this film's own project (its plates and its approved end frames), or supplied frames the user made for it; never a still, screenshot, or frame grab from someone else's film or from a source video (`video-to-storyboard` hands over text, never frames), and never a photo of a real person. A plate or end frame that drifted toward a famous look (a white, shaggy, ape-like, or horned Yeti, a grinning monster) carries the risk into every clip that opens on it: regenerate it before using it. And, as the Create videos page says, the prompt agrees with its images: an Agent prompt never describes a picture its opening image contradicts.
4. **The safety filter.** The policy's violence, harassment, self-harm, and child-safety lines are what "may violate our policies" enforces. Danger in these films is shown as effort and worry, and every threat stops short: no blood, injury, weapon, death, or attack that lands, no character crushed, drowned, or trapped, no human child alone in danger or falling, and no stunt a child could copy. No real person's likeness, no brand, real device, on-screen text, or dialogue (the bullets above).
5. **What the filters read, from Google's Veo documentation and creators' reports** (searched 2026-11-02). Google publishes no list of blocked words for Flow or Veo, and creators who have tested it agree there is none to find: the filters score the whole request in context (the text, every attached image, and the finished video), so a word that passes alone can fail beside another. What is published is the set of categories. Google's Veo responsible-AI page (https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/responsible-ai-and-usage-guidelines) lists the categories a blocked request is refused under, each with support codes: Child, Celebrity ("a photorealistic representation of a prominent person"), Video safety violation, Dangerous content, Hate, Other, Prohibited content ("related to child safety or other sensitive content"), Third-party content ("Guardrails related to third-party content", codes 35561574 and 35561575, which is the refusal this section is about), Sexual ("Sexual or suggestive content"), Toxic, Violence, and Vulgar. If a refusal shows a support code, look it up there to see which category tripped. The word lists below come from creators' reports, not from Google. Treat them as risk signals, and judge each word by what it means in the sentence:

   | Risk family | Words that have tripped the filters | Write instead |
   | --- | --- | --- |
   | Third-party content | Any franchise, character, studio, song, or brand name; "in the style of"; "looks like <someone>"; "a voice like <actor>"; "the hook from <song>" | Plain physical description: who, what, where, the light; music by genre, tempo, and instruments |
   | Celebrity, real people | A real person's name, "public figure", "resembling <name>", a photo of a real face as an ingredient | An original character, described by features and clothing |
   | Child | child, kid, girl, boy, toddler, "young", "innocent", "petite", a grandchild relationship, and a human child near danger | A human child only with an adult, calm, and named by its Character name; for Babu Yeti, his name, with "baby" only in the height sentence the `Cast:` line needs |
   | Violence, dangerous | attack, fight, battle, weapon, gun, knife, sword, blood, wound, injury, explode, blast, "on fire", shoot | effort and worry; "practising", "training"; "film" or "capture" for shoot; "a wooden staff" or "a ceremonial prop" for a weapon; "burning logs in the hearth" for fire |
   | Destruction motion | crash, slam, smash, shatter, explode, "crash zoom", things that "rise out of the ground" | "comes down", "settles", "lands", "emerges", "becomes visible"; a slow camera move |
   | Restraint, distress | tied, bound, chained, trapped, captured, imprisoned, struggling, crying, sobbing, abandoned, falling or jumping from a height | "beside", "inside", "surrounded by", "moving through", "worried", "looking down", "in mid-leap", at a safe height |
   | Sexual, suggestive | tight, intimate, vulnerable, body-shape words (fit, slender, curvy), skin, "intense physical exertion" | Describe the light, the movement, and the setting, never the body |

   Practice from the same reports. Prompts go to Flow in US English. Turn off any "Enhance prompt" or prompt-rewrite option, and check that the Agent pasted the prompt as written (Instruction 3 says so), because a rewrite can add the trigger words itself. Audio is filtered too: a melody close to a known song, or a busy sound line, can block a clip, which is why the first retry replaces the `Sound:` line. Never resend the same refused prompt unchanged, because repeated identical retries only fail again.

6. **Before saving, run the checker.** `node .agents/skills/storyboard-30s/check_filter.mjs prompts/<slug>-<length>-storyboard.md` scans every `text` block (the cards, the setup prompt, every Agent prompt, and both cover prompts) and the image names. Fix every `Problem:` line, which is a name, a style request, "monster", energy from a character, a real person, violence, or an edit instruction. Read every `Note:` line, which is one of the known triggers or a risk-family word above, and change the beat unless you are sure it is clear of the pattern. Run it again until it prints `OK`.
7. **When a clip is still refused.** Instruction 3 already asks the Agent to quote the likely trigger and propose the smallest rewrite. Then find which layer trips the filter: generate the prompt once with no image attached (if it passes, an image is the trigger, so regenerate or rename it), then with the `Sound:` line replaced by "Soft background music. No dialogue, no lyrics.", then work through the retry list in section 4 of `.agents/rules/google-flow.md`, one change at a time. If two rewrites of the same beat fail, change the beat's picture (two of its setting, prop, action, and framing) rather than its words. Record the trigger in the film's Instruction 2 with its fallback wording, and when it is a new pattern, add a row to the table above in both `storyboard-30s` and `storyboard-60s`, and a check to `check_filter.mjs`, so the next film never meets it.

## Workflow

### 1. Read the story

Take the input as pasted prose or as a file path. The input may also be a source storyboard from `video-to-storyboard`: a five-column table (`Timestamp | Shot Type | Visual Description | VFX | Audio / Sound FX`) with `**Environment:**`, `**Lighting:**`, `**Subjects & Action:**`, and `**Camera Movement:**` in the visual cells and `**Observed:**`, `**Transition:**`, and `**Recommended:**` in the VFX cells. Treat it as the story, told shot by shot. Its environment becomes the `Environment:` sentence, kept or changed to suit the Yeti version. Its lighting becomes the lighting plan. Its subjects and action become the beats, with the Yeti the story names in the lead and the rest of the cast kept, changed, or invented to suit; run the originality pass in section 10 of `prompt-assembly.md` on it, since the source is a guide to pace, energy, and sound, not a scene to copy. Its camera moves and observed effects are kept where they pass the limits in `cinematic-direction.md` and replaced where they do not (a fire beam becomes a thrown snowball, an explosion becomes a cloud of powder snow off a falling slab). Its recommended moves and effects are options, not beats. Its dialogue goes through step 2 like any other.

Extract and write down, before drafting:

- Title (make one if the story has none) and a one-line premise.
- The moral or emotional point of the story, in one sentence. Every video must serve it.
- Which characters appear. Map the story's names to the project's: "Baby Yeti" or "Little Yeti" is Babu Yeti, "Mother" is Mama Yeti, "Father" is Papa Yeti. Then note what role each character plays (who notices the problem, who acts on it, whose choice resolves it, who teaches, who helps). Keep the story's roles where they work, and keep, change, or invent the rest of the cast as humans, real-world animals, or creatures of your own, whichever fits. Each member gets one locked entry in your working notes: its Character name, then its look head to toe, naming no other character (section 6 of `prompt-assembly.md`). Name every member now, before any Agent prompt is written, as section 6 of `prompt-assembly.md` sets out: first list `prompts/characters/`, and if a file there is a character the story can use (or the user names one), reuse it and its Character name word for word, with the "Full" sentence from its file as its entry; otherwise choose a new Character name that no file there uses. A group of identical members gets one singular name (`Grey Wolf`) written with its count (`exactly three Grey Wolves`). Write the names into the plan and use nothing else from here on.
- Every location. Note where the story moves and why.
- Every prop. Flag any prop that carries text, a brand, or a real-world product.
- The light at each location: time of day, weather, and every light source the environment holds (sun, sky, hearth, lantern, glowing moss). They become the film's lighting plan: every `Lighting:` sentence draws on it, and Instruction 2 summarises it. Plan the music, and which effects belong to which video, the same way. These plans are working notes, not sections of the file. If a location needs a source it lacks, add it to that location's `Environment:` sentence now.
- Every story beat in order, including who speaks, what they say, and what their body does while they say it.
- Which beat is the Inciting Incident (the one event that breaks normal) and which is the Climax (the point of highest tension, decided by what a Yeti does). Prose stories often bury the climax in a line of dialogue; find the moment the outcome turns and name it now, because the pacing in step 3 is built around it.
- The final state of the scene and the final feeling.

Nothing in this list may be dropped from the output. Every beat of the story appears in the storyboard, in order.

### 2. Convert dialogue to action

For every spoken line, decide what the viewer sees instead. Write the conversion down as a two-column list (line, visual replacement) before drafting shots. Keep the list in your working notes; it does not go in the output file.

Use the intent of the line, not its words:

| Intent of the line | Show it as |
| --- | --- |
| Excitement, "look what I found" | Holds the object up in both hands, bounces on the spot, eyes wide, looks back at the others for approval |
| Claiming, "it's mine" | Hugs the object to chest, turns half away, cheeky grin |
| A gentle "wait" | Raises one open hand, slow head shake, kneels to eye level |
| A question | Head tilt, one open hand turned up, eyebrows raised, eyes on the child |
| "No" or an admission | Looks down at own feet, shoulders drop, toe drawing a line in the snow |
| Explaining a consequence, "how would you feel if" | Mime in three parts at chest height, one per beat: points at the child, mimes the scenario (cheek resting on the back of one flat hand held beside the jaw for sleep, then a thing cradled in both hands), then turns one hand over to show it empty. Hands never go up beside or above the head |
| Imagining | Hold on the character's face as the expression changes; a glance toward the thing they would lose |
| Comfort or agreement | An arm around the shoulders, a nod, a forehead touch |
| Decision | Straightens up, nods once to self, picks up the object with purpose |
| Pride or approval | Warm smile, a pat on the head, the parents exchange a look |

Do not use thought bubbles, speech bubbles, or written signs to replace dialogue. Do not use lip movement that reads as speech. Mouths may open for gasps, laughs, and sighs.

### 3. Plan six videos

The 60-second film follows the six classic stages of plot structure, in order: Exposition, Inciting Incident, Rising Action, Climax, Falling Action, Resolution. The pacing rule is fixed: the first 30 seconds build the conflict (Exposition through Climax) and the last 30 seconds release it (Falling Action and Resolution). The Climax peaks at film 00:30: Video 3's beat 6, the last beat of its last shot. Video 4's first beat opens on that same peak picture and moves out of it into the release.

Split the story across six 10-second videos, one stage per video. The default mapping, with a moral tale as the worked example:

| Video | Film position | Stage | What it carries | Default light and camera | Moral tale example |
| --- | --- | --- | --- | --- | --- |
| 1 | 00:00 - 00:10 | Exposition | The place, the characters, what normal looks like. End on the first hint of the thing that will break it. | Soft high-key light. One establishing shot of the place (Crane Down, Dolly In, or Pan), then cut in to one subject at a time; three or four shots | The family on the slope. Babu spots a shape in the snow. |
| 2 | 00:10 - 00:20 | Inciting Incident | The one event that breaks normal and gives a Yeti a problem or a want. | The light shifts (a cloud, a shadow, a guttering fire) at a cut, or in the first beat of a later two-beat shot. A Tilt or Pan to the problem, or a Static hold on the face that sees it | Babu pulls out the sled and claims it. The parents notice. |
| 3 | 00:20 - 00:30 | Rising Action into Climax | The Yetis respond and the problem gets harder, beat by beat, up to the point of highest tension. The last beat is the peak. | Lower key, harder side light, cooler colour. Shorter, one-beat shots cross-cutting the problem and the Yetis' faces; five or six shots, ending on a Low Angle or Close-Up of the Yeti at the peak | Papa's gentle stop and question, Babu's admission, Mama's mime of how the owner feels, and Babu's face as it lands. |
| 4 | 00:30 - 00:40 | Falling Action | The immediate consequence of the peak: the choice made, the act done. | Warmth starts to return. Steady moves, a slow Dolly Out, or a Static hold | Babu decides and sets the sled back where it was. |
| 5 | 00:40 - 00:50 | Falling Action into Resolution | The tension drains and the loose threads close. | Warmer and softer. Steadicam follow or Tracking as the family moves | The parents' approval. The family turns for home. |
| 6 | 00:50 - 01:00 | Resolution | The new normal, held long enough to feel. It answers Video 1. | Soft, warm, golden, high-key. A Crane Up or slow Dolly Out that leaves the family small and warm, or a Static hold | The cave, the hearth, the last look between them. |

Adapt the coverage, light, and camera to the story, within the limits of `cinematic-direction.md`. The light only changes where section 6 of that file allows: never during a video's first shot; otherwise at a cut, or inside the first beat of a two-beat shot.

Adjust the mapping when the story has a different shape, but keep six videos, keep the story's order, and keep the boundary: the Climax peaks at 00:30, nothing after that point introduces a new problem, and nothing before it resolves one. A long climax may start in Video 3's second shot, but it never runs past the end of Video 3. A story with no clear inciting incident gets one in Video 2, where the problem or the want first arrives, never in Video 1.

Give each video a short title in the heading, such as "Video 1 - The Red Sled". The number and the title are separated by a spaced hyphen (` - `), never a colon. The heading carries no timestamps, and nothing but the video's `Images:` line and `Agent prompt:` block follows it: the film position and stage above stay in your plan and in Instruction 2. Choose the title once and never change it.

Add nothing the story does not already imply. Good additions: a reaction from the other parent, a small gesture of affection, a prop being set down with care. Bad additions: a character, prop, or location that changes the story rather than deepening it, a joke that undercuts the moral, a stretch where the camera leaves the Yetis for long.

### 4. Handle location changes

Each video's first beat picks up the picture its predecessor ended on, so a location can only change at a video boundary and only in one of two ways:

- **Walk-through**: the last beat of the video shows the characters walking out of frame or along a path, and the first beat of the next video shows them arriving in the new environment. Use this when the two places are close (a cave mouth and the slope outside it).
- **Scene break**: the next video opens in the new location instead of picking up the previous video's last beat. Use this when the story jumps (from a mountain ledge to a trail far below). Write its beat 1 as the new environment and the opening pose; its Agent prompt's first line, its `Images:` line, and its Image map row name the new location's plate; and Instruction 2 names which video starts fresh. There is no `Scene break:` line.

Give the story as many locations as it needs, but give each at least one full shot, and keep to about five across the sixty seconds so each one registers. Each location gets one `Environment:` sentence, decided in step 1 and never reworded within that location. A location can also change at a cut between two shots inside a video: the video's `Setting:` line then holds both `Environment:` sentences, labelled by their shots, its first line names the second location's plate with `Also use the image`, and the shot after the cut takes that place's light. Light hands off the same way the picture does. After a walk-through, the next video's first `Light:` part repeats the previous video's last one word for word, and the new location's light starts with the first shot set there. A scene break starts under its own light, from the film's lighting plan.

### 5. Write the shots

Each video is one `Agent prompt:` block, and nothing else in the file describes its shots: no storyboard table, and no `Film position:`, `Stage:`, `Characters:`, or `Scene break:` line under the heading. The planning that would fill a table still happens, as working notes that stay out of the file: each video's six beats, its cut list, its light and effects plan, each shot's faces, and each story cast member's locked entry. The Agent prompt is written from those notes, and it is the master: every check in step 9 is made on it.

Every video runs on its own clock, from 00:00 to 00:10, no matter where it sits in the film. Each shot covers one beat or two beats in a row, on the beat boundaries `00:00`, `00:01.5`, `00:03`, `00:05`, `00:07`, `00:08.5`, and `00:10` (section 6 of `cinematic-direction.md`): a four-shot video runs `00:00-00:03`, `00:03-00:05`, `00:05-00:07`, `00:07-00:10`, and a six-shot chase gives every beat its own shot. Normalize input timestamps to these boundaries.

Cut each video before writing a line, as a director would, by the coverage rules in section 8 of `cinematic-direction.md`. List its six beats, then group them into shots, and for each shot note: the one subject it frames (a character, or a unit acting together in one spot), its kind (establishing, action, reaction, insert, POV, cutaway, or over-the-shoulder), its length (two beats for a calm stretch, one for tension), its framing, angle, move, and light from the mood table at the end of that section, where each character sits on the thirds with lead room toward its look or movement, and its focus (shallow for Close-Ups, Medium Close-Ups, and single-subject Medium Shots; deep for wides and depth shots). Check the cut list against the rules: one subject per shot; at most one establishing shot per location per scene, and no frame that gathers the whole cast except, at most, the film's last shot; characters in different places in different shots, joined by eyeline cuts; a chase cross-cut shot by shot; screen direction kept; every important event shown in an action shot and a Yeti's reaction shot; at least three kinds of shot per video; never more than two shots in a row without a Yeti; no two shots in a row with the same subject, framing, and angle; and at least one Close-Up or Medium Close-Up per video on the face that carries the scene's feeling. Then check the staging, by rules 11 to 13 of that section and the Yeti limits of its sections 1 and 2: the event's geography is in the notes (where it starts, which way it goes, where each character stands); every reaction shot turns the face toward the frame side of the event, calls the event off-screen, names a still background, and has no dust, debris, or haze behind the face; a rescue is proved in one shot that frames the threat, the rescuer, and the one saved, with the threat stopping short of the one saved; each beat gives a character one readable action, and every prop that action depends on is named by its state; a Yeti does a shot's main action only at Full Shot or closer; and every Yeti shot keeps haze off the Yeti with `clear air around` it. A video that is all two-beat shots of everyone together is a tableau, not a scene: re-cut it.

Then write each shot as one line of the Agent prompt, in this order:

1. The timestamp, with a hyphen and no spaces (`00:03-00:05`).
2. The framing from the ladder in section 1 of `cinematic-direction.md`, with where the frame cuts in brackets, then the angle: `Medium Shot (waist up), Low Angle.` A two-beat shot whose move changes the framing names both ends, at most two rungs apart (`Medium Two-Shot (two subjects, waist up) to Close-Up (shoulders to top of head), Eye Level.`); a one-beat shot names one framing. No Bird's-Eye View or steep High Angle where a Yeti is more than small in the frame, and no Dutch Angle in the Resolution.
3. `In frame: <every character seen in the shot, by Character name>, and no one else.` (rule 2 of section 8), or `In frame: no characters, only <the place>.` A group is written with its count (`exactly three Grey Wolves`).
4. The beats: one sentence per beat, each ending on a picture. Name each character in frame by its plain Character name and place it once, on a third (`on the left third`) or centred for deliberate symmetry. Give each Yeti in frame its face, worded from the section 4 table of `prompt-assembly.md`, in the beat where it shows, keeping "no smile" on beats of danger, worry, effort, sadness, or loss; a feeling that changes is named in the beat where it changes. Where a Yeti's hand does something visible, it is a "five-fingered hand"; a Yeti seen from behind, from the side, walking away, or climbing has "thick fur covering the whole back and no tail"; whenever Babu Yeti shares the shot with a grown-up, his curl is placed at the grown-up's belly. Nothing goes on or above a Yeti's head unless the hand lifts away in the same sentence. No beat describes a character's look, and none names a character who is not in frame. A video's beat 3 ends on 00:05, the centre of the clip; in the Climax video it is the peak where the plan puts it (Video 3's beat 6, film 00:30).
5. The camera: one move from section 3 of `cinematic-direction.md`, its direction and speed, and what it ends on. Pan and Tracking are used for what they are; no Dolly Zoom; Whip Pan at most once per film and never at a shot's start or end. The video's last shot eases to a stop in its last half second (or is Static) and ends with `ending on a held frame`.
6. `Effects:` what renders in this shot, from section 4 of `cinematic-direction.md`, each with a cause in the setting or the beats and none coming from a Yeti apart from breath misting in the cold. Left out when the shot has none.
7. `Light:` the shot's light from the film's lighting plan (section 2 of `cinematic-direction.md`), shortened to its motivated key source and direction, the rim on the fur in a Yeti shot, the palette, and the mood, ending with `shallow focus` or `deep focus`. It describes the light at the end of the shot. The light never changes during a video's first shot; it changes at a cut, or in the first beat of a two-beat shot, where that beat says so.

Write the rest of the block around the shot lines, in the order section 6 of `google-flow.md` sets out:

- The first line: `Generate Video <N> - <Title> as one 10-second Omni 1.2 Flash video, vertical 9:16, 720p, exactly as written below. Open on the image <opening image>.`, plus `Also use the image <Plate - <Location>> for <the shots that need it>.` when the video cuts to a second location.
- `Vertical 9:16 video, 720p, 10 seconds, <number> shots joined by hard cuts.` and the style lock from section 1 of `prompt-assembly.md`, word for word.
- `Cast:` every character in the video as `@<Character Name>`, once each, in the order they first appear, with no place in the frame; a story cast member with no file in `prompts/characters/` followed by a short description drawn from its locked entry; a group as `exactly <n> <plural name>, each @<singular name>`; then `<names> exactly as their saved Characters.`, the height sentence `Babu Yeti is a small baby; the top of his curl reaches only to the grown-ups' bellies.` whenever Babu Yeti shares a shot with a grown-up, and `Each shot shows only the characters its In frame list names, each exactly once.`
- `Setting:` the `Environment:` sentence of each location in the video, without the label, word for word as decided in step 1 and identical in every video at that location. A video at two locations labels them by its shots (`first three shots: <sentence> Last shot: <sentence>`).
- The shot lines, in order.
- `Sound:` the music state and the instruments from the film's music plan, shot by shot in one or two sentences, then the main sounds, including one for each visible effect, ending `No dialogue, no lyrics.`
- `Avoid:` the avoid line from section 5 of `prompt-assembly.md` without its label, then `, on-screen text, captions, borders, split screens.`

The block is about 300 to 900 words. The style lock, the `Setting:` line, and the avoid line are copied whole, so the shot lines carry the length and get shorter as the shot count grows.

### 6. Lock the continuity between videos

No clip starts or ends on a generated image, so each handoff between videos is held by the two Agent prompts and the saved end frame. Follow section 6 of `cinematic-direction.md`:

- Picture. Each video's beat 1 holds the picture the previous video's last beat ends on: the same characters in the same places on the same thirds, the same hands and props, the same eye lines, and the same faces. Only the framing may differ, and the first shot frames the subject the last shot ended on. That picture is what the video opens on, `End frame V<N-1>`.
- Face. The feeling a Yeti holds at the start of a video is the feeling it ended the previous video with. If it changes in the first shot, the beat where it changes says so.
- Light. The first shot line's `Light:` part repeats the previous video's last `Light:` part word for word, except at a scene break. The light never changes during a video's first shot.
- Camera. Every video's last shot eases to a stop (or is Static), and the first shot of every later video starts from rest.
- Scene break. When the story jumps to a new place or time between videos, the next video opens on the new location's plate instead of the end frame: its first line, its `Images:` line, and its row in the Image map name that plate, its beat 1 describes the new place and the opening pose, its first `Light:` part is that location's own, and Instruction 2 says which video starts a new scene. There is no `Scene break:` line.

### 7. Write the file

Save to `prompts/<kebab-case-title>-60s-storyboard.md`. Derive the kebab-case title from the story's title, dropping the word "storyboard" and any leading article. Never overwrite the source or an existing file without saying so.

Use the template below. The file holds, in order: the title and a short premise paragraph, the `## Google Flow Agent instructions` section (three cards, section 5 of `.agents/rules/google-flow.md`), the `## Agent setup prompt` section (the one prompt that generates the plates), the `## Image map`, and then, for each video, only its `## Video N - <Title>` heading, its `Images:` line, and its `Agent prompt:` block; after the final video, append `## Cover image` and `## Cover image - 9:16 vertical` using `.agents/skills/storyboard-30s/references/cover-images.md`. Never write a storyboard table (`| Timestamp | Shot Type | Visual Description / Prompt | VFX | Audio / Sound FX |`), and never a `Film position:`, `Stage:`, `Characters:`, or `Scene break:` line: the plan that would fill them stays in your notes, and Instruction 2 carries the summary the Agent needs. Everything in the video workflow except the Image map and the `Images:` lines is addressed to the Flow Agent. Cover prompts and their reference notes are separate promotional stills.

Give each video a short title in its heading, such as "Video 1 - The Spill": the number and the title separated by a spaced hyphen (` - `), never a colon, and no timestamps. Choose each title once and never change it; the Image map, the `Images:` lines, the Agent prompts' first lines, and any other file about the film use the same headings.

Write both cover prompts before finishing, following the shared cover guide. Choose their emotional hook from this film, copy the current full character locks into each, and recompose the vertical image rather than crop. Then name the next step. Say that the clips are generated in Flow straight from this file: paste the three instruction cards and the setup prompt once, then one Agent prompt per video, attaching the images its `Images:` line names, and run Flow Character Linker on each. Say that `/create-flow-assets <this storyboard>` generates the location plates and the story cast's front and turnaround images, with ChatGPT or Google AI as the user chooses, and checks which Characters already exist. Say that `/create-3x2-timed-image` is optional: it can build panel images from the current Agent prompts, while covers are already included here and never serve as clip references. If the film has story cast, list each member's Character name and whether it is already saved (its file in `prompts/characters/`), and say that `/flow-character-builder <this storyboard>` builds the rest under exactly those names; once a member is saved, only its entry in the `Cast:` lines changes (its description is dropped), never the shot lines.

### 8. Revise an older storyboard

Six kinds of older storyboard need this step. One written before the grid pipeline has `Frames:` lines under its headings and `Start frame:`, `Midpoint frame:`, and `End frame:` lines under its tables, and its agent instructions tell the operator to set start and end images. One written before the storyboard held video prompts only has `Grid:` and `Stills:` lines under its headings, and its agent instructions say how to generate and check grids and reference stills. One written for the retired 3x3 grid has three beats in every `Action:`, and its agent instructions name a `-3x3.md` file and panel images 3, 6, and 9. And any storyboard written before the character locks has short character text with an `[EXPRESSION]` slot, `Head lock:`, `Look lock:`, and `Scale lock:` sentences in its cells, and names the Yetis by colour. And any storyboard written before the saved Characters has a `Character locks:` block above each table, Flow tags with descriptions in its Flow prompts (`@Papa Yeti (the father: ...)`), and a single `## Agent instructions` section. And any storyboard written before the Character names calls its story cast by lower-case handles (`the snowy owl`). And any storyboard written before the Agent-prompt-only format has a storyboard table, and `Film position:`, `Stage:`, and `Characters:` lines, under each video heading. When this skill works on any of them, bring it up to this skill's format first, without changing a story beat, a light, a framing, or a face:

0. If it has storyboard tables (a `| Timestamp | Shot Type | Visual Description / Prompt | VFX | Audio / Sound FX |` table, or `Film position:`, `Stage:`, `Characters:`, or `Scene break:` lines under its video headings), first make each Agent prompt carry everything its table holds, as step 5 sets out: one shot line per row, with the row's framing and its cut, angle, `In frame:` list, beats with their placement and faces, camera move, `Effects:` (unless `None.`), and `Light:` ending with the focus, and the full `Environment:` sentences in its `Setting:` line. Move anything a table held that no Agent prompt can carry (a scene break, a film position) into Instruction 2. Then delete the tables and those lines, keeping each `## Video N - <Title>` heading exactly as it is, its `Images:` line, and its `Agent prompt:` block. Every later step below that mentions a table, a row, or a cell applies to the shot lines instead.
1. If it has `Character locks:` blocks or Flow tags, delete every `Character locks:` block, replace each Flow tag with its bare `@` name, add the `Cast:` height sentence where Babu Yeti shares a shot with a grown-up, and turn each `Flow prompt:` block into the template's `Agent prompt:` block. Replace any `## Agent instructions` or `## Flow setup` section with the template's `## Google Flow Agent instructions` (three cards), and `## Agent setup prompt` sections, carrying the light, music, cast, and opening images into Instruction 2 and every film-specific note (a recorded filter trigger) into it too. Delete any `## Film locks` section and lock paragraphs once that is done.
1a. If its Flow prompts are in the older format (a `Flow prompt:` block with an `Ingredients:` line above it and "With the Agent on, add" under it, and `@` on every mention), rewrite each as an `Agent prompt:` block: its opening line names the video and the images from the old `Ingredients:` line, `@` stays only in the `Cast:` line, and every other mention is the plain name. Replace any story cast sentence describing a saved Character with the placement-only sentence of section 6 of `prompt-assembly.md`.
1b. If its story cast is named by lower-case handles (`the snowy owl`, `the old herb-gatherer`), give each member its Character name as section 6 of `prompt-assembly.md` sets out (the name in its `prompts/characters/` file if it has one, otherwise the handle in title case without "the": `Snowy Owl`, `Old Herb-Gatherer`), and replace every mention of the handle with it, in the cast sentences, `Action:` cells, `Characters:` lines, Instruction 2, and Agent prompts. Change nothing else in those sentences.
2. If it predates the character locks, revise it as section 9 of `prompt-assembly.md` sets out: replace each cell's character text with a `Characters:` sentence and its `[EXPRESSION]` values with an `Expressions:` sentence, delete the head, look, and scale lock sentences, and rename the Yetis in every `Action:` from colour to name. Update the film locks to the template's.
3. If it has keyframe lines, rewrite each `Action:` as two beats that follow step 5. Use the deleted keyframe lines as the pictures: beat 1 opens on the `Start frame:` picture, beat 3 ends on the `Midpoint frame:` picture, and beat 6 is the `End frame:` picture.
4. If its `Action:` cells have three beats, rewrite each as two. Keep the picture the first beat opens on and the picture the third beat closes on, and fold the middle beat into the neighbour it belongs with, keeping its actions and faces. In the first shot of every video after the first, fold it forward into the second beat, so the first beat still holds the handoff picture.
5. Delete every `Frames:`, `Start frame:`, `Midpoint frame:`, `End frame:`, `Grid:`, and `Stills:` line, and any obsolete clip/keyframe `Create image:` prompt outside the cover sections. Preserve existing cover sections and update them with the shared cover guide.
6. Replace any older agent instructions with the template's sections, dropping any lock paragraphs and carrying over any film-specific note (a likely filter trigger and its fix, a changed aspect ratio) that does not rely on start or end frames. Move any note about the images themselves (which characters may appear in which images, an image that has to be regenerated) into the intro of the 3x2 file. A note that names grid rows or panel numbers from the 3x3 grid is renumbered to the six-panel map. A film with its own aspect ratio (`prompts/yeti-glacier-rescue-60s-storyboard.md` is 16:9) keeps its aspect ratio line everywhere the template says 9:16.
6a. If its Agent setup prompt has plate prompt lines that do not open with their `Plate - <Location>:` name, add each name to its line and list the names in the first sentence. If it has no `## Image map` section or no `Images:` lines, add them as the template sets out, from Instruction 2's locations and each Agent prompt's first line.
6b. If a story cast member's `Cast:` entry has no `@` (it was written before every character took one), add `@` before its Character name in every Agent prompt, drop the description of any member that now has a file in `prompts/characters/`, write a group as `exactly <n> <plural name>, each @<singular name>`, and copy the Instruction 3 card again from section 5 of `google-flow.md`.
6c. If its shots break the coverage rules in section 8 of `cinematic-direction.md` (a row has no `In frame:` sentence, a shot gathers characters from separate places or the whole cast into one frame, a row describes a character to say it is absent, or an Agent prompt's `Cast:` line gives every character a place), re-cut each video: keep its six beats, their pictures, faces, and light, and the handoff pictures between videos; regroup the beats into three to six one-subject shots on the beat boundaries, rewriting a beat only where its picture must move to its own shot; give every row its `In frame:` sentence and trim its story cast sentence to the members in it; delete every `<Name> is not in the shot` sentence; and rewrite each Agent prompt with a `Cast:` line that places no one and one shot line per row. Copy the Instruction 3 card again from section 5 of `google-flow.md`, since it now asks for the `In frame:` lists.
7. Run the checklist in step 9, and tell the user the storyboard was updated.

A frames file in `image-prompts/`, from the start-and-end-frame workflow or the retired stills route, is left in place for the record. The panel images in the 3x2 file replace it.

### 9. Verify before finishing

Check every item. Fix and re-check rather than reporting a partial result.

- [ ] No storyboard table and no table lines: `grep -cE '^\| (Timestamp|\*\*00:)|^(Film position|Stage|Characters|Scene break):' <file>` returns 0.
- [ ] Six videos, each a `## Video N - <Title>` heading with a spaced hyphen and no timestamps, followed only by its `Images:` line and its `Agent prompt:` block: `grep -c '^## Video ' <file>` returns 6, `grep -c '^Images: attach' <file>` returns 6, and `grep -c '^Agent prompt:' <file>` returns 6.
- [ ] Every Agent prompt is one `text` block with no pipe characters or markdown, about 300 to 900 words, and its lines are, in order: the first line (the video, Omni 1.2 Flash, 10 seconds, vertical 9:16, 720p, its opening image: `Plate - <Location>` for Video 1 or a scene break, otherwise `End frame V<N-1>`), the format line with the style lock word for word, `Cast:`, `Setting:`, one line per shot, `Sound:`, and `Avoid:` with the avoid line word for word. The video prompts name no other video model, length, orientation, or resolution and do not request 360p; the location plates and cover stills follow their own image specifications.
- [ ] Every video prompt names the model `Omni 1.2 Flash` and the length 10 seconds: `grep -cE 'Omni Flash|Omni 1\.1 Flash|15[- ]seconds?' <file>` finds only Instruction 1's "never Omni 1.1 Flash" and "never 15 seconds", and the checker prints no model Problem.
- [ ] Every Agent prompt has three to six shot lines whose timestamps run in order from `00:00` to `00:10` on the beat boundaries, each one or two beats long, and its format line names that number of shots. Each shot line has one sentence per beat of its shot, so every video has six beats, each ending on a picture.
- [ ] Every shot line opens with its timestamp, its framing with the frame cut in brackets, and its angle (a one-beat shot names one framing), then `In frame: ..., and no one else.`, then its beats, its camera move, its `Effects:` (unless it has none), and `Light:` ending `shallow focus` or `deep focus`. The last shot line ends `ending on a held frame`.
- [ ] Coverage, by section 8 of `cinematic-direction.md`: each shot frames one subject, apart from a hand-off, a touch, a chase, or a named depth shot, and never more than three named characters; at most one establishing shot per location per scene, and no frame gathers the whole cast except, at most, the film's last shot; characters in different places are in different shots, joined by eyeline cuts; a chase is cross-cut; screen direction holds across cuts; every video uses at least three kinds of shot, has at least one Yeti shot and at least one Close-Up or Medium Close-Up, never has more than two shots in a row without a Yeti, and never cuts between two shots with the same subject, framing, and angle. Shot count follows the tension.
- [ ] Staging, by rules 11 to 13 of section 8 and sections 1 and 2 of `cinematic-direction.md`: no reaction shot puts its event, or the event's dust, debris, water, or haze, behind the reacting character; every reaction shot turns the face toward the frame side of the event, says the event is off-screen, and names a still background; a rescue has one shot framing the threat, the rescuer, and the one saved, with the threat stopping short; no beat chains more than one main action for a character; every prop an action depends on is named by its state; a Yeti who does a shot's main action is at Full Shot or closer, never small in a Wide or Extreme Wide Shot; and every Yeti shot's `Light:` keeps `clear air around` the Yeti.
- [ ] Every shot line names and places only the characters in its `In frame:` list, each once, on a third or centred for symmetry, and never names an absent character (`grep -c 'is not in the shot' <file>` returns 0).
- [ ] Every video `Cast:` line calls every character in its video with `@` exactly once, in order of first appearance, places no one, describes only a story cast member with no file in `prompts/characters/`, writes a group as `each @<singular name>`, has the Babu height sentence wherever he shares a shot with a grown-up, and ends with the `In frame` sentence. `grep -nE '@[A-Z]' <file>` finds only the opening paragraph, Instruction 1, and the `Cast:` lines.
- [ ] In video prompts, Papa Yeti, Mama Yeti, and Babu Yeti are their saved Characters, never renamed, replaced, or described; cover prompts instead carry their full canonical locks. The film stays with them (rule 10 of section 8), and the main emotional turn belongs to one of them, in a Close-Up or Medium Close-Up. Every story cast member has a role the story needs and one Character name, spelled the same in Instruction 2, every `Cast:` line, and every shot line, matching its file in `prompts/characters/` if it has one; no lower-case handle for it is left.
- [ ] Every Yeti face is worded from the section 4 table of `prompt-assembly.md`, matches its beat, and carries "no smile" on any beat of danger, worry, effort, sadness, or loss.
- [ ] Every shot line where a Yeti's hand does something visible says "five-fingered hand", no sentence calls a Yeti's hands or feet paws, a Yeti seen from behind or climbing has "thick fur covering the whole back and no tail", nothing is on or above a Yeti's head, and no video sentence describes a Yeti's look or sizes a place or a prop by a Yeti.
- [ ] Each location has one `Environment:` sentence, used word for word in the `Setting:` line of every video set there.
- [ ] Every `Light:` part is motivated by the setting, keeps a rim on the fur in a Yeti shot, follows the film's light arc, and never changes inside a video's first shot; the first `Light:` part of every video after the first repeats the previous video's last one word for word, except at a scene break. No light from below a face, no strobing, no named film or grade.
- [ ] Beat 1 of every video after the first holds the picture the previous video's last beat ended on, except at a scene break, which opens on its location's plate.
- [ ] Every camera move is one move from section 3 of `cinematic-direction.md` with direction and speed; Pan and Tracking are used for what they are; no Dolly Zoom; every video's last move eases to a stop and every later video's first move starts from rest; Whip Pan at most once.
- [ ] Every `Effects:` part is on the list in section 4 of `cinematic-direction.md` and has a cause in the setting or the beats; no energy, explosion, flash, on-screen text, morph, or anything from a Yeti but breath in the cold. Every effect that makes a sound has it in the `Sound:` line. No fade, dissolve, or speed change in any Agent prompt.
- [ ] Every `Sound:` line follows the film's music plan, names instruments, tempo, and feeling, uses no stock sound effect names, no named song or artist, and ends `No dialogue, no lyrics.`
- [ ] Every video uses at most 7 references: its images (opening image, any second plate, any panel guide) plus every `@` name in its `Cast:` line, saved or not, a group counted once. Its `Images:` line and its Image map row state that count, and the count is right.
- [ ] The file has a `## Image map` after the Agent setup prompt, with a row for the Instruction 2 card and one per video, and each video's row, its `Images:` line, Instruction 2's opening images, and its Agent prompt's first line name the same images in the same order; a video that opens on an end frame says "no plate"; every plate named is one the Agent setup prompt creates.
- [ ] In the Agent setup prompt, the first sentence names every plate in order, and every plate prompt is its own line opening with its exact `Plate - <Location>:` name; `grep -c '^Plate - .*: Vertical 9:16' <file>` equals the number of locations, and every plate name the Image map, Instruction 2, and the Agent prompts use is one of those lines.
- [ ] The file has `## Google Flow Agent instructions` with exactly three `### Instruction` cards, each with a `Reference:` line and one `text` block, then `## Agent setup prompt` with one `text` block. Instruction 1 and Instruction 3 are word for word from section 5 of `.agents/rules/google-flow.md` (Instruction 3 with "6" filled in). Instruction 2 is under about 250 words, names characters by their Character names, says which videos each is in, names each location and video's opening image and any scene break, and agrees with the Agent prompts. No `## Flow setup` section, no `## Film locks` section, no `Ingredients:`, `Flow prompt:`, `Frames:`, `Grid:`, or `Stills:` line, and no `Create image:` prompt outside the final cover sections.
- [ ] No brands, real devices, on-screen text, or empty backgrounds; any humans are stylized original 3D designs with no logos or writing, and no human child is alone in danger.
- [ ] The originality pass in section 10 of `prompt-assembly.md` passes: no named protected work and no "in the style of", every story cast design is original, no beat copies a famous scene's setting, prop, action, and framing together, no character sends out energy, and the music is described by instruments, tempo, and feeling.
- [ ] `node .agents/skills/storyboard-30s/check_filter.mjs <file>` prints `OK`, every `Note:` it printed has been read and the beat changed or judged clear of its pattern, and no beat matches a row of the known-trigger table in "Keeping clear of Flow's filters". Every image the file names is named by its storyboard name, and Instruction 2 says to rename any supplied frame before use.
- [ ] Both cover sections pass the shared cover guide: story-specific concept, a cover `Cast:` line tagging each visible character with `@` exactly once, complete canonical locks, accurate reference availability, independent 16:9 and 9:16 compositions, no text, and no effect on video prompts or reference counts. If generation was requested, the actual image is inspected, saved, and linked, or its unavailability is stated.
- [ ] File saved in `prompts/` with a kebab-case name ending in `-60s-storyboard.md`.

## Output template

````markdown
# <Title> 60s Storyboard

<One or two sentences: what happens and the moral or emotional point.> It has been strictly formatted for AI video generation according to character styling rules, environment locks, cinematic direction, and social media prompt guidelines. There is no dialogue; every line from the original story is carried by gesture, expression, and sound.

The video workflow below is written for the Google Flow Agent: three instruction cards for the project, one setup prompt, and one Agent prompt per video. Two separate promotional cover prompts follow the final video. The Image map and the `Images:` lines say which images go in the prompt box for each paste. The saved Characters <@ name of each character in the film> carry every character's look in video prompts. The cover stills repeat the full character locks for an independent image model.

## Google Flow Agent instructions

### Instruction 1 - Yeti family series

Reference: None

```text
<Instruction 1 from section 5 of `.agents/rules/google-flow.md`, word for word.>
```

### Instruction 2 - <Title> story

Reference: `Plate - <first location>`

```text
<Written for this film as section 5 of `.agents/rules/google-flow.md` sets out, under about 250 words: the premise and tone; which characters, by their Character names spelled exactly as in the cast sentences (story cast not yet saved as Characters marked "described in each prompt"), are in which videos and their roles; each location, its plate, and its videos; each video's opening image; the light; the music palette and how it moves; the key props; any scene break; any likely filter trigger with its fallback wording, and, when the film uses a supplied frame, that every uploaded image is renamed to its storyboard name before use. No description of how any character looks.>
```

### Instruction 3 - Clip rules

Reference: None

```text
<Instruction 3 from section 5 of `.agents/rules/google-flow.md`, word for word, with six as the number of videos.>
```

## Agent setup prompt

```text
Generate <one image, or one image per location> with Nano Banana Pro, vertical 9:16, and name <it, or them, in order> "Plate - <Location>"<, "Plate - <Location 2>">. <What each plate is for, e.g. Plate - <Location> is the empty location Video 1 opens on.> Each plate prompt below opens with its plate name; give each image exactly that name. Do not generate any video yet.
Plate - <Location>: Vertical 9:16 aspect ratio, full-frame vertical composition. <Style lock> <The location's Environment: sentence> <The Lighting: sentence of the first shot there> No characters, people, or animals are in this image.
<One more line per location, each opening "Plate - <Location N>: ".>
```

## Image map

| Paste | Attach in the prompt box, in this order | What each image is for | References (at most 7) |
| --- | --- | --- | --- |
| Instruction 2 card | `Plate - <first location>` | The card's Reference image | 1 |
| Video 1 | `Plate - <Location>` | Opening image | <images> + <@ names in the Cast line> = <n> |
| Video <N> | `End frame V<N-1>` (saved from the approved Video <N-1>), no plate | Opening image | <images> + <@ names> = <n> |
| <Video after a scene break> | `Plate - <new location>`<, then `Plate - <location>`> | Opening image<; the location the last shot cuts to> | <images> + <@ names> = <n> |

Characters attach from each Agent prompt's `Cast:` line, never by hand. Never attach a grid, a triptych, or any image this map does not name.

---

## Video 1 - <Title>

Images: attach `Plate - <Location>` (opening image) in the prompt box, nothing else. References: <images> image(s) + <@ names in the Cast line> Characters = <n> of 7.

Agent prompt:

```text
Generate Video 1 - <Title> as one 10-second Omni 1.2 Flash video, vertical 9:16, 720p, exactly as written below. Open on the image Plate - <Location>.
Vertical 9:16 video, 720p, 10 seconds, <three to six> shots joined by hard cuts. <Style lock>
Cast: <every character in the video as @<Character Name>, once each, in order of first appearance, no place in the frame; a story cast member with no file in prompts/characters/ followed by a short description; a group as exactly <n> <plural name>, each @<singular name>>. <Names> exactly as their saved Characters. <Babu height sentence, when he shares a shot with a grown-up.> Each shot shows only the characters its In frame list names, each exactly once.
Setting: <the location's Environment: sentence, word for word>
00:00-00:03, <Framing> (<where the frame cuts>) <to <Framing> (<where the frame cuts>)>, <Angle>. In frame: <names>, and no one else. <Beat 1, one sentence ending on a picture, each character placed on a third, faces worded from the section 4 table.> <Beat 2, one sentence.> <Camera move, direction, speed.> Effects: <what renders>. Light: <motivated key, rim on the fur, palette, mood>, <shallow or deep> focus.
00:03-00:05, <Framing> (<cut>), <Angle>. In frame: <one subject>, and no one else. <Beat 3, one sentence; it ends on 00:05, the centre of the clip.> <Camera.> Effects: <...>. Light: <...>, <focus>.
<One line per remaining shot, each one or two beats on the boundaries 00:05, 00:07, 00:08.5, 00:10.>
<Last shot line>, ending on a held frame. Light: <...>, <focus>.
Sound: <the music state and instruments, shot by shot, in one or two sentences>. <The main sounds, one for each visible effect>. No dialogue, no lyrics.
Avoid: <the avoid line from section 5 of prompt-assembly.md, without its label>, on-screen text, captions, borders, split screens.
```

---

## Video 2 - <Title>

Images: attach `End frame V1` (opening image, saved from the approved Video 1), no plate in the prompt box, nothing else. References: <images> image(s) + <@ names in the Cast line> Characters = <n> of 7.

Agent prompt:

```text
Generate Video 2 - <Title> as one 10-second Omni 1.2 Flash video, vertical 9:16, 720p, exactly as written below. Open on the image End frame V1.
Vertical 9:16 video, 720p, 10 seconds, <three to six> shots joined by hard cuts. <Style lock>
Cast: <every character in the video as @<Character Name>, once each, in order of first appearance, no place in the frame; a story cast member with no file in prompts/characters/ followed by a short description; a group as exactly <n> <plural name>, each @<singular name>>. <Names> exactly as their saved Characters. <Babu height sentence, when he shares a shot with a grown-up.> Each shot shows only the characters its In frame list names, each exactly once.
Setting: <the location's Environment: sentence, word for word>
00:00-00:03, <Framing> (<where the frame cuts>) <to <Framing> (<where the frame cuts>)>, <Angle>. In frame: <names>, and no one else. <Beat 1, one sentence ending on a picture, each character placed on a third, faces worded from the section 4 table.> <Beat 2, one sentence.> <Camera move, direction, speed.> Effects: <what renders>. Light: <motivated key, rim on the fur, palette, mood>, <shallow or deep> focus.
00:03-00:05, <Framing> (<cut>), <Angle>. In frame: <one subject>, and no one else. <Beat 3, one sentence; it ends on 00:05, the centre of the clip.> <Camera.> Effects: <...>. Light: <...>, <focus>.
<One line per remaining shot, each one or two beats on the boundaries 00:05, 00:07, 00:08.5, 00:10.>
<Last shot line>, ending on a held frame. Light: <...>, <focus>.
Sound: <the music state and instruments, shot by shot, in one or two sentences>. <The main sounds, one for each visible effect>. No dialogue, no lyrics.
Avoid: <the avoid line from section 5 of prompt-assembly.md, without its label>, on-screen text, captions, borders, split screens.
```

---

## Video 3 - <Title>

Images: attach `End frame V2` (opening image, saved from the approved Video 2), no plate in the prompt box, nothing else. References: <images> image(s) + <@ names in the Cast line> Characters = <n> of 7.

Agent prompt:

```text
Generate Video 3 - <Title> as one 10-second Omni 1.2 Flash video, vertical 9:16, 720p, exactly as written below. Open on the image End frame V2.
Vertical 9:16 video, 720p, 10 seconds, <three to six> shots joined by hard cuts. <Style lock>
Cast: <every character in the video as @<Character Name>, once each, in order of first appearance, no place in the frame; a story cast member with no file in prompts/characters/ followed by a short description; a group as exactly <n> <plural name>, each @<singular name>>. <Names> exactly as their saved Characters. <Babu height sentence, when he shares a shot with a grown-up.> Each shot shows only the characters its In frame list names, each exactly once.
Setting: <the location's Environment: sentence, word for word>
00:00-00:03, <Framing> (<where the frame cuts>) <to <Framing> (<where the frame cuts>)>, <Angle>. In frame: <names>, and no one else. <Beat 1, one sentence ending on a picture, each character placed on a third, faces worded from the section 4 table.> <Beat 2, one sentence.> <Camera move, direction, speed.> Effects: <what renders>. Light: <motivated key, rim on the fur, palette, mood>, <shallow or deep> focus.
00:03-00:05, <Framing> (<cut>), <Angle>. In frame: <one subject>, and no one else. <Beat 3, one sentence; it ends on 00:05, the centre of the clip.> <Camera.> Effects: <...>. Light: <...>, <focus>.
<One line per remaining shot, each one or two beats on the boundaries 00:05, 00:07, 00:08.5, 00:10.>
<Last shot line>, ending on a held frame. Light: <...>, <focus>.
Sound: <the music state and instruments, shot by shot, in one or two sentences>. <The main sounds, one for each visible effect>. No dialogue, no lyrics.
Avoid: <the avoid line from section 5 of prompt-assembly.md, without its label>, on-screen text, captions, borders, split screens.
```

---

## Video 4 - <Title>

Images: attach `End frame V3` (opening image, saved from the approved Video 3), no plate in the prompt box, nothing else. References: <images> image(s) + <@ names in the Cast line> Characters = <n> of 7.

Agent prompt:

```text
Generate Video 4 - <Title> as one 10-second Omni 1.2 Flash video, vertical 9:16, 720p, exactly as written below. Open on the image End frame V3.
Vertical 9:16 video, 720p, 10 seconds, <three to six> shots joined by hard cuts. <Style lock>
Cast: <every character in the video as @<Character Name>, once each, in order of first appearance, no place in the frame; a story cast member with no file in prompts/characters/ followed by a short description; a group as exactly <n> <plural name>, each @<singular name>>. <Names> exactly as their saved Characters. <Babu height sentence, when he shares a shot with a grown-up.> Each shot shows only the characters its In frame list names, each exactly once.
Setting: <the location's Environment: sentence, word for word>
00:00-00:03, <Framing> (<where the frame cuts>) <to <Framing> (<where the frame cuts>)>, <Angle>. In frame: <names>, and no one else. <Beat 1, one sentence ending on a picture, each character placed on a third, faces worded from the section 4 table.> <Beat 2, one sentence.> <Camera move, direction, speed.> Effects: <what renders>. Light: <motivated key, rim on the fur, palette, mood>, <shallow or deep> focus.
00:03-00:05, <Framing> (<cut>), <Angle>. In frame: <one subject>, and no one else. <Beat 3, one sentence; it ends on 00:05, the centre of the clip.> <Camera.> Effects: <...>. Light: <...>, <focus>.
<One line per remaining shot, each one or two beats on the boundaries 00:05, 00:07, 00:08.5, 00:10.>
<Last shot line>, ending on a held frame. Light: <...>, <focus>.
Sound: <the music state and instruments, shot by shot, in one or two sentences>. <The main sounds, one for each visible effect>. No dialogue, no lyrics.
Avoid: <the avoid line from section 5 of prompt-assembly.md, without its label>, on-screen text, captions, borders, split screens.
```

---

## Video 5 - <Title>

Images: attach `End frame V4` (opening image, saved from the approved Video 4), no plate in the prompt box, nothing else. References: <images> image(s) + <@ names in the Cast line> Characters = <n> of 7.

Agent prompt:

```text
Generate Video 5 - <Title> as one 10-second Omni 1.2 Flash video, vertical 9:16, 720p, exactly as written below. Open on the image End frame V4.
Vertical 9:16 video, 720p, 10 seconds, <three to six> shots joined by hard cuts. <Style lock>
Cast: <every character in the video as @<Character Name>, once each, in order of first appearance, no place in the frame; a story cast member with no file in prompts/characters/ followed by a short description; a group as exactly <n> <plural name>, each @<singular name>>. <Names> exactly as their saved Characters. <Babu height sentence, when he shares a shot with a grown-up.> Each shot shows only the characters its In frame list names, each exactly once.
Setting: <the location's Environment: sentence, word for word>
00:00-00:03, <Framing> (<where the frame cuts>) <to <Framing> (<where the frame cuts>)>, <Angle>. In frame: <names>, and no one else. <Beat 1, one sentence ending on a picture, each character placed on a third, faces worded from the section 4 table.> <Beat 2, one sentence.> <Camera move, direction, speed.> Effects: <what renders>. Light: <motivated key, rim on the fur, palette, mood>, <shallow or deep> focus.
00:03-00:05, <Framing> (<cut>), <Angle>. In frame: <one subject>, and no one else. <Beat 3, one sentence; it ends on 00:05, the centre of the clip.> <Camera.> Effects: <...>. Light: <...>, <focus>.
<One line per remaining shot, each one or two beats on the boundaries 00:05, 00:07, 00:08.5, 00:10.>
<Last shot line>, ending on a held frame. Light: <...>, <focus>.
Sound: <the music state and instruments, shot by shot, in one or two sentences>. <The main sounds, one for each visible effect>. No dialogue, no lyrics.
Avoid: <the avoid line from section 5 of prompt-assembly.md, without its label>, on-screen text, captions, borders, split screens.
```

---

## Video 6 - <Title>

Images: attach `End frame V5` (opening image, saved from the approved Video 5), no plate in the prompt box, nothing else. References: <images> image(s) + <@ names in the Cast line> Characters = <n> of 7.

Agent prompt:

```text
Generate Video 6 - <Title> as one 10-second Omni 1.2 Flash video, vertical 9:16, 720p, exactly as written below. Open on the image End frame V5.
Vertical 9:16 video, 720p, 10 seconds, <three to six> shots joined by hard cuts. <Style lock>
Cast: <every character in the video as @<Character Name>, once each, in order of first appearance, no place in the frame; a story cast member with no file in prompts/characters/ followed by a short description; a group as exactly <n> <plural name>, each @<singular name>>. <Names> exactly as their saved Characters. <Babu height sentence, when he shares a shot with a grown-up.> Each shot shows only the characters its In frame list names, each exactly once.
Setting: <the location's Environment: sentence, word for word>
00:00-00:03, <Framing> (<where the frame cuts>) <to <Framing> (<where the frame cuts>)>, <Angle>. In frame: <names>, and no one else. <Beat 1, one sentence ending on a picture, each character placed on a third, faces worded from the section 4 table.> <Beat 2, one sentence.> <Camera move, direction, speed.> Effects: <what renders>. Light: <motivated key, rim on the fur, palette, mood>, <shallow or deep> focus.
00:03-00:05, <Framing> (<cut>), <Angle>. In frame: <one subject>, and no one else. <Beat 3, one sentence; it ends on 00:05, the centre of the clip.> <Camera.> Effects: <...>. Light: <...>, <focus>.
<One line per remaining shot, each one or two beats on the boundaries 00:05, 00:07, 00:08.5, 00:10.>
<Last shot line>, ending on a held frame. Light: <...>, <focus>.
Sound: <the music state and instruments, shot by shot, in one or two sentences>. <The main sounds, one for each visible effect>. No dialogue, no lyrics.
Avoid: <the avoid line from section 5 of prompt-assembly.md, without its label>, on-screen text, captions, borders, split screens.
```

---

## Cover image

<Horizontal 16:9 promotional still: this film's emotional hook, scene, and composition.>

Cover references: <available canonical portraits and scale reference, or explicit missing-reference note>.

Image prompt:

```text
<Complete standalone horizontal prompt from .agents/skills/storyboard-30s/references/cover-images.md: aspect ratio, style lock, Cast line with each visible @Character Name once, environment, lighting, placed full canonical locks, expressions, visible story cast, In frame, avoid line, one frozen action, effects if needed, and no-text constraints. Expand every placeholder.>
```

---

## Cover image - 9:16 vertical

<The same story concept recomposed for a tall frame, with central faces and a quiet bottom tenth.>

Cover references: <repeat the applicable references or missing-reference note>.

Image prompt:

```text
<Complete standalone vertical prompt from the same guide, including its own Cast line with each visible @Character Name once, all full locks again, and the new composition. Do not refer to the horizontal prompt for any missing text. Expand every placeholder.>
```

````
