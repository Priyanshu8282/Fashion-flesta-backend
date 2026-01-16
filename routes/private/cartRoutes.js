const express = require('express');
const router = express.Router();
const { cartController } = require('../../controllers');
const { auth } = require('../../middlewares');

// All cart routes are protected
router.use(auth);

// Get cart
router.get('/', cartController.getCart);

// Add to cart
router.post('/', cartController.addToCart);

// Update cart item
router.put('/:productId', cartController.updateCartItem);

// Remove from cart
router.delete('/:productId', cartController.removeFromCart);

module.exports = router;
