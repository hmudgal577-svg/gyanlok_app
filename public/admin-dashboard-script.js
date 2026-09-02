// Backend URL (Render)
// Auto-detect backend URL: relative on localhost, Render URL in production
const API_BASE = '';

let currentAdmin = null;

document.addEventListener('DOMContentLoaded', () => {
  // First step: Verify admin is authenticated
  checkAuth();
  initSidebarMenu();
  initUploadForms();
  initLogout();
  updateDate();
});

// Update the header date display
function updateDate() {
  const dateEl = document.getElementById('date-display');
  if (dateEl) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString('en-US', options);
  }
}

// ----------------------------------------------------
// Authentication logic
// ----------------------------------------------------

async function checkAuth() {
  try {
    const res = await fetch(`${API_BASE}/api/admin/me`, { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      currentAdmin = data.user;
      showDashboard();
    } else {
      redirectToLogin();
    }
  } catch (err) {
    console.error('Auth check failed:', err);
    redirectToLogin();
  }
}

function redirectToLogin() {
  window.location.href = '/admin.html';
}

function showDashboard() {
  document.getElementById('admin-email-display').textContent = currentAdmin.email;
  // Load stats, doubts and requests
  loadOverviewStats();
  loadStudentChats();
  loadMentorRequests();
  loadSubmissions();

  // Auto-poll student doubts every 10 seconds for real-time mentor alerts
  setInterval(() => {
    loadOverviewStats();
    const activePanel = document.querySelector('.panel-section.active');
    if (activePanel && activePanel.id === 'panel-student-doubts') {
      loadStudentChats();
    }
  }, 10000);
}

function initLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await fetch(`${API_BASE}/api/admin/logout`, { method: 'POST', credentials: 'include' });
      } catch (err) {
        console.error('Logout failed:', err);
      }
      redirectToLogin();
    });
  }
}

// ----------------------------------------------------
// Navigation / Sidebar menu toggles
// ----------------------------------------------------

function initSidebarMenu() {
  const menuButtons   = document.querySelectorAll('.menu-item');
  const panelSections = document.querySelectorAll('.panel-section');
  const panelTitle   = document.getElementById('panel-title');

  menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      menuButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      panelSections.forEach(panel => {
        panel.classList.toggle('active', panel.id === target);
      });
      panelTitle.textContent = btn.innerText.trim();
      if (target === 'panel-overview')            loadOverviewStats();
      else if (target === 'panel-student-doubts') loadStudentChats();
      else if (target === 'panel-mentor')         loadMentorRequests();
      else if (target === 'panel-submissions')    loadSubmissions();
      else if (target === 'panel-content-editor') ceLoadKeys();
    });
  });
}

// ----------------------------------------------------
// Data Loading Operations
// ----------------------------------------------------

async function loadOverviewStats() {
  try {
    const [requestsRes, submissionsRes, notificationsRes, chatsRes] = await Promise.all([
      fetch(`${API_BASE}/api/admin/mentor-requests`,  { credentials: 'include' }),
      fetch(`${API_BASE}/api/admin/submissions`,       { credentials: 'include' }),
      fetch(`${API_BASE}/api/admin/notifications`,     { credentials: 'include' }),
      fetch(`${API_BASE}/api/admin/student-chats`,      { credentials: 'include' }),
    ]);

    if (requestsRes.ok && submissionsRes.ok && notificationsRes.ok) {
      const requests      = await requestsRes.json();
      const submissions   = await submissionsRes.json();
      const notifications = await notificationsRes.json();
      const chatsData     = chatsRes && chatsRes.ok ? await chatsRes.json() : { chats: [] };
      const chats         = chatsData.chats || [];

      document.getElementById('stat-requests').textContent    = requests.length;
      document.getElementById('stat-submissions').textContent = submissions.length;
      document.getElementById('stat-alerts').textContent      = notifications.length;

      const statDoubts = document.getElementById('stat-doubts');
      if (statDoubts) statDoubts.textContent = chats.length;

      // Pending doubts badge
      const pendingDoubts = chats.filter(c => !c.reply || c.status === 'pending').length;
      const badgeDoubts = document.getElementById('badge-doubts');
      if (badgeDoubts) {
        if (pendingDoubts > 0) {
          badgeDoubts.textContent = pendingDoubts;
          badgeDoubts.hidden = false;
        } else {
          badgeDoubts.hidden = true;
        }
      }

      const mentorBadge = document.getElementById('badge-mentor');
      if (requests.length > 0) { mentorBadge.textContent = requests.length; mentorBadge.hidden = false; }
      else { mentorBadge.hidden = true; }

      const submissionBadge = document.getElementById('badge-submissions');
      const pending = submissions.filter(s => s.status === 'Pending').length;
      if (pending > 0) { submissionBadge.textContent = pending; submissionBadge.hidden = false; }
      else { submissionBadge.hidden = true; }

      populateRecentRequests(requests);
    }
  } catch (err) {
    console.error('Failed to load dashboard statistics:', err);
  }
}

function populateRecentRequests(requests) {
  const container = document.getElementById('recent-requests-body');
  if (!container) return;
  if (requests.length === 0) {
    container.innerHTML = `<tr><td colspan="4" class="no-data">No recent requests.</td></tr>`;
    return;
  }
  const recent = requests.slice(0, 5);
  container.innerHTML = recent.map(req => `
    <tr>
      <td><strong>${escapeHTML(req.name)}</strong><br/><span style="font-size:0.75rem;color:var(--text-muted)">${escapeHTML(req.email_or_phone)}</span></td>
      <td>Class ${escapeHTML(req.student_class)}</td>
      <td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHTML(req.message)}">${escapeHTML(req.message)}</td>
      <td>${new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
    </tr>
  `).join('');
}

// ----------------------------------------------------
// Student Doubts & Live Mentor Chat Management
// ----------------------------------------------------

let allStudentChats = [];
let currentDoubtsFilter = 'all';

async function loadStudentChats(showToastNotice = false) {
  const container = document.getElementById('student-doubts-list');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/api/admin/student-chats`, { credentials: 'include' });
    if (!res.ok) throw new Error();
    const data = await res.json();
    allStudentChats = data.chats || [];

    // Counts
    const total = allStudentChats.length;
    const pending = allStudentChats.filter(c => !c.reply || c.status === 'pending').length;
    const replied = total - pending;

    const elAll = document.getElementById('count-doubts-all');
    const elPending = document.getElementById('count-doubts-pending');
    const elReplied = document.getElementById('count-doubts-replied');
    if (elAll) elAll.textContent = total;
    if (elPending) elPending.textContent = pending;
    if (elReplied) elReplied.textContent = replied;

    const statDoubts = document.getElementById('stat-doubts');
    if (statDoubts) statDoubts.textContent = total;

    const badgeDoubts = document.getElementById('badge-doubts');
    if (badgeDoubts) {
      if (pending > 0) {
        badgeDoubts.textContent = pending;
        badgeDoubts.hidden = false;
      } else {
        badgeDoubts.hidden = true;
      }
    }

    renderStudentChatsList();
    if (showToastNotice && typeof showAdminToast === 'function') {
      showAdminToast('Student doubts refreshed!');
    }
  } catch (err) {
    console.error('Failed to load student doubts:', err);
    if (container) container.innerHTML = `<div class="no-data" style="color:red">Failed to load student doubts. Please retry.</div>`;
  }
}

function setDoubtsFilter(filter) {
  currentDoubtsFilter = filter;
  document.querySelectorAll('.doubts-filter-bar .btn-filter').forEach(btn => {
    btn.classList.toggle('active', btn.id === `filter-doubts-${filter}`);
  });
  renderStudentChatsList();
}

function renderStudentChatsList() {
  const container = document.getElementById('student-doubts-list');
  if (!container) return;

  let filtered = allStudentChats;
  if (currentDoubtsFilter === 'pending') {
    filtered = allStudentChats.filter(c => !c.reply || c.status === 'pending');
  } else if (currentDoubtsFilter === 'replied') {
    filtered = allStudentChats.filter(c => c.reply && c.status === 'replied');
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div class="no-data" style="padding:2.5rem;text-align:center;color:var(--text-muted);">No student doubts found for "${currentDoubtsFilter}" filter.</div>`;
    return;
  }

  container.innerHTML = filtered.map(chat => {
    const isAnswered = Boolean(chat.reply && chat.status === 'replied');
    const createdDate = new Date(chat.created_at).toLocaleString();
    const replyDate = chat.replied_at ? new Date(chat.replied_at).toLocaleString() : '';

    return `
      <div class="doubt-card ${isAnswered ? 'answered' : 'pending'}" id="doubt-card-${chat.id}">
        <div class="doubt-header">
          <div class="student-info-chip">
            <div class="student-avatar">${(chat.student_name || 'S')[0].toUpperCase()}</div>
            <div>
              <strong>${escapeHTML(chat.student_name || 'Student')}</strong>
              <span class="student-meta">Class ${escapeHTML(chat.student_class || '10')} • ${escapeHTML(chat.student_email || 'No email')}</span>
            </div>
          </div>
          <div class="doubt-status-tag ${isAnswered ? 'answered' : 'pending'}">
            ${isAnswered ? '✓ Answered' : '⏳ Pending Reply'}
          </div>
        </div>

        <div class="doubt-question-box">
          <div class="doubt-label">❓ Student Question / Doubt:</div>
          <div class="doubt-text">${escapeHTML(chat.message)}</div>
          <div class="doubt-time">${createdDate}</div>
        </div>

        ${isAnswered ? `
          <div class="doubt-answer-box">
            <div class="answer-header">
              <span>🎓 <strong>Your Reply (Mentor)</strong></span>
              <span class="reply-time">${replyDate}</span>
            </div>
            <div class="answer-text">${escapeHTML(chat.reply)}</div>
            <button class="btn-edit-reply" onclick="toggleEditReply('${chat.id}')">✏️ Edit Answer</button>
          </div>
        ` : ''}

        <div class="doubt-reply-form ${isAnswered ? 'hidden-form' : ''}" id="reply-form-${chat.id}">
          <label for="reply-input-${chat.id}" class="reply-form-label">
            ${isAnswered ? 'Update Your Answer:' : '✍️ Write Your Answer / Solution for Student:'}
          </label>
          <textarea id="reply-input-${chat.id}" class="admin-reply-textarea" rows="3" placeholder="Type clear, helpful explanation or answer for ${escapeHTML(chat.student_name || 'the student')}...">${isAnswered ? escapeHTML(chat.reply) : ''}</textarea>
          <div class="reply-actions">
            <button class="btn btn-primary" onclick="submitAdminReply('${chat.id}')" id="btn-submit-${chat.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              ${isAnswered ? 'Update Answer' : 'Send Answer to Student'}
            </button>
            ${isAnswered ? `<button class="btn btn-secondary" onclick="toggleEditReply('${chat.id}')" style="margin-left:8px;">Cancel</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleEditReply(chatId) {
  const form = document.getElementById(`reply-form-${chatId}`);
  if (form) {
    form.classList.toggle('hidden-form');
  }
}

async function submitAdminReply(chatId) {
  const textarea = document.getElementById(`reply-input-${chatId}`);
  const btn = document.getElementById(`btn-submit-${chatId}`);
  if (!textarea || !btn) return;

  const replyText = textarea.value.trim();
  if (!replyText) {
    alert('Please enter an answer before sending.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    const res = await fetch(`${API_BASE}/api/admin/student-chat-reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ chatId, replyText })
    });
    const data = await res.json();
    if (res.ok) {
      if (typeof showAdminToast === 'function') {
        showAdminToast('✓ Answer sent to student dashboard successfully!');
      }
      await loadStudentChats();
    } else {
      alert(data.error || 'Failed to send answer.');
      btn.disabled = false;
      btn.textContent = 'Send Answer to Student';
    }
  } catch (err) {
    console.error('Reply submit error:', err);
    alert('Network error. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Send Answer to Student';
  }
}

window.setDoubtsFilter = setDoubtsFilter;
window.loadStudentChats = loadStudentChats;
window.toggleEditReply = toggleEditReply;
window.submitAdminReply = submitAdminReply;

async function loadMentorRequests() {
  const container = document.getElementById('mentor-requests-table-body');
  if (!container) return;
  try {
    const res = await fetch(`${API_BASE}/api/admin/mentor-requests`, { credentials: 'include' });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data.length === 0) {
      container.innerHTML = `<tr><td colspan="5" class="no-data">No mentor requests found.</td></tr>`;
      return;
    }
    container.innerHTML = data.map(req => `
      <tr>
        <td><strong>${escapeHTML(req.name)}</strong></td>
        <td>${escapeHTML(req.email_or_phone)}</td>
        <td>Class ${escapeHTML(req.student_class)}</td>
        <td style="white-space:pre-wrap;max-width:400px;">${escapeHTML(req.message)}</td>
        <td>${new Date(req.created_at).toLocaleString()}</td>
      </tr>
    `).join('');
  } catch (err) {
    container.innerHTML = `<tr><td colspan="5" class="no-data" style="color:red">Failed to load requests.</td></tr>`;
  }
}

async function loadSubmissions() {
  const container = document.getElementById('submissions-table-body');
  if (!container) return;
  try {
    const res = await fetch(`${API_BASE}/api/admin/submissions`, { credentials: 'include' });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data.length === 0) {
      container.innerHTML = `<tr><td colspan="6" class="no-data">No student submissions found.</td></tr>`;
      return;
    }
    container.innerHTML = data.map(sub => `
      <tr>
        <td><strong>${escapeHTML(sub.student_name)}</strong></td>
        <td>${escapeHTML(sub.resource_title)}<br/><span style="font-size:0.75rem;color:var(--text-muted)">ID: ${escapeHTML(sub.resource_id)}</span></td>
        <td><span style="text-transform:capitalize;">${escapeHTML(sub.resource_type)}</span></td>
        <td>
          <a href="${sub.file_path}" target="_blank" class="action-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ${escapeHTML(sub.file_name)}
          </a>
        </td>
        <td>${new Date(sub.created_at).toLocaleString()}</td>
        <td><span class="status-pill ${sub.status.toLowerCase()}">${escapeHTML(sub.status)}</span></td>
      </tr>
    `).join('');
  } catch (err) {
    container.innerHTML = `<tr><td colspan="6" class="no-data" style="color:red">Failed to load student submissions.</td></tr>`;
  }
}

// ----------------------------------------------------
// Resource Form Submissions
// ----------------------------------------------------

function initUploadForms() {
  const testForm   = document.getElementById('upload-test-form');
  const testSubmit = document.getElementById('test-submit-btn');
  const testStatus = document.getElementById('test-form-status');

  if (testForm) {
    testForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      testStatus.className = 'form-status';
      testStatus.textContent = 'Uploading...';
      testSubmit.disabled = true;
      const formData = new FormData(testForm);
      try {
        const res = await fetch(`${API_BASE}/api/admin/upload-test-sheet`, {
          method: 'POST', credentials: 'include', body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          testStatus.className = 'form-status success';
          testStatus.textContent = '✓ Test sheet added successfully!';
          testForm.reset();
        } else {
          testStatus.className = 'form-status error';
          testStatus.textContent = data.error || 'Failed to upload test sheet.';
        }
      } catch (err) {
        testStatus.className = 'form-status error';
        testStatus.textContent = 'Network connection failed.';
      } finally {
        testSubmit.disabled = false;
      }
    });
  }

  const chForm   = document.getElementById('upload-chapter-form');
  const chSubmit = document.getElementById('ch-submit-btn');
  const chStatus = document.getElementById('ch-form-status');

  if (chForm) {
    chForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      chStatus.className = 'form-status';
      chStatus.textContent = 'Uploading...';
      chSubmit.disabled = true;
      const formData = new FormData(chForm);
      try {
        const res = await fetch(`${API_BASE}/api/admin/upload-chapter-resource`, {
          method: 'POST', credentials: 'include', body: formData,
        });
        const data = await res.json();
        if (res.ok) {
          chStatus.className = 'form-status success';
          chStatus.textContent = '✓ Material added successfully!';
          chForm.reset();
        } else {
          chStatus.className = 'form-status error';
          chStatus.textContent = data.error || 'Failed to add chapter resource.';
        }
      } catch (err) {
        chStatus.className = 'form-status error';
        chStatus.textContent = 'Network connection failed.';
      } finally {
        chSubmit.disabled = false;
      }
    });
  }
}

// Helper sanitization for HTML rendering
function escapeHTML(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Toast notification
function showAdminToast(message) {
  const old = document.getElementById('admin-toast');
  if (old) old.remove();
  const toast = document.createElement('div');
  toast.id = 'admin-toast';
  Object.assign(toast.style, {
    position: 'fixed', bottom: '2rem', left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: '#1A2740', color: 'white',
    padding: '.7rem 1.4rem', borderRadius: '100px',
    fontSize: '.86rem', fontWeight: '500',
    boxShadow: '0 8px 24px rgba(0,0,0,.22)', zIndex: '9999',
    opacity: '0', transition: 'opacity .3s ease, transform .3s ease',
  });
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)'; });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER CONTENT EDITOR
// ─────────────────────────────────────────────────────────────────────────────

const CHAPTER_KEY_LABELS = {
  cbse_10_hindi_kabir:      'Kabir ke Dohe (Sparsh Ch.1)',
  cbse_10_hindi_meera:      'Meera ke Pad (Sparsh Ch.2)',
  cbse_10_hindi_bihari:     'Bihari ke Dohe (Sparsh Ch.3)',
  cbse_10_hindi_manushyata: 'Manushyata (Sparsh Ch.4)',
  cbse_10_hindi_pavas:      'Parvat Pradesh mein Paavas (Sparsh Ch.5)',
  cbse_10_hindi_deepak:     'Madhur Madhur mere Deepak Jal (Sparsh Ch.6)',
  cbse_10_hindi_top:        'Top / Toop (Sparsh Ch.7)',
  cbse_10_hindi_fida:       'Kar Chale Hum Fida (Sparsh Ch.8)',
  cbse_10_hindi_aatmtran:   'Aatmtran (Sparsh Ch.9)',
  cbse_10_hindi_badebhai:   'Bade Bhai Sahab (Sparsh Ch.10)',
  cbse_10_hindi_diary:      'Diary ka ek Panna (Sparsh Ch.11)',
  cbse_10_hindi_tantara:    'Tantara-Vamiro Katha (Sparsh Ch.12)',
  cbse_10_hindi_shailendra: 'Teesri Kasam ke Shilpkar Shailendra (Sparsh Ch.13)',
  cbse_10_hindi_girgit:     'Girgit (Sparsh Ch.14)',
  cbse_10_hindi_harihar:    'Harihar Kaka (Sanchayan Ch.1)',
  cbse_10_hindi_sapno:      'Sapno ke se Din (Sanchayan Ch.2)',
  cbse_10_hindi_topi:       'Topi Shukla (Sanchayan Ch.3)',
};

async function ceLoadKeys() {
  const sel = document.getElementById('ce-key-select');
  if (!sel) return;
  // Already loaded
  if (sel.options.length > 1) return;
  try {
    const res = await fetch('/api/admin/chapter-content', { credentials: 'include' });
    if (!res.ok) throw new Error('Auth failed');
    const data = await res.json();
    sel.innerHTML = '';
    (data.keys || []).forEach(key => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = CHAPTER_KEY_LABELS[key] || key;
      sel.appendChild(opt);
    });
  } catch (err) {
    sel.innerHTML = '<option value="">-- Error loading keys --</option>';
    console.error('ceLoadKeys error:', err);
  }
}

async function ceLoadContent() {
  const key      = document.getElementById('ce-key-select').value;
  const category = document.getElementById('ce-category').value;
  const status   = document.getElementById('ce-load-status');
  const textarea = document.getElementById('ce-html-input');

  if (!key) { status.textContent = '⚠️ Chapter select karo pehle.'; status.className = 'form-status error'; return; }

  status.textContent = 'Loading...';
  status.className = 'form-status';

  try {
    const res = await fetch(`/api/admin/chapter-content?key=${encodeURIComponent(key)}&category=${encodeURIComponent(category)}`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    textarea.value = data.html || '';
    document.getElementById('ce-char-count').textContent = textarea.value.length + ' chars';
    status.textContent = '✓ Content loaded!';
    status.className = 'form-status success';
    // Hide preview when loading new content
    document.getElementById('ce-preview').style.display = 'none';
    setTimeout(() => { status.textContent = ''; }, 3000);
  } catch (err) {
    status.textContent = '✗ Load failed: ' + err.message;
    status.className = 'form-status error';
  }
}

async function ceSaveContent() {
  const key      = document.getElementById('ce-key-select').value;
  const category = document.getElementById('ce-category').value;
  const html     = document.getElementById('ce-html-input').value;
  const status   = document.getElementById('ce-save-status');
  const btn      = document.getElementById('ce-save-btn');

  if (!key) { status.textContent = '⚠️ Chapter select karo pehle.'; status.className = 'form-status error'; return; }
  if (!html.trim()) { status.textContent = '⚠️ Content empty hai.'; status.className = 'form-status error'; return; }

  btn.disabled = true;
  status.textContent = 'Saving...';
  status.className = 'form-status';

  try {
    const res = await fetch('/api/admin/chapter-content', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, category, html })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      status.textContent = '✓ Saved successfully!';
      status.className = 'form-status success';
      showAdminToast('✓ Content saved: ' + (CHAPTER_KEY_LABELS[key] || key) + ' → ' + category);
    } else {
      throw new Error(data.error || 'Save failed');
    }
  } catch (err) {
    status.textContent = '✗ Error: ' + err.message;
    status.className = 'form-status error';
  } finally {
    btn.disabled = false;
    setTimeout(() => { status.textContent = ''; }, 4000);
  }
}

function ceTogglePreview() {
  const preview  = document.getElementById('ce-preview');
  const textarea = document.getElementById('ce-html-input');
  if (preview.style.display === 'none') {
    preview.innerHTML = textarea.value || '<p style="color:#aaa;">No content to preview</p>';
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }
}

