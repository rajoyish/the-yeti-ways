with open('prompts/yeti-glacier-rescue-60s-3x3.md', 'r') as f:
    content = f.read()

start = content.find('```\nCreate image', content.find('## Video 4')) + 4
end = content.find('```', start)
print(content[start:end])
