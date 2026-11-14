# Papa Yeti and the Two Coins of Wisdom - Film timeline

The audio clock for the film, built from the AI Studio audio by `tools/ai-studio-voice-runner/film-audio.mjs`. The master audio `story-full.wav` (in `C:/Users/Acer/Downloads/speech-takes/papa-yeti-two-coins-of-wisdom`) is 10:34.0 long, so the film is 64 clips of 10 seconds, the last trimmed to 4.0 s in the edit. Every word below is at its exact time in that audio; `clips/clip-NN.wav` is each clip's slice. `/story-to-storyboard` writes one Agent prompt per clip from this plan.

## Notes

- timing fixes applied: B004 at 1:18.7, B007 at 1:31.5, B009 at 1:46.9, B013 at 2:47.3, B015 at 3:06.6, B017 at 3:22.5, B021 at 4:13.7, B023 at 4:49.3, B027 at 5:16.2, B029 at 6:10.7, B031 at 6:37.5, B033 at 6:49.2, B035 at 7:00.2, B037 at 7:39.4, B039 at 7:49.3, B043 at 8:32.5, B047 at 9:04.3, B049 at 9:22.1, B051 at 9:38.3, B053 at 9:45.8
- B002 (Mama Yeti, 1:08.5-1:12.3) crosses the cut at 1:10.0: the speaker is on screen where most of the line falls, the rest plays over a reaction shot
- B004 (Papa Yeti, 1:18.7-1:21.3) crosses the cut at 1:20.0: the speaker is on screen where most of the line falls, the rest plays over a reaction shot
- B006 (Papa Yeti, 1:27.9-1:30.5) crosses the cut at 1:30.0: the speaker is on screen where most of the line falls, the rest plays over a reaction shot
- B015 (Blue Magpie, 3:06.6-3:10.4) crosses the cut at 3:10.0: the speaker is on screen where most of the line falls, the rest plays over a reaction shot
- B023 (Grand Peacock, 4:49.3-4:51.8) crosses the cut at 4:50.0: the speaker is on screen where most of the line falls, the rest plays over a reaction shot
- B033 (Babu Yeti, 6:49.2-6:50.7) crosses the cut at 6:50.0: the speaker is on screen where most of the line falls, the rest plays over a reaction shot
- B037 (Tashi Marmot, 7:39.4-7:41.7) crosses the cut at 7:40.0: the speaker is on screen where most of the line falls, the rest plays over a reaction shot
- B039 (Snow Leopard Queen, 7:49.3-7:50.4) crosses the cut at 7:50.0: the speaker is on screen where most of the line falls, the rest plays over a reaction shot

## Line check

Lip sync depends on these times. Listen to each file (in the audio folder): it must hold exactly this line, first word to last, in this speaker's voice. If one is wrong, write the line's true start in seconds of the master into `speech-prompts/<slug>-timing-fixes.json` (`{ "B029": 370.69 }`), run `film-audio.mjs` again, and listen again.

| Block | Speaker | Film time | Clip | Line | File |
| --- | --- | --- | --- | --- | --- |
| B002 | Mama Yeti | 1:08.5-1:12.3 | 7 and 8 | "Look how rich Tashi is! Our bowls are nearly empty." | `lines/B002-mama-yeti.wav` |
| B004 | Papa Yeti | 1:18.7-1:21.3 | 8 and 9 | "She's right. I'm not so clever." | `lines/B004-papa-yeti.wav` |
| B006 | Papa Yeti | 1:27.9-1:30.5 | 9 and 10 | "I'll buy wisdom with our two coins!" | `lines/B006-papa-yeti.wav` |
| B007 | Mama Yeti | 1:31.5-1:33.7 | 10 | "Babu, fetch the money box!" | `lines/B007-mama-yeti.wav` |
| B009 | Babu Yeti | 1:46.9-1:47.7 | 11 | "Here, Papa!" | `lines/B009-babu-yeti.wav` |
| B011 | Babu Yeti | 2:13.1-2:13.9 | 14 | "Bye, Papa!" | `lines/B011-babu-yeti.wav` |
| B013 | Papa Yeti | 2:47.3-2:50.0 | 17 | "Please, sell me some wisdom." | `lines/B013-papa-yeti.wav` |
| B015 | Blue Magpie | 3:06.6-3:10.4 | 19 and 20 | "Always do what respectable folk tell you." | `lines/B015-blue-magpie.wav` |
| B017 | Papa Yeti | 3:22.5-3:24.3 | 21 | "Thank you! I'll remember that." | `lines/B017-papa-yeti.wav` |
| B019 | Papa Yeti | 4:04.5-4:06.9 | 25 | "My last coin, for wisdom?" | `lines/B019-papa-yeti.wav` |
| B021 | Dolma Yak | 4:13.7-4:17.1 | 26 | "Always tell the Queen the truth." | `lines/B021-dolma-yak.wav` |
| B023 | Grand Peacock | 4:49.3-4:51.8 | 29 and 30 | "Phew! What a smelly old bundle!" | `lines/B023-grand-peacock.wav` |
| B025 | Grand Peacock | 5:01.1-5:03.5 | 31 | "Bury it, and take these coins!" | `lines/B025-grand-peacock.wav` |
| B027 | Papa Yeti | 5:16.2-5:17.6 | 32 | "Yes, of course!" | `lines/B027-papa-yeti.wav` |
| B029 | Papa Yeti | 6:10.7-6:12.8 | 38 | "Jewels and gold!" | `lines/B029-papa-yeti.wav` |
| B031 | Mama Yeti | 6:37.5-6:40.1 | 40 | "Oh, Papa! How wonderful!" | `lines/B031-mama-yeti.wav` |
| B033 | Babu Yeti | 6:49.2-6:50.7 | 41 and 42 | "It sparkles!" | `lines/B033-babu-yeti.wav` |
| B035 | Mama Yeti | 7:00.2-7:03.1 | 43 | "Papa found a treasure! Come and see!" | `lines/B035-mama-yeti.wav` |
| B037 | Tashi Marmot | 7:39.4-7:41.7 | 46 and 47 | "My neighbour took your treasure!" | `lines/B037-tashi-marmot.wav` |
| B039 | Snow Leopard Queen | 7:49.3-7:50.4 | 47 and 48 | "Bring him here!" | `lines/B039-snow-leopard-queen.wav` |
| B041 | Snow Leopard Queen | 8:17.8-8:19.9 | 50 | "Did you take my treasure?" | `lines/B041-snow-leopard-queen.wav` |
| B043 | Papa Yeti | 8:32.5-8:34.6 | 52 | "I'll tell you the whole truth." | `lines/B043-papa-yeti.wav` |
| B045 | Papa Yeti | 8:36.8-8:39.1 | 52 | "I only did what the peacocks asked." | `lines/B045-papa-yeti.wav` |
| B047 | Snow Leopard Queen | 9:04.4-9:05.7 | 55 | "You are forgiven." | `lines/B047-snow-leopard-queen.wav` |
| B049 | Babu Yeti | 9:22.1-9:23.4 | 57 | "Papa's home!" | `lines/B049-babu-yeti.wav` |
| B051 | Tashi Marmot | 9:38.3-9:40.0 | 58 | "I'm sorry I was jealous." | `lines/B051-tashi-marmot.wav` |
| B053 | Papa Yeti | 9:45.9-9:48.3 | 59 | "Come, Tashi. Share our supper." | `lines/B053-papa-yeti.wav` |

## Script

Copy into the storyboard's `## Script` section as it is.

| Video | Clip time | Film time | Speaker | Line |
| --- | --- | --- | --- | --- |
| 1 | 00:00.1-00:06 | 0:00.1-0:06.0 | Narrator | "Once upon a time, in a mountain village, lived a kind Yeti family." |
| 1 | 00:06.7-00:10 | 0:06.7-0:10.0 | Narrator | "Their little stone-and-timber cottage" |
| 2 | 00:00-00:07.7 | 0:10.0-0:17.7 | Narrator | "had a sagging slate roof, a woven bamboo door, and a tiny vegetable patch fenced with sticks." |
| 2 | 00:08.4-00:10 | 0:18.4-0:20.0 | Narrator | "Next door lived" |
| 3 | 00:00-00:02.9 | 0:20.0-0:22.9 | Narrator | "Tashi Marmot, clever and very rich." |
| 3 | 00:03.5-00:10 | 0:23.5-0:30.0 | Narrator | "Behind his whitewashed wall stood a grand painted house with a golden finial on its" |
| 4 | 00:00-00:03.9 | 0:30.0-0:33.9 | Narrator | "roof and a storehouse heaped with sacks of grain." |
| 4 | 00:05.5-00:10 | 0:35.5-0:40.0 | Narrator | "One bright morning, Tashi Marmot stood by his storehouse, polishing" |
| 5 | 00:00-00:05.7 | 0:40.0-0:45.7 | Narrator | "a big gold coin on his crimson vest and holding it up to shine in the sun." |
| 5 | 00:06.3-00:10 | 0:46.3-0:50.0 | Narrator | "On the porch steps of the little cottage, Papa Yeti" |
| 6 | 00:00-00:02.2 | 0:50.0-0:52.2 | Narrator | "looked into the family's grain sack." |
| 6 | 00:02.9-00:04 | 0:52.9-0:54.0 | Narrator | "It was nearly empty." |
| 6 | 00:04.8-00:10 | 0:54.8-1:00.0 | Narrator | "Mama Yeti and Babu Yeti sat on the lowest step with their wooden bowls, and" |
| 7 | 00:00-00:02.8 | 1:00.0-1:02.8 | Narrator | "there were only a few grains of rice in each." |
| 7 | 00:03.8-00:07.4 | 1:03.8-1:07.4 | Narrator | "Mama Yeti looked across at the grand house and sighed." |
| 7 | 00:08.5-00:10 | 1:08.5-1:10.0 | Mama Yeti | "Look how rich Tashi" |
| 8 | 00:00-00:02.3 | 1:10.0-1:12.3 | Mama Yeti | "is! Our bowls are nearly empty." |
| 8 | 00:03.1-00:07.6 | 1:13.1-1:17.6 | Narrator | "Papa Yeti rested a hand on his chest and said softly to himself," |
| 8 | 00:08.7-00:10 | 1:18.7-1:20.0 | Papa Yeti | "She's right. I'm" |
| 9 | 00:00-00:01.3 | 1:20.0-1:21.3 | Papa Yeti | "not so clever." |
| 9 | 00:02.4-00:07.1 | 1:22.4-1:27.1 | Narrator | "But then he lifted his head, and his eyes grew bright and determined." |
| 9 | 00:07.9-00:10 | 1:27.9-1:30.0 | Papa Yeti | "I'll buy wisdom with our two" |
| 10 | 00:00-00:00.5 | 1:30.0-1:30.5 | Papa Yeti | "coins!" |
| 10 | 00:01.5-00:03.7 | 1:31.5-1:33.7 | Mama Yeti | "Babu, fetch the money box!" |
| 10 | 00:04.5-00:07.5 | 1:34.5-1:37.5 | Narrator | "said Mama Yeti with a gentle smile." |
| 10 | 00:08.2-00:10 | 1:38.2-1:40.0 | Narrator | "Babu Yeti hurried out through" |
| 11 | 00:00-00:05.8 | 1:40.0-1:45.8 | Narrator | "the bamboo door with the little carved wooden money box held against his tummy." |
| 11 | 00:06.9-00:07.7 | 1:46.9-1:47.7 | Babu Yeti | "Here, Papa!" |
| 11 | 00:08.5-00:10 | 1:48.5-1:50.0 | Narrator | "He lifted the lid." |
| 12 | 00:00.7-00:06.3 | 1:50.7-1:56.3 | Narrator | "Inside lay exactly two copper coins, all the family had saved." |
| 12 | 00:06.9-00:10 | 1:56.9-2:00.0 | Narrator | "Papa Yeti knelt down, and Babu Yeti" |
| 13 | 00:00-00:03.6 | 2:00.0-2:03.6 | Narrator | "tipped the coins into his big open hand." |
| 13 | 00:04.8-00:08.8 | 2:04.8-2:08.8 | Narrator | "Papa Yeti closed his hand around the coins and stood up tall." |
| 13 | 00:09.5-00:10 | 2:09.5-2:10.0 | Narrator | "Mama Yeti" |
| 14 | 00:00-00:02.3 | 2:10.0-2:12.3 | Narrator | "and Babu Yeti waved from the porch." |
| 14 | 00:03.1-00:03.9 | 2:13.1-2:13.9 | Babu Yeti | "Bye, Papa!" |
| 14 | 00:04.7-00:05.6 | 2:14.7-2:15.6 | Narrator | "called Babu Yeti." |
| 14 | 00:06.1-00:09.6 | 2:16.1-2:19.6 | Narrator | "And off he went, down the long mountain road." |
| 15 | 00:00.5-00:04.3 | 2:20.5-2:24.3 | Narrator | "The road wound up through a sunny pine forest." |
| 15 | 00:04.8-00:10 | 2:24.8-2:30.0 | Narrator | "Under a crooked old pine stood a tiny stall with a striped awning, its" |
| 16 | 00:00-00:05.8 | 2:30.0-2:35.8 | Narrator | "counter covered in shiny trinkets, pebbles, buttons, and bits of coloured glass." |
| 16 | 00:06.8-00:10 | 2:36.8-2:40.0 | Narrator | "No one seemed to be there, until Blue Magpie hopped" |
| 17 | 00:00-00:02.8 | 2:40.0-2:42.8 | Narrator | "up onto the counter and cocked its head." |
| 17 | 00:03.8-00:06.2 | 2:43.8-2:46.2 | Narrator | "Papa Yeti held out one copper coin." |
| 17 | 00:07.3-00:10 | 2:47.3-2:50.0 | Papa Yeti | "Please, sell me some wisdom." |
| 18 | 00:00.9-00:04.6 | 2:50.9-2:54.6 | Narrator | "Blue Magpie eyed the coin and narrowed its eyes." |
| 18 | 00:05.3-00:07.7 | 2:55.3-2:57.7 | Narrator | "Blue Magpie thought, I'll trick him!" |
| 18 | 00:08.4-00:10 | 2:58.4-3:00.0 | Narrator | "It fluffed its feathers," |
| 19 | 00:00-00:05.5 | 3:00.0-3:05.5 | Narrator | "put on its grandest, most serious face, and raised one wing like a teacher." |
| 19 | 00:06.6-00:10 | 3:06.6-3:10.0 | Blue Magpie | "Always do what respectable folk tell" |
| 20 | 00:00-00:00.4 | 3:10.0-3:10.4 | Blue Magpie | "you." |
| 20 | 00:01.2-00:06.8 | 3:11.2-3:16.8 | Narrator | "Blue Magpie plucked the coin from Papa Yeti's hand and tucked it under its wing." |
| 20 | 00:07.7-00:10 | 3:17.7-3:20.0 | Narrator | "Papa Yeti pressed a hand to his" |
| 21 | 00:00-00:01.4 | 3:20.0-3:21.4 | Narrator | "chest and beamed." |
| 21 | 00:02.5-00:04.3 | 3:22.5-3:24.3 | Papa Yeti | "Thank you! I'll remember that." |
| 21 | 00:05.6-00:08.2 | 3:25.6-3:28.2 | Narrator | "Then he walked on with a jaunty stride." |
| 21 | 00:08.8-00:10 | 3:28.8-3:30.0 | Narrator | "He walked a" |
| 22 | 00:00-00:01.1 | 3:30.0-3:31.1 | Narrator | "long, long way." |
| 22 | 00:02.1-00:10 | 3:32.1-3:40.0 | Narrator | "At last the stony track climbed to a high, windswept mountain pass, where faded cloth flags snapped" |
| 23 | 00:00-00:05.5 | 3:40.0-3:45.5 | Narrator | "in the wind and a copper kettle steamed on a little clay stove." |
| 23 | 00:06.4-00:10 | 3:46.4-3:50.0 | Narrator | "There, behind the counter of a small stone" |
| 24 | 00:00-00:07.8 | 3:50.0-3:57.8 | Narrator | "tea stall, stood Dolma Yak, an old yak with long shaggy hair and kind, half-closed eyes." |
| 24 | 00:08.6-00:10 | 3:58.6-4:00.0 | Narrator | "Tired but steady," |
| 25 | 00:00-00:03.5 | 4:00.0-4:03.5 | Narrator | "Papa Yeti held out his very last coin." |
| 25 | 00:04.5-00:06.9 | 4:04.5-4:06.9 | Papa Yeti | "My last coin, for wisdom?" |
| 25 | 00:07.9-00:10 | 4:07.9-4:10.0 | Narrator | "Dolma Yak nodded slowly and" |
| 26 | 00:00-00:02.6 | 4:10.0-4:12.6 | Narrator | "nudged a cup of hot tea toward him." |
| 26 | 00:03.7-00:07.1 | 4:13.7-4:17.1 | Dolma Yak | "Always tell the Queen the truth." |
| 26 | 00:08-00:10 | 4:18.0-4:20.0 | Narrator | "Papa Yeti smiled gently" |
| 27 | 00:00-00:02.8 | 4:20.0-4:22.8 | Narrator | "and rested a hand on his chest." |
| 27 | 00:03.5-00:05.3 | 4:23.5-4:25.3 | Narrator | "He would remember that, too." |
| 27 | 00:06.8-00:10 | 4:26.8-4:30.0 | Narrator | "Further on, Papa Yeti found three" |
| 28 | 00:00-00:01.3 | 4:30.0-4:31.3 | Narrator | "grand peacocks." |
| 28 | 00:01.8-00:10 | 4:31.8-4:40.0 | Narrator | "They stood at a meadow crossroads beside a little wooden handcart, around a long, lumpy bundle wrapped in white cloth" |
| 29 | 00:00-00:02.5 | 4:40.0-4:42.5 | Narrator | "with an old string knotted around it." |
| 29 | 00:03.2-00:08.2 | 4:43.2-4:48.2 | Narrator | "Each Grand Peacock turned its beak away and fanned the air with one wing." |
| 29 | 00:09.3-00:10 | 4:49.3-4:50.0 | Grand Peacock | "Phew! What" |
| 30 | 00:00-00:01.8 | 4:50.0-4:51.8 | Grand Peacock | "a smelly old bundle!" |
| 30 | 00:02.5-00:03.5 | 4:52.5-4:53.5 | Narrator | "said the middle one." |
| 30 | 00:04.1-00:10 | 4:54.1-5:00.0 | Narrator | "The Grand Peacock pointed a wing at the bundle and looked down its beak at Papa" |
| 31 | 00:00-00:00.4 | 5:00.0-5:00.4 | Narrator | "Yeti." |
| 31 | 00:01.1-00:03.5 | 5:01.1-5:03.5 | Grand Peacock | "Bury it, and take these coins!" |
| 31 | 00:04.1-00:07.8 | 5:04.1-5:07.8 | Narrator | "And it tipped three small silver coins into his hand." |
| 31 | 00:08.5-00:10 | 5:08.5-5:10.0 | Narrator | "Papa remembered the" |
| 32 | 00:00-00:00.9 | 5:10.0-5:10.9 | Narrator | "magpie's wisdom." |
| 32 | 00:01.8-00:05.2 | 5:11.8-5:15.2 | Narrator | "These were very grand, important-looking folk." |
| 32 | 00:06.2-00:07.6 | 5:16.2-5:17.6 | Papa Yeti | "Yes, of course!" |
| 32 | 00:08.6-00:10 | 5:18.6-5:20.0 | Narrator | "he said brightly, and" |
| 33 | 00:00-00:03.5 | 5:20.0-5:23.5 | Narrator | "he lifted the wooden spade from beside the handcart." |
| 33 | 00:04.3-00:10 | 5:24.3-5:30.0 | Narrator | "The Grand Peacocks strutted away down the road with their noses in the air and never" |
| 34 | 00:00-00:01 | 5:30.0-5:31.0 | Narrator | "looked back." |
| 34 | 00:01.4-00:10 | 5:31.4-5:40.0 | Narrator | "Papa Yeti dug and dug, tossing dark earth onto a growing heap, until a deep, neat pit lay open in" |
| 35 | 00:00-00:01.4 | 5:40.0-5:41.4 | Narrator | "the meadow grass." |
| 35 | 00:01.9-00:06.4 | 5:41.9-5:46.4 | Narrator | "Then he leaned on his spade and let out a big, happy breath." |
| 35 | 00:07.1-00:09.8 | 5:47.1-5:49.8 | Narrator | "He bent down and lifted the bundle." |
| 36 | 00:00.4-00:02.1 | 5:50.4-5:52.1 | Narrator | "It was surprisingly heavy." |
| 36 | 00:03.1-00:10 | 5:53.1-6:00.0 | Narrator | "As he held it against his chest, the old string slipped loose and the white cloth fell" |
| 37 | 00:00-00:00.6 | 6:00.0-6:00.6 | Narrator | "open." |
| 37 | 00:00.9-00:06.4 | 6:00.9-6:06.4 | Narrator | "Inside were sparkling jewels, gold necklaces, and piles of gold coins." |
| 37 | 00:07.1-00:08.6 | 6:07.1-6:08.6 | Narrator | "But it wasn't rubbish at all." |
| 37 | 00:08.9-00:10 | 6:08.9-6:10.0 | Narrator | "It was treasure!" |
| 38 | 00:00.7-00:02.8 | 6:10.7-6:12.8 | Papa Yeti | "Jewels and gold!" |
| 38 | 00:03.8-00:09 | 6:13.8-6:19.0 | Narrator | "gasped Papa Yeti, and his face broke into the biggest smile." |
| 39 | 00:00.6-00:03.8 | 6:20.6-6:23.8 | Narrator | "Papa Yeti carried the treasure all the way home." |
| 39 | 00:04.7-00:10 | 6:24.7-6:30.0 | Narrator | "In the late-afternoon sun he set the bundle down on the porch step, and gold" |
| 40 | 00:00-00:02.9 | 6:30.0-6:32.9 | Narrator | "and jewels spilled across the worn wood." |
| 40 | 00:04.2-00:06.6 | 6:34.2-6:36.6 | Narrator | "Mama Yeti pressed her hands to her chest." |
| 40 | 00:07.5-00:10 | 6:37.5-6:40.0 | Mama Yeti | "Oh, Papa! How wonderful!" |
| 41 | 00:01.4-00:08.2 | 6:41.4-6:48.2 | Narrator | "Babu Yeti lifted out a sparkling gold necklace and held it up with shining eyes." |
| 41 | 00:09.2-00:10 | 6:49.2-6:50.0 | Babu Yeti | "It" |
| 42 | 00:00-00:00.7 | 6:50.0-6:50.7 | Babu Yeti | "sparkles!" |
| 42 | 00:01.5-00:09.1 | 6:51.5-6:59.1 | Narrator | "Mama Yeti was so happy that she leaned over the stick fence and waved down the lane to the neighbours." |
| 43 | 00:00.2-00:03.1 | 7:00.2-7:03.1 | Mama Yeti | "Papa found a treasure! Come and see!" |
| 43 | 00:04.1-00:10 | 7:04.1-7:10.0 | Narrator | "Three Woolly Hares came hopping along, their ears straight up and their noses twitching." |
| 44 | 00:01.1-00:06.8 | 7:11.1-7:16.8 | Narrator | "But next door, Tashi Marmot peeked over his whitewashed wall and scowled." |
| 44 | 00:07.9-00:10 | 7:17.9-7:20.0 | Narrator | "Tashi Marmot grew terribly jealous." |
| 45 | 00:00.9-00:02.1 | 7:20.9-7:22.1 | Narrator | "He dropped down out of sight." |
| 45 | 00:03.2-00:05.8 | 7:23.2-7:25.8 | Narrator | "Tashi Marmot hurried straight to the palace." |
| 45 | 00:06.6-00:10 | 7:26.6-7:30.0 | Narrator | "While Papa Yeti sat on his porch, happily stacking" |
| 46 | 00:00-00:08.3 | 7:30.0-7:38.3 | Narrator | "gold coins into neat little piles, Tashi Marmot bowed low before Snow Leopard Queen in her grand hall of red pillars." |
| 46 | 00:09.4-00:10 | 7:39.4-7:40.0 | Tashi Marmot | "My neighbour" |
| 47 | 00:00-00:01.7 | 7:40.0-7:41.7 | Tashi Marmot | "took your treasure!" |
| 47 | 00:02.3-00:08.2 | 7:42.3-7:48.2 | Narrator | "The Queen narrowed her pale green eyes and raised one paw." |
| 47 | 00:09.3-00:10 | 7:49.3-7:50.0 | Snow Leopard Queen | "Bring him" |
| 48 | 00:00-00:00.4 | 7:50.0-7:50.4 | Snow Leopard Queen | "here!" |
| 48 | 00:01.3-00:10 | 7:51.3-8:00.0 | Narrator | "Back at the cottage, three firm knocks sounded on the bamboo door, and Papa Yeti looked up from his coins, worried." |
| 49 | 00:01.3-00:08.8 | 8:01.3-8:08.8 | Narrator | "Papa Yeti walked slowly along the long red runner of the palace hall, his hands held together at his chest." |
| 49 | 00:09.4-00:10 | 8:09.4-8:10.0 | Narrator | "A cloud" |
| 50 | 00:00-00:03.2 | 8:10.0-8:13.2 | Narrator | "passed over the sun, and the hall grew dim." |
| 50 | 00:04.1-00:07.2 | 8:14.1-8:17.2 | Narrator | "Snow Leopard Queen leaned forward on her throne." |
| 50 | 00:07.8-00:09.9 | 8:17.8-8:19.9 | Snow Leopard Queen | "Did you take my treasure?" |
| 51 | 00:00.8-00:02.6 | 8:20.8-8:22.6 | Narrator | "Papa Yeti was afraid." |
| 51 | 00:03.3-00:06 | 8:23.3-8:26.0 | Narrator | "Then Papa remembered the yak's wisdom." |
| 51 | 00:06.9-00:10 | 8:26.9-8:30.0 | Narrator | "He lifted his chin, put a hand on his chest," |
| 52 | 00:00-00:01.6 | 8:30.0-8:31.6 | Narrator | "and spoke clearly." |
| 52 | 00:02.5-00:04.6 | 8:32.5-8:34.6 | Papa Yeti | "I'll tell you the whole truth." |
| 52 | 00:05.1-00:06.1 | 8:35.1-8:36.1 | Narrator | "Papa Yeti said," |
| 52 | 00:06.8-00:09.1 | 8:36.8-8:39.1 | Papa Yeti | "I only did what the peacocks asked." |
| 52 | 00:09.8-00:10 | 8:39.8-8:40.0 | Narrator | "He" |
| 53 | 00:00-00:02.8 | 8:40.0-8:42.8 | Narrator | "told her everything, from beginning to end." |
| 53 | 00:03.8-00:10 | 8:43.8-8:50.0 | Narrator | "Snow Leopard Queen listened with her ears turned forward, and her stern eyes slowly softened." |
| 54 | 00:01.2-00:06.5 | 8:51.2-8:56.5 | Narrator | "At the foot of the throne, Tashi Marmot shrank into his crimson vest, ashamed." |
| 54 | 00:07.4-00:09.9 | 8:57.4-8:59.9 | Narrator | "The sun came back through the lattice windows." |
| 55 | 00:00.6-00:03.3 | 9:00.6-9:03.3 | Narrator | "The Queen sat back with a kind smile." |
| 55 | 00:04.4-00:05.7 | 9:04.4-9:05.7 | Snow Leopard Queen | "You are forgiven." |
| 55 | 00:06.5-00:09.8 | 9:06.5-9:09.8 | Narrator | "Papa Yeti let out a long, relieved breath." |
| 56 | 00:00.6-00:07.7 | 9:10.6-9:17.7 | Narrator | "At sunset, the lantern by the cottage door was glowing when Papa Yeti came home along the golden lane." |
| 56 | 00:08.8-00:10 | 9:18.8-9:20.0 | Narrator | "Babu Yeti ran and" |
| 57 | 00:00-00:01 | 9:20.0-9:21.0 | Narrator | "hugged his leg." |
| 57 | 00:02.1-00:03.4 | 9:22.1-9:23.4 | Babu Yeti | "Papa's home!" |
| 57 | 00:04.1-00:10 | 9:24.1-9:30.0 | Narrator | "At the carved gate next door stood Tashi Marmot, all" |
| 58 | 00:00-00:04.2 | 9:30.0-9:34.2 | Narrator | "alone, his ears flat and his paws clasped." |
| 58 | 00:05-00:07.2 | 9:35.0-9:37.2 | Narrator | "In a small voice he said," |
| 58 | 00:08.3-00:10 | 9:38.3-9:40.0 | Tashi Marmot | "I'm sorry I was jealous." |
| 59 | 00:00.6-00:04.7 | 9:40.6-9:44.7 | Narrator | "Papa Yeti turned and held out his open hand." |
| 59 | 00:05.9-00:08.3 | 9:45.9-9:48.3 | Papa Yeti | "Come, Tashi. Share our supper." |
| 59 | 00:08.9-00:10 | 9:48.9-9:50.0 | Narrator | "Tashi Marmot" |
| 60 | 00:00-00:10 | 9:50.0-10:00.0 | Narrator | "stepped out through his gate and put his small paw in Papa Yeti's big hand, and together they walked to the" |
| 61 | 00:00-00:00.8 | 10:00.0-10:00.8 | Narrator | "porch." |
| 61 | 00:01.9-00:10 | 10:01.9-10:10.0 | Narrator | "Mama Yeti set out a steaming pot of rice and a stack of wooden bowls with her warmest" |
| 62 | 00:00-00:05.6 | 10:10.0-10:15.6 | Narrator | "smile, and Babu Yeti handed Tashi Marmot a full bowl of his own." |
| 62 | 00:06.5-00:10 | 10:16.5-10:20.0 | Narrator | "The family sat together on the porch steps as" |
| 63 | 00:00-00:05.6 | 10:20.0-10:25.6 | Narrator | "the sun went down and the first stars came out above the snowy peaks." |
| 63 | 00:06.1-00:09.7 | 10:26.1-10:29.7 | Narrator | "And from that day on, they all lived happily." |
| 64 | 00:00.7-00:03.8 | 10:30.7-10:33.8 | Narrator | "An honest heart is the greatest treasure." |

## Clips

Each `Speech:` line is copy-ready for that video's Agent prompt, fixed sentence included.

### Clip 1 - 0:00.0 to 0:10.0

Speech: 00:00.1-00:06, Narrator, off-screen: "Once upon a time, in a mountain village, lived a kind Yeti family." 00:06.7-00:10, Narrator, off-screen, running on into the next clip: "Their little stone-and-timber cottage" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.8, 00:03.7, 00:06.3.

### Clip 2 - 0:10.0 to 0:20.0

Speech: 00:00-00:07.7, Narrator, off-screen, continuing from the last clip: "had a sagging slate roof, a woven bamboo door, and a tiny vegetable patch fenced with sticks." 00:08.4-00:10, Narrator, off-screen, running on into the next clip: "Next door lived" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02, 00:04.1, 00:08.

### Clip 3 - 0:20.0 to 0:30.0

Speech: 00:00-00:02.9, Narrator, off-screen, continuing from the last clip: "Tashi Marmot, clever and very rich." 00:03.5-00:10, Narrator, off-screen, running on into the next clip: "Behind his whitewashed wall stood a grand painted house with a golden finial on its" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.1, 00:03.2, 00:08.4.

### Clip 4 - 0:30.0 to 0:40.0

Speech: 00:00-00:03.9, Narrator, off-screen, continuing from the last clip: "roof and a storehouse heaped with sacks of grain." 00:05.5-00:10, Narrator, off-screen, running on into the next clip: "One bright morning, Tashi Marmot stood by his storehouse, polishing" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:04.7, 00:06.7.

### Clip 5 - 0:40.0 to 0:50.0

Speech: 00:00-00:05.7, Narrator, off-screen, continuing from the last clip: "a big gold coin on his crimson vest and holding it up to shine in the sun." 00:06.3-00:10, Narrator, off-screen, running on into the next clip: "On the porch steps of the little cottage, Papa Yeti" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.3, 00:06, 00:06.7.

### Clip 6 - 0:50.0 to 1:00.0

Speech: 00:00-00:02.2, Narrator, off-screen, continuing from the last clip: "looked into the family's grain sack." 00:02.9-00:04, Narrator, off-screen: "It was nearly empty." 00:04.8-00:10, Narrator, off-screen, running on into the next clip: "Mama Yeti and Babu Yeti sat on the lowest step with their wooden bowls, and" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.6, 00:04.4.

### Clip 7 - 1:00.0 to 1:10.0

Speech: 00:00-00:02.8, Narrator, off-screen, continuing from the last clip: "there were only a few grains of rice in each." 00:03.8-00:07.4, Narrator, off-screen: "Mama Yeti looked across at the grand house and sighed." 00:08.5-00:10, Mama Yeti, off-screen, over a reaction shot, running on into the next clip: "Look how rich Tashi" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.3, 00:06.5, 00:08.

### Clip 8 - 1:10.0 to 1:20.0

Speech: 00:00-00:02.3, Mama Yeti, on screen, continuing from the last clip: "is! Our bowls are nearly empty." 00:03.1-00:07.6, Narrator, off-screen: "Papa Yeti rested a hand on his chest and said softly to himself," 00:08.7-00:10, Papa Yeti, off-screen, over a reaction shot, running on into the next clip: "She's right. I'm" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.7, 00:05.8, 00:08.1.

### Clip 9 - 1:20.0 to 1:30.0

Speech: 00:00-00:01.3, Papa Yeti, on screen, continuing from the last clip: "not so clever." 00:02.4-00:07.1, Narrator, off-screen: "But then he lifted his head, and his eyes grew bright and determined." 00:07.9-00:10, Papa Yeti, on screen, running on into the next clip: "I'll buy wisdom with our two" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.9, 00:04.3, 00:07.5.

### Clip 10 - 1:30.0 to 1:40.0

Speech: 00:00-00:00.5, Papa Yeti, off-screen, over a reaction shot, continuing from the last clip: "coins!" 00:01.5-00:03.7, Mama Yeti, on screen: "Babu, fetch the money box!" 00:04.5-00:07.5, Narrator, off-screen: "said Mama Yeti with a gentle smile." 00:08.2-00:10, Narrator, off-screen, running on into the next clip: "Babu Yeti hurried out through" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:04.1, 00:05.9, 00:07.8.

### Clip 11 - 1:40.0 to 1:50.0

Speech: 00:00-00:05.8, Narrator, off-screen, continuing from the last clip: "the bamboo door with the little carved wooden money box held against his tummy." 00:06.9-00:07.7, Babu Yeti, on screen: "Here, Papa!" 00:08.5-00:10, Narrator, off-screen: "He lifted the lid." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.4, 00:06.3, 00:08.1.

### Clip 12 - 1:50.0 to 2:00.0

Speech: 00:00.7-00:06.3, Narrator, off-screen: "Inside lay exactly two copper coins, all the family had saved." 00:06.9-00:10, Narrator, off-screen, running on into the next clip: "Papa Yeti knelt down, and Babu Yeti" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:04.7, 00:06.6.

### Clip 13 - 2:00.0 to 2:10.0

Speech: 00:00-00:03.6, Narrator, off-screen, continuing from the last clip: "tipped the coins into his big open hand." 00:04.8-00:08.8, Narrator, off-screen: "Papa Yeti closed his hand around the coins and stood up tall." 00:09.5-00:10, Narrator, off-screen, running on into the next clip: "Mama Yeti" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.5, 00:04.2, 00:07.5.

### Clip 14 - 2:10.0 to 2:20.0

Speech: 00:00-00:02.3, Narrator, off-screen, continuing from the last clip: "and Babu Yeti waved from the porch." 00:03.1-00:03.9, Babu Yeti, on screen: "Bye, Papa!" 00:04.7-00:05.6, Narrator, off-screen: "called Babu Yeti." 00:06.1-00:09.6, Narrator, off-screen: "And off he went, down the long mountain road." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.7, 00:04.3, 00:05.9, 00:07.4.

### Clip 15 - 2:20.0 to 2:30.0

Speech: 00:00.5-00:04.3, Narrator, off-screen: "The road wound up through a sunny pine forest." 00:04.8-00:10, Narrator, off-screen, running on into the next clip: "Under a crooked old pine stood a tiny stall with a striped awning, its" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:04.5.

### Clip 16 - 2:30.0 to 2:40.0

Speech: 00:00-00:05.8, Narrator, off-screen, continuing from the last clip: "counter covered in shiny trinkets, pebbles, buttons, and bits of coloured glass." 00:06.8-00:10, Narrator, off-screen, running on into the next clip: "No one seemed to be there, until Blue Magpie hopped" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:06.3, 00:08.5.

### Clip 17 - 2:40.0 to 2:50.0

Speech: 00:00-00:02.8, Narrator, off-screen, continuing from the last clip: "up onto the counter and cocked its head." 00:03.8-00:06.2, Narrator, off-screen: "Papa Yeti held out one copper coin." 00:07.3-00:10, Papa Yeti, on screen: "Please, sell me some wisdom." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.3, 00:06.8, 00:08.1.

### Clip 18 - 2:50.0 to 3:00.0

Speech: 00:00.9-00:04.6, Narrator, off-screen: "Blue Magpie eyed the coin and narrowed its eyes." 00:05.3-00:07.7, Narrator, off-screen: "Blue Magpie thought, I'll trick him!" 00:08.4-00:10, Narrator, off-screen, running on into the next clip: "It fluffed its feathers," Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:04.9, 00:06.5, 00:08.1.

### Clip 19 - 3:00.0 to 3:10.0

Speech: 00:00-00:05.5, Narrator, off-screen, continuing from the last clip: "put on its grandest, most serious face, and raised one wing like a teacher." 00:06.6-00:10, Blue Magpie, on screen, running on into the next clip: "Always do what respectable folk tell" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.2, 00:06.1.

### Clip 20 - 3:10.0 to 3:20.0

Speech: 00:00-00:00.4, Blue Magpie, off-screen, over a reaction shot, continuing from the last clip: "you." 00:01.2-00:06.8, Narrator, off-screen: "Blue Magpie plucked the coin from Papa Yeti's hand and tucked it under its wing." 00:07.7-00:10, Narrator, off-screen, running on into the next clip: "Papa Yeti pressed a hand to his" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:05.1, 00:07.3.

### Clip 21 - 3:20.0 to 3:30.0

Speech: 00:00-00:01.4, Narrator, off-screen, continuing from the last clip: "chest and beamed." 00:02.5-00:04.3, Papa Yeti, on screen: "Thank you! I'll remember that." 00:05.6-00:08.2, Narrator, off-screen: "Then he walked on with a jaunty stride." 00:08.8-00:10, Narrator, off-screen, running on into the next clip: "He walked a" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.9, 00:03.1, 00:05, 00:08.5.

### Clip 22 - 3:30.0 to 3:40.0

Speech: 00:00-00:01.1, Narrator, off-screen, continuing from the last clip: "long, long way." 00:02.1-00:10, Narrator, off-screen, running on into the next clip: "At last the stony track climbed to a high, windswept mountain pass, where faded cloth flags snapped" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.6, 00:08.3.

### Clip 23 - 3:40.0 to 3:50.0

Speech: 00:00-00:05.5, Narrator, off-screen, continuing from the last clip: "in the wind and a copper kettle steamed on a little clay stove." 00:06.4-00:10, Narrator, off-screen, running on into the next clip: "There, behind the counter of a small stone" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.8, 00:05.9, 00:07.

### Clip 24 - 3:50.0 to 4:00.0

Speech: 00:00-00:07.8, Narrator, off-screen, continuing from the last clip: "tea stall, stood Dolma Yak, an old yak with long shaggy hair and kind, half-closed eyes." 00:08.6-00:10, Narrator, off-screen, running on into the next clip: "Tired but steady," Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.2, 00:05.5, 00:08.2.

### Clip 25 - 4:00.0 to 4:10.0

Speech: 00:00-00:03.5, Narrator, off-screen, continuing from the last clip: "Papa Yeti held out his very last coin." 00:04.5-00:06.9, Papa Yeti, on screen: "My last coin, for wisdom?" 00:07.9-00:10, Narrator, off-screen, running on into the next clip: "Dolma Yak nodded slowly and" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:04, 00:05.9, 00:07.4.

### Clip 26 - 4:10.0 to 4:20.0

Speech: 00:00-00:02.6, Narrator, off-screen, continuing from the last clip: "nudged a cup of hot tea toward him." 00:03.7-00:07.1, Dolma Yak, on screen: "Always tell the Queen the truth." 00:08-00:10, Narrator, off-screen, running on into the next clip: "Papa Yeti smiled gently" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.1, 00:07.5.

### Clip 27 - 4:20.0 to 4:30.0

Speech: 00:00-00:02.8, Narrator, off-screen, continuing from the last clip: "and rested a hand on his chest." 00:03.5-00:05.3, Narrator, off-screen: "He would remember that, too." 00:06.8-00:10, Narrator, off-screen, running on into the next clip: "Further on, Papa Yeti found three" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.2, 00:06.1, 00:07.9.

### Clip 28 - 4:30.0 to 4:40.0

Speech: 00:00-00:01.3, Narrator, off-screen, continuing from the last clip: "grand peacocks." 00:01.8-00:10, Narrator, off-screen, running on into the next clip: "They stood at a meadow crossroads beside a little wooden handcart, around a long, lumpy bundle wrapped in white cloth" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.6, 00:06.3.

### Clip 29 - 4:40.0 to 4:50.0

Speech: 00:00-00:02.5, Narrator, off-screen, continuing from the last clip: "with an old string knotted around it." 00:03.2-00:08.2, Narrator, off-screen: "Each Grand Peacock turned its beak away and fanned the air with one wing." 00:09.3-00:10, Grand Peacock, off-screen, over a reaction shot, running on into the next clip: "Phew! What" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.9.

### Clip 30 - 4:50.0 to 5:00.0

Speech: 00:00-00:01.8, Grand Peacock, on screen, continuing from the last clip: "a smelly old bundle!" 00:02.5-00:03.5, Narrator, off-screen: "said the middle one." 00:04.1-00:10, Narrator, off-screen, running on into the next clip: "The Grand Peacock pointed a wing at the bundle and looked down its beak at Papa" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.2, 00:03.8, 00:07.6.

### Clip 31 - 5:00.0 to 5:10.0

Speech: 00:00-00:00.4, Narrator, off-screen, continuing from the last clip: "Yeti." 00:01.1-00:03.5, Grand Peacock, on screen: "Bury it, and take these coins!" 00:04.1-00:07.8, Narrator, off-screen: "And it tipped three small silver coins into his hand." 00:08.5-00:10, Narrator, off-screen, running on into the next clip: "Papa remembered the" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.8, 00:08.2.

### Clip 32 - 5:10.0 to 5:20.0

Speech: 00:00-00:00.9, Narrator, off-screen, continuing from the last clip: "magpie's wisdom." 00:01.8-00:05.2, Narrator, off-screen: "These were very grand, important-looking folk." 00:06.2-00:07.6, Papa Yeti, on screen: "Yes, of course!" 00:08.6-00:10, Narrator, off-screen, running on into the next clip: "he said brightly, and" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.3, 00:05.7, 00:08.1.

### Clip 33 - 5:20.0 to 5:30.0

Speech: 00:00-00:03.5, Narrator, off-screen, continuing from the last clip: "he lifted the wooden spade from beside the handcart." 00:04.3-00:10, Narrator, off-screen, running on into the next clip: "The Grand Peacocks strutted away down the road with their noses in the air and never" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.9.

### Clip 34 - 5:30.0 to 5:40.0

Speech: 00:00-00:01, Narrator, off-screen, continuing from the last clip: "looked back." 00:01.4-00:10, Narrator, off-screen, running on into the next clip: "Papa Yeti dug and dug, tossing dark earth onto a growing heap, until a deep, neat pit lay open in" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.2, 00:01.8, 00:04.

### Clip 35 - 5:40.0 to 5:50.0

Speech: 00:00-00:01.4, Narrator, off-screen, continuing from the last clip: "the meadow grass." 00:01.9-00:06.4, Narrator, off-screen: "Then he leaned on his spade and let out a big, happy breath." 00:07.1-00:09.8, Narrator, off-screen: "He bent down and lifted the bundle." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.6, 00:06.8, 00:07.4, 00:08.6.

### Clip 36 - 5:50.0 to 6:00.0

Speech: 00:00.4-00:02.1, Narrator, off-screen: "It was surprisingly heavy." 00:03.1-00:10, Narrator, off-screen, running on into the next clip: "As he held it against his chest, the old string slipped loose and the white cloth fell" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.6, 00:05, 00:07.3.

### Clip 37 - 6:00.0 to 6:10.0

Speech: 00:00-00:00.6, Narrator, off-screen, continuing from the last clip: "open." 00:00.9-00:06.4, Narrator, off-screen: "Inside were sparkling jewels, gold necklaces, and piles of gold coins." 00:07.1-00:08.6, Narrator, off-screen: "But it wasn't rubbish at all." 00:08.9-00:10, Narrator, off-screen, running on into the next clip: "It was treasure!" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:06.8.

### Clip 38 - 6:10.0 to 6:20.0

Speech: 00:00.7-00:02.8, Papa Yeti, on screen: "Jewels and gold!" 00:03.8-00:09, Narrator, off-screen: "gasped Papa Yeti, and his face broke into the biggest smile." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.3, 00:05.5, 00:07.7.

### Clip 39 - 6:20.0 to 6:30.0

Speech: 00:00.6-00:03.8, Narrator, off-screen: "Papa Yeti carried the treasure all the way home." 00:04.7-00:10, Narrator, off-screen, running on into the next clip: "In the late-afternoon sun he set the bundle down on the porch step, and gold" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:04.2, 00:08.7.

### Clip 40 - 6:30.0 to 6:40.0

Speech: 00:00-00:02.9, Narrator, off-screen, continuing from the last clip: "and jewels spilled across the worn wood." 00:04.2-00:06.6, Narrator, off-screen: "Mama Yeti pressed her hands to her chest." 00:07.5-00:10, Mama Yeti, on screen: "Oh, Papa! How wonderful!" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.5, 00:07.

### Clip 41 - 6:40.0 to 6:50.0

Speech: 00:01.4-00:08.2, Narrator, off-screen: "Babu Yeti lifted out a sparkling gold necklace and held it up with shining eyes." 00:09.2-00:10, Babu Yeti, on screen, running on into the next clip: "It" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:05.6.

### Clip 42 - 6:50.0 to 7:00.0

Speech: 00:00-00:00.7, Babu Yeti, off-screen, over a reaction shot, continuing from the last clip: "sparkles!" 00:01.5-00:09.1, Narrator, off-screen: "Mama Yeti was so happy that she leaned over the stick fence and waved down the lane to the neighbours." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:04, 00:06.5.

### Clip 43 - 7:00.0 to 7:10.0

Speech: 00:00.2-00:03.1, Mama Yeti, on screen: "Papa found a treasure! Come and see!" 00:04.1-00:10, Narrator, off-screen: "Three Woolly Hares came hopping along, their ears straight up and their noses twitching." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.1, 00:03.6, 00:06.8, 00:08.5.

### Clip 44 - 7:10.0 to 7:20.0

Speech: 00:01.1-00:06.8, Narrator, off-screen: "But next door, Tashi Marmot peeked over his whitewashed wall and scowled." 00:07.9-00:10, Narrator, off-screen, running on into the next clip: "Tashi Marmot grew terribly jealous." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.2, 00:07.3.

### Clip 45 - 7:20.0 to 7:30.0

Speech: 00:00.9-00:02.1, Narrator, off-screen: "He dropped down out of sight." 00:03.2-00:05.8, Narrator, off-screen: "Tashi Marmot hurried straight to the palace." 00:06.6-00:10, Narrator, off-screen, running on into the next clip: "While Papa Yeti sat on his porch, happily stacking" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.7, 00:06.2.

### Clip 46 - 7:30.0 to 7:40.0

Speech: 00:00-00:08.3, Narrator, off-screen, continuing from the last clip: "gold coins into neat little piles, Tashi Marmot bowed low before Snow Leopard Queen in her grand hall of red pillars." 00:09.4-00:10, Tashi Marmot, off-screen, over a reaction shot, running on into the next clip: "My neighbour" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.2, 00:06.

### Clip 47 - 7:40.0 to 7:50.0

Speech: 00:00-00:01.7, Tashi Marmot, on screen, continuing from the last clip: "took your treasure!" 00:02.3-00:08.2, Narrator, off-screen: "The Queen narrowed her pale green eyes and raised one paw." 00:09.3-00:10, Snow Leopard Queen, on screen, running on into the next clip: "Bring him" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02, 00:06.3.

### Clip 48 - 7:50.0 to 8:00.0

Speech: 00:00-00:00.4, Snow Leopard Queen, off-screen, over a reaction shot, continuing from the last clip: "here!" 00:01.3-00:10, Narrator, off-screen, running on into the next clip: "Back at the cottage, three firm knocks sounded on the bamboo door, and Papa Yeti looked up from his coins, worried." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.8, 00:06.6.

### Clip 49 - 8:00.0 to 8:10.0

Speech: 00:01.3-00:08.8, Narrator, off-screen: "Papa Yeti walked slowly along the long red runner of the palace hall, his hands held together at his chest." 00:09.4-00:10, Narrator, off-screen, running on into the next clip: "A cloud" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): none.

### Clip 50 - 8:10.0 to 8:20.0

Speech: 00:00-00:03.2, Narrator, off-screen, continuing from the last clip: "passed over the sun, and the hall grew dim." 00:04.1-00:07.2, Narrator, off-screen: "Snow Leopard Queen leaned forward on her throne." 00:07.8-00:09.9, Snow Leopard Queen, on screen: "Did you take my treasure?" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:03.6, 00:07.5.

### Clip 51 - 8:20.0 to 8:30.0

Speech: 00:00.8-00:02.6, Narrator, off-screen: "Papa Yeti was afraid." 00:03.3-00:06, Narrator, off-screen: "Then Papa remembered the yak's wisdom." 00:06.9-00:10, Narrator, off-screen, running on into the next clip: "He lifted his chin, put a hand on his chest," Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.9, 00:06.4, 00:08.2.

### Clip 52 - 8:30.0 to 8:40.0

Speech: 00:00-00:01.6, Narrator, off-screen, continuing from the last clip: "and spoke clearly." 00:02.5-00:04.6, Papa Yeti, on screen: "I'll tell you the whole truth." 00:05.1-00:06.1, Narrator, off-screen: "Papa Yeti said," 00:06.8-00:09.1, Papa Yeti, on screen: "I only did what the peacocks asked." 00:09.8-00:10, Narrator, off-screen, running on into the next clip: "He" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02, 00:04.8, 00:06.4.

### Clip 53 - 8:40.0 to 8:50.0

Speech: 00:00-00:02.8, Narrator, off-screen, continuing from the last clip: "told her everything, from beginning to end." 00:03.8-00:10, Narrator, off-screen, running on into the next clip: "Snow Leopard Queen listened with her ears turned forward, and her stern eyes slowly softened." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.3, 00:03.3, 00:07.3.

### Clip 54 - 8:50.0 to 9:00.0

Speech: 00:01.2-00:06.5, Narrator, off-screen: "At the foot of the throne, Tashi Marmot shrank into his crimson vest, ashamed." 00:07.4-00:09.9, Narrator, off-screen: "The sun came back through the lattice windows." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:05.7, 00:06.9.

### Clip 55 - 9:00.0 to 9:10.0

Speech: 00:00.6-00:03.3, Narrator, off-screen: "The Queen sat back with a kind smile." 00:04.4-00:05.7, Snow Leopard Queen, on screen: "You are forgiven." 00:06.5-00:09.8, Narrator, off-screen: "Papa Yeti let out a long, relieved breath." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02, 00:03.8, 00:06.1.

### Clip 56 - 9:10.0 to 9:20.0

Speech: 00:00.6-00:07.7, Narrator, off-screen: "At sunset, the lantern by the cottage door was glowing when Papa Yeti came home along the golden lane." 00:08.8-00:10, Narrator, off-screen, running on into the next clip: "Babu Yeti ran and" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.5, 00:04.6, 00:08.3.

### Clip 57 - 9:20.0 to 9:30.0

Speech: 00:00-00:01, Narrator, off-screen, continuing from the last clip: "hugged his leg." 00:02.1-00:03.4, Babu Yeti, on screen: "Papa's home!" 00:04.1-00:10, Narrator, off-screen, running on into the next clip: "At the carved gate next door stood Tashi Marmot, all" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:01.6, 00:03.7, 00:06.7.

### Clip 58 - 9:30.0 to 9:40.0

Speech: 00:00-00:04.2, Narrator, off-screen, continuing from the last clip: "alone, his ears flat and his paws clasped." 00:05-00:07.2, Narrator, off-screen: "In a small voice he said," 00:08.3-00:10, Tashi Marmot, on screen: "I'm sorry I was jealous." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.4, 00:04.6, 00:06.6, 00:07.7.

### Clip 59 - 9:40.0 to 9:50.0

Speech: 00:00.6-00:04.7, Narrator, off-screen: "Papa Yeti turned and held out his open hand." 00:05.9-00:08.3, Papa Yeti, on screen: "Come, Tashi. Share our supper." 00:08.9-00:10, Narrator, off-screen, running on into the next clip: "Tashi Marmot" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02.4, 00:05.3, 00:07.1, 00:08.6.

### Clip 60 - 9:50.0 to 10:00.0

Speech: 00:00-00:10, Narrator, off-screen, continuing from the last clip, running on into the next clip: "stepped out through his gate and put his small paw in Papa Yeti's big hand, and together they walked to the" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:07.6.

### Clip 61 - 10:00.0 to 10:10.0

Speech: 00:00-00:00.8, Narrator, off-screen, continuing from the last clip: "porch." 00:01.9-00:10, Narrator, off-screen, running on into the next clip: "Mama Yeti set out a steaming pot of rice and a stack of wooden bowls with her warmest" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): none.

### Clip 62 - 10:10.0 to 10:20.0

Speech: 00:00-00:05.6, Narrator, off-screen, continuing from the last clip: "smile, and Babu Yeti handed Tashi Marmot a full bowl of his own." 00:06.5-00:10, Narrator, off-screen, running on into the next clip: "The family sat together on the porch steps as" Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02, 00:06.

### Clip 63 - 10:20.0 to 10:30.0

Speech: 00:00-00:05.6, Narrator, off-screen, continuing from the last clip: "the sun went down and the first stars came out above the snowy peaks." 00:06.1-00:09.7, Narrator, off-screen: "And from that day on, they all lived happily." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:05.8, 00:07.8.

### Clip 64 - 10:30.0 to 10:34.0

Speech: 00:00.7-00:03.8, Narrator, off-screen: "An honest heart is the greatest treasure." Each line is spoken once, exactly as written and at exactly these times, in English, one voice at a time; only the speaking character's mouth moves, in time with the words, and every other mouth stays closed.

Cut points (pauses): 00:02. Speech ends at 00:03.8; the clip is trimmed at 00:04.
