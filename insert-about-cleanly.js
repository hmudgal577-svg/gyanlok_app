const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

const ABOUT_HTML = `
<!-- """"""""""""""""""""""""""""""""""""""""
     ABOUT GYANLOK SECTION
"""""""""""""""""""""""""""""""""""""""" -->
<section class="about-section section bg-soft" id="about" aria-labelledby="about-heading" style="scroll-margin-top: 80px; padding: 4.5rem 0;">
  <div class="container">
    <div class="section-header fade-in" style="text-align:center; max-width:800px; margin:0 auto 2.5rem;">
      <span class="section-badge">About GyanLok</span>
      <h2 id="about-heading" style="font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight:800; margin-bottom:1rem;">Empowering Class 10 Students in Hindi</h2>
      <p style="font-size:1.1rem; color:var(--text-body); line-height:1.7;">GyanLok is a dedicated, 100% free educational platform built specifically to simplify Class 10 Hindi Literature &amp; Grammar for CBSE and ICSE students across India.</p>
    </div>

    <!-- Impact Stats Grid -->
    <div class="about-stats-grid fade-in" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.25rem; margin-bottom:3rem;">
      <div class="about-stat-card" style="background:var(--card-bg); padding:1.5rem 1.25rem; border-radius:18px; border:1px solid var(--border); text-align:center; box-shadow:var(--shadow-card);">
        <div style="font-size:2rem; margin-bottom:0.4rem;">📖</div>
        <div style="font-size:1.7rem; color:var(--accent); font-weight:800; margin-bottom:0.2rem;">17+</div>
        <p style="font-size:0.88rem; color:var(--text-muted); margin:0; font-weight:600;">NCERT Chapters Covered</p>
      </div>
      <div class="about-stat-card" style="background:var(--card-bg); padding:1.5rem 1.25rem; border-radius:18px; border:1px solid var(--border); text-align:center; box-shadow:var(--shadow-card);">
        <div style="font-size:2rem; margin-bottom:0.4rem;">📝</div>
        <div style="font-size:1.7rem; color:var(--accent); font-weight:800; margin-bottom:0.2rem;">100%</div>
        <p style="font-size:0.88rem; color:var(--text-muted); margin:0; font-weight:600;">Free &amp; Ad-Free Resources</p>
      </div>
      <div class="about-stat-card" style="background:var(--card-bg); padding:1.5rem 1.25rem; border-radius:18px; border:1px solid var(--border); text-align:center; box-shadow:var(--shadow-card);">
        <div style="font-size:2rem; margin-bottom:0.4rem;">🎯</div>
        <div style="font-size:1.7rem; color:var(--accent); font-weight:800; margin-bottom:0.2rem;">2015-2025</div>
        <p style="font-size:0.88rem; color:var(--text-muted); margin:0; font-weight:600;">Board PYQs &amp; Solutions</p>
      </div>
      <div class="about-stat-card" style="background:var(--card-bg); padding:1.5rem 1.25rem; border-radius:18px; border:1px solid var(--border); text-align:center; box-shadow:var(--shadow-card);">
        <div style="font-size:2rem; margin-bottom:0.4rem;">🤝</div>
        <div style="font-size:1.7rem; color:var(--accent); font-weight:800; margin-bottom:0.2rem;">24 Hours</div>
        <p style="font-size:0.88rem; color:var(--text-muted); margin:0; font-weight:600;">Personal Mentor Support</p>
      </div>
    </div>

    <!-- Main About Content Layout -->
    <div class="about-wrapper fade-in" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:2.5rem; align-items:center;">
      <div class="about-content">
        <h3 style="font-size:1.45rem; color:var(--text-primary); font-weight:700; margin-bottom:1rem;">Our Core Mission</h3>
        <p style="font-size:0.98rem; color:var(--text-secondary); line-height:1.7; margin-bottom:1.25rem;">GyanLok was created to eliminate the stress of Class 10 Hindi board exam preparation. We combine complete NCERT textbook coverage (Sparsh &amp; Sanchayan), in-depth chapter summaries, character sketches, solved previous year questions (PYQs), grammar notes, and direct 1-on-1 mentor guidance — all in one accessible, ad-free environment.</p>

        <div class="about-highlights" style="display:flex; flex-direction:column; gap:1rem; margin-top:1.25rem;">
          <div class="highlight-item" style="display:flex; align-items:flex-start; gap:0.85rem; background:var(--card-bg); padding:1.1rem; border-radius:14px; border:1px solid var(--border);">
            <span class="highlight-icon" style="font-size:1.35rem; background:var(--accent-bg); width:40px; height:40px; display:flex; align-items:center; justify-content:center; border-radius:10px; flex-shrink:0;">📘</span>
            <div>
              <strong style="display:block; font-size:0.98rem; color:var(--text-primary); margin-bottom:0.2rem;">Complete Sparsh &amp; Sanchayan Coverage</strong>
              <p style="font-size:0.88rem; color:var(--text-muted); margin:0;">Every single poem and story explained with summary, notes &amp; model answer keys.</p>
            </div>
          </div>
          <div class="highlight-item" style="display:flex; align-items:flex-start; gap:0.85rem; background:var(--card-bg); padding:1.1rem; border-radius:14px; border:1px solid var(--border);">
            <span class="highlight-icon" style="font-size:1.35rem; background:var(--accent-bg); width:40px; height:40px; display:flex; align-items:center; justify-content:center; border-radius:10px; flex-shrink:0;">📝</span>
            <div>
              <strong style="display:block; font-size:0.98rem; color:var(--text-primary); margin-bottom:0.2rem;">Combined Muhavre &amp; Word Meanings</strong>
              <p style="font-size:0.88rem; color:var(--text-muted); margin:0;">Chapter-wise vocabulary and idioms grouped into easy revision tables.</p>
            </div>
          </div>
          <div class="highlight-item" style="display:flex; align-items:flex-start; gap:0.85rem; background:var(--card-bg); padding:1.1rem; border-radius:14px; border:1px solid var(--border);">
            <span class="highlight-icon" style="font-size:1.35rem; background:var(--accent-bg); width:40px; height:40px; display:flex; align-items:center; justify-content:center; border-radius:10px; flex-shrink:0;">🎯</span>
            <div>
              <strong style="display:block; font-size:0.98rem; color:var(--text-primary); margin-bottom:0.2rem;">Competency Based Questions &amp; PYQs</strong>
              <p style="font-size:0.88rem; color:var(--text-muted); margin:0;">CBSE pattern HOTS and competency questions tailored for 2026-27 board finals.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="about-card-banner fade-in" style="background:linear-gradient(135deg, #1E293B 0%, #0F172A 100%); color:#fff; padding:2.25rem 1.75rem; border-radius:24px; box-shadow:0 20px 40px rgba(15,23,42,0.15); position:relative; overflow:hidden;">
        <div class="acb-inner">
          <span style="display:inline-block; background:rgba(255,255,255,0.15); color:#60A5FA; font-size:0.8rem; font-weight:700; padding:0.3rem 0.75rem; border-radius:20px; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.85rem;">Student-First Learning</span>
          <h3 style="font-size:1.45rem; color:#fff; font-weight:700; line-height:1.35; margin-bottom:1rem;">Score 95%+ in Class 10 Hindi Board Exams</h3>
          <p style="font-size:0.9rem; color:#CBD5E1; line-height:1.6; margin-bottom:1.25rem;">Access verified textbooks, official marking schemes, active worksheets, and dedicated mentor guidance with zero subscription fees.</p>
          <ul style="list-style:none; padding:0; margin:0 0 1.25rem 0; display:flex; flex-direction:column; gap:0.75rem;">
            <li style="font-size:0.9rem; color:#E2E8F0; display:flex; align-items:center; gap:0.5rem;">✓ Ad-free &amp; 100% Free Learning Portal</li>
            <li style="font-size:0.9rem; color:#E2E8F0; display:flex; align-items:center; gap:0.5rem;">✓ CBSE Course B &amp; ICSE Hindi Literature</li>
            <li style="font-size:0.9rem; color:#E2E8F0; display:flex; align-items:center; gap:0.5rem;">✓ Integrated In-Browser Document &amp; PDF Reader</li>
            <li style="font-size:0.9rem; color:#E2E8F0; display:flex; align-items:center; gap:0.5rem;">✓ Real-time Student &amp; Mentor Support</li>
          </ul>
          <a href="#school-boards" class="btn btn-primary" style="margin-top:1rem; width:100%; justify-content:center; padding:0.8rem 1.25rem; font-size:0.95rem;">Explore Class 10 Hindi Resources</a>
        </div>
      </div>
    </div>
  </div>
</section>
`;

// Insert after hero section end tag
const TARGET_HERO_END = `<div class="hero-wave" aria-hidden="true">
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none"><path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="var(--bg)"/></svg>
  </div>
</section>`;

html = html.replace(TARGET_HERO_END, TARGET_HERO_END + '\n' + ABOUT_HTML);

// Bump version to v38.0.0
html = html.replace(/script\.js\?v=[\d.]+/g, 'script.js?v=38.0.0');
html = html.replace(/style\.css\?v=[\d.]+/g, 'style.css?v=38.0.0');

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ Successfully inserted About Us Section (id="about") into index.html!');
