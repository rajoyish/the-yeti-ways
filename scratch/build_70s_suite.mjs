import fs from 'node:fs';
import path from 'node:path';

const REPO = process.cwd();
const CHARACTERS = path.join(REPO, '.agents', 'rules', 'character-consistency.md');

const cc = fs.readFileSync(CHARACTERS, 'utf8');
const babuMatch = cc.match(/## Character 3 — Babu Yeti[\s\S]*?```text\n([\s\S]*?)\n```/);
if (!babuMatch) throw new Error("Could not find Babu Yeti lock");
const BABU_LOCK = babuMatch[1].trim();

const STYLE_LOCK = "3D animated premium shot, high-quality 3D CGI rendering, ultra-realistic soft fur texture, cinematic lighting, soft warm illumination highlighting individual strands of fur.";
const AVOID = "Avoid: photorealistic humans, scary monsters, horror elements, flat lighting, urban environments, extra Yetis, and, on any Yeti, human skin, visible pores, sharp teeth, sharp claws, white or grey fur, clothing, hats, or accessories.";
const CREATURES = "Creatures: a glowing crystal bird with translucent azure wings and a shimmering crest, and a tiny bioluminescent forest sprite with round golden eyes and delicate glowing gossamer wings.";
const CLOSING = "Single still reference image. No text, captions, or watermark.";

const ENV_GROUND = "Environment: A mystical twilight forest in a secluded Himalayan valley under a dim evening sky, where the soft mossy ground is surrounded by towering giant mushrooms glowing softly in bioluminescent violet and deep blue, floating luminous golden spores drift through the still air, massive moss-covered tree trunks rise toward a leafy canopy, and high on the broad cap of the tallest mushroom rests a gently hovering, warm golden lantern fruit.";
const ENV_CANOPY = "Environment: A mystical twilight forest in a secluded Himalayan valley under a dim evening sky, where the soft mossy ground is surrounded by towering giant mushrooms glowing softly in bioluminescent violet and deep blue, thick glowing coiled creepers hang from colossal mossy tree trunks rising toward a leafy canopy, floating luminous golden spores drift through the still air, and heavy glowing golden lantern fruit clusters cling to the high upper branches.";

// Lighting definitions
const LIGHT_V1_S1 = "Lighting: Soft cool violet fill from the glowing mushrooms at frame right, dim blue ambient from the twilight canopy overhead, warm golden rim light on the left side of Babu Yeti's fur from the drifting spores, low-key contrast, violet-blue and amber palette, magical and quiet.";
const LIGHT_V1_S2 = "Lighting: Strong motivated warm golden key from the distant glowing lantern fruit at frame centre, deep cool violet and blue shadows filling the forest floor, bright amber rim on the fur, high contrast, indigo and warm gold palette, energetic and mysterious.";
const LIGHT_V1_S3 = "Lighting: Motivated warm golden key from the canopy above, rich blue and purple ambient fill from the surrounding mushroom caps, glowing amber rim outlining the mint fur, low-key contrast, deep sapphire and warm amber palette, bold and suspenseful.";

const LIGHT_V2_S1 = LIGHT_V1_S3;
const LIGHT_V2_S2 = "Lighting: Radiant warm golden key from the glowing lantern fruit directly in front of Babu Yeti, soft violet fill from the mushroom rim, bright golden rim light glistening across the mint fur, low-key high contrast, luminous honey-gold and deep violet palette, wondrous and intimate.";
const LIGHT_V2_S3 = "Lighting: Intense warm golden key from the held lantern fruit illuminating the front of Babu Yeti, rich indigo ambient fill from the surrounding canopy, golden rim outlining his ears and curl, medium contrast, amber-gold and deep blue palette, peaceful and reverent.";

const LIGHT_V3_S1 = LIGHT_V2_S3;
const LIGHT_V3_S2 = "Lighting: Spectacular motivated multi-coloured key from the illuminated forest floor, warm golden fill from the nestled lantern fruit at frame right, soft pink and cyan rim lights on the fur, high-key contrast, vibrant neon pink, cyan, and warm gold palette, radiant and celebratory.";
const LIGHT_V3_S3 = "Lighting: Soft golden key from the nestled lantern fruit, brilliant ambient fill from the sea of glowing mushrooms and blossoms below, gentle warm rim on the mint fur, high-key contrast, luminous emerald, violet, and honey-gold palette, tranquil and breathtaking.";

const LIGHT_V4_S1 = LIGHT_V3_S3;
const LIGHT_V4_S2 = "Lighting: Soft cool indigo fill from the high canopy, vibrant cyan highlights from the glowing flora below, warm amber rim outlining the mint fur, low-key contrast, deep indigo and cyan palette with golden accents, thrilling and expansive.";
const LIGHT_V4_S3 = LIGHT_V4_S2;

const LIGHT_V5_S1 = LIGHT_V4_S3;
const LIGHT_V5_S2 = "Lighting: Dynamic swirling key light from the glowing spore trails, deep violet and blue ambient shadows from the canopy, intense golden rim outlining Babu Yeti's mint fur, low-key high contrast, neon violet and amber palette, dizzying and energetic.";
const LIGHT_V5_S3 = LIGHT_V5_S2;

const LIGHT_V6_S1 = LIGHT_V5_S3;
const LIGHT_V6_S2 = "Lighting: Intense warm golden key light from the secured lantern fruit branch, rich violet ambient fill from the upper canopy, crisp golden rim outlining Babu Yeti's fur and sturdy shoulders, medium contrast, warm amber and deep indigo palette, triumphant and steady.";
const LIGHT_V6_S3 = LIGHT_V6_S2;

const LIGHT_V7_S1 = LIGHT_V6_S3;
const LIGHT_V7_S2 = "Lighting: Soft radiant golden key from the lantern fruit high above, gentle violet and cyan fill from the wide mushroom cap, warm amber rim light enveloping Babu Yeti and the glowing sprite, low-key contrast, soft honey-gold and violet palette, tender and peaceful.";
const LIGHT_V7_S3 = LIGHT_V7_S2;

const allVideos = [
  // Video 1
  {
    num: 1,
    title: "The Distant Glow",
    filmPos: "00:00 - 00:10",
    stage: "Exposition, Inciting Incident, start of Rising Action",
    env: ENV_GROUND,
    shots: [
      {
        stamp: "00:00 - 00:03",
        type: "Medium Close-Up to Close-Up, Eye Level",
        openingFraming: "Medium Close-Up",
        closingFraming: "Close-Up",
        angle: "Eye Level",
        light: LIGHT_V1_S1,
        expr: "cute playful smile",
        actionBeat1: "Babu Yeti stands among the low blue-glowing mushrooms at frame centre, his head tilted with mouth in a curious small pout as he watches tiny floating golden spores drift past his button nose.",
        actionBeat2: "Babu Yeti looks toward the distant canopy and his oversized eyes widen in delight as a warm golden glow catches his gaze, his face brightening into a cute playful smile.",
        camera: "Slow dolly in from a Medium Close-Up to a Close-Up on Babu Yeti's face, steady and gentle.",
        vfx: "Effects: Subtle floating golden spores drift lazily through the foreground, with shallow depth of field softly blurring the glowing violet flora behind. Transition: Hard Cut.",
        audio: "Solo wooden flute begins a slow, wondrous melody with light trills. Ambient quiet forest hum, soft rustle of canopy leaves, and faint sparkling chimes from the drifting spores. No dialogue.",
        panel1: {
          time: "00:00.0–00:01.5",
          title: "GOLDEN SPORES DRIFT",
          expr: "curious face with head tilted and mouth closed in a small pout, no smile",
          action: "Babu Yeti stands among the low blue-glowing mushrooms at frame centre, his head tilted with mouth in a curious small pout as he watches tiny floating golden spores drift past his button nose.",
          effects: "Subtle floating golden spores hang suspended in the foreground, with shallow depth of field softly blurring the glowing violet flora behind."
        },
        panel2: {
          time: "00:01.5–00:03.0",
          title: "THE DISTANT GLOW",
          expr: "cute playful smile",
          action: "Babu Yeti looks toward the distant canopy at frame right with his oversized eyes wide in delight as warm golden light illuminates his face, his expression settled in a cute playful smile.",
          effects: "Floating golden spores glint softly against the out-of-focus violet mushrooms in the background."
        }
      },
      {
        stamp: "00:03 - 00:07",
        type: "Wide Shot, Low Angle",
        openingFraming: "Wide Shot",
        closingFraming: "Wide Shot",
        angle: "Low Angle",
        light: LIGHT_V1_S2,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        actionBeat1: "The warm golden light in the distance brightens against the shadowed forest floor as Babu Yeti turns and sprints eagerly across the moss toward the towering mushrooms, his mint fur rippling with momentum.",
        actionBeat2: "Babu Yeti bounds over a thick gnarled root and skids to a halt at the base of the giant mushroom stalks, gazing up at the glowing caps above with a determined furrowed brow and mouth pressed shut.",
        camera: "Tracking shot moving forward and slightly right at ground level, following Babu Yeti's run.",
        vfx: "Effects: Soft light bloom radiates from the distant golden glow, and tiny specks of moss kick up beneath running paws with subtle motion blur on the feet only. Transition: Hard Cut.",
        audio: "Solo wooden flute shifts into a fast, lively staccato tempo. Rapid, soft scampering pawsteps across damp moss, a gentle brush against fern fronds, and the distant crystalline hum of the golden light. No dialogue.",
        panel1: {
          time: "00:03.0–00:05.0",
          title: "SPRINTING ACROSS MOSS",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "On the shadowed mossy forest floor, Babu Yeti sprints away from the camera toward the bright golden glow atop the towering mushrooms in the distance, his body tilted forward in mid-stride.",
          effects: "Soft golden light bloom radiates from the distant mushroom cap across the cool blue background."
        },
        panel2: {
          time: "00:05.0–00:07.0",
          title: "AT THE BASE",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "At the foot of the massive textured mushroom stalks, Babu Yeti stands braced on a mossy root, looking up at the high glowing caps with a determined furrowed brow and mouth pressed shut.",
          effects: "Tiny specks of moss rest scattered on the bark, and soft light bloom outlines the towering mushroom caps above."
        }
      },
      {
        stamp: "00:07 - 00:10",
        type: "Medium Shot, Low Angle",
        openingFraming: "Medium Shot",
        closingFraming: "Medium Shot",
        angle: "Low Angle",
        light: LIGHT_V1_S3,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        actionBeat1: "Babu Yeti pushes off powerfully from the mossy root and launches upward into the air between the glowing purple and blue mushroom caps, his heavy arms outstretched toward the canopy.",
        actionBeat2: "Babu Yeti lands softly in the centre of the first springy purple mushroom cap, crouching low with both paws braced on the velvety surface as he looks up toward the towering trunk above, his face determined with mouth pressed shut.",
        camera: "Steadicam tracking Babu Yeti's upward leap through the air, easing to a stop in the last half second.",
        vfx: "Effects: Luminous golden spores puff outward into the air from the mushroom cap upon landing, and slight slow motion extends the hang time of the leap before the soft impact. Transition: Holds on the final frame.",
        audio: "Solo wooden flute rises in an energetic, soaring phrase and sustains a clear high note. A light whoosh of air during the jump, a deep springy thud on the velvety mushroom cap, and a puff of settling spores. No dialogue.",
        panel1: {
          time: "00:07.0–00:08.5",
          title: "LEAP INTO AIR",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "Suspended mid-air between the giant purple and blue mushroom caps, Babu Yeti reaches both heavy arms upward toward the canopy, his eyes focused and his face determined with a small furrowed brow and mouth pressed shut.",
          effects: "Luminous golden spores hang frozen in the air around Babu Yeti's outstretched paws."
        },
        panel2: {
          time: "00:08.5–00:10.0",
          title: "LANDING ON PURPLE",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "Babu Yeti crouches low in the centre of the first springy purple mushroom cap with both paws braced flat on the velvety surface, his face turned upward toward the towering stalk with a determined furrowed brow and mouth pressed shut.",
          effects: "A puff of fine luminous golden spores forms a low mist around Babu Yeti's braced paws on the mushroom cap."
        }
      }
    ]
  },

  // Video 2
  {
    num: 2,
    title: "The Golden Lantern Fruit",
    filmPos: "00:10 - 00:20",
    stage: "Rising Action, Climax (peaks at 00:05 on this clock, film 00:15, at the end of Shot 2's first beat), start of Falling Action",
    env: ENV_GROUND,
    shots: [
      {
        stamp: "00:00 - 00:03",
        type: "Medium Shot to Full Shot, Low Angle",
        openingFraming: "Medium Shot",
        closingFraming: "Full Shot",
        angle: "Low Angle",
        light: LIGHT_V2_S1,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        actionBeat1: "Babu Yeti rises from his crouch on the springy purple mushroom cap and leaps onto the textured, mossy trunk of the giant mushroom, digging his rounded paws into the thick green bark.",
        actionBeat2: "Babu Yeti scrambles rapidly up the vertical stalk through an arch of glowing mushroom vines and hoists his round tummy onto the broad upper cap, determined face with mouth pressed shut as he gazes at the golden lantern fruit hovering ahead.",
        camera: "Pedestal up from rest, tracking Babu Yeti's vertical scramble up the mossy bark.",
        vfx: "Effects: Small flecks of loose moss and glowing spores tumble downward as paws scramble up the bark, with shallow depth of field softening the dark forest floor far below. Transition: Hard Cut.",
        audio: "Solo wooden flute plays a rhythmic, climbing phrase with quick fluttering notes. Quick scratching climbing sounds on mossy bark, the rustle of clinging vines, and a soft huff of determined effort. No dialogue.",
        panel1: {
          time: "00:00.0–00:01.5",
          title: "SCRAMBLING UP BARK",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "Babu Yeti climbs the vertical mossy stalk of the giant mushroom with both rounded paws gripping the textured bark, his legs scrambling upward and his face determined with a small furrowed brow and mouth pressed shut.",
          effects: "Loose flecks of green moss and tiny glowing spores tumble downward from his paws against the dark background."
        },
        panel2: {
          time: "00:01.5–00:03.0",
          title: "HOISTING ONTO CAP",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "Babu Yeti hoists his round tummy onto the broad upper mushroom cap, planting his rounded feet firmly as he looks forward at the hovering golden fruit with a determined furrowed brow and mouth pressed shut.",
          effects: "Soft golden light reflects across the curved rim of the upper mushroom cap."
        }
      },
      {
        stamp: "00:03 - 00:07",
        type: "Close-Up to Medium Close-Up, Eye Level",
        openingFraming: "Close-Up",
        closingFraming: "Medium Close-Up",
        angle: "Eye Level",
        light: LIGHT_V2_S2,
        expr: "relieved soft smile with eyes relaxed",
        actionBeat1: "On the broad mushroom cap, Babu Yeti reaches both paws forward toward the hovering golden lantern fruit, his oversized eyes glowing with awe and his brow furrowed in determined focus as his fingertips touch its warm, softly pulsating outer rind.",
        actionBeat2: "The golden lantern fruit floats gently into Babu Yeti's open paws, and he draws it tenderly to his chest at frame centre, his determined brow easing into a relieved soft smile with eyes relaxed as golden light bathes his face and mint fur.",
        camera: "Slow arc around Babu Yeti at eye level from frame left to frame right, revealing the hovering golden lantern fruit.",
        vfx: "Effects: A subtle golden lens flare shimmers from the lantern fruit, and glowing light motes swirl gently between Babu Yeti's paws as the fruit meets his touch. Transition: Hard Cut.",
        audio: "Solo wooden flute climbs to its most resonant, sustained peak note, then softens into a tender descending trill. A high shimmering chime from the fruit, a soft hum of warm light, and a quiet gasp of wonder. No dialogue.",
        panel1: {
          time: "00:03.0–00:05.0",
          title: "TOUCHING HOVERING FRUIT",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "On the broad mushroom cap, Babu Yeti extends both rounded paws toward the gently hovering golden lantern fruit, his fingertips just grazing the warm glowing rind with a determined furrowed brow.",
          effects: "A soft golden flare glints at the contact point between his paws and the floating fruit."
        },
        panel2: {
          time: "00:05.0–00:07.0",
          title: "DRAWING FRUIT TO CHEST",
          expr: "relieved soft smile with eyes relaxed",
          action: "Babu Yeti gently gathers the glowing golden lantern fruit against his chest with both rounded paws, his face easing into a relieved soft smile with eyes relaxed under the warm golden illumination.",
          effects: "Golden light motes swirl softly around Babu Yeti's arms as warm light pours over his mint fur."
        }
      },
      {
        stamp: "00:07 - 00:10",
        type: "Medium Close-Up, Eye Level",
        openingFraming: "Medium Close-Up",
        closingFraming: "Medium Close-Up",
        angle: "Eye Level",
        light: LIGHT_V2_S3,
        expr: "gentle closed-mouth smile with soft eyes",
        actionBeat1: "Babu Yeti stands holding the glowing golden fruit closely against his chest with both paws, looking down at its intricate glowing patterns with soft eyes.",
        actionBeat2: "Babu Yeti lifts his chin to gaze out across the forest canopy, his gentle closed-mouth smile deepening as delicate rings of warm golden light ripple softly outward from the fruit across the mushroom cap.",
        camera: "Slow dolly out from a Medium Close-Up to a Medium Shot, easing to a stop in the last half second.",
        vfx: "Effects: Shimmering golden light reflects softly in Babu Yeti's glossy eyes, and a gentle ring of warm light washes across the velvety mushroom surface beneath his feet. Transition: Holds on the final frame.",
        audio: "Solo wooden flute transitions into a slow, warm, lyrical melody. A resonant, soothing harmonic hum from the golden fruit, a gentle rustle of evening wind through the canopy, and a quiet contented sigh. No dialogue.",
        panel1: {
          time: "00:07.0–00:08.5",
          title: "CRADLING GOLDEN PATTERNS",
          expr: "gentle closed-mouth smile with soft eyes",
          action: "Babu Yeti cradles the glowing golden fruit closely against his mint chest with both paws, his chin resting down as he gazes at its spiral rind with a gentle closed-mouth smile and soft eyes.",
          effects: "Warm golden light gleams brightly on the velvety texture of the mushroom cap below his feet."
        },
        panel2: {
          time: "00:08.5–00:10.0",
          title: "GAZING OVER CANOPY",
          expr: "gentle closed-mouth smile with soft eyes",
          action: "Babu Yeti lifts his chin to gaze out across the dark forest canopy, holding the glowing lantern fruit safely against his chest with a gentle closed-mouth smile and soft adoring eyes.",
          effects: "Delicate concentric rings of warm golden light ripple outward across the purple mushroom cap surface."
        }
      }
    ]
  },

  // Video 3
  {
    num: 3,
    title: "The Forest Awakens",
    filmPos: "00:20 - 00:30",
    stage: "Falling Action, Resolution of Act 1",
    env: ENV_GROUND,
    shots: [
      {
        stamp: "00:00 - 00:03",
        type: "Medium Shot to Full Shot, Eye Level",
        openingFraming: "Medium Shot",
        closingFraming: "Full Shot",
        angle: "Eye Level",
        light: LIGHT_V3_S1,
        expr: "gentle closed-mouth smile with soft eyes",
        actionBeat1: "Babu Yeti stands on the giant mushroom cap cradling the golden lantern fruit against his chest with both paws, gazing out over the dark valley with a gentle closed-mouth smile and soft eyes.",
        actionBeat2: "The warm golden light sweeps downward into the valley below, and thousands of tiny violet and cyan night-blossoms across the mossy floor begin to unfurl their petals in luminous waves.",
        camera: "Slow crane up from rest, rising slightly above the mushroom cap to reveal the sprawling forest below.",
        vfx: "Effects: Time-lapse style blooming of thousands of bioluminescent forest flowers across the floor below, with floating golden spores ascending through the darkening air. Transition: Hard Cut.",
        audio: "Solo wooden flute plays an uplifting, swelling melody with rich vibrato. Delicate crystalline chiming sounds of blooming flora, a rising warm breeze through the valley, and a soft wordless murmur of joy. No dialogue.",
        panel1: {
          time: "00:00.0–00:01.5",
          title: "CRADLING ON CAP EDGE",
          expr: "gentle closed-mouth smile with soft eyes",
          action: "Standing near the rounded edge of the giant mushroom cap, Babu Yeti holds the glowing golden lantern fruit against his chest with both paws, his face settled in a gentle closed-mouth smile.",
          effects: "Warm golden light illuminates the curved lip of the mushroom cap against the dim twilight forest."
        },
        panel2: {
          time: "00:01.5–00:03.0",
          title: "NIGHT BLOSSOMS BLOOMING",
          expr: "gentle closed-mouth smile with soft eyes",
          action: "Holding the radiant fruit at frame centre, Babu Yeti looks down into the valley with soft eyes as waves of tiny bioluminescent violet and cyan flowers bloom across the distant forest floor.",
          effects: "Luminous waves of blooming violet and cyan night-blossoms spread outward across the mossy valley below."
        }
      },
      {
        stamp: "00:03 - 00:07",
        type: "Full Shot, Eye Level",
        openingFraming: "Full Shot",
        closingFraming: "Full Shot",
        angle: "Eye Level",
        light: LIGHT_V3_S2,
        expr: "cute playful smile",
        actionBeat1: "Babu Yeti kneels gently on the mushroom cap and nestles the glowing golden lantern fruit securely into a natural cradle of twisting mushroom vines at frame right, where it rests glowing like a warm beacon.",
        actionBeat2: "Babu Yeti steps back and claps his rounded paws together at chest height with a cute playful smile, as towering purple and blue mushrooms across the entire valley brighten to their fullest vibrant glow.",
        camera: "Pan right from Babu Yeti to the glowing lantern fruit resting nestled among mushroom vines, smooth and gentle.",
        vfx: "Effects: Vibrant bioluminescent light bloom washes across the giant mushroom stalks, and clouds of glittering golden spores drift upward into the leafy canopy. Transition: Hard Cut.",
        audio: "Solo wooden flute reaches a triumphant, joyful cadence. Rhythmic chiming of vibrant flowers, a deep resonant chord from the glowing forest, and a happy little chuckle. No dialogue.",
        panel1: {
          time: "00:03.0–00:05.0",
          title: "NESTLING IN VINE CRADLE",
          expr: "gentle closed-mouth smile with soft eyes",
          action: "Babu Yeti kneels on the spongy purple cap at frame left, his rounded paws guiding the glowing golden lantern fruit into a natural nest of twisting mushroom vines at frame right with a gentle closed-mouth smile.",
          effects: "Warm amber light radiates from the resting lantern fruit into the woven vine cradle."
        },
        panel2: {
          time: "00:05.0–00:07.0",
          title: "CLAPPING AT CHEST",
          expr: "cute playful smile",
          action: "Standing back beside the nestled fruit, Babu Yeti claps his rounded paws together at chest height with a cute playful smile, gazing out at the brightly glowing giant mushrooms.",
          effects: "Glittering clouds of golden spores drift upward from the illuminated mushroom caps into the canopy."
        }
      },
      {
        stamp: "00:07 - 00:10",
        type: "Wide Shot to Extreme Wide Shot, High Angle",
        openingFraming: "Wide Shot",
        closingFraming: "Extreme Wide Shot",
        angle: "High Angle",
        light: LIGHT_V3_S3,
        expr: "gentle closed-mouth smile with soft eyes",
        actionBeat1: "Babu Yeti sits contentedly on the mossy edge of the giant mushroom cap beside the glowing lantern fruit at frame right, his rounded feet dangling over the side and paws resting softly on his fluffy tummy.",
        actionBeat2: "Babu Yeti looks out peacefully over the sprawling, brilliantly illuminated mushroom valley as glowing spores drift like stars around him, his face settled in a gentle closed-mouth smile with soft eyes.",
        camera: "Crane up and slow dolly out from Babu Yeti on the mushroom cap, revealing the vast glowing valley, easing to a stop in the last half second.",
        vfx: "Effects: Thousands of tiny luminous spores drift like stars across the vast valley, with soft atmospheric haze and subtle depth of field preserving Babu Yeti's mint fur against the sweeping expanse. Transition: Holds on the final frame.",
        audio: "Solo wooden flute plays a slow, peaceful closing phrase and softly fades into silence. Gentle whispers of night wind, the tranquil hum of the glowing valley, and a soft, contented sleepy sigh. No dialogue.",
        panel1: {
          time: "00:07.0–00:08.5",
          title: "RESTING ON MUSHROOM EDGE",
          expr: "gentle closed-mouth smile with soft eyes",
          action: "Babu Yeti sits at the edge of the giant mushroom cap with his feet dangling over the side, paws resting softly on his fluffy tummy beside the nestled lantern fruit with a gentle closed-mouth smile.",
          effects: "Soft golden light from the fruit illuminates Babu Yeti's mint fur against the sweeping panorama."
        },
        panel2: {
          time: "00:08.5–00:10.0",
          title: "VALLEY OF STARS",
          expr: "gentle closed-mouth smile with soft eyes",
          action: "High above the valley floor, Babu Yeti sits peacefully beside the nestled lantern fruit at frame right, gazing over the vast ocean of glowing violet, blue, and emerald flora with a gentle closed-mouth smile.",
          effects: "Countless glowing spores drift like stars across the wide illuminated Himalayan valley."
        }
      }
    ]
  },

  // Video 4
  {
    num: 4,
    title: "The Canopy Leap",
    filmPos: "00:30 - 00:40",
    stage: "Inciting Incident of Canopy Adventure, start of Rising Action",
    env: ENV_CANOPY,
    shots: [
      {
        stamp: "00:00 - 00:03",
        type: "Medium Shot to Full Shot, Eye Level",
        openingFraming: "Medium Shot",
        closingFraming: "Full Shot",
        angle: "Eye Level",
        light: LIGHT_V4_S1,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        actionBeat1: "Babu Yeti takes a vigorous running sprint across the broad, spongy cap of a towering giant mushroom at frame centre, his mint fur rippling with momentum.",
        actionBeat2: "Reaching the rounded edge of the mushroom cap, Babu Yeti plants both large rounded feet firmly and crouches low in preparation to jump, his face set in a determined furrowed brow with mouth pressed shut.",
        camera: "Tracking shot moving forward at eye level, following Babu Yeti's rapid sprint across the spongy mushroom surface.",
        vfx: "Effects: Delicate clouds of golden spores puff up beneath his running feet, with shallow depth of field softening the leafy canopy far behind. Transition: Hard Cut.",
        audio: "Solo wooden flute begins a lively, rhythmic tempo with rising trills. Soft squelch of running paws on spongy fungus, light rustle of the evening breeze, and a faint magical chime from the canopy. No dialogue.",
        panel1: {
          time: "00:00.0–00:01.5",
          title: "MUSHROOM SPRINT START",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "Babu Yeti sprints vigorously across the spongy cap of the towering giant mushroom at frame centre, his mint fur rippling with momentum and eyes fixed ahead.",
          effects: "Delicate clouds of golden spores puff up beneath his running feet against the soft violet ambient."
        },
        panel2: {
          time: "00:01.5–00:03.0",
          title: "EDGE CROUCH PREPARATION",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "At the rounded edge of the giant mushroom cap, Babu Yeti plants both large rounded feet firmly and crouches low to jump, with arms coiled back and face set in determined focus.",
          effects: "Tiny golden spores swirl in gentle eddies around his planted feet."
        }
      },
      {
        stamp: "00:03 - 00:07",
        type: "Wide Shot, Low Angle",
        openingFraming: "Wide Shot",
        closingFraming: "Wide Shot",
        angle: "Low Angle",
        light: LIGHT_V4_S2,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        actionBeat1: "Babu Yeti launches boldly into a massive forward leap over the misty chasm, his heavy arms outstretched forward in a heroic gliding pose toward a glowing azure crystal bird soaring through the upper branches.",
        actionBeat2: "The swift crystal bird glides smoothly ahead into the high misty foliage, while Babu Yeti hangs suspended at the highest point of his leap with his determined furrowed brow focused ahead.",
        camera: "Low-angle tracking shot moving right, capturing Babu Yeti mid-flight against the towering bioluminescent canopy.",
        vfx: "Effects: A shimmering trail of fine crystalline dust follows the soaring bird, and soft atmospheric mist drifts across the lower chasm. Transition: Hard Cut.",
        audio: "Solo wooden flute swells into a high, soaring melodic line. A sweeping rush of air past his leaping body, the delicate glass-like call of the crystal bird, and the whisper of distant leaves. No dialogue.",
        panel1: {
          time: "00:03.0–00:05.0",
          title: "MID-AIR CANOPY LEAP",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "Suspended over the misty chasm, Babu Yeti flies forward in a heroic gliding pose with arms outstretched toward the glowing azure crystal bird soaring higher ahead.",
          effects: "Soft atmospheric mist drifts across the lower chasm below his leaping silhouette."
        },
        panel2: {
          time: "00:05.0–00:07.0",
          title: "CRYSTAL BIRD PURSUIT",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "High above the chasm at the apex of his leap, Babu Yeti hangs suspended with eyes locked on the crystal bird as it glides swiftly into the upper foliage.",
          effects: "A shimmering trail of fine crystalline dust follows the soaring crystal bird across the canopy."
        }
      },
      {
        stamp: "00:07 - 00:10",
        type: "Close-Up to Medium Close-Up, Low Angle",
        openingFraming: "Close-Up",
        closingFraming: "Medium Close-Up",
        angle: "Low Angle",
        light: LIGHT_V4_S3,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        actionBeat1: "In mid-air profile, Babu Yeti's oversized eyes stay fixed on the misty canopy ahead, his chubby cheeks pressed by the wind and his curly tuft streaming back.",
        actionBeat2: "Babu Yeti begins his downward arc through the mist, twisting his torso around with a determined furrowed brow as his eyes spot a thick glowing coiled creeper below.",
        camera: "Tracking shot moving alongside Babu Yeti in profile, easing to a stop in the last half second.",
        vfx: "Effects: Luminous golden spores drift past in shallow focus, with motion blur on the passing background branches only. Transition: Holds on the final frame.",
        audio: "Solo wooden flute sustains a tense, fluttering note. Continuous rushing wind against fur, a sharp intake of breath, and the faint creak of distant boughs. No dialogue.",
        panel1: {
          time: "00:07.0–00:08.5",
          title: "WINDSWEPT TODDLER FOCUS",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "In mid-air profile, Babu Yeti's oversized glossy eyes gaze forward with unwavering focus, his chubby cheeks pressed by rushing air and his single curly tuft streaming back.",
          effects: "Luminous golden spores drift past in shallow focus against the blurred dark branches."
        },
        panel2: {
          time: "00:08.5–00:10.0",
          title: "CREEPER SPOTTED BELOW",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "Beginning his downward descent through the mist, Babu Yeti twists his torso downward as his eyes lock onto a thick glowing coiled creeper hanging from a colossal branch below.",
          effects: "Faint motion blur softens the passing tree boughs behind his turning form."
        }
      }
    ]
  },

  // Video 5
  {
    num: 5,
    title: "The Luminous Vine Slingshot",
    filmPos: "00:40 - 00:50",
    stage: "Rising Action",
    env: ENV_CANOPY,
    shots: [
      {
        stamp: "00:00 - 00:03",
        type: "Medium Shot, Low Angle",
        openingFraming: "Medium Shot",
        closingFraming: "Medium Shot",
        angle: "Low Angle",
        light: LIGHT_V5_S1,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        actionBeat1: "Descending from his leap, Babu Yeti extends both rounded paws toward the thick, glowing coiled root wrapped around a colossal tree branch at frame centre.",
        actionBeat2: "Babu Yeti clamps both paws securely around the springy, luminous vine and bends his knees, his face determined with a small furrowed brow and mouth pressed shut as the vine takes his weight.",
        camera: "Whip pan from rest locking onto the thick coiled root on the colossal branch ahead, then tracking Babu Yeti's grab.",
        vfx: "Effects: A shower of golden spores bursts from the coiled creeper as paws grip the bark, with depth of field softening the distant forest floor. Transition: Hard Cut.",
        audio: "Solo wooden flute drops into a rapid, driving low rhythm. A deep fibrous creak as the vine stretches, the thud of rounded paws gripping bark, and a puff of settling spores. No dialogue.",
        panel1: {
          time: "00:00.0–00:01.5",
          title: "REACHING FOR ROOT",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "Descending rapidly through the air, Babu Yeti stretches both rounded paws outward toward the thick glowing coiled root wrapped around the colossal branch.",
          effects: "A few loose golden spores drift away from the approaching creeper."
        },
        panel2: {
          time: "00:01.5–00:03.0",
          title: "SECURE VINE CLAMP",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "Clamping both paws securely around the springy luminous creeper, Babu Yeti bends his chubby legs as the taut vine flexes under his weight.",
          effects: "A bright puff of golden spores bursts from the creeper where his paws clamp the bark."
        }
      },
      {
        stamp: "00:03 - 00:07",
        type: "Full Shot, Eye Level",
        openingFraming: "Full Shot",
        closingFraming: "Full Shot",
        angle: "Eye Level",
        light: LIGHT_V5_S2,
        expr: "cute playful smile",
        actionBeat1: "Gripping the elastic vine firmly, Babu Yeti swings into a wild, centrifugal 360-degree loop around the colossal branch, his mint body trailing a ribbon of bright motion.",
        actionBeat2: "Babu Yeti reaches the bottom of the second rotation with his cheeks flushed and eyes wide with excitement, flashing a cute playful smile as the vine draws back like a taut bowstring.",
        camera: "Circular tracking shot revolving rapidly around the branch matched to Babu Yeti's rotation speed.",
        vfx: "Effects: Glowing golden spore trails streak in circular arcs around the rotating bough, with subtle motion blur on the spinning vine. Transition: Hard Cut.",
        audio: "Solo wooden flute spins through dizzying, rising arpeggios. A whistling rush of centrifugal air, the rhythmic groan of the taut vine, and a joyful toddler squeal. No dialogue.",
        panel1: {
          time: "00:03.0–00:05.0",
          title: "WILD CENTRIFUGAL SPIN",
          expr: "cute playful smile",
          action: "Swinging around the colossal branch in a wide centrifugal loop, Babu Yeti leans into the curve with both rounded paws gripping the elastic creeper.",
          effects: "Glowing golden spore trails streak in circular arcs along his curved swinging path."
        },
        panel2: {
          time: "00:05.0–00:07.0",
          title: "MAXIMUM ROTATION SMILE",
          expr: "cute playful smile",
          action: "At the lowest arc of the spin, Babu Yeti holds the drawn-back vine like a taut bowstring, his cheeks flushed and face beaming in a cute playful smile.",
          effects: "Brilliant rings of glowing neon spore dust surround the flexed vine at peak tension."
        }
      },
      {
        stamp: "00:07 - 00:10",
        type: "Wide Shot to Extreme Wide Shot, Low Angle",
        openingFraming: "Wide Shot",
        closingFraming: "Extreme Wide Shot",
        angle: "Low Angle",
        light: LIGHT_V5_S3,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        actionBeat1: "Babu Yeti releases his paws at the peak of the spin and launches vertically straight upward through the luminous spore clouds like an arrow.",
        actionBeat2: "Babu Yeti ascends rapidly through the upper canopy toward the high mushroom caps, his paws outstretched above his chest with a determined furrowed brow and mouth pressed shut.",
        camera: "Vertical pedestal up following Babu Yeti's rapid upward slingshot trajectory, easing to a stop in the last half second.",
        vfx: "Effects: A vertical column of sparkling golden spores billows outward from the released vine, with soft bokeh blurring the dizzying drop below. Transition: Holds on the final frame.",
        audio: "Solo wooden flute shoots up to an intense, held high whistle. A resonant twang as the root recoils, a tremendous vertical rush of wind, and fading chiming echoes. No dialogue.",
        panel1: {
          time: "00:07.0–00:08.5",
          title: "VERTICAL LAUNCH RELEASE",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "Releasing his grip at the crest of the spin, Babu Yeti rockets vertically upward into the air like an arrow, surrounded by a swirl of golden light.",
          effects: "A vertical column of sparkling golden spores billows outward from the released root."
        },
        panel2: {
          time: "00:08.5–00:10.0",
          title: "ASCENT THROUGH SPORES",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "High above the colossal branches, Babu Yeti ascends rapidly toward the glowing mushroom canopy with paws held above his chest and a determined furrowed brow.",
          effects: "Soft bokeh blurs the dizzying drop of the twilight forest floor far below."
        }
      }
    ]
  },

  // Video 6
  {
    num: 6,
    title: "The Falling Lantern Branch Rescue",
    filmPos: "00:50 - 01:00",
    stage: "Rising Action, Climax (peaks at 00:05 on this clock, film 00:55, at the end of Shot 2's first beat), start of Falling Action",
    env: ENV_CANOPY,
    shots: [
      {
        stamp: "00:00 - 00:03",
        type: "Close-Up to Medium Close-Up, High Angle",
        openingFraming: "Close-Up",
        closingFraming: "Medium Close-Up",
        angle: "High Angle",
        light: LIGHT_V6_S1,
        expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
        actionBeat1: "Reaching the crest of his upward launch, Babu Yeti intercepts a massive drooping bough laden with heavy, glowing golden lantern fruit at frame centre.",
        actionBeat2: "Babu Yeti locks both paws firmly onto the thick underside of the buckling branch, his brow furrowed in determined focus as he prepares to brace its falling weight.",
        camera: "Tilt down from rest, tracking Babu Yeti's paws as he locks onto the drooping branch.",
        vfx: "Effects: Golden light motes pulse brightly from the jostled lantern fruit, and loose bark flakes drift down into the misty void. Transition: Hard Cut.",
        audio: "Solo wooden flute slows into a strained, heavy cadence. A sharp thud of paws clasping the bough, the ominous groan of splintering wood, and a deep grunt of effort. No dialogue.",
        panel1: {
          time: "00:00.0–00:01.5",
          title: "INTERCEPTING DROOPING BOUGH",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "Reaching the peak of his launch, Babu Yeti extends both rounded paws toward the thick sagging bough heavy with glowing golden lantern fruit.",
          effects: "Golden light motes pulse softly from the trembling lantern fruit."
        },
        panel2: {
          time: "00:01.5–00:03.0",
          title: "BRACING FRUIT WEIGHT",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "Babu Yeti locks both rounded paws firmly beneath the drooping branch, bracing his sturdy body as the heavy bough sags downward.",
          effects: "Loose flakes of dry bark tumble away into the misty air below."
        }
      },
      {
        stamp: "00:03 - 00:07",
        type: "Medium Shot, Low Angle",
        openingFraming: "Medium Shot",
        closingFraming: "Medium Shot",
        angle: "Low Angle",
        light: LIGHT_V6_S2,
        expr: "relieved soft smile with eyes relaxed",
        actionBeat1: "Wedged beneath the sagging bough, Babu Yeti plants his sturdy feet on the trunk ledge and heaves upward with his rounded shoulders, his straining face grimacing with effort until the heavy branch clicks into its natural notch against the trunk.",
        actionBeat2: "The locking joint snaps securely shut with the heavy golden lantern fruit resting safely balanced, and Babu Yeti breathes a heavy sigh of relief while keeping both paws flat against the wood with a relieved soft smile.",
        camera: "Slow arc around Babu Yeti at a low angle, capturing his physical heave against the heavy branch.",
        vfx: "Effects: Golden dust and glowing amber flakes puff outward from the locking branch notch, and radiant warm light pours across Babu Yeti's mint fur. Transition: Hard Cut.",
        audio: "Solo wooden flute climbs to a powerful, strained peak chord, resolving into a solid resonant cadence. Heavy straining grunts, a loud wooden snap as the joint clicks into place, and an exhausted, relieved exhale. No dialogue.",
        panel1: {
          time: "00:03.0–00:05.0",
          title: "HEROIC SHOULDER HEAVE",
          expr: "straining face with a furrowed brow and mouth pulled into a grimace, no smile",
          action: "Wedged beneath the sagging bough, Babu Yeti braces his feet against the trunk ledge and heaves upward with his sturdy shoulders, his face grimacing with straining effort.",
          effects: "Glowing amber dust and bark flecks puff outward from the strained wood."
        },
        panel2: {
          time: "00:05.0–00:07.0",
          title: "LOCKING JOINT SNAP",
          expr: "relieved soft smile with eyes relaxed",
          action: "As the bough clicks firmly into its natural notch against the trunk, Babu Yeti holds his paws flat against the bark with a heavy, relieved exhale and a soft smile.",
          effects: "Radiant warm golden light pours across Babu Yeti's mint fur from the secured lantern fruit."
        }
      },
      {
        stamp: "00:07 - 00:10",
        type: "Medium Close-Up to Medium Shot, Low Angle",
        openingFraming: "Medium Close-Up",
        closingFraming: "Medium Shot",
        angle: "Low Angle",
        light: LIGHT_V6_S3,
        expr: "cute playful smile",
        actionBeat1: "Babu Yeti tests the firm branch with a satisfied pat of his paws, confirming the cluster of heavy golden lantern fruit is firmly secured against the trunk.",
        actionBeat2: "Babu Yeti stands proud on the sturdy bough with one paw raised in a cheerful wave and his face beaming in a cute playful smile, bathed in warm amber light.",
        camera: "Steadicam gliding smoothly beside Babu Yeti along the secured branch, easing to a stop in the last half second.",
        vfx: "Effects: Warm amber light gleams along the mossy bough, and sparkling spores drift quietly around the secured lantern fruit. Transition: Holds on the final frame.",
        audio: "Solo wooden flute plays a bright, proud celebratory flourish. Gentle creak of the stable branch, the soft patter of his paws, and a happy little giggle. No dialogue.",
        panel1: {
          time: "00:07.0–00:08.5",
          title: "FIRM BOUGH CONFIRMATION",
          expr: "cute playful smile",
          action: "Testing the stable branch with a gentle pat of his rounded paws, Babu Yeti confirms the heavy cluster of glowing lantern fruit rests safely balanced.",
          effects: "Warm amber light gleams along the mossy bough."
        },
        panel2: {
          time: "00:08.5–00:10.0",
          title: "PROUD AMBER WAVE",
          expr: "cute playful smile",
          action: "Standing proud on the sturdy bough under the glowing lantern fruit, Babu Yeti raises one paw in a cheerful wave with his face beaming in a cute playful smile.",
          effects: "Sparkling spores drift quietly around the secured lantern fruit in the warm golden key light."
        }
      }
    ]
  },

  // Video 7
  {
    num: 7,
    title: "The Mid-Air Tumble and Mushroom Cradle",
    filmPos: "01:00 - 01:10",
    stage: "Falling Action, Grand Resolution",
    env: ENV_CANOPY,
    shots: [
      {
        stamp: "00:00 - 00:03",
        type: "Medium Shot, Low Angle",
        openingFraming: "Medium Shot",
        closingFraming: "Medium Shot",
        angle: "Low Angle",
        light: LIGHT_V7_S1,
        expr: "alarmed face with oversized eyes opened wide and mouth open in a small gasp, no smile",
        actionBeat1: "On the secured bough, Babu Yeti notices a tiny bioluminescent forest sprite lose its grip on a swaying vine nearby and plummet toward the misty lower canopy.",
        actionBeat2: "Babu Yeti's oversized eyes open wide in an alarmed small gasp, and he immediately kicks off the wooden ledge to dive downward after the falling creature.",
        camera: "Tilt down from rest, following the tiny falling sprite and Babu Yeti's sudden dive.",
        vfx: "Effects: A faint trail of blue sparks drops with the tumbling sprite, and loose twigs fall away from the bough into the mist. Transition: Hard Cut.",
        audio: "Solo wooden flute drops abruptly into a fast, urgent fluttering line. A tiny startled squeak from the sprite, the sharp thud of Babu Yeti springing off wood, and a quick gasp of breath. No dialogue.",
        panel1: {
          time: "00:00.0–00:01.5",
          title: "FALLING SPRITE ALARM",
          expr: "alarmed face with oversized eyes opened wide and mouth open in a small gasp, no smile",
          action: "Standing on the secured bough, Babu Yeti turns in shock as a tiny bioluminescent forest sprite slips from a swaying vine and falls toward the mist.",
          effects: "A tiny trail of blue sparks begins to tumble with the falling sprite."
        },
        panel2: {
          time: "00:01.5–00:03.0",
          title: "DIVE FROM LEDGE",
          expr: "alarmed face with oversized eyes opened wide and mouth open in a small gasp, no smile",
          action: "With oversized eyes wide in an alarmed small gasp, Babu Yeti kicks boldly off the wooden ledge and dives downward into the open air after the falling creature.",
          effects: "Loose twigs and moss flecks fall away from the bough into the mist."
        }
      },
      {
        stamp: "00:03 - 00:07",
        type: "Full Shot to Medium Shot, Low Angle",
        openingFraming: "Full Shot",
        closingFraming: "Medium Shot",
        angle: "Low Angle",
        light: LIGHT_V7_S2,
        expr: "relieved soft smile with eyes relaxed",
        actionBeat1: "Diving through the misty air in a graceful mid-air somersault, Babu Yeti extends both fluffy paws and gently scoops the tiny chirping sprite safely into his cupped palms.",
        actionBeat2: "Babu Yeti cradles the trembling sprite safely against his chest as his descent curves smoothly toward a wide, soft purple mushroom cap below, his face relaxing into a relieved soft smile.",
        camera: "Slow-motion downward tracking shot following Babu Yeti's dive and somersault.",
        vfx: "Effects: Slight slow motion emphasizes the gentle mid-air scoop, with soft cyan sparkles cascading between his rounded paws. Transition: Hard Cut.",
        audio: "Solo wooden flute eases from urgent trills into a tender, floating melody. A gentle whoosh of air during the roll, a tiny relieved chirp from the sprite, and the soft rustle of fur. No dialogue.",
        panel1: {
          time: "00:03.0–00:05.0",
          title: "MID-AIR SOMERSAULT SCOOP",
          expr: "determined face with a small furrowed brow and mouth pressed shut, no smile",
          action: "Mid-air in a smooth somersault, Babu Yeti extends both rounded paws forward and gently scoops the falling forest sprite into his cupped palms.",
          effects: "Soft cyan sparkles cascade between his rounded paws in gentle slow motion."
        },
        panel2: {
          time: "00:05.0–00:07.0",
          title: "CURVING CAP DESCENT",
          expr: "relieved soft smile with eyes relaxed",
          action: "Cradling the trembling little sprite safely against his chest fur, Babu Yeti curves smoothly downward toward a wide soft purple mushroom cap below, his face relaxing into a relieved soft smile.",
          effects: "Warm amber rim light from the high canopy illuminates his descending form."
        }
      },
      {
        stamp: "00:07 - 00:10",
        type: "Medium Close-Up, Eye Level",
        openingFraming: "Medium Close-Up",
        closingFraming: "Medium Close-Up",
        angle: "Eye Level",
        light: LIGHT_V7_S3,
        expr: "gentle closed-mouth smile with soft eyes",
        actionBeat1: "Babu Yeti slides gently onto the velvety purple mushroom cap and sits down comfortably, his rounded feet tucked beneath his round tummy.",
        actionBeat2: "Babu Yeti cradles the glowing little sprite tenderly against his fluffy tummy with both paws, resting his chin down with a gentle closed-mouth smile and soft adoring eyes as the peaceful forest glows.",
        camera: "Smooth tracking shot gliding over the purple mushroom cap to settle on Babu Yeti cradling the sprite, easing to a stop in the last half second.",
        vfx: "Effects: Soft cyan light pulses gently from the comforting sprite onto Babu Yeti's mint chest fur, with tiny golden spores floating lazily through the background. Transition: Holds on the final frame.",
        audio: "Solo wooden flute plays a slow, peaceful lullaby theme and gently fades into silence. Soft purring hum from the calmed sprite, a gentle evening breeze through the canopy, and a quiet, contented sigh. No dialogue.",
        panel1: {
          time: "00:07.0–00:08.5",
          title: "VELVET CAP LANDING",
          expr: "gentle closed-mouth smile with soft eyes",
          action: "Sliding gently onto the velvety purple mushroom cap, Babu Yeti sits down comfortably with rounded feet tucked beneath his round tummy, his paws sheltering the sprite.",
          effects: "Tiny golden spores drift lazily across the velvety purple mushroom surface."
        },
        panel2: {
          time: "00:08.5–00:10.0",
          title: "PEACEFUL SPRITE CRADLE",
          expr: "gentle closed-mouth smile with soft eyes",
          action: "Babu Yeti cradles the glowing little sprite tenderly against his fluffy tummy with both rounded paws, resting his chin down with a gentle closed-mouth smile and soft adoring eyes.",
          effects: "Soft cyan light pulses gently from the comforted sprite onto Babu Yeti's mint chest fur."
        }
      }
    ]
  }
];

function generateStoryboardDoc(title, durationStr, videoCount) {
  let doc = `# ${title}\n\n`;
  doc += `Babu Yeti embarks on an epic 7-part adventure through the glowing mushroom forest of a mystical Himalayan valley: discovering the hovering golden lantern fruit atop towering mushrooms, ascending to awaken the entire valley in luminous blooming colour, leaping across a misty chasm in pursuit of a soaring azure crystal bird, slingshotting vertically upward through spore clouds on a coiled luminous creeper, heaving a falling bough of heavy golden lantern fruit safely back into its notch, and diving mid-air to rescue a tumbling forest sprite, ending with the baby Yeti cradling the glowing creature safely on a soft purple mushroom cap. The tone is wondrous, adventurous, heroic, and deeply tender. It has been strictly formatted for AI video generation according to character styling rules, environment locks, cinematic direction, and social media prompt guidelines.\n\n`;

  doc += `## Agent instructions\n\n`;
  doc += `This storyboard is seven 10-second Google Flow videos that cut together into one 70-second scene. The file holds the video prompts only: each video's \`Character locks:\` block and table, pasted together, are the text prompt for one Flow generation. The images each clip is generated with, the video's six panel images and the 3x2 grid composed from them, are listed in \`prompts/babu-yeti-glowing-mushroom-bloom-70s-3x2.md\` under the same \`## Video N - <Title>\` heading, with the steps for generating and checking them. No clip starts or ends on a supplied frame.\n\n`;
  doc += `Follow these steps in order.\n\n`;
  doc += `1. Before generating a clip, generate its video's six panel images, check them, and compose its grid from them, as \`prompts/babu-yeti-glowing-mushroom-bloom-70s-3x2.md\` says. If that file does not exist, run \`/create-3x2-timed-image\` on this storyboard to write it. Do not generate a clip without its images.\n`;
  doc += `2. Set Flow's output format to vertical 9:16 before generating any clip, and check it again before each one. Flow falls back to 16:9 on a new session.\n`;
  doc += `3. Generate Video 1 in Flow's ingredients-to-video mode. Attach the Video 1 images for the route you pick in the 3x2 file: the six panel images (\`Panel_1_V1.jpg\` to \`Panel_6_V1.jpg\`) and the family reference image, which is seven images and the most Flow accepts for one clip, or the composed grid (\`Grid_V1.jpg\`) and the family reference image. Paste the Video 1 \`Character locks:\` block and then its three table rows, in order, as one prompt, VFX cells included. Do not generate the rows separately, do not leave the locks out, and do not set a start or an end frame.\n`;
  doc += `4. Check the clip: vertical 9:16, and it matches its video's grid panels and panel images in pose, expression, colour, tuft, size, head, framing, and light, each at its timecode. No Yeti changes colour, grows or shrinks, or picks up clothing partway through, and none of the grid's label text appears. The camera moves the way each \`Camera:\` sentence says, and no effect appears that its \`Effects:\` sentence does not name. If it drifts, regenerate the clip before continuing; do not fix it in the edit.\n`;
  doc += `5. Generate Video 2 the same way, with its own images, its own \`Character locks:\` block, and its own table. Its first beat picks up the picture Video 1 ended on, under the same light. Put the end of the Video 1 clip beside the start of the new clip and regenerate the new clip if the cut jumps in position, face, colour, or light. Repeat the checks in step 4.\n`;
  doc += `6. Generate Videos 3, 4, 5, 6, and 7 the same way, repeating the handoff and visual checks.\n`;
  doc += `7. Cut the seven clips together in order with hard cuts and no other transitions. Keep the audio continuous across the cuts. Apply one colour grade to the whole cut, matched to the palette in the \`Lighting lock:\` paragraph, so the seven clips read as one film. Do not retime any clip; each one stays exactly 10 seconds.\n\n`;

  doc += `Every video's table runs on its own 00:00 - 00:10 clock. Paste one video into Flow at a time: its \`Character locks:\` block and its table, and nothing else. The \`Film position:\` and \`Stage:\` lines under each heading say where the clip sits in the finished 70-second cut and which stages it carries; they are for the operator and the editor, not for Flow. If Flow produces more than one clip, a clip longer than 10 seconds, or a timing error, the prompt contained timestamps above 00:10. Remove them and retry.\n\n`;

  doc += `Every visual cell opens with \`Vertical 9:16 aspect ratio, full-frame vertical composition.\` Keep that line in the prompt even when Flow's output format is already set to 9:16. The setting and the line together are what stop it reverting to widescreen. If a clip renders 16:9, regenerate it with the format reset rather than cropping, because cropping throws away the top and bottom of the framing.\n\n`;

  doc += `Do not change the character lock, the aspect ratio line, style lock, \`Environment:\` sentences, \`Lighting:\` sentences, \`Characters:\` sentences, avoid line, or the \`Creatures:\` sentence in any prompt. The images in the 3x2 file were generated with those locks and under that light, so a clip prompt with different ones fights the images attached to it. Only the \`Expressions:\` sentences, the \`Action:\` text, the \`Camera:\` and VFX text, and the audio text differ between shots, and each \`Expressions:\` sentence is already set to match its beat.\n\n`;

  doc += `Babu Yeti is the sole main character and hero of this film. He wears nothing, has no clothing, no sash, no claws, no fangs, square white cartoon teeth, a single curly tuft of mint-green fur, and solid mint-green fur from head to toe. Papa Yeti and Mama Yeti do not appear in this film. Supporting creatures include the glowing crystal bird in Video 4 and the tiny bioluminescent forest sprite in Video 7; both are stylized cartoon forest fauna and never take hero beats away from Babu Yeti.\n\n`;

  doc += `If Flow rejects a clip, read the message. "This prompt may violate our policies" is the safety filter, and the cause is almost always a brand, a real device, a named stock sound effect, on-screen text, dialogue, or an effect that reads as harm. "I can't generate the video you requested right now due to interests of third-party content providers" is the copyright filter, and the cause is a name, a style, a song, a named look, or an \`Action:\` or \`Effects:\` sentence that reads like a famous film moment. Hand the prompt to Flow's agent first: it can see what the filter matched, which the message does not say. Give it this request, with the refused prompt pasted under it:\n\n`;

  doc += `> This prompt was refused with "I can't generate the video you requested right now due to interests of third-party content providers." Find what triggered the refusal and rewrite the prompt so it passes. Keep the three rows and their timestamps (00:00 - 00:03, 00:03 - 00:07, 00:07 - 00:10), and keep each \`Action:\` at two sentences, one per beat. Change only the \`Action:\` sentences, the \`Camera:\` sentences, the VFX cells, and the audio text. Do not change, shorten, or reorder the character locks above the table, the aspect ratio line, the style lock, the \`Environment:\` sentence, the \`Lighting:\` sentences, the \`Characters:\` and \`Expressions:\` sentences, the \`Creatures:\` sentence, or the \`Avoid:\` sentence. Keep every story beat, keep the solo wooden flute as the only instrument, keep "No dialogue." at the end of each audio cell, and tell me what you changed and why.\n\n`;

  doc += `Check the agent's rewrite before generating: every locked sentence must still be there word for word, no timestamp may be above 00:10, every \`Action:\` must still have two beats, and every audio cell must end with "No dialogue." If the agent touched a lock, paste the original lock back over its version. Once the rewritten prompt passes, copy its \`Action:\`, \`Camera:\`, VFX, and audio changes back into this storyboard, rewrite that video's panel images in the 3x2 file to match, regenerate them, and compose its grid again, and note what the agent said the trigger was so the next storyboard avoids it. The later videos are then written against what was actually generated.\n\n`;

  doc += `If the agent cannot clear it, or there is no agent in the session, work through these retries in order, one change at a time, and stop at the first that passes: (1) replace every audio cell with "Soft background music. No dialogue."; (2) replace every VFX cell with \`Effects: None. Transition: Hard Cut.\` (\`Holds on the final frame.\` in the last row); (3) cut each \`Action:\` beat to its main clause, keeping two beats; (4) remove the \`Avoid:\` sentence from the clip prompt only, since a word like "horror" or "sharp teeth" can trip a filter even in a list of things to avoid, and the attached images keep it and carry the look into the clip; (5) swap the attached images for the other route's (the grid and the family reference image for the six panel images and the family reference image, or the other way round), or generate from the table alone with no images attached and check the clip against the panel images, because the filter judges the attached images along with the prompt. Never change or drop a character lock, the \`Lighting:\` sentences, or any other lock.\n\n`;

  doc += `Aspect ratio lock: vertical 9:16 for every clip, set in Flow's output format and stated in the first line of every prompt.\n\n`;

  doc += `Character lock: Babu Yeti is the only Yeti in this film. Each video's \`Character locks:\` block holds his full Copy-Ready Google Flow Character Lock from \`.agents/rules/character-consistency.md\`, word for word, and nothing else; Papa Yeti and Mama Yeti do not appear, and their locks are in no prompt. Babu Yeti is mint green with a single curly tuft, one solid colour with a smooth, matte, lighter face and paws, and he wears nothing. He is in all twenty-one shots of the film. His lock sizes him against a grown-up Yeti and names the blue and pink Yetis' tufts in its closing clause, and the family reference image shows all three Yetis, so a clip may add a blue or pink Yeti: regenerate any clip or image that has one, or any other extra Yeti. No Yeti has horns or anything on its head besides its tuft. Babu Yeti holds props and creatures at chest height, and nothing is ever raised over his head. Run the look check in section 7 of \`.agents/rules/prompt-assembly.md\` on every clip. A clip with anything on Babu Yeti's head, or with any Yeti off its lock, is regenerated and never used.\n\n`;

  doc += `Creature lock: one glowing crystal bird with translucent azure wings and a shimmering crest appearing in Video 4, and one tiny bioluminescent forest sprite with round golden eyes and delicate glowing gossamer wings appearing in Video 7. The \`Creatures:\` sentence is copied word for word into every prompt. Both are stylized cartoon woodland creatures that Babu Yeti interacts with gently.\n\n`;

  doc += `Prop lock: one hovering golden lantern fruit, a spherical botanical night-fruit with an intricate spiral patterned rind that glows warmly from within in Videos 1 to 3, thick glowing coiled roots and creepers in Video 5, and a cluster of heavy glowing golden lantern fruit in Video 6. No brands, labels, packaging, or artificial devices. No dialogue in any shot.\n\n`;

  doc += `Lighting lock: motivated bioluminescent forest lighting. Key sources include the glowing blue and violet giant mushrooms, the warm golden lantern fruit, drifting luminous spores, and the dim evening canopy. Video 1 opens in soft cool violet and blue ambient light with golden spore accents; in Shot 2 the warm golden light from the distant mushroom cap intensifies; in Shot 3 the golden glow from above provides motivated key. Video 2 opens under that same bold key and violet ambient light; in Shot 2 the golden lantern fruit becomes the dominant warm key light; in Shot 3 that golden warmth softens across the mushroom cap. Video 3 opens under the same warm golden key; in Shot 2 the awakened glowing flowers across the valley floor add radiant pink and cyan fill; and in Shot 3 the entire valley is bathed in harmonious golden, emerald, and violet ambient light. Video 4 opens under that same radiant golden and emerald ambient light; in Shot 2 the cool indigo fill contrasts with vibrant cyan highlights as Babu leaps; in Shot 3 that thrilling indigo-cyan palette continues. Video 5 opens under that cool indigo key and cyan fill; in Shot 2 the rapid centrifugal spin kicks up swirling neon violet and amber spore trails; in Shot 3 the golden rim light sharpens against the deep blue canopy. Video 6 opens under that dynamic golden rim and violet shadow; in Shot 2 the golden lantern fruit becomes the dominant key light as Babu heaves the branch upward; in Shot 3 the warm amber glow settles into a triumphant steady wash. Video 7 opens under that warm amber key; in Shot 2 the golden key from above combines with gentle cyan fill as Babu catches the falling sprite; and in Shot 3 the entire space settles into a soft, tranquil honey-gold and violet palette for the Resolution. Every clip keeps a soft warm light on the fur. The light at each handoff is the same on both sides of the cut.\n\n`;

  doc += `VFX lock: Video 1 has subtle floating golden spores in the foreground and soft light bloom from the distant fruit. Video 2 has loose moss particles, a subtle golden lens flare from the lantern fruit, and soft rings of light washing across the mushroom cap. Video 3 has the time-lapse blooming of bioluminescent forest blossoms, rising clouds of glittering spores, and atmospheric luminous haze across the wide valley. Video 4 has floating golden spores, delicate crystalline dust from the crystal bird, and drifting atmospheric mist. Video 5 has loose moss particles, swirling streaks of glowing spore trails, and a vertical column of sparkling golden spores from the released vine. Video 6 has pulsing golden light motes, loose bark flakes, and glowing amber dust settling from the locking branch notch. Video 7 has a faint trail of blue sparks from the falling sprite, slight slow motion during the mid-air scoop, and a gentle pulsating cyan glow from the cradled creature. No effect comes from Babu Yeti's body, and no effect appears in a video that this paragraph does not give it to.\n\n`;

  for (const v of allVideos) {
    doc += `## Video ${v.num} - ${v.title}\n\n`;
    doc += `Film position: ${v.filmPos}.\n\n`;
    doc += `Stage: ${v.stage}.\n\n`;
    doc += `Character locks:\n\n\`\`\`\n${BABU_LOCK}\n\`\`\`\n\n`;
    doc += `| Timestamp | Shot Type | Visual Description / Prompt | VFX | Audio / Sound FX |\n`;
    doc += `| --- | --- | --- | --- | --- |\n`;
    for (const s of v.shots) {
      const visual = `Vertical 9:16 aspect ratio, full-frame vertical composition. ${STYLE_LOCK} ${v.env} ${s.light} Characters: Babu Yeti. Expressions: Babu Yeti, ${s.expr}. ${CREATURES} ${AVOID} Action: ${s.actionBeat1} ${s.actionBeat2} Camera: ${s.camera}`;
      doc += `| **${s.stamp}** | ${s.type} | ${visual} | ${s.vfx} | ${s.audio} |\n`;
    }
    doc += `\n`;
  }

  return doc;
}

function generate3x2Doc(slug) {
  let doc = `# Babu Yeti Glowing Mushroom Bloom 70s Panel Images and 3x2 Grids\n\n`;
  doc += `Image prompts for \`prompts/${slug}-70s-storyboard.md\`, which holds the video prompts. Each 10-second video has, under its own heading, six panel image prompts, one per beat of its storyboard table, timed and framed by the panel map in section 6 of \`.agents/rules/cinematic-direction.md\`. Each draws its panel's picture as a full single image with Babu Yeti's full character lock from \`.agents/rules/character-consistency.md\`, the shot's light, and his face in an \`Expressions:\` sentence, as sections 2 to 4 of \`.agents/rules/prompt-assembly.md\` set out. Each video's 3x2 grid is composed from its six panel images by \`compose_grid.ps1\`; it has no prompt and is never drawn by an image model, so the grid and the panel images are the same six pictures.\n\n`;
  doc += `42 panel images and seven grids in total, all in \`3x2-timed-storyboard-images/babu-yeti-glowing-mushroom-bloom/\`: each panel image as \`Panel_<P>_V<N>.jpg\` and each grid as \`Grid_V<N>.jpg\`, where \`V\` is the video number. The panel images are vertical 9:16, and each grid is a 1920x1080 horizontal canvas.\n\n`;
  doc += `To make a video's images:\n\n`;
  doc += `1. Generate the six panel images one prompt at a time, each with the family reference image attached as a character reference, the prompt pasted whole, and the output set to vertical 9:16. Save each under the name its \`Image:\` line gives.\n`;
  doc += `2. Check every panel image against its prompt and against the look check in section 7 of \`.agents/rules/prompt-assembly.md\`, which starts from the Final Consistency Checklist in \`.agents/rules/character-consistency.md\`: Babu Yeti the same individual in every panel, in his solid mint-green fur with his single curly tuft, round tummy, oversized eyes, and no clothing or accessories; no extra Yetis; the face the prompt names; the framing, angle, and light the prompt names; and no text. Then check the six side by side for the same look across the set. Regenerate any image that fails; a wrong image is cheaper to redo than a wrong clip.\n`;
  doc += `3. Checks for this film:\n`;
  doc += `   - Babu Yeti is the only Yeti in the film. He appears in all 42 panel images. Papa Yeti and Mama Yeti do not appear. His character lock sizes him against a grown-up Yeti and names the blue and pink Yetis' tufts in its closing clause, and the family reference image shows all three Yetis, so the image model may attempt to add an adult Yeti; regenerate any image that includes one. Babu Yeti's own full-body portrait (\`prompts/babu-yeti-full-body-portrait.md\`) may be used as the character reference image.\n`;
  doc += `   - The golden lantern fruit in Videos 1 to 3 is an in-world botanical sphere with an intricate textured spiral rind that glows warmly from within. It is held at chest height in his paws, and rests securely nestled in a vine cradle.\n`;
  doc += `   - The crystal bird in Video 4 has translucent azure wings and a shimmering crest; it flies high through the canopy, never physically grasped or harmed.\n`;
  doc += `   - The glowing coiled roots and creepers in Video 5 are thick, elastic, natural botanical vines wrapped around ancient branches, glowing with soft bioluminescence.\n`;
  doc += `   - The golden lantern fruit in Video 6 is a heavy cluster of in-world botanical spheres with spiral rinds glowing with warm amber light from within. Babu Yeti braces and heaves the bough at chest and shoulder height, clicking it securely into its natural trunk notch.\n`;
  doc += `   - The tiny bioluminescent forest sprite in Video 7 has round golden eyes and delicate glowing gossamer wings; it is scooped gently from mid-air and cuddled tenderly against Babu Yeti's tummy, never squeezed or frightened.\n`;
  doc += `   - Babu Yeti never has paws or objects on or above his head. He holds objects and creatures at chest height.\n`;
  doc += `4. Compose the grid from the six saved panel images: \`pwsh -File .agents/skills/create-3x2-timed-image/compose_grid.ps1 -File prompts/${slug}-70s-3x2.md -Video <N>\`. Compose it again whenever a panel image changes.\n`;
  doc += `5. If the image model refuses a prompt, the filter causes in the storyboard's agent instructions apply to it too. Change only that prompt's picture and effects text and keep every lock, Babu Yeti's character lock included.\n\n`;

  doc += `To use them in Google Flow, set the output format to vertical 9:16, generate the video's clip in ingredients-to-video mode with the video's \`Character locks:\` block and table from the storyboard pasted as the prompt, and attach one of these:\n\n`;
  doc += `- Panel route: the six panel images and the family reference image. That is seven images, the most Flow accepts for one clip, and it gives Flow every beat of the clip at full size.\n`;
  doc += `- Grid route: the composed grid and the family reference image.\n\n`;
  doc += `Never attach more than seven images, and never set a panel image or a grid as a start or an end frame. Check the clip against the six panel images, each at its timecode.\n`;

  for (const v of allVideos) {
    doc += `\n## Video ${v.num} - ${v.title}\n\n`;
    doc += `Film position: ${v.filmPos}.\n\n`;
    doc += `Stage: ${v.stage}.\n\n`;
    doc += `Video prompt: the Video ${v.num} \`Character locks:\` block and table in \`prompts/${slug}-70s-storyboard.md\`.\n\n`;
    doc += `Grid image: \`3x2-timed-storyboard-images/babu-yeti-glowing-mushroom-bloom/Grid_V${v.num}.jpg\`, composed from the six panel images below by \`compose_grid.ps1\`.\n\n`;

    let pNum = 1;
    for (const s of v.shots) {
      // panel 1 of shot
      doc += `### Panel ${pNum} · ${s.panel1.time} · ${s.openingFraming}, ${s.angle} · ${s.panel1.title}\n\n`;
      doc += `Image: \`3x2-timed-storyboard-images/babu-yeti-glowing-mushroom-bloom/Panel_${pNum}_V${v.num}.jpg\`.\n\n`;
      doc += "```\n";
      doc += `Create image: Vertical 9:16 aspect ratio, full-frame vertical composition. ${STYLE_LOCK} ${v.env} ${s.light} ${BABU_LOCK} Expressions: Babu Yeti, ${s.panel1.expr}. ${CREATURES} ${AVOID} Action: ${s.openingFraming}, ${s.angle} still. ${s.panel1.action} Papa Yeti and Mama Yeti are not in this picture. Effects: ${s.panel1.effects} ${CLOSING}\n`;
      doc += "```\n\n";
      pNum++;

      // panel 2 of shot
      doc += `### Panel ${pNum} · ${s.panel2.time} · ${s.closingFraming}, ${s.angle} · ${s.panel2.title}\n\n`;
      doc += `Image: \`3x2-timed-storyboard-images/babu-yeti-glowing-mushroom-bloom/Panel_${pNum}_V${v.num}.jpg\`.\n\n`;
      doc += "```\n";
      doc += `Create image: Vertical 9:16 aspect ratio, full-frame vertical composition. ${STYLE_LOCK} ${v.env} ${s.light} ${BABU_LOCK} Expressions: Babu Yeti, ${s.panel2.expr}. ${CREATURES} ${AVOID} Action: ${s.closingFraming}, ${s.angle} still. ${s.panel2.action} Papa Yeti and Mama Yeti are not in this picture. Effects: ${s.panel2.effects} ${CLOSING}\n`;
      doc += "```\n\n";
      pNum++;
    }
  }

  return doc;
}

// 1. Write prompts/babu-yeti-glowing-mushroom-bloom-70s-storyboard.md
const sb70Doc = generateStoryboardDoc("Babu Yeti Glowing Mushroom Bloom 70s Storyboard", "70s", 7);
fs.writeFileSync(path.join(REPO, 'prompts', 'babu-yeti-glowing-mushroom-bloom-70s-storyboard.md'), sb70Doc.trimEnd() + '\n', 'utf8');
console.log("Wrote babu-yeti-glowing-mushroom-bloom-70s-storyboard.md");

// 2. Write prompts/babu-yeti-glowing-mushroom-bloom-70s-3x2.md
const p70Doc = generate3x2Doc("babu-yeti-glowing-mushroom-bloom");
fs.writeFileSync(path.join(REPO, 'prompts', 'babu-yeti-glowing-mushroom-bloom-70s-3x2.md'), p70Doc.trimEnd() + '\n', 'utf8');
console.log("Wrote babu-yeti-glowing-mushroom-bloom-70s-3x2.md");

// 3. Also update prompts/babu-yeti-glowing-mushroom-bloom-30s-storyboard.md with all 7 videos as requested by user
const sb30Doc = generateStoryboardDoc("Babu Yeti Glowing Mushroom Bloom Storyboard", "30s", 7);
fs.writeFileSync(path.join(REPO, 'prompts', 'babu-yeti-glowing-mushroom-bloom-30s-storyboard.md'), sb30Doc.trimEnd() + '\n', 'utf8');
console.log("Updated babu-yeti-glowing-mushroom-bloom-30s-storyboard.md with all 7 videos");
