---
name: create-flow-assets
description: >-
  Generate missing Google Flow reference assets from a Yeti storyboard in prompts/: location plates in the storyboard's film aspect ratio, story cast fronts (1:1), and turnarounds (16:9). Automatically select OpenAI for Codex / ChatGPT or Google for Gemini / Antigravity, respecting explicit user overrides. Inventory existing assets, build missing Character files with flow-character-builder, generate, check, save, and link the images. Use for "create the plates", "generate character images", "front and turnaround", "make the Flow assets", or /create-flow-assets. Never generate Papa Yeti, Mama Yeti, or Babu Yeti.
---

# Create Flow assets

A storyboard from `storyboard-30s` or `storyboard-60s` names two kinds of image that must exist before its clips are generated: the location plates its Agent setup prompt describes, and the saved Characters its `Cast:` lines call with `@`. This skill makes those images from the prompts that already exist: the plate lines in the storyboard and the Portrait and Body prompts in each Character file written by `flow-character-builder`. It writes no new scene, story, or character design of its own.

Read before working:

- `.agents/rules/google-flow.md`, sections 2 (saved Characters) and 3 (plates, step 5).
- `.agents/rules/character-consistency.md`, for what the Yetis must look like beside the story cast, and its rule that a drifted image is never reused.
- `.agents/skills/flow-character-builder/SKILL.md`, steps 1B, 6, and 7: the file layout, the save paths, and the image checks.
- `.agents/skills/storyboard-30s/SKILL.md` (or `storyboard-60s`): the Agent setup prompt bullet, for how plates are named.

## The assets and where they live

| Asset | Prompt source | Format | Saved to |
| --- | --- | --- | --- |
| Plate | The `Plate - <Location>: ...` line in the storyboard's `## Agent setup prompt`, sent as `Create image: <the line after the label>` | The storyboard's film aspect ratio: vertical 9:16 or horizontal 16:9 (step 1) | `references/plates/<storyboard-stem>/plate-<location-kebab>.png` |
| Character front | The `text` block under `## Portrait` in `prompts/characters/<name-kebab>-flow-character.md` | Square 1:1 | `references/characters/<name-kebab>-front.png` |
| Character turnaround | The `text` block under `## Body` in the same file, generated with the approved front attached | Horizontal 16:9 | `references/characters/<name-kebab>-turnaround.png` |

`<name-kebab>` is the Character name in lower case with spaces as hyphens (`Lumen Grazer` becomes `lumen-grazer`), the same rule `flow-character-builder` uses. The name in the storyboard, the Character file, the image files, and the saved Flow Character is spelled exactly the same. In Flow, each uploaded plate is renamed to its plate name exactly (`Plate - Starway Sky`), because the Image map and the Agent prompts call it by that name.

Both `references/characters/` and `references/plates/` hold local images that git ignores.

## Workflow

### 1. Take the storyboard

The user gives a storyboard as a path, a Markdown link, or a file name (`prompts/<slug>-storyboard.md`). Resolve it to a file in `prompts/`. If it is missing, or is not a storyboard (a `-3x2.md`, a triptych, or a carousel file), say so and ask for the storyboard. If the user names only some assets ("just the plates", "only Lumen Grazer"), work on those alone.

Determine the film's aspect ratio from the format lines in its video Agent prompts: `Vertical 9:16 video` means `9:16`; `Horizontal 16:9 video` means `16:9`. If those lines are absent, use an unambiguous orientation in the storyboard's introduction before its first `##` heading. Ignore promotional cover prompts, Character sheets, and house-format examples: they can deliberately use other ratios. Every plate must use the film's ratio. Do not ask for orientation when the storyboard supplies it. If the film format is missing or contradictory, ask only for the unresolved format before generating plates. If a plate prompt contradicts the film format, have the relevant storyboard skill correct it at its source before emitting prompts; never silently send conflicting prompt text and generation settings. Character fronts stay 1:1 and turnarounds stay 16:9 regardless of film orientation.

### 2. Take stock

Run the inventory from the repository root:

```sh
node .agents/skills/create-flow-assets/scripts/inventory.mjs <storyboard>
```

It reads the Agent setup prompt for every plate and every Agent prompt's `Cast:` line for every `@` name, then checks `prompts/characters/` and `references/characters/` (and `references/plates/<stem>/`) for each one. Read its report and act on each row:

- **Plate `missing`**: generate it. A plate whose prompt line has no `Plate - <Location>:` label was matched to the first sentence's names by order. Confirm the match by reading the line's `Environment:` text before generating. Offer to label the lines with the storyboard skill (step 6a of its older-storyboard update). A plate the script cannot match (`UNNAMED PLATE`) is not generated until the storyboard is fixed.
- **Plate `exists`**: skip it, unless the user asked to regenerate it.
- **Story cast `complete`**: both images exist, so skip it, unless the user asked to regenerate it. Say it was found and where.
- **Story cast `images missing`, `front missing`, or `turnaround missing`**: generate what is missing. A missing front means both are regenerated, because the turnaround is made from the front. Ask before replacing an existing turnaround.
- **Story cast `new`**: no Character file exists. New video prompts often add new characters, and this is how they show up. First check the `Check:` lines. If a similar existing Character is listed (`Snowy Owl` beside a new `Snow Owl`), ask whether it is the same character. If it is, the storyboard is renamed to the existing name (with the storyboard skill, every mention) and no new file is made. If it is a new character, invoke `flow-character-builder` in storyboard mode for exactly the new members. That skill writes each file and updates the storyboard's `Cast:` lines and budget. Then run the inventory again.
- **Yetis**: never generated here. Papa Yeti, Mama Yeti, and Babu Yeti are canonical and already saved in Flow, and a Yeti made from text is where tails, horns, and wrong colours appear (`google-flow.md`, section 2). Report a missing canonical portrait or Character image as missing local files only. Their source is the user's saved Flow Characters and `references/characters/<papa, mama, or babu>-yeti.png`. To get missing local Yeti images, export them from the saved Flow Characters with the Flow Account Seeder (`tools/flow-account-seeder/`: **Export**, then `node tools/flow-account-seeder/seed.mjs collect`).
- A story cast member written in a `Cast:` line without `@` (described-only, kept off the reference budget) has no Character and gets no images. Leave it alone.

### 3. Select the image provider automatically

Honor an explicit provider or model requested by the user first. Otherwise use the active agent's identity, not the video model named in the storyboard:

| Active agent | Default image provider |
| --- | --- |
| Codex / ChatGPT / OpenAI agent | OpenAI (GPT Image) |
| Gemini / Google Antigravity agent | Google (Gemini / Nano Banana Pro) |
| Claude Code or another agent | Use the sole available image provider, checking native image tools first, then configured API keys. If both providers are available or neither is available, ask which provider to use. |

Select a specific model using the native tool's available model, or the helper's `--model`, environment override, and default in step 4. A model name requested by the user determines its provider. Never infer the active agent from the shell, repository name, or storyboard's references to Google Flow or Nano Banana Pro.

State the selected provider, film aspect ratio, and assets to generate in a brief progress update, then proceed with the requested assets. Do not ask the user to choose a provider, reconfirm the asset list, or approve generation on a normal run. An explicit subset still limits the work; existing-image replacement and ambiguous-character checks in step 2 still apply.

### 4. Choose the route for the selected provider

Use the first of these that works with the selected provider. If it is unavailable, use the prompt-pack route; never silently switch providers.

1. **The assistant's own image tool for that provider**, when the session has one (for example, ChatGPT image generation in Codex, or Google's image generation in Antigravity).
2. **The helper script**, when the provider's key is in the shell: `OPENAI_API_KEY` for ChatGPT, and `GEMINI_API_KEY` or `GOOGLE_API_KEY` for Google. Check that the key is set with `[ -n "$OPENAI_API_KEY" ] && echo set`, and never print it. If the key is missing, tell the user to add `export OPENAI_API_KEY=...` (or `GEMINI_API_KEY`) to their shell profile and start a new session. Never ask them to paste a key into the chat.
3. **A prompt pack**, when neither is available. Write every prompt to a file with `--emit` (step 5), list each one with its format, any image to attach, and its save path, and tell the user to generate them in ChatGPT, the Gemini app, or Flow (Nano Banana Pro) and save each to its path. Say plainly that no image was generated.

The script's default models are `gpt-image-1` (OpenAI) and `gemini-3-pro-image-preview` (Google, Nano Banana Pro). Pass `--model <id>`, or set `OPENAI_IMAGE_MODEL` or `GOOGLE_IMAGE_MODEL`, when the user wants another model or a default is retired. When the API rejects a model id, check the provider's current model list rather than guessing.

### 5. Generate

Write the prompts, verbatim, to the scratchpad:

```sh
node .agents/skills/create-flow-assets/scripts/inventory.mjs <storyboard> --emit <scratchpad>/flow-assets
```

Never edit the prompt text to suit a model. The words "Nano Banana Pro" in a Character file are the Flow recipe, not part of the prompt. If a prompt is wrong, fix it at its source (the storyboard skill or `flow-character-builder`), then emit again.

Generate in this order, one image per call:

1. Each plate: pass the inventory's resolved `aspect` as `--aspect 9:16` or `--aspect 16:9`, with no reference image. Resolve any reported aspect problem before generating or emitting that plate.
2. Each Character's front: `--aspect 1:1`, no reference image.
3. Check the front (step 6). Only once it passes, generate the turnaround: `--aspect 16:9 --ref <the approved front>`. The Body prompt opens by telling the model to use the attached image.

```sh
node .agents/skills/create-flow-assets/scripts/generate_image.mjs --provider <openai|google> \
  --prompt-file <scratchpad>/flow-assets/<asset>.txt --out <save path> --aspect <1:1|9:16|16:9> [--ref <front.png>]
```

The script refuses to overwrite an existing file. Pass `--force` only when the user agreed to replace that file; otherwise save a versioned sibling (`-v2`). It keeps the extension true to the bytes returned and prints the path and dimensions.

With an assistant's own image tool, send the same prompt text, attach the same reference, ask for the same aspect ratio, and save the result to the same path.

### 6. Check every image

Open each image (Read it) and check it before it is saved as approved or used as a reference:

- **Plate**: in the film's orientation, the location as its `Environment:` text describes it, the light the line names, and no characters, people, animals, or text. If the selected tool returns 2:3 or 3:2 instead of the film's ratio, a plate must be centre-cropped to 9:16 or 16:9 (`sips -c <height> <width> <file>`: height 1536 by width 864 for a 1024x1536 image, height 864 by width 1536 for a 1536x1024 one), because a plate holds no character. Look at it again after cropping.
- **Character front and turnaround**: the user checks in step 7 of `flow-character-builder` and the `## Checks` list in the Character file. That means the whole body is in frame, the digit, fin, or limb counts are right and separate, the palette matches with no extra markings, the face is friendly, and the background is pure white with no floor line or text. The turnaround shows three views of the same character at one size, and its back matches the description. Never crop a character image; with ChatGPT, keep the 3:2 turnaround and report its size.

An image that fails is fixed with one of the Character file's `## Fix-up edits`. Write the edit text to a prompt file and generate with `--ref <the failed image>` to a new file. Try at most two fixes, then report the fault and stop. A failed image is never used as a reference and never left at the approved path.

### 7. Save and link

- Plates stay at their `references/plates/<stem>/` paths. List them for the user with their exact Flow names.
- For each Character, add or update the `## Generated reference images` section of its file, below the `Draft changes:` paragraph, in the form the existing files use. Write a `Preparation status:` line, then one link per image with its real size and format (`- [Portrait: front view](../../references/characters/<name-kebab>-front.png) — 1024 × 1024 PNG, square 1:1.`). End with one sentence naming the model used and saying the front was the turnaround's reference. Change nothing else in the file.
- Never touch the storyboard's video prompts, cards, or Image map. A storyboard only changes through `flow-character-builder` (new members) or the storyboard skills.

### 8. Report

Give one table: each asset, then `generated`, `skipped (found)`, `failed`, or `prompt only`, with its path, its size, and the model used. Then give the Flow steps, once:

1. Upload each plate to the film's Flow project and rename it to its plate name exactly (`Plate - Cloud Lotus Garden`). Once the plates are uploaded, do not paste the Agent setup prompt, because it would make a second set.
2. For each Character: Characters, New character, its exact name, no voice, the Character info from its file, the front image in Portrait, the turnaround in Body, then Done. Type `@` to check the name resolves.
3. Run Flow Character Linker on each pasted Agent prompt; any name it lists as unmatched is not saved yet.

Steps 1 and 2, and the film's Agent instruction cards, can be done in one go with the Flow Account Seeder (`tools/flow-account-seeder/README.md`): run `node tools/flow-account-seeder/seed.mjs build <storyboard>`, open the film's project, then use **Import** in the extension's side panel. The same seed recreates everything in another Flow account when one runs out of credits. An asset made directly in Flow rather than by this skill has no local copy: **Export** it from Flow and run `seed.mjs collect` first, so it lands at the path this skill expects and is never regenerated.

Name anything still missing: a Yeti's local images, an unlabeled plate line, or a prompt pack waiting to be generated.

## Checks before finishing

- [ ] The inventory was run on the storyboard, and its report was acted on row by row.
- [ ] No Yeti image was generated.
- [ ] Every new story cast member was checked against `prompts/characters/` for a similar name, and a file was built with `flow-character-builder` only for members that are really new.
- [ ] The provider follows the user's explicit choice or the active-agent default, and every image came from that provider.
- [ ] Plate aspect ratios were resolved from the storyboard's film format, excluding covers, and every generated plate matches it; Character formats remain 1:1 and 16:9.
- [ ] Every prompt sent was the verbatim plate line or Portrait or Body block; every turnaround was made with its approved front attached.
- [ ] Every image was opened and checked; no failed image sits at an approved path or was used as a reference; nothing was overwritten without the user's agreement.
- [ ] Every saved image has its exact name and path, every Character file links its images with their real sizes, and the report says honestly what was and was not generated.
