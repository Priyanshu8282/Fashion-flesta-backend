const { Category, Product, Order, User, Banner } = require('../models');

class AdminService {
  // Dashboard statistics
  async getDashboardStats() {
    const [totalProducts, totalOrders, totalCategories, totalCustomers] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Category.countDocuments(),
      User.countDocuments({ role: 'customer' })
    ]);

    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      totalProducts,
      totalOrders,
      totalCategories,
      totalCustomers,
      recentOrders
    };
  }

  // Category Management
  async addCategory(categoryData) {
    const category = new Category(categoryData);
    await category.save();
    return category;
  }

  async updateCategory(categoryId, categoryData) {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      categoryData,
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async deleteCategory(categoryId) {
    // Check if category has products
    const productCount = await Product.countDocuments({ category: categoryId });
    
    if (productCount > 0) {
      throw new Error('Cannot delete category with existing products');
    }

    const category = await Category.findByIdAndDelete(categoryId);
    
    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async toggleCategoryStatus(categoryId, isActive) {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { isActive },
      { new: true }
    );

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  // Product Management
  async addProduct(productData) {
    const product = new Product(productData);
    await product.save();
    await product.populate('category', 'name');
    return product;
  }

  async updateProduct(productId, productData) {
    const product = await Product.findByIdAndUpdate(
      productId,
      productData,
      { new: true, runValidators: true }
    ).populate('category', 'name');

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async deleteProduct(productId) {
    const product = await Product.findByIdAndDelete(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async toggleProductStatus(productId, isActive) {
    const product = await Product.findByIdAndUpdate(
      productId,
      { isActive },
      { new: true }
    );

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  // Order Management
  async getAllOrders(filters = {}) {
    const { status, limit = 50 } = filters;
    const query = {};
    
    if (status) query.orderStatus = status;

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return orders;
  }

  async updateOrderStatus(orderId, orderStatus) {
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
    if (!validStatuses.includes(orderStatus)) {
      throw new Error('Invalid order status');
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  // Customer Management
  async getAllCustomers() {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    return customers;
  }

  async getCustomerById(customerId) {
    const customer = await User.findById(customerId).select('-password');
    
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Get customer's order count
    const orderCount = await Order.countDocuments({ customer: customerId });
    
    return {
      ...customer.toJSON(),
      orderCount
    };
  }

  // Banner Management
  async getAllBanners() {
    const banners = await Banner.find().sort({ displayOrder: 1 });
    return banners;
  }

  async addBanner(bannerData) {
    const banner = new Banner(bannerData);
    await banner.save();
    return banner;
  }

  async updateBanner(bannerId, bannerData) {
    const banner = await Banner.findByIdAndUpdate(
      bannerId,
      bannerData,
      { new: true, runValidators: true }
    );

    if (!banner) {
      throw new Error('Banner not found');
    }

    return banner;
  }

  async deleteBanner(bannerId) {
    const banner = await Banner.findByIdAndDelete(bannerId);
    
    if (!banner) {
      throw new Error('Banner not found');
    }

    return banner;
  }

  async toggleBannerStatus(bannerId, isActive) {
    const banner = await Banner.findByIdAndUpdate(
      bannerId,
      { isActive },
      { new: true }
    );

    if (!banner) {
      throw new Error('Banner not found');
    }

    return banner;
  }
}

module.exports = new AdminService();
