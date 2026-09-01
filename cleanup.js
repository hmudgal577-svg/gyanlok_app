/**
 * cleanup.js
 * Automates all GyanLok content cleanup:
 *  1. script.js  — keep only Class 10 Hindi; replace – with — em dashes
 *  2. index.html — remove Vedic Maths nav link + full section; update hero text; fix em dashes
 */

const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, 'public');
const scriptPath = path.join(PUBLIC, 'script.js');
const htmlPath   = path.join(PUBLIC, 'index.html');

// ─── 1. PATCH script.js ──────────────────────────────────────────────────────
let js = fs.readFileSync(scriptPath, 'utf8');

// 1a. CBSE: keep only class 10, only Hindi subject
js = js.replace(
  /classes:\s*\[6,\s*7,\s*8,\s*9,\s*10\],\s*\n\s*subjectsByClass:\s*\{\s*\n\s*6:\s*\['Hindi'[^\}]+\},/,
  `classes: [10],\n    subjectsByClass: {\n      10: ['Hindi'],\n    },`
);

// 1b. ICSE: keep only class 10, only Hindi subject
js = js.replace(
  /classes:\s*\[6,\s*7,\s*8,\s*9,\s*10\],\s*\n\s*subjectsByClass:\s*\{\s*\n\s*6:\s*\['English'[^\}]+\},/,
  `classes: [10],\n    subjectsByClass: {\n      10: ['Hindi'],\n    },`
);

// 1c. Fix em dashes: – → — and existing — kept
js = js.replace(/\u2013/g, '\u2014'); // en dash → em dash
js = js.replace(/–/g, '—');           // literal en dash → em dash

// 1d. Bump version
js = js.replace(/script\.js\?v=[\d.]+/g, 'script.js?v=19.0.0');

fs.writeFileSync(scriptPath, js, 'utf8');
console.log('✅ script.js patched');

// ─── 2. PATCH index.html ─────────────────────────────────────────────────────
let html = fs.readFileSync(htmlPath, 'utf8');

// 2a. Remove Vedic Maths nav link
html = html.replace(/<a href="#vedic-maths"[^>]*>Vedic Maths<\/a>\s*/gi, '');

// 2b. Remove entire Vedic Maths section
html = html.replace(/<section[^>]+id="vedic-maths"[\s\S]*?<\/section>/gi, '');

// 2c. Update meta description - remove Vedic Maths references
html = html.replace(/,?\s*Vedic Maths (courses|classes)/gi, '');
html = html.replace(/,\s*Vedic Maths/gi, '');
html = html.replace(/Vedic Maths/gi, '');

// 2d. Update hero badge: Class 1-10 → Class 10
html = html.replace(/CBSE &amp; ICSE \| Class 1 - 10/g, 'CBSE &amp; ICSE | Class 10');
html = html.replace(/CBSE & ICSE \| Class 1 - 10/g, 'CBSE & ICSE | Class 10');

// 2e. Update hero title to Hindi-focused
html = html.replace(
  /Learning Made Simple,<br\/>Futures Made Bright\./,
  'हिंदी सीखो आसानी से,<br/>भविष्य बनाओ उज्जवल।'
);

// 2f. Update hero subtitle
html = html.replace(
  /Free textbooks, chapter-wise resources, PYQs, practice worksheets,[^<]*classes,[^<]*support\s*-[^<]*all in one trusted place\./gi,
  'कक्षा 10 हिंदी के लिए NCERT पाठ्यपुस्तकें, अध्यायवार संसाधन, PYQs, अभ्यास पत्रक और व्यक्तिगत मार्गदर्शन — सब एक जगह, बिलकुल मुफ़्त।'
);

// 2g. Update hero stats
html = html.replace(/<strong>Class 1 - 10<\/strong><span>All Classes<\/span>/g,
  '<strong>Class 10</strong><span>Hindi Focus</span>');
html = html.replace(/<strong>CBSE &amp; ICSE<\/strong><span>Both Boards<\/span>/g,
  '<strong>CBSE &amp; ICSE</strong><span>दोनों बोर्ड</span>');
html = html.replace(/<strong>Free<\/strong><span>Resources<\/span>/g,
  '<strong>मुफ़्त</strong><span>सभी संसाधन</span>');

// 2h. Fix em dashes in html too
html = html.replace(/\u2013/g, '\u2014');

// 2i. Bump version
html = html.replace(/script\.js\?v=[\d.]+/g, 'script.js?v=19.0.0');
html = html.replace(/style\.css\?v=[\d.]+/g, 'style.css?v=19.0.0');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ index.html patched');

// ─── 3. VERIFY ───────────────────────────────────────────────────────────────
const htmlFinal = fs.readFileSync(htmlPath, 'utf8');
const jsFinal   = fs.readFileSync(scriptPath, 'utf8');

console.log('\n📊 VERIFICATION:');
console.log('  Vedic Maths in html?:', /vedic.maths/i.test(htmlFinal) ? '❌ STILL FOUND' : '✅ REMOVED');
console.log('  Class 10 only in CBSE?:', /classes:\s*\[10\]/.test(jsFinal) ? '✅ YES' : '❌ NO');
console.log('  Hindi only in CBSE?:', /10:\s*\['Hindi'\]/.test(jsFinal) ? '✅ YES' : '❌ NO');
console.log('  Hero title Hindi?:', /हिंदी सीखो/.test(htmlFinal) ? '✅ YES' : '❌ NO');
console.log('  Version bumped?:', /v=19\.0\.0/.test(htmlFinal) ? '✅ YES' : '❌ NO');
console.log('\n✅ ALL CLEANUP DONE!');
