# Babu Yeti and the Sour Mango Trick - AI Studio Speech

Voices for [the 150-second 16:9 storyboard](../prompts/babu-yeti-sour-mango-trick-150s-16x9-storyboard.md): 31 cues (30 in the 15 videos, 1 in Pick-up 2) from 5 speakers, across a 2:30 film. Flow's own voices drift between clips, so every line is voiced here in Google AI Studio with Gemini 3.8 Flash TTS, starting from The Master Storyteller, and the takes replace Flow's voices in the edit.

## Set up AI Studio

1. Open `https://aistudio.google.com/generate-speech` and sign in.
2. In **Explore Text to speech**, click **The Master Storyteller** (use the arrows on the right if it is off-screen).
3. In **Run settings**, check the model card reads **Gemini 3.8 Flash TTS** (`gemini-3.8-flash-tts`); pick it there if not. Leave **Model settings** at their defaults.
4. Delete the sample speech blocks.
5. In **Speaker settings**, open the Speaker 1 card, name it for the session's speaker, and set its voice from the `## Voices` table: pick the listed voice whose description is closest, or design it from the voice description if the app offers Voice Design, and set the pitch. Write the chosen voice in the table.
6. For each row of the session's table, keep **one** speech block on the page (Run merges all blocks under one style): open the style dropdown and paste the style into **Describe the voice style**, then paste the text into the block. This film needs no expression tags.
7. Click **Run**, listen, check the take against the cue's Max, then **Download** it and name it as the cue sheet says. Replace the style and text for the next row and run again.
8. Start a **new** Master Storyteller session for the next speaker; never change a speaker's voice inside a film.
9. Or let the **AI Studio Voice Runner** extension (`tools/ai-studio-voice-runner/`) do steps 5 to 8 for every cue: load this guide in its side panel, enter each speaker's voice name, and click Generate selected. It also stitches the takes into one 10-second speech track per video (`tracks/video-NN-speech.wav`) and one 2:30 track for the film (`tracks/film-speech.wav`).

## Voices

| Speaker | Voice (from the storyboard) | Pitch | Chosen voice in AI Studio | Cues |
| --- | --- | --- | --- | --- |
| Narrator | a warm, unhurried grown-up storyteller voice, gentle and smiling, clear and kind | Medium-low | Jori | 9 |
| Babu Yeti | a small, bright, high little voice, quick and eager, with a giggle in it | High | Leda | 10 |
| Papa Yeti | a deep, warm, rumbling grown-up voice, slow and kind, with a hearty chuckle | Deep | Jett | 3 |
| Mama Yeti | a soft, warm, clear grown-up voice, calm and loving, with a gentle lilt | Medium | Hali | 1 |
| Kobi Squirrel | a quick, chattery, squeaky grown-up voice, proud and huffy | High | Puck | 8 |

## Session 1 - Narrator

| Block | Cue | Window | Max | Style | Text |
| --- | --- | --- | --- | --- | --- |
| 1 | C01 | 5.1 s | 5.1 s | `warm, gentle storytelling, a fairy-tale opening, brisk` | `Once upon a time, in a lush green forest, grew a magnificent mango tree.` |
| 2 | C02 | 3.1 s | 4.1 s | `warm storytelling with a playful frown, natural pace` | `But Kobi Squirrel kept every mango for himself.` |
| 3 | C03 | 3.7 s | 4.5 s | `warm, fond storytelling, brisk` | `Babu Yeti and Papa Yeti were the best of friends.` |
| 4 | C05 | 2.7 s | 2.7 s | `warm storytelling, a hint of mischief, natural pace` | `Then Babu Yeti had a clever idea.` |
| 5 | C17 | 2.2 s | 3.2 s | `warm, amused storytelling, building fun, brisk` | `Mango after mango came tumbling down.` |
| 6 | C20 | 2.0 s | 3.0 s | `warm storytelling, a sly smile, natural pace` | `Kobi never guessed the trick.` |
| 7 | C25 | 2.2 s | 3.2 s | `warm, happy storytelling, brisk` | `Now there were mangoes for everyone.` |
| 8 | C27 | 2.6 s | 2.6 s | `soft, gentle storytelling, a quiet turn, natural pace` | `That afternoon, Kobi crept back, hungry.` |
| 9 | C30 | 2.3 s | 3.3 s | `warm, tender storytelling, the closing moral, natural pace` | `Mangoes taste sweetest when shared.` |

## Session 2 - Babu Yeti

| Block | Cue | Window | Max | Style | Text |
| --- | --- | --- | --- | --- | --- |
| 1 | C06 | 3.6 s | 3.9 s | `hushed and excited whisper, sharing a secret plan, brisk` | `Papa, whatever I say to Kobi, just nod and agree!` |
| 2 | C08 | 3.2 s | 3.5 s | `calling up a tree, cheeky and loud, natural pace` | `Kobi! How can you eat such sour mangoes?` |
| 3 | C10 | 3.2 s | 3.5 s | `bold and cheeky, playful challenge, natural pace` | `Nonsense! Toss one down, I'll taste it!` |
| 4 | C12 | 2.0 s | 2.3 s | `over-the-top disgust, comic, natural pace, short and punchy` | `Phooey! Sour beyond belief!` |
| 5 | C13 | 1.9 s | 2.2 s | `urgent and eager, brisk, short and punchy` | `Papa, taste it! Tell him!` |
| 6 | C16 | 1.5 s | 1.8 s | `comic pucker, firm, natural pace, short and punchy` | `Just as sour!` |
| 7 | C19 | 1.5 s | 1.8 s | `comic, matching Papa, natural pace, short and punchy` | `Way too sour!` |
| 8 | C23 | 2.0 s | 2.3 s | `bursting with joy, natural pace, short and punchy` | `It worked, Papa! It worked!` |
| 9 | C24 | 1.5 s | 1.8 s | `calling out happily to friends, natural pace, short and punchy` | `Come on, everyone!` |
| 10 | C28 | 2.3 s | 2.6 s | `kind and gentle, offering, brisk, short and punchy` | `Here, Kobi. There's plenty for everyone.` |

## Session 3 - Papa Yeti

| Block | Cue | Window | Max | Style | Text |
| --- | --- | --- | --- | --- | --- |
| 1 | C07 | 1.9 s | 2.2 s | `hearty and proud, a promise, brisk, short and punchy` | `You can count on me!` |
| 2 | C14 | 2.8 s | 3.1 s | `comic groaning, sour face, unhurried` | `You're right! It's practically mouth-puckering!` |
| 3 | C18 | 1.5 s | 1.8 s | `comic groan, slow, with room to breathe, short and punchy` | `Too sour!` |

## Session 4 - Mama Yeti

| Block | Cue | Window | Max | Style | Text |
| --- | --- | --- | --- | --- | --- |
| 1 | C26 | 3.0 s | 3.3 s | `gentle and caring, a soft question, brisk` | `And what about Kobi? He'll be hungry too.` |

## Session 5 - Kobi Squirrel

| Block | Cue | Window | Max | Style | Text |
| --- | --- | --- | --- | --- | --- |
| 1 | C04 | 1.7 s | 2.0 s | `grumpy, shooing from a branch, natural pace, short and punchy` | `Shoo! They're all mine!` |
| 2 | C09 | 2.5 s | 2.8 s | `proud and offended, boasting, brisk` | `Sour? These mangoes are sweeter than honey!` |
| 3 | C11 | 1.7 s | 2.0 s | `huffy, daring, natural pace, short and punchy` | `Here! Taste it, then!` |
| 4 | C15 | 1.6 s | 1.9 s | `huffing, annoyed, natural pace, short and punchy` | `Fine! Try this one!` |
| 5 | C21 | 3.1 s | 3.4 s | `shouting in a comic temper, natural pace` | `What a useless tree full of awful fruit!` |
| 6 | C22 | 2.7 s | 3.0 s | `huffy and haughty, storming off, natural pace` | `I'm off to find a sweeter tree!` |
| 7 | C29 | 2.5 s | 2.8 s | `shy and sorry, soft, brisk` | `Thank you. I'm sorry I didn't share.` |
| 8 | C31 | 2.2 s | 2.5 s | `yelling, comic and hungry, brisk, short and punchy` | `Sour! Too sour! I'm so hungry!` |

## Cue sheet

| Cue | Video | Clip time | Film time | Speaker | Text | File |
| --- | --- | --- | --- | --- | --- | --- |
| C01 | 1 | 00:00.5-00:05.6 | 0:00.5-0:05.6 | Narrator | Once upon a time, in a lush green forest, grew a magnificent mango tree. | `C01-v01-narrator.wav` |
| C02 | 1 | 00:05.8-00:08.9 | 0:05.8-0:08.9 | Narrator | But Kobi Squirrel kept every mango for himself. | `C02-v01-narrator.wav` |
| C03 | 2 | 00:00.5-00:04.2 | 0:10.5-0:14.2 | Narrator | Babu Yeti and Papa Yeti were the best of friends. | `C03-v02-narrator.wav` |
| C04 | 2 | 00:05.2-00:06.9 | 0:15.2-0:16.9 | Kobi Squirrel | Shoo! They're all mine! | `C04-v02-kobi-squirrel.wav` |
| C05 | 3 | 00:00.5-00:03.2 | 0:20.5-0:23.2 | Narrator | Then Babu Yeti had a clever idea. | `C05-v03-narrator.wav` |
| C06 | 3 | 00:03.3-00:06.9 | 0:23.3-0:26.9 | Babu Yeti | Papa, whatever I say to Kobi, just nod and agree! | `C06-v03-babu-yeti.wav` |
| C07 | 3 | 00:07.3-00:09.2 | 0:27.3-0:29.2 | Papa Yeti | You can count on me! | `C07-v03-papa-yeti.wav` |
| C08 | 4 | 00:05.2-00:08.4 | 0:35.2-0:38.4 | Babu Yeti | Kobi! How can you eat such sour mangoes? | `C08-v04-babu-yeti.wav` |
| C09 | 5 | 00:00.5-00:03 | 0:40.5-0:43.0 | Kobi Squirrel | Sour? These mangoes are sweeter than honey! | `C09-v05-kobi-squirrel.wav` |
| C10 | 5 | 00:05.2-00:08.4 | 0:45.2-0:48.4 | Babu Yeti | Nonsense! Toss one down, I'll taste it! | `C10-v05-babu-yeti.wav` |
| C11 | 6 | 00:01.2-00:02.9 | 0:51.2-0:52.9 | Kobi Squirrel | Here! Taste it, then! | `C11-v06-kobi-squirrel.wav` |
| C12 | 6 | 00:07.4-00:09.4 | 0:57.4-0:59.4 | Babu Yeti | Phooey! Sour beyond belief! | `C12-v06-babu-yeti.wav` |
| C13 | 7 | 00:01-00:02.9 | 1:01.0-1:02.9 | Babu Yeti | Papa, taste it! Tell him! | `C13-v07-babu-yeti.wav` |
| C14 | 7 | 00:05.5-00:08.3 | 1:05.5-1:08.3 | Papa Yeti | You're right! It's practically mouth-puckering! | `C14-v07-papa-yeti.wav` |
| C15 | 8 | 00:01.3-00:02.9 | 1:11.3-1:12.9 | Kobi Squirrel | Fine! Try this one! | `C15-v08-kobi-squirrel.wav` |
| C16 | 8 | 00:05.3-00:06.8 | 1:15.3-1:16.8 | Babu Yeti | Just as sour! | `C16-v08-babu-yeti.wav` |
| C17 | 8 | 00:07.2-00:09.4 | 1:17.2-1:19.4 | Narrator | Mango after mango came tumbling down. | `C17-v08-narrator.wav` |
| C18 | 9 | 00:03.3-00:04.8 | 1:23.3-1:24.8 | Papa Yeti | Too sour! | `C18-v09-papa-yeti.wav` |
| C19 | 9 | 00:05.3-00:06.8 | 1:25.3-1:26.8 | Babu Yeti | Way too sour! | `C19-v09-babu-yeti.wav` |
| C20 | 9 | 00:07.3-00:09.3 | 1:27.3-1:29.3 | Narrator | Kobi never guessed the trick. | `C20-v09-narrator.wav` |
| C21 | 10 | 00:03.3-00:06.4 | 1:33.3-1:36.4 | Kobi Squirrel | What a useless tree full of awful fruit! | `C21-v10-kobi-squirrel.wav` |
| C22 | 11 | 00:05.2-00:07.9 | 1:45.2-1:47.9 | Kobi Squirrel | I'm off to find a sweeter tree! | `C22-v11-kobi-squirrel.wav` |
| C23 | 12 | 00:00.9-00:02.9 | 1:50.9-1:52.9 | Babu Yeti | It worked, Papa! It worked! | `C23-v12-babu-yeti.wav` |
| C24 | 12 | 00:05.3-00:06.8 | 1:55.3-1:56.8 | Babu Yeti | Come on, everyone! | `C24-v12-babu-yeti.wav` |
| C25 | 12 | 00:07.3-00:09.5 | 1:57.3-1:59.5 | Narrator | Now there were mangoes for everyone. | `C25-v12-narrator.wav` |
| C26 | 13 | 00:05.4-00:08.4 | 2:05.4-2:08.4 | Mama Yeti | And what about Kobi? He'll be hungry too. | `C26-v13-mama-yeti.wav` |
| C27 | 14 | 00:03.2-00:05.8 | 2:13.2-2:15.8 | Narrator | That afternoon, Kobi crept back, hungry. | `C27-v14-narrator.wav` |
| C28 | 14 | 00:06-00:08.3 | 2:16.0-2:18.3 | Babu Yeti | Here, Kobi. There's plenty for everyone. | `C28-v14-babu-yeti.wav` |
| C29 | 15 | 00:00.5-00:03 | 2:20.5-2:23.0 | Kobi Squirrel | Thank you. I'm sorry I didn't share. | `C29-v15-kobi-squirrel.wav` |
| C30 | 15 | 00:07.2-00:09.5 | 2:27.2-2:29.5 | Narrator | Mangoes taste sweetest when shared. | `C30-v15-narrator.wav` |
| C31 | Pick-up 2 | 00:07.3-00:09.5 | in the edit | Kobi Squirrel | Sour! Too sour! I'm so hungry! | `C31-p2-kobi-squirrel.wav` |

## Check each take

- The exact words: none added, dropped, or swapped.
- The speaker's voice matches its earlier takes.
- After trimming the leading and trailing silence, the take is no longer than its Max.
- No tag is read aloud as a word.
- The manner matches the style.

A take that fails is regenerated, never stretched or sped up by more than 5 percent in the edit. Watch the tightest cues: C05 and C27 (no room past the window), C09 and C29 (2.8 words per second), and the short punchy lines C16, C18, C19, C24 (1.5 s).

## Retake prompts

- **Too long:** replace the pace word in the style with `brisk` and add `no pauses`.
- **Too fast or rushed:** replace the pace word with `unhurried, clear`.
- **Wrong emotion:** put the line's emotion first in two or three plain words (`sorry and shy`).
- **Voice drifted:** go back to Speaker settings, reselect the voice recorded in `## Voices`, and regenerate.
- **Words wrong:** paste the text again from the session table and regenerate; never fix words by editing the audio.

## In the edit

Flow's clips still carry their own voices, mixed with the music and effects. Either keep the clips generated with speech, so the mouths move at the right times, and remove Flow's voices (an editor's voice-removal or stem-separation feature, if it has one, keeping the music and effects), or lay a separate music bed under clips whose audio is replaced. Place each take at its film time from the cue sheet with its first word at the window's start, then slide it to the mouth if the clip's lip movement starts earlier or later. Keep the music low under every line. Place C31 where Pick-up 2 is cut in, with its first word 7.3 s into the pick-up.
