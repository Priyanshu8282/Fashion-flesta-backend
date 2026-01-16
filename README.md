# Fashion Flesta E-commerce Backend API

Complete backend API for Fashion Flesta e-commerce platform with authentication, customer features, and admin management.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Edit .env file with your MongoDB connection string and JWT secret

# Start the server
npm start

# For development with auto-reload
npm run dev
```

Server runs on `http://localhost:5000` by default.

## 📋 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fashion_flesta
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication APIs

### Register Customer
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Customer registered successfully",
  "data": {
    "user": { ...user object },
    "token": "jwt_token_here"
  }
}
```

### Login Customer
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Admin Login
**POST** `/auth/admin/login`

**Body:**
```json
{
  "email": "admin@fashionflesta.com",
  "password": "admin123"
}
```

---

## 🏷️ Category APIs (Public)

### Get All Active Categories
**GET** `/categories`

### Get Single Category
**GET** `/categories/:id`

---

## 👗 Product APIs (Public)

### Get All Products
**GET** `/products`

**Query Parameters:**
- `category` - Filter by category ID
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search by name/description
- `isFeatured` - Filter featured products (true/false)

### Get Featured Products
**GET** `/products/featured?limit=10`

### Get Products by Price Range
**GET** `/products/price-range?minPrice=500&maxPrice=2000`

### Get Products by Category
**GET** `/products/category/:categoryId`

### Get Single Product
**GET** `/products/:id`

---

## 💖 Wishlist APIs (Protected)

**Headers Required:** `Authorization: Bearer <token>`

### Get Wishlist
**GET** `/wishlist`

### Add to Wishlist
**POST** `/wishlist`
```json
{
  "productId": "product_id_here"
}
```

### Remove from Wishlist
**DELETE** `/wishlist/:productId`

---

## 🛒 Cart APIs (Protected)

**Headers Required:** `Authorization: Bearer <token>`

### Get Cart
**GET** `/cart`

### Add to Cart
**POST** `/cart`
```json
{
  "productId": "product_id_here",
  "quantity": 2,
  "size": "M"
}
```

### Update Cart Item
**PUT** `/cart/:productId`
```json
{
  "quantity": 3,
  "size": "M"
}
```

### Remove from Cart
**DELETE** `/cart/:productId?size=M`

---

## 📦 Order APIs (Protected)

**Headers Required:** `Authorization: Bearer <token>`

### Place Order
**POST** `/orders`
```json
{
  "items": [
    {
      "product": "product_id",
      "quantity": 2,
      "size": "M"
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "9876543210",
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "UPI",
  "upiTransactionId": "TXN123456789"
}
```

**Payment Methods:** `UPI` or `COD`

### Get My Orders
**GET** `/orders/my-orders`

### Get Single Order
**GET** `/orders/:id`

---

## 🔧 Admin APIs (Protected - Admin Only)

**Headers Required:** `Authorization: Bearer <admin_token>`

### Dashboard Stats
**GET** `/admin/dashboard`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 150,
    "totalOrders": 320,
    "totalCategories": 12,
    "totalCustomers": 450,
    "recentOrders": [...]
  }
}
```

### Category Management

#### Add Category
**POST** `/admin/categories`

**Content-Type:** `multipart/form-data`

**Form Data:**
```
name: Dresses
description: Beautiful dresses for all occasions
image: [Select image file]
isActive: true
```

**Supported Image Formats:** jpeg, jpg, png, gif, webp  
**Max File Size:** 5MB

#### Update Category
**PUT** `/admin/categories/:id`

**Content-Type:** `multipart/form-data`

**Form Data:**
```
name: Updated Name (optional)
description: Updated description (optional)
image: [Select new image file] (optional)
```

#### Delete Category
**DELETE** `/admin/categories/:id`

#### Toggle Category Status
**PATCH** `/admin/categories/:id/status`
```json
{
  "isActive": false
}
```

### Product Management

#### Add Product
**POST** `/admin/products`

**Content-Type:** `multipart/form-data`

**Form Data:**
```
name: Floral Summer Dress
description: Beautiful floral dress
price: 1299
category: category_id_here
sizes: ["S", "M", "L", "XL"]
stock: 50
isFeatured: true
images: [Select multiple image files - max 5]
```

**Supported Image Formats:** jpeg, jpg, png, gif, webp  
**Max File Size:** 5MB per image  
**Max Images:** 5 images per product

**Note:** When sending `sizes` in form-data, use JSON string format.

#### Update Product
**PUT** `/admin/products/:id`

**Content-Type:** `multipart/form-data`

**Form Data:**
```
name: Updated Product Name (optional)
description: Updated description (optional)
price: 1499 (optional)
images: [Select new images] (optional - replaces existing)
```

#### Delete Product
**DELETE** `/admin/products/:id`

#### Toggle Product Status
**PATCH** `/admin/products/:id/status`
```json
{
  "isActive": false
}
```

### Order Management

#### Get All Orders
**GET** `/admin/orders?status=Pending&limit=50`

**Query Parameters:**
- `status` - Filter by order status (Pending, Processing, Shipped, Delivered, Cancelled)
- `limit` - Number of orders to return

#### Update Order Status
**PATCH** `/admin/orders/:id/status`
```json
{
  "orderStatus": "Shipped"
}
```

**Valid statuses:** `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`

### Customer Management

#### Get All Customers
**GET** `/admin/customers`

#### Get Customer by ID
**GET** `/admin/customers/:id`

---

## 🗂️ Project Structure

```
Fashion-flesta-backend/
├── models/              # Database schemas
├── services/            # Business logic layer
├── controllers/         # Request handlers
├── routes/
│   ├── public/         # Public routes
│   └── private/        # Protected routes
├── middlewares/        # Auth & error handling
├── utils/              # Helpers & validators
├── config/             # Database connection
├── uploads/            # File uploads
└── app.js              # Express app
```

## 🔒 Authentication Flow

1. User registers/logs in → Receives JWT token
2. Include token in requests: `Authorization: Bearer <token>`
3. Server validates token and attaches user to request
4. Admin routes check for admin role

## ⚡ Features

✅ JWT Authentication  
✅ Role-based Access Control (Customer/Admin)  
✅ Password Hashing (bcrypt)  
✅ Input Validation  
✅ Error Handling  
✅ MongoDB with Mongoose  
✅ Service Layer Architecture  
✅ Barrel Exports for Clean Imports  
✅ **File Upload with Multer** (Category & Product Images)  
✅ **Image Validation** (Type & Size)

## 🛠️ Tech Stack

- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcryptjs
- **Validation:** express-validator
- **CORS:** Enabled for frontend integration

## 📝 Notes

- Default admin must be created manually in the database or use seed script
- **Product & Category images uploaded via Multer** (stored in `uploads/` folder)
- Supported image formats: jpeg, jpg, png, gif, webp (max 5MB)
- Use **form-data** (not JSON) when uploading images in Postman
- UPI payment is tracked via transaction ID only (no actual integration)
- COD orders created with "Pending" payment status
- Images served as static files from `/uploads` route

## 🧪 Testing

Use Postman, Thunder Client, or any API testing tool to test endpoints.

1. Register a customer
2. Login to get token
3. Test protected routes with token
4. Login as admin to test admin routes

---

**Fashion Flesta Backend v1.0** - Built with ❤️ for e-commerce
