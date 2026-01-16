const express = require('express');
const router = express.Router();
const { adminController } = require('../../controllers');
const { auth, adminAuth } = require('../../middlewares');
const { validateCategory, validateProduct, checkValidationResult, uploadCategoryImage, uploadProductImages } = require('../../utils');

// All admin routes require authentication and admin role
router.use(auth, adminAuth);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Category management
router.post('/categories', uploadCategoryImage, adminController.addCategory);
router.put('/categories/:id', uploadCategoryImage, adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);
router.patch('/categories/:id/status', adminController.toggleCategoryStatus);

// Product management
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

module.exports = router;
