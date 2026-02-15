const express = require('express');
const router = express.Router();
const { productController } = require('../../controllers');

// Get all products with filters
router.get('/', productController.getAllProducts);

// Get featured products
router.get('/featured', productController.getFeaturedProducts);

// Search products
router.get('/search', productController.searchProducts);

// Get products by price range
router.get('/price-range', productController.getProductsByPriceRange);

// Get products by category
router.get('/category/:categoryId', productController.getProductsByCategory);

// Get product by slug (must be before /:id to avoid conflicts)
router.get('/slug/:slug', productController.getProductBySlug);

// Get related products for a product
router.get('/:id/related', productController.getRelatedProducts);

// Get single product (must be last to avoid :id conflict)
router.get('/:id', productController.getProductById);

module.exports = router;
