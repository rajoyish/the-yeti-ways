#!/usr/bin/env python3
"""Align user-supplied lyrics to whisper.cpp word timestamps.

Usage: python3 -I align_lyrics.py <words.json> <lyrics.txt> <out lyrics.json>

- lyrics.txt: one lyric line per row (blank rows ignored). The text on screen is
  ALWAYS the user's text; whisper is only used for timing.
- Uses sequence alignment, so misheard / missing / extra whisper words are fine.
  Unmatched lyric words get times interpolated from their matched neighbours.
- Prints a report: match rate and every line containing interpolated words, so
  those lines can be spot-checked in the preview.
"""
import json
import re
import sys
from difflib import SequenceMatcher


def norm(s: str) -> str:
    return re.sub(r"[^\w]", "", s.lower(), flags=re.UNICODE)


def main(words_path, lyrics_path, out_path):
    data = json.load(open(words_path))
    ws = []
    for t in data["transcription"]:
        txt = t["text"].strip()
        if not txt or (txt.startswith("[") and txt.endswith("]")) or txt.startswith("("):
            continue  # skip [Music], (singing) etc.
        if not norm(txt):
            continue
        ws.append((t["offsets"]["from"] / 1000, t["offsets"]["to"] / 1000, txt))

    lines = [l.strip() for l in open(lyrics_path, encoding="utf-8") if l.strip()]
    lw = [(li, w) for li, l in enumerate(lines) for w in l.split()]

    a = [norm(w) for _, w in lw]
    b = [norm(t) for _, _, t in ws]
    times = [None] * len(lw)
    sm = SequenceMatcher(a=a, b=b, autojunk=False)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            s, e, _ = ws[blk.b + k]
            times[blk.a + k] = [s, e]
    # replace-opcodes of equal length: trust whisper's timing for misheard words
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "replace" and (i2 - i1) == (j2 - j1):
            for k in range(i2 - i1):
                times[i1 + k] = [ws[j1 + k][0], ws[j1 + k][1]]

    matched = sum(t is not None for t in times)
    interp = [t is None for t in times]
    # interpolate gaps
    n = len(times)
    i = 0
    while i < n:
        if times[i] is not None:
            i += 1
            continue
        j = i
        while j < n and times[j] is None:
            j += 1
        left = times[i - 1][1] if i > 0 else (times[j][0] - 0.4 * (j - i) if j < n else 0.0)
        right = times[j][0] if j < n else left + 0.4 * (j - i)
        left = max(0.0, left)
        step = max(0.05, (right - left) / (j - i))
        for k in range(i, j):
            s = left + (k - i) * step
            times[k] = [s, s + step]
        i = j

    out = [{"words": []} for _ in lines]
    flagged = set()
    for (li, w), (s, e), f in zip(lw, times, interp):
        out[li]["words"].append({"w": w, "s": round(s, 3), "e": round(e, 3)})
        if f:
            flagged.add(li)
    json.dump(out, open(out_path, "w"), indent=1, ensure_ascii=False)

    print(f"lyric words: {len(lw)}  whisper words: {len(ws)}  "
          f"timed from whisper: {matched}/{len(lw)} ({100*matched/max(1,len(lw)):.0f}%)")
    for li in sorted(flagged):
        print(f"  INTERPOLATED  line {li+1} @ {out[li]['words'][0]['s']:.2f}s: {lines[li]}")
    if matched / max(1, len(lw)) < 0.6:
        print("WARNING: low match rate - check lyrics text / language / model, or the song "
              "has long instrumental repeats not in the lyrics.")


if __name__ == "__main__":
    main(*sys.argv[1:4])
