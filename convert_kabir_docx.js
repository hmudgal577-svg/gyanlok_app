const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const dataDir = 'D:/data';

// Find the folder containing Kabir Saakhi files
const items = fs.readdirSync(dataDir);
console.log('Items in D:/data:', items);

let targetFolder = null;
for (const item of items) {
  const fullPath = path.join(dataDir, item);
  if (fs.statSync(fullPath).isDirectory()) {
    const files = fs.readdirSync(fullPath);
    if (files.some(f => f.toLowerCase().includes('saakhi'))) {
      targetFolder = fullPath;
      break;
    }
  }
}

console.log('Target folder found:', targetFolder);

if (!targetFolder) {
  console.error('Could not find folder with Saakhi files!');
  process.exit(1);
}

const files = fs.readdirSync(targetFolder);
console.log('Files in target folder:', files);

async function convertFile(filename) {
  const filePath = path.join(targetFolder, filename);
  console.log(`Converting ${filename}...`);

  // Mammoth options with custom style mapping to preserve formatting, headers, bold, colors
  const result = await mammoth.convertToHtml({ path: filePath }, {
    styleMap: [
      "p[style-name='Heading 1'] => h1:fresh",
      "p[style-name='Heading 2'] => h2:fresh",
      "p[style-name='Heading 3'] => h3:fresh",
      "p[style-name='Title'] => h1.title:fresh",
      "p[style-name='Header'] => div.doc-header:fresh",
      "p[style-name='Footer'] => div.doc-footer:fresh",
      "r[style-name='Strong'] => strong"
    ]
  });

  return result.value;
}

async function processAll() {
  const converted = {};

  for (const file of files) {
    if (!file.endsWith('.docx') || file.startsWith('~$')) continue;

    const html = await convertFile(file);
    const fnameLower = file.toLowerCase();

    if (fnameLower.includes('summary')) {
      converted.summary = html;
    } else if (fnameLower.includes('notes')) {
      converted.notes = html;
    } else if (fnameLower.includes('competency')) {
      converted.competency = html;
    } else if (fnameLower.includes('additional')) {
      converted.additional = html;
    } else if (fnameLower.includes('word_meanings') || fnameLower.includes('muhavre')) {
      converted.muhavre = html;
    }
  }

  console.log('Converted categories:', Object.keys(converted));

  // Load existing chapter_html_content.json
  const jsonPath = 'public/chapter_html_content.json';
  let chaptersData = {};
  if (fs.existsSync(jsonPath)) {
    chaptersData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }

  // Target Key for Sparsh Chapter 1 (कबीर: साखी)
  const key = 'स्पर्श (भाग-2)_1';
  chaptersData[key] = chaptersData[key] || {};

  // Preserve title and book info
  chaptersData[key].title = 'कबीर: साखी';
  chaptersData[key].book = 'स्पर्श (भाग-2)';
  chaptersData[key].chNum = 1;

  if (converted.summary)    chaptersData[key].summary = `<div class="docx-styled-content">${converted.summary}</div>`;
  if (converted.notes)      chaptersData[key].notes = `<div class="docx-styled-content">${converted.notes}</div>`;
  if (converted.competency) chaptersData[key].competency = `<div class="docx-styled-content">${converted.competency}</div>`;
  if (converted.additional) chaptersData[key].additional = `<div class="docx-styled-content">${converted.additional}</div>`;
  if (converted.muhavre)    chaptersData[key].muhavre = `<div class="docx-styled-content">${converted.muhavre}</div>`;

  fs.writeFileSync(jsonPath, JSON.stringify(chaptersData, null, 2), 'utf8');
  console.log(`✅ Successfully updated ${key} in ${jsonPath} with DOCX content!`);
}

processAll().catch(err => {
  console.error('Error processing DOCX files:', err);
});
