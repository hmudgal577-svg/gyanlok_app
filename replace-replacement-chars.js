const fs = require('fs');

// Clean index.html empty detail panel and any remaining replacement characters
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(/<div class="boards-detail-empty">[\s\S]*?<\/div>\s*<\/div>/, `<div class="boards-detail-empty">
        <div class="detail-empty-icon">📖</div>
        <h3>Select a Chapter</h3>
        <p>Choose any chapter from the left panel to view <strong>Summary, PDF, Notes, PYQs &amp; Worksheets</strong>.</p>
      </div>
    </div>`);

// Remove any remaining Unicode replacement characters \uFFFD
html = html.replace(/\uFFFD/g, '');
fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ index.html replacement characters fixed');

// Clean script.js
let js = fs.readFileSync('public/script.js', 'utf8');
js = js.replace(/\uFFFD/g, '');
fs.writeFileSync('public/script.js', js, 'utf8');
console.log('✅ script.js replacement characters fixed');

// Clean chapter_html_content.json
let json = fs.readFileSync('public/chapter_html_content.json', 'utf8');
json = json.replace(/\uFFFD/g, '');
fs.writeFileSync('public/chapter_html_content.json', json, 'utf8');
console.log('✅ chapter_html_content.json replacement characters fixed');
