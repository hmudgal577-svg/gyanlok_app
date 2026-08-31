const fs = require('fs');

let css = fs.readFileSync('public/style.css', 'utf8');

const DOCX_CSS = `

/* ─────────────────────────────────────────────────────────────────────────────
   DOCX RICH FORMATTED CONTENT STYLING (Preserves DOCX Layout, Colors & Typography)
───────────────────────────────────────────────────────────────────────────── */
.docx-styled-content {
  font-family: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 1rem;
  line-height: 1.85;
  color: var(--text-primary, #1E293B);
  padding: 1.5rem 1rem;
}

.docx-styled-content h1, 
.docx-styled-content h2, 
.docx-styled-content h3 {
  font-weight: 800;
  color: var(--text-primary, #0F172A);
  margin-top: 1.75rem;
  margin-bottom: 1rem;
  line-height: 1.35;
}

.docx-styled-content h1 {
  font-size: 1.65rem;
  border-bottom: 2px solid var(--accent-light, #E2E8F0);
  padding-bottom: 0.5rem;
  color: var(--accent, #3A7BD5);
}

.docx-styled-content h2 {
  font-size: 1.35rem;
  color: var(--accent, #3A7BD5);
  background: var(--accent-bg, #F1F5F9);
  padding: 0.6rem 1rem;
  border-radius: 10px;
  border-left: 4px solid var(--accent, #3A7BD5);
}

.docx-styled-content h3 {
  font-size: 1.15rem;
  color: #1E293B;
}

.docx-styled-content p {
  margin-bottom: 1.15rem;
  color: var(--text-secondary, #334155);
}

.docx-styled-content strong, 
.docx-styled-content b {
  font-weight: 700;
  color: var(--text-primary, #0F172A);
}

.docx-styled-content ul, 
.docx-styled-content ol {
  margin: 1rem 0 1.25rem 1.5rem;
  padding-left: 0.5rem;
}

.docx-styled-content li {
  margin-bottom: 0.5rem;
  line-height: 1.75;
}

.docx-styled-content table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 1.5rem 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border, #E2E8F0);
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.docx-styled-content th, 
.docx-styled-content td {
  padding: 0.85rem 1.1rem;
  border-bottom: 1px solid var(--border, #E2E8F0);
  text-align: left;
}

.docx-styled-content th {
  background: var(--accent-bg, #F1F5F9);
  font-weight: 700;
  color: var(--accent, #3A7BD5);
}

.docx-styled-content tr:last-child td {
  border-bottom: none;
}

.docx-styled-content tr:nth-child(even) td {
  background: rgba(248, 250, 252, 0.6);
}

.docx-styled-content blockquote {
  margin: 1.5rem 0;
  padding: 1rem 1.25rem;
  background: var(--accent-bg, #F8FAFC);
  border-left: 4px solid var(--accent, #3A7BD5);
  border-radius: 0 12px 12px 0;
  font-style: italic;
  color: var(--text-secondary, #475569);
}

.docx-styled-content .doc-header {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted, #64748B);
  border-bottom: 1px solid var(--border, #E2E8F0);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.docx-styled-content .doc-footer {
  font-size: 0.85rem;
  color: var(--text-muted, #64748B);
  border-top: 1px solid var(--border, #E2E8F0);
  padding-top: 0.5rem;
  margin-top: 2rem;
  text-align: center;
}
`;

if (!css.includes('.docx-styled-content')) {
  css += '\n' + DOCX_CSS;
  fs.writeFileSync('public/style.css', css, 'utf8');
  console.log('✅ Added rich DOCX content styling to public/style.css');
}
