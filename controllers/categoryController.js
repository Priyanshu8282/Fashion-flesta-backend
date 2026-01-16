const { categoryService } = require('../services');

class CategoryController {
  // Get all active categories (public)
  async getAllActiveCategories(req, res, next) {
    try {
      const categories = await categoryService.getAllActiveCategories();
      
      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single category (public)
  async getCategoryById(req, res, next) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      
      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      error.statusCode = 404;
      next(error);
    }
  }
}

module.exports = new CategoryController();
