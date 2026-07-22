const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public', 'script.js');
let src = fs.readFileSync(file, 'utf8');

// ── 1. Replace renderChapter ────────────────────────────────────────────
const OLD_RENDER = `function renderChapter(book, ch) {
  const chId = \`ch-\${book.name.replace(/\\\\s/g,'-')}-\${ch.num}\`;
  const safeBook = book.name.replace(/'/g,"\\\\'");
  const safeTitle = ch.title.replace(/'/g,"\\\\'");
  const safeUrl = (ch.file_url || '').replace(/'/g,"\\\\'");
  return \`
    <div class="chapter-item" id="\${chId}">
      <div class="chapter-header" role="button" tabindex="0" aria-expanded="false"
           onclick="openRightContent('\${safeBook}',\${ch.num},'\${safeTitle}','summary')">
        <div class="ch-num">\${ch.num}</div>
        <div class="ch-title">\${ch.title}</div>
        <div class="ch-toggle" style="font-size:.8rem;color:var(--accent);font-weight:600;">\u092a\u0922\u093c\u0947\u0902 &rarr;</div>
      </div>
    </div>\`;
}`;

const NEW_RENDER = `
/* ── Builds a shareable URL for the full-screen reader ── */
function buildReaderUrl(bookName, chNum, chTitle, cat) {
  const p = new URLSearchParams({ book: bookName, ch: chNum, title: chTitle, cat: cat });
  return '/?' + p.toString();
}

/* ── Toggle accordion dropdown for a chapter ── */
function toggleChapterDropdown(chId) {
  const drop   = document.getElementById('drop-' + chId);
  const header = document.querySelector('#' + chId + ' .chapter-header');
  if (!drop) return;
  const isOpen = !drop.hidden;
  document.querySelectorAll('.ch-dropdown').forEach(d => { d.hidden = true; });
  document.querySelectorAll('.chapter-header').forEach(h => h.classList.remove('ch-open'));
  if (!isOpen) {
    drop.hidden = false;
    if (header) header.classList.add('ch-open');
  }
}

function renderChapter(book, ch) {
  const chId     = \`ch-\${book.name.replace(/\\s/g,'-')}-\${ch.num}\`;
  const safeBook = book.name.replace(/'/g,"\\\\'");
  const safeTitle= ch.title.replace(/'/g,"\\\\'");

  const opts = [
    { icon:'\u{1F4DD}', label:'\u092a\u093e\u0920 \u0938\u093e\u0930\u093e\u0902\u0936',    sub:'Summary',          cat:'summary'   },
    { icon:'\u2753',     label:'\u0928\u094b\u091f\u094d\u0938',         sub:'Notes',            cat:'notes'     },
    { icon:'\u{1F4D6}', label:'\u092e\u0941\u0939\u093e\u0935\u0930\u0947',       sub:'Muhavre',          cat:'muhavre'   },
    { icon:'\u{1F550}', label:'PYQ',           sub:'\u092a\u093f\u091b\u0932\u0947 \u0935\u0930\u094d\u0937 \u092a\u094d\u0930\u0936\u094d\u0928', cat:'pyq'       },
    { icon:'\u2B50',    label:'\u0905\u092d\u094d\u092f\u093e\u0938 \u092a\u094d\u0930\u0936\u094d\u0928', sub:'Extra Practice',   cat:'additional'},
  ];

  const linksHtml = opts.map(o => {
    const url = buildReaderUrl(book.name, ch.num, ch.title, o.cat);
    return '<a class="ch-link-item" href="' + url + '" onclick="event.preventDefault();openRightContent(\\'' + safeBook + '\\',' + ch.num + ',\\'' + safeTitle + '\\',\\'' + o.cat + '\\')">'
      + '<span class="ch-li-icon">' + o.icon + '</span>'
      + '<span class="ch-li-label">' + o.label + '</span>'
      + '<span class="ch-li-sub">' + o.sub + '</span>'
      + '</a>';
  }).join('');

  return \`
    <div class="chapter-item" id="\${chId}">
      <div class="chapter-header" role="button" tabindex="0"
           onclick="toggleChapterDropdown('\${chId}')">
        <div class="ch-num">\${ch.num}</div>
        <div class="ch-title">\${ch.title}</div>
        <div class="ch-chevron">\u25be</div>
      </div>
      <div class="ch-dropdown" id="drop-\${chId}" hidden>\${linksHtml}</div>
    </div>\`;
}`;

// Find and replace
const idx = src.indexOf('function renderChapter(book, ch)');
if (idx === -1) {
  console.error('ERROR: renderChapter not found!');
  process.exit(1);
}

// Find end of function (closing brace after the template literal)
// Look for the closing }; pattern after the function start
let depth = 0, i = idx, inFunc = false;
for (; i < src.length; i++) {
  if (src[i] === '{') { depth++; inFunc = true; }
  if (src[i] === '}') { depth--; }
  if (inFunc && depth === 0) { i++; break; }
}
const oldFunc = src.slice(idx, i);
src = src.slice(0, idx) + NEW_RENDER + src.slice(i);
console.log('renderChapter replaced! Old length:', oldFunc.length, 'New length:', NEW_RENDER.length);

// ── 2. Add URL param check in DOMContentLoaded ────────────────────────
const URL_CHECK_FN = `
function checkReaderUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const cat   = params.get('cat');
  const book  = params.get('book');
  const ch    = parseInt(params.get('ch'), 10);
  const title = params.get('title');
  if (cat && book && ch && title) {
    setTimeout(() => openRightContent(book, ch, title, cat), 700);
  }
}`;

if (!src.includes('checkReaderUrlParams')) {
  // Insert after DOMContentLoaded block
  const domEnd = src.indexOf('initScrollTop();');
  if (domEnd !== -1) {
    const insertAt = src.indexOf('\n', domEnd) + 1;
    src = src.slice(0, insertAt) 
      + '  checkReaderUrlParams();\n'
      + src.slice(insertAt)
      + '\n' + URL_CHECK_FN;
    console.log('checkReaderUrlParams injected!');
  }
}

fs.writeFileSync(file, src, 'utf8');
console.log('Done! script.js updated.');
