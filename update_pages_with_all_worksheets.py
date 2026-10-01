import os
import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

GEN_FILE = r"C:\Users\hmudg\.gemini\antigravity\scratch\gyanlok\generate_seo_pages.py"

with open(GEN_FILE, 'r', encoding='utf-8') as f:
    code = f.read()

# Replace Muhavare worksheets in subpanel-2
old_muhavare_subpanel2 = """      <div id="cbse-m-subpanel-2" style="display:none;">
        <div style="margin-bottom:1.5rem;">
          {g_data.get('cbse_muhavre_1', {}).get('html', '')}
        </div>
        <div style="margin-top:1.5rem;">
          {g_data.get('cbse_muhavre_2', {}).get('html', '')}
        </div>
      </div>"""

new_muhavare_subpanel2 = """      <div id="cbse-m-subpanel-2" style="display:none;">
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; padding:1.5rem; border-radius:14px;">
          <h3 style="color:#0F172A; font-size:1.25rem; font-weight:800; margin-top:0; margin-bottom:0.5rem;">📝 CBSE मुहावरे अभ्यास कार्य-पत्रक (Worksheets 1 &amp; 2 — D:\\Hindi Grammer)</h3>
          <p style="color:#475569; font-size:0.92rem; margin-bottom:1.5rem;">40 अंकों के विस्तृत मुहावरे अभ्यास कार्य-पत्रक एवं उत्तर कुंजी:</p>
          {g_data.get('cbse_muhavre_worksheets_all', g_data.get('cbse_muhavre_1', {}).get('html', ''))}
        </div>
      </div>"""

if old_muhavare_subpanel2 in code:
    code = code.replace(old_muhavare_subpanel2, new_muhavare_subpanel2)
    print("✓ Updated Muhavare worksheets subpanel!")
else:
    print("⚠️ Could not match old_muhavare_subpanel2!")


# Replace Padbandh worksheets in subpanel-2
old_padbandh_subpanel2 = """          <div id="cbse-p-subpanel-2" style="display:none;">
            {g_data.get('cbse_padbandh_2', {}).get('html', '')}
          </div>"""

new_padbandh_subpanel2 = """          <div id="cbse-p-subpanel-2" style="display:none;">
            <div style="background:#FFFFFF; border:1px solid #E2E8F0; padding:1.5rem; border-radius:14px;">
              <h3 style="color:#0F172A; font-size:1.25rem; font-weight:800; margin-top:0; margin-bottom:0.5rem;">📝 CBSE पदबंध अभ्यास कार्य-पत्रक (Worksheets 1 &amp; 2 — D:\\Hindi Grammer)</h3>
              <p style="color:#475569; font-size:0.92rem; margin-bottom:1.5rem;">40 अंकों के विस्तृत पदबंध पहचान व रेखांकित भेद अभ्यास कार्य-पत्रक:</p>
              {g_data.get('cbse_padbandh_worksheets_all', g_data.get('cbse_padbandh_2', {}).get('html', ''))}
            </div>
          </div>"""

if old_padbandh_subpanel2 in code:
    code = code.replace(old_padbandh_subpanel2, new_padbandh_subpanel2)
    print("✓ Updated Padbandh worksheets subpanel!")
else:
    print("⚠️ Could not match old_padbandh_subpanel2!")


# Replace Vakya worksheets in subpanel-2
old_vakya_subpanel2 = """          <div id="cbse-v-subpanel-2" style="display:none;">
            {g_data.get('cbse_vakya_worksheets', {}).get('html', '')}
          </div>"""

new_vakya_subpanel2 = """          <div id="cbse-v-subpanel-2" style="display:none;">
            <div style="background:#FFFFFF; border:1px solid #E2E8F0; padding:1.5rem; border-radius:14px;">
              <h3 style="color:#0F172A; font-size:1.25rem; font-weight:800; margin-top:0; margin-bottom:0.5rem;">📝 CBSE रचना के आधार पर वाक्य रूपांतरण कार्य-पत्रक (Worksheets 1 &amp; 2 — D:\\Hindi Grammer)</h3>
              <p style="color:#475569; font-size:0.92rem; margin-bottom:1.5rem;">40 अंकों के सरल, संयुक्त एवं मिश्र वाक्य रूपांतरण अभ्यास कार्य-पत्रक:</p>
              {g_data.get('cbse_vakya_worksheets_all', g_data.get('cbse_vakya_worksheets', {}).get('html', ''))}
            </div>
          </div>"""

if old_vakya_subpanel2 in code:
    code = code.replace(old_vakya_subpanel2, new_vakya_subpanel2)
    print("✓ Updated Vakya worksheets subpanel!")
else:
    print("⚠️ Could not match old_vakya_subpanel2!")


# Update ICSE Page to include all 6 ICSE Muhavare Worksheets
old_icse_section = """    <section class="seo-section-card">
      <div class="seo-section-header">
        <span class="seo-section-icon">📖</span>
        <div>
          <h2 style="margin:0; font-size:1.35rem;">ICSE Class 10 - पाठ-वार मुहावरे (Chapter-wise Idioms)</h2>
          <p style="margin:0.2rem 0 0; font-size:0.9rem; color:#64748B;">साहित्य सागर, एकांकी संचय एवं नया रास्ता के पाठों के मुहावरे:</p>
        </div>
      </div>
      <div class="seo-grid">
        {"".join(icse_ch_cards)}
      </div>
    </section>"""

new_icse_section = """    <section class="seo-section-card" style="margin-bottom:2.5rem;">
      <div class="seo-section-header">
        <span class="seo-section-icon">📖</span>
        <div>
          <h2 style="margin:0; font-size:1.35rem;">ICSE Class 10 - पाठ-वार मुहावरे (Chapter-wise Idioms)</h2>
          <p style="margin:0.2rem 0 0; font-size:0.9rem; color:#64748B;">साहित्य सागर, एकांकी संचय एवं नया रास्ता के पाठों के मुहावरे:</p>
        </div>
      </div>
      <div class="seo-grid">
        {"".join(icse_ch_cards)}
      </div>
    </section>

    <section class="seo-section-card">
      <div class="seo-section-header">
        <span class="seo-section-icon" style="background:#ECFDF5; color:#059669;">📝</span>
        <div>
          <h2 style="margin:0; font-size:1.35rem; color:#0F172A;">ICSE मुहावरे अभ्यास कार्य-पत्रक (Worksheets 1 to 6 — D:\\Hindi Grammer)</h2>
          <p style="margin:0.2rem 0 0; font-size:0.9rem; color:#64748B;">ICSE कक्षा 10 हिंदी मुहावरे अभ्यास सेट (1 से 6) डाउनलोड DOCX एवं उत्तर कुंजी सहित:</p>
        </div>
      </div>
      <div style="background:#FFFFFF; border:1px solid #E2E8F0; padding:1.5rem; border-radius:14px; margin-top:1.25rem;">
        {g_data.get('icse_muhavre_worksheets_all', '')}
      </div>
    </section>"""

if old_icse_section in code:
    code = code.replace(old_icse_section, new_icse_section)
    print("✓ Updated ICSE page with all 6 ICSE Worksheets!")
else:
    print("⚠️ Could not match old_icse_section!")

with open(GEN_FILE, 'w', encoding='utf-8') as f:
    f.write(code)

print("🎉 File update complete!")
