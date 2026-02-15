const { Category, Product, Order, User, Banner } = require('../models');

class AdminService {
  // Dashboard statistics
  async getDashboardStats(startDate, endDate) {
    const matchQuery = { orderStatus: { $ne: 'Cancelled' } };
    
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchQuery.createdAt.$lte = end;
      }
    }

    const [totalProducts, totalOrdersCount, totalCategories, totalCustomers] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(startDate || endDate ? { createdAt: matchQuery.createdAt } : {}),
      Category.countDocuments(),
      User.countDocuments({ role: 'customer' })
    ]);

    // Calculate total revenue (filtered by date if provided, and non-cancelled)
    const revenueData = await Order.aggregate([
      { $match: matchQuery },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Get trend data for the period
    let dateRangeMatch = { orderStatus: { $ne: 'Cancelled' } };
    if (startDate || endDate) {
      dateRangeMatch.createdAt = matchQuery.createdAt;
    } else {
      // Default to last 30 days if no range provided
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateRangeMatch.createdAt = { $gte: thirtyDaysAgo };
    }

    const dailyStats = await Order.aggregate([
      { $match: dateRangeMatch },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const recentOrders = await Order.find(startDate || endDate ? { createdAt: matchQuery.createdAt } : {})
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get order counts by status
    const statusCountsData = await Order.aggregate([
      { $match: startDate || endDate ? { createdAt: matchQuery.createdAt } : {} },
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);
    const statusCounts = {};
    statusCountsData.forEach(item => {
      statusCounts[item._id] = item.count;
    });

    return {
      totalProducts,
      totalOrders: totalOrdersCount,
      totalCategories,
      totalCustomers,
      totalRevenue,
      statusCounts,
      dailyStats,
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
    const { status, search, page = 1, limit = 10 } = filters;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const match = {};
    
    if (status) match.orderStatus = status;

    if (search) {
      match.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'customer',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $project: {
          'customer.password': 0,
          'customer.role': 0
        }
      }
    ]);

    const countPipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'customer',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      { $match: match },
      { $count: 'count' }
    ];

    const totalItems = await Order.aggregate(countPipeline);

    return {
      orders,
      pagination: {
        totalItems: totalItems[0]?.count || 0,
        totalPages: Math.ceil((totalItems[0]?.count || 0) / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    };
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
  async getAllCustomers(filters = {}) {
    const { search, page = 1, limit = 10 } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const query = { role: 'customer' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalItems = await User.countDocuments(query);

    return {
      customers,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    };
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
  async getAllBanners(filters = {}) {
    const { page = 1, limit = 10 } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const banners = await Banner.find()
      .sort({ displayOrder: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalItems = await Banner.countDocuments();

    return {
      banners,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    };
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
