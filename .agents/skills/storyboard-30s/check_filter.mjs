#!/usr/bin/env node
/**
 * check_filter.mjs
 *
 * Scans a Yeti storyboard (prompts/<slug>-<30s or 60s>-storyboard.md) for wording that Google
 * Flow's filters are known to refuse: the copyright filter ("I can't generate the video you
 * requested right now due to interests of third-party content providers") and the safety filter
 * ("may violate our policies"). It reads only what Flow receives: the instruction cards, the
 * Agent setup prompt, every Agent prompt, and standalone cover image prompts, i.e. every
 * ```text block in the file. Cover checks do not imply that a cover is a clip reference.
 *
 * It cannot prove a prompt will pass: Google publishes no word list (only the categories on its Veo
 * responsible-AI page), its filters judge the whole request in context, and they also judge the
 * attached images and the finished video. It catches every cause this project has recorded, and
 * flags the risk words creators report, as notes.
 *
 * Usage:
 *   node .agents/skills/storyboard-30s/check_filter.mjs prompts/<slug>-<30s or 60s>-storyboard.md
 *
 * Prints "Problem:" lines (must be fixed; exit status 1) and "Note:" lines (read the sentence and
 * decide), each with the block it is in, then "OK" when there are no problems.
 */

import fs from "node:fs";

// The avoid line is locked (section 5 of prompt-assembly.md); its words are not flagged.
const AVOID = "photorealistic humans, scary monsters, horror elements, flat lighting, extra Yetis";

// Words that name protected work, or ask for a known look. Always a problem.
const PROBLEMS = [
  [/\b(Disney|Pixar|DreamWorks|Dreamworks|Illumination Entertainment|Illumination Studios|Ghibli|Marvel|Netflix|Warner|Nickelodeon|Cartoon Network|Sony Pictures|Lucasfilm|Aardman|Laika)\b/, "names a studio"],
  [/\b(abominable|smallfoot|monsters,? inc|sulley|wazowski|frozen 2|olaf|elsa|kung fu panda|shifu|oogway|tai lung|matrix|how to train your dragon|toothless|neverending story|falkor|lion king|simba|rafiki|totoro|moana|shrek|ice age|avatar|na'vi|star wars|jedi|yoda|harry potter|hogwarts|pok[eé]mon|pikachu|minecraft|fortnite|lego|mario|zelda|sonic|spider-?man|batman|superman|hulk|groot|chewbacca|wookiee|ewok|gremlin|furby|muppet|sesame street|teletubb|paddington|winnie|pooh|minions?|despicable|zootopia|encanto)\b/i, "names a film, show, game, or character"],
  [/\b(in the style of|inspired by|reminiscent of|homage to|a tribute to|like the scene|like in the film|like a famous|from the movie|from the film|film look|movie look|colou?r grade)\b/i, "asks for someone else's style or scene"],
  [/\b[A-Z][a-z]+-style\b/, "asks for a named style"],
  [/\b(monsters?|beasts?|snow ?monster|bigfoot|sasquatch|abominable snowman|creature from|furry monster)\b/i, "calls a character a monster or beast (Flow captioned a Papa Yeti frame \"Blue furry monster\", a famous character)"],
  [/\b(chosen one|dragon warrior|the force|power-?up|super ?powers?|superhero|super-?hero landing|three-point landing|bullet[- ]time|hero shot|epic hero|legendary master)\b/i, "franchise phrase or loaded shorthand (section 10 of prompt-assembly.md)"],
  [/\b(energy|aura|force field|shockwave|shock wave|power beam|beam of light|blast of|pulse of light|wave of light|dome of light|magic power|spell|summons?|conjures?)\b/i, "energy or magic sent out by a character"],
  [/\b(theme song|theme tune|soundtrack|anthem|famous (?:melody|song|tune)|lyrics? of|sung words|singing the)\b/i, "names or asks for a known piece of music"],
  [/\b(look-?alike|likeness of|portrait of (?:a )?real|real person)\b/i, "a real person's likeness (Prohibited Use Policy: impersonation, privacy; Veo's Celebrity category)"],
  [/\b(blood|bleed|bleeding|wound|injur(?:y|ed|es)|kills?|killed|dies|dead body|corpse|gun|rifle|pistol|sword|knife|dagger|spear|arrow hits|weapon|explosion|explodes|bomb|burning (?:alive|house|hut)|drowns?|drowning|strangle|choke)\b/i, "violence or harm (safety filter)"],
  [/\b(fade (?:in|out|to)|dissolve|crossfade|speed ramp|time-?lapse|freeze frame|split screen)\b/i, "an edit instruction inside a prompt"],
];

// Patterns that have been refused before, or often are. Each is a note: read the line and decide.
const NOTES = [
  [/\b(?:leaf|leaves|plants?|saplings?|seedlings?|flowers?|petals?|moss|grass|trees?|vines?|sprouts?|shoots?|buds?|slope|hillside|meadow|field|rows?|crops?)\b\W+(?:\w+\W+){0,3}?(?:glow(?:s|ed|ing)?|shimmer(?:s|ing)?|sparkl(?:e|es|ing)|trembl(?:e|es|ing)|bloom(?:s|ed|ing)?|sprout(?:s|ed|ing)?|unfurl(?:s|ing)?|grow(?:s|ing)?|turn(?:s|ing)? green|light(?:s)? up)\b|\b(?:glow(?:s|ed|ing)?|shimmer(?:s|ing)?|sparkl(?:e|es|ing)|trembl(?:e|es|ing)|bloom(?:s|ed|ing)?|sprout(?:s|ed|ing)?|unfurl(?:s|ing)?|grow(?:s|ing)?|turn(?:s|ing)? green|light(?:s)? up)\b\W+(?:\w+\W+){0,3}?(?:leaf|leaves|plants?|saplings?|seedlings?|flowers?|petals?|moss|grass|trees?|vines?|sprouts?|shoots?|buds?|slope|hillside|meadow|field|rows?|crops?)\b/i,
    "plants that glow, tremble, bloom, or grow, or land turning green, read as a Yeti making plants grow, the plot device of a well-known animated Yeti film (Hillside Roots Video 6 was refused three times for it). Glowing moss or fungi that are simply the place's own light are fine; nothing a Yeti does, touches, or plants may make a plant glow, move, or grow"],
  [/\b(kung fu|taekwondo|karate|martial art|flying (?:side )?kick|crane kick|dojo|temple courtyard|old master|wise master|sensei)\b/i,
    "martial arts in a 3D animated film sit close to a famous animated franchise (Kung Fu Dream was refused); keep it a plain physical action, change at least two of setting, prop, action, and framing from any training-with-a-master scene, and give any mentor an invented design"],
  [/\b(dragon)\b/i, "a dragon that a character befriends, rides, or flies with is close to several famous films (White Dragon was refused); give it an invented design and change two of setting, prop, action, and framing, or call a dragon-shaped prop by its material (a carved wooden kite)"],
  [/\b(lifts?|holds?|raises?) (?:\w+ ){0,4}(?:up )?(?:high )?(?:to|toward|towards) the sky\b|\b(?:above|over) (?:his|her|their) heads? (?:on|from) (?:a|the) (?:rock|cliff|ledge)\b/i,
    "a baby held up to the sky from a rock is a famous animated scene"],
  [/\b(snowman|ice palace|ice castle|singing on (?:the )?ice|ice powers?)\b/i, "close to a famous animated ice film"],
  [/\bmagic(?:al)?\b/i, "magic must come from the world or a prop, never from a Yeti (section 10 of prompt-assembly.md); say what physically causes it"],
  [/\b(child|girl|boy|kid|toddler|baby)\b[^.]*\b(falls?|slips?|drowns?|cliff edge|edge of the cliff|thin ice|alone in|trapped|swept away|into the water|into the river)\b/i,
    "a human child in danger is refused by the safety filter; keep the child with an adult and write worry, not peril"],
  [/\b(attacks?|bites?|tackles?|pounces? on|lunges? at|claws? at|crush(?:es|ed)?|slams? into (?:him|her|them))\b/i,
    "contact violence; show the threat stopping short and the danger as effort and worry"],
  [/\b(sunset|golden hour)\b[^.]*\b(sapling|seedling|tree)\b|\b(sapling|seedling)\b[^.]*\b(sunset|cradl)/i,
    "a lone sapling cradled and planted at sunset was refused (Hillside Roots Video 6); plant by hand with a tool, brisk and practical"],
  // Risk-family words from creators' reports (section "Keeping clear of Flow's filters", item 5).
  // Anecdotal, not a Google list, so they are notes: read the sentence and judge the meaning.
  [/\b(crash(?:es|ing)?|slams?|slamm(?:ed|ing)|smash(?:es|ed|ing)?|shatter(?:s|ed|ing)?|crash zoom|rises? out of the ground)\b/i,
    "destruction motion; creators report crash, slam, and smash tripping the filter. Prefer comes down, lands, settles, or emerges where the beat allows"],
  [/\b(tied|bound|chained|trapped|captured|imprisoned|struggl(?:e|es|ing)|sobb(?:ing|ed)|crying|abandoned)\b/i,
    "restraint or distress word; write position and worry instead (beside, inside, surrounded by, worried, looking down)"],
  [/\b(tight|intimate|vulnerable|slender|curvy|petite|bare skin|exertion)\b/i,
    "body or suggestive word; describe light, movement, and setting, never the body"],
  [/\bshoot(?:s|ing)?\b/i, "\"shoot\" reads as a weapon; use film or capture"],
  [/\b(celebrity|public figure|famous (?:actor|singer|person)|resembling|in the voice of|sounds like)\b/i,
    "a real person or a known voice; use an original character described by its features"],
];

// Checked on a whole shot line, because its two halves are usually in separate sentences.
const LINE_NOTES = [
  [/^(?=.*\b(?:360|three hundred sixty|full circle|circles (?:a full|all the way|completely) around|orbits? (?:around|him|her|them))\b)(?=.*\b(?:slow motion|frozen|hangs? in (?:mid-?)?air|mid-?air)\b)/i,
    "a pose frozen in mid-air with the camera orbiting it is a signature special-effect shot of a famous live-action film; use real speed, or slow motion with a static or side-tracking camera, never a full orbit"],
];

// A sentence that only rules something out ("No glow ever comes from anyone's hands.") is not flagged.
const NEGATED = /^(?:no|never|not|nothing|without)\b|\b(?:never|no one|nothing)\b|\bno (?:glow|energy|magic|weapon|blood|monster)/i;

const file = process.argv[2];
if (!file || file === "--help" || file === "-h") {
  console.log("Usage: node .agents/skills/storyboard-30s/check_filter.mjs prompts/<slug>-<30s or 60s>-storyboard.md");
  process.exit(file ? 0 : 1);
}
if (!fs.existsSync(file)) { console.error(`File not found: ${file}`); process.exit(1); }

const content = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
const lines = content.split("\n");

// Name each ```text block by the nearest heading above it.
const blocks = [];
let heading = "(top)";
for (let i = 0; i < lines.length; i++) {
  const h = lines[i].match(/^#{2,3} (.+)$/);
  if (h) heading = h[1].trim();
  if (lines[i].trim() === "```text") {
    const start = i + 1;
    let end = start;
    while (end < lines.length && lines[end].trim() !== "```") end++;
    blocks.push({ heading, start, body: lines.slice(start, end) });
    i = end;
  }
}
if (blocks.length === 0) {
  console.error(`No \`\`\`text blocks in ${file}: it is not a current Agent-prompt storyboard. Revise it with storyboard-30s or storyboard-60s first.`);
  process.exit(1);
}

// Images the operator attaches: their names are read by Flow too.
const imageNames = [...content.matchAll(/`((?:Plate|Start frame|End frame|Panel)[^`]*)`/g)].map(m => m[1]);

let problems = 0;
let notes = 0;
const seenNotes = new Set();
const report = (kind, where, lineNo, why, text) => {
  // A note is shown once per block, at its first line; problems are shown every time.
  if (kind === "Note") {
    const key = `${where}|${why.replace(/ \("[^"]*"\)$/, "")}`;
    if (seenNotes.has(key)) { notes--; return; }
    seenNotes.add(key);
  }
  const snippet = text.length > 140 ? text.slice(0, 137) + "..." : text;
  console.log(`${kind}: ${where}, line ${lineNo}: ${why}\n    "${snippet}"`);
};

for (const b of blocks) {
  b.body.forEach((raw, k) => {
    const lineNo = b.start + k + 1;
    // Drop the locked avoid line and the Agent's own refusal-handling text before matching.
    const text = raw
      .replace(AVOID, "")
      .replace(/If a generation is refused[\s\S]*$/, "")
      .replace(/Recorded trigger:[\s\S]*$/, "")
      .replace(/If a video is refused[\s\S]*$/, "")
      .replace(/never let the Agent call a Yeti a monster/gi, "");
    // Every sentence is checked on its own, so a pattern never spans two sentences.
    for (const [re, why] of LINE_NOTES) {
      const m = text.match(re);
      if (m) { notes++; report("Note", b.heading, lineNo, why, text.trim()); }
    }
    for (const sentence of text.split(/(?<=[.;])\s+/)) {
      if (NEGATED.test(sentence.trim())) continue;
      for (const [re, why] of PROBLEMS) {
        const m = sentence.match(re);
        if (m) { problems++; report("Problem", b.heading, lineNo, `${why} ("${m[0]}")`, sentence.trim()); }
      }
      for (const [re, why] of NOTES) {
        const m = sentence.match(re);
        if (m) { notes++; report("Note", b.heading, lineNo, `${why} ("${m[0]}")`, sentence.trim()); }
      }
    }
  });
}

for (const name of new Set(imageNames)) {
  if (/monster|beast|creature/i.test(name)) {
    problems++;
    console.log(`Problem: image name "${name}" calls a character a monster, beast, or creature; name every image by its storyboard name.`);
  }
}

console.log(problems ? `\n${problems} problem(s), ${notes} note(s).` : `\nOK (${notes} note(s) to read).`);
process.exit(problems ? 1 : 0);
