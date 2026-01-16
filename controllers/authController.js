const { authService } = require('../services');

class AuthController {
  // Register customer
  async registerCustomer(req, res, next) {
    try {
      const result = await authService.registerCustomer(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Customer registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Login customer
  async loginCustomer(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginCustomer(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      error.statusCode = 401;
      next(error);
    }
  }

  // Login admin
  async loginAdmin(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginAdmin(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Admin login successful',
        data: result
      });
    } catch (error) {
      error.statusCode = 401;
      next(error);
    }
  }

  // Register admin
  async registerAdmin(req, res, next) {
    try {
      const result = await authService.registerAdmin(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Admin registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
