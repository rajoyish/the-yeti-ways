# Storyboard cover images

Shared by `storyboard-30s` and `storyboard-60s`. Read this when creating or revising either storyboard, or adding a cover to an existing one. All paths below are relative to the repository root, regardless of which assistant loads the skill.

## Deliverable and scope

Append two standalone promotional still prompts after the final video's closed `text` block: `## Cover image` for horizontal 16:9 and `## Cover image - 9:16 vertical` for a separately composed Reels cover. Honor an explicit request for only one format. Each section has a short concept paragraph, a `Cover references:` line, and `Image prompt:` followed by one complete `text` block. Do not use the video's `Images: attach` or `Agent prompt:` labels here. A cover is outside the film's running time, clip reference counts, Image map, Agent setup prompt, and continuity chain; never attach it to a video or use it as an end frame.

Write the prompts on every new storyboard and refresh them when a revision changes their story context. A cover-only request changes only the opening explanation and cover sections of an existing storyboard; do not migrate or rewrite its video prompts. When revising a storyboard that already has covers, update those sections in place without duplicating or deleting them.

Writing a storyboard produces cover prompts, not images automatically. When the user also asks to generate a cover, use an image-generation capability available in the current assistant. Generate the requested formats; if none is specified, generate the vertical cover for a vertical short and retain both prompts. Save the delivered project asset under `cover-images/<storyboard-stem>-cover-9x16.png` or `-cover-16x9.png` (use the actual generated file extension), and link it below its cover section. Use a versioned sibling if that asset already exists. If generation is unavailable, deliver the complete prompts and state that no image was generated. Never pretend a named model, saved Flow Character, reference attachment, or tool is available in another assistant.

## Choose the picture from the story

Read the complete storyboard before choosing the cover. Use the cover sections of `prompts/yeti-plateau-cup-300s-storyboard.md` as a reference for visual hierarchy, expressive faces, foreground/background depth, complete character locks, and independent wide/vertical composition. Its football pitch, rival portraits, lightning, and split blue/orange sky belong to that story, not to every cover.

Choose one readable emotional hook, setting, and prop or gesture actually present in this film. Use a single scene for a small, tender story; use a montage only when the story benefits from it. A montage's portrait and action layers must be explicitly distinguished, without accidentally duplicating a character. The still must tell the truth about the film: no invented stakes, extra cast, new location, or unrelated spectacle. Include only the cast needed to read the hook, even when the film has more characters.

- Horizontal 16:9: a deliberate widescreen composition, with the focal faces and gesture readable at thumbnail size and story-specific setting around them.
- Vertical 9:16: re-stage the same concept for a tall frame; do not crop the wide cover. Keep key faces, tufts, hands, and props away from all edges and comfortably inside the central area. Leave the bottom tenth as quiet setting detail. This is a composition margin, not a guarantee about any platform's changing UI crop.
- Give the still a framing and angle, motivated key/fill/rim light, depth of field, and a clear focal subject. Use the film's location and light sources. Preserve the canonical fur colours under that light, and keep clear air around faces. Frozen effects may belong to the setting; timestamps, shot sequences, sound, camera movement, and transitions do not belong in a still prompt.
- No lettering: no title, text, letters, numbers, logos, captions, signatures, watermarks, borders, or split-screen panels. The concept must work through the picture alone.

## Assemble each standalone prompt

Follow the still-image order in `.agents/rules/prompt-assembly.md`, adding a cover `Cast:` line immediately after the style lock. Each visible character, Yeti or supporting cast, gets its exact `@<Character Name>` once in this line, for example `Cast: @Mama Yeti, @Papa Yeti.` A group uses its count and singular Character tag, such as `exactly three Grey Wolves, each @Grey Wolf`. Later mentions in the locks, expressions, `In frame:`, and action use the plain Character name, so each Character is linked only once. Keep the full character locks and supporting descriptions: an image model outside Flow may treat the tags as plain text.

1. `Create image:` with the format, composition, and one-sentence cover concept. Use Nano Banana Pro in Flow or an available image model; 720p and Omni Flash are video settings, not cover requirements.
2. Copy the style lock from section 1 of `prompt-assembly.md` verbatim, then add the `Cast:` line with every visible character tagged once, in order of its placed lock or supporting-cast description. The cast line contains names and group counts only; positions and descriptions belong below.
3. `Environment:`: the film's setting, with the spatial detail needed for this framing. Keep its time, weather, props, and materials consistent.
4. `Lighting:`: motivated sources, directions, key/fill/rim, palette, mood, and focus.
5. Copy the full current Copy-Ready Google Flow Character Lock from `.agents/rules/character-consistency.md` for each visible Yeti, word for word, preceded by its placement. Use only visible characters' locks. Do not copy the Plateau Cup locks, abbreviate them, use placeholders, or replace them with the `Cast:` tags: an independent image model may have no saved Flow Characters. Each format repeats its own full locks.
6. `Expressions:`: each visible Yeti's expression from section 4's table in the same order as the locks. Keep it consistent with the still's action. No smile on a sad or worried beat.
7. Supporting cast, if visible: its exact Character name and its existing full description from `prompts/characters/`, or the film's established description when no Character file exists. No redesigns.
8. `In frame: <visible cast>, and no one else.`
9. Copy the section 5 avoid line verbatim.
10. `Action:`: one frozen instant, not a sequence, with distinct faces and tufts, readable eye lines, pose, hands, props, and the chosen framing/angle. Visible Yeti hands are five-fingered. If Babu Yeti shares the picture with an adult, keep him about half the adult's height and on the same depth plane; account for seated poses without enlarging him.
11. `Effects:` only if needed, followed by the no-text constraints and, for vertical, the composition margins above.

The `@` tags identify characters for linking in Flow; they do not prove that a Character was resolved or an image attached. On the `Cover references:` line, list each visible Yeti's canonical portrait from `references/characters/` if it exists, and `family-height-chart.png` when available and Babu shares the scene with an adult. Inspect available images before using them. References supply identity and scale, not their background or pose. Do not add absent characters' portraits. If a reference file is missing, state that plainly outside the prompt, do not claim to attach it, and keep the full locks as the text-only fallback. Exact likeness to an unseen portrait cannot be verified. Do not stop prompt writing solely because a portrait is unavailable.

## Section template

Expand all placeholders in the delivered storyboard. Repeat the complete prompt for the vertical section; never write "same as above" inside a prompt.

````markdown
## Cover image

A horizontal 16:9 promotional still showing <this film's emotional hook and chosen instant>.

Cover references: <available identity references and their roles, or missing-reference note and text-only fallback>.

Image prompt:

```text
Create image: Horizontal 16:9 aspect ratio, full-frame widescreen composition. <Cover concept and framing.>
<Style lock, verbatim.>
Cast: <each visible character as @Character Name exactly once, in placed-description order>.
Environment: <Story location.>
Lighting: <Motivated light, rim, palette, mood, focus.>
<Placed full current lock for every visible Yeti, verbatim.>
Expressions: <One appropriate expression per visible Yeti.>
<Supporting cast descriptions, if present.>
In frame: <Visible cast>, and no one else.
<Avoid line, verbatim.>
Action: <One instant, placement, gaze, gesture, scale.>
<Effects if needed.> No text, title, letters, numbers, logos, captions, signatures, watermarks, borders, or split-screen panels.
```

---

## Cover image - 9:16 vertical

The same story concept composed for a vertical Reels cover: <specific new placement>.

Cover references: <repeat the applicable available references or missing-reference note>.

Image prompt:

```text
Create image: Vertical 9:16 aspect ratio, full-frame portrait composition. <Tall composition with key faces, tufts, hands, and props in the central area and the bottom tenth reserved for quiet setting detail.>
<Repeat every required piece above in full, including the style lock, the Cast line with each visible @Character Name once, and the complete character locks; adjust staging for the tall frame.>
```
````

## Verify

- Both cover sections follow the final video (unless one format was explicitly requested); each has exactly one complete image prompt and its own reference note.
- The concept, cast, props, expressions, and lighting belong to this film. Both prompts are independently usable, and the vertical version is recomposed.
- Every visible Yeti has its exact current full lock once per prompt; absent Yetis have none. The style and avoid locks are unchanged. Each visible character also has exactly one `@` tag in the cover's `Cast:` line and none elsewhere in the image prompt; the cast agrees with `In frame:` and the placed descriptions. Tags never replace the full locks. No unexpanded placeholders.
- Video headings, `Images:` lines, Agent prompts, and reference counts exclude covers. The no-image/no-character-description rules for video blocks do not apply to these two still sections.
- Run `node .agents/skills/storyboard-30s/check_filter.mjs <storyboard>`; it scans covers too. Read any notes in context; an `OK` is a text check, not a guarantee of generation acceptance.
- If an image was requested and generated, inspect the result for the concept, identity, scale, separate faces/tufts/hands, framing, and absence of text. Check its actual dimensions/aspect ratio, save it in the workspace, and link the actual file. If it misses the requested format, regenerate in that format rather than crop important content. Report missing-reference limits honestly.
