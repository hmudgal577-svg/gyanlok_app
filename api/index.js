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

  // Ensure req.url starts with /api so Express routes match correctly
  if (req.url && !req.url.startsWith('/api/')) {
    req.url = '/api' + (req.url.startsWith('/') ? '' : '/') + req.url;
  }

  return app(req, res);
};
