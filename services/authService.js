const { User } = require('../models');
const { generateToken } = require('../utils/jwtHelper');

class AuthService {
  // Register a new customer
  async registerCustomer(userData) {
    const { name, email, password, phone, address } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      address,
      role: 'customer'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    return {
      user: user.toJSON(),
      token
    };
  }

  // Login customer
  async loginCustomer(email, password) {
    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is a customer
    if (user.role !== 'customer') {
      throw new Error('Invalid credentials');
    }

    // Check if account is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Compare password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    return {
      user: user.toJSON(),
      token
    };
  }

  // Login admin
  async loginAdmin(email, password) {
    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid admin credentials');
    }

    // Check if user is an admin
    if (user.role !== 'admin') {
      throw new Error('Invalid admin credentials');
    }

    // Compare password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new Error('Invalid admin credentials');
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    return {
      user: user.toJSON(),
      token
    };
  }

  // Register admin
  async registerAdmin(userData) {
    const { name, email, password, phone, address } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new admin user
    const user = new User({
      name,
      email,
      password,
      phone,
      address,
      role: 'admin' // Set role as admin
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    return {
      user: user.toJSON(),
      token
    };
  }

  // Get user profile
  async getProfile(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user.toJSON();
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    const { name, phone } = updateData;

    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Update allowed fields
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    return user.toJSON();
  }
}

module.exports = new AuthService();
