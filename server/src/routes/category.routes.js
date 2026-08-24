const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { protect, authorize } = require('../middleware/auth');
const { validate, categoryCreateRules, categoryUpdateRules } = require('../middleware/validators');

router.get('/', getCategories); // public

router.post('/', protect, authorize('owner'), categoryCreateRules, validate, createCategory);
router.put('/:id', protect, authorize('owner'), categoryUpdateRules, validate, updateCategory);
router.delete('/:id', protect, authorize('owner'), deleteCategory);

module.exports = router;