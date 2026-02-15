const express = require('express');
const router = express.Router();
const { adminController, productController, categoryController } = require('../../controllers');
const { auth, adminAuth } = require('../../middlewares');
const { validateCategory, validateProduct, checkValidationResult, uploadCategoryImage, uploadProductImages, uploadBannerImage } = require('../../utils');

// All admin routes require authentication and admin role
router.use(auth, adminAuth);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Category management
router.get('/categories', categoryController.getAllCategories);
router.post('/categories', uploadCategoryImage, adminController.addCategory);
router.put('/categories/:id', uploadCategoryImage, adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);
router.patch('/categories/:id/status', adminController.toggleCategoryStatus);

// Product management
router.get('/products', productController.getAllProducts);
router.post('/products', uploadProductImages, adminController.addProduct);
router.put('/products/:id', uploadProductImages, adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.patch('/products/:id/status', adminController.toggleProductStatus);

// Order management
router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

// Customer management
router.get('/customers', adminController.getAllCustomers);
router.get('/customers/:id', adminController.getCustomerById);

// Banner management
router.get('/banners', adminController.getAllBanners);
router.post('/banners', uploadBannerImage, adminController.addBanner);
router.put('/banners/:id', uploadBannerImage, adminController.updateBanner);
router.delete('/banners/:id', adminController.deleteBanner);
router.patch('/banners/:id/status', adminController.toggleBannerStatus);

module.exports = router;
