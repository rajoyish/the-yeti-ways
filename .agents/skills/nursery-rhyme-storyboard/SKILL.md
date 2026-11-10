---
name: nursery-rhyme-storyboard
description: >-
  Turn a reference nursery rhyme (its song and its lyrics) into a brand-new
  original song with the same rhythm, tempo, and feel, plus a Yeti storyboard
  synchronized to it: one 10-second Google Flow Agent video prompt per stanza,
  as many videos as the lyrics need, with the song as background music only and
  no character ever singing or lip-syncing. Asks for the reference song and the
  lyrics first if either is missing. Use for "nursery rhyme", "rhyme video",
  "turn this rhyme into a song", "music video storyboard", "Yeti rhyme", or
  /nursery-rhyme-storyboard. Also writes horizontal 16:9 and vertical 9:16
  cover prompts.
---

# Nursery rhyme to song and storyboard

This skill takes a reference nursery rhyme and makes two things that fit together exactly:

1. **An original song.** New melody, new words, same musical bones as the reference: its meter, tempo, phrase lengths, rhyme scheme, and feel, sung by a voice that suits the tone. It is written as a song sheet and one prompt for a text-to-music model.
2. **A synchronized storyboard.** One 10-second Google Flow video per stanza, as many videos as the lyrics need, where each video acts out its own stanza. The Yetis are the leads, and the lyrics decide the rest of the cast. The song is added in the edit as background music. No character on screen ever sings, mouths words, or lip-syncs.

It is built on `storyboard-30s`, and everything in that skill applies here unless this file says otherwise. Read `.agents/skills/storyboard-30s/SKILL.md` in full before writing anything: its "Rules that always apply", "Keeping clear of Flow's filters", step 3 (writing the shots), step 4 (continuity), step 7 (the checks), and its output template are the base of this skill. The sections below list only what this skill adds or changes.

## 0. Check the input first

Before planning anything, check that the user has given both of these:

- **The reference song**: an audio or video file, a link, or at least the rhyme's title plus how it sounds (tempo, feel). A title alone is enough to go on only if the user says so.
- **The full lyrics** of the reference rhyme, every stanza, in order, as the user wants them used.

If either one is missing, stop and ask for it in one short message that names exactly what is missing. Write nothing else until you have it. Never fill in lyrics from memory, even for a famous rhyme: the user's lyrics decide the stanzas, their order, and the story, and versions of the same rhyme differ.

Ask nothing else up front. Use these defaults and state them in the summary at the end:

- Lead Yeti: whoever the lyrics suggest (a child figure is Babu Yeti, a father figure Papa Yeti, a mother figure Mama Yeti).
- Vocals: the voice the tone suggests (step 2).
- No instrumental intro or outro: the vocals start at 00:00 of Video 1, and the song is exactly as long as the film.

## 1. Analyse the reference

Write the analysis into your working notes, and its summary into the `## Original song` section of the file (step 7).

**Lyrics.** Split them into stanzas the way the user wrote them (blank lines). For each stanza, note its number of lines, its syllables and stresses per line, its rhyme scheme, any refrain or repeated line, and what happens in it: who, what, where, and the feeling. Mark refrains and choruses: each sung repeat is its own stanza and its own video.

**Music.** Note the meter (2/4, 4/4, 6/8, 3/4), the tempo in BPM, the bars per stanza, where phrases start (on the downbeat or with a pickup note), the musical style (lullaby, march, bouncy action song, call and response, counting song), the energy curve across the song, and the kind of vocal it uses.

- With an audio or video file, run the helper: `node .agents/skills/nursery-rhyme-storyboard/analyze_reference.mjs <file>`. It uses ffmpeg to print the duration and an estimated tempo with its two strongest alternatives, which are often half or double the main estimate. Choose the tempo that fits the lyrics' stresses, and count the bars per stanza by listening along with the lyrics, or by dividing the duration by the number of stanzas.
- With only a link, a title, or a description, estimate the tempo and meter from the lyrics' stress pattern and the style, and say in the summary that the tempo was estimated, not measured. Never claim you listened to audio you could not open.

## 2. Write the original song

The new song keeps the reference's bones and nothing else that could be recognised.

- **Same rhythm.** Each new stanza has the same number of lines as the reference stanza it replaces, with matching syllable counts (±1) and stresses, the same rhyme scheme, and the same refrain positions. A refrain gets a new refrain of its own, and it repeats where the old one did.
- **Same story, new words.** Each new stanza tells the same event as its reference stanza (step 4), retold with the Yetis and the story cast, in original wording. Keep at most one short stock phrase that belongs to everyone ("one, two, three"), and never copy a full line. Rewrite anything harmful as the safety rules below require: a fall becomes a soft tumble into deep snow, a break becomes a wobble that is caught, and a cradle that falls becomes one that rocks.
- **New melody.** Same meter, tempo, phrase length, and energy as the reference, but a different melodic contour. The music prompt describes the feel, never the reference tune, and never names the reference rhyme, any other song, a composer, an artist, or a singer.
- **Vocals that fit the tone.** Choose one: a gentle solo voice for a lullaby, a bright warm lead with a small group of young voices answering for an action or counting song, or a duet for call and response. Name the voice by its character (warm, soft, bright, playful) and its range, never by a real singer.
- **Lyric safety and originality.** Lyrics follow the same originality pass and safety rules as the prompts: no names of protected characters, places, or brands, no violence, no peril for a human child, and nothing a child could copy dangerously. Characters in the lyrics are called by their Character names or by plain words ("little Babu", "the miller").

### The 10-second stanza

Every video is exactly 10 seconds, and every stanza is sung in exactly 10.0 seconds, so the cuts land on the music. Set the tempo from the bars:

`BPM = 6 × (beats per stanza)`, where beats per stanza = bars × beats per bar, counting the main pulse (a dotted quarter in 6/8).

| Bars per stanza and meter | Main pulses | Tempo |
| --- | --- | --- |
| 4 bars of 4/4 | 16 | 96 BPM |
| 5 bars of 4/4 | 20 | 120 BPM |
| 8 bars of 2/4 | 16 | 96 BPM |
| 8 bars of 6/8 | 16 | 96 pulses per minute |
| 6 bars of 3/4 | 18 | 108 BPM |
| 4 bars of 3/4, sung slowly | 12 | 72 BPM |

Keep the new tempo within about 20 per cent of the reference tempo. When a stanza cannot be sung in 10 seconds at that tempo:

- **Too long** (a six- or eight-line stanza): split it at a line break into two or more segments of whole lines, each sung in exactly 10 seconds, and each its own video. Tell the user which stanzas were split.
- **Too short** (a two-line stanza): fill the 10 seconds by repeating its last line, or with a short instrumental tag on the song's own instruments. Never pair two stanzas into one video.

Every segment uses the same tempo and the same bar count, so the song keeps one steady pulse. If the stanzas really differ in length, use the bar count that suits most of them, and split or fill the rest.

The song's length is exactly `number of videos × 10` seconds. The vocals begin on the first downbeat at 00:00. If the phrase starts with a pickup note, it falls on the previous stanza's last half bar. In the first stanza there is none, so open on the downbeat. The last stanza ends on a held final note that finishes by the end of its 10 seconds.

### The lyric clock

Each stanza's 10 seconds is divided evenly by its lines. With L lines, line k starts at `(k − 1) × 10 / L` seconds: 00:00, 00:02.5, 00:05, and 00:07.5 for four lines; 00:00, 00:03.33, and 00:06.67 for three. Half-line points fall halfway between.

**This replaces the six-beat clock of section 6 of `cinematic-direction.md` for this skill only.** Everywhere `storyboard-30s` says "beat", read "lyric beat": each line of the stanza is one beat, or two half-line beats when the line holds two distinct actions. A video has 4 to 8 beats. The beats are cut into 3 to 6 shots, and every shot starts and ends on a line or half-line boundary, so every cut lands on the pulse. A four-line stanza is usually cut as `00:00-00:02.5`, `00:02.5-00:05`, `00:05-00:07.5`, `00:07.5-00:10`, or as `00:00-00:05`, `00:05-00:07.5`, `00:07.5-00:08.75`, `00:08.75-00:10` when the stanza speeds up. Every beat still ends on a picture a viewer could photograph.

Because the clock is different, `create-3x2-timed-image` (built on the six-beat panel map) does not apply to these storyboards.

## 3. Cast the story

The cast rules of `storyboard-30s` apply in full (Yetis as leads, only three Yetis, story cast with one Character name each, the human rules, the 7-reference limit).

- **The Yetis play the lyric's leads.** Map each person or creature the lyrics follow to a Yeti where it fits. Every video has at least one shot of a Yeti, and the main emotional turn belongs to a Yeti in a Close-Up or Medium Close-Up.
- **The lyrics cast everyone else.** Every supporting character the lyrics name or need (a farmer, the animals on the farm, a spider, the stars, a shopkeeper) becomes a story cast member with its own Character name and an original design, reusing a file in `prompts/characters/` where one fits. A rhyme that adds a new animal each stanza adds that animal in its own video. Plan the reference count video by video: the three Yetis take 3 of the 7 and the opening image 1, so at most 3 story cast members are called with `@` in a video, and the rest are described-only.
- **Rhyme names become Character names.** A character the reference names (Jack, a named farmer) gets a new, original Character name, so the film reads as its own story.

## 4. Plan the story across the stanzas

- **One stanza, one video, one event.** Video N acts out segment N of the song: what that stanza's lines say happens is what the video shows, line by line, on the lyric clock. A picture that answers a line starts on that line's boundary.
- **One continuous story.** The videos form one story, not a set of separate sketches. Each video's first beat holds the picture the previous video ended on (step 4 of `storyboard-30s`), unless the lyrics move to a new place or time, which is a scene break opening on that location's plate. A refrain that repeats its words does not repeat its pictures: the story moves on each time, and the refrain's video may echo the framing of the last one.
- **The arc follows the lyrics.** Map the six plot stages of `storyboard-30s` step 2 onto the stanzas in proportion: Exposition in the first, the Inciting Incident by the end of the first or second, the Climax at the stanza where the lyrics peak (otherwise around 60 per cent of the way through), and the Falling Action and Resolution across the rest. The last video ends on the family together, held. A cumulative or list rhyme (an animal per stanza, counting up or down) builds steadily to a finale, and each stanza adds one thing to the picture.
- **Cut to the music.** Shot length follows the song's energy: calm stanzas take two-beat shots, and lively stanzas take one-beat shots. A line's stressed downbeat is where its action lands (a hop, a clap, a door that opens).

## 5. No singing, no lip-sync

The song plays only as background score, added in the edit. On screen, nobody performs it.

- No character sings, hums, chants, whistles, mouths words, or moves its mouth in rhythm, and no beat calls for an open mouth that opens and closes. Faces still follow the expression table in section 4 of `prompt-assembly.md`, and they hold a single shape through the beat: a closed-mouth smile, a small gasp, a wide grin held still.
- No character faces the camera as if performing. Characters act the story to each other and to the world, never to the viewer.
- No one plays an instrument on screen unless the lyrics name one. Even then it is a prop in the story, its sound is never in the `Sound:` line, and its playing does not keep time with the song.
- **The `Sound:` line carries no music**, because the song goes on top in the edit and a second score would clash with it. Write `Sound: no music.`, then the location's soft ambient bed and one plain-worded sound per physical action or visible effect, kept soft and low under the song, ending `No singing, no humming, no dialogue, no lyrics.` This replaces the music-plan part of the `Sound:` rule in `storyboard-30s` and section 5 of `cinematic-direction.md`. The music plan lives in the song sheet instead.
- **The `Avoid:` line** is the locked avoid line from section 5 of `prompt-assembly.md`, without its label, then `, on-screen text, captions, borders, split screens, singing, lip-syncing, mouths moving in time to music.`
- **Instruction 2** says this outright: the clips have no music because the song is added in the edit, and no character ever sings, hums, or moves its mouth to music.

## 6. Write the shots

Follow step 3 of `storyboard-30s` for every Agent prompt, with these changes:

- The shot timestamps sit on the lyric clock (step 2), on the video's own 00:00 to 00:10 clock. Write fractional boundaries as `00:02.5`, `00:03.33`, `00:06.67`, `00:08.75`.
- Each shot line has one sentence per lyric beat, and each sentence ends on a picture of what that line or half-line says.
- The format line says `<three to six> shots joined by hard cuts, cut on the beat of the music`.
- The `Sound:` and `Avoid:` lines follow step 5 above.
- Never put the lyrics, a line of them, or the words "song", "lyrics", or "singing" anywhere in an Agent prompt, except the fixed endings of the `Sound:` and `Avoid:` lines. Flow reads lyrics in a prompt as a request to sing them.

Everything else is unchanged: the first line, the style lock, `Cast:` with `@` once each, `Setting:`, `In frame:`, placement on the thirds, faces, the five-fingered hands and back-fur reminders, the height sentence, one camera move per shot, `Effects:`, `Light:` with focus, `ending on a held frame` on the last shot, and the 300 to 900 words.

## 7. Write the file

Save to `prompts/<kebab-case-title>-<length>s-storyboard.md`, where the title is the new song's title and the length is `number of videos × 10` (`prompts/babu-yeti-snowflake-counting-song-80s-storyboard.md`). Never overwrite an existing file without saying so.

The file holds, in order:

1. The title (`# <Song title> <length>s Storyboard`) and a short premise paragraph that says this is a song film: N videos, one per stanza, with the song added in the edit as background music.
2. **`## Original song`**, addressed to the editor and the music model, not to Flow:
   - A short **Reference analysis** table: meter, reference tempo (measured or estimated, and which), bars per stanza, phrase start, style, energy curve, vocal type, rhyme scheme, and stanza count.
   - **Song settings**: title, meter, tempo in BPM, bars per segment, segment length 10.0 seconds, total length, vocal, instruments (two to five), and a one-line mood. Note any stanza that was split or filled.
   - A **Sync map** table with one row per video: `Video`, `Film time` (00:00-00:10, 00:10-00:20, ...), the reference stanza it comes from, and the new stanza's lines, each with its start time on the video's clock (`00:00 / 00:02.5 / 00:05 / 00:07.5`). This is what the editor lines the song up with.
   - **Music prompt**: one `text` block for a text-to-music model, holding the style (genre, meter, exact BPM, instruments, vocal character, mood, "no intro, no outro, vocals start immediately, exactly <length> seconds, each stanza exactly 10 seconds"), then the lyrics with one `[Stanza N]` tag per segment. It names no song, rhyme, artist, or singer.
   - One **Edit note** line: place the song at film 00:00, and if the generated song drifts from the Sync map, time-stretch it, by no more than about 5 per cent, so that every stanza starts on its video's cut. Mix the clips' ambient sound low beneath it.
3. `## Google Flow Agent instructions` with the three cards, as in `storyboard-30s`. Instruction 1 and Instruction 3 are word for word from section 5 of `google-flow.md`, with Instruction 3's number of videos filled in. Instruction 2, under about 250 words, also says that each video acts out one stanza of a song added later, that the clips carry no music, only soft ambient sound and effects, and that no character sings, hums, or moves its mouth to music. It does not quote the lyrics.
4. `## Agent setup prompt`, `## Image map`, and then one `## Video N - <Title>` section per video (its `Images:` line and its `Agent prompt:` block only), all as in `storyboard-30s`. Title each video after its stanza's event.
5. `## Cover image` and `## Cover image - 9:16 vertical`, as `storyboard-30s` and `.agents/skills/storyboard-30s/references/cover-images.md` set out, with the song's emotional hook as the concept. No lyrics or text on the cover.

**Long films.** A film of more than six videos is written in parts so that no prompt is cut short. First, write everything up to the end of Video 3. Then add the next three videos at a time, with Edit, after the last video. Add the covers last. Never shorten an Agent prompt to fit, and never write "same as Video N" in place of a line.

## 8. Verify before finishing

Run every check in step 7 of `storyboard-30s`, reading "three videos" as the film's N videos, "six beats" as the video's lyric beats, and the beat boundaries as the lyric clock. Then add these:

- [ ] The input check ran: both the reference song and the full lyrics came from the user, and no lyrics were filled in from memory.
- [ ] `grep -c '^## Video ' <file>`, `grep -c '^Images: attach' <file>`, and `grep -c '^Agent prompt:' <file>` each equal the number of segments in the Sync map, and Instruction 3 states that number.
- [ ] Every new stanza has the same number of lines as its reference stanza (or its split half), matching syllables (±1) and stresses, and the same rhyme scheme; no line is copied from the reference; and the music prompt names no song, rhyme, artist, or singer.
- [ ] The tempo satisfies `BPM = 6 × beats per stanza`, sits within about 20 per cent of the reference, and is the same in every segment; the total length is N × 10 seconds.
- [ ] Every shot boundary sits on a line or half-line point of the lyric clock, and every video's shots run in order from 00:00 to 00:10.
- [ ] Every video shows what its stanza says, line by line, and the videos tell one continuous story with handoff pictures matched, as in `storyboard-30s`.
- [ ] The stanza's lead is a Yeti, every supporting character the lyrics need is a story cast member with one Character name, and every video's references come to 7 or fewer.
- [ ] No Agent prompt holds a lyric, "song", "lyrics" outside the fixed endings, or any sentence where a character sings, hums, chants, whistles, mouths words, or performs to camera: `grep -niE '\bsing(s|ing)?\b|\bhum(s|ming)?\b|chant|whistl|mouths? (the )?words|lip-?sync' <file>` finds only the fixed `Sound:` and `Avoid:` endings, the `## Original song` section, and Instruction 2.
- [ ] Every `Sound:` line starts `Sound: no music.` and ends `No singing, no humming, no dialogue, no lyrics.`, and every `Avoid:` line ends `singing, lip-syncing, mouths moving in time to music.`
- [ ] `node .agents/skills/storyboard-30s/check_filter.mjs <file>` prints `OK`, and every `Note:` it printed has been read. It scans the music prompt too, which keeps the lyrics clear of the same trigger words.

## 9. Hand off

Tell the user: the file path; the song's title, tempo, meter, vocal, and length; the number of videos, and any stanza that was split or filled; whether the tempo was measured or estimated; and the defaults used. Name the next steps:

1. Generate the song from the Music prompt in a text-to-music tool of their choice, then check it against the Sync map.
2. Run `/create-flow-assets <this storyboard>` for the plates and the story cast images, and `/flow-character-builder <this storyboard>` for any story cast Character not yet saved. List each member and whether it already has a file in `prompts/characters/`.
3. Generate the clips in Flow from the file: paste the three cards and the setup prompt once, then one Agent prompt per video with the images its `Images:` line names.
4. Lay the song over the joined clips at 00:00, following the Edit note.
