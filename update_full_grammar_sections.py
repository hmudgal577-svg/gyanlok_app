import sys, re

sys.stdout.reconfigure(encoding='utf-8')

with open('generate_seo_pages.py', 'r', encoding='utf-8') as f:
    code = f.read()

new_grammar_function = '''def generate_grammar_pages():
    print("\\n--- Generating Hindi Grammar Hub & Topic Pages (Restructured CBSE & ICSE) ---")

    rel_dir = "hindi-grammar"
    canonical_url = f"{BASE_URL}/{rel_dir}/"
    ALL_CANONICAL_URLS.append(canonical_url)

    seo_title = "Class 10 Hindi Grammar & Writing Skills | CBSE & ICSE Notes, Rules & Worksheets | EkShala"
    desc = "Class 10 Hindi Grammar & Writing Skills hub for CBSE & ICSE. Includes Muhavare, Padbandh, Samas, Vakya Bhed, Paragraph Writing, Letter Writing, Email Writing, and ICSE Marking Scheme."

    schema_dict = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "होम", "item": f"{BASE_URL}/" },
                    { "@type": "ListItem", "position": 2, "name": "Hindi Grammar", "item": canonical_url }
                ]
            },
            {
                "@type": "Course",
                "name": "Class 10 Hindi Grammar & Writing Skills Master Class",
                "description": desc,
                "provider": { "@type": "Organization", "name": "EkShala", "url": BASE_URL }
            }
        ]
    }

    breadcrumbs_html = f"""<div class="seo-breadcrumb-bar">
  <div class="container">
    <ol class="seo-breadcrumbs" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="/" itemprop="item"><span itemprop="name">होम</span></a>
        <meta itemprop="position" content="1" />
      </li>
      <li class="sep">&rsaquo;</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span class="current" itemprop="name">Hindi Grammar &amp; Writing Skills (व्याकरण व लेखन)</span>
        <meta itemprop="position" content="2" />
      </li>
    </ol>
  </div>
</div>"""

    hero_html = f"""<header class="seo-hero">
  <div class="container">
    <span class="seo-hero-badge">CBSE &bull; ICSE &bull; संपूर्ण व्याकरण व लेखन कौशल</span>
    <h1>Class 10 Hindi Grammar &amp; Writing Skills</h1>
    <p class="lead">कक्षा 10 हिंदी (सीबीएसई एवं आईसीएसई) के सभी व्याकरण अध्याय एवं लेखन कौशल। अब स्पष्ट 2 मुख्य सेक्शन्स में उपलब्ध: व्याकरण खंड (मुहावरे, पदबंध, समास, वाक्य रूपांतरण) एवं लेखन कौशल (अनुच्छेद, पत्र, ईमेल)।</p>
    <div class="seo-hero-meta">
      <span>📘 <strong>CBSE Grammar (4 Topics)</strong></span>
      <span>✍️ <strong>Writing Skills (3 Topics)</strong></span>
      <span>📗 <strong>ICSE Syllabus &amp; Marking Scheme</strong></span>
    </div>
  </div>
</header>"""

    # Load converted grammar JSON data
    with open(os.path.join(PUBLIC_DIR, '..', 'grammar_converted_data.json'), 'r', encoding='utf-8') as f:
        g_data = json.load(f)

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
          <a href="{url}" class="btn btn-outline" style="padding:0.45rem 0.85rem; font-size:0.84rem; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:0.4rem; color:#059669; border-color:#A7F3D0; font-weight:600;">📖 पाठ के मुहावरे देखें →</a>
        </div>""")

    body_html = f"""<main class="seo-content-wrap">
  <div class="container">
    
    <!-- Top Board Switcher Bar -->
    <div class="grammar-board-nav" style="display:flex; gap:0.75rem; justify-content:center; margin-bottom:2.5rem; position:sticky; top:70px; z-index:30; background:#FFFFFF; padding:0.85rem 1.25rem; border-radius:100px; box-shadow:0 4px 16px rgba(15,43,72,0.06); border:1px solid #E2E8F0; width:fit-content; margin-left:auto; margin-right:auto;">
      <button class="board-tab-btn active" id="btn-tab-cbse" onclick="switchGrammarBoard('cbse')" style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.6rem 1.5rem; border-radius:100px; font-weight:700; font-size:0.95rem; cursor:pointer; border:1.5px solid #2563EB; background:#2563EB; color:#ffffff; transition:all 0.2s;">
        <span>📘 CBSE Hindi Grammar &amp; Writing Skills</span>
      </button>
      <button class="board-tab-btn" id="btn-tab-icse" onclick="switchGrammarBoard('icse')" style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.6rem 1.5rem; border-radius:100px; font-weight:700; font-size:0.95rem; cursor:pointer; border:1.5px solid #059669; background:#FFFFFF; color:#059669; transition:all 0.2s;">
        <span>📗 ICSE Hindi Grammar &amp; Composition</span>
      </button>
    </div>

    <!-- ========================================================================= -->
    <!-- PANEL 1: CBSE BOARD HINDI GRAMMAR & WRITING SKILLS -->
    <!-- ========================================================================= -->
    <div id="board-panel-cbse" class="grammar-board-panel" style="display:block;">

      <!-- BOX 1: CBSE GRAMMAR (व्याकरण खंड) -->
      <section class="seo-section-card" id="cbse-grammar-box" style="margin-bottom:2.5rem; border-top:4px solid #2563EB;">
        <div class="seo-section-header">
          <span class="seo-section-icon" style="background:#EFF6FF; color:#2563EB;">📘</span>
          <div>
            <h2 style="margin:0; font-size:1.4rem; color:#0F172A;">BOX 1: CBSE Hindi Grammar (व्याकरण खंड)</h2>
            <p style="margin:0.25rem 0 0; font-size:0.9rem; color:#64748B;">मुहावरे, पदबंध, समास एवं रचना के आधार पर वाक्य रूपांतरण के नियम व अभ्यास:</p>
          </div>
        </div>

        <!-- CBSE Grammar Topic Pills (Level 1) -->
        <div class="grammar-subpills" style="display:flex; gap:0.55rem; overflow-x:auto; padding-bottom:0.5rem; margin-bottom:1.5rem; border-bottom:1px solid #E2E8F0;">
          <button class="subpill-btn active" id="btn-cbse-topic-muhavre" onclick="switchCbseTopic('muhavre')" style="padding:0.55rem 1.15rem; border-radius:9999px; font-weight:600; font-size:0.9rem; border:1px solid #2563EB; background:#2563EB; color:#ffffff; cursor:pointer; white-space:nowrap;">
            📖 मुहावरे (Muhavare)
          </button>
          <button class="subpill-btn" id="btn-cbse-topic-padbandh" onclick="switchCbseTopic('padbandh')" style="padding:0.55rem 1.15rem; border-radius:9999px; font-weight:600; font-size:0.9rem; border:1px solid #CBD5E1; background:#FFFFFF; color:#334155; cursor:pointer; white-space:nowrap;">
            📑 पदबंध (Padbandh)
          </button>
          <button class="subpill-btn" id="btn-cbse-topic-samas" onclick="switchCbseTopic('samas')" style="padding:0.55rem 1.15rem; border-radius:9999px; font-weight:600; font-size:0.9rem; border:1px solid #CBD5E1; background:#FFFFFF; color:#334155; cursor:pointer; white-space:nowrap;">
            🔗 समास (Samas)
          </button>
          <button class="subpill-btn" id="btn-cbse-topic-vakya" onclick="switchCbseTopic('vakya')" style="padding:0.55rem 1.15rem; border-radius:9999px; font-weight:600; font-size:0.9rem; border:1px solid #CBD5E1; background:#FFFFFF; color:#334155; cursor:pointer; white-space:nowrap;">
            🔄 रचना के आधार पर वाक्य
          </button>
        </div>

        <!-- TOPIC 1: MUHAVARE (3 Sub-tabs) -->
        <div id="cbse-topicpanel-muhavre" class="cbse-topicpanel" style="display:block;">
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.25rem;">
            <button id="btn-cbse-m-sub1" onclick="switchCbseMuhavreSub('sub1')" style="padding:0.45rem 1rem; border-radius:8px; font-weight:600; font-size:0.85rem; border:1px solid #2563EB; background:#2563EB; color:#ffffff; cursor:pointer;">
              📖 CHAPTER WISE MUHAVARE
            </button>
            <button id="btn-cbse-m-sub2" onclick="switchCbseMuhavreSub('sub2')" style="padding:0.45rem 1rem; border-radius:8px; font-weight:600; font-size:0.85rem; border:1px solid #CBD5E1; background:#FFFFFF; color:#334155; cursor:pointer;">
              📝 MUHAVARE WORKSHEETS
            </button>
            <button id="btn-cbse-m-sub3" onclick="switchCbseMuhavreSub('sub3')" style="padding:0.45rem 1rem; border-radius:8px; font-weight:600; font-size:0.85rem; border:1px solid #CBD5E1; background:#FFFFFF; color:#334155; cursor:pointer;">
              📚 ADDITIONAL MATERIAL
            </button>
          </div>

          <div id="cbse-m-subpanel-1" style="display:block;">
            <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:1.25rem; border-radius:12px; margin-bottom:1rem;">
              <h3 style="color:#1E3A5F; font-size:1.15rem; margin-top:0;">CHAPTER WISE MUHAVARE (स्पर्श व संचयन पाठ-वार मुहावरे)</h3>
              <p style="color:#475569; font-size:0.9rem;">कक्षा 10 हिंदी (कोर्स बी) के सभी पाठों (बड़े भाई साहब, तताँरा-वामीरो, अब कहाँ दूसरे के दुख से दुखी होने वाले आदि) के महत्वपूर्ण मुहावरे, अर्थ एवं वाक्य प्रयोग:</p>
              {g_data.get('cbse_muhavre_1', {}).get('html', '')}
            </div>
          </div>

          <div id="cbse-m-subpanel-2" style="display:none;">
            <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:1.25rem; border-radius:12px;">
              <h3 style="color:#1E3A5F; font-size:1.15rem; margin-top:0;">MUHAVARE WORKSHEETS (मुहावरे अभ्यास कार्य-पत्रक)</h3>
              {g_data.get('cbse_muhavre_2', {}).get('html', '')}
            </div>
          </div>

          <div id="cbse-m-subpanel-3" style="display:none;">
            <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:1.25rem; border-radius:12px;">
              <h3 style="color:#1E3A5F; font-size:1.15rem; margin-top:0;">ADDITIONAL MATERIAL (अतिरिक्त अभ्यास प्रश्न व लोकोक्तियाँ)</h3>
              <p style="color:#475569; font-size:0.9rem;">विगत वर्षों के बोर्ड परीक्षा प्रश्नों पर आधारित मुहावरे एवं लोकोक्तियाँ उत्तर सहित।</p>
            </div>
          </div>
        </div>

        <!-- TOPIC 2: PADBANDH (2 Sub-tabs) -->
        <div id="cbse-topicpanel-padbandh" class="cbse-topicpanel" style="display:none;">
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.25rem;">
            <button id="btn-cbse-p-sub1" onclick="switchCbsePadbandhSub('sub1')" style="padding:0.45rem 1rem; border-radius:8px; font-weight:600; font-size:0.85rem; border:1px solid #2563EB; background:#2563EB; color:#ffffff; cursor:pointer;">
              📑 PADBANDH (पदबंध नियम व भेद)
            </button>
            <button id="btn-cbse-p-sub2" onclick="switchCbsePadbandhSub('sub2')" style="padding:0.45rem 1rem; border-radius:8px; font-weight:600; font-size:0.85rem; border:1px solid #CBD5E1; background:#FFFFFF; color:#334155; cursor:pointer;">
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

        <!-- TOPIC 3: SAMAS (2 Sub-tabs) -->
        <div id="cbse-topicpanel-samas" class="cbse-topicpanel" style="display:none;">
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.25rem;">
            <button id="btn-cbse-s-sub1" onclick="switchCbseSamasSub('sub1')" style="padding:0.45rem 1rem; border-radius:8px; font-weight:600; font-size:0.85rem; border:1px solid #2563EB; background:#2563EB; color:#ffffff; cursor:pointer;">
              🔗 SAMAS (समास के 6 भेद व नियम)
            </button>
            <button id="btn-cbse-s-sub2" onclick="switchCbseSamasSub('sub2')" style="padding:0.45rem 1rem; border-radius:8px; font-weight:600; font-size:0.85rem; border:1px solid #CBD5E1; background:#FFFFFF; color:#334155; cursor:pointer;">
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

        <!-- TOPIC 4: RACHNA KE ADHAAR PAR VAKYA (2 Sub-tabs) -->
        <div id="cbse-topicpanel-vakya" class="cbse-topicpanel" style="display:none;">
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.25rem;">
            <button id="btn-cbse-v-sub1" onclick="switchCbseVakyaSub('sub1')" style="padding:0.45rem 1rem; border-radius:8px; font-weight:600; font-size:0.85rem; border:1px solid #2563EB; background:#2563EB; color:#ffffff; cursor:pointer;">
              🔄 RACHNA KE ADHAAR PAR VAKYA
            </button>
            <button id="btn-cbse-v-sub2" onclick="switchCbseVakyaSub('sub2')" style="padding:0.45rem 1rem; border-radius:8px; font-weight:600; font-size:0.85rem; border:1px solid #CBD5E1; background:#FFFFFF; color:#334155; cursor:pointer;">
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

      </section>

      <!-- BOX 2: WRITING SKILLS (लेखन कौशल) -->
      <section class="seo-section-card" id="cbse-writing-box" style="margin-bottom:2.5rem; border-top:4px solid #16A34A;">
        <div class="seo-section-header">
          <span class="seo-section-icon" style="background:#F0FDF4; color:#16A34A;">✍️</span>
          <div>
            <h2 style="margin:0; font-size:1.4rem; color:#0F172A;">BOX 2: CBSE Writing Skills (लेखन कौशल — 15 अंक)</h2>
            <p style="margin:0.25rem 0 0; font-size:0.9rem; color:#64748B;">अनुच्छेद लेखन, पत्र लेखन एवं ईमेल लेखन के आधिकारिक बोर्ड प्रारूप व हल सहित उदाहरण:</p>
          </div>
        </div>

        <!-- Writing Skills Sub-pills -->
        <div style="display:flex; gap:0.55rem; overflow-x:auto; padding-bottom:0.5rem; margin-bottom:1.5rem; border-bottom:1px solid #E2E8F0;">
          <button class="subpill-btn active" id="btn-writing-sub1" onclick="switchWritingSub('sub1')" style="padding:0.55rem 1.15rem; border-radius:9999px; font-weight:600; font-size:0.9rem; border:1px solid #16A34A; background:#16A34A; color:#ffffff; cursor:pointer; white-space:nowrap;">
            📝 PARAGRAPH WRITING (अनुच्छेद लेखन)
          </button>
          <button class="subpill-btn" id="btn-writing-sub2" onclick="switchWritingSub('sub2')" style="padding:0.55rem 1.15rem; border-radius:9999px; font-weight:600; font-size:0.9rem; border:1px solid #CBD5E1; background:#FFFFFF; color:#334155; cursor:pointer; white-space:nowrap;">
            ✉️ LETTER WRITING (पत्र लेखन)
          </button>
          <button class="subpill-btn" id="btn-writing-sub3" onclick="switchWritingSub('sub3')" style="padding:0.55rem 1.15rem; border-radius:9999px; font-weight:600; font-size:0.9rem; border:1px solid #CBD5E1; background:#FFFFFF; color:#334155; cursor:pointer; white-space:nowrap;">
            📧 EMAIL WRITING (ईमेल लेखन)
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
      </section>

    </div>

    <!-- ========================================================================= -->
    <!-- PANEL 2: ICSE BOARD HINDI GRAMMAR & COMPOSITION -->
    <!-- ========================================================================= -->
    <div id="board-panel-icse" class="grammar-board-panel" style="display:none;">
      
      <!-- ICSE Syllabus & Marking Scheme Card (Matching exact user screenshot) -->
      <section class="seo-section-card" style="margin-bottom:2rem; background:#F8FAFC; border:1px solid #CBD5E1; border-top:4px solid #059669;">
        <div class="seo-section-header">
          <span class="seo-section-icon" style="background:#ECFDF5; color:#059669;">📗</span>
          <div>
            <h2 style="margin:0; font-size:1.35rem; color:#0F172A;">ICSE Class 10 Hindi Syllabus &amp; Marking Scheme</h2>
            <p style="margin:0.2rem 0 0; font-size:0.88rem; color:#64748B;">आधिकारिक आईसीएसई हिंदी व्याकरण, निबंध व पत्र अंक विभाजन:</p>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem; margin-top:1.25rem;">
          <div style="background:#FFFFFF; padding:1.15rem; border-radius:10px; border:1px solid #E2E8F0;">
            <h4 style="margin:0 0 0.4rem; color:#059669; font-size:1rem;">• Composition (15 Marks)</h4>
            <p style="margin:0; font-size:0.86rem; color:#475569; line-height:1.6;">Candidates will be required to write one composition (approx 250 words) from a choice of varied subjects, short explanations, directions, descriptions, narratives, or picture stimuli.</p>
          </div>
          <div style="background:#FFFFFF; padding:1.15rem; border-radius:10px; border:1px solid #E2E8F0;">
            <h4 style="margin:0 0 0.4rem; color:#059669; font-size:1rem;">• Letter Writing (7 Marks)</h4>
            <p style="margin:0; font-size:0.86rem; color:#475569; line-height:1.6;">One letter from a choice of two subjects (Formal or Informal letter, approx 120 words). Layout with address, introduction, body, and conclusion form part of assessment.</p>
          </div>
          <div style="background:#FFFFFF; padding:1.15rem; border-radius:10px; border:1px solid #E2E8F0;">
            <h4 style="margin:0 0 0.4rem; color:#059669; font-size:1rem;">• Comprehension (10 Marks)</h4>
            <p style="margin:0; font-size:0.86rem; color:#475569; line-height:1.6;">An unseen passage of about 250 words in Hindi with 5 questions (2 marks each) testing understanding in the candidate's own words.</p>
          </div>
          <div style="background:#FFFFFF; padding:1.15rem; border-radius:10px; border:1px solid #E2E8F0;">
            <h4 style="margin:0 0 0.4rem; color:#059669; font-size:1rem;">• Grammar (8 Marks)</h4>
            <p style="margin:0; font-size:0.86rem; color:#475569; line-height:1.6;">Tests in language vocabulary, syntax, idioms, sentence synthesis, abstract nouns, antonyms/synonyms, correct word forms (8 MCQs).</p>
          </div>
        </div>

        <div style="margin-top:1.25rem; background:#ECFDF5; border:1px solid #A7F3D0; padding:0.85rem 1.15rem; border-radius:8px; font-size:0.88rem; color:#065F46;">
          <strong>Recommended Grammar Book:</strong> <em>Saras Hindi Vyakaran (Evergreen Publications, New Delhi)</em>
        </div>
      </section>

      <!-- ICSE Topic 1: Chapter-wise Muhavare Grid -->
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

  </div>
</main>

<script>
  function switchGrammarBoard(board) {{
    const cbseBtn = document.getElementById('btn-tab-cbse');
    const icseBtn = document.getElementById('btn-tab-icse');
    const cbsePanel = document.getElementById('board-panel-cbse');
    const icsePanel = document.getElementById('board-panel-icse');

    if (board === 'cbse') {{
      cbseBtn.style.background = '#2563EB';
      cbseBtn.style.color = '#ffffff';
      cbseBtn.style.borderColor = '#2563EB';
      icseBtn.style.background = '#FFFFFF';
      icseBtn.style.color = '#059669';
      icseBtn.style.borderColor = '#059669';
      cbsePanel.style.display = 'block';
      icsePanel.style.display = 'none';
    }} else {{
      icseBtn.style.background = '#059669';
      icseBtn.style.color = '#ffffff';
      icseBtn.style.borderColor = '#059669';
      cbseBtn.style.background = '#FFFFFF';
      cbseBtn.style.color = '#2563EB';
      cbseBtn.style.borderColor = '#2563EB';
      icsePanel.style.display = 'block';
      cbsePanel.style.display = 'none';
    }}
  }}

  function switchCbseTopic(topicKey) {{
    ['muhavre', 'padbandh', 'samas', 'vakya'].forEach(t => {{
      const btn = document.getElementById('btn-cbse-topic-' + t);
      const panel = document.getElementById('cbse-topicpanel-' + t);
      if (t === topicKey) {{
        btn.style.background = '#2563EB';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#2563EB';
        panel.style.display = 'block';
      }} else {{
        btn.style.background = '#FFFFFF';
        btn.style.color = '#334155';
        btn.style.borderColor = '#CBD5E1';
        panel.style.display = 'none';
      }}
    }});
  }}

  function switchCbseMuhavreSub(subKey) {{
    ['sub1', 'sub2', 'sub3'].forEach((k, idx) => {{
      const btn = document.getElementById('btn-cbse-m-' + k);
      const panel = document.getElementById('cbse-m-subpanel-' + (idx+1));
      if (k === subKey) {{
        btn.style.background = '#2563EB';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#2563EB';
        panel.style.display = 'block';
      }} else {{
        btn.style.background = '#FFFFFF';
        btn.style.color = '#334155';
        btn.style.borderColor = '#CBD5E1';
        panel.style.display = 'none';
      }}
    }});
  }}

  function switchCbsePadbandhSub(subKey) {{
    ['sub1', 'sub2'].forEach((k, idx) => {{
      const btn = document.getElementById('btn-cbse-p-' + k);
      const panel = document.getElementById('cbse-p-subpanel-' + (idx+1));
      if (k === subKey) {{
        btn.style.background = '#2563EB';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#2563EB';
        panel.style.display = 'block';
      }} else {{
        btn.style.background = '#FFFFFF';
        btn.style.color = '#334155';
        btn.style.borderColor = '#CBD5E1';
        panel.style.display = 'none';
      }}
    }});
  }}

  function switchCbseSamasSub(subKey) {{
    ['sub1', 'sub2'].forEach((k, idx) => {{
      const btn = document.getElementById('btn-cbse-s-' + k);
      const panel = document.getElementById('cbse-s-subpanel-' + (idx+1));
      if (k === subKey) {{
        btn.style.background = '#2563EB';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#2563EB';
        panel.style.display = 'block';
      }} else {{
        btn.style.background = '#FFFFFF';
        btn.style.color = '#334155';
        btn.style.borderColor = '#CBD5E1';
        panel.style.display = 'none';
      }}
    }});
  }}

  function switchCbseVakyaSub(subKey) {{
    ['sub1', 'sub2'].forEach((k, idx) => {{
      const btn = document.getElementById('btn-cbse-v-' + k);
      const panel = document.getElementById('cbse-v-subpanel-' + (idx+1));
      if (k === subKey) {{
        btn.style.background = '#2563EB';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#2563EB';
        panel.style.display = 'block';
      }} else {{
        btn.style.background = '#FFFFFF';
        btn.style.color = '#334155';
        btn.style.borderColor = '#CBD5E1';
        panel.style.display = 'none';
      }}
    }});
  }}

  function switchWritingSub(subKey) {{
    ['sub1', 'sub2', 'sub3'].forEach((k, idx) => {{
      const btn = document.getElementById('btn-writing-' + k);
      const panel = document.getElementById('writing-subpanel-' + (idx+1));
      if (k === subKey) {{
        btn.style.background = '#16A34A';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#16A34A';
        panel.style.display = 'block';
      }} else {{
        btn.style.background = '#FFFFFF';
        btn.style.color = '#334155';
        btn.style.borderColor = '#CBD5E1';
        panel.style.display = 'none';
      }}
    }});
  }}
</script>
"""

    full_page = get_common_head(seo_title, desc, canonical_url, json.dumps(schema_dict, ensure_ascii=False, indent=2))
    full_page += get_navbar(active_link='grammar')
    full_page += breadcrumbs_html
    full_page += hero_html
    full_page += body_html
    full_page += get_footer()
    write_html_file(rel_dir, full_page)
'''

# Find def generate_grammar_pages(): and replace till end of function
pattern = r'def generate_grammar_pages\(\):.*?(?=def generate_trust_and_legal_pages)'
code_updated = re.sub(pattern, new_grammar_function + '\n\n', code, flags=re.DOTALL)

with open('generate_seo_pages.py', 'w', encoding='utf-8') as f:
    f.write(code_updated)

print('Successfully updated generate_grammar_pages with icse_ch_cards in generate_seo_pages.py!')
