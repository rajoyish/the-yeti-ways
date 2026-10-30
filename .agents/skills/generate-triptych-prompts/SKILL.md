---
name: generate-triptych-prompts
description: >-
  Trigger when the user asks to generate triptych prompts, 3-panel grid prompts, 1x3 triptych prompts,
  or runs "/generate-triptych-prompts". Reads a Yeti panel image file (`prompts/<slug>-<30s or 60s>-3x2.md`)
  and combines each video's six panel prompts, verbatim, into two horizontal 16:9 triptych grid prompts
  (panels 1-3 and 4-6), saved to `prompts/<slug>-<30s or 60s>-triptych.md` under the same
  `## Video N - <Title>` headings as the storyboard.
---

# Generate Triptych Prompts (1x3 Storyboard Grid)

This skill reads a panel image file written by `create-3x2-timed-image` (`prompts/<slug>-30s-3x2.md` or `prompts/<slug>-60s-3x2.md`) and combines its panel prompts into 3-panel (1x3 triptych) grid prompts for Google Flow or a compatible image model.

Each 10-second video has six panel image prompts, and the skill splits them into two triptych grids:

- **Grid 1:** Panels 1, 2, and 3 (left, center, right). Shot 1 and the first beat of Shot 2.
- **Grid 2:** Panels 4, 5, and 6 (left, center, right). The second beat of Shot 2 and Shot 3.

A 30-second film gives 6 triptych prompts (3 videos × 2 grids) and a 60-second film 12 (6 videos × 2 grids).

Triptychs are planning and review sheets: they show a video's beats at a glance for reviewing the story or sharing it. They are never attached to a Flow clip as ingredients. Flow reads a multi-panel image as one picture, so a 16:9 three-scene triptych blends its panels, borders, and labels into a 9:16 clip and pulls the characters and scene off model; `.agents/rules/google-flow.md` sets out what each clip is given instead (saved Characters, a plate or the previous clip's end frame, and at most two single panel images). The triptych is a drawn alternative to the composed grid that `compose_grid.ps1` builds from the panel images. An image model drawing three panels in one picture can drift between them (a changed colour, tuft, face, or framing), so every panel in a triptych is checked against its panel prompt before the triptych is used. The composed grid stays the safer reference for a clip.

## 1. Input

- The user gives a panel image file, e.g. `prompts/yeti-forest-wind-strike-30s-3x2.md`.
- With no file, use the most recently changed `prompts/*-3x2.md`. If several were changed recently and the intent is unclear, ask which one.
- If the user gives a storyboard (`-storyboard.md`) instead, the panel prompts do not exist yet: run `/create-3x2-timed-image` on it first.

## 2. Run the script

Always use the script. It copies every panel prompt verbatim, so a long file is never truncated or paraphrased by hand:

```bash
node .agents/skills/generate-triptych-prompts/generate_triptych.mjs prompts/<slug>-<30s or 60s>-3x2.md --save
```

| Flag | Description |
| --- | --- |
| `[file]` | The panel image file. If omitted, the latest `prompts/*-3x2.md` is used. |
| `--save` | Saves to `prompts/<slug>-<30s or 60s>-triptych.md`, next to the 3x2 file. |
| `--out <path>` | Saves to a custom path instead. |
| `--video <N>` | Only Video `N`. |
| `--grid <1\|2>` | Only Grid 1 or Grid 2. |
| `--help` | Shows usage. |

The script stops and writes nothing when a video does not have exactly Panels 1 to 6, a panel has no `Create image:` prompt, or a panel's text would not appear verbatim in the output. Fix the 3x2 file (with `create-3x2-timed-image`), never the triptych file, and run it again.

`--video` and `--grid` with `--save` overwrite the whole triptych file with only that selection, so use them for printing one grid, or with `--out` to a separate file.

## 3. What the script writes

The triptych file is generated output. Never edit it by hand; change the 3x2 file and run the script again.

- `# <Title> Triptych Grid Prompts (1x3)`, with the title taken from the 3x2 file's own heading.
- One `## Video N - <Title>` section per video, using the video heading from the 3x2 file word for word, which is the storyboard's heading too, so every file in the pipeline names each video the same way. Never write a bare `## Video N`.
- Under it, `### Grid 1 · Panels 1, 2, 3 · <timecode>` and `### Grid 2 · Panels 4, 5, 6 · <timecode>`, a `Panels:` line with the three panel titles, and the prompt in a ` ```text ` block.

Each prompt follows this template:

```text
Create image: Horizontal 16:9 aspect ratio. A 3-panel storyboard grid (1x3 triptych layout) of <layout>, separated by thick black borders, read left to right as one continuous sequence of 3D animated cinematic scenes. Each panel follows its own description below, keeps the same characters, environment, and light from panel to panel, and holds no text, numbers, captions, or watermark:

Panel 1 (Left): <the exact 'Create image: ...' prompt of Panel 1 or 4>

Panel 2 (Center): <the exact 'Create image: ...' prompt of Panel 2 or 5>

Panel 3 (Right): <the exact 'Create image: ...' prompt of Panel 3 or 6>
```

`<layout>` depends on the film's shape. For the vertical Yeti shorts, whose panel prompts say `Vertical 9:16`, it is "three tall vertical 9:16 panels standing side by side and filling the frame from edge to edge": three 9:16 panels side by side are almost exactly one 16:9 canvas, so the panel prompts' own aspect ratio lines agree with the grid instead of fighting it. For a widescreen film it is "three horizontal 16:9 panels side by side in one row, centred on a black background".

**Preservation guarantee:** every panel prompt is copied from `Create image:` to the end of its code block, character locks, environment, lighting, expressions, supporting cast, avoid line, action, effects, and closing sentence included. Nothing is shortened, rephrased, summarised, or reordered.

## 4. Report

Tell the user the saved path and list the grids, each as `Video N - <Title> · Grid G · Panels …`. Do not paste the prompts into the chat; each runs to tens of thousands of characters, and the file holds them copy-ready. Remind the user to generate each triptych with the family reference image attached and to check every panel against its panel prompt and the look check in section 7 of `.agents/rules/prompt-assembly.md`.
