const { adminService } = require('../services');

class AdminController {
  // Dashboard statistics
  async getDashboard(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // ---CATEGORY MANAGEMENT---

  // Add category
  async addCategory(req, res, next) {
    try {
      const categoryData = {
        name: req.body.name,
        description: req.body.description,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true
      };

      // Add image path if file was uploaded
      if (req.file) {
        categoryData.image = `/uploads/categories/${req.file.filename}`;
      }

      const category = await adminService.addCategory(categoryData);
      
      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  // Update category
  async updateCategory(req, res, next) {
    try {
      const categoryData = {
        name: req.body.name,
        description: req.body.description,
        isActive: req.body.isActive
      };

      // Add image path if file was uploaded
      if (req.file) {
        categoryData.image = `/uploads/categories/${req.file.filename}`;
      }

      const category = await adminService.updateCategory(
        req.params.id,
        categoryData
      );
      
      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete category
  async deleteCategory(req, res, next) {
    try {
      await adminService.deleteCategory(req.params.id);
      
      res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Toggle category status
  async toggleCategoryStatus(req, res, next) {
    try {
      const { isActive } = req.body;
      const category = await adminService.toggleCategoryStatus(
        req.params.id,
        isActive
      );
      
      res.status(200).json({
        success: true,
        message: 'Category status updated',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  // ---PRODUCT MANAGEMENT---

  // Add product
  async addProduct(req, res, next) {
    try {
      const productData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        sizes: Array.isArray(req.body.sizes) ? req.body.sizes : JSON.parse(req.body.sizes || '[]'),
        stock: req.body.stock,
        isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
        isActive: req.body.isActive !== undefined ? (req.body.isActive === 'true' || req.body.isActive === true) : true
      };

      // Add cover image path if uploaded
      if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
        productData.coverImage = `/uploads/products/${req.files.coverImage[0].filename}`;
      }

      // Add image paths if files were uploaded
      if (req.files && req.files.images && req.files.images.length > 0) {
        productData.images = req.files.images.map(file => `/uploads/products/${file.filename}`);
      } else {
        productData.images = [];
      }

      const product = await adminService.addProduct(productData);
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  // Update product
  async updateProduct(req, res, next) {
    try {
      const productData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
        isActive: req.body.isActive === 'true' || req.body.isActive === true
      };

      // Handle sizes if provided
      if (req.body.sizes) {
        productData.sizes = Array.isArray(req.body.sizes) ? req.body.sizes : JSON.parse(req.body.sizes);
      }

      // Add new cover image path if uploaded
      if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
        productData.coverImage = `/uploads/products/${req.files.coverImage[0].filename}`;
      }

      // Add new image paths if files were uploaded
      if (req.files && req.files.images && req.files.images.length > 0) {
        productData.images = req.files.images.map(file => `/uploads/products/${file.filename}`);
      }

      const product = await adminService.updateProduct(
        req.params.id,
        productData
      );
      
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete product
  async deleteProduct(req, res, next) {
    try {
      await adminService.deleteProduct(req.params.id);
      
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Toggle product status
  async toggleProductStatus(req, res, next) {
    try {
      const { isActive } = req.body;
      const product = await adminService.toggleProductStatus(
        req.params.id,
        isActive
      );
      
      res.status(200).json({
        success: true,
        message: 'Product status updated',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  // ---ORDER MANAGEMENT---

  // Get all orders
  async getAllOrders(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        limit: req.query.limit
      };
      const orders = await adminService.getAllOrders(filters);
      
      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }

  // Update order status
  async updateOrderStatus(req, res, next) {
    try {
      const { orderStatus } = req.body;
      const order = await adminService.updateOrderStatus(
        req.params.id,
        orderStatus
      );
      
      res.status(200).json({
        success: true,
        message: 'Order status updated',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  // ---CUSTOMER MANAGEMENT---

  // Get all customers
  async getAllCustomers(req, res, next) {
    try {
      const customers = await adminService.getAllCustomers();
      
      res.status(200).json({
        success: true,
        count: customers.length,
        data: customers
      });
    } catch (error) {
      next(error);
    }
  }

  // Get customer by ID
  async getCustomerById(req, res, next) {
    try {
      const customer = await adminService.getCustomerById(req.params.id);
      
      res.status(200).json({
        success: true,
        data: customer
      });
    } catch (error) {
      next(error);
    }
  }

  // ---BANNER MANAGEMENT---

  // Get all banners (admin)
  async getAllBanners(req, res, next) {
    try {
      const banners = await adminService.getAllBanners();
      
      res.status(200).json({
        success: true,
        count: banners.length,
        data: banners
      });
    } catch (error) {
      next(error);
    }
  }

  // Add banner
  async addBanner(req, res, next) {
    try {
      // Validate required fields
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Banner image is required'
        });
      }

      const bannerData = {
        title: req.body.title,
        description: req.body.description,
        image: `/uploads/banners/${req.file.filename}`,
        link: req.body.link,
        displayOrder: req.body.displayOrder || 0,
        isActive: req.body.isActive !== undefined ? (req.body.isActive === 'true' || req.body.isActive === true) : true
      };

      const banner = await adminService.addBanner(bannerData);
      
      res.status(201).json({
        success: true,
        message: 'Banner created successfully',
        data: banner
      });
    } catch (error) {
      next(error);
    }
  }

  // Update banner
  async updateBanner(req, res, next) {
    try {
      const bannerData = {
        title: req.body.title,
        description: req.body.description,
        link: req.body.link,
        displayOrder: req.body.displayOrder,
        isActive: req.body.isActive === 'true' || req.body.isActive === true
      };

      // Add image path if file was uploaded
      if (req.file) {
        bannerData.image = `/uploads/banners/${req.file.filename}`;
      }

      const banner = await adminService.updateBanner(
        req.params.id,
        bannerData
      );
      
      res.status(200).json({
        success: true,
        message: 'Banner updated successfully',
        data: banner
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete banner
  async deleteBanner(req, res, next) {
    try {
      await adminService.deleteBanner(req.params.id);
      
      res.status(200).json({
        success: true,
        message: 'Banner deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Toggle banner status
  async toggleBannerStatus(req, res, next) {
    try {
      const { isActive } = req.body;
      const banner = await adminService.toggleBannerStatus(
        req.params.id,
        isActive
      );
      
      res.status(200).json({
        success: true,
        message: 'Banner status updated',
        data: banner
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
