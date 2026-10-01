module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ debug: "INSIDE WS-API V1", method: req.method, url: req.url });
};
