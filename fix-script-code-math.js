const fs = require('fs');

let js = fs.readFileSync('public/script.js', 'utf8');

// Fix code math expressions that were mistakenly replaced
js = js.replace(/classes\.length: 1/g, 'classes.length - 1');
js = js.replace(/\(a, b\) => a: b/g, '(a, b) => a - b');
js = js.replace(/100vh: var\(--nav-h\): 180px/g, '100vh - var(--nav-h) - 180px');
js = js.replace(/Date\.now\(\): /g, 'Date.now() - ');

fs.writeFileSync('public/script.js', js, 'utf8');
console.log('✅ script.js code math restored');
