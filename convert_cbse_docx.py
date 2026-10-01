import zipfile
import xml.etree.ElementTree as ET
import os
import json

ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

def parse_docx_syllabus(path):
    html = []
    html.append('''
    <div class="cbse-docx-render" style="font-family: 'Plus Jakarta Sans', 'Noto Sans Devanagari', 'Inter', sans-serif; color: #0F172A; max-width: 900px; margin: 0 auto; line-height: 1.6;">
      <div style="background: linear-gradient(135deg, #156082 0%, #0D4763 100%); color: #FFFFFF; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 4px 14px rgba(21, 96, 130, 0.2);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
          <span style="background: rgba(255,255,255,0.2); font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase;">CBSE OFFICIAL 2026-27</span>
          <span style="background: #EBF3FD; color: #156082; font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 20px;">कोर्स कोड: 085</span>
        </div>
        <h2 style="font-size: 1.4rem; font-weight: 800; margin: 0 0 6px; color:#FFFFFF;">सीबीएसई कक्षा 10 हिंदी (कोर्स बी) - संपूर्ण आधिकारिक पाठ्यक्रम</h2>
        <p style="font-size: 0.9rem; opacity: 0.9; margin: 0;">केन्द्रीय माध्यमिक शिक्षा बोर्ड द्वारा निर्धारित वार्षिक परीक्षा पाठ्यक्रम, पुस्तक वार विवरण एवं अंक भार</p>
      </div>
    ''')

    with zipfile.ZipFile(path) as z:
        tree = ET.fromstring(z.read('word/document.xml'))
        body = tree.find('w:body', ns)
        
        for elem in body:
            tag = elem.tag.split('}')[-1]
            if tag == 'p':
                p_text = ''.join(t.text for t in elem.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if t.text).strip()
                if not p_text:
                    continue
                
                if any(p_text.startswith(x) for x in ['पाठ्यपुस्तक', 'व्यावहारिक व्याकरण', 'रचनात्मक लेखन', 'खंड', 'CBSE']):
                    html.append(f'''
                    <div style="background: #EBF3FD; border-left: 5px solid #156082; border-radius: 8px; padding: 1rem 1.25rem; margin: 1.5rem 0 1rem;">
                      <h3 style="margin: 0; color: #156082; font-size: 1.15rem; font-weight: 800;">{p_text}</h3>
                    </div>
                    ''')
                elif any(p_text.startswith(x) for x in ['गद्य खंड', 'काव्य खंड', 'स्पर्श भाग-2', 'पूरक पाठ्यपुस्तक', '1.', '2.', '3.', '4.']):
                    html.append(f'''
                    <h4 style="color: #0F172A; font-size: 1.05rem; font-weight: 700; margin: 1.25rem 0 0.5rem; padding-bottom: 4px; border-bottom: 2px solid #E2E8F0;">
                      <span style="color: #156082; margin-right: 6px;">📖</span> {p_text}
                    </h4>
                    ''')
                else:
                    html.append(f'''
                    <div style="padding: 6px 12px; margin: 3px 0; font-size: 0.94rem; color: #334155; background: #F8FAFC; border-radius: 6px; border: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between;">
                      <span>{p_text}</span>
                    </div>
                    ''')

            elif tag == 'tbl':
                html.append('<div style="overflow-x:auto; margin:1.25rem 0;"><table style="width:100%; border-collapse:collapse; border:1px solid #CBD5E1; border-radius:8px; background:#FFFFFF;">')
                rows = elem.findall('w:tr', ns)
                for r_idx, row in enumerate(rows):
                    row_bg = '#156082' if r_idx == 0 else ('#F8FAFC' if r_idx % 2 == 1 else '#FFFFFF')
                    text_color = '#FFFFFF' if r_idx == 0 else '#0F172A'
                    html.append(f'<tr style="background:{row_bg};">')
                    for cell in row.findall('w:tc', ns):
                        cell_text = ''.join(t.text for t in cell.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if t.text).strip()
                        cell_tag = 'th' if r_idx == 0 else 'td'
                        style = f'padding:10px 14px; font-size:0.9rem; font-weight:700; color:{text_color}; border:1px solid #CBD5E1; text-align:left;' if r_idx == 0 else 'padding:9px 12px; font-size:0.88rem; color:#334155; border:1px solid #E2E8F0;'
                        html.append(f'<{cell_tag} style="{style}">{cell_text}</{cell_tag}>')
                    html.append('</tr>')
                html.append('</table></div>')

    html.append('</div>')
    return '\n'.join(html)


def parse_docx_marking_scheme(path):
    html = []
    html.append('''
    <div class="cbse-docx-render" style="font-family: 'Plus Jakarta Sans', 'Noto Sans Devanagari', 'Inter', sans-serif; color: #0F172A; max-width: 900px; margin: 0 auto; line-height: 1.6;">
      <div style="background: linear-gradient(135deg, #156082 0%, #0D4763 100%); color: #FFFFFF; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 4px 14px rgba(21, 96, 130, 0.2);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
          <span style="background: rgba(255,255,255,0.2); font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase;">BLUEPRINT & SCHEME</span>
          <span style="background: #EBF3FD; color: #156082; font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 20px;">कुल अंक: 80 + 20</span>
        </div>
        <h2 style="font-size: 1.4rem; font-weight: 800; margin: 0 0 6px; color:#FFFFFF;">सीबीएसई कक्षा 10 हिंदी (कोर्ष बी) - अंक योजना व प्रश्न-पत्र प्रारूप (2026-27)</h2>
        <p style="font-size: 0.9rem; opacity: 0.9; margin: 0;">खंड-वार प्रश्न प्रकार, विकल्प वितरण, शब्द सीमा एवं सटीक अंक विभाजन गाइड</p>
      </div>
    ''')

    with zipfile.ZipFile(path) as z:
        tree = ET.fromstring(z.read('word/document.xml'))
        body = tree.find('w:body', ns)
        
        for elem in body:
            tag = elem.tag.split('}')[-1]
            if tag == 'p':
                p_text = ''.join(t.text for t in elem.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if t.text).strip()
                if not p_text:
                    continue
                
                if any(k in p_text for k in ['खंड', 'CBSE Class 10', 'भार-विभाजन']):
                    html.append(f'''
                    <div style="background: #EBF3FD; border-left: 5px solid #156082; border-radius: 8px; padding: 0.85rem 1.15rem; margin: 1.4rem 0 0.85rem;">
                      <h3 style="margin: 0; color: #156082; font-size: 1.1rem; font-weight: 800;">{p_text}</h3>
                    </div>
                    ''')
                else:
                    html.append(f'<p style="color:#334155; font-size:0.95rem; line-height:1.7; margin:0.4rem 0; font-weight:500;">{p_text}</p>')

            elif tag == 'tbl':
                html.append('<div style="overflow-x:auto; margin:1rem 0 1.5rem;"><table style="width:100%; border-collapse:collapse; border:1px solid #BAE6FD; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(15,23,42,0.04);">')
                rows = elem.findall('w:tr', ns)
                for r_idx, row in enumerate(rows):
                    is_header = (r_idx == 0)
                    row_bg = '#156082' if is_header else ('#F8FAFC' if r_idx % 2 == 1 else '#FFFFFF')
                    text_color = '#FFFFFF' if is_header else '#0F172A'
                    html.append(f'<tr style="background:{row_bg}; border-bottom:1px solid #E2E8F0;">')
                    for cell in row.findall('w:tc', ns):
                        cell_text = ''.join(t.text for t in cell.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if t.text).strip()
                        cell_tag = 'th' if is_header else 'td'
                        style = f'padding:12px 14px; font-size:0.9rem; font-weight:700; color:{text_color}; border-right:1px solid rgba(255,255,255,0.2); text-align:left;' if is_header else 'padding:10px 14px; font-size:0.9rem; color:#334155; border-right:1px solid #E2E8F0;'
                        html.append(f'<{cell_tag} style="{style}">{cell_text}</{cell_tag}>')
                    html.append('</tr>')
                html.append('</table></div>')

    html.append('</div>')
    return '\n'.join(html)


if __name__ == '__main__':
    path_cbse = r'C:\Users\hmudg\Downloads\cbse'
    f_syllabus = os.path.join(path_cbse, 'CBSE Class 10th Syllabus 2026-27.docx')
    f_marking = os.path.join(path_cbse, 'CBSE_Class10_Hindi_CourseB_Marking Scheme.docx')
    
    html_syl = parse_docx_syllabus(f_syllabus)
    html_mrk = parse_docx_marking_scheme(f_marking)
    
    output_data = {
        'cbse_syllabus_html': html_syl,
        'cbse_marking_scheme_html': html_mrk
    }
    
    with open('cbse_docs_parsed.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
        
    print("[OK] Successfully parsed docx files into cbse_docs_parsed.json!")
