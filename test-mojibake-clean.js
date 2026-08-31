const fs = require('fs');

function checkFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  let count = 0;
  lines.forEach((l, i) => {
    if (/\uFFFD/.test(l)) {
      console.log(`${file} L${i+1}: ${l.trim().slice(0, 80)}`);
      count++;
    }
  });
  console.log(`${file} Unicode replacement char count: ${count}`);
}

checkFile('public/index.html');
checkFile('public/script.js');
checkFile('public/chapter_html_content.json');
