#!/usr/bin/env python3
"""Write src/config.json for the template from the source video's specs.

Usage: python3 -I make_config.py <video> <config.json>
Existing style keys in config.json are preserved (only video specs are refreshed).
"""
import json
import os
import subprocess
import sys

DEFAULT_STYLE = {
    "linesPerCard": 2,        # lines shown together (2 = couplets)
    "leadIn": 0.35,           # s before first sung word that a card appears
    "fontFamily": "Fredoka",  # any Google Font id supported by @remotion/google-fonts
    "fontWeight": "600",
    "fontSize": 60,           # px at 1080p (scaled to other heights)
    "cardWidth": 1280,        # px at 1080p; lines too wide are auto-shrunk
    "cardHeight": 200,        # px at 1080p (grow for 3+ lines)
    "bottomMargin": 40,       # px at 1080p above the title-safe bottom edge
    "safeArea": 0.9,          # 0.9 = title safe, 0.93 = action safe
    "showCard": True,         # dark backing plate (recommended over bright footage)
    "cardTop": "rgba(28, 34, 92, 0.62)",
    "cardBottom": "rgba(14, 18, 58, 0.72)",
    "textColor": "#FFFFFF",
    "highlightTop": "#FFF1B8",
    "highlightBottom": "#FFC93C",
    "sparkles": True,
    "showSafeGuides": False,
}


def main(video, out):
    p = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_packets",
         "-show_entries", "stream=width,height,r_frame_rate,nb_read_packets",
         "-show_entries", "format=duration", "-of", "json", video],
        capture_output=True, text=True, check=True)
    info = json.loads(p.stdout)
    st = info["streams"][0]
    num, den = (int(x) for x in st["r_frame_rate"].split("/"))
    frames = int(st.get("nb_read_packets") or 0)
    if not frames:
        frames = round(float(info["format"]["duration"]) * num / den)

    cfg = dict(DEFAULT_STYLE)
    if os.path.exists(out):
        try:
            cfg.update(json.load(open(out)))
        except Exception:
            pass
    cfg.update({"width": st["width"], "height": st["height"], "fpsNum": num,
                "fpsDen": den, "durationInFrames": frames})
    json.dump(cfg, open(out, "w"), indent=2)
    print(f"{st['width']}x{st['height']} @ {num}/{den} fps ({num/den:.3f}), {frames} frames")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
