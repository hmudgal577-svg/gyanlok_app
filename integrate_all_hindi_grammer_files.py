import os
import sys
import json
import shutil

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

SCRATCH_DIR = r"C:\Users\hmudg\.gemini\antigravity\scratch\gyanlok"
PARSED_JSON = os.path.join(SCRATCH_DIR, "hindi_grammer_folder_parsed.json")
CONVERTED_JSON = os.path.join(SCRATCH_DIR, "grammar_converted_data.json")
PUBLIC_UPLOADS_DIR = os.path.join(SCRATCH_DIR, "public", "uploads", "worksheets")

os.makedirs(PUBLIC_UPLOADS_DIR, exist_ok=True)

with open(PARSED_JSON, 'r', encoding='utf-8') as f:
    parsed_data = json.load(f)

with open(CONVERTED_JSON, 'r', encoding='utf-8') as f:
    converted_data = json.load(f)

# Copy original docx files to public/uploads/worksheets
print("📋 Copying original docx files to public/uploads/worksheets...")
for rel_path, info in parsed_data.items():
    src_file = os.path.join(r"D:\Hindi Grammer", rel_path)
    safe_filename = info['filename'].replace(' ', '_').replace('(', '').replace(')', '')
    dst_file = os.path.join(PUBLIC_UPLOADS_DIR, safe_filename)
    shutil.copy2(src_file, dst_file)
    print(f"  ✓ Copied: {safe_filename}")
    info['download_url'] = f"/uploads/worksheets/{safe_filename}"

# Update converted_data keys
cbse_muhavre_html = []
cbse_padbandh_html = []
cbse_vakya_html = []
icse_muhavre_html = []

for rel_path, info in parsed_data.items():
    download_btn = f'''<div style="display:flex; justify-content:space-between; align-items:center; background:#EFF6FF; border:1px solid #BFDBFE; padding:0.85rem 1.25rem; border-radius:10px; margin-bottom:1rem;">
      <span style="font-weight:700; color:#1E3A8A; font-size:0.95rem;">📄 {info['filename']}</span>
      <a href="{info['download_url']}" download class="btn btn-primary" style="padding:0.45rem 0.95rem; font-size:0.84rem; font-weight:700; text-decoration:none; background:#2563EB; color:#ffffff; border-radius:6px;">📥 Download DOCX</a>
    </div>'''
    
    full_block = download_btn + info['html']
    
    if "CBSE\\Muhavre Worksheets" in rel_path:
        cbse_muhavre_html.append(full_block)
    elif "CBSE\\Padbandh Worksheets" in rel_path:
        cbse_padbandh_html.append(full_block)
    elif "CBSE\\Rachna ke aadhar par Worksheets" in rel_path:
        cbse_vakya_html.append(full_block)
    elif "ICSE\\Muhavare Worksheets" in rel_path:
        icse_muhavre_html.append(full_block)

converted_data['cbse_muhavre_worksheets_all'] = "\n<hr style='margin:2rem 0; border:0; border-top:2px dashed #CBD5E1;' />\n".join(cbse_muhavre_html)
converted_data['cbse_padbandh_worksheets_all'] = "\n<hr style='margin:2rem 0; border:0; border-top:2px dashed #CBD5E1;' />\n".join(cbse_padbandh_html)
converted_data['cbse_vakya_worksheets_all'] = "\n<hr style='margin:2rem 0; border:0; border-top:2px dashed #CBD5E1;' />\n".join(cbse_vakya_html)
converted_data['icse_muhavre_worksheets_all'] = "\n<hr style='margin:2rem 0; border:0; border-top:2px dashed #CBD5E1;' />\n".join(icse_muhavre_html)

with open(CONVERTED_JSON, 'w', encoding='utf-8') as f:
    json.dump(converted_data, f, ensure_ascii=False, indent=2)

print("\n✓ Updated grammar_converted_data.json with all 12 worksheets!")
