import json, sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('public/chapter_html_content.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("TOTAL KEYS IN JSON:", len(data.keys()))

chapters = [
    ('Ch 1 (Sakhi)', ['cbse_10_hindi_ch1', 'cbse_10_hindi_sakhi']),
    ('Ch 2 (Meera)', ['cbse_10_hindi_ch2', 'cbse_10_hindi_meera']),
    ('Ch 4 (Parvat)', ['cbse_10_hindi_ch4', 'cbse_10_hindi_parvat']),
    ('Ch 11 (Teesri Kasam)', ['cbse_10_hindi_ch11', 'cbse_10_hindi_teesri_kasam']),
    ('Sanchayan Ch 2 (Sapno)', ['cbse_10_hindi_ch2_sanchayan', 'cbse_10_hindi_sapno'])
]

cats = ['summary', 'notes', 'competency', 'additional', 'muhavre']

for name, keys in chapters:
    print(f"\nChecking {name}:")
    key_found = False
    for k in keys:
        if k in data:
            key_found = True
            print(f"  [OK] Key '{k}' present:")
            for cat in cats:
                has_cat = cat in data[k] and len(data[k][cat]) > 100
                print(f"    - {cat}: {'PASSED (' + str(len(data[k][cat])) + ' bytes)' if has_cat else 'MISSING'}")
            break
    if not key_found:
        print(f"  [FAIL] NONE OF THE KEYS {keys} FOUND IN JSON!")

