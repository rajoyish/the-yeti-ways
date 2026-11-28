# Babu Yeti and the Garden of Voices - Film timeline

The audio clock for the film, built from the AI Studio audio by `tools/ai-studio-voice-runner/film-audio.mjs`. The master audio `story-with-song.wav` (in `/Users/rajoyish/Downloads/speech-takes/babu-yeti-garden-of-voices`) is 7:44.5 long, so the film is 47 clips of 10 seconds, the last trimmed to 4.5 s in the edit. Every word below is at its exact time in that audio; `clips/clip-NN.wav` is each clip's slice. `/story-to-storyboard` writes one Agent prompt per clip from this plan.

## Notes

- timing fixes applied: B002 at 1:04.3, B003 at 1:09.1, B004 at 1:30.5, B005 at 1:41.5, B006 at 1:48.9, B007 at 1:53.6, B008 at 1:58.9, B009 at 2:07.2, B010 at 2:36.2, B011 at 2:38.0, B012 at 2:40.1, B013 at 2:46.7, B014 at 3:21.0, B015 at 3:27.8, B016 at 3:30.0, B017 at 3:39.1, B018 at 3:43.6, B019 at 3:49.6, B020 at 3:58.5, B021 at 4:12.0, B022 at 4:16.4, B023 at 4:18.2, B024 at 4:21.2, B025 at 4:32.5, B026 at 4:51.1, B027 at 4:56.9, B028 at 5:03.0, B029 at 5:05.8
- B004 (Gombu Tortoise, 1:30.5-1:40.4) crosses the cut at 1:40.0: the speaker is on screen where most of the line falls, the rest plays over a reaction shot
- B006 (Babu Yeti, 1:48.9-1:52.5) crosses the cut at 1:50.0: the speaker is on screen where most of the line falls, the rest plays over a reaction shot
- B008 (Mili Red Panda, 1:58.9-2:06.2) crosses the cut at 2:00.0: the speaker is on screen where most of the line falls, the rest plays over a reaction shot
- B017 (Babu Yeti, 3:39.1-3:42.6) crosses the cut at 3:40.0: the speaker is on screen where most of the line falls, the rest plays over a reaction shot
- B019 (Mama Yeti, 3:49.6-3:57.5) crosses the cut at 3:50.0: the speaker is on screen where most of the line falls, the rest plays over a reaction shot
- B024 (Mama Yeti, 4:21.2-4:31.6) crosses the cut at 4:30.0: the speaker is on screen where most of the line falls, the rest plays over a reaction shot
- song many-voices-one-song.wav (112.1 s) laid in at 5:39.9 of the recording, after " that day on, Babu Yeti gave up his pride forever.", with 1 s of silence on each side; everything after it moves 114.1 s later

## Line check

Lip sync depends on these times. Listen to each file (in the audio folder): it must hold exactly this line, first word to last, in this speaker's voice. If one is wrong, write the line's true start in seconds of the master into `speech-prompts/<slug>-timing-fixes.json` (`{ "B029": 370.69 }`), run `film-audio.mjs` again, and listen again.

| Block | Speaker | Film time | Clip | Line | File |
| --- | --- | --- | --- | --- | --- |
| B002 | Babu Yeti | 1:04.3-1:08.0 | 7 | "If it weren't for me, nobody here could sing a sweet song!" | `lines/B002-babu-yeti.wav` |
| B004 | Gombu Tortoise | 1:30.5-1:40.4 | 10 and 11 | "Babu, it's better when others praise your voice for you. Many friends in this forest sing sweetly, too." | `lines/B004-gombu-tortoise.wav` |
| B006 | Babu Yeti | 1:48.9-1:52.5 | 11 and 12 | "Phooey! You can only hum! Why are you showing off?" | `lines/B006-babu-yeti.wav` |
| B008 | Mili Red Panda | 1:58.9-2:06.2 | 12 and 13 | "Babu, don't be so full of yourself. Everything Gombu said is completely right." | `lines/B008-mili-red-panda.wav` |
| B010 | Nimbu Tree Frog | 2:36.2-2:37.0 | 16 | "Hey, everyone!" | `lines/B010-nimbu-tree-frog.wav` |
| B012 | Nimbu Tree Frog | 2:40.1-2:45.7 | 17 | "Why are you fighting over nothing? Let's go to the Rhino Chief. He settles every quarrel!" | `lines/B012-nimbu-tree-frog.wav` |
| B014 | Mama Yeti | 3:21.2-3:26.8 | 21 | "Friends who sing sweetly never need to boast. Is anyone here proud like that?" | `lines/B014-mama-yeti.wav` |
| B015 | Forest friends | 3:27.8-3:29.1 | 21 | "No!" | `lines/B015-forest-friends.wav` |
| B017 | Babu Yeti | 3:39.1-3:42.6 | 22 and 23 | "Well... my voice is sweeter than everyone's." | `lines/B017-babu-yeti.wav` |
| B019 | Mama Yeti | 3:49.6-3:57.5 | 23 and 24 | "Babu, which garden do you like best? One with only one kind of flower, or one with many different kinds?" | `lines/B019-mama-yeti.wav` |
| B021 | Babu Yeti | 4:11.9-4:15.3 | 26 | "I like a garden with many different kinds of flowers." | `lines/B021-babu-yeti.wav` |
| B022 | Mama Yeti | 4:16.4-4:17.1 | 26 | "Well said," | `lines/B022-mama-yeti.wav` |
| B024 | Mama Yeti | 4:21.2-4:31.6 | 27 and 28 | "In the same way, one voice alone doesn't stay sweet forever. Many different voices together sound sweet. That is why every voice here is lovely." | `lines/B024-mama-yeti.wav` |
| B026 | Babu Yeti | 4:51.1-4:55.9 | 30 | "I'm sorry, Gombu. I'm sorry, Mili. Will you sing with me?" | `lines/B026-babu-yeti.wav` |
| B028 | Gombu Tortoise | 5:03.0-5:04.7 | 31 | "Of course, Babu." | `lines/B028-gombu-tortoise.wav` |

## Script

Copy into the storyboard's `## Script` section as it is.

| Video | Clip time | Film time | Speaker | Line |
| --- | --- | --- | --- | --- |
| 1 | 00:00-00:10 | 0:00.0-0:10.0 | Narrator | "Once upon a time, high in a Himalayan forest of red rhododendron trees, there was a sunny glade full of" |
| 2 | 00:00-00:00.7 | 0:10.0-0:10.7 | Narrator | "wildflowers." |
| 2 | 00:01.6-00:10 | 0:11.6-0:20.0 | Narrator | "In the middle of the glade sat a big flat stone, and every evening the forest friends gathered around it to" |
| 3 | 00:00-00:01.4 | 0:20.0-0:21.4 | Narrator | "share their songs." |
| 3 | 00:02.4-00:05.6 | 0:22.4-0:25.6 | Narrator | "Gombu Tortoise hummed low and deep." |
| 3 | 00:06.2-00:09.1 | 0:26.2-0:29.1 | Narrator | "Mili Red Panda whistled softly." |
| 3 | 00:09.7-00:10 | 0:29.7-0:30.0 | Narrator | "The" |
| 4 | 00:00-00:08 | 0:30.0-0:38.0 | Narrator | "Meadow Mice drummed their tiny feet, and Nimbu Tree Frog chirruped from the branches of an old tree." |
| 4 | 00:08.9-00:10 | 0:38.9-0:40.0 | Narrator | "Babu Yeti loved" |
| 5 | 00:00-00:02.6 | 0:40.0-0:42.6 | Narrator | "to sing more than anything." |
| 5 | 00:03.2-00:07.4 | 0:43.2-0:47.4 | Narrator | "He could trill high and sweet, like a little bamboo flute." |
| 5 | 00:08.1-00:10 | 0:48.1-0:50.0 | Narrator | "But the more he sang," |
| 6 | 00:00-00:03 | 0:50.0-0:53.0 | Narrator | "the prouder he grew of his own voice." |
| 6 | 00:03.8-00:10 | 0:53.8-1:00.0 | Narrator | "One golden evening, Babu Yeti climbed up onto the big flat stone," |
| 7 | 00:00-00:03.4 | 1:00.0-1:03.4 | Narrator | "puffed out his fluffy chest, and boasted," |
| 7 | 00:04.3-00:08 | 1:04.3-1:08.0 | Babu Yeti | "If it weren't for me, nobody here could sing a sweet song!" |
| 7 | 00:09.1-00:10 | 1:09.1-1:10.0 | Narrator | "The forest" |
| 8 | 00:00-00:01.5 | 1:10.0-1:11.5 | Narrator | "friends were stunned." |
| 8 | 00:02.3-00:05.2 | 1:12.3-1:15.2 | Narrator | "The Meadow Mice's ears shot straight up." |
| 8 | 00:06.2-00:08.7 | 1:16.2-1:18.7 | Narrator | "Gombu Tortoise blinked slowly." |
| 8 | 00:09.7-00:10 | 1:19.7-1:20.0 | Narrator | "They" |
| 9 | 00:00-00:03.5 | 1:20.0-1:23.5 | Narrator | "all turned and looked at one another in surprise." |
| 9 | 00:04.7-00:09.4 | 1:24.7-1:29.4 | Narrator | "Then Gombu Tortoise spoke up, slow and kind." |
| 10 | 00:00.5-00:10 | 1:30.5-1:40.0 | Gombu Tortoise | "Babu, it's better when others praise your voice for you. Many friends in this forest sing sweetly," |
| 11 | 00:00-00:00.4 | 1:40.0-1:40.4 | Gombu Tortoise | "too." |
| 11 | 00:01.5-00:07.8 | 1:41.5-1:47.8 | Narrator | "Babu Yeti's cheeks puffed up, and he stamped his foot on the stone." |
| 11 | 00:08.9-00:10 | 1:48.9-1:50.0 | Babu Yeti | "Phooey! You can" |
| 12 | 00:00-00:02.5 | 1:50.0-1:52.5 | Babu Yeti | "only hum! Why are you showing off?" |
| 12 | 00:03.6-00:07.8 | 1:53.6-1:57.8 | Narrator | "Mili Red Panda twitched her striped tail." |
| 12 | 00:08.9-00:10 | 1:58.9-2:00.0 | Mili Red Panda | "Babu, don't" |
| 13 | 00:00-00:06.2 | 2:00.0-2:06.2 | Mili Red Panda | "be so full of yourself. Everything Gombu said is completely right." |
| 13 | 00:07.2-00:10 | 2:07.2-2:10.0 | Narrator | "Because of Babu Yeti's sharp" |
| 14 | 00:00-00:03.2 | 2:10.0-2:13.2 | Narrator | "words, everyone began talking at once." |
| 14 | 00:04.1-00:10 | 2:14.1-2:20.0 | Narrator | "The Meadow Mice squeaked, Mili Red Panda huffed, Gombu Tortoise" |
| 15 | 00:00-00:06.6 | 2:20.0-2:26.6 | Narrator | "grumbled, and a noisy quarrel filled the glade for a long, long while." |
| 15 | 00:07.8-00:10 | 2:27.8-2:30.0 | Narrator | "Up on a branch of the old" |
| 16 | 00:00-00:05.1 | 2:30.0-2:35.1 | Narrator | "tree, Nimbu Tree Frog had been listening to the whole quarrel." |
| 16 | 00:06.2-00:07 | 2:36.2-2:37.0 | Nimbu Tree Frog | "Hey, everyone!" |
| 16 | 00:08-00:09 | 2:38.0-2:39.0 | Narrator | "he called down." |
| 17 | 00:00.1-00:05.7 | 2:40.1-2:45.7 | Nimbu Tree Frog | "Why are you fighting over nothing? Let's go to the Rhino Chief. He settles every quarrel!" |
| 17 | 00:06.7-00:10 | 2:46.7-2:50.0 | Narrator | "But the littlest Meadow Mouse did not like" |
| 18 | 00:00-00:01.3 | 2:50.0-2:51.3 | Narrator | "that idea at all." |
| 18 | 00:01.8-00:09.7 | 2:51.8-2:59.7 | Narrator | "It squeaked that they should ask Mama Yeti instead, because she was kind and wise." |
| 19 | 00:00.6-00:03.8 | 3:00.6-3:03.8 | Narrator | "And all the forest friends happily agreed." |
| 19 | 00:05-00:10 | 3:05.0-3:10.0 | Narrator | "The very next afternoon, Sona Butterfly fluttered ahead through" |
| 20 | 00:00-00:03.9 | 3:10.0-3:13.9 | Narrator | "the trees, leading Mama Yeti into the glade." |
| 20 | 00:04.7-00:09.9 | 3:14.7-3:19.9 | Narrator | "Mama Yeti looked around at all the forest friends and smiled." |
| 21 | 00:01.2-00:06.8 | 3:21.2-3:26.8 | Mama Yeti | "Friends who sing sweetly never need to boast. Is anyone here proud like that?" |
| 21 | 00:07.8-00:09.1 | 3:27.8-3:29.1 | Forest friends | "No!" |
| 22 | 00:00-00:02 | 3:30.0-3:32.0 | Narrator | "everyone cried together." |
| 22 | 00:02.8-00:08 | 3:32.8-3:38.0 | Narrator | "Then, in a small, quiet voice, Babu Yeti murmured," |
| 22 | 00:09.1-00:10 | 3:39.1-3:40.0 | Babu Yeti | "Well... my" |
| 23 | 00:00-00:02.6 | 3:40.0-3:42.6 | Babu Yeti | "voice is sweeter than everyone's." |
| 23 | 00:03.6-00:08.5 | 3:43.6-3:48.5 | Narrator | "Mama Yeti knelt down beside him and pointed to the meadow." |
| 23 | 00:09.6-00:10 | 3:49.6-3:50.0 | Mama Yeti | "Babu," |
| 24 | 00:00-00:07.5 | 3:50.0-3:57.5 | Mama Yeti | "which garden do you like best? One with only one kind of flower, or one with many different kinds?" |
| 24 | 00:08.5-00:10 | 3:58.5-4:00.0 | Narrator | "Babu Yeti looked" |
| 25 | 00:00-00:10 | 4:00.0-4:10.0 | Narrator | "at the wildflowers, red and yellow, blue and white, purple and pink, all nodding together in the" |
| 26 | 00:00-00:00.9 | 4:10.0-4:10.9 | Narrator | "breeze." |
| 26 | 00:01.9-00:05.3 | 4:11.9-4:15.3 | Babu Yeti | "I like a garden with many different kinds of flowers." |
| 26 | 00:06.4-00:07.1 | 4:16.4-4:17.1 | Mama Yeti | "Well said," |
| 26 | 00:08.2-00:10 | 4:18.2-4:20.0 | Narrator | "Mama Yeti smiled." |
| 27 | 00:01.2-00:10 | 4:21.2-4:30.0 | Mama Yeti | "In the same way, one voice alone doesn't stay sweet forever. Many different voices together sound sweet. That is why every" |
| 28 | 00:00-00:01.6 | 4:30.0-4:31.6 | Mama Yeti | "voice here is lovely." |
| 28 | 00:02.5-00:10 | 4:32.5-4:40.0 | Narrator | "Mama Yeti's wise words touched Babu Yeti's heart, and at last he" |
| 29 | 00:00-00:00.8 | 4:40.0-4:40.8 | Narrator | "understood." |
| 29 | 00:01.7-00:10 | 4:41.7-4:50.0 | Narrator | "He climbed down from the big flat stone and walked over to Gombu Tortoise and Mili Red Panda." |
| 30 | 00:01.1-00:05.9 | 4:51.1-4:55.9 | Babu Yeti | "I'm sorry, Gombu. I'm sorry, Mili. Will you sing with me?" |
| 30 | 00:06.9-00:10 | 4:56.9-5:00.0 | Narrator | "Gombu Tortoise smiled a" |
| 31 | 00:00-00:01.9 | 5:00.0-5:01.9 | Narrator | "slow, kind smile." |
| 31 | 00:03-00:04.7 | 5:03.0-5:04.7 | Gombu Tortoise | "Of course, Babu." |
| 31 | 00:05.8-00:10 | 5:05.8-5:10.0 | Narrator | "That evening, as the sun went down, the" |
| 32 | 00:00-00:10 | 5:10.0-5:20.0 | Narrator | "whole glade sang together: Gombu Tortoise's deep hum, Mili Red Panda's soft whistle, the Meadow Mice's" |
| 33 | 00:00-00:10 | 5:20.0-5:30.0 | Narrator | "drumming feet, Nimbu Tree Frog's chirrup, Mama Yeti's warm humming, and Babu Yeti's sweet little" |
| 34 | 00:00-00:03.5 | 5:30.0-5:33.5 | Narrator | "trill, all woven into one happy song." |
| 34 | 00:04.7-00:09.4 | 5:34.7-5:39.4 | Narrator | "From that day on, Babu Yeti gave up his pride forever." |
| 46 | 00:04.5-00:10 | 7:34.5-7:40.0 | Narrator | "Let others praise your voice, and love every voice around you, because" |
| 47 | 00:00-00:04.2 | 7:40.0-7:44.2 | Narrator | "many voices together make the sweetest song of all." |

## Song

`many-voices-one-song.wav` plays from 5:40.9 to 7:33.0 of the master (clips 35 to 46). The singing runs from 5:45.8 to 7:29.2 (clips 35 to 45). It is laid into the master as recorded and replaces Flow's audio in the edit. In those clips the `Speech:` line holds only the spoken words around the song (or none), and the `Song:` line gives each sung phrase on the clip's clock with its singers and whether they are on screen or off-screen, so Flow moves the singing characters' mouths in time with the words while every other mouth stays closed. Times and singers come from `speech-prompts/babu-yeti-garden-of-voices-song-lines.json` (each line's `parts`): its times start as whisper word timings (`song-lines.mjs`) and are corrected there by ear.

| Film time | Clip | Verse | Line |
| --- | --- | --- | --- |
| 5:45.8-5:49.9 | 35 | Verse 1 | I used to think my song was best, |
| 5:50.4-5:55.1 | 36 | Verse 1 | louder and sweeter than the rest, |
| 5:55.4-5:59.6 | 36 | Verse 1 | but one small voice, all on its own, |
| 6:00.1-6:06.5 | 37 | Verse 1 | sounds lonely singing all alone. |
| 6:07.3-6:11.6 | 37 and 38 | Verse 2 | Hum, hum, goes Gombu, deep and slow, |
| 6:12.1-6:16.4 | 38 | Verse 2 | Mili whistles soft and low, |
| 6:16.9-6:21.1 | 38 and 39 | Verse 2 | tap-tap-tap, the mice keep time, |
| 6:21.4-6:26.1 | 39 | Verse 2 | and Nimbu chirrups every line. |
| 6:26.5-6:30.9 | 39 and 40 | Verse 3 | Many flowers make a garden bright, |
| 6:31.4-6:35.8 | 40 | Verse 3 | red and yellow, blue and white, |
| 6:36.1-6:40.3 | 40 and 41 | Verse 3 | many voices, big and small, |
| 6:40.9-6:46.6 | 41 | Verse 3 | make the sweetest song of all. |
| 6:48.1-6:52.4 | 41 and 42 | Verse 4 | Sing your song and I'll sing mine, |
| 6:52.9-6:57.3 | 42 | Verse 4 | side by side our voices shine, |
| 6:57.7-7:02.0 | 42 and 43 | Verse 4 | Mama hums and Babu trills, |
| 7:02.5-7:06.9 | 43 | Verse 4 | over the glade and over the hills. |
| 7:07.3-7:11.6 | 43 and 44 | Verse 5 | Many flowers make a garden bright, |
| 7:12.1-7:16.4 | 44 | Verse 5 | red and yellow, blue and white, |
| 7:16.9-7:21.1 | 44 and 45 | Verse 5 | many voices, big and small, |
| 7:21.7-7:29.2 | 45 | Verse 5 | make the sweetest song of all. |

## Clips

Each `Speech:` and `Song:` line is copy-ready for that video's Agent prompt, fixed sentence included.

### Clip 1 - 0:00.0 to 0:10.0

Speech: 00:00-00:10, Narrator, off-screen, running on into the next clip: "Once upon a time, high in a Himalayan forest of red rhododendron trees, there was a sunny glade full of" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.8, 00:06.8.

### Clip 2 - 0:10.0 to 0:20.0

Speech: 00:00-00:00.7, Narrator, off-screen, continuing from the last clip: "wildflowers." 00:01.6-00:10, Narrator, off-screen, running on into the next clip: "In the middle of the glade sat a big flat stone, and every evening the forest friends gathered around it to" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:05.5, 00:07.5.

### Clip 3 - 0:20.0 to 0:30.0

Speech: 00:00-00:01.4, Narrator, off-screen, continuing from the last clip: "share their songs." 00:02.4-00:05.6, Narrator, off-screen: "Gombu Tortoise hummed low and deep." 00:06.2-00:09.1, Narrator, off-screen: "Mili Red Panda whistled softly." 00:09.7-00:10, Narrator, off-screen, running on into the next clip: "The" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.9, 00:05.9.

### Clip 4 - 0:30.0 to 0:40.0

Speech: 00:00-00:08, Narrator, off-screen, continuing from the last clip: "Meadow Mice drummed their tiny feet, and Nimbu Tree Frog chirruped from the branches of an old tree." 00:08.9-00:10, Narrator, off-screen, running on into the next clip: "Babu Yeti loved" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.1, 00:08.4.

### Clip 5 - 0:40.0 to 0:50.0

Speech: 00:00-00:02.6, Narrator, off-screen, continuing from the last clip: "to sing more than anything." 00:03.2-00:07.4, Narrator, off-screen: "He could trill high and sweet, like a little bamboo flute." 00:08.1-00:10, Narrator, off-screen, running on into the next clip: "But the more he sang," Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.9, 00:07.7, 00:08.9.

### Clip 6 - 0:50.0 to 1:00.0

Speech: 00:00-00:03, Narrator, off-screen, continuing from the last clip: "the prouder he grew of his own voice." 00:03.8-00:10, Narrator, off-screen, running on into the next clip: "One golden evening, Babu Yeti climbed up onto the big flat stone," Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.4, 00:06.

### Clip 7 - 1:00.0 to 1:10.0

Speech: 00:00-00:03.4, Narrator, off-screen, continuing from the last clip: "puffed out his fluffy chest, and boasted," 00:04.3-00:08, Babu Yeti, on screen: "If it weren't for me, nobody here could sing a sweet song!" 00:09.1-00:10, Narrator, off-screen, running on into the next clip: "The forest" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.9, 00:08.5.

### Clip 8 - 1:10.0 to 1:20.0

Speech: 00:00-00:01.5, Narrator, off-screen, continuing from the last clip: "friends were stunned." 00:02.3-00:05.2, Narrator, off-screen: "The Meadow Mice's ears shot straight up." 00:06.2-00:08.7, Narrator, off-screen: "Gombu Tortoise blinked slowly." 00:09.7-00:10, Narrator, off-screen, running on into the next clip: "They" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.9, 00:05.7.

### Clip 9 - 1:20.0 to 1:30.0

Speech: 00:00-00:03.5, Narrator, off-screen, continuing from the last clip: "all turned and looked at one another in surprise." 00:04.7-00:09.4, Narrator, off-screen: "Then Gombu Tortoise spoke up, slow and kind." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:04.1, 00:07.6.

### Clip 10 - 1:30.0 to 1:40.0

Speech: 00:00.5-00:10, Gombu Tortoise, on screen, running on into the next clip: "Babu, it's better when others praise your voice for you. Many friends in this forest sing sweetly," Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.5, 00:06.1.

### Clip 11 - 1:40.0 to 1:50.0

Speech: 00:00-00:00.4, Gombu Tortoise, off-screen, over a reaction shot, continuing from the last clip: "too." 00:01.5-00:07.8, Narrator, off-screen: "Babu Yeti's cheeks puffed up, and he stamped his foot on the stone." 00:08.9-00:10, Babu Yeti, off-screen, over a reaction shot, running on into the next clip: "Phooey! You can" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:08.3.

### Clip 12 - 1:50.0 to 2:00.0

Speech: 00:00-00:02.5, Babu Yeti, on screen, continuing from the last clip: "only hum! Why are you showing off?" 00:03.6-00:07.8, Narrator, off-screen: "Mili Red Panda twitched her striped tail." 00:08.9-00:10, Mili Red Panda, off-screen, over a reaction shot, running on into the next clip: "Babu, don't" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03, 00:08.4.

### Clip 13 - 2:00.0 to 2:10.0

Speech: 00:00-00:06.2, Mili Red Panda, on screen, continuing from the last clip: "be so full of yourself. Everything Gombu said is completely right." 00:07.2-00:10, Narrator, off-screen, running on into the next clip: "Because of Babu Yeti's sharp" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.5, 00:06.7.

### Clip 14 - 2:10.0 to 2:20.0

Speech: 00:00-00:03.2, Narrator, off-screen, continuing from the last clip: "words, everyone began talking at once." 00:04.1-00:10, Narrator, off-screen, running on into the next clip: "The Meadow Mice squeaked, Mili Red Panda huffed, Gombu Tortoise" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.6, 00:06, 00:08.6.

### Clip 15 - 2:20.0 to 2:30.0

Speech: 00:00-00:06.6, Narrator, off-screen, continuing from the last clip: "grumbled, and a noisy quarrel filled the glade for a long, long while." 00:07.8-00:10, Narrator, off-screen, running on into the next clip: "Up on a branch of the old" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:07.2.

### Clip 16 - 2:30.0 to 2:40.0

Speech: 00:00-00:05.1, Narrator, off-screen, continuing from the last clip: "tree, Nimbu Tree Frog had been listening to the whole quarrel." 00:06.2-00:07, Nimbu Tree Frog, on screen: "Hey, everyone!" 00:08-00:09, Narrator, off-screen: "he called down." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.5, 00:05.6, 00:07.5.

### Clip 17 - 2:40.0 to 2:50.0

Speech: 00:00.1-00:05.7, Nimbu Tree Frog, on screen: "Why are you fighting over nothing? Let's go to the Rhino Chief. He settles every quarrel!" 00:06.7-00:10, Narrator, off-screen, running on into the next clip: "But the littlest Meadow Mouse did not like" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.3, 00:06.1.

### Clip 18 - 2:50.0 to 3:00.0

Speech: 00:00-00:01.3, Narrator, off-screen, continuing from the last clip: "that idea at all." 00:01.8-00:09.7, Narrator, off-screen: "It squeaked that they should ask Mama Yeti instead, because she was kind and wise." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.6, 00:03.1, 00:06.5.

### Clip 19 - 3:00.0 to 3:10.0

Speech: 00:00.6-00:03.8, Narrator, off-screen: "And all the forest friends happily agreed." 00:05-00:10, Narrator, off-screen, running on into the next clip: "The very next afternoon, Sona Butterfly fluttered ahead through" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:04.4, 00:07.1.

### Clip 20 - 3:10.0 to 3:20.0

Speech: 00:00-00:03.9, Narrator, off-screen, continuing from the last clip: "the trees, leading Mama Yeti into the glade." 00:04.7-00:09.9, Narrator, off-screen: "Mama Yeti looked around at all the forest friends and smiled." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:04.3, 00:08.8.

### Clip 21 - 3:20.0 to 3:30.0

Speech: 00:01.2-00:06.8, Mama Yeti, on screen: "Friends who sing sweetly never need to boast. Is anyone here proud like that?" 00:07.8-00:09.1, Forest friends, on screen: "No!" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:04.6, 00:07.3.

### Clip 22 - 3:30.0 to 3:40.0

Speech: 00:00-00:02, Narrator, off-screen: "everyone cried together." 00:02.8-00:08, Narrator, off-screen: "Then, in a small, quiet voice, Babu Yeti murmured," 00:09.1-00:10, Babu Yeti, off-screen, over a reaction shot, running on into the next clip: "Well... my" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.4, 00:03.4, 00:06.3, 00:08.5.

### Clip 23 - 3:40.0 to 3:50.0

Speech: 00:00-00:02.6, Babu Yeti, on screen, continuing from the last clip: "voice is sweeter than everyone's." 00:03.6-00:08.5, Narrator, off-screen: "Mama Yeti knelt down beside him and pointed to the meadow." 00:09.6-00:10, Mama Yeti, off-screen, over a reaction shot, running on into the next clip: "Babu," Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03, 00:06.5.

### Clip 24 - 3:50.0 to 4:00.0

Speech: 00:00-00:07.5, Mama Yeti, on screen, continuing from the last clip: "which garden do you like best? One with only one kind of flower, or one with many different kinds?" 00:08.5-00:10, Narrator, off-screen, running on into the next clip: "Babu Yeti looked" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.2, 00:05, 00:08.

### Clip 25 - 4:00.0 to 4:10.0

Speech: 00:00-00:10, Narrator, off-screen, continuing from the last clip, running on into the next clip: "at the wildflowers, red and yellow, blue and white, purple and pink, all nodding together in the" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.1, 00:04.1, 00:05.9, 00:07.6.

### Clip 26 - 4:10.0 to 4:20.0

Speech: 00:00-00:00.9, Narrator, off-screen, continuing from the last clip: "breeze." 00:01.9-00:05.3, Babu Yeti, on screen: "I like a garden with many different kinds of flowers." 00:06.4-00:07.1, Mama Yeti, on screen: "Well said," 00:08.2-00:10, Narrator, off-screen, running on into the next clip: "Mama Yeti smiled." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.4, 00:05.8, 00:07.6.

### Clip 27 - 4:20.0 to 4:30.0

Speech: 00:01.2-00:10, Mama Yeti, on screen, running on into the next clip: "In the same way, one voice alone doesn't stay sweet forever. Many different voices together sound sweet. That is why every" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:05.6, 00:08.9.

### Clip 28 - 4:30.0 to 4:40.0

Speech: 00:00-00:01.6, Mama Yeti, off-screen, over a reaction shot, continuing from the last clip: "voice here is lovely." 00:02.5-00:10, Narrator, off-screen, running on into the next clip: "Mama Yeti's wise words touched Babu Yeti's heart, and at last he" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02, 00:05.2, 00:08.

### Clip 29 - 4:40.0 to 4:50.0

Speech: 00:00-00:00.8, Narrator, off-screen, continuing from the last clip: "understood." 00:01.7-00:10, Narrator, off-screen, running on into the next clip: "He climbed down from the big flat stone and walked over to Gombu Tortoise and Mili Red Panda." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.3, 00:08.1.

### Clip 30 - 4:50.0 to 5:00.0

Speech: 00:01.1-00:05.9, Babu Yeti, on screen: "I'm sorry, Gombu. I'm sorry, Mili. Will you sing with me?" 00:06.9-00:10, Narrator, off-screen, running on into the next clip: "Gombu Tortoise smiled a" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.8, 00:04.5, 00:06.4.

### Clip 31 - 5:00.0 to 5:10.0

Speech: 00:00-00:01.9, Narrator, off-screen, continuing from the last clip: "slow, kind smile." 00:03-00:04.7, Gombu Tortoise, on screen: "Of course, Babu." 00:05.8-00:10, Narrator, off-screen, running on into the next clip: "That evening, as the sun went down, the" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.4, 00:05.3, 00:06.8.

### Clip 32 - 5:10.0 to 5:20.0

Speech: 00:00-00:10, Narrator, off-screen, continuing from the last clip, running on into the next clip: "whole glade sang together: Gombu Tortoise's deep hum, Mili Red Panda's soft whistle, the Meadow Mice's" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.3, 00:05.4, 00:08.6.

### Clip 33 - 5:20.0 to 5:30.0

Speech: 00:00-00:10, Narrator, off-screen, continuing from the last clip, running on into the next clip: "drumming feet, Nimbu Tree Frog's chirrup, Mama Yeti's warm humming, and Babu Yeti's sweet little" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.5, 00:04.1, 00:06.6.

### Clip 34 - 5:30.0 to 5:40.0

Speech: 00:00-00:03.5, Narrator, off-screen, continuing from the last clip: "trill, all woven into one happy song." 00:04.7-00:09.4, Narrator, off-screen: "From that day on, Babu Yeti gave up his pride forever." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:04.1.

### Clip 35 - 5:40.0 to 5:50.0

Speech: none.

Song: 00:05.8-00:10, Babu Yeti, on screen, singing: "I used to think my song was best," Each sung line is sung once, exactly as written and at exactly these times, in English, to the melody of the music; only the singing characters' mouths move, in time with the words, and every other mouth stays closed.

Cut points (pauses): none.

### Clip 36 - 5:50.0 to 6:00.0

Speech: none.

Song: 00:00.5-00:05.1, Babu Yeti, on screen, singing: "louder and sweeter than the rest," 00:05.4-00:09.6, Babu Yeti, on screen, singing: "but one small voice, all on its own," Each sung line is sung once, exactly as written and at exactly these times, in English, to the melody of the music; only the singing characters' mouths move, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:05.3.

### Clip 37 - 6:00.0 to 6:10.0

Speech: none.

Song: 00:00.1-00:06.5, Babu Yeti, on screen, singing: "sounds lonely singing all alone." 00:07.3-00:10, Chorus, off-screen, singing, running on into the next clip: "Hum, hum, goes Gombu," Each sung line is sung once, exactly as written and at exactly these times, in English, to the melody of the music; only the singing characters' mouths move, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:06.9.

### Clip 38 - 6:10.0 to 6:20.0

Speech: none.

Song: 00:00-00:01.7, Chorus, off-screen, singing, continuing from the last clip: "deep and slow," 00:02.1-00:06.4, Babu Yeti, on screen, singing: "Mili whistles soft and low," 00:06.9-00:10, Chorus, off-screen, singing, running on into the next clip: "tap-tap-tap, the mice" Each sung line is sung once, exactly as written and at exactly these times, in English, to the melody of the music; only the singing characters' mouths move, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.9, 00:06.7.

### Clip 39 - 6:20.0 to 6:30.0

Speech: none.

Song: 00:00-00:01.1, Chorus, off-screen, singing, continuing from the last clip: "keep time," 00:01.5-00:06.2, Chorus, off-screen, singing: "and Nimbu chirrups every line." 00:06.5-00:10, Babu Yeti and Mili Red Panda, on screen, singing, running on into the next clip: "Many flowers make a garden" Each sung line is sung once, exactly as written and at exactly these times, in English, to the melody of the music; only the singing characters' mouths move, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.3, 00:06.3.

### Clip 40 - 6:30.0 to 6:40.0

Speech: none.

Song: 00:00-00:00.9, Babu Yeti and Mili Red Panda, on screen, singing, continuing from the last clip: "bright," 00:01.4-00:03.6, Babu Yeti and Mili Red Panda, on screen, singing: "red and yellow," 00:03.8-00:05.8, Babu Yeti, Mama Yeti, and Mili Red Panda, on screen, singing: "blue and white," 00:06.1-00:10, Babu Yeti and Mama Yeti, on screen, singing, running on into the next clip: "many voices, big and" Each sung line is sung once, exactly as written and at exactly these times, in English, to the melody of the music; only the singing characters' mouths move, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.1, 00:03.7, 00:06.

### Clip 41 - 6:40.0 to 6:50.0

Speech: none.

Song: 00:00-00:00.3, Babu Yeti and Mama Yeti, on screen, singing, continuing from the last clip: "small," 00:00.9-00:03.2, Babu Yeti and Mama Yeti, on screen, singing: "make the sweetest" 00:03.3-00:06.7, Gombu Tortoise and Mili Red Panda, on screen, singing: "song of all." 00:08.2-00:10, Babu Yeti and Mama Yeti, on screen, singing, running on into the next clip: "Sing your" Each sung line is sung once, exactly as written and at exactly these times, in English, to the melody of the music; only the singing characters' mouths move, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.3, 00:07.5.

### Clip 42 - 6:50.0 to 7:00.0

Speech: none.

Song: 00:00-00:02.4, Babu Yeti and Mama Yeti, on screen, singing, continuing from the last clip: "song and I'll sing mine," 00:03-00:07.3, Babu Yeti and Mama Yeti, on screen, singing: "side by side our voices shine," 00:07.7-00:10, Babu Yeti, on screen, singing, running on into the next clip: "Mama hums and Babu" Each sung line is sung once, exactly as written and at exactly these times, in English, to the melody of the music; only the singing characters' mouths move, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.7, 00:07.5.

### Clip 43 - 7:00.0 to 7:10.0

Speech: none.

Song: 00:00-00:02, Babu Yeti, on screen, singing, continuing from the last clip: "trills," 00:02.5-00:06.9, Babu Yeti and Mama Yeti, on screen, singing: "over the glade and over the hills." 00:07.3-00:10, Babu Yeti, Mama Yeti, and Gombu Tortoise, on screen, singing, running on into the next clip: "Many flowers make a" Each sung line is sung once, exactly as written and at exactly these times, in English, to the melody of the music; only the singing characters' mouths move, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.3, 00:07.1.

### Clip 44 - 7:10.0 to 7:20.0

Speech: none.

Song: 00:00-00:01.7, Babu Yeti, Mama Yeti, and Gombu Tortoise, on screen, singing, continuing from the last clip: "garden bright," 00:02.1-00:06.5, Gombu Tortoise and Mili Red Panda, on screen, singing: "red and yellow, blue and white," 00:06.9-00:10, Babu Yeti and Mama Yeti, on screen, singing, running on into the next clip: "many voices, big and" Each sung line is sung once, exactly as written and at exactly these times, in English, to the melody of the music; only the singing characters' mouths move, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.9, 00:06.7.

### Clip 45 - 7:20.0 to 7:30.0

Speech: none.

Song: 00:00-00:01.2, Babu Yeti and Mama Yeti, on screen, singing, continuing from the last clip: "small," 00:01.7-00:04, Babu Yeti and Mama Yeti, on screen, singing: "make the sweetest" 00:04-00:09.2, Babu Yeti, Gombu Tortoise, and Mili Red Panda, on screen, singing: "song of all." Each sung line is sung once, exactly as written and at exactly these times, in English, to the melody of the music; only the singing characters' mouths move, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.4, 00:04.

### Clip 46 - 7:30.0 to 7:40.0

Speech: 00:04.5-00:10, Narrator, off-screen, running on into the next clip: "Let others praise your voice, and love every voice around you, because" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Song: none.

Cut points (pauses): 00:06.6.

### Clip 47 - 7:40.0 to 7:44.5

Speech: 00:00-00:04.2, Narrator, off-screen, continuing from the last clip: "many voices together make the sweetest song of all." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.8. Speech ends at 00:04.2; the clip is trimmed at 00:04.5.
