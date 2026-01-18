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
}

module.exports = new BannerController();
