import fs from 'node:fs';
import path from 'node:path';

const REPO = process.cwd();
const CHARACTERS = path.join(REPO, '.agents', 'rules', 'character-consistency.md');
const ASSEMBLY = path.join(REPO, '.agents', 'rules', 'prompt-assembly.md');

const cc = fs.readFileSync(CHARACTERS, 'utf8');
const babuMatch = cc.match(/## Character 3 — Babu Yeti[\s\S]*?```text\n([\s\S]*?)\n```/);
if (!babuMatch) throw new Error("Could not find Babu Yeti lock");
const BABU_LOCK = babuMatch[1].trim();

const STYLE_LOCK = "3D animated premium shot, high-quality 3D CGI rendering, ultra-realistic soft fur texture, cinematic lighting, soft warm illumination highlighting individual strands of fur.";
const AVOID = "Avoid: photorealistic humans, scary monsters, horror elements, flat lighting, urban environments, extra Yetis, and, on any Yeti, human skin, visible pores, sharp teeth, sharp claws, white or grey fur, clothing, hats, or accessories.";
const CREATURES = "Creatures: a glowing crystal bird with translucent azure wings and a shimmering crest, and a tiny bioluminescent forest sprite with round golden eyes and delicate glowing gossamer wings.";
const ENV = "Environment: A mystical twilight forest in a secluded Himalayan valley under a dim evening sky, where the soft mossy ground is surrounded by towering giant mushrooms glowing softly in bioluminescent violet and deep blue, thick glowing coiled creepers hang from colossal mossy tree trunks rising toward a leafy canopy, floating luminous golden spores drift through the still air, and heavy glowing golden lantern fruit clusters cling to the high upper branches.";
const CLOSING = "Single still reference image. No text, captions, or watermark.";

const LIGHT_V1_S1 = "Lighting: Soft cool violet fill from the glowing mushrooms at frame right, dim blue ambient from the twilight canopy overhead, warm golden rim light on the left side of Babu Yeti's fur from the drifting spores, low-key contrast, violet-blue and amber palette, magical and quiet.";
const LIGHT_V1_S2_S3 = "Lighting: Soft cool indigo fill from the high canopy, vibrant cyan highlights from the glowing flora below, warm amber rim outlining the mint fur, low-key contrast, deep indigo and cyan palette with golden accents, thrilling and expansive.";

const LIGHT_V2_S1 = LIGHT_V1_S2_S3;
const LIGHT_V2_S2_S3 = "Lighting: Dynamic swirling key light from the glowing spore trails, deep violet and blue ambient shadows from the canopy, intense golden rim outlining Babu Yeti's mint fur, low-key high contrast, neon violet and amber palette, dizzying and energetic.";

const LIGHT_V3_S1 = LIGHT_V2_S2_S3;
const LIGHT_V3_S2_S3 = "Lighting: Intense warm golden key light from the secured lantern fruit branch, rich violet ambient fill from the upper canopy, crisp golden rim outlining Babu Yeti's fur and sturdy shoulders, medium contrast, warm amber and deep indigo palette, triumphant and steady.";

const LIGHT_V4_S1 = LIGHT_V3_S2_S3;
const LIGHT_V4_S2_S3 = "Lighting: Soft radiant golden key from the lantern fruit high above, gentle violet and cyan fill from the wide mushroom cap, warm amber rim light enveloping Babu Yeti and the glowing sprite, low-key contrast, soft honey-gold and violet palette, tender and peaceful.";

const videoData = [
  {
    num: 1,
    title: "The Canopy Leap",
    filmPos: "00:00 - 00:10",
    stage: "Exposition, Inciting Incident, start of Rising Action",
    panels: [
      {
        p: 1,
        time: "00:00.0–00:01.5",
        framing: "Medium Shot",
        angle: "Eye Level",
        title: "MUSHROOM SPRINT START",
        light: LIGHT_V1_S1,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        action: "Babu Yeti sprints vigorously across the spongy cap of the towering giant mushroom at frame centre, his mint fur rippling with momentum and eyes fixed ahead.",
        effects: "Delicate clouds of golden spores puff up beneath his running feet against the soft violet ambient."
      },
      {
        p: 2,
        time: "00:01.5–00:03.0",
        framing: "Full Shot",
        angle: "Eye Level",
        title: "EDGE CROUCH PREPARATION",
        light: LIGHT_V1_S1,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        action: "At the rounded edge of the giant mushroom cap, Babu Yeti plants both large rounded feet firmly and crouches low to jump, with arms coiled back and face set in determined focus.",
        effects: "Tiny golden spores swirl in gentle eddies around his planted feet."
      },
      {
        p: 3,
        time: "00:03.0–00:05.0",
        framing: "Wide Shot",
        angle: "Low Angle",
        title: "MID-AIR CANOPY LEAP",
        light: LIGHT_V1_S2_S3,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        action: "Suspended over the misty chasm, Babu Yeti flies forward in a heroic gliding pose with arms outstretched toward the glowing azure crystal bird soaring higher ahead.",
        effects: "Soft atmospheric mist drifts across the lower chasm below his leaping silhouette."
      },
      {
        p: 4,
        time: "00:05.0–00:07.0",
        framing: "Wide Shot",
        angle: "Low Angle",
        title: "CRYSTAL BIRD PURSUIT",
        light: LIGHT_V1_S2_S3,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        action: "High above the chasm at the apex of his leap, Babu Yeti hangs suspended with eyes locked on the crystal bird as it glides swiftly into the upper foliage.",
        effects: "A shimmering trail of fine crystalline dust follows the soaring crystal bird across the canopy."
      },
      {
        p: 5,
        time: "00:07.0–00:08.5",
        framing: "Close-Up",
        angle: "Low Angle",
        title: "WINDSWEPT TODDLER FOCUS",
        light: LIGHT_V1_S2_S3,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        action: "In mid-air profile, Babu Yeti's oversized glossy eyes gaze forward with unwavering focus, his chubby cheeks pressed by rushing air and his single curly tuft streaming back.",
        effects: "Luminous golden spores drift past in shallow focus against the blurred dark branches."
      },
      {
        p: 6,
        time: "00:08.5–00:10.0",
        framing: "Medium Close-Up",
        angle: "Low Angle",
        title: "CREEPER SPOTTED BELOW",
        light: LIGHT_V1_S2_S3,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        action: "Beginning his downward descent through the mist, Babu Yeti twists his torso downward as his eyes lock onto a thick glowing coiled creeper hanging from a colossal branch below.",
        effects: "Faint motion blur softens the passing tree boughs behind his turning form."
      }
    ]
  },
  {
    num: 2,
    title: "The Luminous Vine Slingshot",
    filmPos: "00:10 - 00:20",
    stage: "Rising Action",
    panels: [
      {
        p: 1,
        time: "00:00.0–00:01.5",
        framing: "Medium Shot",
        angle: "Low Angle",
        title: "REACHING FOR ROOT",
        light: LIGHT_V2_S1,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        action: "Descending rapidly through the air, Babu Yeti stretches both rounded paws outward toward the thick glowing coiled root wrapped around the colossal branch.",
        effects: "A few loose golden spores drift away from the approaching creeper."
      },
      {
        p: 2,
        time: "00:01.5–00:03.0",
        framing: "Medium Shot",
        angle: "Low Angle",
        title: "SECURE VINE CLAMP",
        light: LIGHT_V2_S1,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        action: "Clamping both paws securely around the springy luminous creeper, Babu Yeti bends his chubby legs as the taut vine flexes under his weight.",
        effects: "A bright puff of golden spores bursts from the creeper where his paws clamp the bark."
      },
      {
        p: 3,
        time: "00:03.0–00:05.0",
        framing: "Full Shot",
        angle: "Eye Level",
        title: "WILD CENTRIFUGAL SPIN",
        light: LIGHT_V2_S2_S3,
        expr: "cute playful smile",
        action: "Swinging around the colossal branch in a wide centrifugal loop, Babu Yeti leans into the curve with both rounded paws gripping the elastic creeper.",
        effects: "Glowing golden spore trails streak in circular arcs along his curved swinging path."
      },
      {
        p: 4,
        time: "00:05.0–00:07.0",
        framing: "Full Shot",
        angle: "Eye Level",
        title: "MAXIMUM ROTATION SMILE",
        light: LIGHT_V2_S2_S3,
        expr: "cute playful smile",
        action: "At the lowest arc of the spin, Babu Yeti holds the drawn-back vine like a taut bowstring, his cheeks flushed and face beaming in a cute playful smile.",
        effects: "Brilliant rings of glowing neon spore dust surround the flexed vine at peak tension."
      },
      {
        p: 5,
        time: "00:07.0–00:08.5",
        framing: "Wide Shot",
        angle: "Low Angle",
        title: "VERTICAL LAUNCH RELEASE",
        light: LIGHT_V2_S2_S3,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        action: "Releasing his grip at the crest of the spin, Babu Yeti rockets vertically upward into the air like an arrow, surrounded by a swirl of golden light.",
        effects: "A vertical column of sparkling golden spores billows outward from the released root."
      },
      {
        p: 6,
        time: "00:08.5–00:10.0",
        framing: "Extreme Wide Shot",
        angle: "Low Angle",
        title: "ASCENT THROUGH SPORES",
        light: LIGHT_V2_S2_S3,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        action: "High above the colossal branches, Babu Yeti ascends rapidly toward the glowing mushroom canopy with paws held above his chest and a determined furrowed brow.",
        effects: "Soft bokeh blurs the dizzying drop of the twilight forest floor far below."
      }
    ]
  },
  {
    num: 3,
    title: "The Falling Lantern Branch Rescue",
    filmPos: "00:20 - 00:30",
    stage: "Rising Action, Climax (peaks at 00:05 on this clock, film 00:25, at the end of Shot 2's first beat), start of Falling Action",
    panels: [
      {
        p: 1,
        time: "00:00.0–00:01.5",
        framing: "Close-Up",
        angle: "High Angle",
        title: "INTERCEPTING DROOPING BOUGH",
        light: LIGHT_V3_S1,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        action: "Reaching the peak of his launch, Babu Yeti extends both rounded paws toward the thick sagging bough heavy with glowing golden lantern fruit.",
        effects: "Golden light motes pulse softly from the trembling lantern fruit."
      },
      {
        p: 2,
        time: "00:01.5–00:03.0",
        framing: "Medium Close-Up",
        angle: "High Angle",
        title: "BRACING FRUIT WEIGHT",
        light: LIGHT_V3_S1,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        action: "Babu Yeti locks both rounded paws firmly beneath the drooping branch, bracing his sturdy body as the heavy bough sags downward.",
        effects: "Loose flakes of dry bark tumble away into the misty air below."
      },
      {
        p: 3,
        time: "00:03.0–00:05.0",
        framing: "Medium Shot",
        angle: "Low Angle",
        title: "HEROIC SHOULDER HEAVE",
        light: LIGHT_V3_S2_S3,
        expr: "straining face with a furrowed brow and mouth pulled into a grimace, no smile",
        action: "Wedged beneath the sagging bough, Babu Yeti braces his feet against the trunk ledge and heaves upward with his sturdy shoulders, his face grimacing with straining effort.",
        effects: "Glowing amber dust and bark flecks puff outward from the strained wood."
      },
      {
        p: 4,
        time: "00:05.0–00:07.0",
        framing: "Medium Shot",
        angle: "Low Angle",
        title: "LOCKING JOINT SNAP",
        light: LIGHT_V3_S2_S3,
        expr: "relieved soft smile with eyes relaxed",
        action: "As the bough clicks firmly into its natural notch against the trunk, Babu Yeti holds his paws flat against the bark with a heavy, relieved exhale and a soft smile.",
        effects: "Radiant warm golden light pours across Babu Yeti's mint fur from the secured lantern fruit."
      },
      {
        p: 5,
        time: "00:07.0–00:08.5",
        framing: "Medium Close-Up",
        angle: "Low Angle",
        title: "FIRM BOUGH CONFIRMATION",
        light: LIGHT_V3_S2_S3,
        expr: "cute playful smile",
        action: "Testing the stable branch with a gentle pat of his rounded paws, Babu Yeti confirms the heavy cluster of glowing lantern fruit rests safely balanced.",
        effects: "Warm amber light gleams along the mossy bough."
      },
      {
        p: 6,
        time: "00:08.5–00:10.0",
        framing: "Medium Shot",
        angle: "Low Angle",
        title: "PROUD AMBER WAVE",
        light: LIGHT_V3_S2_S3,
        expr: "cute playful smile",
        action: "Standing proud on the sturdy bough under the glowing lantern fruit, Babu Yeti raises one paw in a cheerful wave with his face beaming in a cute playful smile.",
        effects: "Sparkling spores drift quietly around the secured lantern fruit in the warm golden key light."
      }
    ]
  },
  {
    num: 4,
    title: "The Mid-Air Tumble and Mushroom Cradle",
    filmPos: "00:30 - 00:40",
    stage: "Falling Action, Resolution",
    panels: [
      {
        p: 1,
        time: "00:00.0–00:01.5",
        framing: "Medium Shot",
        angle: "Low Angle",
        title: "FALLING SPRITE ALARM",
        light: LIGHT_V4_S1,
        expr: "alarmed face with oversized eyes opened wide and mouth open in a small gasp, no smile",
        action: "Standing on the secured bough, Babu Yeti turns in shock as a tiny bioluminescent forest sprite slips from a swaying vine and falls toward the mist.",
        effects: "A tiny trail of blue sparks begins to tumble with the falling sprite."
      },
      {
        p: 2,
        time: "00:01.5–00:03.0",
        framing: "Medium Shot",
        angle: "Low Angle",
        title: "DIVE FROM LEDGE",
        light: LIGHT_V4_S1,
        expr: "alarmed face with oversized eyes opened wide and mouth open in a small gasp, no smile",
        action: "With oversized eyes wide in an alarmed small gasp, Babu Yeti kicks boldly off the wooden ledge and dives downward into the open air after the falling creature.",
        effects: "Loose twigs and moss flecks fall away from the bough into the mist."
      },
      {
        p: 3,
        time: "00:03.0–00:05.0",
        framing: "Full Shot",
        angle: "Low Angle",
        title: "MID-AIR SOMERSAULT SCOOP",
        light: LIGHT_V4_S2_S3,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        action: "Mid-air in a smooth somersault, Babu Yeti extends both rounded paws forward and gently scoops the falling forest sprite into his cupped palms.",
        effects: "Soft cyan sparkles cascade between his rounded paws in gentle slow motion."
      },
      {
        p: 4,
        time: "00:05.0–00:07.0",
        framing: "Medium Shot",
        angle: "Low Angle",
        title: "CURVING CAP DESCENT",
        light: LIGHT_V4_S2_S3,
        expr: "relieved soft smile with eyes relaxed",
        action: "Cradling the trembling little sprite safely against his chest fur, Babu Yeti curves smoothly downward toward a wide soft purple mushroom cap below, his face relaxing into a relieved soft smile.",
        effects: "Warm amber rim light from the high canopy illuminates his descending form."
      },
      {
        p: 5,
        time: "00:07.0–00:08.5",
        framing: "Medium Close-Up",
        angle: "Eye Level",
        title: "VELVET CAP LANDING",
        light: LIGHT_V4_S2_S3,
        expr: "gentle closed-mouth smile with soft eyes",
        action: "Sliding gently onto the velvety purple mushroom cap, Babu Yeti sits down comfortably with rounded feet tucked beneath his round tummy, his paws sheltering the sprite.",
        effects: "Tiny golden spores drift lazily across the velvety purple mushroom surface."
      },
      {
        p: 6,
        time: "00:08.5–00:10.0",
        framing: "Medium Close-Up",
        angle: "Eye Level",
        title: "PEACEFUL SPRITE CRADLE",
        light: LIGHT_V4_S2_S3,
        expr: "gentle closed-mouth smile with soft eyes",
        action: "Babu Yeti cradles the glowing little sprite tenderly against his fluffy tummy with both rounded paws, resting his chin down with a gentle closed-mouth smile and soft adoring eyes.",
        effects: "Soft cyan light pulses gently from the comforted sprite onto Babu Yeti's mint chest fur."
      }
    ]
  }
];

let doc = `# Babu Yeti Glowing Mushroom Bloom 40s Panel Images and 3x2 Grids

Image prompts for \`prompts/babu-yeti-glowing-mushroom-bloom-40s-storyboard.md\`, which holds the video prompts. Each 10-second video has, under its own heading, six panel image prompts, one per beat of its storyboard table, timed and framed by the panel map in section 6 of \`.agents/rules/cinematic-direction.md\`. Each draws its panel's picture as a full single image with Babu Yeti's full character lock from \`.agents/rules/character-consistency.md\`, the shot's light, and his face in an \`Expressions:\` sentence, as sections 2 to 4 of \`.agents/rules/prompt-assembly.md\` set out. Each video's 3x2 grid is composed from its six panel images by \`compose_grid.ps1\`; it has no prompt and is never drawn by an image model, so the grid and the panel images are the same six pictures.

24 panel images and four grids in total, all in \`3x2-timed-storyboard-images/babu-yeti-glowing-mushroom-bloom/\`: each panel image as \`Panel_<P>_V<N>.jpg\` and each grid as \`Grid_V<N>.jpg\`, where \`V\` is the video number. The panel images are vertical 9:16, and each grid is a 1920x1080 horizontal canvas.

To make a video's images:

1. Generate the six panel images one prompt at a time, each with the family reference image attached as a character reference, the prompt pasted whole, and the output set to vertical 9:16. Save each under the name its \`Image:\` line gives.
2. Check every panel image against its prompt and against the look check in section 7 of \`.agents/rules/prompt-assembly.md\`, which starts from the Final Consistency Checklist in \`.agents/rules/character-consistency.md\`: Babu Yeti the same individual in every panel, in his solid mint-green fur with his single curly tuft, round tummy, oversized eyes, and no clothing or accessories; no extra Yetis; the face the prompt names; the framing, angle, and light the prompt names; and no text. Then check the six side by side for the same look across the set. Regenerate any image that fails; a wrong image is cheaper to redo than a wrong clip.
3. Checks for this film:
   - Babu Yeti is the only Yeti in the film. He appears in all 24 panel images. Papa Yeti and Mama Yeti do not appear. His character lock sizes him against a grown-up Yeti and names the blue and pink Yetis' tufts in its closing clause, and the family reference image shows all three Yetis, so the image model may attempt to add an adult Yeti; regenerate any image that includes one. Babu Yeti's own full-body portrait (\`prompts/babu-yeti-full-body-portrait.md\`) may be used as the character reference image.
   - The crystal bird in Video 1 has translucent azure wings and a shimmering crest; it flies high through the canopy, never physically grasped or harmed.
   - The glowing coiled roots and creepers in Video 2 are thick, elastic, natural botanical vines wrapped around ancient branches, glowing with soft bioluminescence; they do not look like synthetic ropes or wires.
   - The golden lantern fruit in Video 3 is a heavy cluster of in-world botanical spheres with spiral rinds glowing with warm amber light from within. Babu Yeti braces and heaves the bough at chest and shoulder height, clicking it securely into its natural trunk notch.
   - The tiny bioluminescent forest sprite in Video 4 has round golden eyes and delicate glowing gossamer wings; it is scooped gently from mid-air and cuddled tenderly against Babu Yeti's tummy, never squeezed or frightened.
   - Babu Yeti never has paws or objects on or above his head. He holds objects and creatures at chest height.
4. Compose the grid from the six saved panel images: \`pwsh -File .agents/skills/create-3x2-timed-image/compose_grid.ps1 -File prompts/babu-yeti-glowing-mushroom-bloom-40s-3x2.md -Video <N>\`. Compose it again whenever a panel image changes.
5. If the image model refuses a prompt, the filter causes in the storyboard's agent instructions apply to it too. Change only that prompt's picture and effects text and keep every lock, Babu Yeti's character lock included.

To use them in Google Flow, set the output format to vertical 9:16, generate the video's clip in ingredients-to-video mode with the video's \`Character locks:\` block and table from the storyboard pasted as the prompt, and attach one of these:

- Panel route: the six panel images and the family reference image. That is seven images, the most Flow accepts for one clip, and it gives Flow every beat of the clip at full size.
- Grid route: the composed grid and the family reference image.

Never attach more than seven images, and never set a panel image or a grid as a start or an end frame. Check the clip against the six panel images, each at its timecode.
`;

for (const v of videoData) {
  doc += `\n## Video ${v.num} - ${v.title}\n\n`;
  doc += `Film position: ${v.filmPos}.\n\n`;
  doc += `Stage: ${v.stage}.\n\n`;
  doc += `Video prompt: the Video ${v.num} \`Character locks:\` block and table in \`prompts/babu-yeti-glowing-mushroom-bloom-40s-storyboard.md\`.\n\n`;
  doc += `Grid image: \`3x2-timed-storyboard-images/babu-yeti-glowing-mushroom-bloom/Grid_V${v.num}.jpg\`, composed from the six panel images below by \`compose_grid.ps1\`.\n\n`;

  for (const p of v.panels) {
    doc += `### Panel ${p.p} · ${p.time} · ${p.framing}, ${p.angle} · ${p.title}\n\n`;
    doc += `Image: \`3x2-timed-storyboard-images/babu-yeti-glowing-mushroom-bloom/Panel_${p.p}_V${v.num}.jpg\`.\n\n`;
    doc += "```\n";
    doc += `Create image: Vertical 9:16 aspect ratio, full-frame vertical composition. ${STYLE_LOCK} ${ENV} ${p.light} ${BABU_LOCK} Expressions: Babu Yeti, ${p.expr}. ${CREATURES} ${AVOID} Action: ${p.framing}, ${p.angle} still. ${p.action} Papa Yeti and Mama Yeti are not in this picture. Effects: ${p.effects} ${CLOSING}\n`;
    doc += "```\n\n";
  }
}

const outPath = path.join(REPO, 'prompts', 'babu-yeti-glowing-mushroom-bloom-40s-3x2.md');
fs.writeFileSync(outPath, doc.trimEnd() + '\n', 'utf8');
console.log("Successfully wrote:", outPath);
