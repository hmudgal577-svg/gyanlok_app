import json

with open('public/chapter_html_content.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for k, v in data.items():
    print(f"=== KEY: {k} ===")
    if 'summary' in v:
        # print first 500 chars of summary
        print("SUMMARY PREVIEW:")
        print(v['summary'][:500])
    break
