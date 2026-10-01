---
name: generate-triptych-prompts
description: >-
  Trigger when the user asks to generate triptych prompts, 3-panel grid prompts, 1x3 triptych prompts,
  or runs "/generate-triptych-prompts". Reads storyboard markdown files containing individual panel prompts
  (such as `prompts/*-3x2.md`) and automatically combines them into formatted 3-panel (1x3 triptych) grid prompts.
---

# Generate Triptych Prompts (1x3 Storyboard Grid)

This skill reads storyboard markdown files containing individual panel prompts (such as `prompts/*-30s-3x2.md` or `prompts/*-60s-3x2.md`) and automatically combines them into formatted 3-panel (1x3 triptych) grid prompts for image generation in Google Flow or compatible image models.

In the standard Yeti storyboard pipeline, each 10-second video contains 6 individual panel image prompts. This skill splits each video into two sequential 3-panel triptych grids:
- **Grid 1:** Panels 1, 2, and 3
- **Grid 2:** Panels 4, 5, and 6

A 30-second storyboard yields 6 triptych grid prompts (3 videos × 2 grids), and a 60-second storyboard yields 12 triptych grid prompts (6 videos × 2 grids).

---

## Instructions for the Skill

### 1. Input Handling

- **Wait for or ask for the file:** The user should provide a storyboard file name (e.g., `prompts/yeti-forest-wind-strike-30s-3x2.md`).
- **Default / Fallback:** If the user runs the skill without providing a file:
  1. Inspect the `prompts/` directory for the latest active storyboard file formatted as `prompts/*-30s-3x2.md` (or `prompts/*-3x2.md`).
  2. If found, proceed with the latest file (or confirm with the user). If multiple candidates exist and the intent is ambiguous, prompt the user to provide or confirm the target file.

### 2. Data Extraction

1. Read the specified storyboard markdown file.
2. For each video section (`## Video <N>...`), locate the 6 individual panel image prompts under their respective panel headers (`### Panel 1` through `### Panel 6`).
3. Under each panel header, locate the prompt block starting directly with the phrase `Create image:`.
4. Extract the exact text block for each panel, starting from `Create image:` up to the end of the code fence or section block.
5. **Preservation Guarantee:** Never shorten, rephrase, summarize, or alter any part of the extracted prompt text. All character locks, environment sentences, lighting instructions, expressions, action descriptions, avoid lines, and effects must be preserved verbatim.

### 3. Grid Grouping

Because each 10-second video contains 6 panels, split them into two separate 3-panel grids per video:
- **Grid 1:** Combines Panels 1, 2, and 3.
  - Left panel: Panel 1
  - Center panel: Panel 2
  - Right panel: Panel 3
- **Grid 2:** Combines Panels 4, 5, and 6.
  - Left panel: Panel 4
  - Center panel: Panel 5
  - Right panel: Panel 6

### 4. Formatting

For every grid, output the combined prompt using the exact template below. Replace the bracketed placeholders with the extracted text from Step 2.

#### Prompt Template

```text
Create image: Horizontal 16:9 aspect ratio. A 3-panel storyboard grid (1x3 triptych layout) separated by thick black borders, depicting sequential 3D animated cinematic action scenes:

Panel 1 (Left): [Insert the exact 'Create image:...' text for Panel 1 or 4]

Panel 2 (Center): [Insert the exact 'Create image:...' text for Panel 2 or 5]

Panel 3 (Right): [Insert the exact 'Create image:...' text for Panel 3 or 6]
```

- For **Grid 1**:
  - `Panel 1 (Left):` contains the exact extracted text for Panel 1.
  - `Panel 2 (Center):` contains the exact extracted text for Panel 2.
  - `Panel 3 (Right):` contains the exact extracted text for Panel 3.
- For **Grid 2**:
  - `Panel 1 (Left):` contains the exact extracted text for Panel 4.
  - `Panel 2 (Center):` contains the exact extracted text for Panel 5.
  - `Panel 3 (Right):` contains the exact extracted text for Panel 6.

### 5. Final Output

1. Present the newly generated grid prompts clearly, organized by their respective Video numbers and Grid numbers:
   - **Video 1 - Grid 1** (Panels 1, 2, 3)
   - **Video 1 - Grid 2** (Panels 4, 5, 6)
   - **Video 2 - Grid 1** (Panels 1, 2, 3)
   - **Video 2 - Grid 2** (Panels 4, 5, 6)
   - *(and so on for subsequent videos)*
2. Enclose each generated grid prompt in a ` ```text ` block so it is copy-ready.
3. Ensure no text from the original prompts is altered or truncated during the transfer.
4. **Saving Output:** When requested, or when processing full storyboard files, save the generated document to `prompts/<slug>-triptych.md`.

---

## Automated Script Execution

A dedicated helper script is included with this skill to extract and format triptych prompts deterministically without risk of LLM context truncation on large files:

```bash
# Process a specific file and print to console:
rtk node .agents/skills/generate-triptych-prompts/generate_triptych.mjs prompts/<slug>-30s-3x2.md

# Process and save directly to prompts/<slug>-triptych.md:
rtk node .agents/skills/generate-triptych-prompts/generate_triptych.mjs prompts/<slug>-30s-3x2.md --save

# Automatically detect the latest *-3x2.md file in prompts/ and save:
rtk node .agents/skills/generate-triptych-prompts/generate_triptych.mjs --save

# Generate for a specific video or grid only:
rtk node .agents/skills/generate-triptych-prompts/generate_triptych.mjs prompts/<slug>-30s-3x2.md --video 1 --grid 1
```

### Script CLI Options

| Flag | Description |
| --- | --- |
| `[file]` | Path to the storyboard file (e.g. `prompts/yeti-forest-wind-strike-30s-3x2.md`). If omitted, latest active file is used. |
| `--save` | Automatically saves the formatted markdown to `prompts/<slug>-triptych.md`. |
| `--out <path>` | Custom destination path for the markdown output. |
| `--video <N>` | Restrict output to Video number `N`. |
| `--grid <1\|2>` | Restrict output to Grid 1 or Grid 2. |
| `--help` | Show command line usage. |
