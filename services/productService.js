const { Product } = require('../models');

class ProductService {
  // Get all products with optional filters
  async getAllProducts(filters = {}) {
    const { category, minPrice, maxPrice, search, isFeatured } = filters;
    
    const query = { isActive: true };

    if (category) query.category = category;
    if (isFeatured !== undefined) query.isFeatured = isFeatured;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    
    return products;
  }

  // Get products by category
  async getProductsByCategory(categoryId) {
    const products = await Product.find({ 
      category: categoryId, 
      isActive: true 
    })
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    
    return products;
  }

  // Get products by price range
  async getProductsByPriceRange(minPrice, maxPrice) {
    const products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
      isActive: true
    })
      .populate('category', 'name')
      .sort({ price: 1 });
    
    return products;
  }

  // Get single product details
  async getProductById(productId) {
    const product = await Product.findById(productId)
      .populate('category', 'name description');
    
    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  // Get featured products
  async getFeaturedProducts(limit = 10) {
    const products = await Product.find({ 
      isFeatured: true, 
      isActive: true 
    })
      .populate('category', 'name')
      .limit(limit)
      .sort({ createdAt: -1 });
    
    return products;
  }
}

module.exports = new ProductService();
