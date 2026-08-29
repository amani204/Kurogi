const express = require('express');
const router = express.Router();
const { register, login, logout, me, getStaff, deleteStaff } = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth');
const { validate, registerRules, loginRules } = require('../middleware/validators');

router.post('/register', protect, authorize('owner'), registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, me);

router.get('/staff', protect, authorize('owner'), getStaff);
router.delete('/staff/:id', protect, authorize('owner'), deleteStaff);

module.exports = router;