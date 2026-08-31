const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// ─── 1. UPDATE PYQS SECTION ────────────────────────────────────────────────
const NEW_PYQ_GRID = `<div class="coming-soon-grid fade-in" style="grid-template-columns: repeat(2, 1fr); max-width: 900px; margin: 0 auto;">
      <div class="coming-soon-card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div class="cs-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <h3>CBSE Class 10 PYQs</h3>
          <p>Last 10 years board exam papers with solutions for Class 10 Hindi Course B.</p>
        </div>
        <button class="btn btn-primary" onclick="selectBoard('CBSE'); document.getElementById('school-boards').scrollIntoView({behavior:'smooth'});" style="margin-top:1.25rem; width:100%; justify-content:center;">View CBSE Class 10 PYQs</button>
      </div>
      <div class="coming-soon-card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div class="cs-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <h3>ICSE Class 10 PYQs</h3>
          <p>ICSE board papers from 2015 to 2025, chapter-mapped with model answers.</p>
        </div>
        <button class="btn btn-outline" onclick="selectBoard('ICSE'); document.getElementById('school-boards').scrollIntoView({behavior:'smooth'});" style="margin-top:1.25rem; width:100%; justify-content:center;">View ICSE Class 10 PYQs</button>
      </div>
    </div>
    <div class="notify-bar fade-in" style="margin-top:2rem;">
      <p>Need a specific chapter PYQ paper or sample paper? <a href="#contact" class="notify-link">Talk to a Mentor Directly</a></p>
    </div>`;

html = html.replace(/<div class="coming-soon-grid fade-in">[\s\S]*?<div class="notify-bar fade-in">[\s\S]*?<\/div>/, NEW_PYQ_GRID);

// ─── 2. POLISH COLON SPACES IN INDEX.HTML ──────────────────────────────────
html = html.replace(/\s+:\s+/g, ': ');
html = html.replace(/  :  /g, ': ');

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ Updated PYQ section in index.html (Class 9 removed, Class 10 buttons added, Coming Soon removed)');

// ─── 3. BUMP VERSION IN INDEX.HTML ─────────────────────────────────────────
html = html.replace(/script\.js\?v=[\d.]+/g, 'script.js?v=30.0.0');
html = html.replace(/style\.css\?v=[\d.]+/g, 'style.css?v=30.0.0');
fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ Bumped version tag to v30.0.0');
