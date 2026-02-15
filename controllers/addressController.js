const { addressService } = require('../services');

class AddressController {
  // Get all addresses
  async getAddresses(req, res, next) {
    try {
      const addresses = await addressService.getAddresses(req.user._id);
      
      res.status(200).json({
        success: true,
        count: addresses.length,
        data: addresses
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single address
  async getAddress(req, res, next) {
    try {
      const address = await addressService.getAddressById(req.user._id, req.params.id);
      
      res.status(200).json({
        success: true,
        data: address
      });
    } catch (error) {
      next(error);
    }
  }

  // Create address
  async createAddress(req, res, next) {
    try {
      const address = await addressService.createAddress(req.user._id, req.body);
      
      res.status(201).json({
        success: true,
        message: 'Address created successfully',
        data: address
      });
    } catch (error) {
      next(error);
    }
  }

  // Update address
  async updateAddress(req, res, next) {
    try {
      const address = await addressService.updateAddress(
        req.user._id,
        req.params.id,
        req.body
      );
      
      res.status(200).json({
        success: true,
        message: 'Address updated successfully',
        data: address
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete address
  async deleteAddress(req, res, next) {
    try {
      const addresses = await addressService.deleteAddress(req.user._id, req.params.id);
      
      res.status(200).json({
        success: true,
        message: 'Address deleted successfully',
        data: addresses
      });
    } catch (error) {
      next(error);
    }
  }

  // Set default address
  async setDefaultAddress(req, res, next) {
    try {
      const address = await addressService.setDefaultAddress(req.user._id, req.params.id);
      
      res.status(200).json({
        success: true,
        message: 'Default address updated',
        data: address
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AddressController();
