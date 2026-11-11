// Lyric subtitle lower-third overlay (Remotion). Driven by src/config.json + src/lyrics.json.
// Compositions:
//   LyricsOverlay  -> transparent overlay (render as ProRes 4444 with alpha)
//   LyricsPreview  -> overlay on top of public/source.mp4 with audio (for checking sync)
import React, { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  OffthreadVideo,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { getAvailableFonts } from "@remotion/google-fonts";
import { measureText } from "@remotion/layout-utils";
import config from "./config.json";
import lyricsData from "./lyrics.json";

type Word = { w: string; s: number; e: number };
type Line = { words: Word[] };
type Cfg = typeof config;
const C = config as Cfg;

const W = C.width;
const H = C.height;
const K = H / 1080; // scale factor vs 1080p design values
const FPS = C.fpsNum / C.fpsDen;
const DURATION_S = C.durationInFrames / FPS;
const HOLD_AFTER = 1.5; // s a card lingers after its last word if nothing follows

const lines = (lyricsData as Line[]).filter((l) => l.words.length > 0);

// ---- group lines into cards ----
type Group = { lines: Line[]; start: number; end: number; first: number; last: number };
const groups: Group[] = [];
for (let i = 0; i < lines.length; i += C.linesPerCard) {
  const ls = lines.slice(i, i + C.linesPerCard);
  const first = ls[0].words[0].s;
  const lastLine = ls[ls.length - 1];
  const last = lastLine.words[lastLine.words.length - 1].e;
  groups.push({ lines: ls, first, last, start: Math.max(0, first - C.leadIn), end: 0 });
}
groups.forEach((g, i) => {
  const next = groups[i + 1];
  const hold = Math.min(DURATION_S, g.last + HOLD_AFTER);
  g.end = next ? Math.min(next.start, hold) : hold;
  if (next && next.start - g.last <= HOLD_AFTER) g.end = next.start; // contiguous
});
// merge contiguous card windows into plate segments
const segments: { start: number; end: number }[] = [];
groups.forEach((g) => {
  const prev = segments[segments.length - 1];
  if (prev && g.start - prev.end < 0.05) prev.end = g.end;
  else segments.push({ start: g.start, end: g.end });
});

// ---- font loading (any Google Font by family name) ----
const useFont = () => {
  const [family, setFamily] = useState<string | null>(null);
  const [handle] = useState(() => delayRender("Loading font"));
  useEffect(() => {
    const info = getAvailableFonts().find(
      (f) => f.fontFamily.toLowerCase() === C.fontFamily.toLowerCase(),
    );
    if (!info) {
      console.warn(`Font ${C.fontFamily} not found, falling back to sans-serif`);
      setFamily("sans-serif");
      continueRender(handle);
      return;
    }
    info
      .load()
      .then((mod) => {
        const loaded = mod.loadFont("normal", { weights: [C.fontWeight], subsets: ["latin"] });
        return loaded.waitUntilDone().then(() => setFamily(loaded.fontFamily));
      })
      .catch((e) => {
        console.warn(e);
        setFamily("sans-serif");
      })
      .finally(() => continueRender(handle));
  }, [handle]);
  return family;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const StarIcon: React.FC<{ size: number; opacity: number; rotate: number }> = ({
  size,
  opacity,
  rotate,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="-10 -10 20 20"
    style={{ opacity, transform: `rotate(${rotate}deg)` }}
  >
    <path
      d="M0,-9 C1,-2 2,-1 9,0 C2,1 1,2 0,9 C-1,2 -2,1 -9,0 C-2,-1 -1,-2 0,-9 Z"
      fill={C.highlightTop}
    />
  </svg>
);

const WordView: React.FC<{ word: Word; t: number; fps: number; frame: number }> = ({
  word,
  t,
  fps,
  frame,
}) => {
  const dur = Math.max(0.12, word.e - word.s);
  const p = Math.min(1, Math.max(0, (t - word.s) / dur));
  const startFrame = Math.round(word.s * fps);
  const pop = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.6 },
  });
  const bump = frame >= startFrame ? Math.sin(pop * Math.PI) : 0;

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        transform: `translateY(${bump * -6 * K}px) scale(${1 + bump * 0.06})`,
        marginRight: "0.26em",
      }}
    >
      <span style={{ color: C.textColor }}>{word.w}</span>
      <span
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(180deg, ${C.highlightTop}, ${C.highlightBottom})`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          textShadow: "none",
          clipPath: `inset(-20% ${100 - p * 100}% -20% -5%)`,
          filter: `drop-shadow(0 0 ${8 * K}px rgba(255, 200, 70, 0.45))`,
        }}
      >
        {word.w}
      </span>
    </span>
  );
};

const GroupView: React.FC<{
  g: Group;
  t: number;
  frame: number;
  fps: number;
  lineScales: number[];
}> = ({ g, t, frame, fps, lineScales }) => {
  const inF = Math.round(g.start * fps);
  const outF = Math.round(g.end * fps);
  if (frame < inF - 1 || frame > outF + 1) return null;
  const isFinal = g.end >= DURATION_S - 0.01;
  const enter = interpolate(frame, [inF, inF + 9], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const exit = isFinal
    ? 0
    : interpolate(frame, [outF - 7, outF], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6 * K,
      }}
    >
      {g.lines.map((line, li) => {
        const d = li * 3;
        const le = interpolate(frame, [inF + d, inF + d + 9], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
        const first = line.words[0].s;
        const last = line.words[line.words.length - 1].e;
        const active = t >= first - 0.15 && t <= last + 0.1;
        const dim = active ? 1 : t < first - 0.15 ? 0.82 : 0.9;
        return (
          <div
            key={li}
            style={{
              opacity: Math.min(le, 1 - exit) * dim,
              transform: `translateY(${((1 - enter) * 26 - exit * 18) * K}px) scale(${lineScales[li]})`,
              whiteSpace: "nowrap",
            }}
          >
            {line.words.map((w, wi) => (
              <WordView key={wi} word={w} t={t} fps={fps} frame={frame} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export const LyricsOverlay: React.FC<{ withVideo?: boolean }> = ({ withVideo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const fontFamily = useFont();

  const fontSize = C.fontSize * K;
  const cardW = C.cardWidth * K;
  const cardH = C.cardHeight * K;
  const safeInsetY = (H * (1 - C.safeArea)) / 2;
  const safeInsetX = (W * (1 - C.safeArea)) / 2;
  const bottom = safeInsetY + C.bottomMargin * K;

  // shrink any line that would not fit inside the card
  const scales = useMemo(() => {
    if (!fontFamily) return groups.map((g) => g.lines.map(() => 1));
    const avail = cardW - 2 * 70 * K;
    return groups.map((g) =>
      g.lines.map((l) => {
        const { width } = measureText({
          text: l.words.map((w) => w.w).join(" "),
          fontFamily,
          fontWeight: C.fontWeight,
          fontSize,
          letterSpacing: "0.5px",
        });
        return Math.min(1, avail / (width * 1.03));
      }),
    );
  }, [fontFamily, cardW, fontSize]);

  // plate envelope
  let plate = 0;
  for (const s of segments) {
    const a = Math.round(s.start * fps);
    const b = Math.round(s.end * fps);
    const fin = interpolate(frame, [a, a + 8], [0, 1], clamp);
    const fout = s.end >= DURATION_S - 0.01 ? 0 : interpolate(frame, [b - 8, b], [0, 1], clamp);
    if (frame >= a && frame <= b) plate = Math.max(plate, Math.min(fin, 1 - fout));
  }
  const twinkle = (ph: number) =>
    0.55 + 0.45 * Math.sin(frame / 9 + ph) * Math.sin(frame / 23 + ph * 2);

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {withVideo ? <OffthreadVideo src={staticFile("source.mp4")} /> : null}

      {fontFamily ? (
        <div
          style={{
            position: "absolute",
            left: (W - cardW) / 2,
            bottom,
            width: cardW,
            height: cardH,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: plate,
              transform: `translateY(${(1 - plate) * 20 * K}px)`,
            }}
          >
            {C.showCard ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 40 * K,
                  background: `linear-gradient(180deg, ${C.cardTop} 0%, ${C.cardBottom} 100%)`,
                  border: `${2 * K}px solid rgba(255, 255, 255, 0.16)`,
                  boxShadow: `0 ${18 * K}px ${40 * K}px rgba(6, 8, 30, 0.35), inset 0 1px 0 rgba(255,255,255,0.18)`,
                }}
              />
            ) : null}
            {C.sparkles ? (
              <>
                <div style={{ position: "absolute", left: 30 * K, top: 22 * K }}>
                  <StarIcon size={40 * K} opacity={twinkle(0)} rotate={frame * 0.6} />
                </div>
                <div style={{ position: "absolute", left: 64 * K, top: 52 * K }}>
                  <StarIcon size={20 * K} opacity={twinkle(2.1)} rotate={-frame * 0.8} />
                </div>
                <div style={{ position: "absolute", right: 34 * K, bottom: 24 * K }}>
                  <StarIcon size={40 * K} opacity={twinkle(4.2)} rotate={-frame * 0.6} />
                </div>
                <div style={{ position: "absolute", right: 70 * K, bottom: 58 * K }}>
                  <StarIcon size={18 * K} opacity={twinkle(1.3)} rotate={frame * 0.9} />
                </div>
              </>
            ) : null}
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              fontFamily,
              fontWeight: Number(C.fontWeight),
              fontSize,
              lineHeight: 1.18,
              letterSpacing: 0.5,
              textShadow: C.showCard
                ? `0 ${3 * K}px ${8 * K}px rgba(6, 8, 30, 0.55)`
                : `0 ${2 * K}px ${4 * K}px rgba(0,0,0,0.8), 0 0 ${16 * K}px rgba(0,0,0,0.6)`,
            }}
          >
            {groups.map((g, i) => (
              <GroupView key={i} g={g} t={t} frame={frame} fps={fps} lineScales={scales[i]} />
            ))}
          </div>
        </div>
      ) : null}

      {C.showSafeGuides ? (
        <div
          style={{
            position: "absolute",
            left: safeInsetX,
            top: safeInsetY,
            right: safeInsetX,
            bottom: safeInsetY,
            border: "2px dashed rgba(0,255,0,0.7)",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <>
    <Composition
      id="LyricsOverlay"
      component={LyricsOverlay}
      durationInFrames={C.durationInFrames}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={{ withVideo: false }}
    />
    <Composition
      id="LyricsPreview"
      component={LyricsOverlay}
      durationInFrames={C.durationInFrames}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={{ withVideo: true }}
    />
  </>
);
