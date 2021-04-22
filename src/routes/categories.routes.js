const express = require('express');
const { getAllCategories, deleteCategory, updateCategory, saveCategory } = require('../controllers/categories.controller');
const { verifyToken } = require('../middlewares/auth');
const router = express.Router();

router.get('/', [verifyToken],getAllCategories);
router.delete('/', [verifyToken],deleteCategory);
router.put('/', [verifyToken],updateCategory);
router.post('/', [verifyToken],saveCategory);

module.exports = router;