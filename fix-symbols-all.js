const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(/â€¢Â /g, '• ');
html = html.replace(/â€¢Â/g, '•');
html = html.replace(/â€” Â /g, ' — ');
html = html.replace(/â€” Â/g, ' — ');
html = html.replace(/â€”/g, '—');
html = html.replace(/Â /g, ' ');
html = html.replace(/â„™/g, '→');
html = html.replace(/Â©/g, '©');
html = html.replace(/Â Â¤Â¯Â¸Â /g, '❤️');
html = html.replace(/Ã—/g, '×');
html = html.replace(/Â /g, ' ');
html = html.replace(/Â/g, '');

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Cleaned all corrupted symbols in index.html!');
