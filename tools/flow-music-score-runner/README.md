# Flow Music Score Runner

A Chrome side-panel extension that makes a film's **background music and sound effects together, with no voices**, in [Google Flow Music](https://www.flowmusic.app/), and joins them into **one WAV exactly as long as the film's voice track** (`story-full.wav`), ready to drop on a track in Adobe Premiere Pro.

The music guide it reads is written by the **`flow-music-score`** skill (`.agents/skills/flow-music-score/`, for Claude Code, Codex and Antigravity), which also checks the guide against this extension's parser and verifies the finished WAV with ffmpeg.

## How it works

- **Movements.** Flow Music's Compose makes at most **3:00** per song (the Length field clamps there), so a long film is scored in movements. The runner reads the `### Movement N:` sections of a music guide (`music-prompts/<film>-flow-music.md`, Method B): each gives a **Film Window**, a **Meter & Tempo** (the BPM is used) and a **Sound Box Prompt**.
- **Music and effects in one take.** The guide's **SFX & Foley cue sheet** (`| **V01** | \`00:00 - 00:10\` | … | ambience | foley |`) is folded into each movement's prompt as timed effects (`0:40 Sharp metallic ring of a gold coin`), in the movement's own time, so Flow Music renders the music and the effects mixed. Effects that read as a voice (sighs, breaths, sniffs, humming, voices) are dropped. The prompt stays within Compose's **3,000 characters**; if it would not, the foley is shortened, then left out (ambience only).
- **Compose settings.** For every movement: **Lyrics → Instrumental** on, **Sound → Advanced** on, **BPM** from the guide, **Length** = the window plus the crossfade overlap (`m:ss`), **Model** (Lyria 3.5 by default), and the title `<Film> — M<n> <Movement>`.
- **Taking the WAV.** Flow Music's own **More → Download → WAV** is used (a direct fetch of its download URL is refused). `hook.js`, running in the page, catches that one download and hands the bytes to the panel instead of saving `<title>.wav` to Downloads. Takes come back as 48 kHz stereo 16-bit WAV.
- **Variant choice.** When Flow Music makes two versions and asks **Which do you prefer?**, the runner picks the first (**Choose**; "No credits used"), and answers **Keep Both** to "Delete the other song?". Nothing is ever deleted.
- **Fitting.** Each take is placed at its window's start, trimmed at the next window's start plus half the crossfade, and the takes are joined with equal-power crossfades (3 s default). A take a little short of its window is slowed by up to 6 % to fill it (the panel says so); shorter than that it is flagged for a retake. The last movement fades out over 2.5 s and the file ends on the reference's last sample.
- **Output.** `Downloads/flow-music-score/<film>/<film>-music-sfx-bed.wav`: stereo, **48 kHz 24-bit** by default (Premiere's native rate), peak-normalised to −1 dBFS, with exactly `round(reference duration × 48000)` sample frames. A `.json` report beside it lists every segment, its song ID, any stretch, and the gain. With **Save each take too**, every raw take is saved to `takes/`.

## Install

1. Open `chrome://extensions` and turn on **Developer mode**.
2. **Load unpacked** → choose this folder (`tools/flow-music-score-runner`).
3. Pin **Flow Music Score Runner**. After editing the files, click the reload icon on its card and reload the Flow Music tab.

## Use

1. Open `https://www.flowmusic.app`, sign in, and open a **session** (an existing one in the sidebar is most reliable: in a brand-new session the first request can be lost while Flow Music creates it; the runner retries once).
2. Click the extension icon to open the side panel. The pill turns green when it finds the session.
3. Drop the **music guide** (`music-prompts/<film>-flow-music.md`) and the **reference voice track** (`story-full.wav`). The panel shows the reference's exact length; the last movement's window absorbs any difference from the guide's timings.
4. Check the movements. **Edit** shows the exact Sound prompt for a movement, which you can change and save (kept per film), and lets you use an existing Flow Music song (paste its link) or a WAV from disk instead.
5. Tick the movements and click **Generate selected**. Keep the Flow Music tab open. Each movement takes about 20 s to 2.5 min.
6. Listen (▶). Re-tick any movement you don't like and generate it again; only that take is replaced.
7. Click **Build score WAV**. The log confirms the frame count matches the reference.

## In Premiere Pro

Import `<film>-music-sfx-bed.wav` and place it at `00:00:00:00` on its own audio track under `story-full.wav`. Both end on the same frame. Set the bed's level by ear (the guide suggests −18 to −20 dB under the narration) and duck it under dialogue with Essential Sound → Music → Ducking if needed.

## Files

| File | Role |
| --- | --- |
| `manifest.json` | MV3 manifest: side panel, `flowmusic.app` host access, downloads, storage |
| `hook.js` | Page-world script that catches Flow Music's WAV download |
| `content.js` | Drives Compose, waits for each song, fetches its WAV (debug API: `window.__FMR` in the page) |
| `plan.js` | Parses the guide into Compose jobs (also runs in Node) |
| `score.js` | Crossfade layout, rendering, WAV encode and header reading (layout and WAV code run in Node) |
| `panel.html`, `panel.css`, `panel.js` | Side panel |

Check a guide without a browser:

```bash
node -e 'const P=require("./tools/flow-music-score-runner/plan.js");const p=P.buildPlan(require("fs").readFileSync("music-prompts/<film>-flow-music.md","utf8"),{duration:634.05});for(const j of p.jobs)console.log(j.id,j.length,j.bpm,j.sound.length)'
```

## Notes from testing (2026-11-16)

- Compose **Length** takes `m:ss` (a bare `140` is not read as seconds) and clamps at `3:00`.
- The Dynamics inputs re-mount when **Advanced** is switched on, so each field is set and read back until it holds.
- In an existing session a new song shows as a "Generating <title> 39%" row; its `/song/<id>` link appears only when the audio is complete.
- Asked lengths were met or exceeded by 0.5 to 2 s (2:24 → 144.9 s, 2:44 → 165.0 s, 1:27 → 86.4 s).
