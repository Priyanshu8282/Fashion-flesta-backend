const { categoryService } = require('../services');

class CategoryController {
  // Get all categories
  async getAllCategories(req, res, next) {
    try {
      const filters = {
        search: req.query.search,
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        isAdmin: req.originalUrl.includes('/admin')
      };

      const result = await categoryService.getAllCategories(filters);
      
      res.status(200).json({
        success: true,
        count: result.categories.length,
        pagination: result.pagination,
        data: result.categories
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

  // Get category by name (public)
  async getCategoryByName(req, res, next) {
    try {
      const category = await categoryService.getCategoryByName(req.params.name);
      
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
