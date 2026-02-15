const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import models
const Product = require('./models/Product');
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

// Seed products to database
const seedProducts = async () => {
  try {
    await connectDB();

    // Get existing categories
    const categories = await Category.find();
    if (categories.length === 0) {
      console.error('❌ No categories found. Please run seedCategories.js first.');
      process.exit(1);
    }

    // Map category names to IDs
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    console.log('\n📁 Category Map:', Object.keys(categoryMap));

    // Copy product images from frontend to backend
    const frontendPublicPath = path.join(__dirname, '../Fashion flesta-website/public');
    const backendUploadsPath = path.join(__dirname, 'uploads/products');

    // Create uploads/products directory if it doesn't exist
    if (!fs.existsSync(backendUploadsPath)) {
      fs.mkdirSync(backendUploadsPath, { recursive: true });
      console.log('✅ Created uploads/products directory');
    }

    // Define product images to copy
    const productImages = [
      'product-dress1.png', 'product-sweater.png', 'product-trousers.png',
      'product-top.png', 'product-kurti.png', 'product-skirt.png',
      'product-blazer.png', 'product-jumpsuit.png', 'product-cardigan.png',
      'product-jeans.png', 'product-maxi-dress.png', 'product-blouse.png',
      'product-palazzo.png', 'product-coat.png'
    ];

    // Copy images
    console.log('\n📁 Copying product images...');
    productImages.forEach(imageName => {
      const sourcePath = path.join(frontendPublicPath, imageName);
      const destPath = path.join(backendUploadsPath, imageName);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copied ${imageName}`);
      } else {
        console.log(`⚠️  ${imageName} not found`);
      }
    });

    // Products data - Featured Collection (8 products)
    const featuredProducts = [
      {
        name: 'Vintage Silk Floral Dress',
        description: 'Beautiful vintage-inspired floral dress made from premium silk',
        price: 2499,
        category: categoryMap['Dresses'],
        sizes: ['S', 'M', 'L', 'XL'],
        coverImage: '/uploads/products/product-dress1.png',
        images: ['/uploads/products/product-dress1.png'],
        stock: 25,
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Cashmere Knit Sweater',
        description: 'Cozy cashmere sweater perfect for chilly evenings',
        price: 1599,
        category: categoryMap['Western Wear'],
        sizes: ['S', 'M', 'L'],
        coverImage: '/uploads/products/product-sweater.png',
        images: ['/uploads/products/product-sweater.png'],
        stock: 30,
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Elegant Linen Trousers',
        description: 'Sophisticated linen trousers for a polished look',
        price: 1999,
        category: categoryMap['Western Wear'],
        sizes: ['S', 'M', 'L', 'XL'],
        coverImage: '/uploads/products/product-trousers.png',
        images: ['/uploads/products/product-trousers.png'],
        stock: 20,
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Embroidered Organza Top',
        description: 'Stunning embroidered top with delicate organza fabric',
        price: 2499,
        category: categoryMap['Designer Tops'],
        sizes: ['S', 'M', 'L'],
        coverImage: '/uploads/products/product-top.png',
        images: ['/uploads/products/product-top.png'],
        stock: 15,
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Traditional Pink Kurti',
        description: 'Classic pink kurti with traditional embroidery',
        price: 1499,
        category: categoryMap['Ethnic Wear'],
        sizes: ['S', 'M', 'L', 'XL'],
        coverImage: '/uploads/products/product-kurti.png',
        images: ['/uploads/products/product-kurti.png'],
        stock: 40,
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Pleated Midi Skirt',
        description: 'Elegant pleated midi skirt for versatile styling',
        price: 1699,
        category: categoryMap['Western Wear'],
        sizes: ['S', 'M', 'L'],
        coverImage: '/uploads/products/product-skirt.png',
        images: ['/uploads/products/product-skirt.png'],
        stock: 22,
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Linen Tailored Blazer',
        description: 'Professional tailored blazer in premium linen',
        price: 3999,
        category: categoryMap['Western Wear'],
        sizes: ['S', 'M', 'L', 'XL'],
        coverImage: '/uploads/products/product-blazer.png',
        images: ['/uploads/products/product-blazer.png'],
        stock: 12,
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Evening Black Jumpsuit',
        description: 'Chic black jumpsuit perfect for evening events',
        price: 2999,
        category: categoryMap['Western Wear'],
        sizes: ['S', 'M', 'L'],
        coverImage: '/uploads/products/product-jumpsuit.png',
        images: ['/uploads/products/product-jumpsuit.png'],
        stock: 18,
        isFeatured: true,
        isActive: true
      }
    ];

    // Latest Arrivals (8 products - not featured)
    const latestProducts = [
      {
        name: 'Cozy Beige Cardigan',
        description: 'Warm and cozy cardigan for everyday comfort',
        price: 2199,
        category: categoryMap['Western Wear'],
        sizes: ['S', 'M', 'L', 'XL'],
        coverImage: '/uploads/products/product-cardigan.png',
        images: ['/uploads/products/product-cardigan.png'],
        stock: 28,
        isFeatured: false,
        isActive: true
      },
      {
        name: 'High-Waisted Denim Jeans',
        description: 'Classic high-waisted denim jeans with perfect fit',
        price: 2499,
        category: categoryMap['Western Wear'],
        sizes: ['S', 'M', 'L', 'XL'],
        coverImage: '/uploads/products/product-jeans.png',
        images: ['/uploads/products/product-jeans.png'],
        stock: 35,
        isFeatured: false,
        isActive: true
      },
      {
        name: 'Floral Maxi Dress',
        description: 'Flowing maxi dress with beautiful floral print',
        price: 2999,
        category: categoryMap['Dresses'],
        sizes: ['S', 'M', 'L', 'XL'],
        coverImage: '/uploads/products/product-maxi-dress.png',
        images: ['/uploads/products/product-maxi-dress.png'],
        stock: 20,
        isFeatured: false,
        isActive: true
      },
      {
        name: 'Silk Bow Blouse',
        description: 'Elegant silk blouse with statement bow detail',
        price: 1899,
        category: categoryMap['Designer Tops'],
        sizes: ['S', 'M', 'L'],
        coverImage: '/uploads/products/product-blouse.png',
        images: ['/uploads/products/product-blouse.png'],
        stock: 16,
        isFeatured: false,
        isActive: true
      },
      {
        name: 'Mint Green Palazzo Pants',
        description: 'Comfortable palazzo pants in refreshing mint green',
        price: 1599,
        category: categoryMap['Ethnic Wear'],
        sizes: ['S', 'M', 'L', 'XL'],
        coverImage: '/uploads/products/product-palazzo.png',
        images: ['/uploads/products/product-palazzo.png'],
        stock: 24,
        isFeatured: false,
        isActive: true
      },
      {
        name: 'Elegant Wool Coat',
        description: 'Premium wool coat for winter elegance',
        price: 5999,
        category: categoryMap['Western Wear'],
        sizes: ['S', 'M', 'L'],
        coverImage: '/uploads/products/product-coat.png',
        images: ['/uploads/products/product-coat.png'],
        stock: 10,
        isFeatured: false,
        isActive: true
      },
      {
        name: 'Pink Cashmere Sweater',
        description: 'Soft pink cashmere sweater for ultimate comfort',
        price: 1599,
        category: categoryMap['Western Wear'],
        sizes: ['S', 'M', 'L'],
        coverImage: '/uploads/products/product-sweater.png',
        images: ['/uploads/products/product-sweater.png'],
        stock: 30,
        isFeatured: false,
        isActive: true
      },
      {
        name: 'Designer Tailored Trousers',
        description: 'Premium tailored trousers for professional look',
        price: 1999,
        category: categoryMap['Western Wear'],
        sizes: ['S', 'M', 'L', 'XL'],
        coverImage: '/uploads/products/product-trousers.png',
        images: ['/uploads/products/product-trousers.png'],
        stock: 20,
        isFeatured: false,
        isActive: true
      }
    ];

    // Clear existing products
    console.log('\n🗑️  Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Existing products cleared');

    // Insert products
    console.log('\n📝 Creating products...');
    const allProducts = [...featuredProducts, ...latestProducts];
    const products = await Product.insertMany(allProducts);
    
    const featuredCount = products.filter(p => p.isFeatured).length;
    const latestCount = products.filter(p => !p.isFeatured).length;

    console.log(`\n✅ Successfully created ${products.length} products!`);
    console.log(`   - Featured Collection: ${featuredCount} products`);
    console.log(`   - Latest Arrivals: ${latestCount} products`);

    console.log('\n🎉 Product seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding products:', error);
    process.exit(1);
  }
};

// Run the seed script
seedProducts();
