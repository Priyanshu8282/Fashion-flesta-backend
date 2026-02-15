const mongoose = require('mongoose');
require('dotenv').config();

// Import Product model
const Product = require('./models/Product');

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

// Generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Update all products to add slugs
const updateProductSlugs = async () => {
  try {
    await connectDB();

    console.log('\n📝 Fetching all products...');
    const products = await Product.find({});
    
    console.log(`Found ${products.length} products`);
    
    let updated = 0;
    for (const product of products) {
      if (!product.slug) {
        product.slug = generateSlug(product.name);
        await product.save();
        console.log(`✅ Updated: ${product.name} -> ${product.slug}`);
        updated++;
      } else {
        console.log(`⏭️  Skipped: ${product.name} (already has slug: ${product.slug})`);
      }
    }

    console.log(`\n✅ Updated ${updated} products with slugs!`);
    console.log('🎉 All products now have slug field!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error updating products:', error);
    process.exit(1);
  }
};

// Run the update script
updateProductSlugs();
