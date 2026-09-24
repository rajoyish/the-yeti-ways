import json
import urllib.request
import os

with open('v4_prompt.txt', 'r') as f:
    prompt = f.read().strip()

# Actually, I should use the API directly or ask the agent to call it.
# Wait, I am the agent, I have the generate_image tool!
