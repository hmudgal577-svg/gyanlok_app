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

  const slugParts = req.query.slug ? (Array.isArray(req.query.slug) ? req.query.slug : [req.query.slug]) : [];
  const slugPath = slugParts.join('/');
  req.url = '/api/student' + (slugPath ? '/' + slugPath : '');

  return app(req, res);
};
