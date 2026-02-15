const { cartService } = require('../services');

class CartController {
  // Get cart
  async getCart(req, res, next) {
    try {
      const cart = await cartService.getCart(req.user._id);
      
      res.status(200).json({
        success: true,
        data: cart
      });
    } catch (error) {
      next(error);
    }
  }

  // Add to cart
  async addToCart(req, res, next) {
    try {
      // Support both direct parameters and items array format
      let productId, quantity, size;
      
      if (req.body.items && Array.isArray(req.body.items) && req.body.items.length > 0) {
        // Format: { items: [{ product, quantity, size }] }
        const firstItem = req.body.items[0];
        productId = firstItem.product;
        quantity = firstItem.quantity;
        size = firstItem.size;
      } else {
        // Format: { productId, quantity, size }
        productId = req.body.productId;
        quantity = req.body.quantity;
        size = req.body.size;
      }
      
      if (!productId || !quantity || !size) {
        return res.status(400).json({
          success: false,
          message: 'productId, quantity, and size are required'
        });
      }

      const cart = await cartService.addToCart(
        req.user._id,
        productId,
        quantity,
        size
      );
      
      res.status(200).json({
        success: true,
        message: 'Product added to cart',
        data: cart
      });
    } catch (error) {
      next(error);
    }
  }

  // Update cart item quantity
  async updateCartItem(req, res, next) {
    try {
      const { quantity, size } = req.body;
      const { productId } = req.params;
      
      if (!quantity || !size) {
        return res.status(400).json({
          success: false,
          message: 'quantity and size are required'
        });
      }

      const cart = await cartService.updateCartItemQuantity(
        req.user._id,
        productId,
        quantity,
        size
      );
      
      res.status(200).json({
        success: true,
        message: 'Cart updated',
        data: cart
      });
    } catch (error) {
      next(error);
    }
  }

  // Remove from cart
  async removeFromCart(req, res, next) {
    try {
      const { productId } = req.params;
      const { size } = req.query;

      const cart = await cartService.removeFromCart(
        req.user._id,
        productId,
        size
      );
      
      res.status(200).json({
        success: true,
        message: 'Product removed from cart',
        data: cart
      });
    } catch (error) {
      next(error);
    }
  }

  // Clear cart (remove all items)
  async clearCart(req, res, next) {
    try {
      const cart = await cartService.clearCart(req.user._id);
      
      res.status(200).json({
        success: true,
        message: 'Cart cleared successfully',
        data: cart
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();
