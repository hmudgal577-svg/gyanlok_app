const fs = require('fs');

// --- 1. CLEAN SCRIPT.JS ---
let js = fs.readFileSync('public/script.js', 'utf8');

// Replace " - " in data titles/subtitles/chapter names with ": "
js = js.replace(/ - /g, ': ');
js = js.replace(/   -   /g, ', ');
js = js.replace(/ - /g, ': ');

fs.writeFileSync('public/script.js', js, 'utf8');
console.log('✅ script.js cleaned');

// --- 2. CLEAN INDEX.HTML ---
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(/   -   /g, ', ');
html = html.replace(/ - /g, ': ');
html = html.replace(/ 2026 - 27/g, ' 2026-27');
html = html.replace(/ 2015 - 2025/g, ' 2015-2025');

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ index.html cleaned');

// --- 3. CLEAN CHAPTER HTML CONTENT JSON ---
let json = fs.readFileSync('public/chapter_html_content.json', 'utf8');

json = json.replace(/ — /g, ': ');
json = json.replace(/ - /g, ': ');
json = json.replace(/   -   /g, ', ');

fs.writeFileSync('public/chapter_html_content.json', json, 'utf8');
console.log('✅ chapter_html_content.json cleaned');

console.log('Done!');
