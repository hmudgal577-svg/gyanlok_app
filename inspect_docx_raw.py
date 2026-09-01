import os
import sys
import docx

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

data_dir = 'D:/data'
items = os.listdir(data_dir)
target_folder = None
for item in items:
    full_path = os.path.join(data_dir, item)
    if os.path.isdir(full_path):
        subfiles = os.listdir(full_path)
        if any('saakhi' in f.lower() for f in subfiles):
            target_folder = full_path
            break

filepath = os.path.join(target_folder, 'Saakhi _Summary .docx')
doc = docx.Document(filepath)

print("PARAGRAPHS SAMPLE:")
for i, p in enumerate(doc.paragraphs[:10]):
    print(f"P{i+1}: text='{p.text}'")
    for r in p.runs:
        print(f"   Run: text='{r.text}', font_name={r.font.name}, font_size={r.font.size}, bold={r.font.bold}, italic={r.font.italic}, color={r.font.color.rgb if r.font.color else None}")
