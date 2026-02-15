const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import Category model
const Category = require('./models/Category');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Category data matching the frontend manual categories
const categoriesData = [
  {
    name: 'Dresses',
    description: 'Elegant and stylish dresses for every occasion',
    image: '/uploads/categories/category-dresses.png',
    isActive: true
  },
  {
    name: 'Designer Tops',
    description: 'Trendy and fashionable designer tops',
    image: '/uploads/categories/category-tops.png',
    isActive: true
  },
  {
    name: 'Ethnic Wear',
    description: 'Traditional ethnic wear collection',
    image: '/uploads/categories/category-ethnic.png',
    isActive: true
  },
  {
    name: 'Western Wear',
    description: 'Modern Western wear for contemporary style',
    image: '/uploads/categories/category-western.png',
    isActive: true
  },
  {
    name: 'Accessories',
    description: 'Complete your look with our accessories',
    image: '/uploads/categories/category-accessories.png',
    isActive: true
  }
];

// Copy category images from frontend to backend
const copyCategoryImages = () => {
  const frontendPublicPath = path.join(__dirname, '../Fashion flesta-website/public');
  const backendUploadsPath = path.join(__dirname, 'uploads/categories');

  // Create uploads/categories directory if it doesn't exist
  if (!fs.existsSync(backendUploadsPath)) {
    fs.mkdirSync(backendUploadsPath, { recursive: true });
    console.log('✅ Created uploads/categories directory');
  }

  // Copy category images
  const categoryImages = [
    'category-dresses.png',
    'category-tops.png',
    'category-ethnic.png',
    'category-western.png',
    'category-accessories.png'
  ];
  
  categoryImages.forEach(imageName => {
    const sourcePath = path.join(frontendPublicPath, imageName);
    const destPath = path.join(backendUploadsPath, imageName);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied ${imageName}`);
    } else {
      console.log(`⚠️  ${imageName} not found in frontend public folder`);
    }
  });
};

// Seed categories to database
const seedCategories = async () => {
  try {
    await connectDB();

    // Copy images first
    console.log('\n📁 Copying category images...');
    copyCategoryImages();

    // Clear existing categories
    console.log('\n🗑️  Clearing existing categories...');
    await Category.deleteMany({});
    console.log('✅ Existing categories cleared');

    // Insert new categories
    console.log('\n📝 Creating categories...');
    const categories = await Category.insertMany(categoriesData);
    
    console.log(`\n✅ Successfully created ${categories.length} categories!`);
    console.log('\nCategories created:');
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name}`);
      console.log(`   - Image: ${category.image}`);
      console.log(`   - Active: ${category.isActive}`);
    });

    console.log('\n🎉 Category seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding categories:', error);
    process.exit(1);
  }
};

// Run the seed script
seedCategories();
