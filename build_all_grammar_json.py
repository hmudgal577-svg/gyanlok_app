import json
import os
import shutil
import re

SCRATCH_DIR = r"C:\Users\hmudg\.gemini\antigravity\scratch\gyanlok"
PUBLIC_DIR = os.path.join(SCRATCH_DIR, "public")
UPLOADS_WS_DIR = os.path.join(PUBLIC_DIR, "uploads", "cbse", "worksheets")
os.makedirs(UPLOADS_WS_DIR, exist_ok=True)

# 1. Copy local DOCX files to public uploads
sources = [
    (r"D:\Hindi Grammer\CBSE\Muhavre Worksheets\Muhavre_Worksheet_1_40Marks (1).docx", "CBSE_Muhavre_Worksheet_1_40Marks.docx"),
    (r"D:\Hindi Grammer\CBSE\Muhavre Worksheets\Muhavre_Worksheet_2_40Marks (1).docx", "CBSE_Muhavre_Worksheet_2_40Marks.docx"),
    (r"D:\Hindi Grammer\CBSE\Padbandh Worksheets\Padbandh_Worksheet_1_40Marks (1).docx", "CBSE_Padbandh_Worksheet_1_40Marks.docx"),
    (r"D:\Hindi Grammer\CBSE\Padbandh Worksheets\Padbandh_Worksheet_2_40Marks (2).docx", "CBSE_Padbandh_Worksheet_2_40Marks.docx"),
    (r"D:\Hindi Grammer\CBSE\Rachna ke aadhar par Worksheets\Worksheet_1_Vakya_Rupantar_40Marks (1).docx", "CBSE_Vakya_Worksheet_1_40Marks.docx"),
    (r"D:\Hindi Grammer\CBSE\Rachna ke aadhar par Worksheets\Worksheet_2_Vakya_Rupantar_40Marks .docx", "CBSE_Vakya_Worksheet_2_40Marks.docx"),
    (r"D:\Hindi Grammer\ICSE\Muhavare Worksheets\Hindi_Muhavare_Practice_Worksheet_1 (1).docx", "ICSE_Muhavre_Worksheet_1.docx"),
    (r"D:\Hindi Grammer\ICSE\Muhavare Worksheets\Hindi_Muhavare_Practice_Worksheet_2 (1).docx", "ICSE_Muhavre_Worksheet_2.docx"),
    (r"D:\Hindi Grammer\ICSE\Muhavare Worksheets\Hindi_Muhavare_Practice_Worksheet_3 (1).docx", "ICSE_Muhavre_Worksheet_3.docx"),
    (r"D:\Hindi Grammer\ICSE\Muhavare Worksheets\Hindi_Muhavare_Practice_Worksheet_4 (1).docx", "ICSE_Muhavre_Worksheet_4.docx"),
    (r"D:\Hindi Grammer\ICSE\Muhavare Worksheets\Hindi_Muhavare_Practice_Worksheet_5 (1).docx", "ICSE_Muhavre_Worksheet_5.docx"),
    (r"D:\Hindi Grammer\ICSE\Muhavare Worksheets\Hindi_Muhavare_Practice_Worksheet_6 (1).docx", "ICSE_Muhavre_Worksheet_6.docx")
]

for src, fname in sources:
    if os.path.exists(src):
        dst = os.path.join(UPLOADS_WS_DIR, fname)
        shutil.copy(src, dst)
        print(f"Copied {fname} to uploads")

# 2. Load grammar_converted_data.json
json_path = os.path.join(SCRATCH_DIR, "grammar_converted_data.json")
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Helper to generate Worksheet Card Boxes Grid matching chapter cards layout (without continuous previews below)
def generate_worksheet_cards_grid_html(prefix, topic_name, worksheets_list):
    cards_html = []
    
    for idx, (ws_key, ws_title, ws_subtitle, ws_file) in enumerate(worksheets_list, 1):
        file_url = f"/uploads/cbse/worksheets/{ws_file}"
        
        # Clean redundant doc-header banner from inner html if present
        if ws_key in data and isinstance(data[ws_key], dict) and 'html' in data[ws_key]:
            data[ws_key]['html'] = re.sub(r'<div class="doc-header".*?</div>', '', data[ws_key]['html'], flags=re.DOTALL)

        cards_html.append(f"""
        <div class="seo-card ws-box-card" style="background:#FFFFFF; border-radius:14px; border:1px solid #E2E8F0; padding:1.25rem; box-shadow:0 4px 12px rgba(0,0,0,0.03); display:flex; flex-direction:column; justify-content:space-between; transition:transform 0.2s, box-shadow 0.2s;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; font-weight:800; color:#156082; text-transform:uppercase; background:#EBF3FD; padding:3px 10px; border-radius:4px;">PRACTICE • WORKSHEET</span>
              <span style="font-size:0.75rem; font-weight:700; color:#64748B; background:#F1F5F9; padding:2px 8px; border-radius:4px;">WORKSHEET #{idx}</span>
            </div>
            <h3 style="font-size:1.15rem; font-weight:800; color:#0F172A; margin:0.4rem 0 0.25rem;">{ws_title}</h3>
            <p style="font-size:0.85rem; color:#64748B; margin:0 0 1.1rem; line-height:1.5;">{ws_subtitle}</p>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; border-top:1px solid #F1F5F9; padding-top:0.85rem;">
            <button onclick="openWorksheetViewer('{ws_key}', '{ws_title}', '{file_url}')" style="flex:1; background:#156082; color:#FFFFFF; font-weight:700; font-size:0.85rem; padding:0.55rem 0.8rem; border-radius:8px; border:none; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:4px; box-shadow:0 2px 6px rgba(21,96,130,0.15);">
              👁️ हल करें (View)
            </button>
            <a href="{file_url}" download="{ws_file}" style="background:#FFFFFF; color:#156082; font-weight:700; font-size:0.85rem; padding:0.55rem 0.8rem; border-radius:8px; border:1px solid #BAE0FD; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:4px;">
              📥 Download (.docx)
            </a>
          </div>
        </div>
        """)

    cards_str = "".join(cards_html)

    return f"""
<div class="worksheets-cards-container" style="font-family: 'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif;">
  <div style="margin-bottom: 1.25rem;">
    <h3 style="font-size:1.25rem; font-weight:800; color:#0F172A; margin:0 0 0.35rem;">
      📝 {topic_name} - अभ्यास कार्य-पत्रक बॉक्स (Worksheets Cards)
    </h3>
    <p style="font-size:0.9rem; color:#64748B; margin:0;">
      नीचे दिए गए कार्य-पत्रक कार्ड्स में से किसी भी बॉक्स पर <b>"👁️ हल करें"</b> पर क्लिक करके अभ्यास खोलें अथवा <b>"📥 Download"</b> करें:
    </p>
  </div>

  <!-- Cards Box Grid matching Chapter Cards -->
  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:1.15rem; margin-bottom:1.5rem;">
    {cards_str}
  </div>
</div>
"""

data['cbse_muhavre_worksheets_all'] = generate_worksheet_cards_grid_html(
    "mws", "CBSE हिंदी मुहावरे",
    [
        ("cbse_muhavre_1", "अभ्यास कार्य-पत्रक 1 (Worksheet 1)", "40 अंकों के विस्तृत मुहावरे अभ्यास प्रश्न व उत्तर कुंजी।", "CBSE_Muhavre_Worksheet_1_40Marks.docx"),
        ("cbse_muhavre_2", "अभ्यास कार्य-पत्रक 2 (Worksheet 2)", "40 अंकों के विस्तृत मुहावरे अभ्यास कार्य-पत्रक एवं उत्तर सेट।", "CBSE_Muhavre_Worksheet_2_40Marks.docx")
    ]
)

data['cbse_padbandh_worksheets_all'] = generate_worksheet_cards_grid_html(
    "pws", "CBSE हिंदी पदबंध",
    [
        ("cbse_padbandh_1", "अभ्यास कार्य-पत्रक 1 (Worksheet 1)", "40 अंकों के विस्तृत पदबंध पहचान व भेद अभ्यास प्रश्न।", "CBSE_Padbandh_Worksheet_1_40Marks.docx"),
        ("cbse_padbandh_2", "अभ्यास कार्य-पत्रक 2 (Worksheet 2)", "40 अंकों के रेखांकित पदबंध रूपांतरण व उत्तर कुंजी।", "CBSE_Padbandh_Worksheet_2_40Marks.docx")
    ]
)

data['cbse_vakya_worksheets_all'] = generate_worksheet_cards_grid_html(
    "vws", "CBSE वाक्य रूपांतरण",
    [
        ("cbse_vakya_1", "अभ्यास कार्य-पत्रक 1 (Worksheet 1)", "40 अंकों के सरल, संयुक्त एवं मिश्र वाक्य रूपांतरण प्रश्न।", "CBSE_Vakya_Worksheet_1_40Marks.docx"),
        ("cbse_vakya_2", "अभ्यास कार्य-पत्रक 2 (Worksheet 2)", "40 अंकों के वाक्य पहचान एवं रचना रूपांतरण अभ्यास सेट।", "CBSE_Vakya_Worksheet_2_40Marks.docx")
    ]
)

data['icse_muhavre_worksheets_all'] = generate_worksheet_cards_grid_html(
    "imws", "ICSE हिंदी मुहावरे",
    [
        ("icse_muhavre_1", "ICSE अभ्यास कार्य-पत्रक 1", "ICSE मुहावरे अभ्यास कार्य-पत्रक 1 एवं उत्तर कुंजी।", "ICSE_Muhavre_Worksheet_1.docx"),
        ("icse_muhavre_2", "ICSE अभ्यास कार्य-पत्रक 2", "ICSE मुहावरे अभ्यास कार्य-पत्रक 2 एवं उत्तर कुंजी।", "ICSE_Muhavre_Worksheet_2.docx"),
        ("icse_muhavre_3", "ICSE अभ्यास कार्य-पत्रक 3", "ICSE मुहावरे अभ्यास कार्य-पत्रक 3 एवं उत्तर कुंजी।", "ICSE_Muhavre_Worksheet_3.docx"),
        ("icse_muhavre_4", "ICSE अभ्यास कार्य-पत्रक 4", "ICSE मुहावरे अभ्यास कार्य-पत्रक 4 एवं उत्तर कुंजी।", "ICSE_Muhavre_Worksheet_4.docx"),
        ("icse_muhavre_5", "ICSE अभ्यास कार्य-पत्रक 5", "ICSE मुहावरे अभ्यास कार्य-पत्रक 5 एवं उत्तर कुंजी।", "ICSE_Muhavre_Worksheet_5.docx"),
        ("icse_muhavre_6", "ICSE अभ्यास कार्य-पत्रक 6", "ICSE मुहावरे अभ्यास कार्य-पत्रक 6 एवं उत्तर कुंजी।", "ICSE_Muhavre_Worksheet_6.docx")
    ]
)

# Save json locally and to public folder
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

shutil.copy(json_path, os.path.join(PUBLIC_DIR, "grammar_converted_data.json"))
print("Successfully generated combined worksheet HTML data!")
