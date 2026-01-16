const { productService } = require('../services');

class ProductController {
  // Get all products with filters
  async getAllProducts(req, res, next) {
    try {
      const filters = {
        category: req.query.category,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        search: req.query.search,
        isFeatured: req.query.isFeatured
      };

      const products = await productService.getAllProducts(filters);
      
      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  // Get products by category
  async getProductsByCategory(req, res, next) {
    try {
      const products = await productService.getProductsByCategory(req.params.categoryId);
      
      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  // Get products by price range
  async getProductsByPriceRange(req, res, next) {
    try {
      const { minPrice, maxPrice } = req.query;
      
      if (!minPrice || !maxPrice) {
        return res.status(400).json({
          success: false,
          message: 'minPrice and maxPrice are required'
        });
      }

      const products = await productService.getProductsByPriceRange(
        parseFloat(minPrice),
        parseFloat(maxPrice)
      );
      
      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single product
  async getProductById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      error.statusCode = 404;
      next(error);
    }
  }

  // Get featured products
  async getFeaturedProducts(req, res, next) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const products = await productService.getFeaturedProducts(limit);
      
      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
