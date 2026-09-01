const https = require('https');
https.get('https://gyanlok.vercel.app', res => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    const m = html.match(/<h1 class="hero-title">([\s\S]*?)<\/h1>/);
    console.log('Title on live site:', m ? m[1].replace(/\s+/g, ' ') : 'None');
    const b = html.match(/<span class="hero-badge">([\s\S]*?)<\/span>/);
    console.log('Badge on live site:', b ? b[1].replace(/\s+/g, ' ') : 'None');
  });
});
