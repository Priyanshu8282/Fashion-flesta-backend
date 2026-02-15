const { User } = require('../models');

class AddressService {
  // Get all addresses for a user
  async getAddresses(userId) {
    const user = await User.findById(userId).select('addresses');
    if (!user) {
      throw new Error('User not found');
    }
    return user.addresses || [];
  }

  // Get single address by ID
  async getAddressById(userId, addressId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const address = user.addresses.id(addressId);
    if (!address) {
      throw new Error('Address not found');
    }
    
    return address;
  }

  // Create new address
  async createAddress(userId, addressData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // If this is the first address or marked as default, set as default
    if (user.addresses.length === 0 || addressData.isDefault) {
      // Remove default from other addresses
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
      addressData.isDefault = true;
    }

    user.addresses.push(addressData);
    await user.save();
    
    return user.addresses[user.addresses.length - 1];
  }

  // Update address
  async updateAddress(userId, addressId, addressData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      throw new Error('Address not found');
    }

    // If setting as default, remove default from others
    if (addressData.isDefault) {
      user.addresses.forEach(addr => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
    }

    // Update address fields
    Object.keys(addressData).forEach(key => {
      address[key] = addressData[key];
    });

    await user.save();
    return address;
  }

  // Delete address
  async deleteAddress(userId, addressId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      throw new Error('Address not found');
    }

    const wasDefault = address.isDefault;
    address.remove();
    
    // If deleted address was default and there are other addresses, set first one as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    return user.addresses;
  }

  // Set address as default
  async setDefaultAddress(userId, addressId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      throw new Error('Address not found');
    }

    // Remove default from all addresses
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });

    // Set this address as default
    address.isDefault = true;
    await user.save();
    
    return address;
  }
}

module.exports = new AddressService();
