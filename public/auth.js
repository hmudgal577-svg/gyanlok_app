/* ════════════════════════════════════════
   EkShala — auth.js  (v1.0)
   Shared student session utility.
   Loaded on every page.
   ════════════════════════════════════════ */

const EkAuth = (() => {
  const KEY = 'student_session';

  function getUser() {
    try { return JSON.parse(localStorage.getItem(KEY)); }
    catch(e) { return null; }
  }

  function setUser(user) {
    localStorage.setItem(KEY, JSON.stringify(user));
  }

  function clearUser() {
    localStorage.removeItem(KEY);
  }

  async function fetchUser() {
    try {
      const r = await fetch('/api/student/me', { credentials: 'include' });
      if (r.ok) {
        const data = await r.json();
        if (data.user) { setUser(data.user); return data.user; }
      }
    } catch(e) {}
    return null;
  }

  async function isLoggedIn() {
    const cached = getUser();
    if (cached) return true;
    const u = await fetchUser();
    return !!u;
  }

  async function logout() {
    try { await fetch('/api/student/logout', { method: 'POST', credentials: 'include' }); } catch(e) {}
    clearUser();
  }

  return { getUser, setUser, clearUser, fetchUser, isLoggedIn, logout };
})();

/* ─── Navbar Profile Chip (runs on every page that has a navbar) ─── */
document.addEventListener('DOMContentLoaded', async () => {
  const loginBtn   = document.getElementById('nav-login-btn');
  const chip       = document.getElementById('nav-profile-chip');
  const avatarEl   = document.getElementById('nav-avatar-letter');
  const nameEl     = document.getElementById('nav-profile-name');
  const logoutBtn  = document.getElementById('nav-logout-btn');

  if (!loginBtn && !chip) return;

  let user = EkAuth.getUser();
  if (!user) user = await EkAuth.fetchUser();

  if (user) {
    _showProfile(user);
  } else {
    _showLogin();
  }

  function _showProfile(u) {
    if (loginBtn) loginBtn.hidden = true;
    if (chip) {
      chip.hidden = false;
      if (avatarEl) avatarEl.textContent = (u.name || 'S')[0].toUpperCase();
      if (nameEl)   nameEl.textContent   = u.name.split(' ')[0];
    }
  }

  function _showLogin() {
    if (loginBtn) loginBtn.hidden = false;
    if (chip)     chip.hidden = true;
  }

  if (chip) {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      chip.classList.toggle('open');
    });
    document.addEventListener('click', () => chip.classList.remove('open'));
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await EkAuth.logout();
      _showLogin();
      if (typeof showToast === 'function') showToast('Logged out successfully.');
    });
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('loggedIn') === '1' && user) {
    if (typeof showToast === 'function') {
      setTimeout(() => showToast(`Welcome back, ${user.name.split(' ')[0]}! 👋`), 400);
    }
    window.history.replaceState({}, '', window.location.pathname);
  }
});
