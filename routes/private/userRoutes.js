const express = require('express');
const router = express.Router();
const { authController } = require('../../controllers');
const { auth } = require('../../middlewares');

// All user routes are protected
router.use(auth);

// Get user profile
router.get('/profile', authController.getProfile);

// Update user profile
router.put('/profile', authController.updateProfile);

module.exports = router;
