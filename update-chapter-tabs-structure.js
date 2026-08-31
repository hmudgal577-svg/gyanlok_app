const fs = require('fs');

// ─── 1. UPDATE SCRIPT.JS ACCORDION DROPDOWN & OVERLAY TABS ─────────────────
let scriptJs = fs.readFileSync('public/script.js', 'utf8');

// Replace dropdown options list
const OLD_OPTS_REGEX = /var opts = \[\s*\{ icon:'📝'[\s\S]*?\];/;
const NEW_OPTS = `var opts = [
    { icon:'📝', label:'Summary',                    sub:'पाठ सारांश',                cat:'summary',    color:'#3A7BD5' },
    { icon:'📄', label:'Chapter PDF',               sub:'पाठ PDF',                  cat:'pdf',        color:'#2BA899' },
    { icon:'❓', label:'Notes',                      sub:'मुख्य बिंदु व नोट्स',       cat:'notes',      color:'#E05555' },
    { icon:'🎯', label:'Competency Based Qs',        sub:'कॉम्पिटेंसी प्रश्न',        cat:'competency', color:'#9B59B6' },
    { icon:'⭐', label:'Additional Questions',        sub:'अतिरिक्त अभ्यास प्रश्न',    cat:'additional', color:'#27AE60' },
    { icon:'📖', label:'Muhavre & Word Meanings',   sub:'मुहावरे एवं शब्दार्थ',      cat:'muhavre',    color:'#E8900A' },
  ];`;

scriptJs = scriptJs.replace(OLD_OPTS_REGEX, NEW_OPTS);

// Replace overlay tabs list in openRightContent
const OLD_TABS_REGEX = /const catTabs = \[\s*\{ key: 'summary'[\s\S]*?\];/;
const NEW_TABS = `const catTabs = [
    { key: 'summary',    icon: '📝', label: 'Summary' },
    { key: 'pdf',        icon: '📄', label: 'PDF' },
    { key: 'notes',      icon: '❓', label: 'Notes' },
    { key: 'competency', icon: '🎯', label: 'Competency Qs' },
    { key: 'additional', icon: '⭐', label: 'Additional Qs' },
    { key: 'muhavre',    icon: '📖', label: 'Muhavre & Word Meanings' },
  ];`;

scriptJs = scriptJs.replace(OLD_TABS_REGEX, NEW_TABS);

// Update fetch category handler in openRightContent
scriptJs = scriptJs.replace(
  /let categoryHtml = content\[safeCat\] \|\| content\['summary'\] \|\| '';/g,
  `let catKey = safeCat;
   if (catKey === 'pyq') catKey = 'competency';
   let categoryHtml = content[catKey] || content[safeCat] || content['summary'] || '';`
);

fs.writeFileSync('public/script.js', scriptJs, 'utf8');
console.log('✅ Updated script.js dropdown & overlay tabs');

// ─── 2. UPDATE CHAPTER HTML CONTENT JSON ──────────────────────────────────
let jsonStr = fs.readFileSync('public/chapter_html_content.json', 'utf8');
let json = JSON.parse(jsonStr);

for (const key in json) {
  const ch = json[key];
  if (ch.pyq && !ch.competency) {
    // Map pyq to competency based questions
    ch.competency = ch.pyq.replace(
      /<h2>([\s\S]*?)पिछले वर्षों के प्रश्न \(PYQs\)<\/h2>/g,
      '<h2>$1 कॉम्पिटेंसी आधारित प्रश्न (Competency Based Questions)</h2>'
    );
  }
  if (ch.muhavre) {
    ch.muhavre = ch.muhavre.replace(
      /<h2>([\s\S]*?)(व्याकरण एवं मुहावरे|मुहावरे|शब्दार्थ)<\/h2>/g,
      '<h2>$1 मुहावरे एवं शब्दार्थ (Muhavre & Word Meanings)</h2>'
    );
  }
}

fs.writeFileSync('public/chapter_html_content.json', JSON.stringify(json, null, 2), 'utf8');
console.log('✅ Updated chapter_html_content.json with Competency Qs & combined Muhavre & Word Meanings');

console.log('🎉 ALL CHAPTER TABS UPDATED ACCORDING TO USER SPECIFICATION!');
