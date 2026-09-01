const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const lines = html.split('\n');
lines[264] = '        <div class="detail-empty-icon">📖</div>';
lines[266] = '        <p>बाईं तरफ से कोई अध्याय चुनें और <strong>पाठ सारांश, PDF, Q&amp;A</strong> देखने के लिए उस पर क्लिक करें।</p>';

fs.writeFileSync('public/index.html', lines.join('\n'), 'utf8');
console.log('Fixed lines 265 and 267 in index.html!');
