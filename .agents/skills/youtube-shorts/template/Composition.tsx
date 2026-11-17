// YouTube Short composition (youtube-shorts skill). Reads public/plan.json written by short.mjs build:
// 9:16 shots with a slow push-in and a punch at each cut, the script's on-screen headline per section,
// word-by-word captions (the spoken word in yellow), and a freeze-frame CTA with a bouncing arrow.
// Text style: no outline, only a soft drop shadow (user preference, 2026-11-17).
import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Composition,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

type Word = { text: string; sec: number; s: number; e: number };
type Shot = { id: string; file: string; startFrame: number; frames: number; sec: number; holdFrames: number };
type Section = { headline: string[]; cta: boolean; startFrame: number; endFrame: number };
type Plan = { fps: number; durationInFrames: number; sections: Section[]; shots: Shot[]; words: Word[] };
type Props = { plan: Plan | null };

// Poppins Black (headlines) and ExtraBold (captions), from Google Fonts
const { fontFamily: POPPINS, waitUntilDone } = loadFont("normal", { weights: ["800", "900"], subsets: ["latin"] });
const fontsReady = waitUntilDone();

const calculateMetadata: CalculateMetadataFunction<Props> = async () => {
  await fontsReady;
  const plan: Plan = await fetch(staticFile("plan.json")).then((r) => r.json());
  return { durationInFrames: plan.durationInFrames, fps: plan.fps, props: { plan } };
};

const YELLOW = "#FFD60A";
// no outline: a tight contact shadow plus a soft wider one lifts the text off any shot
const shadow: React.CSSProperties = {
  textShadow: "0 2px 3px rgba(0,0,0,0.45), 0 6px 18px rgba(0,0,0,0.35)",
};

// ---- footage ------------------------------------------------------------------
const ShotClip: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const moving = shot.frames - shot.holdFrames;
  // gentle push-in through the shot, with a small punch at the cut
  const push = interpolate(frame, [0, Math.max(1, moving)], [1.04, 1.12], { extrapolateRight: "clamp" });
  const punch = interpolate(frame, [0, 5], [0.05, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const frozen = shot.holdFrames > 0 && frame >= moving;
  const ft = frozen ? frame - moving : 0;
  const flash = frozen ? interpolate(ft, [0, 4], [0.85, 0], { extrapolateRight: "clamp" }) : 0;
  const freezeZoom = frozen ? interpolate(ft, [0, 8], [0.03, 0.06], { extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${push + punch + freezeZoom})`,
          filter: frozen ? `saturate(${interpolate(ft, [0, 8], [1, 0.55], { extrapolateRight: "clamp" })}) contrast(1.08)` : undefined,
        }}
      >
        <OffthreadVideo src={staticFile(shot.file)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* top and bottom shade so the text reads on any shot */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      {flash > 0 && <AbsoluteFill style={{ background: "#fff", opacity: flash }} />}
    </AbsoluteFill>
  );
};

// ---- headline (the script's on-screen text) -----------------------------------
const Headline: React.FC<{ section: Section }> = ({ section }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = section.endFrame - section.startFrame;
  const out = interpolate(frame, [len - 5, len], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 230, opacity: section.cta ? 1 : out }}>
      {section.headline.map((line, i) => {
        const s = spring({ frame: frame - i * 5, fps, config: { damping: 11, stiffness: 180, mass: 0.6 } });
        const wiggle = section.cta ? 0 : Math.sin((frame - i * 5) / 9) * 1.2;
        const accent = i === section.headline.length - 1;
        return (
          <div
            key={i}
            style={{
              fontFamily: POPPINS,
              fontWeight: 900,
              fontSize: section.cta ? 90 : 96,
              lineHeight: 1.08,
              color: accent ? YELLOW : "#fff",
              textAlign: "center",
              letterSpacing: -1,
              transform: `scale(${s}) rotate(${wiggle}deg)`,
              opacity: Math.min(1, s * 1.5),
              ...shadow,
            }}
          >
            {line}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---- word-by-word captions ----------------------------------------------------
type Chunk = { words: Word[]; s: number; e: number };
const chunkWords = (words: Word[]): Chunk[] => {
  const chunks: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) chunks.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e });
    cur = [];
  };
  words.forEach((w, i) => {
    const next = words[i + 1];
    if (cur.length && cur[0].sec !== w.sec) flush();
    cur.push(w);
    const chars = cur.map((x) => x.text).join(" ").length;
    if (/[.,!?…]$/.test(w.text) || cur.length >= 3 || chars > 16 || (next && next.s - w.e > 0.3)) flush();
  });
  flush();
  // each chunk stays up until the next begins (or 0.5 s after its last word)
  chunks.forEach((c, i) => (c.e = chunks[i + 1] ? Math.min(chunks[i + 1].s, c.e + 0.5) : c.e + 0.6));
  return chunks;
};

const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = React.useMemo(() => chunkWords(words), [words]);
  const c = chunks.find((x) => t >= x.s - 0.05 && t < x.e);
  if (!c) return null;
  const pop = spring({ frame: frame - Math.round(c.s * fps), fps, config: { damping: 12, stiffness: 220, mass: 0.5 } });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 1130 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "4px 34px",
          maxWidth: 940,
          transform: `scale(${0.85 + 0.15 * pop})`,
        }}
      >
        {c.words.map((w, i) => {
          // exactly one lit word: the last one already begun
          const lit = c.words.reduce((k, x, j) => (t >= x.s - 0.03 ? j : k), -1);
          const active = i === lit;
          return (
            <span
              key={i}
              style={{
                fontFamily: POPPINS,
                fontWeight: 800,
                fontSize: 84,
                textTransform: "uppercase",
                color: active ? YELLOW : "#fff",
                transform: `scale(${active ? 1.05 : 1})`,
                display: "inline-block",
                ...shadow,
              }}
            >
              {w.text.replace(/,$/, "")}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---- CTA arrow ------------------------------------------------------------------
const CtaArrow: React.FC = () => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 4) * 18;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 250 }}>
      <div style={{ fontSize: 130, transform: `translateY(${bob}px)`, filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.6))" }}>👇</div>
    </AbsoluteFill>
  );
};

// ---- the Short ---------------------------------------------------------------------
export const Short: React.FC<Props> = ({ plan }) => {
  if (!plan) return null;
  const cta = plan.sections.find((s) => s.cta);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {plan.shots.map((s) => (
        <Sequence key={s.id} from={s.startFrame} durationInFrames={s.frames} premountFor={30}>
          <ShotClip shot={s} />
        </Sequence>
      ))}
      {plan.sections.map((s, i) => (
        <Sequence key={i} from={s.startFrame} durationInFrames={s.endFrame - s.startFrame}>
          <Headline section={s} />
        </Sequence>
      ))}
      <Captions words={plan.words} />
      {cta && (
        <Sequence from={cta.startFrame + Math.round((cta.endFrame - cta.startFrame) * 0.45)}>
          <CtaArrow />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <Composition
    id="Short"
    component={Short}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{ plan: null }}
    calculateMetadata={calculateMetadata}
  />
);
