# Twinkle, Twinkle, Little Star 50s Storyboard (16:9)

Babu Yeti discovers a silver star above the snowy mountains, watches its light guide Old Herb-Gatherer along a peaceful trail, and sees it through his bedroom curtains until sunrise. The final stanza recalls the earlier night, closing with the family together at the window. Five 10-second Google Flow videos use the user's five stanzas unchanged, with a newly generated off-screen AI child singer. Flow generates the music, vocals, and video together; the visible cast acts silently with no lip-sync.

The workflow contains three Agent cards, a plate setup prompt, an Image map, five self-contained video prompts, and one 16:9 cover prompt. Saved Characters carry all video character designs. Clip model and resolution settings follow the existing project configuration.

## Song and lyric plan

### Source and arrangement analysis

| Attribute | Basis / plan |
| --- | --- |
| Lyrics | The user's exact 20 lines, five four-line stanzas; no corrections or substitutions |
| Audio reference | None supplied for this revision; no recording listened to or measured |
| Meter and tempo | Proposed compact 4/4 arrangement at 96 BPM; not a measured reference tempo |
| Timing | Four 4/4 bars per clip, one bar per line; 16 pulses × 60 / 96 = 10 seconds |
| Phrasing | Mostly seven syllables per line; light eighth-note movement and held line endings; no swallowed words |
| Key / register | C major; child treble in a comfortable C4–C5 range |
| Vocal | Newly generated solo AI child's treble, clear diction, light articulation, restrained vibrato; same voice throughout |
| Instruments | Felt piano, nylon-string guitar, delicate glockenspiel |
| Mood / arc | Wonder, dusk, gratitude, bedtime into sunrise, remembered nighttime warmth |
| Stanza handling | Five stanzas intact; no splits, added repeats, new words, or filler lyrics |
| Duration target | Five 10.0-second clips = 50.0 seconds; vocals start at 00:00 and finish by 00:50 |

The one-bar-per-line arrangement is a compact rendition; the 2.5-second windows and audio continuity are generation targets to check by listening. The supplied wording “When he nothing shines upon,” stays exactly as written. Visual story names do not change the sung words. Keep the same simple four-phrase melody in all stanzas; create a new child vocal rendition without copying a specific recording or singer.

### Supplied lyrics — verbatim

```text
Twinkle, twinkle, little star,
How I wonder what you are!
Up above the world so high,
Like a diamond in the sky.

When the blazing sun is gone,
When he nothing shines upon,
Then you show your little light,
Twinkle, twinkle, all the night.

Then the traveler in the dark
Thanks you for your tiny spark,
How could he see where to go,
If you did not twinkle so?

In the dark blue sky you keep,
Often through my curtains peep
For you never shut your eye,
Till the sun is in the sky.

As your bright and tiny spark
Lights the traveler in the dark,
Though I know not what you are,
Twinkle, twinkle, little star.
```

### Sync map

Every line starts on a local bar boundary. Its window ends at the next line's start, or at 00:10 for line four. Film times in parentheses give the matching starts in the complete film.

| Video | Film time | Supplied stanza | Exact lines and local starts (film starts) |
| --- | --- | --- | --- |
| Video 1 | 00:00–00:10 | Stanza 1 | **00:00** (00:00) Twinkle, twinkle, little star,<br>**00:02.5** (00:02.5) How I wonder what you are!<br>**00:05** (00:05) Up above the world so high,<br>**00:07.5** (00:07.5) Like a diamond in the sky. |
| Video 2 | 00:10–00:20 | Stanza 2 | **00:00** (00:10) When the blazing sun is gone,<br>**00:02.5** (00:12.5) When he nothing shines upon,<br>**00:05** (00:15) Then you show your little light,<br>**00:07.5** (00:17.5) Twinkle, twinkle, all the night. |
| Video 3 | 00:20–00:30 | Stanza 3 | **00:00** (00:20) Then the traveler in the dark<br>**00:02.5** (00:22.5) Thanks you for your tiny spark,<br>**00:05** (00:25) How could he see where to go,<br>**00:07.5** (00:27.5) If you did not twinkle so? |
| Video 4 | 00:30–00:40 | Stanza 4 | **00:00** (00:30) In the dark blue sky you keep,<br>**00:02.5** (00:32.5) Often through my curtains peep<br>**00:05** (00:35) For you never shut your eye,<br>**00:07.5** (00:37.5) Till the sun is in the sky. |
| Video 5 | 00:40–00:50 | Stanza 5 | **00:00** (00:40) As your bright and tiny spark<br>**00:02.5** (00:42.5) Lights the traveler in the dark,<br>**00:05** (00:45) Though I know not what you are,<br>**00:07.5** (00:47.5) Twinkle, twinkle, little star. |

### Flow audio continuity and review

Generate Video 1 first and review its exact words, four-phrase melody, child voice, and diction before generating the remaining takes. Use that approved rendition as the musical target for later clips, with the same explicit sound directions in each prompt. Use only continuity/reference controls actually available in the current Flow interface; the prompts do not guarantee automatic voice locking or exact timing. Review every join for a voice change, restarted intro, unwanted pause, or clipped syllable. Request a corrected Flow take when needed. Assemble approved clips in Flow in order with their generated audio intact; no separate music service or external audio-overlay step is required.

---

## Google Flow Agent instructions

### Instruction 1 - Yeti family series

Reference: None

```text
This project makes one original 3D animated short film about a family of three Yetis. Every video is made with Gemini Omni 1.2 Flash, selected as "Omni 1.2 Flash" in the model menu, never Omni 1.1 Flash. Every video is horizontal 16:9 and exactly 10 seconds long, never 15 seconds, with music, sound effects, and off-screen AI children's singing; no spoken dialogue. Generate every video at 720p, never 360p, unless I ask for a 360p draft.

The Yetis are the saved Characters @Papa Yeti, @Mama Yeti, and @Babu Yeti. Use only the ones my prompt names, and draw each exactly as its saved Character. Never redesign, recolour, or restyle them, and never add another Yeti, a duplicate, or anyone my prompt does not name. Their sizes never change: whenever Babu Yeti stands with a grown-up, the top of his curl reaches only the grown-up's belly, and he is never placed nearer the camera than a grown-up beside him.

Every Yeti hand has five separate fingers, never three or four, and no claws. Every Yeti back is thick fur from shoulders to knees with no tail. Nothing is ever on a Yeti's head but its own tuft, and they wear nothing.

Style: stylized 3D CGI with ultra-realistic soft fur strands and cinematic light with a soft rim on the fur. No on-screen text, captions, logos, borders, or split screens.
```

### Instruction 2 - Twinkle, Twinkle, Little Star story

Reference: `Plate - Snowy Pine Ridge`

```text
Film: Twinkle, Twinkle, Little Star, five 10-second videos using the five supplied stanzas verbatim. Google Flow generates the music, child vocals, and video together. Off-screen AI solo child treble; 4/4, 96 BPM, C major, C4–C5; felt piano, nylon-string guitar, glockenspiel. Maintain the same child voice and four-phrase melody. Visible cast acts silently with still mouths, no lip-sync or spoken dialogue.

Babu Yeti leads all videos. Mama Yeti joins Videos 2, 4, and 5; Papa Yeti joins Video 5. Old Herb-Gatherer is the traveler in Videos 3 and 5, using his saved Character.

Video 1 opens on Plate - Snowy Pine Ridge at twilight; Video 2 on End frame V1, matching the held star before night deepens at a cut. Video 3 opens on Plate - Snowy Forest Trail as a location break, with Plate - Snowy Pine Ridge for Babu Yeti's overlook shots. Video 4 opens on Plate - Cozy Bedroom Cave as a location break; its last shot jumps to morning at a hard cut. Video 5 opens on Plate - Snowy Forest Trail as a recap of the earlier night, with Plate - Cozy Bedroom Cave for its last two shots.

Silver sky light and snow fill guide the trail; bedroom starlight and hearth fill give way to sunrise in Video 4. Keep the star celestial, without eyes or a face. Props: unlit reed lantern, low crib, fleece, quilt, linen curtains. Preserve every supplied word.
```

### Instruction 3 - Clip rules

Reference: None

```text
This film is 5 videos, generated one at a time and in order. Generate each as one 10-second Omni 1.2 Flash video, horizontal 16:9, 720p. Keep its shots, cuts, local timestamps, camera moves, faces, light, and audio as written. Never extend, split, or rewrite a clip without asking.

Link each @ name once from its Cast line. Plain-name mentions are that same saved Character. Each In frame list permits only those characters, each once in one body. Use only named images; images plus linked Characters must be at most 7. If more, report the count and stop without dropping a reference.

Open on the named image. End-frame openings match the held positions, faces, and light; a scene break opens on its named plate. Save each approved last clean held frame as End frame V<number>; report if saving is unavailable.

Generate off-screen AI children's singing and accompaniment with the video. Sing only the delimited lyrics, unchanged and once, in the stated windows. Keep the same child voice, melody, key, tempo, instruments, and mix; no adult vocal or spoken dialogue. Visible mouths stay still, without lip-sync. Check words, diction, duration, audio joins, and visual continuity before approval. Never replace vocals with silence or rewrite lyrics after a refusal; report the issue and propose a correction that preserves them.

Ask before each generation unless already authorized. Name takes V<number> - <title> - take <n>.
```

## Agent setup prompt

```text
Generate one empty location image per location in Google Flow with Nano Banana Pro, horizontal 16:9, named "Plate - Snowy Pine Ridge", "Plate - Snowy Forest Trail", and "Plate - Cozy Bedroom Cave". Each plate prompt below begins with its exact name. The ridge plate opens Video 1; the trail plate opens Video 3 and the earlier-night recap in Video 5; the bedroom plate opens Video 4 and guides Video 5's bedroom shots. No video or audio generation yet.
Plate - Snowy Pine Ridge: Horizontal 16:9 aspect ratio, full-frame widescreen composition. 3D animated premium shot, high-quality 3D CGI rendering, ultra-realistic soft fur texture, cinematic lighting, soft warm illumination highlighting individual strands of fur. Environment: A peaceful snowy mountain ridge above a broad level forest trail, snow-dusted Himalayan peaks along the western horizon at frame left, dwarf snow-laden pines at frame right, a low rounded snowbank along the overlook, and an unobstructed sky above the quiet valley. Lighting: Cool twilight sky key, faint rose afterglow below the horizon, fine silver snow reflections, peaceful indigo and rose palette, deep focus. No characters, people, or animals are in this image.
Plate - Snowy Forest Trail: Horizontal 16:9 aspect ratio, full-frame widescreen composition. 3D animated premium shot, high-quality 3D CGI rendering, ultra-realistic soft fur texture, cinematic lighting, soft warm illumination highlighting individual strands of fur. Environment: A broad level snowy forest trail below a mountain overlook, tall snow-laden pines with a clear opening overhead, a gentle bend toward frame left, an uninterrupted packed-snow walking surface, and a solitary silver star above the distant Himalayan peaks. Lighting: Soft silver night-sky key from upper left, gentle blue snow fill, calm indigo palette, deep focus. No characters, people, or animals are in this image.
Plate - Cozy Bedroom Cave: Horizontal 16:9 aspect ratio, full-frame widescreen composition. 3D animated premium shot, high-quality 3D CGI rendering, ultra-realistic soft fur texture, cinematic lighting, soft warm illumination highlighting individual strands of fur. Environment: The inside of a warm rustic stone bedroom cave, a carved wooden low crib bed with thick fleece and a colourful patchwork wool quilt at frame right below an arched stone window, pale linen curtains drawn back, a rough-hewn wooden bedside table with a clay water pitcher at frame left, and a braided wool rug on the stone floor; an adjoining hearth off-screen left supplies warm fill. Lighting: Silver window key from frame right, warm hearth fill from frame left, quiet indigo and honey palette, deep focus. No characters, people, or animals are in this image.
```

## Image map

| Paste | Attach in the prompt box, in this order | Purpose | References (at most 7) |
| --- | --- | --- | --- |
| Instruction 2 card | `Plate - Snowy Pine Ridge` | Card reference | 1 |
| Video 1 - The First Silver Star | `Plate - Snowy Pine Ridge` | Opening image | 1 image + 3 reserved Yeti Characters = 4 |
| Video 2 - Deepening Night | `End frame V1`, no plate | Match held star at opening | 1 image + 3 reserved Yeti Characters = 4 |
| Video 3 - The Guided Traveler | `Plate - Snowy Forest Trail`, then `Plate - Snowy Pine Ridge` | Trail scene break; overlook shots | 2 images + 3 reserved Yeti Characters + 1 story cast Character = 6 |
| Video 4 - Through the Curtains to Sunrise | `Plate - Cozy Bedroom Cave` | Bedroom scene break | 1 image + 3 reserved Yeti Characters = 4 |
| Video 5 - The Star Remembered | `Plate - Snowy Forest Trail`, then `Plate - Cozy Bedroom Cave` | Earlier-night recap; bedroom conclusion | 2 images + 3 reserved Yeti Characters + 1 story cast Character = 6 |

Link Characters from each prompt's Cast line. Never attach a cover, grid, collage, or unlisted reference. These planning counts reserve all three Yeti Character slots in every video, including Yetis not visible in that video. Every video stays within seven references; no story cast member needs to be described-only.

Character assets: Reuse `prompts/characters/old-herb-gatherer-flow-character.md` for Old Herb-Gatherer in Videos 3 and 5. His generated references already exist at `references/characters/old-herb-gatherer-front.png` and `references/characters/old-herb-gatherer-turnaround.png`; the Character file records them as checked and ready to upload, but does not confirm a Flow upload. The lantern is lit in these identity references; keep it unlit in this film as the shot lines specify. Canonical Papa Yeti, Mama Yeti, Babu Yeti portraits and the family height chart are absent from `references/characters/`; reuse the project's saved Yeti Characters. No new Character prompt file is needed. For Old Herb-Gatherer, open Characters in the film's Flow project, create or open the exact name, skip the voice, paste the existing Character info, upload the front image into Portrait and the turnaround into Body, and save. Link each pasted Agent prompt with Flow Character Linker (the **@ Link** pill or Alt+Shift+L); an unmatched name still needs its Character saved in the project. Use `/create-flow-assets prompts/glimmer-glimmer-silver-star-50s-16x9-storyboard.md` for any missing location plates.

---

## Video 1 - The First Silver Star

Images: attach `Plate - Snowy Pine Ridge` (opening image) in the prompt box, nothing else. References: 1 image + 3 reserved Yeti Characters = 4 of 7.

Agent prompt:

```text
Generate Video 1 - The First Silver Star as one 10-second Omni 1.2 Flash video, horizontal 16:9, 720p, exactly as written below. Open on the image Plate - Snowy Pine Ridge.
Horizontal 16:9 video, 720p, 10 seconds, 4 shots joined by hard cuts, cut on the beat of the music. 3D animated premium shot, high-quality 3D CGI rendering, ultra-realistic soft fur texture, cinematic lighting, soft warm illumination highlighting individual strands of fur.
Cast: @Babu Yeti, exactly as their saved Characters. Each shot shows only the characters its In frame list names, each exactly once.
Setting: A peaceful snowy mountain ridge above a broad level forest trail, snow-dusted Himalayan peaks along the western horizon at frame left, dwarf snow-laden pines at frame right, a low rounded snowbank along the overlook, and an unobstructed sky above the quiet valley.
00:00-00:02.5, Wide Shot (snowy ridge and open sky), Eye Level. In frame: no characters, only the ridge and sky. The solitary silver star on the upper left third twinkles above the distant peaks, with the last rose afterglow below it and no visible sun. Slow Pan left across the mountain skyline, ending with the star above the tallest peak. Effects: a tiny natural optical glint at the star. Light: cool twilight sky and faint rose horizon fill, peaceful blue and silver palette, deep focus.
00:02.5-00:05, Close-Up (shoulders to top of head), Eye Level. In frame: Babu Yeti, and no one else. Babu Yeti on the right third looks three-quarters upward toward frame left at the star, off-screen, with a curious face with head tilted and mouth closed in a small pout, no smile; behind him are only still upright pines. Slow Dolly In toward his questioning face. Light: soft twilight sky key from upper left, silver rim on the fur, blue and rose palette, clear air around Babu Yeti, shallow focus.
00:05-00:07.5, POV Wide Shot (valley, peaks, and sky), Low Angle. In frame: no characters, only the mountains and sky. The valley occupies the lower third and the little star sits far above the highest peak on the upper left third, making the height above the world unmistakable. Slow Tilt upward from the peaks to the star. Light: clear indigo sky over the last rose afterglow, quiet silver highlights on snow, deep focus.
00:07.5-00:10, Insert Close-Up (one bright star with dark sky around it), Eye Level. In frame: no characters, only the silver star. The silver point sits on the upper left third with a small diamond-shaped optical glint against the indigo sky, holding that exact position. Static. Effects: delicate natural star scintillation, no sweeping rays. Light: silver star against deep indigo sky, faint rose light at the bottom edge, deep focus, ending on a held frame.
Sound: Generate the accompaniment and off-screen AI children's singing together with this video in Google Flow. Gentle acoustic lullaby in 4/4, exactly 96 BPM, C major, natural solo child treble in a comfortable C4–C5 register, clear English diction, light articulation, soft breath, restrained vibrato; felt piano, nylon-string guitar, and delicate glockenspiel. Keep this same child vocal identity, melody, key, tempo, instruments, and vocal-forward mix across all five clips. Use compact one-bar phrases for each line; no introductory silence, adult backing, or extra vocalizations. Soft mountain air and very low snow rustle; optical star glints are silent.
Vocal timing: line 1 at 00:00–00:02.5; line 2 at 00:02.5–00:05; line 3 at 00:05–00:07.5; line 4 at 00:07.5–00:10. Sing each supplied line exactly once, including its final word within that window. Timing labels are not sung. Start the first note immediately at 00:00. Complete the final word by 00:10 and keep the accompaniment ready for the next stanza. Do not speak or sing headings.
Lyrics to sing verbatim:
Twinkle, twinkle, little star,
How I wonder what you are!
Up above the world so high,
Like a diamond in the sky.
End lyrics.
Performance: The child vocalist is off-screen background audio, never a visible character. Every visible character acts silently with a closed mouth or a still expression, never sings, hums, chants, mouths words, or lip-syncs, and never performs toward the camera. No spoken dialogue or narration.
Avoid: photorealistic humans, scary monsters, horror elements, flat lighting, extra Yetis, and, on any Yeti, human skin, visible pores, sharp teeth, sharp claws, hands with three or four fingers, animal paws, white or grey fur, an ape-like or gorilla-like body, clothing, hats, or accessories, on-screen text, captions, borders, split screens, on-screen singing, lip-syncing, rhythmic mouth movements, adult vocals, added or altered words.
```

---

## Video 2 - Deepening Night

Images: attach `End frame V1` (opening image) in the prompt box, no plate, nothing else. References: 1 image + 3 reserved Yeti Characters = 4 of 7.

Agent prompt:

```text
Generate Video 2 - Deepening Night as one 10-second Omni 1.2 Flash video, horizontal 16:9, 720p, exactly as written below. Open on the image End frame V1.
Horizontal 16:9 video, 720p, 10 seconds, 4 shots joined by hard cuts, cut on the beat of the music. 3D animated premium shot, high-quality 3D CGI rendering, ultra-realistic soft fur texture, cinematic lighting, soft warm illumination highlighting individual strands of fur.
Cast: @Babu Yeti, @Mama Yeti, exactly as their saved Characters. Babu Yeti is a small baby; the top of his curl reaches only to the grown-ups' bellies. Each shot shows only the characters its In frame list names, each exactly once.
Setting: A peaceful snowy mountain ridge above a broad level forest trail, snow-dusted Himalayan peaks along the western horizon at frame left, dwarf snow-laden pines at frame right, a low rounded snowbank along the overlook, and an unobstructed sky above the quiet valley.
00:00-00:02.5, Insert Close-Up (one bright star with dark sky around it), Eye Level. In frame: no characters, only the silver star. Match End frame V1 exactly: the silver point holds the upper left third and its diamond-shaped glint, above the faint rose edge of a horizon whose sun is already gone. Static. Effects: delicate natural star scintillation, no sweeping rays. Light: silver star against deep indigo sky, faint rose light at the bottom edge, deep focus.
00:02.5-00:05, POV Wide Shot (empty valley floor and mountains), Eye Level. In frame: no characters, only the valley and snowy slopes. Cut to the slopes after the remaining afterglow has vanished: the whole valley lies in dark blue shade, with no direct sunlight anywhere. Slow Pan left along the quiet slopes. Light: deep blue night-sky fill, gentle pale snow reflections, hushed indigo palette, deep focus.
00:05-00:07.5, Medium Close-Up (chest up), Eye Level. In frame: Babu Yeti, and no one else. Babu Yeti on the right third raises one five-fingered hand toward the star, off-screen upper left, with a gentle closed-mouth smile with soft eyes; behind him stand only still upright pines. Slow Dolly In toward his hand and face. Light: soft silver sky key from upper frame left, gentle blue snow fill, a fine silver rim on the fur, calm indigo palette, clear air around Babu Yeti, shallow focus.
00:07.5-00:10, Medium Two-Shot (two subjects, waist up), Eye Level. In frame: Babu Yeti and Mama Yeti, and no one else. Babu Yeti on the left third rests his five-fingered hand in Mama Yeti's five-fingered hand on the right third, his curl reaching only to her belly on the same ground; he holds a gentle closed-mouth smile with soft eyes and she a gentle closed-mouth smile with soft, warm eyes while both look up toward frame left. Static. Light: silver night-sky key from upper left, blue snow fill, a fine silver rim on the fur, serene indigo palette, clear air around Babu Yeti and Mama Yeti, shallow focus, ending on a held frame.
Sound: Generate the accompaniment and off-screen AI children's singing together with this video in Google Flow. Gentle acoustic lullaby in 4/4, exactly 96 BPM, C major, natural solo child treble in a comfortable C4–C5 register, clear English diction, light articulation, soft breath, restrained vibrato; felt piano, nylon-string guitar, and delicate glockenspiel. Keep this same child vocal identity, melody, key, tempo, instruments, and vocal-forward mix across all five clips. Use compact one-bar phrases for each line; no introductory silence, adult backing, or extra vocalizations. Low pine breeze and one quiet snow crunch beneath the hand-holding pose; optical star scintillation is silent.
Vocal timing: line 1 at 00:00–00:02.5; line 2 at 00:02.5–00:05; line 3 at 00:05–00:07.5; line 4 at 00:07.5–00:10. Sing each supplied line exactly once, including its final word within that window. Timing labels are not sung. Enter immediately on the next stanza downbeat with no new intro; match the previous approved child voice and arrangement. Complete the final word by 00:10 and keep the accompaniment ready for the next stanza. Do not speak or sing headings.
Lyrics to sing verbatim:
When the blazing sun is gone,
When he nothing shines upon,
Then you show your little light,
Twinkle, twinkle, all the night.
End lyrics.
Performance: The child vocalist is off-screen background audio, never a visible character. Every visible character acts silently with a closed mouth or a still expression, never sings, hums, chants, mouths words, or lip-syncs, and never performs toward the camera. No spoken dialogue or narration.
Avoid: photorealistic humans, scary monsters, horror elements, flat lighting, extra Yetis, and, on any Yeti, human skin, visible pores, sharp teeth, sharp claws, hands with three or four fingers, animal paws, white or grey fur, an ape-like or gorilla-like body, clothing, hats, or accessories, on-screen text, captions, borders, split screens, on-screen singing, lip-syncing, rhythmic mouth movements, adult vocals, added or altered words.
```

---

## Video 3 - The Guided Traveler

Images: attach `Plate - Snowy Forest Trail` (opening image), then `Plate - Snowy Pine Ridge` (location guide) in the prompt box, nothing else. References: 2 images + 3 reserved Yeti Characters + 1 story cast Character = 6 of 7.

Agent prompt:

```text
Generate Video 3 - The Guided Traveler as one 10-second Omni 1.2 Flash video, horizontal 16:9, 720p, exactly as written below. Open on the image Plate - Snowy Forest Trail. Also use the image Plate - Snowy Pine Ridge for the overlook shots.
Horizontal 16:9 video, 720p, 10 seconds, 5 shots joined by hard cuts, cut on the beat of the music. 3D animated premium shot, high-quality 3D CGI rendering, ultra-realistic soft fur texture, cinematic lighting, soft warm illumination highlighting individual strands of fur.
Cast: @Old Herb-Gatherer, @Babu Yeti, exactly as their saved Characters. Each shot shows only the characters its In frame list names, each exactly once.
Setting: A broad level snowy forest trail below a mountain overlook, tall snow-laden pines with a clear opening overhead, a gentle bend toward frame left, an uninterrupted packed-snow walking surface, and a solitary silver star above the distant Himalayan peaks. The overlook is the snowy ridge above this trail: A peaceful snowy mountain ridge above a broad level forest trail, snow-dusted Himalayan peaks along the western horizon at frame left, dwarf snow-laden pines at frame right, a low rounded snowbank along the overlook, and an unobstructed sky above the quiet valley.
00:00-00:02.5, Full Shot (head to feet), Eye Level. In frame: Old Herb-Gatherer, and no one else. On the right third of the level packed-snow trail, Old Herb-Gatherer takes one calm step toward frame left beneath the opening in the pines, his unlit reed lantern carried at his side and the silver star visible high at frame left. Slow Tracking left alongside the traveler. Light: silver starlight from upper left, soft blue snow fill, tranquil night palette, deep focus.
00:02.5-00:03.75, Medium Close-Up (chest up), Low Angle. In frame: Old Herb-Gatherer, and no one else. Old Herb-Gatherer on the right third looks upward toward frame left with a grateful closed-mouth smile, one hand held open at his chest while the unlit lantern remains lowered. Static. Light: soft silver key from upper left, reflected blue snow fill, kind and peaceful, shallow focus.
00:03.75-00:05, Close-Up (shoulders to top of head), Eye Level. In frame: Babu Yeti, and no one else. On the overlook above the trail, Babu Yeti on the left third looks down toward frame right at the grateful traveler, off-screen, with a gentle closed-mouth smile with soft eyes; behind him is a still rounded snowbank. Static. Light: soft silver sky key from upper frame left, gentle blue snow fill, a fine silver rim on the fur, calm indigo palette, clear air around Babu Yeti, shallow focus.
00:05-00:07.5, Insert Wide Shot (empty level trail and its bend), gentle High Angle. In frame: no characters, only the trail. Silver starlight picks out the broad uninterrupted packed-snow curve toward frame left, its pale edge readable against dark pine shadows with no obstacle or crossing. Slow Pan left following the path. Light: soft silver sky key through the pine opening, deep indigo shade at the edges, calm and legible, deep focus.
00:07.5-00:10, Medium Close-Up (chest up), Eye Level. In frame: Babu Yeti, and no one else. Babu Yeti on the left third looks upward toward frame left at the guiding star, off-screen, with a curious face with head tilted and mouth closed in a small pout, no smile; behind him is the same still rounded snowbank. Slow Dolly In that eases to a stop in the final half second. Light: soft silver sky key from upper frame left, gentle blue snow fill, a fine silver rim on the fur, calm indigo palette, clear air around Babu Yeti, shallow focus, ending on a held frame.
Sound: Generate the accompaniment and off-screen AI children's singing together with this video in Google Flow. Gentle acoustic lullaby in 4/4, exactly 96 BPM, C major, natural solo child treble in a comfortable C4–C5 register, clear English diction, light articulation, soft breath, restrained vibrato; felt piano, nylon-string guitar, and delicate glockenspiel. Keep this same child vocal identity, melody, key, tempo, instruments, and vocal-forward mix across all five clips. Use compact one-bar phrases for each line; no introductory silence, adult backing, or extra vocalizations. Low boot crunch on packed snow and a soft creak from the unlit lantern handle; no lantern flame or instrument performed on screen.
Vocal timing: line 1 at 00:00–00:02.5; line 2 at 00:02.5–00:05; line 3 at 00:05–00:07.5; line 4 at 00:07.5–00:10. Sing each supplied line exactly once, including its final word within that window. Timing labels are not sung. Enter immediately on the next stanza downbeat with no new intro; match the previous approved child voice and arrangement. Complete the final word by 00:10 and keep the accompaniment ready for the next stanza. Do not speak or sing headings.
Lyrics to sing verbatim:
Then the traveler in the dark
Thanks you for your tiny spark,
How could he see where to go,
If you did not twinkle so?
End lyrics.
Performance: The child vocalist is off-screen background audio, never a visible character. Every visible character acts silently with a closed mouth or a still expression, never sings, hums, chants, mouths words, or lip-syncs, and never performs toward the camera. No spoken dialogue or narration.
Avoid: photorealistic humans, scary monsters, horror elements, flat lighting, extra Yetis, and, on any Yeti, human skin, visible pores, sharp teeth, sharp claws, hands with three or four fingers, animal paws, white or grey fur, an ape-like or gorilla-like body, clothing, hats, or accessories, on-screen text, captions, borders, split screens, on-screen singing, lip-syncing, rhythmic mouth movements, adult vocals, added or altered words.
```

---

## Video 4 - Through the Curtains to Sunrise

Images: attach `Plate - Cozy Bedroom Cave` (opening image) in the prompt box, nothing else. References: 1 image + 3 reserved Yeti Characters = 4 of 7.

Agent prompt:

```text
Generate Video 4 - Through the Curtains to Sunrise as one 10-second Omni 1.2 Flash video, horizontal 16:9, 720p, exactly as written below. Open on the image Plate - Cozy Bedroom Cave.
Horizontal 16:9 video, 720p, 10 seconds, 4 shots joined by hard cuts, cut on the beat of the music. 3D animated premium shot, high-quality 3D CGI rendering, ultra-realistic soft fur texture, cinematic lighting, soft warm illumination highlighting individual strands of fur.
Cast: @Babu Yeti, @Mama Yeti, exactly as their saved Characters. Babu Yeti is a small baby; the top of his curl reaches only to the grown-ups' bellies. Each shot shows only the characters its In frame list names, each exactly once.
Setting: The inside of a warm rustic stone bedroom cave, a carved wooden low crib bed with thick fleece and a colourful patchwork wool quilt at frame right below an arched stone window, pale linen curtains drawn back, a rough-hewn wooden bedside table with a clay water pitcher at frame left, and a braided wool rug on the stone floor; an adjoining hearth off-screen left supplies warm fill.
00:00-00:02.5, Medium Shot (waist up), Eye Level. In frame: Babu Yeti, and no one else. Babu Yeti on the right third sits upright in the fleece-lined low crib, looking toward the clear dark blue sky and the solitary star visible through the open arched window above the sill, his face holding a gentle closed-mouth smile with soft eyes. Static. Light: silver window key from frame right, warm hearth fill from frame left, a soft amber rim on the fur, indigo and honey palette, clear air around Babu Yeti, shallow focus.
00:02.5-00:05, Insert Close-Up (curtain opening, sill, and star), Eye Level. In frame: no characters, only the arched window and parted curtains. The silver star is framed between the pale linen curtains on the upper right third, their edges remaining still as its tiny reflection rests on the stone sill. Slow Tilt up from the sill to the opening. Effects: faint starlight reflection on the sill. Light: silver window light and soft amber room reflection, quiet indigo and honey palette, deep focus.
00:05-00:07.5, Close-Up (shoulders to top of head), Eye Level. In frame: Babu Yeti, and no one else. Babu Yeti on the right third gazes three-quarters toward upper frame right at the steady star, off-screen, with a curious face with head tilted and mouth closed in a small pout, no smile; only the still stone wall is behind him, and the star remains a natural light without a face. Static. Light: silver window key from frame right, warm hearth fill from frame left, a soft amber rim on the fur, indigo and honey palette, clear air around Babu Yeti, shallow focus.
00:07.5-00:10, Medium Two-Shot (two subjects, waist up), Eye Level. In frame: Babu Yeti and Mama Yeti, and no one else. At this cut it is morning: Babu Yeti on the left third stands beside Mama Yeti on the right third at the low window sill, his curl reaching only to her belly on the same floor, both watching the sun just above the distant ridge while he holds a gentle closed-mouth smile with soft eyes and she a gentle closed-mouth smile with soft, warm eyes. Static. Light: low morning sun through the window from frame right, warm hearth fill, a soft gold rim on the fur, pale gold and blue palette, clear air around Babu Yeti and Mama Yeti, deep focus, ending on a held frame.
Sound: Generate the accompaniment and off-screen AI children's singing together with this video in Google Flow. Gentle acoustic lullaby in 4/4, exactly 96 BPM, C major, natural solo child treble in a comfortable C4–C5 register, clear English diction, light articulation, soft breath, restrained vibrato; felt piano, nylon-string guitar, and delicate glockenspiel. Keep this same child vocal identity, melody, key, tempo, instruments, and vocal-forward mix across all five clips. Use compact one-bar phrases for each line; no introductory silence, adult backing, or extra vocalizations. Low night air outside the window and very soft fleece rustle; the change to morning occurs at a hard cut.
Vocal timing: line 1 at 00:00–00:02.5; line 2 at 00:02.5–00:05; line 3 at 00:05–00:07.5; line 4 at 00:07.5–00:10. Sing each supplied line exactly once, including its final word within that window. Timing labels are not sung. Enter immediately on the next stanza downbeat with no new intro; match the previous approved child voice and arrangement. Complete the final word by 00:10 and keep the accompaniment ready for the next stanza. Do not speak or sing headings.
Lyrics to sing verbatim:
In the dark blue sky you keep,
Often through my curtains peep
For you never shut your eye,
Till the sun is in the sky.
End lyrics.
Performance: The child vocalist is off-screen background audio, never a visible character. Every visible character acts silently with a closed mouth or a still expression, never sings, hums, chants, mouths words, or lip-syncs, and never performs toward the camera. No spoken dialogue or narration.
Avoid: photorealistic humans, scary monsters, horror elements, flat lighting, extra Yetis, and, on any Yeti, human skin, visible pores, sharp teeth, sharp claws, hands with three or four fingers, animal paws, white or grey fur, an ape-like or gorilla-like body, clothing, hats, or accessories, on-screen text, captions, borders, split screens, on-screen singing, lip-syncing, rhythmic mouth movements, adult vocals, added or altered words.
```

---

## Video 5 - The Star Remembered

Images: attach `Plate - Snowy Forest Trail` (opening image), then `Plate - Cozy Bedroom Cave` (location guide) in the prompt box, nothing else. References: 2 images + 3 reserved Yeti Characters + 1 story cast Character = 6 of 7.

Agent prompt:

```text
Generate Video 5 - The Star Remembered as one 10-second Omni 1.2 Flash video, horizontal 16:9, 720p, exactly as written below. Open on the image Plate - Snowy Forest Trail. Also use the image Plate - Cozy Bedroom Cave for the last two bedroom shots.
Horizontal 16:9 video, 720p, 10 seconds, 4 shots joined by hard cuts, cut on the beat of the music. 3D animated premium shot, high-quality 3D CGI rendering, ultra-realistic soft fur texture, cinematic lighting, soft warm illumination highlighting individual strands of fur.
Cast: @Old Herb-Gatherer, @Babu Yeti, @Papa Yeti, @Mama Yeti, exactly as their saved Characters. Babu Yeti is a small baby; the top of his curl reaches only to the grown-ups' bellies. Each shot shows only the characters its In frame list names, each exactly once.
Setting: A broad level snowy forest trail below a mountain overlook, tall snow-laden pines with a clear opening overhead, a gentle bend toward frame left, an uninterrupted packed-snow walking surface, and a solitary silver star above the distant Himalayan peaks. Last two shots: The inside of a warm rustic stone bedroom cave, a carved wooden low crib bed with thick fleece and a colourful patchwork wool quilt at frame right below an arched stone window, pale linen curtains drawn back, a rough-hewn wooden bedside table with a clay water pitcher at frame left, and a braided wool rug on the stone floor; an adjoining hearth off-screen left supplies warm fill.
00:00-00:02.5, Insert Wide Shot (empty path and star above it), Eye Level. In frame: no characters, only the snowy trail and night sky. Return explicitly to the earlier night as a visual recap: the tiny silver star on the upper left third shines above the level packed-snow path curving left through the still pines. Static. Effects: delicate natural star scintillation. Light: silver sky key and reflected blue snow fill, calm indigo palette, deep focus.
00:02.5-00:05, Full Shot (head to feet), Eye Level. In frame: Old Herb-Gatherer, and no one else. Old Herb-Gatherer on the right third follows the clearly lit level path toward frame left with his unlit reed lantern lowered, a grateful closed-mouth smile held as he takes one unhurried step. Slow Tracking left alongside the traveler. Light: silver starlight from upper left, soft blue snow fill, tranquil night palette, deep focus.
00:05-00:07.5, Close-Up (shoulders to top of head), Eye Level. In frame: Babu Yeti, and no one else. Back in the bedroom during that earlier night, Babu Yeti on the right third looks three-quarters toward upper frame right at the star, off-screen, with a curious face with head tilted and mouth closed in a small pout, no smile; behind him is only the still stone wall. Slow Dolly In toward his wondering face. Light: silver window key from frame right, warm hearth fill from frame left, a soft amber rim on the fur, indigo and honey palette, clear air around Babu Yeti, shallow focus.
00:07.5-00:10, Medium Three-Shot (three subjects, waist up), Eye Level. In frame: Papa Yeti, Babu Yeti, and Mama Yeti, and no one else. Papa Yeti on the left third, Babu Yeti in the center, and Mama Yeti on the right third stand together at the low window sill watching the star above the ridge, Babu Yeti's curl reaching only their bellies on the same floor; Babu Yeti holds a gentle closed-mouth smile with soft eyes, Papa Yeti holds a gentle closed-mouth smile with soft, warm eyes, and Mama Yeti holds a gentle closed-mouth smile with soft, warm eyes, each resting a five-fingered hand on the sill. Static. Effects: a tiny natural optical glint at the star outside the window. Light: silver window key from frame right, warm hearth fill from frame left, soft amber rims on the fur, settled indigo and honey palette, clear air around Papa Yeti, Babu Yeti, and Mama Yeti, deep focus, ending on a held frame.
Sound: Generate the accompaniment and off-screen AI children's singing together with this video in Google Flow. Gentle acoustic lullaby in 4/4, exactly 96 BPM, C major, natural solo child treble in a comfortable C4–C5 register, clear English diction, light articulation, soft breath, restrained vibrato; felt piano, nylon-string guitar, and delicate glockenspiel. Keep this same child vocal identity, melody, key, tempo, instruments, and vocal-forward mix across all five clips. Use compact one-bar phrases for each line; no introductory silence, adult backing, or extra vocalizations. Low boot crunch in the trail shot, quiet room air in the bedroom shots; optical star glints are silent.
Vocal timing: line 1 at 00:00–00:02.5; line 2 at 00:02.5–00:05; line 3 at 00:05–00:07.5; line 4 at 00:07.5–00:10. Sing each supplied line exactly once, including its final word within that window. Timing labels are not sung. Enter immediately on the next stanza downbeat with no new intro; match the previous approved child voice and arrangement. Resolve the final star by 00:10 without cutting off its vowel or adding words. Do not speak or sing headings.
Lyrics to sing verbatim:
As your bright and tiny spark
Lights the traveler in the dark,
Though I know not what you are,
Twinkle, twinkle, little star.
End lyrics.
Performance: The child vocalist is off-screen background audio, never a visible character. Every visible character acts silently with a closed mouth or a still expression, never sings, hums, chants, mouths words, or lip-syncs, and never performs toward the camera. No spoken dialogue or narration.
Avoid: photorealistic humans, scary monsters, horror elements, flat lighting, extra Yetis, and, on any Yeti, human skin, visible pores, sharp teeth, sharp claws, hands with three or four fingers, animal paws, white or grey fur, an ape-like or gorilla-like body, clothing, hats, or accessories, on-screen text, captions, borders, split screens, on-screen singing, lip-syncing, rhythmic mouth movements, adult vocals, added or altered words.
```

---

## Cover image

A horizontal 16:9 promotional still capturing the story's tender bedtime climax: Babu Yeti standing on the floor by the low arched stone window between Papa Yeti and Mama Yeti, pointing with wonder toward the brilliant silver star shining over the snowy Himalayan peaks under a vast indigo night sky.

Cover references: Canonical portraits for Papa Yeti, Mama Yeti, and Babu Yeti are currently unavailable in `references/characters/`; generate from the complete inline text locks as the text-only fallback.

Image prompt:

```text
Create image: Horizontal 16:9 aspect ratio, full-frame widescreen composition. A cozy, cinematic family portrait framed inside a warm rustic mountain bedroom cave, looking toward a wide arched stone window that opens onto a vast starry indigo night sky. On the left, Papa Yeti stands close to the window; on the right, Mama Yeti stands beside the low crib; in the center, Babu Yeti stands on the floor with his curl level with the grown-ups' bellies, pointing one five-fingered hand toward a diamond-like silver star above the snowy peaks. The patchwork quilt rests in the low crib.
3D animated premium shot, high-quality 3D CGI rendering, ultra-realistic soft fur texture, cinematic lighting, soft warm illumination highlighting individual strands of fur.
Cast: @Papa Yeti, @Babu Yeti, @Mama Yeti.
Environment: The inside of a warm, rustic stone bedroom cave at night, a carved wooden low crib bed cushioned with thick fleece and a colourful patchwork wool quilt beneath a wide arched stone window, pale undyed linen curtains drawn softly back to frame the starry midnight sky and snowy pine peaks outside, and a soft braided wool rug on the smooth stone floor.
Lighting: Luminous cool silver starlight streaming through the arched stone window from upper frame right, delicate warm amber fill from an adjacent hearth off-screen left, soft golden-silver rim light accentuating individual strands of fur on all three characters, rich indigo and amber-gold palette, peaceful bedtime hush, deep focus.
On the left, Papa Yeti: a stylized, friendly 3D animated grown-up father Yeti rendered in high-quality 3D CGI with ultra-realistic, soft, individually stranded fur, matching his canonical portrait exactly. He is entirely covered in thick, fluffy, vibrant sapphire-blue fur, one solid rich royal sapphire-blue colour from head to toe, with a smooth, slightly matte light periwinkle-blue face and light periwinkle-blue hands and feet that blend naturally into the fur. He has a large, solid, broad-shouldered silhouette, a generous round fluffy belly, long heavy arms that hang to his knees, thick sturdy legs, and oversized rounded feet; he is the largest Yeti in the family, about twice the height of the baby Yeti. His proportionally large, smooth, rounded, fully furred head has a wide, soft face with full rounded cheeks and a broad light-blue muzzle, small rounded light-blue ears that show at the sides of his head, large glossy cartoon eyes with dark pupils, deep-blue irises, and clean white sclera, very dark navy, thick, soft-edged, gently arched eyebrows, and a large, rounded, bulbous nose a shade darker blue than his face. When his mouth is open it shows an even row of clean, square, rounded white teeth with one slightly taller, blunt, rounded corner tooth at each end. His fur is short and tidy on the forehead and face, and thick and full around the cheeks, jaw, chest, shoulders, belly, forearms, and legs, with a full, thick sapphire-blue beard of fur that hangs from his jaw and chin onto his upper chest and comes to a soft point. On top of his head is a tall, playful tuft of messy sapphire-blue fur made of many soft, wavy, unruly locks flaring upward and outward; the tuft is the only thing on his head. His hands are soft, chunky, stylized cartoon hands shaped like human hands, each with a thumb and four short, rounded fingers, five separate fingers on every hand, and his feet are broad, stylized cartoon feet with five short, separate, rounded toes on each foot; no claws, never three or four fingers, never animal paws. He has no tail. He wears nothing but his own fur. Always generate the exact same individual with identical facial identity, facial geometry, age, fur colour, face, hand, and foot shade, tuft, body proportions, and distinguishing features, so he is recognisably the same Papa Yeti in every generation and not a replacement, a relative, an alternate design, or merely a similar blue Yeti; expressions move only his eyebrows, eyelids, cheeks, and mouth, and no expression, pose, lighting, or camera angle alters his face shape, eye spacing, muzzle, nose, proportions, or colour. Do not reinterpret, redesign, replace, merge, beautify, age, de-age, or create an alternate version of this character. Never give him white or grey fur, a white beard or belly, a second fur colour, patches, horns, antlers, spikes, bumps, a hat or headwear, clothing, accessories, sharp or pointed teeth, fangs, claws, merged, missing, or extra fingers or toes, human skin, visible pores, a tail, a slimmer or smaller build, or an ape-like, realistic-animal, or monstrous look, never give him the pink Yeti's side-swept wave tuft or the baby Yeti's single curl, and never feminise or humanise him.
In the center, Babu Yeti: a stylized, friendly 3D animated small baby Yeti rendered in high-quality 3D CGI with ultra-realistic, soft, individually stranded fur, matching his canonical portrait exactly. He is covered in thick, fluffy, vibrant mint-green fur, one solid mint-green colour from head to toe, with a smooth, slightly matte pale mint-green face with a soft rosy blush on the cheeks and pale mint-green hands and feet that blend naturally into the fur. He has a small, soft, rounded baby silhouette with a thick fluffy ruff of fur around his neck, a fluffy round tummy, long heavy arms for his size, short chubby legs, and proportionately large rounded feet; he is about half the height of a grown-up Yeti: when he stands beside one, the top of his head, curl included, reaches only to the grown-up's belly, never to the grown-up's chest or shoulders. His oversized, smooth, rounded, fully furred head is large in proportion to his body to show his youth, with a wide, soft face, full rounded cheeks, and a broad pale-green muzzle, oversized glossy cartoon eyes with dark pupils, blue-grey irises with bright sparkling catchlights, and clean white sclera, dark green-grey, thick, soft-edged, gently arched eyebrows, and a rounded button nose in a soft grey-green slightly darker than his face. When his mouth is open it shows clean, square, rounded white teeth with one slightly taller, blunt, rounded corner tooth at each end. His fur is short and tidy on the forehead and face, and full and rounded around the cheeks, jaw, chest, shoulders, tummy, forearms, and legs, with a fluffy fullness around the lower cheeks and jaw and no beard shape. On top of his head the fur sweeps up into a single curly tuft of mint-green fur, one distinct soft spiral curl; the tuft is the only thing on his head. His hands are soft, chunky, stylized cartoon hands shaped like human hands, each with a thumb and four short, rounded fingers, five separate fingers on every hand, and his feet are broad, stylized cartoon feet with five short, separate, rounded toes on each foot; no claws, never three or four fingers, never animal paws. He has no tail. He wears nothing but his own fur. Always generate the exact same individual with identical facial identity, facial geometry, age, fur colour, face, hand, and foot shade, tuft, body proportions, and distinguishing features, so he is recognisably the same Babu Yeti in every generation and not a replacement, a sibling, an alternate design, a generic baby Yeti, or merely a similar green baby Yeti; expressions move only his eyebrows, eyelids, cheeks, and mouth, and no expression, pose, lighting, or camera angle alters his face shape, eye spacing, muzzle, nose, proportions, size, or colour. Do not reinterpret, redesign, replace, merge, beautify, age, de-age, or create an alternate version of this character. Never give him teal, lime, turquoise, blue, white, or grey fur, a second fur colour, patches, horns, antlers, spikes, bumps, a hat or headwear, clothing, a nappy, accessories, adult proportions, a grown-up size, sharp or pointed teeth, fangs, claws, merged, missing, or extra fingers or toes, human skin, visible pores, a tail, or an ape-like, realistic-animal, or monstrous look, never give him the blue Yeti's messy tuft or the pink Yeti's side-swept wave tuft, and never adultify or humanise him.
On the right, Mama Yeti: a stylized, friendly 3D animated grown-up mother Yeti rendered in high-quality 3D CGI with ultra-realistic, soft, individually stranded fur, matching her canonical portrait exactly. She is covered in thick, fluffy, vibrant bubblegum-pink fur, one solid bubblegum-pink colour from head to toe, with a smooth, slightly matte light-pink face with a soft rosy flush on the cheeks and light-pink hands and feet that blend naturally into the fur. She has a soft, rounded, pear-shaped silhouette with gently sloping shoulders, a big plush round fluffy belly, long heavy arms that hang to her knees with a graceful outward curve, short sturdy legs, and rounded feet; she is a grown-up, about twice the height of the baby Yeti, softer and rounder in shape than the blue Yeti. Her smooth, rounded, fully furred head has a wide, soft face with full rounded cheeks and a broad light-pink muzzle, large glossy cartoon eyes with dark pupils, warm dark-brown irises, clean white sclera, and a neat dark upper lash line along each upper eyelid, dark plum-brown, neat, softly arched eyebrows, and a small round nose a deeper rosy pink than her face. When her mouth is open it shows one even row of clean, square, rounded white teeth. Her fur is short and tidy on the forehead and face, and full and rounded around the cheeks, jaw, chest, shoulders, belly, forearms, and legs, forming a soft cloud-like fullness around the lower cheeks and jaw with no beard shape. On top of her head is a smooth, glossy tuft of bubblegum-pink fur that rises from her forehead and sweeps up and over to one side in a single soft wave with lightly flicked tips; the tuft is the only thing on her head. Her hands are soft, chunky, stylized cartoon hands shaped like human hands, each with a thumb and four short, rounded fingers, five separate fingers on every hand, and her feet are broad, stylized cartoon feet with five short, separate, rounded toes on each foot; no claws, never three or four fingers, never animal paws. She has no tail. She wears nothing but her own fur. Always generate the exact same individual with identical facial identity, facial geometry, age, fur colour, face, hand, and foot shade, tuft, body proportions, and distinguishing features, so she is recognisably the same Mama Yeti in every generation and not a replacement, a relative, an alternate design, or merely a similar pink Yeti; expressions move only her eyebrows, eyelids, cheeks, and mouth, and no expression, pose, lighting, or camera angle alters her face shape, eye spacing, muzzle, nose, proportions, or colour. Do not reinterpret, redesign, replace, merge, beautify, age, de-age, or create an alternate version of this character. Never give her magenta, red, purple, white, or grey fur, a second fur colour, patches, horns, antlers, spikes, bumps, bows, a hat or headwear, long separate eyelashes, eyeshadow, lipstick, or makeup, blue or grey eyes, clothing, accessories, a beard-like jaw, a bulky broad-shouldered build, sharp or pointed teeth, fangs, claws, merged, missing, or extra fingers or toes, human skin, visible pores, a tail, or an ape-like, realistic-animal, or monstrous look, never give her the blue Yeti's messy upward tuft or the baby Yeti's single curl, and never masculinise or humanise her.
Expressions: Papa Yeti, gentle closed-mouth smile with soft, warm eyes; Babu Yeti, cute playful smile; Mama Yeti, gentle closed-mouth smile with soft, warm eyes.
In frame: Papa Yeti, Babu Yeti, and Mama Yeti, and no one else.
Avoid: photorealistic humans, scary monsters, horror elements, flat lighting, extra Yetis, and, on any Yeti, human skin, visible pores, sharp teeth, sharp claws, hands with three or four fingers, animal paws, white or grey fur, an ape-like or gorilla-like body, clothing, hats, or accessories.
Action: In the center of the widescreen composition, Babu Yeti stands on the floor beside Mama Yeti on the right, beside a colourful patchwork wool quilt resting in the low crib, his spiral curl reaching level with Papa Yeti's belly. Babu Yeti points with one five-fingered hand toward the open arched stone window, his cute playful smile radiant with sleepy wonder. On the left, Papa Yeti stands close, resting one large five-fingered hand gently on Mama Yeti's shoulder, looking out toward the night sky with a gentle closed-mouth smile with soft, warm eyes. On the right, Mama Yeti rests one five-fingered hand gently on the low crib rail, gazing out through the window with a gentle closed-mouth smile with soft, warm eyes. Outside the window, framed by soft linen curtains, the brilliant solitary silver star sparkles in the deep navy sky above snow-draped mountain peaks. Each character's face, tuft, and hands remain completely distinct and unmerged.
Effects: Soft diamond-like sparkle glints on the silver star and gentle bokeh dust motes in the starlight beam. No text, title, letters, numbers, logos, captions, signatures, watermarks, borders, or split-screen panels anywhere.
```
