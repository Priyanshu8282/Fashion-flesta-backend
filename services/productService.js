const { Product } = require('../models');

class ProductService {
  // Get all products with optional filters
  async getAllProducts(filters = {}) {
    const { category, minPrice, maxPrice, search, isFeatured, page = 1, limit = 10, isAdmin = false } = filters;
    
    const query = isAdmin ? {} : { isActive: true };

    if (category) query.category = category;
    if (isFeatured !== undefined) query.isFeatured = isFeatured;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      // Find categories matching the search term to include in search
      const { Category } = require('../models');
      const matchingCategories = await Category.find({ 
        name: { $regex: search, $options: 'i' } 
      }).select('_id');
      
      const categoryIds = matchingCategories.map(cat => cat._id);

      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $in: categoryIds } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalItems = await Product.countDocuments(query);
    
    return {
      products,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    };
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

  // Get product by slug
  async getProductBySlug(slug) {
    const product = await Product.findOne({ slug, isActive: true })
      .populate('category', 'name description');
    
    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  // Get related products (same category, exclude current product)
  async getRelatedProducts(productId, categoryId, limit = 4) {
    const products = await Product.find({
      _id: { $ne: productId },
      category: categoryId,
      isActive: true
    })
      .populate('category', 'name')
      .limit(limit)
      .sort({ createdAt: -1 });
    
    return products;
  }

  // Search products by name or description
  async searchProducts(searchQuery) {
    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ]
    })
      .select('_id name slug price images stock')
      .limit(10)
      .sort({ name: 1 });
    
    return products;
  }
}

module.exports = new ProductService();
