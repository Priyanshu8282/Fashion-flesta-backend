const express = require('express');
const router = express.Router();
const { bannerController } = require('../../controllers');
const { uploadBannerImage } = require('../../utils');

// Public routes for banners

// GET all active banners
router.get('/', bannerController.getAllActiveBanners);

// GET single banner by ID
router.get('/:id', bannerController.getBannerById);

// POST create new banner (with image upload)
// WARNING: This is a public route - consider adding authentication for production
router.post('/', uploadBannerImage, bannerController.createBanner);

// PUT update existing banner (with optional image upload)
// WARNING: This is a public route - consider adding authentication for production
router.put('/:id', uploadBannerImage, bannerController.updateBanner);

module.exports = router;
