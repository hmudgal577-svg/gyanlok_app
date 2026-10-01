import os
import sys
import json
import docx

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = r"D:\Hindi Grammer"

parsed_results = {}

def docx_to_html(doc_path):
    doc = docx.Document(doc_path)
    html_parts = []
    
    html_parts.append('<div class="docx-converted-content" style="background:#FFFFFF; border:1px solid #E2E8F0; padding:1.5rem; border-radius:14px; margin-bottom:1.5rem; font-family:\'Noto Sans Devanagari\', sans-serif;">')
    
    for p in doc.paragraphs:
        txt = p.text.strip()
        if not txt:
            continue
        
        # Determine heading vs normal paragraph
        if p.style.name.startswith('Heading 1') or 'अभ्यास' in txt or 'कार्य-पत्र' in txt or 'Worksheet' in txt:
            html_parts.append(f'<h3 style="color:#0F172A; font-weight:800; font-size:1.25rem; margin-top:1.25rem; margin-bottom:0.6rem; border-bottom:2px solid #E2E8F0; padding-bottom:0.4rem;">{txt}</h3>')
        elif p.style.name.startswith('Heading 2') or txt.startswith('प्रश्न') or txt.startswith('निर्देश'):
            html_parts.append(f'<h4 style="color:#1E3A8A; font-weight:700; font-size:1.05rem; margin-top:1rem; margin-bottom:0.4rem;">{txt}</h4>')
        else:
            # Check if line contains bold text or question number
            html_parts.append(f'<p style="margin-bottom:0.5rem; line-height:1.7; color:#334155; font-size:0.95rem;">{txt}</p>')
            
    # Process tables if any
    for table in doc.tables:
        html_parts.append('<table style="width:100%; border-collapse:collapse; margin:1rem 0; font-size:0.9rem;">')
        for r_idx, row in enumerate(table.rows):
            html_parts.append('<tr>')
            for cell in row.cells:
                cell_txt = cell.text.strip()
                tag = 'th' if r_idx == 0 else 'td'
                style = 'border:1px solid #CBD5E1; padding:0.6rem 0.85rem; text-align:left;'
                if tag == 'th':
                    style += 'background:#F1F5F9; font-weight:700; color:#0F172A;'
                html_parts.append(f'<{tag} style="{style}">{cell_txt}</{tag}>')
            html_parts.append('</tr>')
        html_parts.append('</table>')

    html_parts.append('</div>')
    return "\n".join(html_parts)

for root, dirs, files in os.walk(ROOT_DIR):
    for f in files:
        if f.endswith('.docx'):
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, ROOT_DIR)
            print(f"Parsing: {rel_path}")
            try:
                converted_html = docx_to_html(full_path)
                parsed_results[rel_path] = {
                    'filename': f,
                    'path': rel_path,
                    'html': converted_html,
                    'size': os.path.getsize(full_path)
                }
            except Exception as e:
                print(f"  ❌ Error parsing {f}: {e}")

out_json = r"C:\Users\hmudg\.gemini\antigravity\scratch\gyanlok\hindi_grammer_folder_parsed.json"
with open(out_json, 'w', encoding='utf-8') as f:
    json.dump(parsed_results, f, ensure_ascii=False, indent=2)

print(f"\n🎉 Parsed {len(parsed_results)} docx files from D:\\Hindi Grammer!")
