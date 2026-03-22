// ── LoanIt Shared Data & Utilities ──────────────────────────────────────────

// ── DEMO BANK DATA ──
const BANKS = [
  {
    id: 'sbi', name: 'State Bank of India', logo: '🏦',
    minRate: 8.15, maxRate: 11.15, maxAmount: 1500000,
    processingFee: 0, tenure: [12, 180],
    features: ['No collateral up to ₹7.5L', 'Subsidy under CSIS', 'Moratorium period available', 'Simple interest during study'],
    rating: 4.5, disbursalDays: 15, color: '#1a56db',
    type: 'PSB', tag: 'Most Popular'
  },
  {
    id: 'hdfc', name: 'HDFC Bank', logo: '🏛️',
    minRate: 9.50, maxRate: 13.25, maxAmount: 2000000,
    processingFee: 1.0, tenure: [12, 180],
    features: ['No collateral up to ₹10L', 'Fast 15-day approval', 'Doorstep service', '100% fee coverage'],
    rating: 4.3, disbursalDays: 10, color: '#0ea5e9',
    type: 'Private', tag: 'Fastest Approval'
  },
  {
    id: 'axis', name: 'Axis Bank', logo: '🏢',
    minRate: 13.70, maxRate: 15.20, maxAmount: 4000000,
    processingFee: 1.5, tenure: [12, 144],
    features: ['Up to ₹40L abroad', 'Forex card included', 'Online tracking', 'Pre-visa disbursement'],
    rating: 4.1, disbursalDays: 12, color: '#7c3aed',
    type: 'Private', tag: 'Best for Abroad'
  },
  {
    id: 'bob', name: 'Bank of Baroda', logo: '🏦',
    minRate: 8.35, maxRate: 10.85, maxAmount: 8000000,
    processingFee: 0, tenure: [12, 180],
    features: ['Baroda Scholar Scheme', 'Highest loan limit', 'Govt bank security', 'Interest subsidy'],
    rating: 4.2, disbursalDays: 20, color: '#f59e0b',
    type: 'PSB', tag: 'Highest Limit'
  },
  {
    id: 'union', name: 'Union Bank', logo: '🏛️',
    minRate: 8.05, maxRate: 10.65, maxAmount: 2000000,
    processingFee: 0, tenure: [12, 180],
    features: ['Lowest starting rate', 'Union Education Loan', 'Central scheme benefits', 'Flexible repayment'],
    rating: 4.0, disbursalDays: 18, color: '#10b981',
    type: 'PSB', tag: 'Lowest Rate'
  },
  {
    id: 'pnb', name: 'Punjab National Bank', logo: '🏦',
    minRate: 8.45, maxRate: 11.30, maxAmount: 1500000,
    processingFee: 0, tenure: [12, 180],
    features: ['PNB Udaan Scheme', 'SC/ST concessions', 'Girl student discount', 'Online application'],
    rating: 3.9, disbursalDays: 22, color: '#ef4444',
    type: 'PSB', tag: 'Great Schemes'
  }
];

const GOVT_SCHEMES = [
  { name: 'Central Sector Interest Subsidy (CSIS)', eligibility: 'Annual family income < ₹4.5L', benefit: '100% interest subsidy during moratorium', bank: 'All PSBs' },
  { name: 'Padho Pardesh Scheme', eligibility: 'Minority community students going abroad', benefit: 'Interest subsidy for overseas studies', bank: 'All Scheduled Banks' },
  { name: 'Dr. Ambedkar Interest Subsidy', eligibility: 'OBC/EBC students studying abroad', benefit: 'Full interest subsidy during course + 1 year', bank: 'All Scheduled Banks' },
];

// ── LOCALSTORAGE HELPERS ──
const DB = {
  get: (key) => { try { return JSON.parse(localStorage.getItem('loanit_' + key) || 'null'); } catch { return null; } },
  set: (key, val) => localStorage.setItem('loanit_' + key, JSON.stringify(val)),
  del: (key) => localStorage.removeItem('loanit_' + key),
};

// ── AUTH ──
function getCurrentUser() { return DB.get('user'); }
function isLoggedIn() { return !!getCurrentUser(); }
function isAdmin() { const u = getCurrentUser(); return u && u.role === 'admin'; }

function requireAuth(redirectTo = 'login.html') {
  if (!isLoggedIn()) { window.location.href = redirectTo; return false; }
  return true;
}
function requireAdmin() {
  if (!isAdmin()) { window.location.href = 'dashboard.html'; return false; }
  return true;
}

function logout() {
  DB.del('user');
  window.location.href = 'index.html';
}

// ── APPLICATIONS ──
function getApplications() { return DB.get('applications') || []; }
function saveApplications(apps) { DB.set('applications', apps); }
function getMyApplications() {
  const u = getCurrentUser();
  if (!u) return [];
  return getApplications().filter(a => a.userId === u.id);
}
function addApplication(app) {
  const apps = getApplications();
  app.id = 'APP' + Date.now();
  app.createdAt = new Date().toISOString();
  app.status = 'submitted';
  app.statusHistory = [{ status: 'submitted', date: app.createdAt, note: 'Application received' }];
  apps.unshift(app);
  saveApplications(apps);
  return app;
}
function updateAppStatus(appId, status, note = '') {
  const apps = getApplications();
  const idx = apps.findIndex(a => a.id === appId);
  if (idx < 0) return;
  apps[idx].status = status;
  apps[idx].statusHistory.push({ status, date: new Date().toISOString(), note });
  saveApplications(apps);
}

// ── USERS ──
function getUsers() { return DB.get('users') || []; }
function saveUsers(u) { DB.set('users', u); }
function registerUser(data) {
  const users = getUsers();
  if (users.find(u => u.email === data.email)) return { ok: false, msg: 'Email already registered' };
  const user = { ...data, id: 'USR' + Date.now(), role: 'student', createdAt: new Date().toISOString() };
  users.push(user);
  saveUsers(users);
  DB.set('user', user);
  return { ok: true, user };
}
function loginUser(email, password) {
  // Admin hardcoded
  if (email === 'admin@loanit.in' && password === 'admin123') {
    const admin = { id: 'ADMIN', name: 'Admin', email, role: 'admin' };
    DB.set('user', admin);
    return { ok: true, user: admin };
  }
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, msg: 'Invalid email or password' };
  DB.set('user', user);
  return { ok: true, user };
}

// ── EMI CALCULATOR ──
function calcEMI(principal, ratePercent, tenureMonths) {
  const r = ratePercent / 12 / 100;
  if (r === 0) return principal / tenureMonths;
  return principal * r * Math.pow(1 + r, tenureMonths) / (Math.pow(1 + r, tenureMonths) - 1);
}

// ── FORMATTERS ──
function fmtCurrency(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
function fmtDate(iso) { return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
function fmtStatus(s) {
  const map = { submitted: ['Submitted','badge-blue'], under_review: ['Under Review','badge-orange'], document_pending: ['Docs Pending','badge-orange'], approved: ['Approved','badge-green'], rejected: ['Rejected','badge-red'], disbursed: ['Disbursed','badge-green'] };
  return map[s] || [s, 'badge-gray'];
}

// ── TOAST ──
function showToast(msg, type = 'success') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:0.5rem;';
    document.body.appendChild(t);
  }
  const el = document.createElement('div');
  const colors = { success: '#10b981', error: '#ef4444', info: '#1a56db', warn: '#f59e0b' };
  el.style.cssText = `background:white;border-left:4px solid ${colors[type]||colors.info};padding:0.85rem 1.2rem;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.15);font-family:'Plus Jakarta Sans',sans-serif;font-size:0.88rem;font-weight:500;color:#0f172a;min-width:260px;animation:slideInRight 0.3s ease;`;
  el.textContent = msg;
  t.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, 3000);
}

// ── NAVBAR ACTIVE LINK ──
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link, .sidebar-link').forEach(l => {
    const href = l.getAttribute('href');
    if (href && href === page) l.classList.add('active');
  });
}

// ── UPDATE NAV FOR AUTH STATE ──
function updateNavAuth() {
  const user = getCurrentUser();
  const loginBtn = document.getElementById('navLogin');
  const userMenu = document.getElementById('navUser');
  const userName = document.getElementById('navUserName');
  if (user) {
    if (loginBtn) loginBtn.classList.add('hidden');
    if (userMenu) userMenu.classList.remove('hidden');
    if (userName) userName.textContent = user.name?.split(' ')[0];
  } else {
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (userMenu) userMenu.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNavLink();
  updateNavAuth();
  // Add toast animation
  const style = document.createElement('style');
  style.textContent = `@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: none; opacity: 1; } }`;
  document.head.appendChild(style);
});
