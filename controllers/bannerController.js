const { bannerService } = require('../services');

class BannerController {
  // Get all active banners (public)
  async getAllActiveBanners(req, res, next) {
    try {
      const banners = await bannerService.getAllActiveBanners();
      
      res.status(200).json({
        success: true,
        count: banners.length,
        data: banners
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single banner (public)
  async getBannerById(req, res, next) {
    try {
      const banner = await bannerService.getBannerById(req.params.id);
      
      res.status(200).json({
        success: true,
        data: banner
      });
    } catch (error) {
      error.statusCode = 404;
      next(error);
    }
  }

  // Create banner (public - use with caution, consider making this admin-only)
  async createBanner(req, res, next) {
    try {
      // Validate required fields
      if (!req.body.title) {
        return res.status(400).json({
          success: false,
          message: 'Banner title is required'
        });
      }

      if (!req.body.image && !req.file) {
        return res.status(400).json({
          success: false,
          message: 'Banner image is required'
        });
      }

      const bannerData = {
        title: req.body.title,
        description: req.body.description,
        image: req.file ? `/uploads/banners/${req.file.filename}` : req.body.image,
        link: req.body.link,
        displayOrder: req.body.displayOrder || 0,
        isActive: req.body.isActive !== undefined ? 
          (req.body.isActive === 'true' || req.body.isActive === true) : true
      };

      const banner = await bannerService.createBanner(bannerData);
      
      res.status(201).json({
        success: true,
        message: 'Banner created successfully',
        data: banner
      });
    } catch (error) {
      next(error);
    }
  }

  // Update banner (public - use with caution, consider making this admin-only)
  async updateBanner(req, res, next) {
    try {
      const bannerData = {
        title: req.body.title,
        description: req.body.description,
        link: req.body.link,
        displayOrder: req.body.displayOrder,
        isActive: req.body.isActive === 'true' || req.body.isActive === true
      };

      // Add image path if file was uploaded
      if (req.file) {
        bannerData.image = `/uploads/banners/${req.file.filename}`;
      } else if (req.body.image) {
        bannerData.image = req.body.image;
      }

      const banner = await bannerService.updateBanner(
        req.params.id,
        bannerData
      );
      
      res.status(200).json({
        success: true,
        message: 'Banner updated successfully',
        data: banner
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BannerController();
