with open('prompts/yeti-glacier-rescue-60s-3x3.md', 'r') as f:
    content = f.read()
content = content.replace("Panel 8 · 00:08.0–00:09.0 · THE RELIEF · Full Shot, High Angle.", "Panel 8 · 00:08.0–00:09.0 · THE RELIEF · Medium Wide Shot, High Angle.")
with open('prompts/yeti-glacier-rescue-60s-3x3.md', 'w') as f:
    f.write(content)
