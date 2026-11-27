---
name: record-story
description: Record a Yeti story's narration and dialogue in Google AI Studio (Gemini 3.8 Flash TTS) by driving the user's signed-in AI Studio tab with browser automation, one speech block per run, exactly as the AI Studio Voice Runner extension's "One speech block per run" mode does, then join the takes into story-full.wav with its story-manifest.json and verify every word with whisper.cpp (ggml-medium.en). Takes a speech-blocks file from speech-prompts/ (or a story from stories/, voiced first with /ai-studio-tts). Use for "record the story", "voice the story", "record the narration", "make story-full.wav", "run the Voice Runner for me", "retake block B016", or /record-story.
---

# Record a story in AI Studio

Pipeline: **speech blocks → `plan.mjs` (runner) → the runner in the AI Studio tab (one block per run) → `save()` bundle → `finish.mjs` (parts, `story-full.wav`, manifest) → `verify.mjs` (whisper.cpp).**

`SKILL` = `.agents/skills/record-story` (Claude Code reaches it through `.claude/skills/record-story`). Run every command from the repository root. It needs Node.js, ffmpeg, a browser-automation tool that can open a tab, click, and run JavaScript in the page (Claude in Chrome's `javascript_tool` and `computer`, Antigravity's browser, or Codex's browser tool), and, for the check, `whisper-cli` with `~/.cache/whisper-cpp/ggml-medium.en.bin`.

**Why not the extension's side panel:** the AI Studio Voice Runner (`tools/ai-studio-voice-runner/`) runs from Chrome's side panel, and browser-automation tools cannot open or click `chrome-extension://` pages. The runner here does the extension's own steps (its `content.js`: one speech block, set the voice, type the style, paste the text, Filler words off, Run, wait for the full take) inside the AI Studio page instead, and `finish.mjs` joins the takes with the extension's own `stitch.js` into the extension's own folder layout. The result is the same as the panel with **One speech block per run** ticked: every line its own take, its time in `story-full.wav` exact, and no run able to skip words. When the user would rather click through the panel themselves, give them the five steps in its README's Story mode and skip to step 5 here.

## 0. Inputs

- A speech-blocks file, `speech-prompts/<slug>-speech-blocks.md`. If the user gives a story (`stories/<slug>-story.md`) with no speech-blocks file yet, write it first with `/ai-studio-tts` (its **Story speech blocks** section) and check it with `node .agents/skills/ai-studio-tts/check_speech_blocks.mjs <blocks> <story>`. The speech-blocks file is used exactly as written: never edit its words to suit a take.
- Takes folder: `~/Downloads/speech-takes/<slug>/` (the extension's), unless the user names another (`--takes`).
- whisper.cpp: `sh SKILL/scripts/setup-whisper.sh --check`. If the model is missing, ask before downloading it (about 1.5 GB from the whisper.cpp repository on Hugging Face), then run the script without `--check`; it checks the SHA-1. If `whisper-cli` is missing, ask the user to run `brew install whisper-cpp`.

## 1. Plan

```bash
node SKILL/scripts/plan.mjs speech-prompts/<slug>-speech-blocks.md
```

It prints the blocks, the voices with their block counts, the words, and the estimated length, and writes `<takes>/runner.js`. Each block goes in with the voice from its head line and the style the extension would give it (its speaker's style from the `## Voices` table, plus the extension's hint from the narration around a quote). `--missing` writes a runner for only the blocks with no take in `parts/` yet; `--only B016,B023` for just those.

Tell the user the request count before starting: one AI Studio request per block. Gemini TTS has a daily quota of about 50 requests per account (2026-11-13), and retakes count, so a story of more than about 45 blocks is recorded over two days: run it, and when the quota stops it, run `plan.mjs --missing` the next day.

## 2. Open AI Studio

1. Use the user's browser-automation tool. In Claude in Chrome: `tabs_context_mcp` with `createIfEmpty`, then `navigate` the new tab to `https://aistudio.google.com/generate-speech`. The user's own AI Studio tab is usually outside the agent's tab group; work in a new tab in the same browser, which shares the sign-in.
2. Screenshot it. If AI Studio asks to sign in, stop and ask the user to sign in in that tab; never type credentials.
3. Click **The Master Storyteller** in **Explore Text to speech** with a **real click** (the browser tool's click, not a script). That click is also the user gesture Chrome's autoplay rule needs: without one, every take stalls at a 0.04 s stub. Screenshot: the Playground shows the sample speech blocks and **Run settings** reads **Gemini 3.8 Flash TTS**.
4. Tell the user the takes play aloud as they stream (AI Studio hands over a take only after it has played through). If they want to listen and hear nothing, the tab is muted in Chrome: they unmute it from the tab strip (speaker icon, or right-click the tab > **Unmute site**); the agent cannot change that.

## 3. Voice every block

1. Read `<takes>/runner.js` and run its whole text in the AI Studio page (Claude in Chrome: `javascript_tool`). It returns `record-story runner ready: N blocks for <slug>`. It only installs `window.__rec`; it changes nothing until started.
2. Start it, in its own call: `window.__rec.start()`. It returns at once and voices the blocks in order inside the page, 3 s apart, retrying a failed block once.
3. Watch it with `await window.__rec.wait(35)` (returns the status after at most 35 s). Keep each call under the browser tool's script limit (Claude in Chrome times out at 45 s: never await a whole take or the whole run in one call). Between calls, give the user a short progress line (`12 of 29 done`). The status shows each take's length, words, and words per second, and `problems` lists any long block read at an odd pace (outside 1.3 to 2.6 words per second): a sign of skipped words.
4. It stops on its own at `done`, at `quota` (AI Studio's quota message: save what is done, step 4, and finish the rest another day with `plan.mjs --missing`), or at `stopped at B0NN` (a block failed twice: screenshot the page, fix what it shows, and call `window.__rec.start()` again; it skips the blocks already taken).
5. A take to redo while the page is still open: `window.__rec.retake(["B016"])`, then `wait` as above.

If the page reloads, the takes in it are lost: save often on a long story (`await window.__rec.save()` after every 15 or so takes is fine; `finish.mjs` merges every bundle).

## 4. Save the takes

`await window.__rec.save()` downloads every take in the page as one file, `~/Downloads/<slug>-takes.bin` (one download, so Chrome never asks to allow multiple downloads; a second save becomes `<slug>-takes (1).bin`, and both are read in order). Then close the tab the agent opened.

## 5. Join and verify

```bash
node SKILL/scripts/finish.mjs speech-prompts/<slug>-speech-blocks.md
```

It unpacks every `<slug>-takes*.bin` in Downloads (oldest first, so a retake replaces the earlier take) into `parts/pNN.wav`, moves the bundles into `<takes>/bundles/`, joins all the takes with 0.7 s between them into `story-full.wav` (the extension's join, byte for byte), writes `story-manifest.json` (every line's start, which `film-audio.mjs` uses to anchor each line exactly), and then runs the check:

```bash
node SKILL/scripts/verify.mjs speech-prompts/<slug>-speech-blocks.md
```

`verify.mjs` transcribes `story-full.wav` with whisper.cpp and `ggml-medium.en` (primed with the story's names), aligns the transcript to the blocks word by word, and writes `<takes>/verify/transcript.txt` and `report.md`:

- **MISSING**: two or more story words not heard, a skipped phrase. Retake that block.
- **ADDED**: three or more heard words not in the story, an invented phrase. Retake that block.
- **spelling**: everything else, nearly always an invented name or sound word spelled another way ("Mili" heard as "Millie", "Phooey" as "Fui"). Not a fault.

Exit 0 means every word is there. For retakes: `plan.mjs --only <ids>` (or `--missing`), steps 2 to 4 with the new runner, then `finish.mjs` again. A whisper check is not a listen: it cannot hear a wrong voice, a mispronounced name, or flat acting.

## 6. Hand off

Link `story-full.wav`, `story-manifest.json`, and `verify/report.md`. State: the length (`m:ss`) and the number of 10-second clips it makes (length ÷ 10, rounded up), the takes per voice, any block flagged for pace, and the verify result (words in the story, words heard, every MISSING or ADDED block, and that the rest are spellings). Ask the user to listen once for the voices and the acting. Say what comes next: `/story-to-storyboard` section 9 makes the film to this audio, starting with `node tools/ai-studio-voice-runner/film-audio.mjs --blocks speech-prompts/<slug>-speech-blocks.md --audio <takes>/story-full.wav`. If the story has a song (a `## Song` section in its story file), it is made in Flow Music and laid into the narration when the timeline is built (`film-audio.mjs --song`, story-to-storyboard section 9 step 2).

## Checklist

- [ ] The speech-blocks file passes `check_speech_blocks.mjs`, and the user knew the request count before the run.
- [ ] The Master Storyteller was opened with a real click, and no credential was typed.
- [ ] No browser call awaited longer than about 35 s.
- [ ] Every block has a take (`finish.mjs` says so), `story-full.wav` and `story-manifest.json` are written, and the agent's tab is closed.
- [ ] `verify.mjs` exits 0, or every MISSING or ADDED block was retaken and the check run again.
- [ ] The hand-off says what was checked by whisper and what still needs the user's ear.
