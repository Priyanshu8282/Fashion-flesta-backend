const express = require('express');
const router = express.Router();
const { bannerController } = require('../../controllers');

// Public routes for banners
router.get('/', bannerController.getAllActiveBanners);
router.get('/:id', bannerController.getBannerById);

module.exports = router;
