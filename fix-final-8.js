const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(/â€“/g, '–');
html = html.replace(/â‚¹/g, '₹');
html = html.replace(/â„™/g, '→');
html = html.replace(/Notify me\s+â[^\s<]*/g, 'Notify me →');
html = html.replace(/Talk to a Mentor\s+â[^\s<]*/g, 'Talk to a Mentor →');
html = html.replace(/â/g, '');

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Fixed final 8 lines in index.html!');
