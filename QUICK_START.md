# 🚀 Quick Start Guide - Fashion Flesta Backend

## Server Information
- **Port:** 5001
- **Base URL:** http://localhost:5001
- **Environment:** Development

## 📦 Start Server

```bash
cd "c:\Users\hp\Desktop\Fashion flesta\Fashion flesta-backend"
npm run dev
```

Server will start on **http://localhost:5001**

## ✅ Quick Health Check

Open browser or Postman:
```
GET http://localhost:5001/
```

Should return:
```json
{
  "success": true,
  "message": "Welcome to Fashion Flesta API - Girls Wear E-commerce",
  "version": "1.0.0",
  "timestamp": "..."
}
```

## 🔑 Default Admin Credentials

Run seed script first (if not done):
```bash
node seed.js
```

**Admin Login:**
- Email: `admin@fashionflesta.com`
- Password: `admin123`

## 📚 Available Documentation

1. **[README.md](README.md)** - Complete API documentation
2. **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** - Quick testing checklist
3. **[Manual Testing Guide](../../../.gemini/antigravity/brain/402b3b8a-838b-492a-88b8-8141c0dee84c/manual_testing_guide.md)** - Step-by-step testing with sample data
4. **[FILE_UPLOAD_TESTING.md](FILE_UPLOAD_TESTING.md)** - Image upload guide

## 🧪 Quick Test Flow

1. **Admin Login** → `POST /api/auth/admin/login`
2. **Create Category** → `POST /api/admin/categories`
3. **Add Product** → `POST /api/admin/products`
4. **Customer Register** → `POST /api/auth/register`
5. **Browse Products** → `GET /api/products`
6. **Add to Cart** → `POST /api/cart`
7. **Place Order** → `POST /api/orders`

## 📁 Project Structure

```
Fashion-flesta-backend/
├── models/           # Database schemas
├── services/         # Business logic
├── controllers/      # Request handlers
├── routes/
│   ├── public/      # Public APIs
│   └── private/     # Protected APIs
├── middlewares/      # Auth & validation
├── utils/           # Helpers & uploads
└── uploads/         # Uploaded images
```

## 🎯 All Endpoints

### Public APIs (No Auth)
- POST `/api/auth/register` - Customer registration
- POST `/api/auth/login` - Customer login
- POST `/api/auth/admin/login` - Admin login
- GET `/api/categories` - All categories
- GET `/api/products` - All products
- GET `/api/products/featured` - Featured products
- GET `/api/products/:id` - Single product

### Customer APIs (Auth Required)
- GET `/api/wishlist` - Get wishlist
- POST `/api/wishlist` - Add to wishlist
- DELETE `/api/wishlist/:id` - Remove from wishlist
- GET `/api/cart` - Get cart
- POST `/api/cart` - Add to cart
- PUT `/api/cart/:id` - Update cart
- DELETE `/api/cart/:id` - Remove from cart
- POST `/api/orders` - Place order
- GET `/api/orders/my-orders` - Order history

### Admin APIs (Admin Auth Required)
- GET `/api/admin/dashboard` - Dashboard stats
- POST `/api/admin/categories` - Add category
- PUT `/api/admin/categories/:id` - Update category
- DELETE `/api/admin/categories/:id` - Delete category
- PATCH `/api/admin/categories/:id/status` - Toggle status
- POST `/api/admin/products` - Add product
- PUT `/api/admin/products/:id` - Update product
- DELETE `/api/admin/products/:id` - Delete product
- PATCH `/api/admin/products/:id/status` - Toggle status
- GET `/api/admin/orders` - All orders
- PATCH `/api/admin/orders/:id/status` - Update order status
- GET `/api/admin/customers` - All customers
- GET `/api/admin/customers/:id` - Customer details

## 🔧 Environment Variables

Check `.env` file:
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

## 📝 Notes
- All admin routes require admin authentication
- All customer routes require customer authentication
- File uploads use multipart/form-data
- Images stored in `uploads/` directory
- MongoDB connection must be active

## 🆘 Troubleshooting

**Port already in use?**
- Change PORT in `.env` file
- Restart server

**MongoDB connection error?**
- Check MONGO_URI in `.env`
- Ensure MongoDB is running

**Authentication error?**
- Check JWT_SECRET is set
- Verify token in Authorization header

**File upload error?**
- Use form-data, not JSON
- Check file size (max 5MB)
- Verify image format (jpg, png, etc)

---

**Ready to test?** Follow the [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) for step-by-step API testing! 🚀
