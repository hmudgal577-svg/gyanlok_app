const fs = require('fs');

// ─── 1. CLEAN INDEX.HTML ───────────────────────────────────────────────────
let html = fs.readFileSync('public/index.html', 'utf8');

// Remove broken about-modal from index.html
html = html.replace(/<!-- ABOUT US RICH MODAL -->[\s\S]*?<\/div>\s*<\/div>/g, '');

// Make Navbar "About Us" link a clean smooth-scroll link to #about (no onclick modal)
html = html.replace(
  '<a href="#about" class="nav-link" onclick="openAboutModal();">About Us</a>',
  '<a href="#about" class="nav-link">About Us</a>'
);

// Define Rich Clean About Us Section HTML
const CLEAN_ABOUT_SECTION = `
<!-- • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • 
        ABOUT US SECTION
• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •  -->
<section class="about-section section" id="about" aria-labelledby="about-heading" style="background:var(--bg-alt); padding:5rem 0;">
  <div class="container">
    <div class="section-header fade-in" style="text-align:center; max-width:820px; margin:0 auto 3rem;">
      <span class="section-badge">About GyanLok</span>
      <h2 id="about-heading" style="font-size: clamp(1.8rem, 3.5vw, 2.5rem); font-weight:800; margin-bottom:1rem;">Empowering Class 10 Students in Hindi</h2>
      <p style="font-size:1.1rem; color:var(--text-body); line-height:1.7;">GyanLok is a dedicated, 100% free educational platform built specifically to simplify Class 10 Hindi Literature &amp; Grammar for CBSE and ICSE students across India.</p>
    </div>

    <!-- Impact Stats Grid -->
    <div class="about-stats-grid fade-in" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.5rem; margin-bottom:3.5rem;">
      <div class="about-stat-card" style="background:var(--card-bg); padding:1.75rem 1.25rem; border-radius:18px; border:1px solid var(--border); text-align:center; box-shadow:var(--shadow-card);">
        <div style="font-size:2.2rem; margin-bottom:0.4rem;">📖</div>
        <div style="font-size:1.8rem; color:var(--accent); font-weight:800; margin-bottom:0.2rem;">17+</div>
        <p style="font-size:0.9rem; color:var(--text-muted); margin:0; font-weight:600;">NCERT Chapters Covered</p>
      </div>
      <div class="about-stat-card" style="background:var(--card-bg); padding:1.75rem 1.25rem; border-radius:18px; border:1px solid var(--border); text-align:center; box-shadow:var(--shadow-card);">
        <div style="font-size:2.2rem; margin-bottom:0.4rem;">📝</div>
        <div style="font-size:1.8rem; color:var(--accent); font-weight:800; margin-bottom:0.2rem;">100%</div>
        <p style="font-size:0.9rem; color:var(--text-muted); margin:0; font-weight:600;">Free &amp; Ad-Free Resources</p>
      </div>
      <div class="about-stat-card" style="background:var(--card-bg); padding:1.75rem 1.25rem; border-radius:18px; border:1px solid var(--border); text-align:center; box-shadow:var(--shadow-card);">
        <div style="font-size:2.2rem; margin-bottom:0.4rem;">🎯</div>
        <div style="font-size:1.8rem; color:var(--accent); font-weight:800; margin-bottom:0.2rem;">2015-2025</div>
        <p style="font-size:0.9rem; color:var(--text-muted); margin:0; font-weight:600;">Board PYQs &amp; Solutions</p>
      </div>
      <div class="about-stat-card" style="background:var(--card-bg); padding:1.75rem 1.25rem; border-radius:18px; border:1px solid var(--border); text-align:center; box-shadow:var(--shadow-card);">
        <div style="font-size:2.2rem; margin-bottom:0.4rem;">🤝</div>
        <div style="font-size:1.8rem; color:var(--accent); font-weight:800; margin-bottom:0.2rem;">24 Hours</div>
        <p style="font-size:0.9rem; color:var(--text-muted); margin:0; font-weight:600;">Personal Mentor Response</p>
      </div>
    </div>

    <!-- Main About Content Layout -->
    <div class="about-wrapper fade-in" style="display:grid; grid-template-columns:1.2fr 0.8fr; gap:3rem; align-items:center;">
      <div class="about-content">
        <h3 style="font-size:1.5rem; color:var(--text-primary); font-weight:700; margin-bottom:1.25rem;">Our Core Mission</h3>
        <p style="font-size:1rem; color:var(--text-secondary); line-height:1.75; margin-bottom:1.25rem;">GyanLok was created to eliminate the stress of Class 10 Hindi board exam preparation. We combine complete NCERT textbook coverage (Sparsh &amp; Sanchayan), in-depth chapter summaries, character sketches, solved previous year questions (PYQs), grammar notes, and direct 1-on-1 mentor guidance — all in one accessible, ad-free environment.</p>

        <div class="about-highlights" style="display:flex; flex-direction:column; gap:1.25rem; margin-top:1.5rem;">
          <div class="highlight-item" style="display:flex; align-items:flex-start; gap:1rem; background:var(--card-bg); padding:1.25rem; border-radius:14px; border:1px solid var(--border);">
            <span class="highlight-icon" style="font-size:1.5rem; background:var(--accent-bg); width:44px; height:44px; display:flex; align-items:center; justify-content:center; border-radius:10px; flex-shrink:0;">📘</span>
            <div>
              <strong style="display:block; font-size:1.05rem; color:var(--text-primary); margin-bottom:0.25rem;">Complete Sparsh &amp; Sanchayan Coverage</strong>
              <p style="font-size:0.9rem; color:var(--text-muted); margin:0;">Every single poem and story explained with summary, notes &amp; model answer keys.</p>
            </div>
          </div>
          <div class="highlight-item" style="display:flex; align-items:flex-start; gap:1rem; background:var(--card-bg); padding:1.25rem; border-radius:14px; border:1px solid var(--border);">
            <span class="highlight-icon" style="font-size:1.5rem; background:var(--accent-bg); width:44px; height:44px; display:flex; align-items:center; justify-content:center; border-radius:10px; flex-shrink:0;">📝</span>
            <div>
              <strong style="display:block; font-size:1.05rem; color:var(--text-primary); margin-bottom:0.25rem;">Combined Muhavre &amp; Word Meanings</strong>
              <p style="font-size:0.9rem; color:var(--text-muted); margin:0;">Chapter-wise vocabulary and idioms grouped into easy revision tables.</p>
            </div>
          </div>
          <div class="highlight-item" style="display:flex; align-items:flex-start; gap:1rem; background:var(--card-bg); padding:1.25rem; border-radius:14px; border:1px solid var(--border);">
            <span class="highlight-icon" style="font-size:1.5rem; background:var(--accent-bg); width:44px; height:44px; display:flex; align-items:center; justify-content:center; border-radius:10px; flex-shrink:0;">🎯</span>
            <div>
              <strong style="display:block; font-size:1.05rem; color:var(--text-primary); margin-bottom:0.25rem;">Competency Based Questions &amp; PYQs</strong>
              <p style="font-size:0.9rem; color:var(--text-muted); margin:0;">CBSE pattern HOTS and competency questions tailored for 2026-27 board finals.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="about-card-banner fade-in" style="background:linear-gradient(135deg, #1E293B 0%, #0F172A 100%); color:#fff; padding:2.5rem 2rem; border-radius:24px; box-shadow:0 20px 40px rgba(15,23,42,0.15); position:relative; overflow:hidden;">
        <div class="acb-inner">
          <span style="display:inline-block; background:rgba(255,255,255,0.15); color:#60A5FA; font-size:0.82rem; font-weight:700; padding:0.35rem 0.85rem; border-radius:20px; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:1rem;">Student-First Learning</span>
          <h3 style="font-size:1.5rem; color:#fff; font-weight:700; line-height:1.35; margin-bottom:1.25rem;">Score 95%+ in Class 10 Hindi Board Exams</h3>
          <p style="font-size:0.95rem; color:#CBD5E1; line-height:1.6; margin-bottom:1.5rem;">Access verified textbooks, official marking schemes, active worksheets, and dedicated mentor guidance with zero subscription fees.</p>
          <ul style="list-style:none; padding:0; margin:0 0 1.5rem 0; display:flex; flex-direction:column; gap:0.85rem;">
            <li style="font-size:0.95rem; color:#E2E8F0; display:flex; align-items:center; gap:0.6rem;">✓ Ad-free &amp; 100% Free Learning Portal</li>
            <li style="font-size:0.95rem; color:#E2E8F0; display:flex; align-items:center; gap:0.6rem;">✓ CBSE Course B &amp; ICSE Hindi Literature</li>
            <li style="font-size:0.95rem; color:#E2E8F0; display:flex; align-items:center; gap:0.6rem;">✓ Integrated In-Browser Document &amp; PDF Reader</li>
            <li style="font-size:0.95rem; color:#E2E8F0; display:flex; align-items:center; gap:0.6rem;">✓ Real-time Student &amp; Mentor Support</li>
          </ul>
          <a href="#school-boards" class="btn btn-primary" style="margin-top:1.25rem; width:100%; justify-content:center; padding:0.85rem 1.5rem; font-size:1rem;">Explore Class 10 Hindi Resources</a>
        </div>
      </div>
    </div>
  </div>
</section>`;

// Replace #about section in index.html
html = html.replace(/<section class="about-section section" id="about"[\s\S]*?<\/section>/, CLEAN_ABOUT_SECTION);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ Replaced About Us section with clean, beautifully integrated on-page section');

// ─── 2. CLEAN SCRIPT.JS ────────────────────────────────────────────────────
let scriptJs = fs.readFileSync('public/script.js', 'utf8');

// Ensure PDF viewer topbar has prominent Back button
const OLD_PDF_TOPBAR = `<div class="rp-summary-header" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem; padding:0.75rem 1rem;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <button class="rp-summary-back" onclick="renderDefaultRightContent(BOARDS_DATA[state.board].resources[state.cls][state.subj])" style="font-size:0.85rem; padding:0.35rem 0.75rem; background:var(--accent-bg); color:var(--accent); border:1px solid var(--accent-light); border-radius:6px; font-weight:700; cursor:pointer;">
              &larr; Back
            </button>
            <span style="font-weight:700; color:var(--text-primary); font-size:0.95rem;">\${title}</span>
          </div>`;

if (!scriptJs.includes(OLD_PDF_TOPBAR)) {
  scriptJs = scriptJs.replace(
    /<div class="rp-summary-header">[\s\S]*?<div>\s*<span style="font-weight:700;color:var\(--text-primary\)">\${title}<\/span>\s*<\/div>/,
    `<div class="rp-summary-header" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem; padding:0.75rem 1rem;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <button class="rp-summary-back" onclick="renderDefaultRightContent(BOARDS_DATA[state.board].resources[state.cls][state.subj])" style="font-size:0.85rem; padding:0.35rem 0.75rem; background:var(--accent-bg); color:var(--accent); border:1px solid var(--accent-light); border-radius:6px; font-weight:700; cursor:pointer;">
              &larr; Back
            </button>
            <span style="font-weight:700; color:var(--text-primary); font-size:0.95rem;">\${title}</span>
          </div>`
  );
}

fs.writeFileSync('public/script.js', scriptJs, 'utf8');
console.log('✅ Updated script.js PDF viewer header with Back button');

// ─── 3. BUMP VERSION TAG IN INDEX.HTML ─────────────────────────────────────
html = html.replace(/script\.js\?v=[\d.]+/g, 'script.js?v=34.0.0');
html = html.replace(/style\.css\?v=[\d.]+/g, 'style.css?v=34.0.0');
fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ Bumped version tag to v34.0.0');
