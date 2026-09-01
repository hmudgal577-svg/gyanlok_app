const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// Replace any sequence of spaces + dash + spaces with clean comma or colon
html = html.replace(/\s+-\s+/g, ', ');

fs.writeFileSync('public/index.html', html, 'utf8');

const htmlLines = html.split('\n');
let count = 0;
htmlLines.forEach((line, idx) => {
  if (line.includes(' - ') || line.includes(' -') || line.includes('- ')) {
    if (!line.includes('stroke-width') && !line.includes('stroke-linecap') && !line.includes('aria-') && !line.includes('class=') && !line.includes('id=')) {
      console.log(`L${idx + 1}: ${line.trim()}`);
      count++;
    }
  }
});
console.log('Remaining text dashes in HTML:', count);
