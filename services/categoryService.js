const { Category } = require('../models');

class CategoryService {
  // Get all categories with filters (search, pagination)
  async getAllCategories(filters = {}) {
    const { search, page = 1, limit = 10, isAdmin = false } = filters;
    
    const query = isAdmin ? {} : { isActive: true };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Use aggregation to count products in each category
    const categories = await Category.aggregate([
      { $match: query },
      { $sort: { name: 1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $addFields: {
          productCount: { $size: '$products' }
        }
      },
      {
        $project: {
          products: 0
        }
      }
    ]);
    
    const totalItems = await Category.countDocuments(query);
    
    return {
      categories,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    };
  }

  // Get single category (public)
  async getCategoryById(categoryId) {
    const category = await Category.findById(categoryId);
    
    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  // Get category by name (public)
  async getCategoryByName(categoryName) {
    // Convert URL-friendly name to title case and match
    const searchName = categoryName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    const category = await Category.findOne({ 
      name: { $regex: new RegExp(`^${searchName}$`, 'i') },
      isActive: true 
    });
    
    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }
}

module.exports = new CategoryService();
