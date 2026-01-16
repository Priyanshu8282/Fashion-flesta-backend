const express = require('express');
const router = express.Router();
const { authController } = require('../../controllers');
const { validateRegistration, validateLogin, checkValidationResult } = require('../../utils/validator');

// Customer registration
router.post(
  '/register',
  validateRegistration,
  checkValidationResult,
  authController.registerCustomer
);

// Customer login
router.post(
  '/login',
  validateLogin,
  checkValidationResult,
  authController.loginCustomer
);

// Admin login
router.post(
  '/admin/login',
  validateLogin,
  checkValidationResult,
  authController.loginAdmin
);

module.exports = router;
