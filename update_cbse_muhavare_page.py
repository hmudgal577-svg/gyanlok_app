import os
import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

GEN_FILE = r"C:\Users\hmudg\.gemini\antigravity\scratch\gyanlok\generate_seo_pages.py"

with open(GEN_FILE, 'r', encoding='utf-8') as f:
    code = f.read()

# Generate 17 CBSE Chapter Cards HTML
cbse_ch_cards_code = """
    # Build 17 CBSE Chapter Muhavare Cards Grid
    cbse_muhavare_cards = []
    for ch in CBSE_CHAPTERS:
        url = f"/cbse/class-10/hindi/{ch['slug']}/#muhavre"
        cbse_muhavare_cards.append(f'''<div class="seo-card" style="background:#FFFFFF; border-radius:14px; border:1px solid #E2E8F0; padding:1.25rem; box-shadow:0 4px 12px rgba(0,0,0,0.03); display:flex; flex-direction:column; justify-content:space-between; border-top:3px solid #2563EB;">
          <div>
            <div style="font-size:0.75rem; font-weight:800; color:#2563EB; text-transform:uppercase; margin-bottom:0.35rem; background:#EFF6FF; padding:2px 8px; border-radius:4px; width:fit-content;">{ch['book']} &bull; Ch.{ch['num']}</div>
            <h3 style="font-size:1.1rem; font-weight:800; color:#0F172A; margin:0.35rem 0 0.25rem;">{ch['title']}</h3>
            <p style="font-size:0.85rem; color:#64748B; margin:0 0 1rem;">लेखक: {ch['author']}</p>
          </div>
          <a href="{url}" class="btn btn-outline" style="padding:0.5rem 0.9rem; font-size:0.86rem; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:0.4rem; color:#2563EB; border:1.5px solid #BFDBFE; font-weight:700; border-radius:8px; background:#F8FAFC; transition:all 0.2s;">📖 इस पाठ के मुहावरे देखें &rarr;</a>
        </div>''')

    cbse_muhavare_grid_html = '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:1.15rem; margin-top:1.25rem; margin-bottom:2rem;">' + "".join(cbse_muhavare_cards) + '</div>'
"""

# Let's inspect where create_cbse_topic_page("muhavare" is in generate_seo_pages.py
old_muhavare_call = '''    # 3. DEDICATED MUHAVARE PAGE: /hindi-grammar/cbse/muhavare/
    create_cbse_topic_page("muhavare", "मुहावरे (Muhavare)", "कक्षा 10 हिंदी (स्पर्श व संचयन) पाठ-वार मुहावरे, अभ्यास कार्य-पत्रक एवं उत्तर सहित अतिरिक्त अभ्यास प्रश्न।", f"""
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem; margin-bottom:1.5rem;">
        <button id="btn-cbse-m-sub1" onclick="switchCbseMuhavreSub('sub1')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #2563EB; background:#2563EB; color:#ffffff; cursor:pointer;">
          📖 CHAPTER WISE MUHAVARE
        </button>
        <button id="btn-cbse-m-sub2" onclick="switchCbseMuhavreSub('sub2')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #E2E8F0; background:#F8FAFC; color:#334155; cursor:pointer;">
          📝 MUHAVARE WORKSHEETS
        </button>
        <button id="btn-cbse-m-sub3" onclick="switchCbseMuhavreSub('sub3')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #E2E8F0; background:#F8FAFC; color:#334155; cursor:pointer;">
          📚 ADDITIONAL MATERIAL
        </button>
      </div>

      <div id="cbse-m-subpanel-1" style="display:block;">
        {g_data.get('cbse_muhavre_1', {}).get('html', '')}
      </div>
      <div id="cbse-m-subpanel-2" style="display:none;">
        {g_data.get('cbse_muhavre_2', {}).get('html', '')}
      </div>
      <div id="cbse-m-subpanel-3" style="display:none;">
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; padding:1.5rem; border-radius:12px;">
          <h3 style="color:#1E3A5F; font-size:1.2rem; margin-top:0;">ADDITIONAL MATERIAL (अतिरिक्त अभ्यास प्रश्न व लोकोक्तियाँ)</h3>
          <p style="color:#475569; font-size:0.92rem;">विगत वर्षों की बोर्ड परीक्षाओं पर आधारित महत्वपूर्ण मुहावरे व अभ्यास सेट।</p>
        </div>
      </div>
    """)'''

new_muhavare_call = '''    # Build 17 CBSE Chapter Muhavare Cards Grid
    cbse_muhavare_cards = []
    for ch in CBSE_CHAPTERS:
        url = f"/cbse/class-10/hindi/{ch['slug']}/#muhavre"
        cbse_muhavare_cards.append(f"""<div class="seo-card" style="background:#FFFFFF; border-radius:14px; border:1px solid #E2E8F0; padding:1.25rem; box-shadow:0 4px 12px rgba(0,0,0,0.03); display:flex; flex-direction:column; justify-content:space-between; border-top:3px solid #2563EB;">
          <div>
            <div style="font-size:0.75rem; font-weight:800; color:#2563EB; text-transform:uppercase; margin-bottom:0.35rem; background:#EFF6FF; padding:2px 8px; border-radius:4px; width:fit-content;">{ch['book']} &bull; Ch.{ch['num']}</div>
            <h3 style="font-size:1.1rem; font-weight:800; color:#0F172A; margin:0.35rem 0 0.25rem;">{ch['title']}</h3>
            <p style="font-size:0.85rem; color:#64748B; margin:0 0 1rem;">लेखक: {ch['author']}</p>
          </div>
          <a href="{url}" class="btn btn-outline" style="padding:0.5rem 0.9rem; font-size:0.86rem; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:0.4rem; color:#2563EB; border:1.5px solid #BFDBFE; font-weight:700; border-radius:8px; background:#F8FAFC; transition:all 0.2s;">📖 इस पाठ के मुहावरे देखें &rarr;</a>
        </div>""")

    cbse_muhavare_grid_html = '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:1.15rem; margin-top:1.25rem; margin-bottom:2rem;">' + "".join(cbse_muhavare_cards) + '</div>'

    # 3. DEDICATED MUHAVARE PAGE: /hindi-grammar/cbse/muhavare/
    create_cbse_topic_page("muhavare", "मुहावरे (Muhavare)", "कक्षा 10 हिंदी (स्पर्श व संचयन) पाठ-वार मुहावरे, अभ्यास कार्य-पत्रक एवं उत्तर सहित अतिरिक्त अभ्यास प्रश्न।", f"""
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem; margin-bottom:1.5rem;">
        <button id="btn-cbse-m-sub1" onclick="switchCbseMuhavreSub('sub1')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #2563EB; background:#2563EB; color:#ffffff; cursor:pointer;">
          📖 CHAPTER WISE MUHAVARE
        </button>
        <button id="btn-cbse-m-sub2" onclick="switchCbseMuhavreSub('sub2')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #E2E8F0; background:#F8FAFC; color:#334155; cursor:pointer;">
          📝 MUHAVARE WORKSHEETS
        </button>
        <button id="btn-cbse-m-sub3" onclick="switchCbseMuhavreSub('sub3')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #E2E8F0; background:#F8FAFC; color:#334155; cursor:pointer;">
          📚 ADDITIONAL MATERIAL
        </button>
      </div>

      <div id="cbse-m-subpanel-1" style="display:block;">
        <div style="background:#F8FAFC; border:1px solid #CBD5E1; padding:1.5rem; border-radius:14px; margin-bottom:2rem;">
          <h3 style="color:#0F172A; font-size:1.25rem; font-weight:800; margin-top:0; margin-bottom:0.5rem;">📚 पाठ-वार मुहावरे (Chapter-Wise Idioms Cards)</h3>
          <p style="color:#475569; font-size:0.92rem; margin-bottom:1rem;">कक्षा 10 हिंदी (कोर्स बी) के सभी 17 पाठों (स्पर्श एवं संचयन भाग-2) के महत्वपूर्ण मुहावरे, अर्थ व वाक्य प्रयोग के कार्ड्स:</p>
          {cbse_muhavare_grid_html}
        </div>
        
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; padding:1.5rem; border-radius:12px;">
          <h3 style="color:#1E3A5F; font-size:1.2rem; margin-top:0;">CHAPTER WISE MUHAVARE DETAILS (विस्तृत पाठ-वार मुहावरे सूची)</h3>
          {g_data.get('cbse_muhavre_1', {}).get('html', '')}
        </div>
      </div>

      <div id="cbse-m-subpanel-2" style="display:none;">
        {g_data.get('cbse_muhavre_2', {}).get('html', '')}
      </div>

      <div id="cbse-m-subpanel-3" style="display:none;">
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; padding:1.5rem; border-radius:12px;">
          <h3 style="color:#1E3A5F; font-size:1.2rem; margin-top:0;">ADDITIONAL MATERIAL (अतिरिक्त अभ्यास प्रश्न व लोकोक्तियाँ)</h3>
          <p style="color:#475569; font-size:0.92rem;">विगत वर्षों की बोर्ड परीक्षाओं पर आधारित महत्वपूर्ण मुहावरे व अभ्यास सेट।</p>
        </div>
      </div>
    """)'''

if old_muhavare_call in code:
    code = code.replace(old_muhavare_call, new_muhavare_call)
    with open(GEN_FILE, 'w', encoding='utf-8') as f:
        f.write(code)
    print("✓ Successfully added 17 Chapter Muhavare Cards Grid to /hindi-grammar/cbse/muhavare/!")
else:
    print("⚠️ Could not match old_muhavare_call in generate_seo_pages.py!")
