const fs = require('fs');

// ─── 1. FIX CLIENT JS SCRIPTS (API_BASE = '') ──────────────────────────────
['public/login-script.js', 'public/admin-login-script.js', 'public/admin-dashboard-script.js'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(
    /const API_BASE = \(window\.location\.hostname[\s\S]*?'https:\/\/gyanlok-backend\.onrender\.com';/g,
    "const API_BASE = '';"
  );
  fs.writeFileSync(file, code, 'utf8');
  console.log(`✅ Fixed API_BASE = '' in ${file}`);
});


// ─── 2. UPDATE TEST_DATA IN SCRIPT.JS TO CLASS 10 HINDI PAPERS ONLY ────────
let scriptJs = fs.readFileSync('public/script.js', 'utf8');

const NEW_TEST_DATA = `const TEST_DATA = {
  UTP: {
    CBSE: {
      10: [
        { id: 'UTP_CBSE_10_01', title: 'Unit Test Paper 1: Hindi (स्पर्श)',          subject: 'Hindi', date: 'Feb 2026', pages: 4, color: '#3A7BD5' },
        { id: 'UTP_CBSE_10_02', title: 'Unit Test Paper 2: Hindi (संचयन)',          subject: 'Hindi', date: 'Apr 2026', pages: 4, color: '#2BA899' },
        { id: 'UTP_CBSE_10_03', title: 'Unit Test Paper 3: Hindi (व्याकरण एवं मुहावरे)', subject: 'Hindi', date: 'Jun 2026', pages: 3, color: '#9B59B6' },
        { id: 'UTP_CBSE_10_04', title: 'Unit Test Paper 4: Hindi (अभ्यास प्रश्न पत्र)', subject: 'Hindi', date: 'Aug 2026', pages: 4, color: '#E05555' },
      ],
      9: [], 8: [], 7: [], 6: []
    },
    ICSE: {
      10: [
        { id: 'UTP_ICSE_10_01', title: 'Unit Test Paper 1: ICSE Hindi (गद्य खंड)',   subject: 'Hindi', date: 'Feb 2026', pages: 4, color: '#3A7BD5' },
        { id: 'UTP_ICSE_10_02', title: 'Unit Test Paper 2: ICSE Hindi (पद्य खंड)',   subject: 'Hindi', date: 'Apr 2026', pages: 4, color: '#2BA899' },
      ],
      9: [], 8: [], 7: [], 6: []
    }
  },
  Worksheets: {
    CBSE: {
      10: [
        { id: 'WS_CBSE_10_01', title: 'Worksheet 1: Hindi (व्याकरण - पदबंध व समास)', subject: 'Hindi', date: 'Jan 2026', pages: 2, color: '#3A7BD5' },
        { id: 'WS_CBSE_10_02', title: 'Worksheet 2: Hindi (काव्य खंड - साखी व पद)', subject: 'Hindi', date: 'Feb 2026', pages: 3, color: '#2BA899' },
        { id: 'WS_CBSE_10_03', title: 'Worksheet 3: Hindi (गद्य खंड - बड़े भाई साहब)', subject: 'Hindi', date: 'Mar 2026', pages: 2, color: '#9B59B6' },
        { id: 'WS_CBSE_10_04', title: 'Worksheet 4: Hindi (रचनात्मक लेखन)',         subject: 'Hindi', date: 'Apr 2026', pages: 2, color: '#E05555' },
      ],
      9: [], 8: [], 7: [], 6: []
    },
    ICSE: {
      10: [
        { id: 'WS_ICSE_10_01', title: 'Worksheet 1: ICSE Hindi (एकांकी संचय)',      subject: 'Hindi', date: 'Jan 2026', pages: 3, color: '#3A7BD5' },
        { id: 'WS_ICSE_10_02', title: 'Worksheet 2: ICSE Hindi (व्याकरण व निबंध)',  subject: 'Hindi', date: 'Mar 2026', pages: 2, color: '#2BA899' },
      ],
      9: [], 8: [], 7: [], 6: []
    }
  },
  MockExam: {
    CBSE: {
      10: [
        { id: 'MOCK_CBSE_10_01', title: 'Mock Exam 1: Hindi Course B (Full Paper 1)', subject: 'Hindi', date: 'Nov 2025', pages: 8, color: '#3A7BD5' },
        { id: 'MOCK_CBSE_10_02', title: 'Mock Exam 2: Hindi Course B (Full Paper 2)', subject: 'Hindi', date: 'Dec 2025', pages: 7, color: '#2BA899' },
        { id: 'MOCK_CBSE_10_03', title: 'Mock Exam 3: Hindi Sample Paper 2026',      subject: 'Hindi', date: 'Jan 2026', pages: 6, color: '#9B59B6' },
      ],
      9: [], 8: [], 7: [], 6: []
    },
    ICSE: {
      10: [
        { id: 'MOCK_ICSE_10_01', title: 'Mock Exam 1: ICSE Hindi (Full Paper)',     subject: 'Hindi', date: 'Dec 2025', pages: 7, color: '#3A7BD5' },
      ],
      9: [], 8: [], 7: [], 6: []
    }
  }
};`;

scriptJs = scriptJs.replace(/const TEST_DATA = \{[\s\S]*?\n\};/, NEW_TEST_DATA);
fs.writeFileSync('public/script.js', scriptJs, 'utf8');
console.log('✅ Updated TEST_DATA in script.js to Class 10 Hindi papers only');


// ─── 3. UPDATE FOOTER IN INDEX.HTML (BOARDS & SUBJECTS) ───────────────────
let indexHtml = fs.readFileSync('public/index.html', 'utf8');

const NEW_FOOTER_BOARDS = `<h4 class="footer-heading">Boards &amp; Subjects</h4>
      <ul class="footer-links">
        <li><a href="#school-boards">CBSE Class 10</a></li>
        <li><a href="#school-boards">ICSE Class 10</a></li>
        <li><a href="#school-boards">Class 10 Hindi</a></li>
      </ul>`;

indexHtml = indexHtml.replace(/<h4 class="footer-heading">Boards<\/h4>[\s\S]*?<\/ul>/, NEW_FOOTER_BOARDS);

fs.writeFileSync('public/index.html', indexHtml, 'utf8');
console.log('✅ Updated Footer links in index.html to Class 10 Hindi only');

// ─── 4. FIX COOKIES IN SERVER.JS FOR AUTH ─────────────────────────────────
let serverJs = fs.readFileSync('server.js', 'utf8');
serverJs = serverJs.replace(
  /sameSite:\s*process\.env\.NODE_ENV === 'production' \? 'none' : 'lax'/g,
  "sameSite: 'lax'"
);
serverJs = serverJs.replace(
  /secure:\s*process\.env\.NODE_ENV === 'production'/g,
  "secure: process.env.NODE_ENV === 'production'"
);
fs.writeFileSync('server.js', serverJs, 'utf8');
console.log('✅ Updated Cookie options in server.js for seamless Vercel login authentication');

console.log('\n🎉 ALL REQUESTED FIXES APPLIED SUCCESSFULLY!');
