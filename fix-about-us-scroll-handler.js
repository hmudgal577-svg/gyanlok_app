const fs = require('fs');

// ─── 1. UPDATE SCRIPT.JS WITH EXPLICIT SMOOTH SCROLL FOR ALL HASH LINKS ───
let scriptJs = fs.readFileSync('public/script.js', 'utf8');

const SCROLL_HANDLER_CODE = `
  /* Explicit Smooth Scroll for all Hash Links (#about, #home, #school-boards, etc.) */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
`;

if (!scriptJs.includes('Explicit Smooth Scroll for all Hash Links')) {
  // Insert inside initNavbar()
  scriptJs = scriptJs.replace(
    '/* Scroll shadow */',
    SCROLL_HANDLER_CODE + '\n  /* Scroll shadow */'
  );
  fs.writeFileSync('public/script.js', scriptJs, 'utf8');
  console.log('✅ Added explicit smooth scroll handler to script.js');
}

// ─── 2. UPDATE STYLE.CSS FOR SCROLL-MARGIN-TOP ─────────────────────────────
let css = fs.readFileSync('public/style.css', 'utf8');

if (!css.includes('scroll-margin-top')) {
  css += '\n\n/* Ensure fixed header offset when scrolling to sections */\nsection[id] { scroll-margin-top: 80px; }\nhtml { scroll-behavior: smooth; }\n';
  fs.writeFileSync('public/style.css', css, 'utf8');
  console.log('✅ Added scroll-margin-top: 80px to style.css');
}

// ─── 3. BUMP VERSION TAG IN INDEX.HTML ─────────────────────────────────────
let html = fs.readFileSync('public/index.html', 'utf8');
html = html.replace(/script\.js\?v=[\d.]+/g, 'script.js?v=36.0.0');
html = html.replace(/style\.css\?v=[\d.]+/g, 'style.css?v=36.0.0');
fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ Bumped version tag to v36.0.0');
