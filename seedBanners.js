const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import Banner model
const Banner = require('./models/Banner');

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

// Banner data matching the frontend manual slides
const bannersData = [
  {
    title: 'New Arrival - Spring Summer 2026',
    description: 'Browse our latest collection that defines the vibe of the new season',
    image: '/uploads/banners/hero-banner-1.png',
    link: '/new-arrivals',
    displayOrder: 1,
    isActive: true
  },
  {
    title: 'Trending Styles - Fashion Week 2026',
    description: 'Discover the hottest trends straight from the runway',
    image: '/uploads/banners/hero-banner-2.png',
    link: '/trending',
    displayOrder: 2,
    isActive: true
  },
  {
    title: 'Exclusive Sale - Up to 50% Off',
    description: 'Limited time offer on selected items - Don\'t miss out!',
    image: '/uploads/banners/hero-banner-3.png',
    link: '/categories',
    displayOrder: 3,
    isActive: true
  }
];

// Copy banner images from frontend to backend
const copyBannerImages = () => {
  const frontendPublicPath = path.join(__dirname, '../Fashion flesta-website/public');
  const backendUploadsPath = path.join(__dirname, 'uploads/banners');

  // Create uploads/banners directory if it doesn't exist
  if (!fs.existsSync(backendUploadsPath)) {
    fs.mkdirSync(backendUploadsPath, { recursive: true });
    console.log('✅ Created uploads/banners directory');
  }

  // Copy banner images
  const bannerImages = ['hero-banner-1.png', 'hero-banner-2.png', 'hero-banner-3.png'];
  
  bannerImages.forEach(imageName => {
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

// Seed banners to database
const seedBanners = async () => {
  try {
    await connectDB();

    // Copy images first
    console.log('\n📁 Copying banner images...');
    copyBannerImages();

    // Clear existing banners
    console.log('\n🗑️  Clearing existing banners...');
    await Banner.deleteMany({});
    console.log('✅ Existing banners cleared');

    // Insert new banners
    console.log('\n📝 Creating banners...');
    const banners = await Banner.insertMany(bannersData);
    
    console.log(`\n✅ Successfully created ${banners.length} banners!`);
    console.log('\nBanners created:');
    banners.forEach((banner, index) => {
      console.log(`${index + 1}. ${banner.title}`);
      console.log(`   - Image: ${banner.image}`);
      console.log(`   - Link: ${banner.link}`);
      console.log(`   - Active: ${banner.isActive}`);
    });

    console.log('\n🎉 Banner seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding banners:', error);
    process.exit(1);
  }
};

// Run the seed script
seedBanners();
