const express = require('express');
const router = express.Router();
const { register, login, logout, me } = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth');
const { validate, registerRules, loginRules } = require('../middleware/validators');
router.post('/register', protect, authorize('owner'), registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, me);

module.exports = router;