const { wishlistService } = require('../services');

class WishlistController {
  // Get wishlist
  async getWishlist(req, res, next) {
    try {
      const wishlist = await wishlistService.getWishlist(req.user._id);
      
      res.status(200).json({
        success: true,
        data: wishlist
      });
    } catch (error) {
      next(error);
    }
  }

  // Add to wishlist
  async addToWishlist(req, res, next) {
    try {
      // Support both "productId" (singular) and "products" (array)
      const productId = req.body.productId || (req.body.products && req.body.products[0]);
      
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'productId is required'
        });
      }
      
      const wishlist = await wishlistService.addToWishlist(req.user._id, productId);
      
      res.status(200).json({
        success: true,
        message: 'Product added to wishlist',
        data: wishlist
      });
    } catch (error) {
      next(error);
    }
  }

  // Remove from wishlist
  async removeFromWishlist(req, res, next) {
    try {
      const wishlist = await wishlistService.removeFromWishlist(
        req.user._id,
        req.params.productId
      );
      
      res.status(200).json({
        success: true,
        message: 'Product removed from wishlist',
        data: wishlist
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WishlistController();
