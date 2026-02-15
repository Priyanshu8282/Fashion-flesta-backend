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

  // Get user profile
  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user._id);
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user profile
  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user._id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
