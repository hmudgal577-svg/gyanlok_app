import os
import sys
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

GEN_FILE = r"C:\Users\hmudg\.gemini\antigravity\scratch\gyanlok\generate_seo_pages.py"

with open(GEN_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update get_navbar dropdown for Hindi Grammar
old_grammar_dropdown = """      <!-- Hindi Grammar dropdown -->
      <div class="nav-dropdown-wrapper">
        <button class="nav-link dropdown-trigger {'active' if active_link=='grammar' else ''}" aria-haspopup="true" aria-expanded="false" id="grammar-trigger">
          Hindi Grammar
          <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-dropdown-menu" id="grammar-dropdown" role="menu">
          <a href="/hindi-grammar/#board-panel-cbse" class="dropdown-item" role="menuitem">
            <span class="di-tag cbse">C</span> CBSE Grammar &amp; Writing Skills
          </a>
          <a href="/hindi-grammar/#board-panel-icse" class="dropdown-item" role="menuitem">
            <span class="di-tag icse">I</span> ICSE Grammar &amp; Composition
          </a>
          <a href="/hindi-grammar/muhavare/" class="dropdown-item" role="menuitem">
            <span class="di-tag" style="background:#FFF4E0; color:#E8900A;">M</span> मुहावरे (Muhavare)
          </a>
          <a href="/hindi-grammar/padbandh/" class="dropdown-item" role="menuitem">
            <span class="di-tag" style="background:#EBF3FD; color:#2563EB;">P</span> पदबंध (Padbandh)
          </a>
          <a href="/hindi-grammar/#cbse-topicpanel-samas" class="dropdown-item" role="menuitem">
            <span class="di-tag" style="background:#F0FDF4; color:#16A34A;">S</span> समास (Samas)
          </a>
          <a href="/hindi-grammar/#cbse-topicpanel-vakya" class="dropdown-item" role="menuitem">
            <span class="di-tag" style="background:#FDF2F8; color:#DB2777;">V</span> वाक्य भेद (Vakya Bhed)
          </a>
          <a href="/hindi-grammar/#cbse-writing-box" class="dropdown-item" role="menuitem">
            <span class="di-tag" style="background:#F0FDF4; color:#16A34A;">W</span> लेखन कौशल (Writing Skills)
          </a>
          <a href="/hindi-grammar/" class="dropdown-item" role="menuitem" style="border-top:1px solid #E2E8F0; font-weight:600;">
            <span class="di-tag" style="background:#FFF4E0; color:#E8900A;">Hub</span> All Grammar Resources
          </a>
        </div>
      </div>"""

new_grammar_dropdown = """      <!-- Hindi Grammar dropdown (Strictly 2 options: CBSE, ICSE) -->
      <div class="nav-dropdown-wrapper">
        <button class="nav-link dropdown-trigger {'active' if active_link=='grammar' else ''}" aria-haspopup="true" aria-expanded="false" id="grammar-trigger">
          Hindi Grammar
          <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-dropdown-menu" id="grammar-dropdown" role="menu">
          <a href="/hindi-grammar/cbse/" class="dropdown-item" role="menuitem">
            <span class="di-tag cbse">C</span> CBSE
          </a>
          <a href="/hindi-grammar/icse/" class="dropdown-item" role="menuitem">
            <span class="di-tag icse">I</span> ICSE
          </a>
        </div>
      </div>"""

if old_grammar_dropdown in content:
    content = content.replace(old_grammar_dropdown, new_grammar_dropdown)
    print("✓ Updated get_navbar dropdown for Hindi Grammar to 2 options: CBSE and ICSE!")
else:
    print("⚠️ Could not match exact old_grammar_dropdown in get_navbar. Will inspect if needed.")

# 2. Complete new code for generate_grammar_pages()
new_generate_grammar_pages_code = '''# ==============================================================================
# 5. GENERATE HINDI GRAMMAR HUB, CBSE DEDICATED PAGE & ICSE DEDICATED PAGE
# ==============================================================================
def generate_grammar_pages():
    print("\\n--- Generating Hindi Grammar Pages (Hub, /hindi-grammar/cbse/, /hindi-grammar/icse/) ---")

    # Load converted grammar JSON data
    with open(os.path.join(PUBLIC_DIR, '..', 'grammar_converted_data.json'), 'r', encoding='utf-8') as f:
        g_data = json.load(f)

    # --------------------------------------------------------------------------
    # 1. HUB PAGE: /hindi-grammar/
    # --------------------------------------------------------------------------
    rel_dir_hub = "hindi-grammar"
    canonical_hub = f"{BASE_URL}/{rel_dir_hub}/"
    ALL_CANONICAL_URLS.append(canonical_hub)

    seo_title_hub = "Class 10 Hindi Grammar & Writing Skills | CBSE & ICSE | EkShala"
    desc_hub = "Class 10 Hindi Grammar & Writing Skills hub. Select CBSE or ICSE board for comprehensive notes, rules, formats, and practice worksheets."

    schema_hub = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "होम", "item": f"{BASE_URL}/" },
                    { "@type": "ListItem", "position": 2, "name": "Hindi Grammar Hub", "item": canonical_hub }
                ]
            }
        ]
    }

    breadcrumbs_hub = f"""<div class="seo-breadcrumb-bar">
  <div class="container">
    <ol class="seo-breadcrumbs" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="/" itemprop="item"><span itemprop="name">होम</span></a>
        <meta itemprop="position" content="1" />
      </li>
      <li class="sep">&rsaquo;</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span class="current" itemprop="name">Hindi Grammar Hub</span>
        <meta itemprop="position" content="2" />
      </li>
    </ol>
  </div>
</div>"""

    hero_hub = f"""<header class="seo-hero">
  <div class="container">
    <span class="seo-hero-badge">CBSE &bull; ICSE &bull; संपूर्ण हिंदी व्याकरण</span>
    <h1>Class 10 Hindi Grammar &amp; Writing Skills</h1>
    <p class="lead">अपनी अध्ययन बोर्ड प्रणाली का चयन करें और विस्तृत व्याकरण नियमों, मुहावरों, पदबंध, समास, वाक्य रूपांतरण एवं रचनात्मक लेखन कौशल का अध्ययन करें:</p>
  </div>
</header>"""

    body_hub = f"""<main class="seo-content-wrap">
  <div class="container">
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:2rem; margin-bottom:3rem;">
      
      <!-- CBSE Choice Card -->
      <div style="background:#FFFFFF; border:2px solid #2563EB; border-radius:18px; padding:2rem; box-shadow:0 8px 30px rgba(37,99,235,0.08); display:flex; flex-direction:column; justify-space-between;">
        <div>
          <span style="background:#EFF6FF; color:#2563EB; font-weight:700; font-size:0.8rem; padding:0.35rem 0.85rem; border-radius:9999px; text-transform:uppercase; letter-spacing:0.5px;">CBSE Board</span>
          <h2 style="font-size:1.6rem; color:#0F172A; margin:1rem 0 0.5rem; font-weight:800;">CBSE Class 10 Hindi Grammar</h2>
          <p style="color:#475569; font-size:0.95rem; line-height:1.7; margin-bottom:1.5rem;">व्याकरण खंड (16 अंक): मुहावरे, पदबंध, समास, रचना के आधार पर वाक्य।<br/>लेखन कौशल (15 अंक): अनुच्छेद लेखन, पत्र लेखन, ईमेल लेखन उत्तर सहित।</p>
        </div>
        <a href="/hindi-grammar/cbse/" class="btn btn-primary" style="padding:0.85rem 1.5rem; font-weight:700; border-radius:12px; text-align:center; text-decoration:none; display:inline-block; background:#2563EB; color:#ffffff; font-size:1rem;">CBSE व्याकरण पर जाएँ &rarr;</a>
      </div>

      <!-- ICSE Choice Card -->
      <div style="background:#FFFFFF; border:2px solid #059669; border-radius:18px; padding:2rem; box-shadow:0 8px 30px rgba(5,150,105,0.08); display:flex; flex-direction:column; justify-space-between;">
        <div>
          <span style="background:#ECFDF5; color:#059669; font-weight:700; font-size:0.8rem; padding:0.35rem 0.85rem; border-radius:9999px; text-transform:uppercase; letter-spacing:0.5px;">ICSE Board</span>
          <h2 style="font-size:1.6rem; color:#0F172A; margin:1rem 0 0.5rem; font-weight:800;">ICSE Class 10 Hindi Grammar</h2>
          <p style="color:#475569; font-size:0.95rem; line-height:1.7; margin-bottom:1.5rem;">आधिकारिक ICSE अंक विभाजन: निबंध लेखन (15M), पत्र लेखन (7M), अपठित गद्यांश (10M), व्याकरण (8M) एवं साहित्य सागर, एकांकी संचय व नया रास्ता के मुहावरे।</p>
        </div>
        <a href="/hindi-grammar/icse/" class="btn btn-success" style="padding:0.85rem 1.5rem; font-weight:700; border-radius:12px; text-align:center; text-decoration:none; display:inline-block; background:#059669; color:#ffffff; font-size:1rem;">ICSE व्याकरण पर जाएँ &rarr;</a>
      </div>

    </div>
  </div>
</main>"""

    full_page_hub = get_common_head(seo_title_hub, desc_hub, canonical_hub, json.dumps(schema_hub, indent=2))
    full_page_hub += get_navbar(active_link='grammar')
    full_page_hub += breadcrumbs_hub
    full_page_hub += hero_hub
    full_page_hub += body_hub
    full_page_hub += get_footer(extra_html=upload_modal_html, extra_scripts=extra_scripts)
    write_html_file(rel_dir_hub, full_page_hub)


    # --------------------------------------------------------------------------
    # 2. DEDICATED CBSE PAGE: /hindi-grammar/cbse/
    # --------------------------------------------------------------------------
    rel_dir_cbse = "hindi-grammar/cbse"
    canonical_cbse = f"{BASE_URL}/{rel_dir_cbse}/"
    ALL_CANONICAL_URLS.append(canonical_cbse)

    seo_title_cbse = "CBSE Class 10 Hindi Grammar & Writing Skills | Notes, Rules & Worksheets | EkShala"
    desc_cbse = "CBSE Class 10 Hindi Grammar & Writing Skills. Comprehensive notes & worksheets for Muhavare, Padbandh, Samas, Vakya Bhed, Paragraph Writing, Letter Writing, and Email Writing."

    schema_cbse = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "होम", "item": f"{BASE_URL}/" },
                    { "@type": "ListItem", "position": 2, "name": "Hindi Grammar Hub", "item": canonical_hub },
                    { "@type": "ListItem", "position": 3, "name": "CBSE Grammar", "item": canonical_cbse }
                ]
            }
        ]
    }

    breadcrumbs_cbse = f"""<div class="seo-breadcrumb-bar">
  <div class="container">
    <ol class="seo-breadcrumbs" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="/" itemprop="item"><span itemprop="name">होम</span></a>
        <meta itemprop="position" content="1" />
      </li>
      <li class="sep">&rsaquo;</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="/hindi-grammar/" itemprop="item"><span itemprop="name">Hindi Grammar Hub</span></a>
        <meta itemprop="position" content="2" />
      </li>
      <li class="sep">&rsaquo;</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span class="current" itemprop="name">CBSE Hindi Grammar &amp; Writing Skills</span>
        <meta itemprop="position" content="3" />
      </li>
    </ol>
  </div>
</div>"""

    hero_cbse = f"""<header class="seo-hero">
  <div class="container">
    <span class="seo-hero-badge">CBSE CLASS 10 &bull; 31 MARKS TOTAL</span>
    <h1>CBSE Class 10 Hindi Grammar &amp; Writing Skills</h1>
    <p class="lead">कक्षा 10 हिंदी (कोर्स बी) के संपूर्ण व्याकरण एवं रचनात्मक लेखन कौशल। बोर्ड परीक्षा ब्लूप्रिंट के अनुसार 2 मुख्य श्रेणियों में वर्गीकृत:</p>
  </div>
</header>"""

    body_cbse = f"""<main class="seo-content-wrap">
  <div class="container">
    
    <!-- TOP FEATURED 2 CARDS (Matching User Diagram) -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.75rem; margin-bottom:2.5rem;">
      
      <!-- CARD 1: CBSE GRAMMAR TOPICS -->
      <div style="background:#FFFFFF; border:2px solid #2563EB; border-radius:16px; padding:1.75rem; box-shadow:0 6px 20px rgba(37,99,235,0.06); display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <span style="background:#EFF6FF; color:#2563EB; font-weight:800; font-size:0.75rem; padding:0.3rem 0.75rem; border-radius:9999px;">CBSE OFFICIAL</span>
            <span style="font-weight:700; color:#2563EB; font-size:0.9rem;">16 MARKS</span>
          </div>
          <h2 style="font-size:1.45rem; font-weight:800; color:#0F172A; margin:0 0 0.5rem;">CBSE Hindi Grammar (व्याकरण खंड)</h2>
          <p style="font-size:0.9rem; color:#64748B; margin:0 0 1rem; line-height:1.6;">कोर्स 'बी' का व्यावहारिक व्याकरण: मुहावरे, पदबंध, समास एवं रचना के आधार पर वाक्य रूपांतरण उत्तर सहित।</p>
        </div>
        <a href="#cbse-grammar-section" onclick="switchCbseMainCategory('grammar')" class="btn btn-primary" style="padding:0.75rem 1.25rem; font-weight:700; border-radius:10px; text-align:center; text-decoration:none; background:#2563EB; color:#ffffff; font-size:0.92rem; display:block;">CBSE Grammar Topics Explore &darr;</a>
      </div>

      <!-- CARD 2: WRITING SKILLS -->
      <div style="background:#FFFFFF; border:2px solid #16A34A; border-radius:16px; padding:1.75rem; box-shadow:0 6px 20px rgba(22,163,74,0.06); display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <span style="background:#F0FDF4; color:#16A34A; font-weight:800; font-size:0.75rem; padding:0.3rem 0.75rem; border-radius:9999px;">WRITING SKILLS</span>
            <span style="font-weight:700; color:#16A34A; font-size:0.9rem;">15 MARKS</span>
          </div>
          <h2 style="font-size:1.45rem; font-weight:800; color:#0F172A; margin:0 0 0.5rem;">Writing Skills (लेखन कौशल)</h2>
          <p style="font-size:0.9rem; color:#64748B; margin:0 0 1rem; line-height:1.6;">80 अंकों में से 15 अंकों का रचनात्मक लेखन: अनुच्छेद लेखन (5M), पत्र लेखन (5M) एवं ईमेल लेखन (5M) आधिकारिक प्रारूप सहित।</p>
        </div>
        <a href="#cbse-writing-section" onclick="switchCbseMainCategory('writing')" class="btn btn-success" style="padding:0.75rem 1.25rem; font-weight:700; border-radius:10px; text-align:center; text-decoration:none; background:#16A34A; color:#ffffff; font-size:0.92rem; display:block;">Writing Skills Explore &darr;</a>
      </div>

    </div>

    <!-- MAIN INTERACTIVE CONTAINER -->
    <div id="cbse-grammar-section" class="seo-section-card" style="border-top:4px solid #2563EB;">
      
      <!-- Category Switcher Tabs -->
      <div style="display:flex; gap:0.75rem; margin-bottom:2rem; border-bottom:2px solid #E2E8F0; padding-bottom:1rem; flex-wrap:wrap;">
        <button id="btn-cbse-main-grammar" onclick="switchCbseMainCategory('grammar')" style="padding:0.7rem 1.5rem; border-radius:10px; font-weight:700; font-size:0.98rem; cursor:pointer; border:2px solid #2563EB; background:#2563EB; color:#FFFFFF; transition:all 0.2s;">
          📘 1. CBSE Grammar Topics (16 अंक)
        </button>
        <button id="btn-cbse-main-writing" onclick="switchCbseMainCategory('writing')" style="padding:0.7rem 1.5rem; border-radius:10px; font-weight:700; font-size:0.98rem; cursor:pointer; border:2px solid #CBD5E1; background:#FFFFFF; color:#334155; transition:all 0.2s;">
          ✍️ 2. Writing Skills (15 अंक)
        </button>
      </div>

      <!-- =================================================-------------------- -->
      <!-- CATEGORY 1: CBSE GRAMMAR TOPICS -->
      <!-- =================================================-------------------- -->
      <div id="cbse-panel-grammar" style="display:block;">
        
        <!-- Topic Selection Pills (Level 1) -->
        <div style="display:flex; gap:0.6rem; overflow-x:auto; padding-bottom:0.5rem; margin-bottom:1.5rem;">
          <button class="subpill-btn active" id="btn-cbse-topic-muhavre" onclick="switchCbseTopic('muhavre')" style="padding:0.6rem 1.25rem; border-radius:9999px; font-weight:700; font-size:0.92rem; border:1.5px solid #2563EB; background:#2563EB; color:#ffffff; cursor:pointer; white-space:nowrap;">
            📖 मुहावरे (Muhavare)
          </button>
          <button class="subpill-btn" id="btn-cbse-topic-padbandh" onclick="switchCbseTopic('padbandh')" style="padding:0.6rem 1.25rem; border-radius:9999px; font-weight:700; font-size:0.92rem; border:1.5px solid #CBD5E1; background:#FFFFFF; color:#334155; cursor:pointer; white-space:nowrap;">
            📑 पदबंध (Padbandh)
          </button>
          <button class="subpill-btn" id="btn-cbse-topic-samas" onclick="switchCbseTopic('samas')" style="padding:0.6rem 1.25rem; border-radius:9999px; font-weight:700; font-size:0.92rem; border:1.5px solid #CBD5E1; background:#FFFFFF; color:#334155; cursor:pointer; white-space:nowrap;">
            🔗 समास (Samas)
          </button>
          <button class="subpill-btn" id="btn-cbse-topic-vakya" onclick="switchCbseTopic('vakya')" style="padding:0.6rem 1.25rem; border-radius:9999px; font-weight:700; font-size:0.92rem; border:1.5px solid #CBD5E1; background:#FFFFFF; color:#334155; cursor:pointer; white-space:nowrap;">
            🔄 रचना के आधार पर वाक्य
          </button>
        </div>

        <!-- TOPIC 1: MUHAVARE (Child Heading Boxes) -->
        <div id="cbse-topicpanel-muhavre" class="cbse-topicpanel" style="display:block;">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem; margin-bottom:1.5rem;">
            <button id="btn-cbse-m-sub1" onclick="switchCbseMuhavreSub('sub1')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #2563EB; background:#2563EB; color:#ffffff; cursor:pointer; text-align:center;">
              📖 CHAPTER WISE MUHAVARE
            </button>
            <button id="btn-cbse-m-sub2" onclick="switchCbseMuhavreSub('sub2')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #E2E8F0; background:#F8FAFC; color:#334155; cursor:pointer; text-align:center;">
              📝 MUHAVARE WORKSHEETS
            </button>
            <button id="btn-cbse-m-sub3" onclick="switchCbseMuhavreSub('sub3')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #E2E8F0; background:#F8FAFC; color:#334155; cursor:pointer; text-align:center;">
              📚 ADDITIONAL MATERIAL
            </button>
          </div>

          <div id="cbse-m-subpanel-1" style="display:block;">
            <div style="background:#FFFFFF; border:1px solid #E2E8F0; padding:1.5rem; border-radius:12px;">
              <h3 style="color:#1E3A5F; font-size:1.2rem; margin-top:0;">CHAPTER WISE MUHAVARE (पाठ-वार मुहावरे)</h3>
              <p style="color:#475569; font-size:0.92rem;">बड़े भाई साहब, तताँरा-वामीरो, अब कहाँ दूसरे के दुख से दुखी होने वाले आदि सभी पाठों के मुहावरे अर्थ व वाक्य प्रयोग सहित:</p>
              {g_data.get('cbse_muhavre_1', {}).get('html', '')}
            </div>
          </div>

          <div id="cbse-m-subpanel-2" style="display:none;">
            <div style="background:#FFFFFF; border:1px solid #E2E8F0; padding:1.5rem; border-radius:12px;">
              <h3 style="color:#1E3A5F; font-size:1.2rem; margin-top:0;">MUHAVARE WORKSHEETS (अभ्यास कार्य-पत्रक)</h3>
              {g_data.get('cbse_muhavre_2', {}).get('html', '')}
            </div>
          </div>

          <div id="cbse-m-subpanel-3" style="display:none;">
            <div style="background:#FFFFFF; border:1px solid #E2E8F0; padding:1.5rem; border-radius:12px;">
              <h3 style="color:#1E3A5F; font-size:1.2rem; margin-top:0;">ADDITIONAL MATERIAL (अतिरिक्त अभ्यास प्रश्न व लोकोक्तियाँ)</h3>
              <p style="color:#475569; font-size:0.92rem;">विगत वर्षों की बोर्ड परीक्षाओं पर आधारित महत्वपूर्ण मुहावरे व अभ्यास सेट।</p>
            </div>
          </div>
        </div>

        <!-- TOPIC 2: PADBANDH (Child Heading Boxes) -->
        <div id="cbse-topicpanel-padbandh" class="cbse-topicpanel" style="display:none;">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem; margin-bottom:1.5rem;">
            <button id="btn-cbse-p-sub1" onclick="switchCbsePadbandhSub('sub1')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #2563EB; background:#2563EB; color:#ffffff; cursor:pointer; text-align:center;">
              📑 PADBANDH (नियम व भेद)
            </button>
            <button id="btn-cbse-p-sub2" onclick="switchCbsePadbandhSub('sub2')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #E2E8F0; background:#F8FAFC; color:#334155; cursor:pointer; text-align:center;">
              📝 PADBANDH WORKSHEETS
            </button>
          </div>

          <div id="cbse-p-subpanel-1" style="display:block;">
            {g_data.get('cbse_padbandh_1', {}).get('html', '')}
          </div>
          <div id="cbse-p-subpanel-2" style="display:none;">
            {g_data.get('cbse_padbandh_2', {}).get('html', '')}
          </div>
        </div>

        <!-- TOPIC 3: SAMAS (Child Heading Boxes) -->
        <div id="cbse-topicpanel-samas" class="cbse-topicpanel" style="display:none;">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem; margin-bottom:1.5rem;">
            <button id="btn-cbse-s-sub1" onclick="switchCbseSamasSub('sub1')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #2563EB; background:#2563EB; color:#ffffff; cursor:pointer; text-align:center;">
              🔗 SAMAS (6 भेद व विग्रह नियम)
            </button>
            <button id="btn-cbse-s-sub2" onclick="switchCbseSamasSub('sub2')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #E2E8F0; background:#F8FAFC; color:#334155; cursor:pointer; text-align:center;">
              📝 SAMAS WORKSHEETS
            </button>
          </div>

          <div id="cbse-s-subpanel-1" style="display:block;">
            {g_data.get('cbse_samas_rules', {}).get('html', '')}
          </div>
          <div id="cbse-s-subpanel-2" style="display:none;">
            {g_data.get('cbse_samas_worksheets', {}).get('html', '')}
          </div>
        </div>

        <!-- TOPIC 4: RACHNA KE ADHAAR PAR VAKYA (Child Heading Boxes) -->
        <div id="cbse-topicpanel-vakya" class="cbse-topicpanel" style="display:none;">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem; margin-bottom:1.5rem;">
            <button id="btn-cbse-v-sub1" onclick="switchCbseVakyaSub('sub1')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #2563EB; background:#2563EB; color:#ffffff; cursor:pointer; text-align:center;">
              🔄 RACHNA KE ADHAAR PAR VAKYA
            </button>
            <button id="btn-cbse-v-sub2" onclick="switchCbseVakyaSub('sub2')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #E2E8F0; background:#F8FAFC; color:#334155; cursor:pointer; text-align:center;">
              📝 VAKYA WORKSHEETS
            </button>
          </div>

          <div id="cbse-v-subpanel-1" style="display:block;">
            {g_data.get('cbse_vakya_rules', {}).get('html', '')}
          </div>
          <div id="cbse-v-subpanel-2" style="display:none;">
            {g_data.get('cbse_vakya_worksheets', {}).get('html', '')}
          </div>
        </div>

      </div>

      <!-- =================================================-------------------- -->
      <!-- CATEGORY 2: WRITING SKILLS -->
      <!-- =================================================-------------------- -->
      <div id="cbse-panel-writing" style="display:none;">
        
        <!-- Writing Sub-topic Child Heading Boxes -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem; margin-bottom:1.5rem;">
          <button id="btn-writing-sub1" onclick="switchWritingSub('sub1')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #16A34A; background:#16A34A; color:#ffffff; cursor:pointer; text-align:center;">
            📝 PARAGRAPH WRITING (अनुच्छेद लेखन - 5M)
          </button>
          <button id="btn-writing-sub2" onclick="switchWritingSub('sub2')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #E2E8F0; background:#F8FAFC; color:#334155; cursor:pointer; text-align:center;">
            ✉️ LETTER WRITING (पत्र लेखन - 5M)
          </button>
          <button id="btn-writing-sub3" onclick="switchWritingSub('sub3')" style="padding:0.75rem 1rem; border-radius:10px; font-weight:700; font-size:0.88rem; border:2px solid #E2E8F0; background:#F8FAFC; color:#334155; cursor:pointer; text-align:center;">
            📧 EMAIL WRITING (ईमेल लेखन - 5M)
          </button>
        </div>

        <div id="writing-subpanel-1" style="display:block;">
          {g_data.get('cbse_writing_paragraph', {}).get('html', '')}
        </div>
        <div id="writing-subpanel-2" style="display:none;">
          {g_data.get('cbse_writing_letter', {}).get('html', '')}
        </div>
        <div id="writing-subpanel-3" style="display:none;">
          {g_data.get('cbse_writing_email', {}).get('html', '')}
        </div>

      </div>

    </div>

  </div>
</main>"""

    full_page_cbse = get_common_head(seo_title_cbse, desc_cbse, canonical_cbse, json.dumps(schema_cbse, indent=2))
    full_page_cbse += get_navbar(active_link='grammar')
    full_page_cbse += breadcrumbs_cbse
    full_page_cbse += hero_cbse
    full_page_cbse += body_cbse
    full_page_cbse += get_footer(extra_html=upload_modal_html, extra_scripts=extra_scripts)
    write_html_file(rel_dir_cbse, full_page_cbse)


    # --------------------------------------------------------------------------
    # 3. DEDICATED ICSE PAGE: /hindi-grammar/icse/
    # --------------------------------------------------------------------------
    rel_dir_icse = "hindi-grammar/icse"
    canonical_icse = f"{BASE_URL}/{rel_dir_icse}/"
    ALL_CANONICAL_URLS.append(canonical_icse)

    seo_title_icse = "ICSE Class 10 Hindi Grammar & Composition | Syllabus, Marking Scheme & Idioms | EkShala"
    desc_icse = "ICSE Class 10 Hindi Grammar & Composition. Includes official marking scheme (Composition 15M, Letter 7M, Comprehension 10M, Grammar 8M) and chapter-wise idioms."

    schema_icse = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "होम", "item": f"{BASE_URL}/" },
                    { "@type": "ListItem", "position": 2, "name": "Hindi Grammar Hub", "item": canonical_hub },
                    { "@type": "ListItem", "position": 3, "name": "ICSE Grammar", "item": canonical_icse }
                ]
            }
        ]
    }

    breadcrumbs_icse = f"""<div class="seo-breadcrumb-bar">
  <div class="container">
    <ol class="seo-breadcrumbs" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="/" itemprop="item"><span itemprop="name">होम</span></a>
        <meta itemprop="position" content="1" />
      </li>
      <li class="sep">&rsaquo;</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="/hindi-grammar/" itemprop="item"><span itemprop="name">Hindi Grammar Hub</span></a>
        <meta itemprop="position" content="2" />
      </li>
      <li class="sep">&rsaquo;</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span class="current" itemprop="name">ICSE Hindi Grammar &amp; Composition</span>
        <meta itemprop="position" content="3" />
      </li>
    </ol>
  </div>
</div>"""

    hero_icse = f"""<header class="seo-hero">
  <div class="container">
    <span class="seo-hero-badge">ICSE CLASS 10 &bull; GRAMMAR &amp; COMPOSITION</span>
    <h1>ICSE Class 10 Hindi Grammar &amp; Composition</h1>
    <p class="lead">आधिकारिक आईसीएसई हिंदी निबंध लेखन, पत्र लेखन, अपठित गद्यांश, व्याकरण अंक विभाजन एवं साहित्य सागर, एकांकी संचय व नया रास्ता के पाठ-वार मुहावरे:</p>
  </div>
</header>"""

    # Build ICSE Chapter Muhavare Cards
    icse_ch_cards = []
    for ch in ICSE_CHAPTERS:
        url = f"/icse/class-10/hindi/{ch['slug']}/#muhavre"
        icse_ch_cards.append(f"""<div class="seo-card" style="background:#FFFFFF; border-radius:12px; border:1px solid #E2E8F0; padding:1.15rem; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-size:0.75rem; font-weight:700; color:#059669; text-transform:uppercase; margin-bottom:0.25rem;">{ch['book']} &bull; Ch.{ch['num']}</div>
            <h3 style="font-size:1.1rem; font-weight:700; color:#0F172A; margin:0 0 0.35rem;">{ch['title']} (मुहावरे)</h3>
            <p style="font-size:0.85rem; color:#64748B; margin:0 0 0.85rem;">लेखक: {ch['author']}</p>
          </div>
          <a href="{url}" class="btn btn-outline" style="padding:0.45rem 0.85rem; font-size:0.84rem; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:0.4rem; color:#059669; border-color:#A7F3D0; font-weight:600;">📖 पाठ के मुहावरे देखें &rarr;</a>
        </div>""")

    body_icse = f"""<main class="seo-content-wrap">
  <div class="container">
    
    <!-- ICSE Syllabus & Marking Scheme Card (Matching exact user screenshot) -->
    <section class="seo-section-card" style="margin-bottom:2.5rem; background:#F8FAFC; border:1px solid #CBD5E1; border-top:4px solid #059669;">
      <div class="seo-section-header">
        <span class="seo-section-icon" style="background:#ECFDF5; color:#059669;">📗</span>
        <div>
          <h2 style="margin:0; font-size:1.4rem; color:#0F172A;">ICSE Class 10 Hindi Syllabus &amp; Marking Scheme</h2>
          <p style="margin:0.2rem 0 0; font-size:0.88rem; color:#64748B;">आधिकारिक आईसीएसई हिंदी व्याकरण, निबंध व पत्र अंक विभाजन:</p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem; margin-top:1.25rem;">
        <div style="background:#FFFFFF; padding:1.15rem; border-radius:10px; border:1px solid #E2E8F0;">
          <h4 style="margin:0 0 0.4rem; color:#059669; font-size:1rem;">&bull; Composition (15 Marks)</h4>
          <p style="margin:0; font-size:0.86rem; color:#475569; line-height:1.6;">Candidates will be required to write one composition (approx 250 words) from a choice of varied subjects, short explanations, directions, descriptions, narratives, or picture stimuli.</p>
        </div>
        <div style="background:#FFFFFF; padding:1.15rem; border-radius:10px; border:1px solid #E2E8F0;">
          <h4 style="margin:0 0 0.4rem; color:#059669; font-size:1rem;">&bull; Letter Writing (7 Marks)</h4>
          <p style="margin:0; font-size:0.86rem; color:#475569; line-height:1.6;">One letter from a choice of two subjects (Formal or Informal letter, approx 120 words). Layout with address, introduction, body, and conclusion form part of assessment.</p>
        </div>
        <div style="background:#FFFFFF; padding:1.15rem; border-radius:10px; border:1px solid #E2E8F0;">
          <h4 style="margin:0 0 0.4rem; color:#059669; font-size:1rem;">&bull; Comprehension (10 Marks)</h4>
          <p style="margin:0; font-size:0.86rem; color:#475569; line-height:1.6;">An unseen passage of about 250 words in Hindi with 5 questions (2 marks each) testing understanding in the candidate's own words.</p>
        </div>
        <div style="background:#FFFFFF; padding:1.15rem; border-radius:10px; border:1px solid #E2E8F0;">
          <h4 style="margin:0 0 0.4rem; color:#059669; font-size:1rem;">&bull; Grammar (8 Marks)</h4>
          <p style="margin:0; font-size:0.86rem; color:#475569; line-height:1.6;">Tests in language vocabulary, syntax, idioms, sentence synthesis, abstract nouns, antonyms/synonyms, correct word forms (8 MCQs).</p>
        </div>
      </div>

      <div style="margin-top:1.25rem; background:#ECFDF5; border:1px solid #A7F3D0; padding:0.85rem 1.15rem; border-radius:8px; font-size:0.88rem; color:#065F46;">
        <strong>Recommended Grammar Book:</strong> <em>Saras Hindi Vyakaran (Evergreen Publications, New Delhi)</em>
      </div>
    </section>

    <!-- ICSE Chapter-wise Idioms Grid -->
    <section class="seo-section-card">
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

  </div>
</main>"""

    full_page_icse = get_common_head(seo_title_icse, desc_icse, canonical_icse, json.dumps(schema_icse, indent=2))
    full_page_icse += get_navbar(active_link='grammar')
    full_page_icse += breadcrumbs_icse
    full_page_icse += hero_icse
    full_page_icse += body_icse
    full_page_icse += get_footer(extra_html=upload_modal_html, extra_scripts=extra_scripts)
    write_html_file(rel_dir_icse, full_page_icse)
'''

# Find def generate_grammar_pages(): and replace it completely in content
pattern = re.compile(r'def generate_grammar_pages\(\):.*?(?=\n# ==============================================================================\n# \d+\.|\Z)', re.DOTALL)
if pattern.search(content):
    content = pattern.sub(new_generate_grammar_pages_code, content)
    print("✓ Replaced generate_grammar_pages in generate_seo_pages.py!")
else:
    print("⚠️ Pattern match failed for generate_grammar_pages!")

with open(GEN_FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print("🎉 File update complete!")
