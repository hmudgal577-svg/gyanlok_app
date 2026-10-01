import os
import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

GEN_FILE = r"C:\Users\hmudg\.gemini\antigravity\scratch\gyanlok\generate_seo_pages.py"

with open(GEN_FILE, 'r', encoding='utf-8') as f:
    code = f.read()

# Replace green styling in Writing Skills Card on CBSE main portal
old_writing_card = """      <!-- CARD 2: WRITING SKILLS (15 MARKS) -->
      <div style="background:#FFFFFF; border:2px solid #16A34A; border-radius:18px; padding:2rem; box-shadow:0 8px 30px rgba(22,163,74,0.06); display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <span style="background:#F0FDF4; color:#16A34A; font-weight:800; font-size:0.75rem; padding:0.35rem 0.85rem; border-radius:9999px;">WRITING SKILLS</span>
            <span style="font-weight:700; color:#16A34A; font-size:0.9rem;">15 MARKS</span>
          </div>
          <h2 style="font-size:1.55rem; font-weight:800; color:#0F172A; margin:0 0 0.5rem;">2. Writing Skills (लेखन कौशल)</h2>
          <p style="font-size:0.92rem; color:#64748B; margin:0 0 1.25rem; line-height:1.6;">रचनात्मक लेखन के सभी 3 विषयों के समर्पित पेजेस (प्रारूप व हल सहित उदाहरण):</p>
          
          <div style="display:flex; flex-direction:column; gap:0.65rem; margin-bottom:1.5rem;">
            <a href="/hindi-grammar/cbse/paragraph-writing/" class="btn" style="background:#F8FAFC; border:1px solid #CBD5E1; color:#0F172A; font-weight:700; padding:0.65rem 1rem; border-radius:10px; text-decoration:none; display:flex; justify-content:space-between; align-items:center;">
              <span>📝 अनुच्छेद लेखन (Paragraph Writing)</span>
              <span style="color:#16A34A;">पेज खोलें &rarr;</span>
            </a>
            <a href="/hindi-grammar/cbse/letter-writing/" class="btn" style="background:#F8FAFC; border:1px solid #CBD5E1; color:#0F172A; font-weight:700; padding:0.65rem 1rem; border-radius:10px; text-decoration:none; display:flex; justify-content:space-between; align-items:center;">
              <span>✉️ पत्र लेखन (Letter Writing)</span>
              <span style="color:#16A34A;">पेज खोलें &rarr;</span>
            </a>
            <a href="/hindi-grammar/cbse/email-writing/" class="btn" style="background:#F8FAFC; border:1px solid #CBD5E1; color:#0F172A; font-weight:700; padding:0.65rem 1rem; border-radius:10px; text-decoration:none; display:flex; justify-content:space-between; align-items:center;">
              <span>📧 ईमेल लेखन (Email Writing)</span>
              <span style="color:#16A34A;">पेज खोलें &rarr;</span>
            </a>
          </div>
        </div>
      </div>"""

new_writing_card = """      <!-- CARD 2: WRITING SKILLS (15 MARKS - UNIFIED CBSE BLUE THEME) -->
      <div style="background:#FFFFFF; border:2px solid #2563EB; border-radius:18px; padding:2rem; box-shadow:0 8px 30px rgba(37,99,235,0.06); display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <span style="background:#EFF6FF; color:#1D4ED8; font-weight:800; font-size:0.75rem; padding:0.35rem 0.85rem; border-radius:9999px; border:1px solid #BFDBFE;">WRITING SKILLS</span>
            <span style="font-weight:700; color:#2563EB; font-size:0.9rem;">15 MARKS</span>
          </div>
          <h2 style="font-size:1.55rem; font-weight:800; color:#0F172A; margin:0 0 0.5rem;">2. Writing Skills (लेखन कौशल)</h2>
          <p style="font-size:0.92rem; color:#64748B; margin:0 0 1.25rem; line-height:1.6;">रचनात्मक लेखन के सभी 3 विषयों के समर्पित पेजेस (प्रारूप व हल सहित उदाहरण):</p>
          
          <div style="display:flex; flex-direction:column; gap:0.65rem; margin-bottom:1.5rem;">
            <a href="/hindi-grammar/cbse/paragraph-writing/" class="btn" style="background:#F8FAFC; border:1.5px solid #BFDBFE; color:#0F172A; font-weight:700; padding:0.65rem 1rem; border-radius:10px; text-decoration:none; display:flex; justify-content:space-between; align-items:center;">
              <span>📝 अनुच्छेद लेखन (Paragraph Writing)</span>
              <span style="color:#2563EB;">पेज खोलें &rarr;</span>
            </a>
            <a href="/hindi-grammar/cbse/letter-writing/" class="btn" style="background:#F8FAFC; border:1.5px solid #BFDBFE; color:#0F172A; font-weight:700; padding:0.65rem 1rem; border-radius:10px; text-decoration:none; display:flex; justify-content:space-between; align-items:center;">
              <span>✉️ पत्र लेखन (Letter Writing)</span>
              <span style="color:#2563EB;">पेज खोलें &rarr;</span>
            </a>
            <a href="/hindi-grammar/cbse/email-writing/" class="btn" style="background:#F8FAFC; border:1.5px solid #BFDBFE; color:#0F172A; font-weight:700; padding:0.65rem 1rem; border-radius:10px; text-decoration:none; display:flex; justify-content:space-between; align-items:center;">
              <span>📧 ईमेल लेखन (Email Writing)</span>
              <span style="color:#2563EB;">पेज खोलें &rarr;</span>
            </a>
          </div>
        </div>
      </div>"""

if old_writing_card in code:
    code = code.replace(old_writing_card, new_writing_card)
    print("✓ Updated Writing Skills card to unified CBSE Royal Blue theme!")
else:
    print("⚠️ Could not match old_writing_card!")

with open(GEN_FILE, 'w', encoding='utf-8') as f:
    f.write(code)

print("🎉 Theme update complete in generate_seo_pages.py!")
