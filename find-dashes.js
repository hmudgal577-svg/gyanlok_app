const fs = require('fs');

const html = fs.readFileSync('public/index.html', 'utf8');
const js = fs.readFileSync('public/script.js', 'utf8');

console.log('HTML dash matches:');
const htmlLines = html.split('\n');
htmlLines.forEach((line, idx) => {
  if (line.includes(' - ') || line.includes('&mdash;') || line.includes('&ndash;') || line.includes('—') || line.includes('–')) {
    console.log(`L${idx + 1}: ${line.trim()}`);
  }
});

console.log('\nJS dash matches (sample first 15):');
const jsLines = js.split('\n');
let count = 0;
jsLines.forEach((line, idx) => {
  if ((line.includes(' - ') || line.includes('—') || line.includes('–')) && count < 15) {
    console.log(`L${idx + 1}: ${line.trim()}`);
    count++;
  }
});
