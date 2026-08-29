const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

router.post('/image', protect, authorize('owner'), upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const url = `${process.env.SERVER_URL || 'http://127.0.0.1:5000'}/uploads/${req.file.filename}`;
  res.status(201).json({ url });
});

module.exports = router;