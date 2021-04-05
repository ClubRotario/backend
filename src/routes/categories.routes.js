const express = require('express');
const { getAllCategories, deleteCategory, updateCategory, saveCategory } = require('../controllers/categories.controller');
const router = express.Router();

router.get('/', getAllCategories);
router.delete('/', deleteCategory);
router.put('/', updateCategory);
router.post('/', saveCategory);

module.exports = router;