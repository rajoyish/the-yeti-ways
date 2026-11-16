# Flow Music Score Runner

A Chrome side-panel extension that makes a film's soundtrack in [Google Flow Music](https://www.flowmusic.app/) as **four separate, voice-free stems**, each **exactly as long as the film's voice track** (`story-full.wav`), ready to drop on their own tracks in Adobe Premiere Pro:

| Layer | What Flow Music is asked for | From the guide | Output |
| --- | --- | --- | --- |
| **Music** (score & soundtrack) | Instrumental music only; "no sound effects, no ambience" | each movement's Sound Box Prompt | `<film>-music-score.wav` |
| **Ambience** (atmosphere) | A continuous, seamless place bed; "NO MUSIC… no foley, no spot effects" | cue sheet **Ambience** column | `<film>-ambience.wav` |
| **Foley** | Close, dry, in-sync character sounds with silence between; "NO MUSIC… no ambience" | cue sheet **Foley** column | `<film>-foley.wav` |
| **Sound effects** | Distinct spot effects with silence between; "NO MUSIC… no ambience, no foley" | cue sheet **Sound Effects** column | `<film>-sfx.wav` |
| Music + all effects (one mix) | The older single bed: music with every effect woven in | both | `<film>-music-sfx-bed.wav` |

The guide it reads is written by the **`flow-music-score`** skill (`.agents/skills/flow-music-score/`, for Claude Code, Codex and Antigravity), which also checks the guide against this extension's parser and verifies each finished stem with ffmpeg.

## How it works

- **Movements.** Flow Music's Compose makes at most **3:00** per song (the Length field clamps there), so a long film is made in movements. The runner reads the `### Movement N:` sections of a guide (`music-prompts/<film>-flow-music.md`): each gives a **Film Window**, a **Meter & Tempo** (the BPM is used for music) and a **Sound Box Prompt**. All four stems use the same windows.
- **Cue sheet.** `| **V01** | `00:00 - 00:10` | Title | Ambience | Foley | Sound Effects |`, one row per video. Each effect stem takes its column's rows inside a movement's window and lists them at movement-relative times (`0:40 Sharp metallic ring of a gold coin`); ambience is listed only when it changes. Sounds that read as a voice (sighs, breaths, sniffs, humming, voices) are dropped, and `—` marks an empty cell. A legacy 5-column sheet (`| Ambience | Foley |`) still works: its foley clauses are sorted into foley or sound effects by keyword. Prompts stay within Compose's **3,000 characters**; if one would not, each video keeps only its first sound.
- **Empty windows stay silent.** A movement with no foley (or no sound-effect) cues is not generated for that stem; the build puts silence there.
- **Compose settings.** For every job: **Lyrics → Instrumental** on, **Sound → Advanced** on, **BPM** (music only), **Length** = the window plus the crossfade overlap (`m:ss`, plus 8 s of headroom for effect stems), **Model** (Lyria 3.5 by default), and the title `<Film> — <Layer> M<n> <Movement>`.
- **Short takes are retaken.** If a take is too short to fill its window, the runner asks again once with the shortfall plus 6 s more (up to 3:00), rebuilding the prompt for the new length.
- **Taking the WAV.** Flow Music's own **More → Download → WAV** is used (a direct fetch of its download URL is refused). `hook.js`, running in the page, catches that one download and hands the bytes to the panel instead of saving `<title>.wav` to Downloads. Takes come back as 48 kHz stereo 16-bit WAV.
- **Variant choice.** When Flow Music makes two versions and asks **Which do you prefer?**, the runner picks the first (**Choose**; "No credits used") and answers **Keep Both** to "Delete the other song?". Nothing is ever deleted.
- **Fitting.** Each take is placed at its window's start, trimmed at the next window's start plus half the crossfade, and the takes are joined with equal-power crossfades (3 s default). A take a little short of its window is slowed by up to 6 % to fill it (the panel says so). The last movement fades out over 2.5 s and the file ends on the reference's last sample.
- **Output.** `Downloads/flow-music-score/<film>/<film>-<stem>.wav`: stereo, **48 kHz 24-bit** by default (Premiere's native rate), peak-normalised to −1 dBFS, with exactly `round(reference duration × 48000)` sample frames. A `.json` report beside each lists every segment, its song ID (or `silent`), any stretch, and the gain. With **Save each take too**, every raw take is saved to `takes/`. Each layer keeps its own takes and prompt edits.

## Install

1. Open `chrome://extensions` and turn on **Developer mode**.
2. **Load unpacked** → choose this folder (`tools/flow-music-score-runner`).
3. Pin **Flow Music Score Runner**. After editing the files, click the reload icon on its card and reload the Flow Music tab.

## Use

1. Open `https://www.flowmusic.app`, sign in, and open a **session** (an existing one in the sidebar is most reliable: in a brand-new session the first request can be lost while Flow Music creates it; the runner retries once).
2. Click the extension icon to open the side panel. The pill turns green when it finds the session.
3. Drop the **guide** (`music-prompts/<film>-flow-music.md`) and the **reference voice track** (`story-full.wav`). The panel shows the reference's exact length; the last movement's window absorbs any difference from the guide's timings.
4. Click **Generate & build all 4 stems**. It runs Music → Ambience → Foley → Sound effects, generating each layer's missing movements and building its WAV. Keep the Flow Music tab open; each take takes about 20 s to 2.5 min.
5. Listen (▶ on a row plays its take; the player below plays the last build).
6. To redo something, pick its **Layer**, tick the movement, click **Generate selected**, then **Build this layer's WAV**. **Edit** shows the exact prompt (change and save it, kept per film and layer) and can use an existing Flow Music song link or a WAV from disk instead.

## In Premiere Pro

Place every stem at `00:00:00:00`, one per track, under `story-full.wav`; they all end on the same frame.

| Track | Stem | Essential Sound | Start at |
| --- | --- | --- | --- |
| A1 | `story-full.wav` | Dialogue | 0 dB; Hard Limiter at −1 dB on the track |
| A2 | Music | Music → Ducking against Dialogue → **Generate Keyframes** | about −16 dB; duck −6 to −8 dB, 300–400 ms fades |
| A3 | Ambience | Ambience | about −14 to −18 dB |
| A4 | Foley | SFX | about −8 to −12 dB |
| A5 | Sound effects | SFX | about −6 to −10 dB |

Set the final levels by ear, and use Loudness Normalization on export (−14 LUFS for YouTube, true peak −1 dBTP).

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
node .agents/skills/flow-music-score/scripts/check_score_guide.mjs music-prompts/<film>-flow-music.md --audio "/path/to/story-full.wav" --show f02
```

## Notes from testing (2026-11-16)

- Compose **Length** takes `m:ss` (a bare `140` is not read as seconds) and clamps at `3:00`.
- The Dynamics inputs re-mount when **Advanced** is switched on, so each field is set and read back until it holds.
- In an existing session a new song shows as a "Generating <title> 39%" row; its `/song/<id>` link appears only when the audio is complete.
- Music lengths were met or exceeded by 0.5 to 2 s (2:24 → 144.9 s, 2:44 → 165.0 s, 1:27 → 86.4 s). Effects-only takes varied far more (2:04 → 113.4 s, 1:27 → 126.5 s), hence the headroom and automatic retake.
