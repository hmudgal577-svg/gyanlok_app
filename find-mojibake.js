const fs = require('fs');

function checkFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let count = 0;
  console.log(`=== CHECKING ${filePath} ===`);
  lines.forEach((line, idx) => {
    // Check for diamond question marks, Mojibake utf8 artifacts, etc.
    if (/[\uFFFD]|Ã|Â|â|dY"|/.test(line)) {
      if (count < 20) {
        console.log(`L${idx + 1}: ${line.trim().slice(0, 120)}`);
      }
      count++;
    }
  });
  console.log(`Total bad encoding lines in ${filePath}: ${count}\n`);
}

checkFile('public/index.html');
checkFile('public/script.js');
checkFile('public/chapter_html_content.json');
