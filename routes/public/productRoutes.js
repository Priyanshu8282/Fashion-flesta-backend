const express = require('express');
const router = express.Router();
const { productController } = require('../../controllers');

// Get all products with filters
router.get('/', productController.getAllProducts);

// Get featured products
router.get('/featured', productController.getFeaturedProducts);

// Get products by price range
router.get('/price-range', productController.getProductsByPriceRange);

// Get products by category
router.get('/category/:categoryId', productController.getProductsByCategory);

// Get single product (must be last to avoid :id conflict)
router.get('/:id', productController.getProductById);

module.exports = router;
