const { Cart } = require('../models');

class CartService {
  // Get user's cart
  async getCart(userId) {
    let cart = await Cart.findOne({ user: userId })
      .populate('items.product', 'name price images stock');
    
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }

    return cart;
  }

  // Add product to cart
  async addToCart(userId, productId, quantity, size) {
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity, size }]
      });
    } else {
      // Check if product with same size exists
      const existingItem = cart.items.find(
        item => item.product.toString() === productId.toString() && item.size === size
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, size });
      }
    }

    await cart.save();
    await cart.populate('items.product', 'name price images stock');
    
    return cart;
  }

  // Update cart item quantity
  async updateCartItemQuantity(userId, productId, quantity, size) {
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      throw new Error('Cart not found');
    }

    const item = cart.items.find(
      item => item.product.toString() === productId.toString() && item.size === size
    );

    if (!item) {
      throw new Error('Product not in cart');
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0
      cart.items = cart.items.filter(
        item => !(item.product.toString() === productId.toString() && item.size === size)
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name price images stock');
    
    return cart;
  }

  // Remove product from cart
  async removeFromCart(userId, productId, size) {
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(
      item => !(item.product.toString() === productId.toString() && 
                (size ? item.size === size : true))
    );

    await cart.save();
    await cart.populate('items.product', 'name price images stock');
    
    return cart;
  }

  // Clear cart
  async clearCart(userId) {
    const cart = await Cart.findOne({ user: userId });
    
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return cart;
  }
}

module.exports = new CartService();
