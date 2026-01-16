const express = require('express');
const router = express.Router();
const { categoryController } = require('../../controllers');

// Get all active categories (public)
router.get('/', categoryController.getAllActiveCategories);

// Get single category (public)
router.get('/:id', categoryController.getCategoryById);

module.exports = router;
