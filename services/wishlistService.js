const { Wishlist } = require('../models');

class WishlistService {
  // Get user's wishlist
  async getWishlist(userId) {
    let wishlist = await Wishlist.findOne({ user: userId })
      .populate('products', 'name price images category');
    
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
      await wishlist.save();
    }

    return wishlist;
  }

  // Add product to wishlist
  async addToWishlist(userId, productId) {
    let wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else {
      // Check if product already exists
      if (wishlist.products.includes(productId)) {
        throw new Error('Product already in wishlist');
      }
      wishlist.products.push(productId);
    }

    await wishlist.save();
    await wishlist.populate('products', 'name price images category');
    
    return wishlist;
  }

  // Remove product from wishlist
  async removeFromWishlist(userId, productId) {
    const wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      throw new Error('Wishlist not found');
    }

    wishlist.products = wishlist.products.filter(
      id => id.toString() !== productId.toString()
    );

    await wishlist.save();
    await wishlist.populate('products', 'name price images category');
    
    return wishlist;
  }
}

module.exports = new WishlistService();
