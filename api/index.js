const app = require('../server.js');

module.exports = (req, res) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract path from Vercel rewrite parameter or headers
  let targetPath = '';
  if (req.query && req.query.__path) {
    targetPath = req.query.__path;
  } else if (req.headers['x-forwarded-uri']) {
    targetPath = req.headers['x-forwarded-uri'];
  } else {
    targetPath = req.url || '';
  }

  // Remove duplicate query strings if present
  if (targetPath.includes('?')) {
    targetPath = targetPath.split('?')[0];
  }

  // Reconstruct req.url to ensure /api prefix
  if (targetPath) {
    if (!targetPath.startsWith('/api')) {
      targetPath = '/api' + (targetPath.startsWith('/') ? '' : '/') + targetPath;
    }
    req.url = targetPath;
  }

  return app(req, res);
};
