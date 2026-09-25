#!/usr/bin/env python3
"""Check a 3x2 grid file, its panel images, and its storyboard against the rule files.

Usage: python3 .agents/skills/create-3x2-timed-image/check_grid.py prompts/<slug>-<30s|60s>-3x2.md

Finds the storyboard by name (prompts/<slug>-<30s|60s>-storyboard.md), and reads the locks
from .agents/rules/character-consistency.md and the fixed grid and panel image sentences
from this skill's SKILL.md each time it runs, so it always checks against the current text.
Prints OK or the problems for the storyboard and for each video's grid and six panel
images, prints Note: lines for things worth a look that are not always wrong, and exits
with status 1 if anything fails.
"""
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
RULE = HERE.parents[1] / "rules" / "character-consistency.md"
SKILL = HERE / "SKILL.md"

LADDER = ["Extreme Wide Shot", "Wide Shot", "Full Shot", "Medium Wide Shot",
          "Medium Shot", "Medium Close-Up", "Close-Up", "Extreme Close-Up"]
SHOTS = ["00:00 - 00:03", "00:03 - 00:07", "00:07 - 00:10"]
SHOT_RANGES = ["00:00–00:03", "00:03–00:07", "00:07–00:10"]
PANELS = ["00:00.0–00:01.5", "00:01.5–00:03.0",
          "00:03.0–00:05.0", "00:05.0–00:07.0",
          "00:07.0–00:08.5", "00:08.5–00:10.0"]
BEATS = 2
LEGACY = re.compile(r"^(Frames|Start frame|Midpoint frame|End frame):", re.M)
IMAGE_LINES = re.compile(r"^(Grid|Stills):", re.M)
OLD_GRID = re.compile(r"3x3|nine panel|panel images 3, 6, and 9", re.I)
PANEL_HEAD = re.compile(r"^### Panel (\d) · (\S+) · ([^·]+?), ([^·,]+?) · (.+?)\s*$", re.M)
PLACES = {1: ["Character: "], 2: ["On the left, ", "On the right, "],
          3: ["On the left, ", "In the center, ", "On the right, "]}
SHOT_LINE = re.compile(r"^Shot (\d) · (\S+) · (.+?)\. Lighting: (.+?\.)(?: Effects: (.+))?$")
PANEL_LINE = re.compile(r"^Panel (\d) · (\S+) · (.+?) · ([^.·]+?)\. (.*)$")
ABSENT = re.compile(r"\b(?:neither|nor|no) the (blue|pink|baby) Yeti\b")
NO_YETI = "No Yeti is in this panel."
COLOURS = ("blue", "pink", "baby")


def section(text, heading):
    """Body of the '## <heading>' section, up to the next '## ' heading."""
    m = re.search(rf"^## {re.escape(heading)}.*?$(.*?)(?=^## |\Z)", text, re.M | re.S)
    return m.group(1) if m else ""


def quotes(body):
    """Every line of <body> that is wholly in double quotes, in order."""
    return re.findall(r'^"(.+)"$', body, re.M)


def rule_quote(rule, num):
    body = re.search(rf"^## {num}\. .*?$(.*?)(?=^## )", rule, re.M | re.S).group(1)
    return quotes(body)[0]


def videos(text):
    """[(number, title, body)] for each '## Video N - <Title>' section."""
    parts = re.split(r"^(?=## )", text, flags=re.M)
    out = []
    for part in parts:
        m = re.match(r"## Video (\d+) - (.+?)\s*$", part, re.M)
        if m:
            out.append((int(m.group(1)), m.group(2), part[m.end():]))
    return out


def framings(cell):
    """(opening, closing, angle) from a Shot Type cell such as 'Medium Shot to Close-Up, Low Angle'."""
    m = re.match(r"(.+?)(?: to (.+?))?, ([^,]+)$", cell.strip())
    if not m:
        return None
    return m.group(1), m.group(2) or m.group(1), m.group(3)


def sentences(text):
    return [s for s in re.split(r"(?<=[.!?])\s+(?=[A-Z])", text.strip()) if s]


def shot_of(panel):
    """The shot (1 to 3) a panel (1 to 6) belongs to."""
    return (panel - 1) // BEATS + 1


def main(path):
    path = Path(path)
    m = re.match(r"(.+)-(30s|60s)-3x2\.md$", path.name)
    if not m:
        sys.exit(f"{path} is not named <slug>-<30s|60s>-3x2.md")
    board_path = path.with_name(f"{m.group(1)}-{m.group(2)}-storyboard.md")
    if not board_path.exists():
        sys.exit(f"Storyboard not found: {board_path}")
    expected_videos = 3 if m.group(2) == "30s" else 6

    rule = RULE.read_text()
    style, head, look, scale, avoid = (rule_quote(rule, n) for n in (1, 7, 9, 10, 11))
    slot_phrase = rule_quote(rule, 13)
    table = section(rule, "5.")
    rows = re.findall(r"^\| (?!Beat \|)(?!---)(.+?) \| (.+?) \| (.+?) \|$", table, re.M)
    adult_faces, baby_faces = {r[1] for r in rows}, {r[2] for r in rows}
    texts = {c: rule_quote(rule, n) for c, n in zip(COLOURS, (2, 3, 4))}
    slot_patterns = {}
    for c in COLOURS:
        before, after = texts[c].split("[EXPRESSION]")
        faces = adult_faces if c != "baby" else baby_faces
        options = "|".join(map(re.escape, sorted(faces, key=len, reverse=True)))
        slot_patterns[c] = re.compile(re.escape(before) + f"({options})" + re.escape(after))
    grid_texts = {c: f"The {c} Yeti: " + texts[c].replace("[EXPRESSION]", slot_phrase)
                  for c in COLOURS}

    fixed = quotes(section(SKILL.read_text(), "Fixed grid sentences"))
    if len(fixed) != 6:
        sys.exit(f"Expected 6 fixed grid sentences in {SKILL}, found {len(fixed)}.")
    grid_aspect, layout_wide, layout_tall, reference, quality, closing = fixed
    fixed_panel = quotes(section(SKILL.read_text(), "Fixed panel image sentences"))
    if len(fixed_panel) != 2:
        sys.exit(f"Expected 2 fixed panel image sentences in {SKILL}, found {len(fixed_panel)}.")
    no_yeti_image, panel_closing = fixed_panel
    slug = m.group(1)

    failed = False
    notes = []

    # The storyboard: the grid is only as right as the beats it is drawn from.
    board = board_path.read_text()
    board_videos = videos(board)
    problems = []
    if LEGACY.search(board):
        problems.append("still has Frames:, Start frame:, Midpoint frame:, or End frame: lines "
                        "(revise it with the storyboard skill first)")
    if IMAGE_LINES.search(board) or "Create image:" in board:
        problems.append("has Grid: or Stills: lines or an image prompt; the storyboard holds video "
                        "prompts only (revise it with the storyboard skill first)")
    if OLD_GRID.search(board):
        problems.append("still refers to the old 3x3 grid, nine panels, or panel images 3, 6, and 9 "
                        "(revise it with the storyboard skill first)")
    if len(board_videos) != expected_videos:
        problems.append(f"{len(board_videos)} videos, expected {expected_videos}")
    aspect = None
    shots = {}
    for num, _, body in board_videos:
        lines = [l for l in body.splitlines() if l.startswith("| **00:")]
        cells = [[c.strip() for c in l.split("|")] for l in lines]
        stamps = [c[1].strip("*") if len(c) > 1 else "" for c in cells]
        if stamps != SHOTS or any(len(c) != 7 for c in cells):
            problems.append(f"Video {num} table rows are {stamps}, expected {SHOTS} with five cells each")
            continue
        shots[num] = []
        for s, c in enumerate(cells, 1):
            visual = c[3]
            if aspect is None and style in visual:
                aspect = visual.split(style)[0].strip()
            action = re.search(r"Action: (.*?) Camera: ", visual)
            beats = sentences(action.group(1)) if action else []
            if len(beats) != BEATS:
                problems.append(f"Video {num} Shot {s} Action has {len(beats)} sentences, "
                                f"the grid needs exactly {BEATS} beats")
            ends = framings(c[2])
            if not ends:
                problems.append(f"Video {num} Shot {s} Shot Type '{c[2]}' is not '<Framing>, <Angle>'")
            elif ends[0] in LADDER and ends[1] in LADDER and \
                    abs(LADDER.index(ends[0]) - LADDER.index(ends[1])) > 2:
                problems.append(f"Video {num} Shot {s} moves more than two rungs ({c[2]})")
            slots = {}
            for colour, pat in slot_patterns.items():
                hit = pat.search(visual)
                if hit:
                    slots[colour] = hit.group(1)
            if action:
                for colour in sorted(set(ABSENT.findall(action.group(1))) & set(slots)):
                    problems.append(f"Video {num} Shot {s} has character text for the {colour} Yeti, "
                                    f"but its Action says the {colour} Yeti is not in the shot")
            shots[num].append({"type": c[2], "visual": visual, "slots": slots,
                               "scene_break": bool(re.search(r"^Scene break:", body, re.M))})
    if aspect is None:
        problems.append("no visual cell opens with an aspect ratio line before the style lock")
    failed |= bool(problems)
    print("Storyboard: " + ("OK" if not problems else "; ".join(problems)))

    layout = layout_wide if aspect and "16:9" in aspect else layout_tall

    # The grids.
    grid_videos = videos(path.read_text())
    board_heads = [(n, t) for n, t, _ in board_videos]
    grid_heads = [(n, t) for n, t, _ in grid_videos]
    if grid_heads != board_heads:
        failed = True
        print(f"Grid headings {grid_heads} do not match the storyboard's {board_heads}.")

    previous_last = None
    for num, video_title, body in grid_videos:
        problems = []
        first_image = PANEL_HEAD.search(body)
        grid_body = body[:first_image.start()] if first_image else body
        image_body = body[first_image.start():] if first_image else ""
        blocks = re.findall(r"^```\n(.*?)\n```", grid_body, re.M | re.S)
        if len(blocks) != 1:
            print(f"Video {num}: expected one grid prompt before the panel images, found {len(blocks)}")
            failed = True
            continue
        if f"Image: `3x2-timed-storyboard-images/{slug}/Video {num} - {video_title}.jpg`." not in grid_body:
            problems.append(f"grid Image: line is not `3x2-timed-storyboard-images/{slug}/"
                            f"Video {num} - {video_title}.jpg`")
        lines = blocks[0].splitlines()
        first_shot = next((i for i, l in enumerate(lines) if l.startswith("Shot ")), len(lines))
        header = " ".join(l.strip() for l in lines[:first_shot] if l.strip())
        body_lines = [l.strip() for l in lines[first_shot:] if l.strip()]
        sb = shots.get(num)

        # Shots and panels, walked in order.
        shot_hits, panels, current_shot = [], [], 0
        for line in body_lines[:-1]:
            s = SHOT_LINE.match(line)
            p = PANEL_LINE.match(line)
            if s:
                current_shot += 1
                shot_hits.append(s)
            elif p:
                panels.append((current_shot, p))
            else:
                problems.append(f"line is neither a Shot nor a Panel line: {line[:60]}...")
        if not body_lines or body_lines[-1] != closing:
            problems.append("does not end with the closing line")
        if len(shot_hits) != 3:
            problems.append(f"{len(shot_hits)} Shot lines, expected 3")
        if len(panels) != len(PANELS):
            problems.append(f"{len(panels)} panels, expected exactly {len(PANELS)}")

        for i, s in enumerate(shot_hits[:3], 1):
            if (int(s.group(1)), s.group(2)) != (i, SHOT_RANGES[i - 1]):
                problems.append(f"Shot line {i} should read 'Shot {i} · {SHOT_RANGES[i - 1]}'")
            if sb:
                if s.group(3) != sb[i - 1]["type"]:
                    problems.append(f"Shot {i} Shot Type '{s.group(3)}' is not the storyboard's "
                                    f"'{sb[i - 1]['type']}'")
                if "Lighting: " + s.group(4) not in sb[i - 1]["visual"]:
                    problems.append(f"Shot {i} Lighting: sentence is not the storyboard's, word for word")

        titles, pictures, faces_by_panel, framing_by_panel = [], [], {}, {}
        for n, (shot, p) in enumerate(panels[:len(PANELS)], 1):
            if int(p.group(1)) != n or p.group(2) != PANELS[n - 1]:
                problems.append(f"panel {n} should read 'Panel {n} · {PANELS[n - 1]}'")
            if shot != shot_of(n):
                problems.append(f"panel {n} sits under Shot {shot}, expected Shot {shot_of(n)}")
            title = p.group(3)
            if not re.fullmatch(r"[A-Z0-9'’&-]+(?: [A-Z0-9'’&-]+){1,3}", title):
                problems.append(f"panel {n} title '{title}' is not two to four words in capitals")
            titles.append(title)

            rest = p.group(5)
            faces = {}
            if rest.endswith(NO_YETI):
                picture = rest[:-len(NO_YETI)]
            else:
                fm = re.search(r" ?Faces: (.+)\.$", rest)
                if not fm:
                    problems.append(f"panel {n} has no Faces: list and does not say '{NO_YETI}'")
                    picture = rest
                else:
                    picture = rest[:fm.start()]
                    for entry in fm.group(1).split("; "):
                        em = re.match(r"the (blue|pink|baby) Yeti, (.+)$", entry)
                        if not em:
                            problems.append(f"panel {n} Faces: entry '{entry[:40]}' does not start "
                                            "'the blue Yeti,', 'the pink Yeti,', or 'the baby Yeti,'")
                            continue
                        colour, face = em.groups()
                        if colour in faces:
                            problems.append(f"panel {n} names the {colour} Yeti twice")
                        allowed = adult_faces if colour != "baby" else baby_faces
                        if face not in allowed:
                            problems.append(f"panel {n} face for the {colour} Yeti is not a section 5 row")
                        faces[colour] = face
            faces_by_panel[n] = faces
            pictures.append(re.sub(r"\s+", " ", picture.strip().lower()))

            shot_info = sb[shot_of(n) - 1] if sb else None
            if shot_info:
                for colour in sorted(set(faces) - set(shot_info["slots"])):
                    problems.append(f"panel {n} has the {colour} Yeti, but Shot {shot_of(n)} has no "
                                    f"character text for it")

            framing_by_panel[n] = p.group(4)
            fr = p.group(4).rsplit(", ", 1)
            ends = framings(shot_info["type"]) if shot_info else None
            if len(fr) != 2:
                problems.append(f"panel {n} framing '{p.group(4)}' is not '<Framing>, <Angle>'")
            elif ends:
                opening, closing_f, angle = ends
                last = n % BEATS == 0
                want = closing_f if last else opening
                if fr[0] != want:
                    problems.append(f"panel {n} framing '{fr[0]}' should be {want}, the shot's "
                                    + ("closing" if last else "opening") + " framing")
                if fr[1] != angle:
                    if last:
                        notes.append(f"Video {num} panel {n} angle '{fr[1]}' differs from the "
                                     f"cell's '{angle}'; fine only if the Camera: move ends on it")
                    else:
                        problems.append(f"panel {n} angle '{fr[1]}' is not the cell's '{angle}'")

            if shot_info and n % BEATS == 0:
                for colour, face in faces.items():
                    if colour in shot_info["slots"] and shot_info["slots"][colour] != face:
                        problems.append(f"panel {n} face for the {colour} Yeti is not Shot "
                                        f"{shot_of(n)}'s [EXPRESSION] slot")

        if sb:
            for s, shot_info in enumerate(sb, 1):
                seen = {c for n in range(BEATS * s - 1, BEATS * s + 1)
                        for c in faces_by_panel.get(n, {})}
                for colour in sorted(set(shot_info["slots"]) - seen):
                    notes.append(f"Video {num} Shot {s} has character text for the {colour} Yeti, "
                                 "but neither of its panels shows it")
        if len(set(titles)) != len(titles):
            problems.append("panel titles repeat; every panel needs its own")
        if len(set(pictures)) != len(pictures):
            problems.append("two panels describe the same picture; each beat is its own panel")

        # The header: fixed sentences, locks, and the pieces copied from the storyboard.
        if not header.startswith(f"Create image: {grid_aspect} {layout} "):
            problems.append(f"does not open with 'Create image: {grid_aspect}' and the layout sentence "
                            f"for a {'16:9' if layout is layout_wide else '9:16'} film")
        for name, lock in (("layout sentence", layout), ("reference sentence", reference),
                           ("quality sentence", quality), ("style lock", style),
                           ("head lock", head), ("look lock", look), ("avoid line", avoid)):
            if header.count(lock) != 1:
                problems.append(f"{name} appears {header.count(lock)} times word for word (expected 1)")
        present = {c for f in faces_by_panel.values() for c in f}
        for c in COLOURS:
            n_text = header.count(grid_texts[c])
            if n_text != (1 if c in present else 0):
                problems.append(f"the {c} Yeti's character text appears {n_text} times with the grid "
                                f"slot phrase (expected {1 if c in present else 0})")
        if len(re.findall(r"Yeti (?:entirely )?covered in thick", header)) != len(present):
            problems.append("a character text does not match sections 2 to 4 with the grid slot phrase")
        wants_scale = any("baby" in f and ("blue" in f or "pink" in f) for f in faces_by_panel.values())
        if header.count(scale) > 1 or (scale in header) != wants_scale:
            problems.append("scale lock " + ("missing" if wants_scale else "present")
                            + " (it belongs only where a panel has the baby Yeti and a grown-up)")

        firsts = [header.find(grid_texts[c]) for c in COLOURS if grid_texts[c] in header]
        marks = [header.find(x) for x in (layout, reference, quality, style, "Environment: ")]
        marks += [min(firsts)] if firsts else []
        marks += [header.find(head), header.find(look)]
        marks += [header.find(scale)] if scale in header else []
        marks += [header.find(avoid)]
        if -1 in marks or marks != sorted(marks):
            problems.append("header pieces missing or out of order (layout, reference, quality, style, "
                            "Environment, characters, head, look, scale, cast, avoid)")
        if re.search(r"\b(Camera|Transition): |No dialogue\.", blocks[0]):
            problems.append("contains Camera:, Transition:, or audio text")

        env = re.search(r"Environment: (.+?\.) (?=The (?:blue|pink|baby) Yeti: |Head lock: )", header)
        cast = ""
        if look in header and avoid in header:
            end = header.find(scale) + len(scale) if scale in header else header.find(look) + len(look)
            cast = header[end:header.find(avoid)].strip()
        if sb:
            if not env or any("Environment: " + env.group(1) not in s["visual"] for s in sb):
                problems.append("Environment: sentence is not the storyboard's, word for word")
            board_cast = set()
            for s in sb:
                v = s["visual"]
                if look in v and avoid in v:
                    e = v.find(scale) + len(scale) if scale in v else v.find(look) + len(look)
                    board_cast.add(v[e:v.find(avoid)].strip())
            if board_cast and cast not in board_cast:
                problems.append("supporting cast sentences are not the storyboard's, word for word")

        # The six panel images under the grid.
        heads = list(PANEL_HEAD.finditer(image_body))
        if len(heads) != len(PANELS):
            problems.append(f"{len(heads)} panel images, expected exactly {len(PANELS)}")
        for i, h in enumerate(heads[:len(PANELS)], 1):
            n = int(h.group(1))
            where = f"panel image {i}"
            if n != i or h.group(2) != PANELS[i - 1]:
                problems.append(f"{where} heading should read '### Panel {i} · {PANELS[i - 1]}'")
            if i in framing_by_panel and f"{h.group(3)}, {h.group(4)}" != framing_by_panel[i]:
                problems.append(f"{where} framing '{h.group(3)}, {h.group(4)}' is not grid panel {i}'s "
                                f"'{framing_by_panel[i]}'")
            if i <= len(titles) and h.group(5) != titles[i - 1].capitalize():
                problems.append(f"{where} title '{h.group(5)}' is not grid panel {i}'s title in "
                                f"sentence case ('{titles[i - 1].capitalize()}')")
            part_end = heads[i].start() if i < len(heads) else len(image_body)
            part = image_body[h.end():part_end]
            want_path = (f"Image: `3x2-timed-storyboard-images/{slug}/Video {num} - {video_title} - "
                         f"Panel {i}.jpg`.")
            if want_path not in part:
                problems.append(f"{where} has no line '{want_path}'")
            pblocks = re.findall(r"^```\n(.*?)\n```", part, re.M | re.S)
            if len(pblocks) != 1:
                problems.append(f"{where} has {len(pblocks)} prompts, expected 1")
                continue
            prompt = " ".join(l.strip() for l in pblocks[0].splitlines() if l.strip())
            s_index = shot_of(i) - 1
            lighting = "Lighting: " + shot_hits[s_index].group(4) if s_index < len(shot_hits) else None
            env_text = "Environment: " + env.group(1) if env else None
            opening = f"Create image: {aspect} {style} "
            if not prompt.startswith(opening):
                problems.append(f"{where} does not open with 'Create image:', the storyboard's aspect "
                                "ratio line, and the style lock")
            for name, piece in (("Environment: sentence", env_text), ("Lighting: sentence", lighting)):
                if piece and prompt.count(piece) != 1:
                    problems.append(f"{where} {name} is not the grid's, word for word")
            for name, lock in (("head lock", head), ("look lock", look), ("avoid line", avoid),
                               ("closing sentence", panel_closing)):
                if prompt.count(lock) != 1:
                    problems.append(f"{where} {name} appears {prompt.count(lock)} times (expected 1)")
            if not prompt.endswith(panel_closing):
                problems.append(f"{where} does not end with the closing sentence")
            if cast and prompt.count(cast) != 1:
                problems.append(f"{where} supporting cast sentences are not the storyboard's, word for word")
            if re.search(r"\b(?:Camera|Transition|Faces): | · |No dialogue\.|3x2|storyboard grid", prompt):
                problems.append(f"{where} contains Camera:, Transition:, Faces:, grid, label, or audio text")

            want = faces_by_panel.get(i, {})
            got = {}
            for colour, pat in slot_patterns.items():
                hits = pat.findall(prompt)
                if len(hits) > 1:
                    problems.append(f"{where} has the {colour} Yeti's character text {len(hits)} times")
                if hits:
                    got[colour] = hits[0]
            if set(got) != set(want):
                problems.append(f"{where} has character text for {sorted(got) or 'no Yeti'}, but grid "
                                f"panel {i} has {sorted(want) or 'no Yeti'}")
            for colour in set(got) & set(want):
                if got[colour] != want[colour]:
                    problems.append(f"{where} slot for the {colour} Yeti is not grid panel {i}'s face")
            if len(re.findall(r"Yeti (?:entirely )?covered in thick", prompt)) != len(want):
                problems.append(f"{where} a character text does not match sections 2 to 4")
            if not want and prompt.count(no_yeti_image) != 1:
                problems.append(f"{where} has no Yeti but does not say '{no_yeti_image}'")
            if want and no_yeti_image in prompt:
                problems.append(f"{where} has a Yeti but says '{no_yeti_image}'")
            if want and len(want) in PLACES:
                chars = prompt[prompt.find(lighting) if lighting and lighting in prompt else 0:
                               prompt.find(head)]
                if [pl for pl in PLACES[len(want)] if pl not in chars]:
                    problems.append(f"{where} places {len(want)} Yeti(s) without "
                                    f"{' / '.join(p.strip(', :') for p in PLACES[len(want)])}")
            needs_scale = "baby" in want and ("blue" in want or "pink" in want)
            if prompt.count(scale) > 1 or (scale in prompt) != needs_scale:
                problems.append(f"{where} scale lock " + ("missing" if needs_scale else "present")
                                + " (it belongs only where the panel has the baby Yeti and a grown-up)")
            opener = f"Action: {framing_by_panel.get(i, '?')} still. "
            if prompt.count(opener) != 1:
                problems.append(f"{where} Action: does not open '{opener.strip()}'")

            first_char = min([prompt.find(pat.search(prompt).group(0)) for pat in slot_patterns.values()
                              if pat.search(prompt)] or [prompt.find(no_yeti_image)])
            order = [prompt.find(x) for x in (style, env_text or "Environment: ", lighting or "Lighting: ")]
            order += [first_char, prompt.find(head), prompt.find(look)]
            order += [prompt.find(scale)] if scale in prompt else []
            order += [prompt.find(cast)] if cast and cast in prompt else []
            order += [prompt.find(avoid), prompt.find("Action: "), prompt.rfind(panel_closing)]
            if -1 in order or order != sorted(order):
                problems.append(f"{where} pieces missing or out of order (style, Environment, Lighting, "
                                "characters, head, look, scale, cast, avoid, Action, closing)")

        if previous_last is not None and sb and not sb[0]["scene_break"]:
            for colour in set(previous_last) & set(faces_by_panel.get(1, {})):
                if previous_last[colour] != faces_by_panel[1][colour]:
                    notes.append(f"Video {num} panel 1 face for the {colour} Yeti differs from the "
                                 f"previous video's panel {len(PANELS)}; fine only if the first beat "
                                 "changes it")
        previous_last = faces_by_panel.get(len(PANELS))

        failed |= bool(problems)
        print(f"Video {num}: " + ("OK" if not problems else "; ".join(problems)))

    for note in notes:
        print("Note: " + note)
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
