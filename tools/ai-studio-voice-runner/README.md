# AI Studio Voice Runner

A Chrome side-panel extension that drives Google AI Studio's **Gemini 3.8 Flash TTS** in two modes:

- **Story mode:** drop a speech-blocks file (`speech-prompts/*-speech-blocks.md`, written by `/ai-studio-tts`) or a story (`stories/*.md`) and it voices the whole story by filling AI Studio's speech blocks and running them a few parts at a time. The parts are joined into `Downloads/speech-takes/<story>/story-full.wav`.

Speech blocks look like this; `---` ends a block, narration is in the Narrator's voice, and every quoted line is its own block in its speaker's voice:

```text
Speaker 1 - Charon:
... Mama Yeti looked across at the grand house and sighed.
---

Speaker 1 - Erinome:
"Look how rich Tashi is! Our bowls are nearly empty."
---
```

A speech-blocks file is used exactly as written; its `## Voices` table (`| Speaker | Voice | Style |`) says who each voice is, so every speaker needs its own voice. A story file is split into the same blocks by the extension, which guesses who says each quote; check them in **Speech blocks** and use **Save speech blocks** to keep the result as a file you can edit and load again.
- **Speech-guide mode:** drop a speech guide (`speech-prompts/*-tts.md`, written by `/ai-studio-tts`) and it voices every cue as its own take (`Downloads/speech-takes/<film>/<cue file>.wav`), then stitches the takes into one 10-second speech track per video (`tracks/video-NN-speech.wav`) and one for the whole film.

## Voices

- **Fixed Yeti voices:** Papa Yeti **Iapetus**, Mama Yeti **Erinome**, Babu Yeti **Puck** (upbeat, middle pitch; his style asks for a small young boy's high, playful voice). They are set in `story.js` (`FIXED_VOICES`) and cannot be changed in the panel, so the family sounds the same in every story and film.
- **Only Google Flow's 30 voices** are offered (Achernar to Zubenelgenubi, built into `story.js` as `FLOW_VOICES` with Flow's own descriptions), because the film's clips are made in Flow and each character's Flow Character should speak with the voice of its recorded lines. **Show all AI Studio voices** adds AI Studio's other 40 (after **Read AI Studio's list**), each marked "not in Google Flow". A saved voice Flow does not have is reset when the panel opens.
- **Narrator:** **Charon** (male, informative, lower pitch) by default, one voice for every Narrator block in the story.
- **Everyone else:** starts on Charon; pick any voice for them. The panel warns when a character shares the Narrator's voice.
- Each speaker's voice box searches the Flow voices as you type, and **Browse and search the voices** filters them by any word (`female mid`, `warm`, `younger`). Click a speaker's box, then a voice in the list, to assign it. **Read AI Studio's list** reads AI Studio's full voice picker (70 on 2026-11-14), used only with **Show all AI Studio voices**.
- Every choice is saved in the extension's storage until you change it, and applies to every story and guide.

## Story mode

1. Open `https://aistudio.google.com/generate-speech`, click **The Master Storyteller** (or **Create new dialog**), and **click once anywhere in the page** (see Limits).
2. Open the side panel and drop the speech-blocks or story `.md` on **Drop a story here, or click to browse** (or click it to browse).
3. **Speakers:** check each voice and the delivery style typed into its blocks (the Narrator's default is `Warm, gentle bedtime storyteller reading to children, clear and unhurried`). A line also gets a short hint from the words around it (`sighed` → `with a sad little sigh`).
4. **Speech blocks:** every block as it goes into AI Studio (`Speaker 1 - <voice>`, speaker, text). For a story file the speakers of quotes are worked out from the text around them (`"…" said Mama Yeti`, or the sentence before it). Change any wrong speaker; the change is saved for that story.
5. **Parts:** AI Studio's TTS takes **at most two voices per run**, so the story is split into parts of consecutive lines with no more than two voices (Speaker 1 and Speaker 2) and about **Max characters per part** of text (1,500 ≈ 1.5 to 2 minutes). Each part is one Run. Click **Generate selected parts**.
6. For each part the extension builds the speech blocks in order (adding and deleting blocks until each has the right speaker), sets the two voices, types every block's style and text, clicks **Run**, and waits for the full take. AI Studio plays the take aloud as it streams and only hands over the whole WAV when that playback ends, so a part takes about as long as its audio. It is saved as `parts/p01.wav`, … and kept in the extension's storage.
7. When every part is done, the parts are joined into `story-full.wav` (silence at each part's ends trimmed, **Pause between parts** between them). **Join into story-full.wav** joins again at any time; **Save speech blocks** writes `<story>-speech-blocks.md` in the take folder.

Changing a voice, style, speaker, or the part size changes only the parts it touches; parts already made are kept and reused.

## Install

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and choose this folder (`tools/ai-studio-voice-runner`).
3. Pin **AI Studio Voice Runner** to the toolbar.

After editing the files, click the reload icon on the extension's card and reload the AI Studio tab.

## From the story audio to the film

For a film made to the recording (`/story-to-storyboard`, section 9), three Node tools in this folder work on the takes folder (`Downloads/speech-takes/<story>/`). They need no packages; `assemble.mjs` needs ffmpeg and ffprobe.

- **Voice for a film** with **One speech block per run** ticked: every line becomes its own take, so its time in `story-full.wav` is exact (from `story-manifest.json`, written when the parts are joined) and no run can skip words. It costs one request per block.
- **`film-audio.mjs`** builds the film's clock: `node tools/ai-studio-voice-runner/film-audio.mjs --blocks speech-prompts/<story>-speech-blocks.md --audio <takes>/story-full.wav`. It keeps the recording exactly as it is, finds every block and sentence in it (exact for blocks anchored by the manifest, otherwise matched to the pauses of the audio; on 2026-11-14 every part boundary landed within 0.05 s), and writes `speech-prompts/<story>-film-timeline.md` and `.json` (the number of 10-second clips, a copy-ready `Speech:` line and cut points per clip, the Script table), `clips/clip-NN.wav`, and `lines/<block>-<speaker>.wav` for checking each spoken line by ear. A wrong line goes into `speech-prompts/<story>-timing-fixes.json` (`{ "B029": 370.69 }`). `--fit-lines` instead builds `story-film.wav`, lengthening the pause before any line that would cross a 10-second cut.
- **`assemble.mjs`** previews each Flow take with its recording (`--preview 7`, written to `<clips>/previews/`) and joins the approved clips into the film with the recording under them, cut to the recording's length (`--out film.mp4`, optional `--bed music.wav` and `--tail 2`).

`timeline.js` holds the matching and the clip plan, shared by these tools.

## Speech-guide mode

1. Open `https://aistudio.google.com/generate-speech`, click **The Master Storyteller**, and check that Run settings shows **Gemini 3.8 Flash TTS**. The panel's pill turns green when it finds this.
2. Click the extension icon to open the side panel, then drop the guide `.md` on the drop zone (or click it to browse).
3. Under **Voices**, search and pick the AI Studio voice for each speaker. The Yetis' voices are fixed (above). The names are remembered across films. Write them in the guide's `## Voices` table too.
4. Tick the cues to make (by default, every cue not yet made), then click **Generate selected**. Keep the AI Studio tab open; it may be in the background.
5. Each take is saved, measured, and marked:
   - green: the speech (first to last loud sound) fits the cue's Max;
   - amber: too long. With **Retake once if too long** on, the runner retries once with the pace word changed to `brisk, no pauses` and keeps the shorter take.
6. Listen to every take (**Play**) for the exact words and the right voice. **Retake** on a row makes a new take; **Too long** selects every over-long take. **Save report** writes `takes-report.md` next to the takes.
7. **Video tracks.** Each take is only as long as its line (1 to 5 s), but every Flow video is 10 s. The runner stitches them into one speech track per video, saved as `Downloads/speech-takes/<film>/tracks/video-NN-speech.wav` (`pick-up-N-speech.wav` for a pick-up):
   - exactly **Video length** long (10 s by default, matching Flow's 10.000 s clips), 48 kHz stereo 16-bit like the clip's own audio, so it drops straight under the video at 0:00;
   - each line's first word lands on its cue's **Clip time** start from the cue sheet; the silence before and after each take is trimmed, with a short fade;
   - with **Rebuild a video's track after its takes** on, a video's track is remade after any of its cues is taken or retaken. **Build video tracks** remakes them all.
   - **Build film track** puts the whole film on one WAV (`tracks/film-speech.wav`, videos × 10 s, 2:30 for a 15-video film), with video N's lines at (N − 1) × 10 s + clip time. Pick-ups are cut in by hand, so they are left out of it.
   - The log warns when a line runs past the end of its video (it is cut there with a fade: retake it shorter), runs past its window, or overlaps the next line.
   - **Load saved takes (.wav) from disk** takes WAVs made earlier (select every file in the film's take folder). They are matched to cues by file name, so the tracks can be built without new AI Studio requests.

## Gemini 3.8 Flash TTS notes (from the model docs)

- One request can return far more than 10 s of audio (8,192 input tokens, 16,384 output tokens; Google describes "multi-minute narrations without voice drift"). Story mode uses this (many blocks per run). Speech-guide mode still makes one take per line: a single long run cannot place each line on its cue time, keep a different voice per speaker, or take a different style per line, and one bad word would mean redoing the whole video. The takes are stitched instead.
- The text is a verbatim transcript. Delivery goes in the style box; point-in-time sounds go inline in angle brackets (`<laugh>`, `<sigh>`, `<breath>`, `<short pause>`). Square-bracket tags, `(stage directions)`, and `Name:` labels can be spoken aloud, so the panel flags them under the line.
- The model returns a RIFF WAV. The runner reads the sample rate from its header (24 kHz 16-bit mono on 2026-11-13) and resamples it to 48 kHz for the tracks.

## How it drives AI Studio

What the page does (checked on 2026-11-14):

- **Run** sends every speech block in one request, each block as its own part with its own speaker (`Speaker 1` / `Speaker 2`) and its own style (Get code shows `speech_metadata(speaker=…, style=…)` per block).
- A session holds **two speakers at most** (`multi_speaker_voice_config` with Speaker 1 and Speaker 2; the model card says "dual-speaker"). Changing a block's voice changes that speaker's voice in every block.
- **Add speech block** adds a block with the other speaker from the last block; deleting a block leaves the other blocks' speakers as they were. The extension uses these two rules to build any Speaker 1 / Speaker 2 order.
- The voice picker lists 70 voices; searching `pitch` shows them all (every description ends in "… pitch"), and the Gender filter (Masculine, Feminine, Neutral) tags them.
- The take plays as it streams; the footer's `<audio>` holds a 0.04 s stub until the playback ends, then the full WAV (24 kHz, 16-bit mono).

For each story part, the content script arranges the blocks, sets the Speaker 1 and Speaker 2 voices, types each block's style and text, checks the page once more, clicks Run, and waits for the full take.

For each guide cue, the content script:

1. leaves exactly one speech block on the page (one cue, one take, so each take drops straight onto its cue time);
2. sets the voice through the speaker chip's voice search;
3. types the guide's style into the block's **Describe the voice style** box;
4. pastes the text, expression tags such as `<short pause>` included;
5. clicks **Run**, and waits until Run is idle and the footer audio has been a full `data:audio/wav` URL, unchanged, for 1.5 s. AI Studio streams a 0.04 s stub first and the whole take after it.

The panel measures the WAV (24 kHz, 16-bit mono) and downloads it with the cue's file name, overwriting an earlier take of the same cue. It also keeps the take in the extension's storage, so the video tracks can be rebuilt after the panel is closed. `stitch.js` does the stitching in plain JavaScript (no Web Audio), so it can be tested in Node too.

The selectors were read from the live page on 2026-11-14 (`ms-speech-block`, `.voice-chip-label` "Speaker N - Voice", `button[aria-label="Delete speech block"]`, `ms-voice-library button.voice-card-content`, `ms-audio-footer .play-pause-button`, `textarea[aria-label="Speech block text"]`, `button[aria-label="Style"]`, `textarea[aria-label="Describe the voice style"]`, `.voice-chip`, `input[aria-label="Search voices"]`, `ms-run-button`, `ms-audio-footer audio`). If AI Studio changes its page, the panel logs which step failed and stops; update `content.js`.

## Limits

- **Click once anywhere in the AI Studio tab before generating.** Without a real click on the page, Chrome's autoplay rule leaves the take stuck at a 0.04 s stub, and the runner reports "Run finished without a new take". Keep the tab's sound on: the take only arrives after AI Studio has played it through.
- **Two voices per run.** A story with many speakers needs more runs; giving minor characters the Narrator's voice (the default) or a shared voice means fewer, longer parts.
- **Skipped words in long runs.** A run of several blocks sometimes drops a sentence or more without any error (2026-11-14: 3 of 20 parts, one of them on every retake). The extension checks each part's pace: a storyteller reads every word at 1.7 to 2.25 words per second, and a part faster than 2.35 (or slower than 1.5) is retaken once, then, if still off, voiced in two halves that are joined. A part still marked ⚠ needs listening.
- **Filler words** (Run settings) is switched off before every run, so the model never adds "mm-hmm"-style words.
- **Who says a line** is worked out from the text and can be wrong when a quote has no name near it; check the Lines list before generating.
- **Daily quota:** Gemini 3.8 Flash TTS has a daily request limit per account. Retakes count too, and on 2026-11-13 it ran out after about 50 requests. The runner stops with AI Studio's "quota exceeded" message; try again the next day.

- It uses your AI Studio account and its limits, one line at a time, with a pause between takes (3 s by default). If AI Studio shows a quota or error message, the cue is marked failed with that message.
- It changes the speech blocks in the open AI Studio session: the template's sample blocks are deleted.
- It cannot judge the words or the acting. Listen to every take before it goes into the edit.
