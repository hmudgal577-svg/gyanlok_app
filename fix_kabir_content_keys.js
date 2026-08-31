const fs = require('fs');

const jsonPath = 'public/chapter_html_content.json';
let chaptersData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Get the converted content from 'स्पर्श (भाग-2)_1'
const baseContent = chaptersData['स्पर्श (भाग-2)_1'];

if (!baseContent) {
  console.error('Base content स्पर्श (भाग-2)_1 not found!');
  process.exit(1);
}

// All possible key aliases used by script.js getChapterContentKey & openRightContent
const keysToSet = [
  'cbse_10_hindi_ch1',
  'cbse_10_hindi_sakhi',
  'cbse_10_hindi_kabir',
  'स्पर्श (भाग-2)_1',
  'Sparsh_1'
];

keysToSet.forEach(k => {
  chaptersData[k] = Object.assign({}, baseContent);
  console.log(`✅ Mapped key: "${k}"`);
});

fs.writeFileSync(jsonPath, JSON.stringify(chaptersData, null, 2), 'utf8');
console.log('🎉 Successfully saved chapter_html_content.json with all key aliases!');
