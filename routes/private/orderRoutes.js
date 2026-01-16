const express = require('express');
const router = express.Router();
const { orderController } = require('../../controllers');
const { auth } = require('../../middlewares');

// All order routes are protected
router.use(auth);

// Get customer's orders
router.get('/my-orders', orderController.getMyOrders);

// Place order
router.post('/', orderController.placeOrder);

// Get single order
router.get('/:id', orderController.getOrderById);

module.exports = router;
