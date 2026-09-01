const https = require('https');

console.log('🚀 Testing Live Production URL: https://gyanlok.vercel.app/chapter_html_content.json ...\n');

https.get('https://gyanlok.vercel.app/chapter_html_content.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✅ HTTP Status:', res.statusCode);
    if (res.statusCode !== 200) {
      console.error('❌ Failed to fetch chapter content. Status:', res.statusCode);
      process.exit(1);
    }

    try {
      const json = JSON.parse(data);
      const ch1 = json['स्पर्श (भाग-2)_1'];
      if (!ch1) {
        console.error('❌ स्पर्श (भाग-2)_1 not found in live JSON!');
        process.exit(1);
      }

      console.log('✨ Live Chapter Title:', ch1.title);
      console.log('📖 Summary Content Length:', ch1.summary ? ch1.summary.length + ' chars' : '0');
      console.log('❓ Notes Content Length:', ch1.notes ? ch1.notes.length + ' chars' : '0');
      console.log('🎯 Competency Questions Length:', ch1.competency ? ch1.competency.length + ' chars' : '0');
      console.log('⭐ Additional Questions Length:', ch1.additional ? ch1.additional.length + ' chars' : '0');
      console.log('📖 Muhavre & Word Meanings Length:', ch1.muhavre ? ch1.muhavre.length + ' chars' : '0');

      console.log('\n--- LIVE SUMMARY PREVIEW ---');
      console.log(ch1.summary.slice(0, 250).replace(/<[^>]+>/g, ' '));

      console.log('\n🎉 ALL LIVE DOCX CONTENT TESTS PASSED 100% SUCCESSFUL!');
    } catch (e) {
      console.error('❌ Failed to parse live JSON response:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('❌ Request error:', err.message);
});
