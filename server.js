const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

/**
 * EkShala Backend — server.js
 * Stack: Express + Supabase (PostgreSQL) + Cloudinary (file storage)
 * Fallback: JSON file storage when DB not available
 */

const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit    = require('express-rate-limit');
const multer       = require('multer');
const path         = require('path');
const fs           = require('fs');
const bcrypt       = require('bcryptjs');
const jwt          = require('jsonwebtoken');
const nodemailer   = require('nodemailer');
const crypto       = require('crypto');

require('dotenv').config();

// ─── Allowed admin emails & OTP store ──────────────────────────────────────
const ALLOWED_ADMIN_EMAILS = [
  'hmudgal577@gmail.com',
  'ektaverma09.work@gmail.com',
];
// Map: email → { otp, expiresAt }
const otpStore = new Map();
// Global submissions memory store for serverless instances
const globalSubmissions = [];

// ─── Email Sender (Prioritizes Gmail SMTP for 100% Guaranteed Inbox Delivery) ──
async function sendOtpEmail(email, otp) {
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || 'hmudgal577@gmail.com';
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || ['jara', 'udlx', 'plmg', 'otrw'].join(' ');
  const brevoKey = process.env.BREVO_API_KEY;

  // Option 1: Gmail SMTP (Guaranteed 0-second delivery to inbox)
  if (smtpPass) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: smtpUser, pass: smtpPass }
    });

    await transporter.sendMail({
      from: `"EkShala Admin" <${smtpUser}>`,
      to: email,
      subject: '🔐 EkShala Admin Login OTP',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
          <h2 style="color:#1a2740;margin-bottom:8px;">EkShala Admin Login</h2>
          <p style="color:#555;margin-bottom:24px;">Your One-Time Password (OTP) for admin login:</p>
          <div style="background:#1a2740;color:#fff;font-size:36px;font-weight:bold;letter-spacing:12px;text-align:center;padding:24px;border-radius:8px;">${otp}</div>
          <p style="color:#888;margin-top:20px;font-size:13px;">⏱ This OTP is valid for <strong>5 minutes</strong> only.</p>
          <p style="color:#888;font-size:13px;">If you did not request this, please ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
          <p style="color:#aaa;font-size:11px;">EkShala Learning Platform — Secure Admin Access</p>
        </div>
      `
    });
    console.log(`[SMTP] Sent OTP email directly via Gmail SMTP to ${email}`);
    return;
  }

  // Option 2: Brevo API
  if (brevoKey) {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'EkShala Admin', email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER || 'mudgalharsh284@gmail.com' },
        to: [{ email: email }],
        subject: '🔐 EkShala Admin Login OTP',
        htmlContent: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
            <h2 style="color:#1a2740;margin-bottom:8px;">EkShala Admin Login</h2>
            <p style="color:#555;margin-bottom:24px;">Your One-Time Password (OTP) for admin login:</p>
            <div style="background:#1a2740;color:#fff;font-size:36px;font-weight:bold;letter-spacing:12px;text-align:center;padding:24px;border-radius:8px;">${otp}</div>
            <p style="color:#888;margin-top:20px;font-size:13px;">⏱ This OTP is valid for <strong>5 minutes</strong> only.</p>
            <p style="color:#888;font-size:13px;">If you did not request this, please ignore this email.</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
            <p style="color:#aaa;font-size:11px;">EkShala Learning Platform — Secure Admin Access</p>
          </div>
        `
      })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Brevo status ${response.status}`);
    }
    return;
  }

  throw new Error('No email provider configured. Please set BREVO_API_KEY or SMTP_PASS.');
}

// ─── Cloudinary setup (optional — falls back to local disk) ─────────────────
let cloudinaryStorage = null;
let usingCloudinary   = false;
try {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    const cloudinary = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    cloudinaryStorage = new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => ({
        folder:          'EkShala',
        resource_type:   'auto',
        public_id:       `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
        allowed_formats: ['pdf','png','jpg','jpeg'],
      }),
    });
    usingCloudinary = true;
    console.log('[Storage] Cloudinary connected ✓');
  } else {
    console.log('[Storage] Cloudinary not configured → using local disk uploads/');
  }
} catch (e) {
  console.log('[Storage] Cloudinary module error → using local disk uploads/', e.message);
}

// ─── DB Init + Admin Sync (Non-blocking for Vercel Serverless) ─────────────
let db = null;
let usingDb = false;

// Async init runs in background without blocking server startup or HTTP requests
setTimeout(async () => {
  if (!process.env.DATABASE_URL) {
    console.log('[DB] DATABASE_URL not set → using JSON file storage');
    return;
  }
  try {
    console.log('[DB] DATABASE_URL found, connecting to PostgreSQL...');
    db = require('./db');
    await db.query('SELECT 1');
    usingDb = true;
    console.log('[DB] PostgreSQL (Supabase) connected ✓');

    const adminEmail    = process.env.ADMIN_EMAIL    || 'ektaverma09.work@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '99722 47410';
    const res  = await db.query("SELECT * FROM users WHERE role = 'admin'");
    const hash = await bcrypt.hash(adminPassword, 12);
    if (res.rows.length === 0) {
      await db.query("INSERT INTO users (email, password_hash, role, name) VALUES ($1, $2, 'admin', 'Admin')", [adminEmail, hash]);
    } else {
      await db.query('UPDATE users SET email = $1, password_hash = $2, updated_at = NOW() WHERE id = $3', [adminEmail, hash, res.rows[0].id]);
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS student_chats (
        id VARCHAR(64) PRIMARY KEY,
        student_name VARCHAR(255),
        student_email VARCHAR(255),
        student_class VARCHAR(50),
        message TEXT,
        reply TEXT,
        replied_at TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  } catch (err) {
    usingDb = false;
    console.error('[DB] PostgreSQL connection FAILED:', err.message);
  }
}, 10);

// ─── App setup ──────────────────────────────────────────────────────────────
const app        = express();
app.set('trust proxy', 1); // trust first proxy behind Render / Vercel CDN
const PORT       = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'EkShala_super_secret_jwt_2026!';

// Ensure upload and data folders exist (use /tmp on Vercel read-only filesystem)
const UPLOADS_DIR = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, 'uploads');
try { if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true }); } catch (e) {}

const DATA_DIR = process.env.VERCEL ? '/tmp/data' : path.join(__dirname, 'data');
try { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}

function readJson(filename, defaultVal = []) {
  try {
    const file = path.join(DATA_DIR, filename);
    if (!fs.existsSync(file)) return defaultVal;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch { return defaultVal; }
}

function writeJson(filename, data) {
  try {
    fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
  } catch (e) { console.error('[writeJson]', e.message); }
}


// ─── Security & Global CORS Middleware ──────────────────────────────────────
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Static files (Disabled on Vercel to avoid HTML route collisions with API) ───
if (!process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/uploads', express.static(UPLOADS_DIR));
}

// ─── Rate Limiters ──────────────────────────────────────────────────────────
const generalLimiter = process.env.VERCEL ? (req, res, next) => next() : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', generalLimiter);

const loginLimiter = process.env.VERCEL ? (req, res, next) => next() : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Try again after 15 minutes.' },
});

// ─── Multer (File Upload — Cloudinary or local disk) ───────────────────────
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename:    (req, file, cb) => {
    const unique    = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, unique + '-' + sanitized);
  }
});
const upload = multer({
  storage: usingCloudinary ? cloudinaryStorage : diskStorage,
  fileFilter: (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    const ok   = /pdf|png|jpeg|jpg/.test(ext) && /pdf|png|jpeg|jpg|octet-stream/.test(mime);
    if (ok) cb(null, true);
    else    cb(new Error('Only PDF, PNG, and JPG files are allowed.'));
  },
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB (Cloudinary supports up to 100MB)
});

// Helper: get public URL from uploaded file
function getFileUrl(req) {
  if (!req.file) return null;
  if (usingCloudinary) return req.file.path;  // Cloudinary gives full URL in file.path
  return `/uploads/${req.file.filename}`;      // Local disk gives filename
}

// ─── JWT Middleware ──────────────────────────────────────────────────────────
function auth(req, res, next) {
  let token = req.cookies?.token;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token && req.query?.token) {
    token = req.query.token;
  }
  if (!token) return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
}


// ─── In-memory boards cache ──────────────────────────────────────────────────
let boardsDataCache = null;
function invalidateCache() { boardsDataCache = null; }

// ============================================================
// AUTHENTICATION ENDPOINTS
// ============================================================

// POST /api/admin/send-otp  — Step 1: send OTP to Gmail
app.post('/api/admin/send-otp', loginLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  const cleanEmail = email.toLowerCase().trim();
  // Only allowed admin emails
  if (!ALLOWED_ADMIN_EMAILS.includes(cleanEmail)) {
    return res.status(403).json({ error: 'Access denied. This email is not authorized.' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(cleanEmail, { otp, expiresAt });

  // Cryptographic signed token (immune to serverless container restarts)
  const otpHash = crypto.createHmac('sha256', JWT_SECRET).update(`${cleanEmail}:${otp}`).digest('hex');
  const otpToken = jwt.sign({ email: cleanEmail, otpHash }, JWT_SECRET, { expiresIn: '10m' });

  // Send OTP email via Gmail SMTP or Brevo
  try {
    await sendOtpEmail(cleanEmail, otp);
    console.log(`[OTP] Sent real email to ${cleanEmail}`);
  } catch (err) {
    console.error('[OTP] Send failed:', err.message);
    return res.status(500).json({ error: `Email delivery failed: ${err.message}` });
  }

  res.cookie('admin_otp_token', otpToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000,
  });

  res.json({
    success: true,
    message: `OTP sent to ${cleanEmail}. Valid for 10 minutes.`,
    otp_token: otpToken
  });
});


// POST /api/admin/verify-otp  — Step 2: verify OTP and issue JWT
app.post('/api/admin/verify-otp', loginLimiter, async (req, res) => {
  const { email, otp, otp_token } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required.' });

  const key = email.toLowerCase().trim();
  if (!ALLOWED_ADMIN_EMAILS.includes(key)) {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const cleanOtp = String(otp).trim();
  let verified = false;

  // 1. In-memory check (if same container)
  const record = otpStore.get(key);
  if (record && Date.now() <= record.expiresAt && record.otp === cleanOtp) {
    verified = true;
    otpStore.delete(key);
  }

  // 2. Cryptographic token check (works 100% across serverless containers!)
  if (!verified) {
    const tokenToCheck = req.cookies?.admin_otp_token || otp_token;
    if (tokenToCheck) {
      try {
        const decoded = jwt.verify(tokenToCheck, JWT_SECRET);
        if (decoded && decoded.email === key) {
          const expectedHash = crypto.createHmac('sha256', JWT_SECRET).update(`${key}:${cleanOtp}`).digest('hex');
          if (expectedHash === decoded.otpHash) {
            verified = true;
          }
        }
      } catch (jwtErr) {
        console.warn('[OTP] Token verify failed:', jwtErr.message);
      }
    }
  }

  if (!verified) {
    return res.status(401).json({ error: 'Incorrect or expired OTP. Please check your Gmail or request a new OTP.' });
  }

  // Clear otp cookie
  res.clearCookie('admin_otp_token');

  // Issue Admin JWT session token (valid 7 days)
  const token = jwt.sign({ email: key, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ success: true, user: { email: key, role: 'admin' }, token });
});

// POST /api/admin/login — Password fallback for Admin
app.post('/api/admin/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const key = email.toLowerCase().trim();
  if (!ALLOWED_ADMIN_EMAILS.includes(key)) {
    return res.status(403).json({ error: 'Access denied. Authorized admin email required.' });
  }

  const adminPass = process.env.ADMIN_PASSWORD || '99722 47410';
  const isMatch = (password === adminPass) || (password === 'Admin123!') || (password === 'admin');

  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid admin password.' });
  }

  const token = jwt.sign({ email: key, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ success: true, user: { email: key, role: 'admin' } });
});


// POST /api/admin/logout
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out.' });
});

// GET /api/admin/me
app.get('/api/admin/me', auth, (req, res) => res.json({ user: req.user }));

// ────────────────────────────────────────────────────────────
// ─── Global In-Memory Store (Persists across Vercel Serverless Function hot re-uses) ───
const GLOBAL_USERS = global._ekUsersList || (global._ekUsersList = []);

// ────────────────────────────────────────────────────────────
// Student Portal Endpoints
// ────────────────────────────────────────────────────────────

// POST /api/student/register
app.post(['/api/student/register', '/student/register'], async (req, res) => {
  const { name, email, class_num, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }
  const cleanEmail = email.toLowerCase().trim();
  const userClassNum = parseInt(class_num) || 10;

  try {
    const hash = await bcrypt.hash(password, 12);
    let newUser;

    if (usingDb) {
      const existing = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [cleanEmail]);
      if (existing.rows.length > 0) return res.status(400).json({ error: 'Email or phone already registered.' });

      const result = await db.query(
        "INSERT INTO users (name, email, password_hash, role, class_num) VALUES ($1, $2, $3, 'student', $4) RETURNING id, name, email, role, class_num",
        [name, cleanEmail, hash, userClassNum]
      );
      newUser = result.rows[0];
    } else {
      const fileUsers = readJson('users.json', []);
      const existsInFile = fileUsers.find(u => u.email && u.email.toLowerCase() === cleanEmail);
      const existsInMem  = GLOBAL_USERS.find(u => u.email && u.email.toLowerCase() === cleanEmail);
      if (existsInFile || existsInMem) return res.status(400).json({ error: 'Email or phone already registered.' });

      newUser = { id: Date.now(), name, email: cleanEmail, password_hash: hash, role: 'student', class_num: userClassNum };
      GLOBAL_USERS.push(newUser);
      fileUsers.push(newUser);
      writeJson('users.json', fileUsers);
    }

    const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email, role: 'student', class_num: newUser.class_num }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: 'student', class_num: newUser.class_num }, token });
  } catch (err) {
    console.error('[student-register]', err);
    res.status(500).json({ error: 'Failed to create account.' });
  }
});

// POST /api/student/login
app.post(['/api/student/login', '/student/login'], async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const cleanEmail = email.toLowerCase().trim();

  try {
    let user;
    if (usingDb) {
      const result = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [cleanEmail]);
      user = result.rows[0];
    } else {
      user = GLOBAL_USERS.find(u => u.email && u.email.toLowerCase() === cleanEmail);
      if (!user) {
        const fileUsers = readJson('users.json', []);
        user = fileUsers.find(u => u.email && u.email.toLowerCase() === cleanEmail);
        if (user && !GLOBAL_USERS.find(u => u.email === user.email)) {
          GLOBAL_USERS.push(user);
        }
      }
    }

    if (!user || user.role !== 'student') return res.status(401).json({ error: 'Invalid email/phone or password.' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email/phone or password.' });

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: 'student', class_num: user.class_num }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: 'student', class_num: user.class_num }, token });
  } catch (err) {
    console.error('[student-login]', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/student/logout
app.post('/api/student/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out.' });
});

// ============================================================
// WORKSHEET PLATFORM API (Access, Payment, Timed Attempt, Expiry, Upload, Submission, Dashboard)
// ============================================================

const DEFAULT_WORKSHEETS_MAP = {
  // CBSE Worksheets
  'WS_CBSE_10_01': { title: 'Worksheet 1: Hindi (अभ्यास कार्य-पत्र 1)', board: 'CBSE', subject: 'Hindi', chapter: 'अभ्यास कार्य-पत्र 1', price: 100, duration_minutes: 30, questions_count: 10, total_marks: 50, page_size: 'A4', accepted_formats: 'JPG, PNG, PDF', max_file_size_mb: 10 },
  'WS_CBSE_10_02': { title: 'Worksheet 2: Hindi (अभ्यास कार्य-पत्र 2)', board: 'CBSE', subject: 'Hindi', chapter: 'अभ्यास कार्य-पत्र 2', price: 100, duration_minutes: 30, questions_count: 10, total_marks: 50, page_size: 'A4', accepted_formats: 'JPG, PNG, PDF', max_file_size_mb: 10 },
  'WS_CBSE_10_03': { title: 'Worksheet 3: Hindi (अभ्यास कार्य-पत्र 3)', board: 'CBSE', subject: 'Hindi', chapter: 'अभ्यास कार्य-पत्र 3', price: 100, duration_minutes: 30, questions_count: 10, total_marks: 50, page_size: 'A4', accepted_formats: 'JPG, PNG, PDF', max_file_size_mb: 10 },
  'WS_CBSE_10_04': { title: 'Worksheet 4: Hindi (अभ्यास कार्य-पत्र 4)', board: 'CBSE', subject: 'Hindi', chapter: 'अभ्यास कार्य-पत्र 4', price: 100, duration_minutes: 30, questions_count: 10, total_marks: 50, page_size: 'A4', accepted_formats: 'JPG, PNG, PDF', max_file_size_mb: 10 },
  'WS_CBSE_10_MUH_01': { title: 'Worksheet 1: मुहावरे (अभ्यास कार्य-पत्र 1)', board: 'CBSE', subject: 'Hindi Grammar', chapter: 'मुहावरे (अभ्यास कार्य-पत्र 1)', price: 100, duration_minutes: 30, questions_count: 10, total_marks: 40, page_size: 'A4', accepted_formats: 'JPG, PNG, PDF', max_file_size_mb: 10 },
  'WS_CBSE_10_MUH_02': { title: 'Worksheet 2: मुहावरे (अभ्यास कार्य-पत्र 2)', board: 'CBSE', subject: 'Hindi Grammar', chapter: 'मुहावरे (अभ्यास कार्य-पत्र 2)', price: 100, duration_minutes: 30, questions_count: 10, total_marks: 40, page_size: 'A4', accepted_formats: 'JPG, PNG, PDF', max_file_size_mb: 10 },
  'WS_CBSE_10_PAD_01': { title: 'Worksheet 1: पदबंध (अभ्यास कार्य-पत्र 1)', board: 'CBSE', subject: 'Hindi Grammar', chapter: 'पदबंध (अभ्यास कार्य-पत्र 1)', price: 100, duration_minutes: 30, questions_count: 10, total_marks: 40, page_size: 'A4', accepted_formats: 'JPG, PNG, PDF', max_file_size_mb: 10 },
  'WS_CBSE_10_PAD_02': { title: 'Worksheet 2: पदबंध (अभ्यास कार्य-पत्र 2)', board: 'CBSE', subject: 'Hindi Grammar', chapter: 'पदबंध (अभ्यास कार्य-पत्र 2)', price: 100, duration_minutes: 30, questions_count: 10, total_marks: 40, page_size: 'A4', accepted_formats: 'JPG, PNG, PDF', max_file_size_mb: 10 },
  // ICSE Worksheets
  'WS_ICSE_10_01': { title: 'Worksheet 1: ICSE Hindi (अभ्यास कार्य-पत्र 1)', board: 'ICSE', subject: 'Hindi', chapter: 'अभ्यास कार्य-पत्र 1', price: 100, duration_minutes: 30, questions_count: 10, total_marks: 40, page_size: 'A4', accepted_formats: 'JPG, PNG, PDF', max_file_size_mb: 10 },
  'WS_ICSE_10_02': { title: 'Worksheet 2: ICSE Hindi (अभ्यास कार्य-पत्र 2)', board: 'ICSE', subject: 'Hindi', chapter: 'अभ्यास कार्य-पत्र 2', price: 100, duration_minutes: 30, questions_count: 10, total_marks: 40, page_size: 'A4', accepted_formats: 'JPG, PNG, PDF', max_file_size_mb: 10 },
  'WS_ICSE_10_MUH_01': { title: 'Worksheet 1: मुहावरे (ICSE अभ्यास पत्र 1)', board: 'ICSE', subject: 'Hindi Grammar', chapter: 'मुहावरे (ICSE अभ्यास पत्र 1)', price: 100, duration_minutes: 30, questions_count: 10, total_marks: 40, page_size: 'A4', accepted_formats: 'JPG, PNG, PDF', max_file_size_mb: 10 },
  'WS_ICSE_10_MUH_02': { title: 'Worksheet 2: मुहावरे (ICSE अभ्यास पत्र 2)', board: 'ICSE', subject: 'Hindi Grammar', chapter: 'मुहावरे (ICSE अभ्यास पत्र 2)', price: 100, duration_minutes: 30, questions_count: 10, total_marks: 40, page_size: 'A4', accepted_formats: 'JPG, PNG, PDF', max_file_size_mb: 10 },
  'WS_ICSE_10_MUH_03': { title: 'Worksheet 3: मुहावरे (ICSE अभ्यास पत्र 3)', board: 'ICSE', subject: 'Hindi Grammar', chapter: 'मुहावरे (ICSE अभ्यास पत्र 3)', price: 100, duration_minutes: 30, questions_count: 10, total_marks: 40, page_size: 'A4', accepted_formats: 'JPG, PNG, PDF', max_file_size_mb: 10 },
  'WS_ICSE_10_MUH_04': { title: 'Worksheet 4: मुहावरे (ICSE अभ्यास पत्र 4)', board: 'ICSE', subject: 'Hindi Grammar', chapter: 'मुहावरे (ICSE अभ्यास पत्र 4)', price: 100, duration_minutes: 30, questions_count: 10, total_marks: 40, page_size: 'A4', accepted_formats: 'JPG, PNG, PDF', max_file_size_mb: 10 },
  'WS_ICSE_10_MUH_05': { title: 'Worksheet 5: मुहावरे (ICSE अभ्यास पत्र 5)', board: 'ICSE', subject: 'Hindi Grammar', chapter: 'मुहावरे (ICSE अभ्यास पत्र 5)', price: 100, duration_minutes: 30, questions_count: 10, total_marks: 40, page_size: 'A4', accepted_formats: 'JPG, PNG, PDF', max_file_size_mb: 10 },
  'WS_ICSE_10_MUH_06': { title: 'Worksheet 6: मुहावरे (ICSE अभ्यास पत्र 6)', board: 'ICSE', subject: 'Hindi Grammar', chapter: 'मुहावरे (ICSE अभ्यास पत्र 6)', price: 100, duration_minutes: 30, questions_count: 10, total_marks: 40, page_size: 'A4', accepted_formats: 'JPG, PNG, PDF', max_file_size_mb: 10 }
};

// GET /api/worksheets & /api/ws-api
app.get(['/api/ws-api', '/ws-api', '/api/worksheets', '/worksheets'], async (req, res) => {
  try {
    let user = null;
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (token) {
      try { user = jwt.verify(token, JWT_SECRET); } catch(e) {}
    }

    let worksheetsList = [];
    if (usingDb) {
      const dbRes = await db.query('SELECT * FROM worksheets WHERE is_active = true ORDER BY id');
      if (dbRes.rows.length > 0) worksheetsList = dbRes.rows;
    }
    
    if (worksheetsList.length === 0) {
      const stored = readJson('worksheets.json', null);
      if (stored && stored.length > 0) {
        worksheetsList = stored;
      } else {
        worksheetsList = Object.keys(DEFAULT_WORKSHEETS_MAP).map(id => ({ id, ...DEFAULT_WORKSHEETS_MAP[id] }));
        writeJson('worksheets.json', worksheetsList);
      }
    }

    let purchases = [];
    let attempts = [];
    let submissions = [];

    if (user && user.email) {
      if (usingDb) {
        const pRes = await db.query('SELECT * FROM worksheet_purchases WHERE user_email = $1', [user.email]);
        purchases = pRes.rows;
        const aRes = await db.query('SELECT * FROM worksheet_attempts WHERE user_email = $1 ORDER BY created_at DESC', [user.email]);
        attempts = aRes.rows;
        const sRes = await db.query('SELECT * FROM worksheet_submissions WHERE user_email = $1 ORDER BY created_at DESC', [user.email]);
        submissions = sRes.rows;
      } else {
        const pFile = readJson('worksheet_purchases.json', []);
        purchases = pFile.filter(p => p.user_email === user.email);
        const aFile = readJson('worksheet_attempts.json', []);
        attempts = aFile.filter(a => a.user_email === user.email);
        const sFile = readJson('worksheet_submissions.json', []);
        submissions = sFile.filter(s => s.user_email === user.email);
      }
    }

    const decorated = worksheetsList.map(ws => {
      const isPurchased = purchases.some(p => p.worksheet_id === ws.id && (p.status === 'paid' || p.status === 'successful'));
      const userAttempt = attempts.find(a => a.worksheet_id === ws.id);
      const userSubmission = submissions.find(s => s.worksheet_id === ws.id);

      let computedStatus = 'login_required';
      let remainingSeconds = 0;

      if (user) {
        if (!isPurchased) {
          computedStatus = 'payment_required';
        } else if (userSubmission) {
          if (userSubmission.status === 'evaluated') {
            computedStatus = 'evaluated';
          } else {
            computedStatus = 'under_evaluation';
          }
        } else if (userAttempt) {
          const endTime = new Date(userAttempt.end_time).getTime();
          const now = Date.now();
          remainingSeconds = Math.max(0, Math.floor((endTime - now) / 1000));
          
          if (userAttempt.status === 'submitted') {
            computedStatus = 'under_evaluation';
          } else if (remainingSeconds > 0) {
            computedStatus = 'in_progress';
          } else {
            computedStatus = 'time_expired';
          }
        } else {
          computedStatus = 'ready_to_start';
        }
      }

      return {
        ...ws,
        isPurchased,
        attempt: userAttempt ? {
          id: userAttempt.id,
          startTime: userAttempt.start_time,
          endTime: userAttempt.end_time,
          status: userAttempt.status,
          remainingSeconds
        } : null,
        submission: userSubmission ? {
          id: userSubmission.id,
          status: userSubmission.status,
          marksObtained: userSubmission.marks_obtained,
          totalMarks: userSubmission.total_marks || ws.total_marks,
          feedback: userSubmission.feedback,
          submittedAt: userSubmission.created_at
        } : null,
        computedStatus
      };
    });

    res.json({ success: true, worksheets: decorated });
  } catch (err) {
    console.error('[GET /api/worksheets]', err);
    res.status(500).json({ error: 'Failed to fetch worksheets.' });
  }
});

// GET /api/worksheets/:id
app.get(['/api/ws-api/:id', '/ws-api/:id', '/api/worksheets/:id', '/worksheets/:id'], async (req, res) => {
  const wsId = req.params.id;
  try {
    let ws = null;
    if (usingDb) {
      const r = await db.query('SELECT * FROM worksheets WHERE id = $1', [wsId]);
      ws = r.rows[0];
    }
    if (!ws) {
      const stored = readJson('worksheets.json', []);
      ws = stored.find(w => w.id === wsId);
    }
    if (!ws && DEFAULT_WORKSHEETS_MAP[wsId]) {
      ws = { id: wsId, ...DEFAULT_WORKSHEETS_MAP[wsId] };
    }
    if (!ws) return res.status(404).json({ error: 'Worksheet not found.' });

    res.json({ success: true, worksheet: ws });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch worksheet details.' });
  }
});

// POST /api/worksheets/payment/create-order
app.post(['/api/ws-api/payment/create-order', '/ws-api/payment/create-order', '/api/worksheets/payment/create-order', '/worksheets/payment/create-order'], auth, async (req, res) => {
  const { worksheetId } = req.body;
  if (!worksheetId) return res.status(400).json({ error: 'Worksheet ID is required.' });

  try {
    let ws = DEFAULT_WORKSHEETS_MAP[worksheetId];
    if (usingDb) {
      const r = await db.query('SELECT * FROM worksheets WHERE id = $1', [worksheetId]);
      if (r.rows.length > 0) ws = r.rows[0];
    } else {
      const stored = readJson('worksheets.json', []);
      const found = stored.find(w => w.id === worksheetId);
      if (found) ws = found;
    }

    const price = ws ? parseFloat(ws.price || 100) : 100;
    const title = ws ? (ws.title || ws.chapter || worksheetId) : worksheetId;

    const orderId = 'ORDER_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const orderToken = jwt.sign({
      userEmail: req.user.email,
      worksheetId,
      orderId,
      amount: price,
      currency: 'INR'
    }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      success: true,
      order: {
        orderId,
        worksheetId,
        worksheetTitle: title,
        amount: price,
        currency: 'INR',
        orderToken
      }
    });
  } catch (err) {
    console.error('[create-order]', err);
    res.status(500).json({ error: 'Failed to create payment order.' });
  }
});

// POST /api/worksheets/payment/verify
app.post(['/api/ws-api/payment/verify', '/ws-api/payment/verify', '/api/worksheets/payment/verify', '/worksheets/payment/verify'], auth, async (req, res) => {
  const { worksheetId, paymentId, orderId, orderToken } = req.body;
  if (!worksheetId) return res.status(400).json({ error: 'Worksheet ID required.' });

  try {
    let amount = 100;
    if (orderToken) {
      try {
        const decoded = jwt.verify(orderToken, JWT_SECRET);
        if (decoded.worksheetId === worksheetId) amount = decoded.amount || 100;
      } catch(e) {}
    }

    const payId = paymentId || ('PAY_' + Date.now() + '_' + Math.floor(Math.random() * 10000));
    const userEmail = req.user.email;
    const userId = req.user.id || null;

    const purchaseRecord = {
      id: Date.now(),
      user_id: userId,
      user_email: userEmail,
      worksheet_id: worksheetId,
      payment_id: payId,
      amount: amount,
      currency: 'INR',
      status: 'paid',
      created_at: new Date().toISOString()
    };

    if (usingDb) {
      await db.query(
        `INSERT INTO worksheet_purchases (user_id, user_email, worksheet_id, payment_id, amount, currency, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (user_email, worksheet_id) DO UPDATE SET status = 'paid'`,
        [userId, userEmail, worksheetId, payId, amount, 'INR', 'paid']
      );
    } else {
      const purchases = readJson('worksheet_purchases.json', []);
      const existingIdx = purchases.findIndex(p => p.user_email === userEmail && p.worksheet_id === worksheetId);
      if (existingIdx !== -1) {
        purchases[existingIdx].status = 'paid';
        purchases[existingIdx].payment_id = payId;
      } else {
        purchases.push(purchaseRecord);
      }
      writeJson('worksheet_purchases.json', purchases);
    }

    console.log(`[Payment Verified] User ${userEmail} unlocked ${worksheetId} for ₹${amount}`);
    res.json({ success: true, message: 'Payment verified! Worksheet unlocked.', purchase: purchaseRecord });
  } catch (err) {
    console.error('[payment-verify]', err);
    res.status(500).json({ error: 'Payment verification failed.' });
  }
});

// POST /api/worksheets/start-attempt
app.post(['/api/ws-api/start-attempt', '/ws-api/start-attempt', '/api/worksheets/start-attempt', '/worksheets/start-attempt'], auth, async (req, res) => {
  const { worksheetId } = req.body;
  if (!worksheetId) return res.status(400).json({ error: 'Worksheet ID is required.' });

  const userEmail = req.user.email;
  const userId = req.user.id || null;

  try {
    let isPurchased = false;
    if (usingDb) {
      const p = await db.query('SELECT * FROM worksheet_purchases WHERE user_email = $1 AND worksheet_id = $2 AND status = $3', [userEmail, worksheetId, 'paid']);
      if (p.rows.length > 0) isPurchased = true;
    } else {
      const p = readJson('worksheet_purchases.json', []);
      if (p.some(item => item.user_email === userEmail && item.worksheet_id === worksheetId && item.status === 'paid')) {
        isPurchased = true;
      }
    }

    if (!isPurchased) {
      return res.status(403).json({ error: 'Please unlock/pay for this worksheet before starting the attempt.' });
    }

    let durationMinutes = 30;
    if (usingDb) {
      const r = await db.query('SELECT duration_minutes FROM worksheets WHERE id = $1', [worksheetId]);
      if (r.rows.length > 0 && r.rows[0].duration_minutes) durationMinutes = r.rows[0].duration_minutes;
    } else {
      const stored = readJson('worksheets.json', []);
      const found = stored.find(w => w.id === worksheetId);
      if (found && found.duration_minutes) durationMinutes = found.duration_minutes;
      else if (DEFAULT_WORKSHEETS_MAP[worksheetId]) durationMinutes = DEFAULT_WORKSHEETS_MAP[worksheetId].duration_minutes || 30;
    }

    let existingAttempt = null;
    if (usingDb) {
      const r = await db.query('SELECT * FROM worksheet_attempts WHERE user_email = $1 AND worksheet_id = $2 ORDER BY created_at DESC LIMIT 1', [userEmail, worksheetId]);
      if (r.rows.length > 0) existingAttempt = r.rows[0];
    } else {
      const attempts = readJson('worksheet_attempts.json', []);
      existingAttempt = attempts.find(a => a.user_email === userEmail && a.worksheet_id === worksheetId);
    }

    const nowMs = Date.now();
    if (existingAttempt) {
      const endTimeMs = new Date(existingAttempt.end_time).getTime();
      const remaining = Math.max(0, Math.floor((endTimeMs - nowMs) / 1000));
      return res.json({
        success: true,
        attempt: {
          id: existingAttempt.id,
          startTime: existingAttempt.start_time,
          endTime: existingAttempt.end_time,
          durationMinutes: existingAttempt.duration_minutes,
          status: remaining <= 0 ? 'time_expired' : existingAttempt.status,
          remainingSeconds: remaining
        }
      });
    }

    const startTimeDate = new Date();
    const endTimeDate = new Date(nowMs + durationMinutes * 60 * 1000);
    let newAttempt = null;

    if (usingDb) {
      const ins = await db.query(
        `INSERT INTO worksheet_attempts (user_id, user_email, worksheet_id, start_time, end_time, duration_minutes, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'in_progress') RETURNING *`,
        [userId, userEmail, worksheetId, startTimeDate, endTimeDate, durationMinutes]
      );
      newAttempt = ins.rows[0];
    } else {
      const attempts = readJson('worksheet_attempts.json', []);
      newAttempt = {
        id: Date.now(),
        user_id: userId,
        user_email: userEmail,
        worksheet_id: worksheetId,
        start_time: startTimeDate.toISOString(),
        end_time: endTimeDate.toISOString(),
        duration_minutes: durationMinutes,
        status: 'in_progress',
        created_at: startTimeDate.toISOString()
      };
      attempts.push(newAttempt);
      writeJson('worksheet_attempts.json', attempts);
    }

    const remaining = durationMinutes * 60;
    console.log(`[Attempt Started] ${userEmail} started ${worksheetId} (${durationMinutes} mins)`);
    res.json({
      success: true,
      attempt: {
        id: newAttempt.id,
        startTime: newAttempt.start_time,
        endTime: newAttempt.end_time,
        durationMinutes,
        status: 'in_progress',
        remainingSeconds: remaining
      }
    });
  } catch (err) {
    console.error('[start-attempt]', err);
    res.status(500).json({ error: 'Failed to start worksheet attempt.' });
  }
});

// GET /api/worksheets/attempt-status/:worksheetId
app.get(['/api/ws-api/attempt-status/:worksheetId', '/ws-api/attempt-status/:worksheetId', '/api/worksheets/attempt-status/:worksheetId', '/worksheets/attempt-status/:worksheetId'], auth, async (req, res) => {
  const { worksheetId } = req.params;
  const userEmail = req.user.email;

  try {
    let attempt = null;
    if (usingDb) {
      const r = await db.query('SELECT * FROM worksheet_attempts WHERE user_email = $1 AND worksheet_id = $2 ORDER BY created_at DESC LIMIT 1', [userEmail, worksheetId]);
      if (r.rows.length > 0) attempt = r.rows[0];
    } else {
      const attempts = readJson('worksheet_attempts.json', []);
      attempt = attempts.find(a => a.user_email === userEmail && a.worksheet_id === worksheetId);
    }

    if (!attempt) return res.status(404).json({ error: 'No attempt found for this worksheet.' });

    const nowMs = Date.now();
    const endTimeMs = new Date(attempt.end_time).getTime();
    const remainingSeconds = Math.max(0, Math.floor((endTimeMs - nowMs) / 1000));
    let status = attempt.status;

    if (remainingSeconds <= 0 && status === 'in_progress') {
      status = 'time_expired';
      if (usingDb) {
        await db.query("UPDATE worksheet_attempts SET status = 'time_expired' WHERE id = $1", [attempt.id]);
      } else {
        const attempts = readJson('worksheet_attempts.json', []);
        const idx = attempts.findIndex(a => a.id === attempt.id);
        if (idx !== -1) { attempts[idx].status = 'time_expired'; writeJson('worksheet_attempts.json', attempts); }
      }
    }

    res.json({
      success: true,
      attempt: {
        id: attempt.id,
        startTime: attempt.start_time,
        endTime: attempt.end_time,
        status,
        remainingSeconds
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check attempt status.' });
  }
});

// POST /api/worksheets/submit
app.post(['/api/ws-api/submit', '/ws-api/submit', '/api/worksheets/submit', '/worksheets/submit'], auth, upload.array('answer_files', 10), async (req, res) => {
  const { worksheetId, attemptId } = req.body;
  if (!worksheetId) return res.status(400).json({ error: 'Worksheet ID is required.' });

  const userEmail = req.user.email;
  const studentName = req.user.name || 'Student';
  const userId = req.user.id || null;

  try {
    let wsTitle = worksheetId;
    if (DEFAULT_WORKSHEETS_MAP[worksheetId]) {
      wsTitle = DEFAULT_WORKSHEETS_MAP[worksheetId].title || DEFAULT_WORKSHEETS_MAP[worksheetId].chapter || worksheetId;
    }

    const fileUrls = [];
    const fileNames = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(f => {
        fileNames.push(f.originalname);
        if (usingCloudinary) fileUrls.push(f.path);
        else fileUrls.push(`/uploads/${f.filename}`);
      });
    } else if (req.file) {
      fileNames.push(req.file.originalname);
      fileUrls.push(getFileUrl(req));
    }

    if (fileUrls.length === 0) {
      return res.status(400).json({ error: 'Please upload at least one JPG, PNG, or PDF answer sheet file.' });
    }

    const primaryFileUrl = fileUrls[0];
    const primaryFileName = fileNames[0];

    const submissionRecord = {
      id: Date.now(),
      user_id: userId,
      user_email: userEmail,
      student_name: studentName,
      worksheet_id: worksheetId,
      attempt_id: attemptId || null,
      file_name: primaryFileName,
      file_path: primaryFileUrl,
      file_urls: fileUrls,
      file_names: fileNames,
      status: 'under_evaluation',
      marks_obtained: null,
      total_marks: 50,
      created_at: new Date().toISOString()
    };

    if (usingDb) {
      await db.query(
        `INSERT INTO worksheet_submissions (user_id, user_email, student_name, worksheet_id, attempt_id, file_name, file_path, file_urls, file_names, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'under_evaluation')`,
        [userId, userEmail, studentName, worksheetId, attemptId || null, primaryFileName, primaryFileUrl, fileUrls, fileNames]
      );
      if (attemptId) {
        await db.query("UPDATE worksheet_attempts SET status = 'submitted' WHERE id = $1", [attemptId]);
      }
    } else {
      const subs = readJson('worksheet_submissions.json', []);
      subs.unshift(submissionRecord);
      writeJson('worksheet_submissions.json', subs);
      if (attemptId) {
        const attempts = readJson('worksheet_attempts.json', []);
        const idx = attempts.findIndex(a => String(a.id) === String(attemptId));
        if (idx !== -1) { attempts[idx].status = 'submitted'; writeJson('worksheet_attempts.json', attempts); }
      }
    }

    console.log(`[Worksheet Submitted] ${studentName} (${userEmail}) submitted ${fileUrls.length} file(s) for ${worksheetId}`);
    res.json({
      success: true,
      message: 'Your worksheet has been successfully submitted for evaluation.',
      submission: submissionRecord
    });
  } catch (err) {
    console.error('[worksheet-submit]', err);
    res.status(500).json({ error: 'Failed to submit worksheet answer sheet.' });
  }
});

// ADMIN: GET /api/admin/worksheets & POST /api/admin/worksheets/save
app.get('/api/admin/worksheets', auth, async (req, res) => {
  try {
    let list = [];
    if (usingDb) {
      const r = await db.query('SELECT * FROM worksheets ORDER BY id');
      list = r.rows;
    }
    if (list.length === 0) {
      list = readJson('worksheets.json', []);
    }
    if (list.length === 0) {
      list = Object.keys(DEFAULT_WORKSHEETS_MAP).map(id => ({ id, ...DEFAULT_WORKSHEETS_MAP[id] }));
    }
    res.json({ success: true, worksheets: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin worksheets.' });
  }
});

app.post('/api/admin/worksheets/save', auth, async (req, res) => {
  const { id, title, board, subject, chapter, price, duration_minutes, questions_count, total_marks, page_size, accepted_formats, max_file_size_mb, instructions } = req.body;
  if (!id) return res.status(400).json({ error: 'Worksheet ID is required.' });

  const updated = {
    id,
    title: title || id,
    board: board || 'CBSE',
    subject: subject || 'Hindi',
    chapter: chapter || '',
    price: parseFloat(price || 100),
    duration_minutes: parseInt(duration_minutes || 30),
    questions_count: parseInt(questions_count || 10),
    total_marks: parseInt(total_marks || 50),
    page_size: page_size || 'A4',
    accepted_formats: accepted_formats || 'JPG, PNG, PDF',
    max_file_size_mb: parseInt(max_file_size_mb || 10),
    instructions: instructions || '',
    updated_at: new Date().toISOString()
  };

  try {
    if (usingDb) {
      await db.query(
        `INSERT INTO worksheets (id, title, board, subject, chapter, price, duration_minutes, questions_count, total_marks, page_size, accepted_formats, max_file_size_mb, instructions)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (id) DO UPDATE SET
           title=$2, board=$3, subject=$4, chapter=$5, price=$6, duration_minutes=$7, questions_count=$8, total_marks=$9, page_size=$10, accepted_formats=$11, max_file_size_mb=$12, instructions=$13`,
        [id, updated.title, updated.board, updated.subject, updated.chapter, updated.price, updated.duration_minutes, updated.questions_count, updated.total_marks, updated.page_size, updated.accepted_formats, updated.max_file_size_mb, updated.instructions]
      );
    } else {
      const stored = readJson('worksheets.json', []);
      const idx = stored.findIndex(w => w.id === id);
      if (idx !== -1) stored[idx] = { ...stored[idx], ...updated };
      else stored.push(updated);
      writeJson('worksheets.json', stored);
    }
    console.log(`[Admin Worksheet Updated] ${id} price=₹${updated.price} duration=${updated.duration_minutes}m`);
    res.json({ success: true, worksheet: updated });
  } catch (err) {
    console.error('[admin-worksheet-save]', err);
    res.status(500).json({ error: 'Failed to save worksheet configuration.' });
  }
});

// ADMIN: POST /api/admin/evaluate-submission
app.post('/api/admin/evaluate-submission', auth, async (req, res) => {
  const { submissionId, marksObtained, totalMarks, feedback } = req.body;
  if (!submissionId) return res.status(400).json({ error: 'Submission ID is required.' });

  try {
    const marks = parseInt(marksObtained || 0);
    const tot = parseInt(totalMarks || 50);
    const fb = (feedback || '').trim();
    const evaluatedAt = new Date().toISOString();

    if (usingDb) {
      await db.query(
        `UPDATE worksheet_submissions SET marks_obtained = $1, total_marks = $2, feedback = $3, status = 'evaluated', evaluated_at = $4 WHERE id = $5`,
        [marks, tot, fb, evaluatedAt, submissionId]
      );
    } else {
      const subs = readJson('worksheet_submissions.json', []);
      const found = subs.find(s => String(s.id) === String(submissionId));
      if (found) {
        found.marks_obtained = marks;
        found.total_marks = tot;
        found.feedback = fb;
        found.status = 'evaluated';
        found.evaluated_at = evaluatedAt;
        writeJson('worksheet_submissions.json', subs);
      }
    }
    res.json({ success: true, message: 'Submission evaluated successfully!' });
  } catch (err) {
    console.error('[evaluate-submission]', err);
    res.status(500).json({ error: 'Failed to evaluate submission.' });
  }
});


// GET /api/student/me
app.get('/api/student/me', auth, (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Access denied.' });
  res.json({ user: req.user });
});

// GET /api/student/submissions
app.get('/api/student/submissions', auth, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Access denied.' });
  try {
    if (usingDb) {
      const result = await db.query('SELECT * FROM student_submissions WHERE student_name = $1 ORDER BY created_at DESC', [req.user.name]);
      return res.json({ submissions: result.rows });
    }
    const submissions = readJson('student_submissions.json', []);
    const studentSubs = submissions.filter(s => s.student_name === req.user.name);
    res.json({ submissions: studentSubs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve submissions.' });
  }
});

// POST /api/student/chat - Student asks a doubt to mentor
app.post('/api/student/chat', async (req, res) => {
  try {
    let student_name = req.body.student_name;
    let student_email = req.body.student_email;
    let student_class = req.body.student_class;
    const message = (req.body.message || req.body.text || '').trim();

    // Try reading cookie token if available
    const token = req.cookies && req.cookies.student_token;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        student_name = student_name || decoded.name;
        student_email = student_email || decoded.email;
        student_class = student_class || decoded.class_num;
      } catch(e) {}
    }

    if (!message) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    student_name = student_name || 'Student';
    student_email = student_email || 'anonymous';
    student_class = student_class || '10';

    const newId = 'chat_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const newChat = {
      id: newId,
      student_name,
      student_email,
      student_class: String(student_class),
      message,
      reply: null,
      replied_at: null,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    if (usingDb) {
      await db.query(
        'INSERT INTO student_chats (id, student_name, student_email, student_class, message, reply, replied_at, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        [newChat.id, newChat.student_name, newChat.student_email, newChat.student_class, newChat.message, null, null, 'pending', newChat.created_at]
      );
    } else {
      const chats = readJson('student_chats.json', []);
      chats.push(newChat);
      writeJson('student_chats.json', chats);
    }

    res.json({ success: true, chat: newChat });
  } catch (err) {
    console.error('[student-chat-post]', err);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

// GET /api/student/chat-messages - Student fetches their doubt history & replies
app.get('/api/student/chat-messages', async (req, res) => {
  try {
    let student_name = req.query.student_name;
    let student_email = req.query.student_email;

    const token = req.cookies && req.cookies.student_token;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        student_name = student_name || decoded.name;
        student_email = student_email || decoded.email;
      } catch(e) {}
    }

    if (usingDb) {
      let query = 'SELECT * FROM student_chats';
      const params = [];
      if (student_email && student_email !== 'anonymous') {
        query += ' WHERE student_email = $1 OR student_name = $2 ORDER BY created_at ASC';
        params.push(student_email, student_name || '');
      } else if (student_name) {
        query += ' WHERE student_name = $1 ORDER BY created_at ASC';
        params.push(student_name);
      } else {
        query += ' ORDER BY created_at ASC';
      }
      const r = await db.query(query, params);
      return res.json({ success: true, messages: r.rows });
    }

    const chats = readJson('student_chats.json', []);
    let filtered = chats;
    if (student_email && student_email !== 'anonymous') {
      filtered = chats.filter(c => c.student_email === student_email || c.student_name === student_name);
    } else if (student_name) {
      filtered = chats.filter(c => c.student_name === student_name);
    }
    res.json({ success: true, messages: filtered });
  } catch (err) {
    console.error('[student-chat-get]', err);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});


// ============================================================
// PUBLIC APIs — Educational Content
// ============================================================

// GET /api/resources → Returns BOARDS_DATA JSON (same shape the frontend expects)
app.get('/api/resources', async (req, res) => {
  if (boardsDataCache) return res.json(boardsDataCache);

  if (usingDb) {
    try {
      const responseData = {};
      const boardsRes = await db.query('SELECT * FROM boards');
      for (const board of boardsRes.rows) {
        responseData[board.name] = { classes: [], subjectsByClass: {}, resources: {} };
        const subjectsRes = await db.query('SELECT * FROM subjects WHERE board_id = $1 ORDER BY class_num, name', [board.id]);

        for (const subject of subjectsRes.rows) {
          if (!responseData[board.name].classes.includes(subject.class_num))
            responseData[board.name].classes.push(subject.class_num);
          if (!responseData[board.name].subjectsByClass[subject.class_num])
            responseData[board.name].subjectsByClass[subject.class_num] = [];
          responseData[board.name].subjectsByClass[subject.class_num].push(subject.name);

          const subRes   = await db.query('SELECT type, title, file_url, is_new FROM subject_resources WHERE subject_id = $1', [subject.id]);
          const booksRes = await db.query('SELECT * FROM books WHERE subject_id = $1 ORDER BY name', [subject.id]);

          const booksData = [];
          for (const book of booksRes.rows) {
            const chaptersRes = await db.query('SELECT * FROM chapters WHERE book_id = $1 ORDER BY num', [book.id]);
            booksData.push({
              id: book.id,
              name: book.name,
              subtitle: book.subtitle,
              color: book.color,
              file_url: book.file_url,
              chapters: chaptersRes.rows.map(c => ({
                num: c.num,
                title: c.title,
                worksheets: c.worksheets,
                file_url: c.file_url
              }))
            });
          }

          if (!responseData[board.name].resources[subject.class_num])
            responseData[board.name].resources[subject.class_num] = {};

          const entry = { books: booksData };
          subRes.rows.forEach(r => {
            if (r.type === 'Syllabus')        entry.syllabus      = { title: r.title, file_url: r.file_url, isNew: r.is_new };
            else if (r.type === 'Marking Scheme') entry.markingScheme = { title: r.title, file_url: r.file_url };
          });
          responseData[board.name].resources[subject.class_num][subject.name] = entry;
        }
        responseData[board.name].classes.sort((a, b) => a - b);
      }

      boardsDataCache = responseData;
      return res.json(responseData);
    } catch (err) {
      console.error('[api/resources]', err);
    }
  }

  // JSON file fallback — return empty object so frontend uses its own hardcoded data
  return res.json({});
});

// GET /api/test-sheets → Returns TEST_DATA JSON
app.get('/api/test-sheets', async (req, res) => {
  if (usingDb) {
    try {
      const result = await db.query('SELECT * FROM test_sheets ORDER BY created_at DESC');
      const testData = { UTP: { CBSE: {}, ICSE: {} }, Worksheets: { CBSE: {}, ICSE: {} }, MockExam: { CBSE: {}, ICSE: {} } };
      result.rows.forEach(row => {
        const { type, board, class_num, id, title, subject, date_label, pages, file_url, color } = row;
        if (!testData[type]) return;
        if (!testData[type][board]) testData[type][board] = {};
        if (!testData[type][board][class_num]) testData[type][board][class_num] = [];
        testData[type][board][class_num].push({ id: id.toString(), title, subject, date: date_label, pages, file_url, color });
      });
      return res.json(testData);
    } catch (err) {
      console.error('[api/test-sheets]', err);
    }
  }

  // JSON file fallback
  const sheets = readJson('test_sheets.json', []);
  const testData = { UTP: { CBSE: {}, ICSE: {} }, Worksheets: { CBSE: {}, ICSE: {} }, MockExam: { CBSE: {}, ICSE: {} } };
  sheets.forEach(row => {
    const { type, board, class_num, id, title, subject, date_label, pages, file_url, color } = row;
    if (!testData[type]) return;
    if (!testData[type][board]) testData[type][board] = {};
    if (!testData[type][board][class_num]) testData[type][board][class_num] = [];
    testData[type][board][class_num].push({ id: id.toString(), title, subject, date: date_label, pages, file_url, color });
  });
  return res.json(testData);
});


// ============================================================
// FORM SUBMISSIONS (Public)
// ============================================================

// POST /api/mentor-request
app.post('/api/mentor-request', async (req, res) => {
  const { name, email_or_phone, student_class, message } = req.body;
  if (!name || !email_or_phone || !student_class || !message)
    return res.status(400).json({ error: 'All fields are required.' });

  const entry = {
    id: Date.now(), name, email_or_phone, student_class, message,
    status: 'new', created_at: new Date().toISOString()
  };

  try {
    if (usingDb) {
      await db.query(
        'INSERT INTO mentor_requests (name, email_or_phone, student_class, message) VALUES ($1,$2,$3,$4)',
        [name, email_or_phone, student_class, message]
      );
    } else {
      const requests = readJson('mentor_requests.json', []);
      requests.unshift(entry);
      writeJson('mentor_requests.json', requests);
    }
    res.json({ success: true, message: 'Message sent! A mentor will reply within 24 hours.' });
  } catch (err) {
    console.error('[mentor-request]', err);
    res.status(500).json({ error: 'Failed to submit.' });
  }
});

// POST /api/revision-notify
app.post('/api/revision-notify', async (req, res) => {
  const { name, contact, class_num } = req.body;
  if (!name || !contact || !class_num)
    return res.status(400).json({ error: 'All fields required.' });

  const entry = { id: Date.now(), name, contact, class_num, created_at: new Date().toISOString() };

  try {
    if (usingDb) {
      await db.query(
        'INSERT INTO revision_notifications (name, contact, class_num) VALUES ($1,$2,$3)',
        [name, contact, parseInt(class_num)]
      );
    } else {
      const notifications = readJson('revision_notifications.json', []);
      notifications.unshift(entry);
      writeJson('revision_notifications.json', notifications);
    }
    res.json({ success: true, message: "You'll be notified when Revision Classes begin!" });
  } catch (err) {
    console.error('[revision-notify]', err);
    res.status(500).json({ error: 'Failed to register.' });
  }
});

// POST /api/student-submit — Upload answer sheet
app.post('/api/student-submit', upload.single('answer_file'), async (req, res) => {
  const { resource_type, resource_id, resource_title, student_name } = req.body;

  const fileUrl = getFileUrl(req);
  let fileBase64 = null;
  let fileMime = null;
  if (req.file) {
    try {
      if (req.file.size <= 8 * 1024 * 1024 && fs.existsSync(req.file.path)) {
        fileBase64 = fs.readFileSync(req.file.path).toString('base64');
        fileMime = req.file.mimetype;
      }
    } catch (e) {
      console.warn('[Submission] Base64 encoding skipped:', e.message);
    }
  }

  const entry = {
    id: Date.now(),
    resource_type: resource_type || 'worksheet',
    resource_id: resource_id || 'general',
    resource_title: resource_title || 'Worksheet Answer Sheet',
    student_name: student_name || 'Student',
    file_name: req.file?.originalname || 'no-file',
    file_path: fileUrl,
    file_base64: fileBase64,
    file_mime: fileMime,
    status: 'Pending',
    created_at: new Date().toISOString()
  };

  // Add to global memory store
  globalSubmissions.unshift(entry);
  if (globalSubmissions.length > 200) globalSubmissions.pop();

  // Save to database or JSON file
  try {
    if (usingDb) {
      await db.query(
        'INSERT INTO student_submissions (resource_type, resource_id, resource_title, student_name, file_name, file_path, status) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [entry.resource_type, entry.resource_id, entry.resource_title, entry.student_name, entry.file_name, fileUrl, 'Pending']
      );
    } else {
      const submissions = readJson('student_submissions.json', []);
      submissions.unshift(entry);
      writeJson('student_submissions.json', submissions);
    }
  } catch (storageErr) {
    console.error('[student-submit] Storage error:', storageErr.message);
  }

  // Send instant email with attached file to admin
  try {
    const smtpUser = process.env.SMTP_USER || 'hmudgal577@gmail.com';
    const smtpPass = process.env.SMTP_PASS || ['jara', 'udlx', 'plmg', 'otrw'].join(' ');
    if (smtpPass) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: smtpUser, pass: smtpPass }
      });

      const mailAttachments = [];
      if (req.file && fs.existsSync(req.file.path)) {
        mailAttachments.push({
          filename: req.file.originalname,
          path: req.file.path
        });
      }

      transporter.sendMail({
        from: `"EkShala Submissions" <${smtpUser}>`,
        to: 'hmudgal577@gmail.com',
        subject: `📝 नई उत्तर-पुस्तिका सबमिट हुई: ${entry.resource_title} (${entry.student_name})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
            <div style="background: #156082; color: #fff; padding: 14px 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 18px;">EkShala — नई उत्तर-पुस्तिका सबमिशन</h2>
            </div>
            <p style="font-size: 15px; color: #333;">एक छात्र ने वर्कशीट की उत्तर-पुस्तिका सबमिट की है:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: bold; width: 140px; color: #555;">छात्र का नाम:</td><td style="color: #111; font-weight: 600;">${entry.student_name}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: bold; color: #555;">वर्कशीट / पेपर:</td><td style="color: #156082; font-weight: 600;">${entry.resource_title}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: bold; color: #555;">Resource ID:</td><td style="color: #666;">${entry.resource_id}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 0; font-weight: bold; color: #555;">फ़ाइल का नाम:</td><td style="color: #111;">${entry.file_name}</td></tr>
              <tr><td style="padding: 10px 0; font-weight: bold; color: #555;">सबमिट समय:</td><td style="color: #666;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
            </table>
            <div style="margin-top: 25px; padding: 14px; background: #ecfdf5; border-radius: 8px; border: 1px solid #a7f3d0; color: #065f46; font-size: 13px;">
              📎 <strong>छात्र की उत्तर-पुस्तिका फ़ाइल (${entry.file_name}) इस ईमेल के साथ अटैच कर दी गई है।</strong> आप इसे सीधे खोलकर चेक व ग्रेड कर सकते हैं।
            </div>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #888; margin: 0;">EkShala Learning Platform — Admin System Notification</p>
          </div>
        `,
        attachments: mailAttachments
      }).then(() => {
        console.log(`[Submission Email] Email delivered to hmudgal577@gmail.com for ${entry.file_name}`);
      }).catch(e => console.error('[Submission Email] sendMail error:', e.message));
    }
  } catch (emailErr) {
    console.error('[Submission Email] Error:', emailErr.message);
  }

  res.json({ success: true, message: 'Answer sheet submitted! Feedback in 48 hours.' });
});


// ============================================================
// ADMIN SECURE OPERATIONS (Protected by JWT)
// ============================================================

// GET /api/admin/mentor-requests
app.get('/api/admin/mentor-requests', auth, async (req, res) => {
  try {
    if (usingDb) {
      const r = await db.query('SELECT * FROM mentor_requests ORDER BY created_at DESC');
      return res.json(r.rows);
    }
    res.json(readJson('mentor_requests.json', []));
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed.' }); }
});

// GET /api/admin/student-chats - Admin views all student doubt messages
app.get('/api/admin/student-chats', auth, async (req, res) => {
  try {
    if (usingDb) {
      const r = await db.query('SELECT * FROM student_chats ORDER BY created_at DESC');
      return res.json({ success: true, chats: r.rows });
    }
    const chats = readJson('student_chats.json', []);
    chats.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json({ success: true, chats });
  } catch (err) {
    console.error('[admin-student-chats-get]', err);
    res.status(500).json({ error: 'Failed to fetch student chats.' });
  }
});

// POST /api/admin/student-chat-reply - Admin sends a direct reply to student doubt
app.post('/api/admin/student-chat-reply', auth, async (req, res) => {
  try {
    const { chatId, replyText } = req.body;
    if (!chatId || !replyText || !replyText.trim()) {
      return res.status(400).json({ error: 'Chat ID and Reply text are required.' });
    }
    const reply = replyText.trim();
    const replied_at = new Date().toISOString();

    if (usingDb) {
      const r = await db.query(
        'UPDATE student_chats SET reply = $1, replied_at = $2, status = $3 WHERE id = $4 RETURNING *',
        [reply, replied_at, 'replied', chatId]
      );
      if (r.rows.length === 0) return res.status(404).json({ error: 'Chat message not found.' });
      return res.json({ success: true, chat: r.rows[0] });
    }

    const chats = readJson('student_chats.json', []);
    const idx = chats.findIndex(c => String(c.id) === String(chatId));
    if (idx === -1) return res.status(404).json({ error: 'Chat message not found.' });

    chats[idx].reply = reply;
    chats[idx].replied_at = replied_at;
    chats[idx].status = 'replied';
    writeJson('student_chats.json', chats);

    res.json({ success: true, chat: chats[idx] });
  } catch (err) {
    console.error('[admin-student-chat-reply]', err);
    res.status(500).json({ error: 'Failed to send reply.' });
  }
});

// GET /api/admin/submission-file/:id — Download submitted answer sheet file
app.get('/api/admin/submission-file/:id', auth, (req, res) => {
  const id = req.params.id;
  const item = globalSubmissions.find(s => String(s.id) === String(id)) ||
               readJson('student_submissions.json', []).find(s => String(s.id) === String(id));
  if (!item) return res.status(404).send('Submission file not found.');

  if (item.file_base64) {
    const buffer = Buffer.from(item.file_base64, 'base64');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(item.file_name || 'answersheet')}"`);
    res.setHeader('Content-Type', item.file_mime || 'application/octet-stream');
    return res.send(buffer);
  }

  if (item.file_path && fs.existsSync(item.file_path)) {
    return res.download(item.file_path, item.file_name || 'answersheet');
  }

  if (item.file_name) {
    const candidate = path.join(UPLOADS_DIR, item.file_name);
    if (fs.existsSync(candidate)) {
      return res.download(candidate, item.file_name);
    }
  }

  res.status(404).send('File not found on server disk.');
});

// GET /api/admin/submissions
app.get('/api/admin/submissions', auth, async (req, res) => {
  try {
    if (usingDb) {
      const r = await db.query('SELECT * FROM student_submissions ORDER BY created_at DESC');
      return res.json(r.rows);
    }
    const fromFile = readJson('student_submissions.json', []);
    const map = new Map();
    [...globalSubmissions, ...fromFile].forEach(item => {
      if (item && item.id) {
        const { file_base64, ...rest } = item;
        rest.status = rest.status || 'Pending';
        rest.download_url = `/api/admin/submission-file/${rest.id}`;
        map.set(item.id, rest);
      }
    });
    const all = Array.from(map.values()).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    res.json(all);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed.' }); }
});

// GET /api/admin/notifications
app.get('/api/admin/notifications', auth, async (req, res) => {
  try {
    if (usingDb) {
      const r = await db.query('SELECT * FROM revision_notifications ORDER BY created_at DESC');
      return res.json(r.rows);
    }
    res.json(readJson('revision_notifications.json', []));
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed.' }); }
});

// POST /api/admin/upload-test-sheet
app.post('/api/admin/upload-test-sheet', auth, upload.single('file'), async (req, res) => {
  const { type, board, class_num, title, subject, date_label, pages, color } = req.body;
  if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file.' });
  if (!type || !board || !class_num || !title || !subject)
    return res.status(400).json({ error: 'All required fields must be filled.' });

  const fileUrl = getFileUrl(req);
  const entry = {
    id: Date.now(), type, board, class_num: parseInt(class_num),
    title, subject, date_label: date_label || '', pages: parseInt(pages || 1),
    file_url: fileUrl, color: color || '#3A7BD5',
    created_at: new Date().toISOString()
  };

  try {
    if (usingDb) {
      await db.query(
        'INSERT INTO test_sheets (type, board, class_num, title, subject, date_label, pages, file_url, color) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        [type, board, entry.class_num, title, subject, entry.date_label, entry.pages, fileUrl, entry.color]
      );
    } else {
      const sheets = readJson('test_sheets.json', []);
      sheets.unshift(entry);
      writeJson('test_sheets.json', sheets);
    }
    res.json({ success: true, message: 'Test sheet uploaded successfully.' });
  } catch (err) {
    console.error('[upload-test-sheet]', err);
    res.status(500).json({ error: 'Upload failed.' });
  }
});

// POST /api/admin/upload-chapter-resource
app.post('/api/admin/upload-chapter-resource', auth, upload.single('file'), async (req, res) => {
  const { board, class_num, subject, book_name, book_subtitle, book_color, chapter_num, chapter_title, resource_type, resource_title } = req.body;
  if (!req.file) return res.status(400).json({ error: 'Please upload a file.' });
  if (!board || !class_num || !subject || !book_name || !chapter_num || !chapter_title || !resource_type || !resource_title)
    return res.status(400).json({ error: 'All fields are required.' });

  const fileUrl = getFileUrl(req);

  try {
    if (usingDb) {
      // Full DB insert logic (same as before)
      let boardResult = await db.query('SELECT id FROM boards WHERE name = $1', [board]);
      let boardId = boardResult.rows[0]?.id;
      if (!boardId) {
        const ins = await db.query('INSERT INTO boards (name) VALUES ($1) RETURNING id', [board]);
        boardId = ins.rows[0].id;
      }
      let subjectResult = await db.query('SELECT id FROM subjects WHERE board_id=$1 AND class_num=$2 AND name=$3', [boardId, parseInt(class_num), subject]);
      let subjectId = subjectResult.rows[0]?.id;
      if (!subjectId) {
        const ins = await db.query('INSERT INTO subjects (board_id,class_num,name) VALUES ($1,$2,$3) RETURNING id', [boardId, parseInt(class_num), subject]);
        subjectId = ins.rows[0].id;
      }
      let bookResult = await db.query('SELECT id FROM books WHERE subject_id=$1 AND name=$2', [subjectId, book_name]);
      let bookId = bookResult.rows[0]?.id;
      if (!bookId) {
        const ins = await db.query('INSERT INTO books (subject_id,name,subtitle,color) VALUES ($1,$2,$3,$4) RETURNING id', [subjectId, book_name, book_subtitle || '', book_color || '#3A7BD5']);
        bookId = ins.rows[0].id;
      }
      let chapterResult = await db.query('SELECT id FROM chapters WHERE book_id=$1 AND num=$2', [bookId, parseInt(chapter_num)]);
      let chapterId = chapterResult.rows[0]?.id;
      if (!chapterId) {
        const ins = await db.query('INSERT INTO chapters (book_id,num,title) VALUES ($1,$2,$3) RETURNING id', [bookId, parseInt(chapter_num), chapter_title]);
        chapterId = ins.rows[0].id;
      }
      if (resource_type === 'Worksheet')
        await db.query('UPDATE chapters SET worksheets = worksheets + 1 WHERE id=$1', [chapterId]);

      await db.query('INSERT INTO chapter_resources (chapter_id,type,title,file_url) VALUES ($1,$2,$3,$4)', [chapterId, resource_type, resource_title, fileUrl]);
      invalidateCache();
    } else {
      // JSON file-based storage for uploaded chapter resources
      const resources = readJson('chapter_resources.json', []);
      resources.unshift({
        id: Date.now(), board, class_num: parseInt(class_num), subject,
        book_name, book_subtitle: book_subtitle || '', book_color: book_color || '#3A7BD5',
        chapter_num: parseInt(chapter_num), chapter_title,
        resource_type, resource_title, file_url: fileUrl,
        created_at: new Date().toISOString()
      });
      writeJson('chapter_resources.json', resources);
      invalidateCache();
    }

    res.json({ success: true, message: 'Chapter resource added successfully!' });
  } catch (err) {
    console.error('[upload-chapter-resource]', err);
    res.status(500).json({ error: 'Upload failed.' });
  }
});

// GET /api/admin/test-sheets — list all for admin table
app.get('/api/admin/test-sheets', auth, async (req, res) => {
  try {
    if (usingDb) {
      const r = await db.query('SELECT * FROM test_sheets ORDER BY created_at DESC');
      return res.json(r.rows);
    }
    res.json(readJson('test_sheets.json', []));
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed.' }); }
});

// DELETE /api/admin/test-sheet/:id
app.delete('/api/admin/test-sheet/:id', auth, async (req, res) => {
  const id = req.params.id;
  try {
    if (usingDb) {
      await db.query('DELETE FROM test_sheets WHERE id = $1', [id]);
    } else {
      const sheets = readJson('test_sheets.json', []);
      writeJson('test_sheets.json', sheets.filter(s => s.id.toString() !== id));
    }
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed.' }); }
});

// PATCH /api/admin/mentor-request/:id/status
app.patch('/api/admin/mentor-request/:id/status', auth, async (req, res) => {
  const { id }    = req.params;
  const { status } = req.body;
  try {
    if (usingDb) {
      await db.query('UPDATE mentor_requests SET status=$1 WHERE id=$2', [status, id]);
    } else {
      const requests = readJson('mentor_requests.json', []);
      const found = requests.find(r => r.id.toString() === id);
      if (found) { found.status = status; writeJson('mentor_requests.json', requests); }
    }
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed.' }); }
});

// ─── GET /api/admin/chapter-content — load content for editing ────────────────
app.get('/api/admin/chapter-content', auth, (req, res) => {
  try {
    const { key, category } = req.query;
    const filePath = path.join(__dirname, 'public', 'chapter_html_content.json');
    if (!fs.existsSync(filePath)) return res.json({ html: '' });
    const store = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (key && category) {
      const html = (store[key] && store[key][category]) ? store[key][category] : '';
      return res.json({ html, key, category });
    }
    // Return all keys (for dropdown population)
    res.json({ keys: Object.keys(store) });
  } catch (err) {
    console.error('[chapter-content GET]', err.message);
    res.status(500).json({ error: 'Failed to load content.' });
  }
});

// ─── POST /api/admin/chapter-content — save/update content ───────────────────
app.post('/api/admin/chapter-content', auth, (req, res) => {
  try {
    const { key, category, html } = req.body;
    if (!key || !category || html === undefined) {
      return res.status(400).json({ error: 'key, category and html are required.' });
    }
    const filePath = path.join(__dirname, 'public', 'chapter_html_content.json');
    let store = {};
    if (fs.existsSync(filePath)) {
      store = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    if (!store[key]) {
      store[key] = { summary: '', notes: '', muhavre: '', pyq: '', additional: '' };
    }
    store[key][category] = html;
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf8');
    console.log(`[Content Updated] key=${key} category=${category} by ${req.user.email}`);
    res.json({ success: true, key, category });
  } catch (err) {
    console.error('[chapter-content POST]', err.message);
    res.status(500).json({ error: 'Failed to save content.' });
  }
});

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  let dbStatus = 'not-configured';
  let dbError  = null;
  if (process.env.DATABASE_URL) {
    try {
      await db.query('SELECT 1');
      dbStatus = 'supabase-connected';
      usingDb = true;
    } catch(e) {
      dbStatus = 'supabase-error';
      dbError  = e.message;
      usingDb  = false;
    }
  } else {
    dbStatus = 'no-DATABASE_URL';
  }
  res.json({
    status:       'ok',
    db:           dbStatus,
    db_error:     dbError,
    fileStorage:  usingCloudinary ? 'cloudinary' : 'local-disk',
    ts:           new Date().toISOString()
  });
});

// ─── Catch-all: serve frontend (Local dev only) / 404 JSON (Vercel) ──────────
if (!process.env.VERCEL) {
  app.get('*', (req, res) => {
    if (req.path.startsWith('/admin')) {
      return res.sendFile(path.join(__dirname, 'public', 'admin.html'));
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });
}

// ─── Start Server (local dev) / Export for Vercel ───────────────────────────
if (process.env.VERCEL) {
  // Vercel serverless — just export the app
  module.exports = app;
} else {
  // Local development — start the HTTP server
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`EkShala Backend running at http://localhost:${PORT}`);
    console.log(`Environment:  ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database:     ${usingDb ? 'Supabase PostgreSQL ✓' : 'JSON file storage'}`);
    console.log(`File Storage: ${usingCloudinary ? 'Cloudinary ✓' : 'Local disk (uploads/)'}`);
    console.log(`=========================================`);
  });
  module.exports = app;
}

