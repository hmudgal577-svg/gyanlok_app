import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
for i, l in enumerate(lines):
    if '24 Hours' in l or '24 hours' in l or '24-hour' in l or '24 Hour' in l:
        print(f"Line {i+1}: {l.strip()}")
