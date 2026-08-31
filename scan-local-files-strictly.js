const fs = require('fs');

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let count = 0;
  console.log(`=== SCANNING ${filePath} ===`);
  lines.forEach((l, i) => {
    // Check for " - " in prose/titles/data
    if (/\s+-\s+/.test(l)) {
      // Exclude JS code operations like math a - b or git comments or css calc
      if (!l.includes('calc(') && !l.includes('Date.now() -') && !l.includes(' - 180px') && !l.includes(' - 1') && !l.includes(' - 2') && !l.includes(' - 3') && !l.includes(' - 4') && !l.includes(' - 5')) {
        console.log(`L${i+1}: ${l.trim().slice(0, 100)}`);
        count++;
      }
    }
  });
  console.log(`Remaining prose dashes in ${filePath}: ${count}\n`);
}

scanFile('public/index.html');
scanFile('public/script.js');
scanFile('public/chapter_html_content.json');
