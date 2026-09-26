import os
import sys
import json
import docx
from docx.enum.text import WD_ALIGN_PARAGRAPH

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def rgb_to_hex(rgb):
    if not rgb:
        return None
    try:
        return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"
    except Exception:
        return None

def get_run_style(run, is_header=False):
    styles = []
    if not run:
        return ""
    font = run.font

    font_name = font.name if font and font.name else 'Noto Sans Devanagari'
    styles.append(f"font-family: '{font_name}', 'Noto Sans Devanagari', 'Mangal', sans-serif")

    if font and font.size and hasattr(font.size, 'pt') and font.size.pt:
        styles.append(f"font-size: {font.size.pt}pt")

    if font and font.color and font.color.rgb:
        hex_color = rgb_to_hex(font.color.rgb)
        if hex_color and hex_color.upper() in ['#D9E8F5', '#EBF3FD', '#FFFFFF']:
            hex_color = '#1E40AF'
        if hex_color:
            styles.append(f"color: {hex_color}")
    elif is_header:
        styles.append("color: #ffffff")

    if font and font.bold is True:
        styles.append("font-weight: bold")
    else:
        styles.append("font-weight: normal")

    if font and font.italic is True:
        styles.append("font-style: italic")
    else:
        styles.append("font-style: normal")

    if font and font.underline is True:
        styles.append("text-decoration: underline")

    return "; ".join(styles)

def get_paragraph_style(p, is_header=False, is_footer=False):
    styles = ["font-style: normal"]
    pf = p.paragraph_format

    if p.alignment == WD_ALIGN_PARAGRAPH.CENTER:
        styles.append("text-align: center")
    elif p.alignment == WD_ALIGN_PARAGRAPH.RIGHT:
        styles.append("text-align: right")
    elif p.alignment == WD_ALIGN_PARAGRAPH.JUSTIFY:
        styles.append("text-align: justify")
    elif p.alignment == WD_ALIGN_PARAGRAPH.LEFT:
        styles.append("text-align: left")
    elif is_header:
        styles.append("text-align: center")
    elif is_footer:
        styles.append("text-align: right")

    if pf.line_spacing:
        if isinstance(pf.line_spacing, (int, float)):
            styles.append(f"line-height: {pf.line_spacing}")
        elif hasattr(pf.line_spacing, 'pt') and pf.line_spacing.pt:
            styles.append(f"line-height: {pf.line_spacing.pt}pt")
    else:
        styles.append("line-height: 1.6")

    if pf.space_before and hasattr(pf.space_before, 'pt') and pf.space_before.pt:
        styles.append(f"margin-top: {pf.space_before.pt}pt")
    if pf.space_after and hasattr(pf.space_after, 'pt') and pf.space_after.pt:
        styles.append(f"margin-bottom: {pf.space_after.pt}pt")
    else:
        styles.append("margin-bottom: 0.4rem")

    return "; ".join(styles)

def paragraph_element_to_html(p_elem, doc, is_header=False, is_footer=False):
    p = docx.text.paragraph.Paragraph(p_elem, doc)
    p_style = get_paragraph_style(p, is_header=is_header, is_footer=is_footer)
    
    # Check if standard runs exist
    runs_html = []
    if p.runs:
        for run in p.runs:
            text = run.text
            if not text:
                continue
            text_escaped = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br/>")
            r_style = get_run_style(run, is_header=is_header)
            runs_html.append(f'<span style="{r_style}">{text_escaped}</span>')
    
    # Fallback or additional check for <w:sdt> or missed text elements in XML
    full_inner = "".join(runs_html)
    if not full_inner.strip():
        # Retrieve all text nodes directly from XML
        t_nodes = p_elem.xpath('.//w:t')
        extracted_text = "".join([t.text for t in t_nodes if t.text])
        if extracted_text.strip():
            text_escaped = extracted_text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br/>")
            full_inner = f'<span style="font-family: \'Noto Sans Devanagari\', sans-serif; color: #1E293B; font-weight: 500;">{text_escaped}</span>'

    if not full_inner.strip():
        return '<p style="margin-bottom: 0.2rem;"><br/></p>'

    return f'<p style="{p_style}; font-style: normal;">{full_inner}</p>'

def cell_element_to_html(cell_elem, doc):
    # Retrieve all paragraphs or text blocks inside cell XML
    p_elems = cell_elem.xpath('.//w:p')
    if not p_elems:
        # Fallback if cell has text without <w:p>
        t_nodes = cell_elem.xpath('.//w:t')
        cell_text = "".join([t.text for t in t_nodes if t.text]).strip()
        if cell_text:
            text_escaped = cell_text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            return f'<td style="border: 1px solid #CBD5E1; padding: 10px 14px; vertical-align: top; font-style: normal; color: #1E293B; font-weight: 500;">{text_escaped}</td>'
        return '<td style="border: 1px solid #CBD5E1; padding: 10px 14px; vertical-align: top; font-style: normal;">&nbsp;</td>'

    cell_p_html = []
    for pe in p_elems:
        cell_p_html.append(paragraph_element_to_html(pe, doc))
    
    cell_content = "".join(cell_p_html)
    if not cell_content.strip():
        cell_content = "&nbsp;"
    
    return f'<td style="border: 1px solid #CBD5E1; padding: 10px 14px; vertical-align: top; font-style: normal; background-color: #FFFFFF; color: #1E293B;">{cell_content}</td>'

def table_to_html(table, doc):
    rows_html = []
    for row in table.rows:
        cells_html = []
        for cell in row.cells:
            cells_html.append(cell_element_to_html(cell._tc, doc))
        rows_html.append(f'<tr>{"".join(cells_html)}</tr>')
    return f'<table style="width: 100%; border-collapse: collapse; margin: 1.25rem 0; border: 1px solid #CBD5E1; font-style: normal; background: #FFFFFF;"><tbody>{"".join(rows_html)}</tbody></table>'

def convert_docx_to_html(filepath, title, badge_label):
    doc = docx.Document(filepath)
    html_parts = []

    header_html = f'''<div class="doc-header" style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); padding: 1.25rem 1.5rem; border-radius: 14px; margin-bottom: 1.75rem; text-align: center; color: #ffffff; box-shadow: 0 6px 18px rgba(30,58,138,0.2); font-style: normal;">
  <span style="background: rgba(255,255,255,0.2); font-size: 0.8rem; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; margin-bottom: 0.4rem;">{badge_label}</span>
  <div style="font-size: 17pt; font-weight: bold; color: #ffffff !important; margin-bottom: 0.25rem; line-height: 1.3; font-family: 'Noto Sans Devanagari', sans-serif;">{title}</div>
</div>'''
    html_parts.append(header_html)

    for elem in doc.element.body:
        if elem.tag.endswith('p'):
            html_parts.append(paragraph_element_to_html(elem, doc))
        elif elem.tag.endswith('tbl'):
            t = docx.table.Table(elem, doc)
            html_parts.append(table_to_html(t, doc))

    return f'<div class="docx-exact-container" style="background: #ffffff; padding: 1.75rem 1.5rem; border-radius: 16px; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(0,0,0,0.03); font-family: \'Noto Sans Devanagari\', sans-serif; font-size: 10.5pt; color: #1E293B; font-style: normal;">{"".join(html_parts)}</div>'

files_map = {
    'cbse_muhavre_1': {
        'path': r'D:\Hindi Grammer\CBSE\Muhavre\Muhavre_Worksheet_1_40Marks (1).docx',
        'title': 'CBSE मुहावरे अभ्यास प्रश्न-पत्र 1 (40 अंक)',
        'badge': 'CBSE Class 10 Grammar'
    },
    'cbse_muhavre_2': {
        'path': r'D:\Hindi Grammer\CBSE\Muhavre\Muhavre_Worksheet_2_40Marks (1).docx',
        'title': 'CBSE मुहावरे अभ्यास प्रश्न-पत्र 2 (40 अंक)',
        'badge': 'CBSE Class 10 Grammar'
    },
    'cbse_padbandh_1': {
        'path': r'D:\Hindi Grammer\CBSE\Padbandh\Padbandh_Worksheet_1_40Marks (1).docx',
        'title': 'CBSE पदबंध अभ्यास प्रश्न-पत्र 1 (40 अंक)',
        'badge': 'CBSE Class 10 Grammar'
    },
    'cbse_padbandh_2': {
        'path': r'D:\Hindi Grammer\CBSE\Padbandh\Padbandh_Worksheet_2_40Marks (2).docx',
        'title': 'CBSE पदबंध अभ्यास प्रश्न-पत्र 2 (40 अंक)',
        'badge': 'CBSE Class 10 Grammar'
    },
    'cbse_vakya_1': {
        'path': r'D:\Hindi Grammer\CBSE\Rachna ke aadhar par\Worksheet_1_Vakya_Rupantar_40Marks (1).docx',
        'title': 'CBSE वाक्य रूपांतरण अभ्यास प्रश्न-पत्र 1 (40 अंक)',
        'badge': 'CBSE Class 10 Grammar'
    },
    'cbse_vakya_2': {
        'path': r'D:\Hindi Grammer\CBSE\Rachna ke aadhar par\Worksheet_2_Vakya_Rupantar_40Marks .docx',
        'title': 'CBSE वाक्य रूपांतरण अभ्यास प्रश्न-पत्र 2 (40 अंक)',
        'badge': 'CBSE Class 10 Grammar'
    },
    'icse_muhavre_1': {
        'path': r'D:\Hindi Grammer\ICSE\Muhavare Worksheets\Hindi_Muhavare_Practice_Worksheet_1 (1).docx',
        'title': 'ICSE मुहावरे अभ्यास प्रश्न-पत्र 1',
        'badge': 'ICSE Class 10 Grammar'
    },
    'icse_muhavre_2': {
        'path': r'D:\Hindi Grammer\ICSE\Muhavare Worksheets\Hindi_Muhavare_Practice_Worksheet_2 (1).docx',
        'title': 'ICSE मुहावरे अभ्यास प्रश्न-पत्र 2',
        'badge': 'ICSE Class 10 Grammar'
    },
    'icse_muhavre_3': {
        'path': r'D:\Hindi Grammer\ICSE\Muhavare Worksheets\Hindi_Muhavare_Practice_Worksheet_3 (1).docx',
        'title': 'ICSE मुहावरे अभ्यास प्रश्न-पत्र 3',
        'badge': 'ICSE Class 10 Grammar'
    },
    'icse_muhavre_4': {
        'path': r'D:\Hindi Grammer\ICSE\Muhavare Worksheets\Hindi_Muhavare_Practice_Worksheet_4 (1).docx',
        'title': 'ICSE मुहावरे अभ्यास प्रश्न-पत्र 4',
        'badge': 'ICSE Class 10 Grammar'
    },
    'icse_muhavre_5': {
        'path': r'D:\Hindi Grammer\ICSE\Muhavare Worksheets\Hindi_Muhavare_Practice_Worksheet_5 (1).docx',
        'title': 'ICSE मुहावरे अभ्यास प्रश्न-पत्र 5',
        'badge': 'ICSE Class 10 Grammar'
    },
    'icse_muhavre_6': {
        'path': r'D:\Hindi Grammer\ICSE\Muhavare Worksheets\Hindi_Muhavare_Practice_Worksheet_6 (1).docx',
        'title': 'ICSE मुहावरे अभ्यास प्रश्न-पत्र 6',
        'badge': 'ICSE Class 10 Grammar'
    }
}

converted_data = {}
print("Converting D:\\Hindi Grammer files with full XML SDT text support...")
for key, info in files_map.items():
    if os.path.exists(info['path']):
        html = convert_docx_to_html(info['path'], info['title'], info['badge'])
        converted_data[key] = {
            'title': info['title'],
            'badge': info['badge'],
            'html': html
        }
        print(f"  ✓ Converted: {key} ({len(html)} chars)")
    else:
        print(f"  ❌ File not found: {info['path']}")

out_file = r"C:\Users\hmudg\.gemini\antigravity\scratch\gyanlok\grammar_converted_data.json"
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(converted_data, f, ensure_ascii=False, indent=2)

print(f"\nSaved converted HTML data to: {out_file}")
