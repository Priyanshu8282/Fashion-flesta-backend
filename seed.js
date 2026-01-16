require('dotenv').config();
const mongoose = require('mongoose');
const { User, Category, Product } = require('./models');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // await Category.deleteMany({});
    // await Product.deleteMany({});

    // Create Admin User
    const adminExists = await User.findOne({ email: 'admin@fashionflesta.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin',
        email: 'admin@fashionflesta.com',
        password: 'admin123',
        role: 'admin',
        phone: '9999999999'
      });
      await admin.save();
      console.log('✅ Admin user created - Email: admin@fashionflesta.com, Password: admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create Sample Categories
    const categories = [
      { name: 'Dresses', description: 'Beautiful dresses for all occasions', isActive: true },
      { name: 'Tops', description: 'Stylish tops and blouses', isActive: true },
      { name: 'Bottoms', description: 'Pants, skirts, and shorts', isActive: true },
      { name: 'Accessories', description: 'Fashion accessories', isActive: true }
    ];

    const createdCategories = [];
    for (const catData of categories) {
      const exists = await Category.findOne({ name: catData.name });
      if (!exists) {
        const category = await Category.create(catData);
        createdCategories.push(category);
        console.log(`✅ Category created: ${category.name}`);
      } else {
        createdCategories.push(exists);
        console.log(`ℹ️  Category already exists: ${exists.name}`);
      }
    }

    // Create Sample Products
    const sampleProducts = [
      {
        name: 'Floral Summer Dress',
        description: 'Beautiful floral print summer dress perfect for casual outings',
        price: 1299,
        category: createdCategories[0]._id,
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['https://via.placeholder.com/400x500?text=Floral+Dress'],
        stock: 50,
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Casual Cotton Top',
        description: 'Comfortable cotton top for everyday wear',
        price: 599,
        category: createdCategories[1]._id,
        sizes: ['S', 'M', 'L'],
        images: ['https://via.placeholder.com/400x500?text=Cotton+Top'],
        stock: 100,
        isFeatured: false,
        isActive: true
      },
      {
        name: 'High Waist Jeans',
        description: 'Trendy high waist denim jeans',
        price: 1499,
        category: createdCategories[2]._id,
        sizes: ['28', '30', '32', '34'],
        images: ['https://via.placeholder.com/400x500?text=Jeans'],
        stock: 75,
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Designer Handbag',
        description: 'Elegant designer handbag for special occasions',
        price: 2499,
        category: createdCategories[3]._id,
        sizes: ['Free Size'],
        images: ['https://via.placeholder.com/400x500?text=Handbag'],
        stock: 30,
        isFeatured: true,
        isActive: true
      }
    ];

    for (const prodData of sampleProducts) {
      const exists = await Product.findOne({ name: prodData.name });
      if (!exists) {
        await Product.create(prodData);
        console.log(`✅ Product created: ${prodData.name}`);
      } else {
        console.log(`ℹ️  Product already exists: ${prodData.name}`);
      }
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin Email: admin@fashionflesta.com');
    console.log('Admin Password: admin123');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
