const { Order, Product } = require('../models');
const cartService = require('./cartService');

class OrderService {
  // Place a new order
  async placeOrder(userId, orderData) {
    const { items, shippingAddress, paymentMethod, upiTransactionId, orderNumber, paymentStatus, orderStatus } = orderData;

    // Calculate total amount and validate stock
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product || !product.isActive) {
        throw new Error(`Product ${item.product} not available`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order data object
    const orderDoc = {
      customer: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      upiTransactionId: upiTransactionId || '',
      paymentStatus: paymentStatus || (paymentMethod === 'COD' ? 'Pending' : 'Pending'),
      orderStatus: orderStatus || 'Pending'
    };

    // Only include orderNumber if provided (allows pre-save hook to generate it)
    if (orderNumber) {
      orderDoc.orderNumber = orderNumber;
    }

    const order = new Order(orderDoc);
    await order.save();

    // Clear user's cart
    await cartService.clearCart(userId);

    return order;
  }

  // Get customer order history
  async getCustomerOrders(userId) {
    const orders = await Order.find({ customer: userId })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    
    return orders;
  }

  // Get single order by ID
  async getOrderById(orderId, userId = null) {
    const query = { _id: orderId };
    if (userId) query.customer = userId;

    const order = await Order.findOne(query)
      .populate('items.product', 'name images price')
      .populate('customer', 'name email phone');
    
    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }
}

module.exports = new OrderService();
