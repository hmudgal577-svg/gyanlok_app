const fs = require('fs');

// ─── 1. UPDATE INDEX.HTML (NAVBAR, ABOUT SECTION, FOOTER) ───────────────────
let html = fs.readFileSync('public/index.html', 'utf8');

// 1a. Add "About Us" to Navbar Header right after Home link
html = html.replace(
  '<a href="#home" class="nav-link active">Home</a>',
  '<a href="#home" class="nav-link active">Home</a>\n      <a href="#about" class="nav-link">About Us</a>'
);

// 1b. Create About Us Section HTML
const ABOUT_SECTION_HTML = `
<!-- • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • 
        ABOUT US
• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •  -->
<section class="about-section section" id="about" aria-labelledby="about-heading">
  <div class="container">
    <div class="about-wrapper fade-in">
      <div class="about-content">
        <span class="section-badge">About GyanLok</span>
        <h2 id="about-heading">Empowering Class 10 Students in Hindi</h2>
        <p class="about-lead">GyanLok is a dedicated educational platform created to make Class 10 Hindi learning intuitive, structured, and exam-oriented for CBSE and ICSE students across India.</p>
        <p class="about-desc">We combine complete NCERT textbook coverage (Sparsh &amp; Sanchayan), in-depth chapter summaries, character sketches, solved previous year questions (PYQs), grammar worksheets, and direct 1-on-1 mentor guidance — all in one accessible, ad-free environment.</p>
        <div class="about-highlights">
          <div class="highlight-item">
            <span class="highlight-icon">📘</span>
            <div>
              <strong>Complete Textbook Coverage</strong>
              <p>Sparsh &amp; Sanchayan all chapters with word meanings &amp; Q&amp;A.</p>
            </div>
          </div>
          <div class="highlight-item">
            <span class="highlight-icon">📝</span>
            <div>
              <strong>Practice &amp; Board Guidance</strong>
              <p>Unit test papers, worksheets, and model answer keys for 2026-27.</p>
            </div>
          </div>
          <div class="highlight-item">
            <span class="highlight-icon">🤝</span>
            <div>
              <strong>1-on-1 Mentor Support</strong>
              <p>Personalized doubt resolution and academic direction within 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="about-card-banner fade-in">
        <div class="acb-inner">
          <div class="acb-badge">Class 10 Focused</div>
          <h3>Your Complete Companion for Board Exam Success</h3>
          <ul class="acb-list">
            <li>✓ Ad-free &amp; 100% Free Learning Resources</li>
            <li>✓ CBSE Course B &amp; ICSE Hindi Literature</li>
            <li>✓ Integrated Document &amp; PDF Reader</li>
            <li>✓ Real-time Student &amp; Mentor Support</li>
          </ul>
          <a href="#school-boards" class="btn btn-primary" style="margin-top:1.25rem; width:100%; justify-content:center;">Explore Class 10 Hindi Resources</a>
        </div>
      </div>
    </div>
  </div>
</section>
`;

// Insert About Us Section right after Hero section
html = html.replace('</section>\n\n<!--', '</section>\n' + ABOUT_SECTION_HTML + '\n<!--');

// 1c. Add "About Us" to Footer Quick Links
html = html.replace(
  '<li><a href="#home">Home</a></li>',
  '<li><a href="#home">Home</a></li>\n        <li><a href="#about">About Us</a></li>'
);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ Updated index.html with Navbar About Us link, About section & Footer link');

// ─── 2. ADD ABOUT SECTION STYLES TO STYLE.CSS ──────────────────────────────
let css = fs.readFileSync('public/style.css', 'utf8');

const ABOUT_CSS = `
/* ─── ABOUT SECTION STYLES ─────────────────────────────────────────── */
.about-section { background: var(--bg-alt); padding: 5rem 0; }
.about-wrapper { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 3rem; align-items: center; }
.about-lead { font-size: 1.15rem; font-weight: 600; color: var(--text-primary); margin: 1rem 0; line-height: 1.6; }
.about-desc { font-size: 1rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 2rem; }
.about-highlights { display: flex; flex-direction: column; gap: 1.25rem; }
.highlight-item { display: flex; align-items: flex-start; gap: 1rem; background: var(--card-bg); padding: 1.25rem; border-radius: var(--r-md); border: 1px solid var(--border); transition: transform 0.2s ease, box-shadow 0.2s ease; }
.highlight-item:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
.highlight-icon { font-size: 1.5rem; background: var(--accent-bg); width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 10px; flex-shrink: 0; }
.highlight-item strong { display: block; font-size: 1.05rem; color: var(--text-primary); margin-bottom: 0.25rem; }
.highlight-item p { font-size: 0.9rem; color: var(--text-muted); margin: 0; }
.about-card-banner { background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); color: #fff; padding: 2.5rem 2rem; border-radius: 24px; box-shadow: 0 20px 40px rgba(15,23,42,0.15); position: relative; overflow: hidden; }
.about-card-banner::before { content: ''; position: absolute; top: -50px; right: -50px; width: 180px; height: 180px; background: rgba(58,123,213,0.25); filter: blur(50px); border-radius: 50%; }
.acb-badge { display: inline-block; background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); color: #60A5FA; font-size: 0.82rem; font-weight: 700; padding: 0.35rem 0.85rem; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem; }
.about-card-banner h3 { font-size: 1.5rem; color: #fff; font-weight: 700; line-height: 1.35; margin-bottom: 1.5rem; }
.acb-list { list-style: none; padding: 0; margin: 0 0 1.5rem 0; display: flex; flex-direction: column; gap: 0.85rem; }
.acb-list li { font-size: 0.95rem; color: #E2E8F0; display: flex; align-items: center; gap: 0.6rem; }
@media (max-width: 992px) {
  .about-wrapper { grid-template-columns: 1fr; gap: 2.5rem; }
}
`;

if (!css.includes('.about-section')) {
  css += '\n' + ABOUT_CSS;
  fs.writeFileSync('public/style.css', css, 'utf8');
  console.log('✅ Added About Us CSS styles to style.css');
}

console.log('🎉 ABOUT US SECTION SUCCESSFULLY ADDED!');
