import json
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('public/chapter_html_content.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

item = data.get('cbse_10_hindi_ch1', {})
for cat in ['summary', 'notes', 'competency', 'additional', 'muhavre']:
    if cat in item:
        print(f"\n==================== {cat.upper()} HEADER ====================")
        html = item[cat]
        match = re.search(r'<div class="doc-header".*?</div>', html, re.DOTALL)
        if match:
            print(match.group(0))
        else:
            print("No doc-header found. First 300 chars:")
            print(html[:300])
