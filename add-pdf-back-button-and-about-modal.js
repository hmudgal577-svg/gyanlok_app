const fs = require('fs');

// ─── 1. UPDATE SCRIPT.JS FOR PDF VIEWER BACK BUTTON ────────────────────────
let scriptJs = fs.readFileSync('public/script.js', 'utf8');

const OLD_PDF_HEADER = `<div class="rp-summary-header">
          <div>
            <span style="font-weight:700;color:var(--text-primary)">\${title}</span>
          </div>
          <div style="display:flex;gap:.4rem;align-items:center;">`;

const NEW_PDF_HEADER = `<div class="rp-summary-header" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem; padding:0.75rem 1rem;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <button class="rp-summary-back" onclick="renderDefaultRightContent(BOARDS_DATA[state.board].resources[state.cls][state.subj])" style="font-size:0.85rem; padding:0.35rem 0.75rem; background:var(--accent-bg); color:var(--accent); border:1px solid var(--accent-light); border-radius:6px; font-weight:700; cursor:pointer;">
              &larr; Back
            </button>
            <span style="font-weight:700; color:var(--text-primary); font-size:0.95rem;">\${title}</span>
          </div>
          <div style="display:flex; gap:.4rem; align-items:center;">`;

scriptJs = scriptJs.replace(OLD_PDF_HEADER, NEW_PDF_HEADER);

// Also add click handler for About Us buttons to open rich About Modal if clicked
const ABOUT_MODAL_LOGIC = `
function openAboutModal() {
  let modal = document.getElementById('about-modal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAboutModal() {
  let modal = document.getElementById('about-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

window.openAboutModal = openAboutModal;
window.closeAboutModal = closeAboutModal;
`;

if (!scriptJs.includes('function openAboutModal()')) {
  scriptJs += '\n' + ABOUT_MODAL_LOGIC;
}

fs.writeFileSync('public/script.js', scriptJs, 'utf8');
console.log('✅ Updated script.js with 1-step PDF Back Button and About Modal logic');


// ─── 2. ADD ABOUT MODAL TO INDEX.HTML ─────────────────────────────────────
let html = fs.readFileSync('public/index.html', 'utf8');

// Update navbar About Us link to trigger openAboutModal() or scroll
html = html.replace(
  '<a href="#about" class="nav-link">About Us</a>',
  '<a href="#about" class="nav-link" onclick="openAboutModal();">About Us</a>'
);

// Add About Us Modal HTML before closing body tag
const ABOUT_MODAL_HTML = `
<!-- ABOUT US RICH MODAL -->
<div class="modal-overlay" id="about-modal" role="dialog" aria-modal="true" aria-labelledby="am-title">
  <div class="modal-card" style="max-width:720px; border-radius:24px; padding:2rem;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
      <div style="display:flex; align-items:center; gap:0.6rem;">
        <span style="font-size:1.5rem;">📖</span>
        <h2 id="am-title" style="font-size:1.35rem; color:var(--text-primary); font-weight:800; margin:0;">About GyanLok</h2>
      </div>
      <button class="modal-close" onclick="closeAboutModal()" aria-label="Close modal">&times;</button>
    </div>

    <div style="max-height:70vh; overflow-y:auto; padding-right:0.5rem; color:var(--text-body); line-height:1.7;">
      <p style="font-size:1.05rem; font-weight:600; color:var(--accent); margin-bottom:1rem;">Your Complete Companion for CBSE &amp; ICSE Class 10 Hindi Board Exams</p>
      
      <p>GyanLok is an ad-free, 100% free educational portal dedicated to helping Class 10 students master Hindi Course B and ICSE Hindi Literature with confidence and ease.</p>
      
      <div style="background:var(--accent-bg); padding:1.25rem; border-radius:14px; border:1px solid var(--accent-light); margin:1.25rem 0;">
        <h4 style="margin:0 0 0.5rem 0; color:var(--accent); font-size:1rem; font-weight:700;">🎯 Our Mission</h4>
        <p style="margin:0; font-size:0.92rem; color:var(--text-primary);">To empower every Class 10 student across India with top-tier NCERT chapter summaries, character sketches, solved PYQs, grammar notes, and free 1-on-1 mentor guidance.</p>
      </div>

      <h4 style="font-size:1.1rem; color:var(--text-primary); margin:1.25rem 0 0.75rem;">📚 What You Get on GyanLok:</h4>
      <ul style="padding-left:1.25rem; margin-bottom:1.5rem; display:flex; flex-direction:column; gap:0.5rem; font-size:0.95rem;">
        <li><strong>Complete NCERT Textbooks:</strong> Sparsh &amp; Sanchayan chapter-by-chapter coverage.</li>
        <li><strong>Detailed Summaries &amp; Notes:</strong> Chapter meanings, character sketches &amp; exam notes.</li>
        <li><strong>Combined Muhavre &amp; Word Meanings:</strong> Vocabulary &amp; idioms mapped per chapter.</li>
        <li><strong>Competency Based Questions &amp; PYQs:</strong> 10 years solved board papers with model solutions.</li>
        <li><strong>Personal Mentor Support:</strong> Submit your academic queries and get expert guidance within 24 hours.</li>
      </ul>

      <div style="text-align:center; padding-top:1rem; border-top:1px solid var(--border);">
        <button class="btn btn-primary" onclick="closeAboutModal(); document.getElementById('school-boards').scrollIntoView({behavior:'smooth'});" style="width:100%; justify-content:center;">Explore Class 10 Hindi Resources</button>
      </div>
    </div>
  </div>
</div>
`;

if (!html.includes('id="about-modal"')) {
  html = html.replace('</body>', ABOUT_MODAL_HTML + '\n</body>');
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ Updated index.html with interactive About Us Modal');

// ─── 3. BUMP VERSION TAG ──────────────────────────────────────────────────
html = html.replace(/script\.js\?v=[\d.]+/g, 'script.js?v=33.0.0');
html = html.replace(/style\.css\?v=[\d.]+/g, 'style.css?v=33.0.0');
fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ Bumped version tag to v33.0.0');
