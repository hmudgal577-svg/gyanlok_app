import sys, re

sys.stdout.reconfigure(encoding='utf-8')

with open('generate_seo_pages.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Update get_navbar
old_nav_snippet = """      <a href="/hindi-grammar/" class="nav-link {'active' if active_link=='grammar' else ''}">Hindi Grammar</a>"""
new_nav_snippet = """      <!-- Hindi Grammar dropdown -->
      <div class="nav-dropdown-wrapper">
        <button class="nav-link dropdown-trigger {'active' if active_link=='grammar' else ''}" aria-haspopup="true" aria-expanded="false" id="grammar-trigger">
          Hindi Grammar
          <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-dropdown-menu" id="grammar-dropdown" role="menu">
          <a href="/hindi-grammar/#board-panel-cbse" class="dropdown-item" role="menuitem">
            <span class="di-tag cbse">C</span> CBSE Grammar &amp; Writing Skills
          </a>
          <a href="/hindi-grammar/#board-panel-icse" class="dropdown-item" role="menuitem">
            <span class="di-tag icse">I</span> ICSE Grammar &amp; Composition
          </a>
          <a href="/hindi-grammar/muhavare/" class="dropdown-item" role="menuitem">
            <span class="di-tag" style="background:#FFF4E0; color:#E8900A;">M</span> मुहावरे (Muhavare)
          </a>
          <a href="/hindi-grammar/padbandh/" class="dropdown-item" role="menuitem">
            <span class="di-tag" style="background:#EBF3FD; color:#2563EB;">P</span> पदबंध (Padbandh)
          </a>
          <a href="/hindi-grammar/#cbse-topicpanel-samas" class="dropdown-item" role="menuitem">
            <span class="di-tag" style="background:#F0FDF4; color:#16A34A;">S</span> समास (Samas)
          </a>
          <a href="/hindi-grammar/#cbse-topicpanel-vakya" class="dropdown-item" role="menuitem">
            <span class="di-tag" style="background:#FEF3C7; color:#D97706;">V</span> रचना के आधार पर वाक्य
          </a>
          <a href="/hindi-grammar/#cbse-writing-box" class="dropdown-item" role="menuitem" style="border-top:1px solid var(--border); font-weight:600;">
            <span class="di-tag" style="background:#EFF6FF; color:#1D4ED8;">✍️</span> Writing Skills (अनुच्छेद, पत्र, ईमेल)
          </a>
        </div>
      </div>"""

if old_nav_snippet in code:
    code = code.replace(old_nav_snippet, new_nav_snippet)
    print('Updated navbar snippet successfully!')

with open('generate_seo_pages.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated generate_seo_pages.py successfully!')
