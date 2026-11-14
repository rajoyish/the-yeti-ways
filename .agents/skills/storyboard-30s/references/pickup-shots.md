# Pick-up shots

Shared by `storyboard-30s`, `storyboard-60s`, `nursery-rhyme-storyboard`, and `story-to-storyboard`. Read it whenever the user asks for a pick-up, a pickup, a pick-up shot, a missing shot, an insert, a cutaway, a B-roll clip, a bridge shot, or a missing reaction for a storyboard whose numbered videos are already written or generated.

## What a pick-up is

A pick-up is a minor, targeted clip made after the numbered videos are finished (after "principal photography wraps"), while the film is being edited. A director orders one for one of three jobs:

| Job | What it fixes | Typical content |
| --- | --- | --- |
| Continuity fix | A jump the edit cannot hide: a prop in the wrong hand, a character who leaves one place and appears in another, a missing step of an action | The missing moment, matching the light, positions, and props on both sides of the cut |
| Missing reaction | An event that plays with no Yeti face after it, or a line with no listener | A Close-Up or Medium Close-Up of the reacting face, turned toward the event off-screen |
| Bridge | Two scenes that do not join: a time jump, a journey, an absent character, a change of place | A cutaway, a journey, an establishing shot of the next place, or what an absent character is doing |

A pick-up is never a new story beat. It shows something the story already implies, and it never adds a problem, a character, a prop, or a location that changes the plot. If the request would change the story, say so and revise the numbered videos instead.

## How it sits in the file

- **Name and number.** `## Pick-up <n> - <Title>`, with a spaced hyphen and a short title chosen once (`## Pick-up 1 - Kobi's Search`). Pick-ups are numbered 1, 2, 3 in the order they are requested, never renumbered, and never share a number with a video. A later request appends the next number; it never edits the numbered videos unless the user asks. Never call it a video, a B-roll, an insert, or `Video <N+1>`, and never fold it into the numbered count: the file name, the title's length, Instruction 3's video count, and every `## Video` count stay the numbered videos only.
- **Place.** All pick-ups come after the last `## Video` section and before `## Cover image`, in number order, each followed by `---`.
- **Section.** Each pick-up section holds, in order, and nothing else:
  1. `Pick-up:` one line for the editor: the job (continuity fix, missing reaction, or bridge), what it fixes in one clause, where it cuts (`Cut in after Video 11 and before Video 14`, or `Cut over Video 6 at 00:05-00:07`), and the edit mode (below).
  2. `Images:` the same form as a video's line, then `Not part of the end-frame chain: it opens on no end frame and saves none.` With no image: `Images: attach no image in the prompt box; the @ Characters in its Cast line are its only references. References: 0 images + <n> Characters = <n> of 7. Characters: <n> of 3.`
  3. `Agent prompt:` and one `text` block.
- **Image map.** One row per pick-up, after the last video's row: `| Pick-up <n> | <images, or "Nothing: no plate, no end frame"> | <what each is for> | <counts> |`. The line under the table adds: `Pick-ups are extra clips for the edit: they never open on or save an end frame, and no numbered video opens on one.`
- **Instruction 2.** One added sentence lists the pick-ups and says they are extra clips for the edit, not part of the numbered videos, opening on no end frame and saving none. Keep the card under about 250 words. Instruction 1 and Instruction 3 stay word for word: the pick-up's first line carries every difference, so a project whose cards are already pasted in Flow needs no change.
- **Opening paragraph.** One sentence says the file also holds `<P>` pick-up clips for the edit, after the numbered videos.

## The edit mode

Every `Pick-up:` line names one of two modes, because each Flow clip carries its own generated audio:

- **Insert.** The pick-up is placed between two clips and adds its running time to the film. Its own audio plays, so its `Sound:` line continues the music of the clips on each side (the same instruments, tempo, and feeling from the film's music plan) and the ambient bed of its place, and it starts and ends on a calm, held music state so it cuts in on either side.
- **Overlay.** The pick-up's picture replaces a stretch of one numbered clip's picture, and that clip's audio keeps playing under it, so the running time does not change. Use it for a missing reaction under a spoken line or a lyric, and for every pick-up in a song film. Its own audio is muted in the edit, so its `Sound:` line is the soft music and ambient of that clip, and every mouth in it stays closed.

## The Agent prompt

A pick-up's Agent prompt follows the same rules as a video's (the parent skill's step 3 and section 6 of `.agents/rules/google-flow.md`): style lock, `Cast:`, `Setting:`, shot lines with `In frame:`, faces from the expression table, `Light:` ending with the focus, `Sound:`, and the avoid line, all in the film's orientation, at 720p, 10 seconds, Omni 1.2 Flash, with at most 3 linked Characters (every Yeti in it first) and at most 7 references. These differ:

- **First line.** `Generate Pick-up <n> - <Title> as one 10-second Omni 1.2 Flash video, <vertical 9:16 or horizontal 16:9>, 720p, exactly as written below. It is a pick-up shot, an extra clip for the edit and not one of the <N> numbered videos: it does not open on an end frame and does not save one. Generate it in Reference-to-Video (R2V, Ingredients) mode, never First Frame (I2V) mode, ` then either `with the @ Characters in the Cast line as its only references.` or `using the image <image> and every @ Character in the Cast line together as references<, and make the first frame match the image <image>>.`, then `Name the clip "Pick-up <n> - <Title> - take <n>".`
- **Reference image, in this order.** (1) The plate of the location it is set in, as a reference for the place and light; ask for the first frame to match it only when the first shot is the empty place. (2) For a continuity fix or a missing reaction inside a scene, the approved `End frame V<N>` of the video it cuts into, as a reference for positions, props, faces, and light, without a first-frame match unless the pick-up starts on that exact picture. (3) No image, when its place has no plate. A new location with no plate gets a `Plate - <Location>` line in the Agent setup prompt, with the setup prompt saying which plates already exist and to generate only the missing ones. Never a grid, a triptych, a cover, or a frame from another film.
- **Shots.** One to six shots on the beat boundaries `00:00`, `00:01.5`, `00:03`, `00:05`, `00:07`, `00:08.5`, `00:10`, with one beat sentence per beat, each ending on a picture. A missing reaction is usually one or two long shots, which give the editor handles to trim; a bridge or a journey may cut faster. The first shot starts from rest and the last eases to a stop, `ending on a held frame`, so it cuts in at either end. Every clip is still generated at 10 seconds; a pick-up is the only clip the editor may trim.
- **Continuity.** The light, the faces, the props, and the screen direction match the clips it cuts between, from the film's lighting plan at that point in the story: an overlay repeats the `Light:` part of the shot it covers word for word; an insert repeats the last `Light:` part of the clip before it, unless it is set in another place or time. A location already in the film uses its `Setting:` sentence word for word; a new place gets its own `Environment:` sentence.
- **Yetis.** A pick-up may be a cutaway with no Yeti in it (story cast alone, or only the place). Its `Cast:` line then ends `No Yetis and no other characters appear in this video.` and its avoid line adds `, any Yeti`. Such a pick-up is cut in short, so the film still never stays away from the Yetis for long. A missing reaction is a Yeti's face whenever the event belongs to a Yeti.
- **Speech and singing.** A pick-up carries no spoken line, narration, or singing unless the user asks for one. In a `story-to-storyboard` film, a requested line follows that skill's speech rules (insert mode only), and its `## Script` row goes after every video's rows, with `Pick-up <n>` in the Video column and `in the edit` as its film time. In a `nursery-rhyme-storyboard` film, a pick-up is always an overlay with accompaniment-only sound, no singing, and no lyric block: the song lives in the numbered clips, and a pick-up never adds, repeats, or re-sings a word. With no speech, the `Sound:` line ends `No dialogue, no lyrics.` and the avoid line adds `, talking, moving mouths, singing`.
- **Filters.** Run the originality pass and the filter rules exactly as for the videos.

## Verify

- `node .agents/skills/storyboard-30s/check_pickups.mjs <file>` prints `OK`: headings numbered from 1 with a spaced hyphen, after the last video and before the covers; each with its `Pick-up:` line naming a job and a mode, its `Images:` line with its counts, and its `Agent prompt:` block whose first line names the pick-up, says it opens on and saves no end frame, asks for R2V, 720p, 10 seconds, and Omni 1.2 Flash, and names the clip; at most 3 `@` names and 7 references; an Image map row; and no leftover `B-roll`, `Insert <n>`, or `Video <N+1>` headings.
- `node .agents/skills/storyboard-30s/check_filter.mjs <file>` prints `OK`, which covers the pick-up prompts too; a `story-to-storyboard` film also passes `check_speech.mjs`.
- The numbered video counts, Instruction 3's count, and the file name are unchanged by the pick-ups.

## Hand off

Say which pick-ups were added, the job and edit mode of each, where each cuts in, and what to attach. Say that each is generated in Flow from its Agent prompt like a video, but never saved from as an end frame and never used to open a numbered video, and that writing the prompt does not generate the clip.
