const { orderService } = require('../services');

class OrderController {
  // Place order
  async placeOrder(req, res, next) {
    try {
      const orderData = {
        items: req.body.items,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        upiTransactionId: req.body.upiTransactionId,
        orderNumber: req.body.orderNumber, // Optional: custom order number
        paymentStatus: req.body.paymentStatus, // Optional: payment status
        orderStatus: req.body.orderStatus // Optional: order status
      };

      const order = await orderService.placeOrder(req.user._id, orderData);
      
      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  // Get customer order history
  async getMyOrders(req, res, next) {
    try {
      const orders = await orderService.getCustomerOrders(req.user._id);
      
      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single order
  async getOrderById(req, res, next) {
    try {
      const order = await orderService.getOrderById(
        req.params.id,
        req.user._id
      );
      
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      error.statusCode = 404;
      next(error);
    }
  }
}

module.exports = new OrderController();
