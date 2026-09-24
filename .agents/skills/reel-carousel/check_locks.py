#!/usr/bin/env python3
"""Check a carousel's still prompts against .agents/rules/character-consistency.md.

Usage: python3 .agents/skills/reel-carousel/check_locks.py carousels/<slug>-carousel.md

Reads the locked sentences and character texts from the rule file each time it runs,
so it always checks against the current rule. Prints OK or the problems for each still
and exits with status 1 if any still has a problem.
"""
import re
import sys
from pathlib import Path

RULE = Path(__file__).resolve().parents[2] / "rules" / "character-consistency.md"
OPEN = "Create image: Square 1:1 aspect ratio, full-frame square composition. "
CLOSE = "Single square carousel image. No text, captions, or watermark."


def section_quote(rule, num):
    """The first line of rule section <num> that is wholly in double quotes."""
    body = re.search(rf"^## {num}\. .*?$(.*?)(?=^## )", rule, re.M | re.S).group(1)
    return re.search(r'^"(.+)"$', body, re.M).group(1)


def char_pattern(text, expressions):
    before, after = text.split("[EXPRESSION]")
    options = "|".join(map(re.escape, expressions))
    return re.compile(re.escape(before) + f"({options})" + re.escape(after))


def main(path):
    rule = RULE.read_text()
    style, head, look, scale, avoid = (section_quote(rule, n) for n in (1, 7, 9, 10, 11))
    rows = re.findall(r"^\| (?!Beat \|)(?!---)(.+?) \| (.+?) \| (.+?) \|$", rule, re.M)
    adult, baby = [r[1] for r in rows], [r[2] for r in rows]
    papa = char_pattern(section_quote(rule, 2), adult)
    mama = char_pattern(section_quote(rule, 3), adult)
    babu = char_pattern(section_quote(rule, 4), baby)

    text = Path(path).read_text()
    stills = re.findall(r"^### Still (\d+).*?\n\n```\n(.*?)\n```", text, re.M | re.S)
    failed = len(stills) != 4
    if failed:
        print(f"Expected 4 still prompts, found {len(stills)}.")

    cast_blocks = {}
    for num, p in stills:
        problems = []
        if not p.startswith(OPEN):
            problems.append("does not open with the square Create image line")
        if not p.endswith(CLOSE):
            problems.append("does not end with the closing line")
        for name, lock in (("style lock", style), ("head lock", head),
                           ("look lock", look), ("avoid line", avoid)):
            n = p.count(lock)
            if n != 1:
                problems.append(f"{name} appears {n} times word for word (expected 1)")

        texts = re.findall(r"Yeti (?:entirely )?covered in thick", p)
        found = {"blue": papa.findall(p), "pink": mama.findall(p), "baby": babu.findall(p)}
        matched = sum(len(v) for v in found.values())
        if len(texts) != matched:
            problems.append(f"{len(texts)} character texts, but only {matched} match "
                            "sections 2 to 4 with a section 5 expression")

        wants_scale = bool(found["baby"]) and bool(found["blue"] or found["pink"])
        if p.count(scale) > 1 or (scale in p) != wants_scale:
            problems.append("scale lock " + ("missing" if wants_scale else "present")
                            + " (it belongs only where the baby Yeti and a grown-up share the still)")

        first_char = min((m.start() for pat in (papa, mama, babu) for m in pat.finditer(p)),
                         default=None)
        marks = [p.find(style), p.find("Environment: "), p.find("Lighting: ")]
        if first_char is not None:
            marks.append(first_char)
        marks += [p.find(head), p.find(look)]
        if scale in p:
            marks.append(p.find(scale))
        marks += [p.find(avoid), p.find(" Action: ")]
        if -1 in marks or marks != sorted(marks):
            problems.append("pieces missing or out of order (style, Environment, Lighting, "
                            "characters, head, look, scale, cast, avoid, Action)")
        if re.search(r"\b(Camera|Transition): ", p):
            problems.append("contains Camera: or Transition: text")

        if look in p and avoid in p:
            last_lock = p.find(scale) + len(scale) if scale in p else p.find(look) + len(look)
            cast_blocks[num] = p[last_lock:p.find(avoid)].strip()

        failed |= bool(problems)
        print(f"Still {num}: " + ("OK" if not problems else "; ".join(problems)))

    if len(set(cast_blocks.values())) > 1:
        failed = True
        print("Supporting cast sentences differ between stills; they must be identical in all four.")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
