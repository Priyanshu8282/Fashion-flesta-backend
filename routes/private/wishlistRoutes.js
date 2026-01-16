const express = require('express');
const router = express.Router();
const { wishlistController } = require('../../controllers');
const { auth } = require('../../middlewares');

// All wishlist routes are protected
router.use(auth);

// Get wishlist
router.get('/', wishlistController.getWishlist);

// Add to wishlist
router.post('/', wishlistController.addToWishlist);

// Remove from wishlist
router.delete('/:productId', wishlistController.removeFromWishlist);

module.exports = router;
