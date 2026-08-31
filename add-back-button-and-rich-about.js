const fs = require('fs');

// ─── 1. ADD BACK BUTTON TO SUBJECT MATERIALS IN SCRIPT.JS ─────────────────
let scriptJs = fs.readFileSync('public/script.js', 'utf8');

// Function to reset right panel to default chapter select state
const SHOW_EMPTY_PANEL_FUNC = `
function showEmptyRightPanel() {
  const panel = document.getElementById('boards-right-panel');
  if (!panel) return;
  panel.innerHTML = \`
    <div class="boards-detail-empty">
      <div class="detail-empty-icon">📖</div>
      <h3>Select a Chapter</h3>
      <p>Choose any chapter from the left panel to view <strong>Summary, PDF, Notes, PYQs &amp; Worksheets</strong>.</p>
    </div>
  \`;
}
window.showEmptyRightPanel = showEmptyRightPanel;
`;

if (!scriptJs.includes('function showEmptyRightPanel()')) {
  scriptJs += '\n' + SHOW_EMPTY_PANEL_FUNC;
}

// Update renderDefaultRightContent header to include Back button
const OLD_HEADER = `<div class="rp-ch-header" style="margin-bottom: 1.25rem;">
        <div class="rp-ch-breadcrumb">\${state.board} &rsaquo; Class \${state.cls} &rsaquo; \${state.subj}</div>
        <h2 class="rp-ch-title">विषय सामग्री (Subject Materials)</h2>
      </div>`;

const NEW_HEADER = `<div class="rp-ch-header" style="margin-bottom: 1.25rem; display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <div class="rp-ch-breadcrumb">\${state.board} &rsaquo; Class \${state.cls} &rsaquo; \${state.subj}</div>
          <h2 class="rp-ch-title">विषय सामग्री (Subject Materials)</h2>
        </div>
        <button class="btn btn-outline btn-sm" onclick="showEmptyRightPanel()" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.85rem; font-size: 0.85rem; border-radius: 8px; font-weight: 600;">
          &larr; Back to Chapters
        </button>
      </div>`;

scriptJs = scriptJs.replace(OLD_HEADER, NEW_HEADER);
fs.writeFileSync('public/script.js', scriptJs, 'utf8');
console.log('✅ Added Back to Chapters button in Subject Materials header in script.js');

// ─── 2. RICH EXECUTIVE ABOUT US SECTION IN INDEX.HTML ─────────────────────
let html = fs.readFileSync('public/index.html', 'utf8');

const RICH_ABOUT_HTML = `<section class="about-section section" id="about" aria-labelledby="about-heading">
  <div class="container">
    <div class="section-header fade-in" style="text-align:center; max-width:800px; margin:0 auto 3rem;">
      <span class="section-badge">About GyanLok</span>
      <h2 id="about-heading">Empowering CBSE &amp; ICSE Class 10 Students in Hindi</h2>
      <p style="font-size:1.15rem; color:var(--text-body); line-height:1.7;">GyanLok is a dedicated, 100% free educational platform built to simplify Hindi Literature &amp; Grammar for Class 10 students with structured chapter summaries, solved PYQs, and expert mentor support.</p>
    </div>

    <!-- Impact Stats Grid -->
    <div class="about-stats-grid fade-in" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1.5rem; margin-bottom:3.5rem;">
      <div class="about-stat-card" style="background:var(--card-bg); padding:1.75rem 1.5rem; border-radius:18px; border:1px solid var(--border); text-align:center; box-shadow:var(--shadow-sm);">
        <div style="font-size:2.2rem; margin-bottom:0.5rem;">📖</div>
        <h3 style="font-size:1.8rem; color:var(--accent); font-weight:800; margin-bottom:0.2rem;">17+</h3>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0; font-weight:600;">NCERT Chapters Covered</p>
      </div>
      <div class="about-stat-card" style="background:var(--card-bg); padding:1.75rem 1.5rem; border-radius:18px; border:1px solid var(--border); text-align:center; box-shadow:var(--shadow-sm);">
        <div style="font-size:2.2rem; margin-bottom:0.5rem;">📝</div>
        <h3 style="font-size:1.8rem; color:var(--accent); font-weight:800; margin-bottom:0.2rem;">100%</h3>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0; font-weight:600;">Free &amp; Ad-Free Resources</p>
      </div>
      <div class="about-stat-card" style="background:var(--card-bg); padding:1.75rem 1.5rem; border-radius:18px; border:1px solid var(--border); text-align:center; box-shadow:var(--shadow-sm);">
        <div style="font-size:2.2rem; margin-bottom:0.5rem;">🎯</div>
        <h3 style="font-size:1.8rem; color:var(--accent); font-weight:800; margin-bottom:0.2rem;">2015-2025</h3>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0; font-weight:600;">Board PYQs &amp; Solutions</p>
      </div>
      <div class="about-stat-card" style="background:var(--card-bg); padding:1.75rem 1.5rem; border-radius:18px; border:1px solid var(--border); text-align:center; box-shadow:var(--shadow-sm);">
        <div style="font-size:2.2rem; margin-bottom:0.5rem;">🤝</div>
        <h3 style="font-size:1.8rem; color:var(--accent); font-weight:800; margin-bottom:0.2rem;">24 Hours</h3>
        <p style="font-size:0.92rem; color:var(--text-muted); margin:0; font-weight:600;">Personal Mentor Support</p>
      </div>
    </div>

    <!-- Main About Content Layout -->
    <div class="about-wrapper fade-in">
      <div class="about-content">
        <h3 style="font-size:1.6rem; color:var(--text-primary); font-weight:700; margin-bottom:1.25rem;">Why GyanLok Was Created</h3>
        <p class="about-desc">Many Class 10 students struggle with Hindi Course B and ICSE Hindi Literature due to lengthy chapter explanations, complex poetic devices, and unorganised study materials scattered across multiple sites.</p>
        <p class="about-desc">GyanLok solves this by bringing everything together in one organized, beautiful portal — chapter-wise summaries, character sketches, grammar notes (समास, पदबंध, मुहावरे), previous year questions (PYQs), unit test papers, and direct mentor consultation.</p>

        <div class="about-highlights" style="margin-top:2rem;">
          <div class="highlight-item">
            <span class="highlight-icon">📘</span>
            <div>
              <strong>Complete Sparsh &amp; Sanchayan Coverage</strong>
              <p>Every single poem and story explained with summary, notes &amp; model answers.</p>
            </div>
          </div>
          <div class="highlight-item">
            <span class="highlight-icon">📝</span>
            <div>
              <strong>Combined Muhavre &amp; Word Meanings</strong>
              <p>Chapter-wise vocabulary and idioms grouped into easy revision tables.</p>
            </div>
          </div>
          <div class="highlight-item">
            <span class="highlight-icon">🎯</span>
            <div>
              <strong>Competency Based Questions &amp; PYQs</strong>
              <p>CBSE pattern HOTS and competency questions tailored for 2026-27 finals.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="about-card-banner fade-in">
        <div class="acb-inner">
          <div class="acb-badge">Student-First Learning</div>
          <h3 style="font-size:1.6rem; color:#fff; font-weight:700; line-height:1.35; margin-bottom:1.25rem;">Score 95%+ in Class 10 Hindi Board Exams</h3>
          <p style="font-size:0.95rem; color:#CBD5E1; line-height:1.6; margin-bottom:1.5rem;">Access verified textbooks, official marking schemes, active worksheets, and dedicated mentor guidance with zero subscription fees.</p>
          <ul class="acb-list">
            <li>✓ Ad-free &amp; 100% Free Learning Portal</li>
            <li>✓ CBSE Course B &amp; ICSE Hindi Literature</li>
            <li>✓ Integrated In-Browser Document &amp; PDF Reader</li>
            <li>✓ Real-time Student &amp; Mentor Support</li>
          </ul>
          <a href="#school-boards" class="btn btn-primary" style="margin-top:1.25rem; width:100%; justify-content:center; padding:0.85rem 1.5rem; font-size:1rem;">Start Learning Class 10 Hindi</a>
        </div>
      </div>
    </div>
  </div>
</section>`;

html = html.replace(/<section class="about-section section" id="about"[\s\S]*?<\/section>/, RICH_ABOUT_HTML);
fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ Updated index.html with Rich Executive About Us Content & Stats Grid');

// ─── 3. BUMP VERSION IN INDEX.HTML ─────────────────────────────────────────
html = html.replace(/script\.js\?v=[\d.]+/g, 'script.js?v=32.0.0');
html = html.replace(/style\.css\?v=[\d.]+/g, 'style.css?v=32.0.0');
fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ Bumped version tag to v32.0.0');
