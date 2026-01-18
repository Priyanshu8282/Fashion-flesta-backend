const Banner = require('../models/Banner');

class BannerService {
  // Get all active banners (public)
  async getAllActiveBanners() {
    const banners = await Banner.find({ isActive: true }).sort({ displayOrder: 1 });
    return banners;
  }

  // Get all banners (admin)
  async getAllBanners() {
    const banners = await Banner.find().sort({ displayOrder: 1 });
    return banners;
  }

  // Get single banner
  async getBannerById(id) {
    const banner = await Banner.findById(id);
    if (!banner) {
      throw new Error('Banner not found');
    }
    return banner;
  }

  // Create banner (admin)
  async createBanner(bannerData) {
    const banner = await Banner.create(bannerData);
    return banner;
  }

  // Update banner (admin)
  async updateBanner(id, updateData) {
    const banner = await Banner.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!banner) {
      throw new Error('Banner not found');
    }

    return banner;
  }

  // Delete banner (admin)
  async deleteBanner(id) {
    const banner = await Banner.findByIdAndDelete(id);
    
    if (!banner) {
      throw new Error('Banner not found');
    }

    return banner;
  }

  // Toggle banner status (admin)
  async toggleBannerStatus(id) {
    const banner = await Banner.findById(id);
    
    if (!banner) {
      throw new Error('Banner not found');
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    return banner;
  }
}

module.exports = new BannerService();
