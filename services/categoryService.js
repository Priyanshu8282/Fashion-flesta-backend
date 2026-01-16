const { Category } = require('../models');

class CategoryService {
  // Get all active categories (public)
  async getAllActiveCategories() {
    const categories = await Category.find({ isActive: true })
      .select('name description image')
      .sort({ name: 1 });
    
    return categories;
  }

  // Get single category (public)
  async getCategoryById(categoryId) {
    const category = await Category.findById(categoryId);
    
    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }
}

module.exports = new CategoryService();
