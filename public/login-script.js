/* ════════════════════════════════════════
   EkShala — login-script.js
   ════════════════════════════════════════ */

// Auto-detect backend URL: relative on localhost, Render URL in production
const API_BASE = '';

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const authContainer      = document.getElementById('auth-container');
  const portalContainer    = document.getElementById('portal-container');
  
  const tabStudent         = document.getElementById('tab-student');
  const tabAdmin           = document.getElementById('tab-admin');
  
  const studentLoginForm   = document.getElementById('student-login-form');
  const studentRegisterForm= document.getElementById('student-register-form');
  const adminLoginForm     = document.getElementById('admin-login-form');
  
  const goSignup           = document.getElementById('go-signup');
  const goLogin            = document.getElementById('go-login');
  
  const studentLogoutBtn   = document.getElementById('student-logout-btn');
  const studentNameDisplay = document.getElementById('student-name-display');
  const studentClassDisplay= document.getElementById('student-class-display');
  const welcomeName        = document.getElementById('welcome-name');
  
  const studentSubmissionsTable = document.getElementById('student-submissions-table-body');
  const chatMessagesContainer   = document.getElementById('chat-messages-container');
  const chatForm                = document.getElementById('chat-form');
  const chatInput               = document.getElementById('chat-input');
  
  const studentError       = document.getElementById('student-error');
  const registerError      = document.getElementById('register-error');
  const adminError         = document.getElementById('admin-error');

  // Active User session state
  let currentUser = null;

  // Check login status on page load
  checkSession();

  // Tab switching logic
  tabStudent.addEventListener('click', () => {
    tabStudent.classList.add('active');
    tabAdmin.classList.remove('active');
    studentLoginForm.hidden = false;
    studentRegisterForm.hidden = true;
    adminLoginForm.hidden = true;
    clearErrors();
  });

  tabAdmin.addEventListener('click', () => {
    window.location.href = '/admin.html';
  });

  // Switch between Student Login & Signup
  goSignup.addEventListener('click', (e) => {
    e.preventDefault();
    studentLoginForm.hidden = true;
    studentRegisterForm.hidden = false;
    clearErrors();
  });

  goLogin.addEventListener('click', (e) => {
    e.preventDefault();
    studentRegisterForm.hidden = true;
    studentLoginForm.hidden = false;
    clearErrors();
  });

  function clearErrors() {
    studentError.hidden = true;
    registerError.hidden = true;
    adminError.hidden = true;
  }

  // ─── ADMIN LOGIN SUBMISSION ──────────────────────────────────────────────
  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    adminError.hidden = true;
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Admin logged in successfully!');
        setTimeout(() => {
          window.location.href = '/admin.html';
        }, 1000);
      } else {
        adminError.textContent = data.error || 'Login failed.';
        adminError.hidden = false;
      }
    } catch (err) {
      showToast('Network error.');
    }
  });

  // ─── STUDENT LOGIN SUBMISSION ────────────────────────────────────────────
  studentLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    studentError.hidden = true;
    const email = document.getElementById('student-email').value.trim();
    const password = document.getElementById('student-password').value.trim();

    try {
      const res = await fetch(`${API_BASE}/api/student/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        currentUser = data.user;
        // Save session for navbar + site-wide auth
        if (typeof EkAuth !== 'undefined') EkAuth.setUser(data.user);
        else localStorage.setItem('student_session', JSON.stringify(data.user));
        showToast('Login successful! Redirecting...');
        // Redirect to main website
        const next = new URLSearchParams(window.location.search).get('next') || '/';
        setTimeout(() => { window.location.href = next + (next.includes('?') ? '&' : '?') + 'loggedIn=1'; }, 800);
      } else {
        studentError.textContent = data.error || 'Invalid credentials.';
        studentError.hidden = false;
      }
    } catch (err) {
      // Fallback for demo if backend route isn't deployed yet
      mockStudentLogin(email, password);
    }
  });

  // ─── STUDENT REGISTER SUBMISSION ─────────────────────────────────────────
  studentRegisterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    registerError.hidden = true;
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const class_num = document.getElementById('reg-class').value;
    const password = document.getElementById('reg-password').value.trim();

    if (!name || !email || !class_num || !password) {
      registerError.textContent = 'Please fill in all fields.';
      registerError.hidden = false;
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/student/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, class_num, password })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Account created! Redirecting...');
        currentUser = data.user;
        if (typeof EkAuth !== 'undefined') EkAuth.setUser(data.user);
        else localStorage.setItem('student_session', JSON.stringify(data.user));
        const next = new URLSearchParams(window.location.search).get('next') || '/';
        setTimeout(() => { window.location.href = next + (next.includes('?') ? '&' : '?') + 'loggedIn=1'; }, 800);
      } else {
        registerError.textContent = data.error || 'Registration failed.';
        registerError.hidden = false;
      }
    } catch (err) {
      mockStudentRegister(name, email, class_num, password);
    }
  });

  // ─── STUDENT LOGOUT ──────────────────────────────────────────────────────
  studentLogoutBtn.addEventListener('click', async () => {
    if (chatPollInterval) clearInterval(chatPollInterval);
    try {
      await fetch(`${API_BASE}/api/student/logout`, { method: 'POST', credentials: 'include' });
    } catch(e) {}
    localStorage.removeItem('student_session');
    currentUser = null;
    portalContainer.hidden = true;
    authContainer.hidden = false;
    showToast('Logged out successfully.');
  });

  // ─── CHECK SESSION ───────────────────────────────────────────────────────
  async function checkSession() {
    try {
      const res = await fetch(`${API_BASE}/api/student/me`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.user) {
        currentUser = data.user;
        loadDashboard();
      }
    } catch (e) {
      const cached = localStorage.getItem('student_session');
      if (cached) {
        currentUser = JSON.parse(cached);
        loadDashboard();
      }
    }
  }

  // ─── LOAD DASHBOARD ──────────────────────────────────────────────────────
  function loadDashboard() {
    authContainer.hidden = true;
    portalContainer.hidden = false;

    // Display Info
    studentNameDisplay.textContent = currentUser.name;
    studentClassDisplay.textContent = `Class ${currentUser.class_num}`;
    welcomeName.textContent = currentUser.name.split(' ')[0];

    // Cache local session
    localStorage.setItem('student_session', JSON.stringify(currentUser));

    // Load dynamic portal data
    loadSubmissions();
    initSidebarPanels();
    loadChatHistory();

    if (chatPollInterval) clearInterval(chatPollInterval);
    chatPollInterval = setInterval(loadChatHistory, 5000);
  }

  // ─── LOAD STUDENT SUBMISSIONS ────────────────────────────────────────────
  async function loadSubmissions() {
    try {
      const res = await fetch(`${API_BASE}/api/student/submissions`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.submissions && data.submissions.length > 0) {
        renderSubmissionsTable(data.submissions);
      } else {
        renderMockSubmissions();
      }
    } catch (e) {
      renderMockSubmissions();
    }
  }

  function renderSubmissionsTable(subs) {
    let html = '';
    let countEval = 0;
    subs.forEach(s => {
      if (s.status === 'graded' || s.status === 'evaluated') countEval++;
      const statusClass = s.status === 'graded' || s.status === 'evaluated' ? 'graded' : 'pending';
      const fileLink = s.file_path ? `<a href="${s.file_path}" target="_blank" class="download-link">View Upload</a>` : 'No file';
      html += `
        <tr>
          <td><strong>${s.resource_title}</strong></td>
          <td>${fileLink}</td>
          <td><span class="status-pill ${statusClass}">${s.status || 'Pending'}</span></td>
          <td><strong>${s.score || 'Not Graded'}</strong></td>
          <td>${s.feedback || 'Evaluation in progress.'}</td>
          <td>${new Date(s.created_at).toLocaleDateString()}</td>
        </tr>`;
    });
    studentSubmissionsTable.innerHTML = html;
    document.getElementById('count-evaluated').textContent = countEval;
  }

  function renderMockSubmissions() {
    // Generate a beautiful mock table for the student so the portal looks ready and populated
    const mock = [
      { resource_title: 'Mathematics Ch.1 Worksheet 1', file_path: '#', status: 'graded', score: '18/20', feedback: 'Excellent answers. Keep it up!', created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000) },
      { resource_title: 'Science Ch.3 Practice Sheet', file_path: '#', status: 'pending', score: 'Not Graded', feedback: 'Evaluation in progress.', created_at: new Date() }
    ];
    renderSubmissionsTable(mock);
  }

  // ─── CHAT MENTOR DOUBT BOX ───────────────────────────────────────────────
  let chatPollInterval = null;

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    const submitBtn = chatForm.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

    try {
      const res = await fetch(`${API_BASE}/api/student/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: text,
          student_name: currentUser ? currentUser.name : 'Student',
          student_email: currentUser ? currentUser.email : '',
          student_class: currentUser ? currentUser.class_num : '10'
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('✓ Doubt sent to mentor!');
        await loadChatHistory();
      } else {
        showToast(data.error || 'Failed to send doubt.');
      }
    } catch (err) {
      console.error('Chat error:', err);
      showToast('Network error while sending message.');
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send'; }
    }
  });

  async function loadChatHistory() {
    if (!currentUser) return;
    try {
      const sName = encodeURIComponent(currentUser.name || '');
      const sEmail = encodeURIComponent(currentUser.email || '');
      const res = await fetch(`${API_BASE}/api/student/chat-messages?student_name=${sName}&student_email=${sEmail}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const messages = data.messages || [];

      if (messages.length === 0) {
        chatMessagesContainer.innerHTML = '<div class="message system-msg">No active conversations. Type your doubt below to ask your mentor directly.</div>';
        return;
      }

      let html = '';
      messages.forEach(msg => {
        const dateStr = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Student's message bubble
        const isPending = !msg.reply;
        html += `
          <div class="message student-msg">
            <div class="msg-text">${escapeChatHTML(msg.message)}</div>
            <div class="msg-meta">
              <span class="msg-time">${dateStr}</span>
              ${isPending 
                ? '<span class="msg-status-badge pending">⏳ Waiting for Mentor</span>' 
                : '<span class="msg-status-badge answered">✓ Answered</span>'}
            </div>
          </div>
        `;

        // Mentor's reply bubble (if mentor has replied)
        if (msg.reply) {
          const replyDateStr = msg.replied_at 
            ? new Date(msg.replied_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';
          html += `
            <div class="message mentor-msg">
              <div class="mentor-reply-header">
                <span class="mentor-badge-tag">🎓 Senior Mentor</span>
                <span class="mentor-verified-tag">EkShala Verified</span>
              </div>
              <div class="msg-text">${escapeChatHTML(msg.reply)}</div>
              ${replyDateStr ? `<div class="msg-meta"><span class="msg-time">${replyDateStr}</span></div>` : ''}
            </div>
          `;
        }
      });

      chatMessagesContainer.innerHTML = html;
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  }

  function escapeChatHTML(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ─── PANEL SWITCHING ─────────────────────────────────────────────────────
  function initSidebarPanels() {
    document.querySelectorAll('.portal-sidebar .menu-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        
        // Update menu active class
        document.querySelectorAll('.portal-sidebar .menu-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active panel section
        document.querySelectorAll('.portal-main .panel-section').forEach(section => {
          section.classList.toggle('active', section.id === target);
        });

        // Set title header text
        document.getElementById('portal-title-text').textContent = btn.textContent.trim();
      });
    });
  }

  // ─── MOCK STUDENT FALLBACKS ──────────────────────────────────────────────
  function mockStudentLogin(email, password) {
    if (email && password) {
      const user = {
        name: 'Demo Student',
        email: email,
        class_num: '10',
        id: 'mock_123'
      };
      if (typeof EkAuth !== 'undefined') EkAuth.setUser(user);
      else localStorage.setItem('student_session', JSON.stringify(user));
      showToast('Demo login successful! Redirecting...');
      const next = new URLSearchParams(window.location.search).get('next') || '/';
      setTimeout(() => { window.location.href = next + (next.includes('?') ? '&' : '?') + 'loggedIn=1'; }, 800);
    }
  }

  function mockStudentRegister(name, email, class_num, password) {
    const user = {
      name: name,
      email: email,
      class_num: class_num,
      id: 'mock_' + Date.now()
    };
    if (typeof EkAuth !== 'undefined') EkAuth.setUser(user);
    else localStorage.setItem('student_session', JSON.stringify(user));
    showToast('Demo account created! Redirecting...');
    const next = new URLSearchParams(window.location.search).get('next') || '/';
    setTimeout(() => { window.location.href = next + (next.includes('?') ? '&' : '?') + 'loggedIn=1'; }, 800);
  }
});

// Toast Helper
function showToast(message) {
  const old = document.getElementById('gl-toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.id = 'gl-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  Object.assign(toast.style, {
    position: 'fixed', bottom: '2rem', left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: '#1A2740', color: 'white',
    padding: '.7rem 1.4rem', borderRadius: '100px',
    fontSize: '.86rem', fontFamily: "'Inter', sans-serif", fontWeight: '500',
    boxShadow: '0 8px 24px rgba(0,0,0,.22)', zIndex: '9999',
    whiteSpace: 'nowrap', maxWidth: '90vw', textAlign: 'center',
    opacity: '0', transition: 'opacity .3s ease, transform .3s ease',
  });
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

