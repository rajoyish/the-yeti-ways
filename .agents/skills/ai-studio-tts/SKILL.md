---
name: ai-studio-tts
description: >-
  Write a copy-and-paste Google AI Studio speech guide for the narration and
  dialogue of a finished Yeti storyboard, so every spoken line is voiced in
  AI Studio (generate-speech, "The Master Storyteller", Gemini 3.8 Flash TTS)
  instead of by Google Flow, then laid over the clips in the edit. One
  consistent voice per speaker, one speech block per line, exact words, a
  delivery style fitted to each line's time window, and a cue sheet with film
  times and file names. Saves the guide in speech-prompts/. Also splits a
  whole story from stories/ (its `## Story` section) into AI Studio speech
  blocks ("Speaker 1 - Charon:" ... "---"): narration in the Narrator's
  voice, every quoted line in its own block in its speaker's voice, fixed
  Yeti voices; saved as speech-prompts/<story>-speech-blocks.md for the AI
  Studio Voice Runner extension to voice as one audio story. Use
  for "AI Studio voices", "TTS for the storyboard", "redo the narration",
  "Flow messed up the voices", "dub the dialogue", "audio story", "voice
  the story", or /ai-studio-tts.
---

# Storyboard speech to Google AI Studio TTS

Google Flow generates voices together with the picture, and in long films it drifts: a speaker's voice changes between clips, words are skipped or added, the Narrator is given to a character, or lines overlap. This skill moves the voices out of Flow. Every line of a storyboard's `## Script` is voiced in Google AI Studio with **Gemini 3.8 Flash TTS**, starting from **The Master Storyteller** template, and the takes are laid over the Flow clips in the edit at the storyboard's film times.

The deliverable is one Markdown guide in `speech-prompts/`. Writing it never generates audio. Do not edit the storyboard unless the user asks.

## What AI Studio offers (screenshots and the live page, 2026-11-13)

- Page: `https://aistudio.google.com/generate-speech`, headed "Turn text into natural-sounding speech". Under **Explore Text to speech** is a carousel of templates: Create new dialog, The Everyday Assistant, The Guarded NPC, The Energetic Co-Host, **The Master Storyteller** ("Crafts storytelling narration."). This skill always starts from The Master Storyteller.
- The template opens the **Playground** with sample speech blocks (a "Blackwood House" story). Each **speech block** has three controls above a text box:
  1. a **speaker** dropdown (`Speaker 1 - Riko`),
  2. a **style** dropdown holding a short delivery description (`Rich, velvety, u...`, `Hushed, gravell...`, `Tense, propelli...`),
  3. **`<> + Expression`**, which inserts an inline tag into the text, written in angle brackets (`<short pause>`).
  
  **+ Add speech block** adds a block below the last one.
- **Run settings** (right panel): the model card **Gemini 3.8 Flash TTS**, id `gemini-3.8-flash-tts`, "Flagship TTS model for Voice Design and dual-speaker screenplay control. Prompt custom vocal personas, direct line-by-line delivery, and add vocal bursts." Below it, **Model settings** (collapsed) and **Speaker settings**, with one card per speaker (`Riko · Speaker 1 · Confident and clear., Deep pitch`). **Get code** shows the same request as code.

Checked on the live page:

- The **style** dropdown opens a free-text box, **Describe the voice style**, above presets (Whisper, Friendly, …); the guide's style is typed there, word for word.
- **`<> + Expression`** shows a strip of tags: argh, breath, cackle, cheer, chuckle, chuckles, cough, cry, exhales, gasp, giggle, groan, growl, grr, grunt, heavy breath, hiss, laugh, laughter, long pause, moan, pant, pff, phew, scream, short pause, shout, shriek, sigh, sighs, sneeze, snicker, snort, sob, throat-clearing, tsk, whimper, whispering, whispers, yawn. A tag is written in the text in angle brackets (`<giggle>`, `<short pause>`). Use only these.
- The **speaker chip** and the Speaker settings card open a voice picker ("Search 2,000+ voices", filters for Language, Gender, Pitch, Style, Use case). Each voice has a one-word name and a description with a pitch (`Lumi · Warm and approachable. · Low pitch`); the template's default is Riko. A speaker's voice is recorded by that name.
- **Run** sends every block in one request, each block as its own part with its own speaker and its own style (Get code: `speech_metadata(speaker="Speaker 1", style=…)` per block). For a storyboard guide, **each take is still one block on its own** (one cue, one style, one run), so every take drops straight onto its cue time. Each block also has **Preview this block**. The take plays in the footer as it streams, and the full take is ready only when that playback ends; the footer has a **Download** button; it is a 24 kHz, 16-bit mono WAV.
- **Two speakers per session at most** ("dual-speaker screenplay control"): Speaker 1 and Speaker 2, each with one voice (`multi_speaker_voice_config`). Changing a block's voice changes that speaker's voice in every block. **+ Add speech block** gives the new block the other speaker from the last block.
- **Get code** shows the request: `gemini-3.8-flash-tts`, each block's text, speaker, and style, and each speaker's voice as `prebuilt_voice_config.voice_name`.
- The voice picker lists **70 voices** (2026-11-14), each a name, a short description, a pitch, and a gender (Masculine or Feminine). **Only the 30 that Google Flow also has are used** (`references/voices.md`), so every speaker's Flow Character can speak with its recorded voice; the template's Riko and the other 39 newer voices are not.

**Fixed voices.** The Yeti family always uses the same AI Studio voices, in every film and story: **Papa Yeti `Iapetus`**, **Mama Yeti `Erinome`**, **Babu Yeti `Puck`** (upbeat, middle pitch, styled as a small young boy). The **Narrator** defaults to **`Charon`** (male, informative, lower pitch) and keeps one voice for the whole film or story. Other characters' voices are chosen per story, from the 30 Flow voices in `references/voices.md` only.

**Voicing a whole story** (a `stories/*.md` file, not a storyboard): write a speech-blocks file instead of a guide; see **Story speech blocks** at the end of this skill.

**Automating it:** the Chrome extension in `tools/ai-studio-voice-runner/` loads a guide from this skill, sets each speaker's voice, runs every cue as its own one-block take, measures it against the cue's Max, and saves it under the cue's file name in `Downloads/speech-takes/<film>/`. It then stitches the takes into one speech track per video, exactly as long as the clip (10 s), each line's first word on its cue sheet **Clip time** (`tracks/video-NN-speech.wav`), and one for the whole film (`tracks/film-speech.wav`), so keep every Clip time a real `mm:ss.s-mm:ss.s` range. Its README covers install and use. The guide stays the source of truth: the extension reads its `## Voices`, `## Session`, and `## Cue sheet` tables, so keep their columns exactly as step 5 sets out.

Never invent a voice name, a tag, or a setting. If the app has changed from the lists above, follow the app and tell the user this section and the extension's `content.js` need updating.

## 1. Read the storyboard

Take a storyboard path from `prompts/` (any skill's output with speech: `story-to-storyboard` films and any storyboard with a `## Script` table). Read:

- `## Voice cast`: each speaker and its voice description, word for word.
- `## Script`: every row (Video, Clip time, Film time, Speaker, Line), in order, including pick-up rows (`Pick-up <n>`, film time `in the edit`).
- Each video's `Speech:` line, for the manner of each line (`whispering`, `calling up`, `shyly`, `groaning`) and on screen or off-screen; and the shot and expression around it, for the emotion.

If the storyboard has no `## Script` table but has `Speech:` lines, build the cue list from the `Speech:` lines and say so. If it has no speech at all (most 30s and 60s storyboards end `No dialogue, no lyrics.`), stop and tell the user there is nothing to voice.

Check that the `## Script` table and the `Speech:` lines agree, word for word. If they differ, report each difference and ask which is right; never choose silently.

## 2. Build the cue list

One **cue** per Script row, numbered in film order `C01`, `C02`, …. For each cue record:

- **Text:** the line's words exactly, without the surrounding quotation marks. Never correct, shorten, expand, or modernise a word, and keep its punctuation: it drives the delivery. Pronunciation help goes in the style, never in the text.
- **Window:** end minus start of the clip time, in seconds. This is the target length of the take.
- **Max:** the longest acceptable take. An on-screen line: window + 0.3 s (the mouth stops moving at the window's end). An off-screen line: window + 1.0 s, cut back to end 0.2 s before the next cue's film start, but never below the window itself. A pick-up: window + 0.3 s.
- **Rate:** words ÷ window. It sets the pace word in the style (step 4).
- **File:** `<cue>-<video>-<speaker-slug>.wav`, video as `v01`…`v15` or `p1` for a pick-up: `C05-v03-babu-yeti.wav`.

## 3. Voices: one per speaker, chosen once

Every speaker in `## Voice cast` gets one **voice setting**, used for every one of its lines:

- **Voice:** the speaker's voice description from `## Voice cast`, letter for letter. It is the persona the user designs or matches in Speaker settings.
- **Pitch:** from the description: Papa Yeti deep, Mama Yeti medium, Babu Yeti high, Narrator medium-low unless the description says otherwise; story cast from their own description.
- **Chosen voice:** Papa Yeti `Iapetus`, Mama Yeti `Erinome`, Babu Yeti `Puck`, always (the fixed voices above; the extension enforces them). The Narrator starts as `Charon`. Every other speaker is left blank for the user to fill in after picking, or copied from an earlier guide in `speech-prompts/` that records one. Once a speaker's voice is chosen, it is recorded in the guide and never changed for this film.

Never name an actor, singer, or character ("sounds like…") in a voice or a style. Babu Yeti's voice is young and small but never a different character's: keep the same voice for every Babu line.

## 4. Sessions and speech blocks

Use **one AI Studio session per speaker**: a new Master Storyteller session whose only speaker is that speaker, with every one of that speaker's cues as its own speech block, in film order. One speaker per session keeps the voice identical across the whole film, makes each take a single line that drops straight onto the timeline, and avoids voices swapping between speakers. Sessions are ordered Narrator first, then the Yetis (Babu, Papa, Mama, as they appear), then the story cast.

Each speech block has:

- **Speaker:** the session's speaker.
- **Style:** a short delivery description for the style dropdown, at most about 12 words, three parts in this order:
  1. the **manner and emotion** of this line, from its `Speech:` manner and the shot (`hushed and excited, a secret plan`, `huffy and proud, calling down from a branch`); the Narrator's default is `warm, gentle storytelling`;
  2. the **pace** from the rate: above 2.6 words per second `brisk`, 2.0 to 2.6 `natural pace`, below 2.0 `unhurried`, and below 1.4 `slow, with room to breathe`;
  3. for an on-screen line under 2.5 s, `short and punchy`.
  
  Never repeat the voice description in the style: the speaker setting carries the voice, the style carries only this line's delivery.
- **Text:** the cue's text, plus inline expression tags only where the storyboard calls for a sound or a pause the words do not carry: a giggle written in the `Speech:` manner or the shot (`giggling`, `laughing`), a gasp, a sigh, a pause across an ellipsis or a dash. Use only tags the **`<> + Expression`** picker offers, written as it writes them (`<short pause>`); if the picker offers none that fits, leave the text plain and put the sound in the style. A tag never replaces, adds, or removes a word, and no line gets more than two tags.

Never use the Master Storyteller's sample text, and never let one block hold two cues.

## 5. Write the guide

Save to `speech-prompts/<storyboard filename without -storyboard.md>-tts.md` (`prompts/babu-yeti-sour-mango-trick-150s-16x9-storyboard.md` → `speech-prompts/babu-yeti-sour-mango-trick-150s-16x9-tts.md`). Revise an existing guide in place when asked; never overwrite one without saying so.

The guide holds, in order:

1. `# <Film title> - AI Studio Speech`, then one paragraph: the storyboard link, the number of cues and speakers, the film's running time, and why the voices come from AI Studio (Flow's voices drift; these takes replace them in the edit).
2. `## Set up AI Studio`: numbered steps.
   1. Open `https://aistudio.google.com/generate-speech` and sign in.
   2. In **Explore Text to speech**, click **The Master Storyteller** (use the arrows on the right if it is off-screen).
   3. In **Run settings**, check the model card reads **Gemini 3.8 Flash TTS** (`gemini-3.8-flash-tts`); pick it there if not. Leave **Model settings** at their defaults.
   4. Delete the sample speech blocks.
   5. In **Speaker settings**, open the Speaker 1 card, name it for the session's speaker, and set its voice from the `## Voices` table: pick the listed voice whose description is closest, or design it from the voice description if the app offers Voice Design, and set the pitch. Write the chosen voice in the table.
   6. For each row of the session's table, keep **one** speech block on the page (one cue per take, so each take lands on its cue time): open the style dropdown and paste the style into **Describe the voice style**, then paste the text into the block. Tags in the text (`<short pause>`) stay as typed.
   7. Click **Run**, listen, check the take against the cue's Max, then **Download** it and name it as the cue sheet says. Replace the style and text for the next row and run again.
   8. Start a **new** Master Storyteller session for the next speaker; never change a speaker's voice inside a film.
   9. Or let the **AI Studio Voice Runner** extension (`tools/ai-studio-voice-runner/`) do steps 5 to 8 for every cue: load this guide in its side panel, enter each speaker's voice name, and click Generate selected.
3. `## Voices`: `| Speaker | Voice (from the storyboard) | Pitch | Chosen voice in AI Studio | Cues |`, the Chosen column blank or copied from an earlier guide.
4. `## Session N - <Speaker>`, one per speaker, each a table `| Block | Cue | Window | Max | Style | Text |`. Style and Text each sit in single backticks, so tags such as `<short pause>` stay visible and copy cleanly. Window and Max in seconds with one decimal (`3.6 s`).
5. `## Cue sheet`: every cue in film order, `| Cue | Video | Clip time | Film time | Speaker | Text | File |`. Video, Clip time, Film time, and Speaker are copied from the `## Script` row; Text is the line without quotes and without tags. This is the timeline for the edit and for captions.
6. `## Check each take`: listen for the exact words (no word added, dropped, or swapped), the speaker's voice matching its earlier takes, the take's speech no longer than its Max (trim leading and trailing silence first), no tag read aloud as a word, and the manner. A take that fails is regenerated, never stretched or sped up by more than 5 percent in the edit.
7. `## Retake prompts`: ready-to-use style changes. Too long: replace the pace word with `brisk` and add `no pauses`. Too fast or rushed: `unhurried, clear`. Wrong emotion: the line's emotion in two or three plain words. Voice drifted: return to Speaker settings, reselect the recorded voice, and regenerate. Words wrong: paste the text again from the table and regenerate; never fix words by editing audio.
8. `## In the edit`: Flow's clips still carry their own voices, mixed with the music and effects. Either generate the clips with speech so the mouths move at the right times and then remove Flow's voices (an editor's voice-removal or stem-separation feature, if it has one, keeping the music and effects), or lay a separate music bed under clips whose audio is replaced. Place each take at its film time from the cue sheet with its first word at the window's start, then slide it to the mouth if the clip's lip movement starts earlier or later. Keep the music low under every line. For a pick-up, place the take where the pick-up is cut in.

## 6. Verify before finishing

- [ ] `node .agents/skills/ai-studio-tts/check_tts.mjs <guide> <storyboard>` prints `OK`: every Script row is a cue in order with the same video, times, speaker, and words; every cue is in exactly one session block under its own speaker; block text without tags matches the cue word for word; file names follow the pattern; every Window and Max is computed as step 2 sets out; every style has a pace word. Read every `Note:` (a long style, a pace word that does not match the rate) and change the block or judge it right.
- [ ] Every voice in `## Voices` is the `## Voice cast` description letter for letter, and no voice or style names an actor, singer, or character.
- [ ] Every tag in a Text cell is a pause or a vocal sound the storyboard calls for, at most two per line.
- [ ] Every style is a delivery description only, about 12 words at most, with a pace word.

## 7. Hand off

Link the guide and the storyboard, and state: the number of cues and speakers, the sessions in order with their cue counts, any line the user must watch (the tightest windows, by cue), and any disagreement between the Script table and the `Speech:` lines. Say that the guide is prompts only: no audio was generated, the voices are chosen by the user in AI Studio and recorded in the `## Voices` table, and the takes are checked by ear against the cue sheet.

## Story speech blocks

For a story in `stories/` (any file with a `## Story` section, such as the prose `story-to-storyboard` saves), split the story into AI Studio speech blocks so the whole story can be voiced as one audio story. No storyboard, cue sheet, or timing is involved.

### Block format

Every block is a head line, the text, and a `---` line, with one blank line between blocks:

```text
Speaker 1 - Charon:
Once upon a time, in a mountain village, lived a kind Yeti family. Their little stone-and-timber cottage had a sagging slate roof, a woven bamboo door, and a tiny vegetable patch fenced with sticks. Next door lived Tashi Marmot, clever and very rich. Behind his whitewashed wall stood a grand painted house with a golden finial on its roof and a storehouse heaped with sacks of grain. One bright morning, Tashi Marmot stood by his storehouse, polishing a big gold coin on his crimson vest and holding it up to shine in the sun.
On the porch steps of the little cottage, Papa Yeti looked into the family's grain sack. It was nearly empty. Mama Yeti and Babu Yeti sat on the lowest step with their wooden bowls, and there were only a few grains of rice in each. Mama Yeti looked across at the grand house and sighed.
---

Speaker 1 - Erinome:
"Look how rich Tashi is! Our bowls are nearly empty."
---

Speaker 1 - Charon:
Papa Yeti rested a hand on his chest and said softly to himself,
---

Speaker 1 - Iapetus:
"She's right. I'm not so clever."
---
```

- The head is always `Speaker 1 - <Voice>:`, the speaker's AI Studio voice. The `1` is fixed: the extension assigns AI Studio's real Speaker 1 and Speaker 2 slots per run.
- **Narration block:** the Narrator's words between two spoken lines, word for word. Consecutive narration paragraphs stay in one block, each paragraph on its own line (no blank line). Speech tags and actions stay in the narration, even mid-sentence (`said softly to himself,`, `called Babu Yeti.`).
- **Spoken block:** one quoted line, with its quotation marks, in its speaker's voice. A quote that the narration breaks in two is two spoken blocks with the narration block between them. Two quotes by the same speaker with no narration between them share one block, one per line.
- Thoughts and words written without quotation marks (`Blue Magpie thought, I'll trick him!`) are narration.
- The text is the `## Story` text exactly: no word added, dropped, changed, or reordered, punctuation kept, no tags, no stage directions, no speaker names added. The final moral line, if it is inside `## Story`, is narration.
- Never two blocks in a row in the same voice.

### Speakers and voices

1. Read `## Cast` and `## Story`. For each quoted line, decide who says it from the story: the speech tag (`said Mama Yeti`), the sentence before it, or the conversation. When a line is truly unclear, say so in the hand-off instead of guessing silently.
2. Fixed voices: **Papa Yeti `Iapetus`**, **Mama Yeti `Erinome`**, **Babu Yeti `Puck`**, never changed, and the **Narrator `Charon`** by default (another Flow voice only if the user asks, the same one for the whole story).
3. Give every other speaking character its own voice from `references/voices.md`, matched to the `## Cast` description: gender, age, and manner (a kind old yak → `Gacrux`, female, mature; a haughty peacock → `Alnilam`, male, firm, mid-low; a jittery young rival → `Fenrir`, male, excitable, younger). Use only the 30 voices listed there: they are Google Flow's voices, and the film's clips are made in Flow, whose saved Characters speak with these same voices, so a character's lips move the way its recorded voice speaks. Never a fixed voice, and never one voice for two speakers: the extension knows who speaks a block by its voice. A cast member with no spoken line gets no row.
4. Give each speaker one short style (about 12 words at most): manner and age, no actor or character names. The Narrator: `Warm, gentle bedtime storyteller reading to children, clear and unhurried`; Papa Yeti: `Warm, kind, deep fatherly voice, gentle and sincere`; Mama Yeti: `Warm, loving, gentle motherly voice, bright and caring`; Babu Yeti: `Small young boy, bright, high, playful childlike voice`. The extension adds a short hint to a spoken block from the narration around it (`sighed` → `with a sad little sigh`).

### The file

Save to `speech-prompts/<story filename without -story.md>-speech-blocks.md` (`stories/papa-yeti-two-coins-of-wisdom-story.md` → `speech-prompts/papa-yeti-two-coins-of-wisdom-speech-blocks.md`), in this order:

1. `# <Story title> - Speech blocks`, then one paragraph linking the story, the number of blocks, and that the AI Studio Voice Runner voices it.
2. `## Voices`: `| Speaker | Voice | Style | Blocks |`, the Narrator first, then the Yetis, then the story cast in order of first line.
3. `## Speech blocks`: every block in story order, in the format above.

Then run `node .agents/skills/ai-studio-tts/check_speech_blocks.mjs <speech-blocks file> <story file>`; it must print `OK`. It checks the head format, every voice against `references/voices.md` and the fixed voices, one voice per speaker, narration only in the Narrator's voice and quotes never in it, no block mixing narration and a quote, no two blocks in a row in one voice, and every word of `## Story` in order.

### Hand off

Link the file and the story. State the number of blocks per speaker, each story character's voice and why it fits, and any line whose speaker was unclear. Say how to voice it: drop the file on the **AI Studio Voice Runner** side panel (`tools/ai-studio-voice-runner/`), with AI Studio open on The Master Storyteller. For a film, tick **One speech block per run**: every line then gets its exact time and no run can skip words, at about one request per block (54 for a 54-block story; the daily quota ran out near 50 on 2026-11-13, so a long story may take two days). Without it the extension packs at most two voices per run, fewer requests, and the line times are matched from the pauses. Either way it joins the takes into `story-full.wav` and writes `story-manifest.json`. Then `/story-to-storyboard` makes the film to that audio (its section 9), starting with `node tools/ai-studio-voice-runner/film-audio.mjs`. No audio is generated by this skill.
