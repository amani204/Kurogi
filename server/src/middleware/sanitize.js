const stripBadKeys = (obj) => {
  if (!obj || typeof obj !== 'object') return;

  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      continue;
    }
    if (obj[key] && typeof obj[key] === 'object') {
      stripBadKeys(obj[key]);
    }
  }
};

const sanitizeRequest = (req, res, next) => {
  stripBadKeys(req.body);
  stripBadKeys(req.params);
  stripBadKeys(req.query);
  next();
};

module.exports = sanitizeRequest;