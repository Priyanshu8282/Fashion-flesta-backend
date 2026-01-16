# 🧪 Quick Testing Checklist - Fashion Flesta API

**Server:** http://localhost:5001

## Before You Start
1. ✅ Port changed from 5000 → 5001 (in .env)
2. ✅ Restart server: Stop current server and run `npm run dev`
3. ✅ Open Postman or Thunder Client
4. ✅ Keep this checklist open

---

## Step 1️⃣: Admin Login ✅

**POST** `http://localhost:5001/api/auth/admin/login`

```json
{
  "email": "admin@fashionflesta.com",
  "password": "admin123"
}
```

📝 **Save token as:** `ADMIN_TOKEN`

---

## Step 2️⃣: Create 3 Categories ✅

**POST** `http://localhost:5001/api/admin/categories`  
**Header:** `Authorization: Bearer ADMIN_TOKEN`  
**Body Type:** form-data

### Category 1: Wedding Dresses
```
name: Wedding Dresses
description: Beautiful wedding dresses for little princesses
isActive: true
```
📝 **Save ID as:** `CAT_WEDDING_ID`

### Category 2: Party Dresses  
```
name: Party Dresses
description: Elegant party wear for special occasions
isActive: true
```

### Category 3: Flower Girl Dresses
```
name: Flower Girl Dresses
description: Adorable dresses for flower girls
isActive: true
```
📝 **Save ID as:** `CAT_FLOWERGIRL_ID`

---

## Step 3️⃣: Add 4 Products ✅

**POST** `http://localhost:5001/api/admin/products`  
**Header:** `Authorization: Bearer ADMIN_TOKEN`  
**Body Type:** form-data

### Product 1: Princess White Wedding Dress
```
name: Princess White Wedding Dress
description: Elegant white princess-style wedding dress with lace details and beautiful train
price: 2499
category: {CAT_WEDDING_ID}
sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"]
stock: 25
isFeatured: true
```
📝 **Save ID as:** `PROD_1_ID`

### Product 2: Floral Lace Flower Girl Dress
```
name: Floral Lace Flower Girl Dress
description: Beautiful ivory flower girl dress with floral lace overlay and tulle skirt
price: 1899
category: {CAT_FLOWERGIRL_ID}
sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"]
stock: 30
isFeatured: true
```
📝 **Save ID as:** `PROD_2_ID`

### Product 3: Blush Pink Tulle Wedding Dress
```
name: Blush Pink Tulle Wedding Dress
description: Gorgeous blush pink tulle dress with sequin bodice and flowing layers
price: 2199
category: {CAT_WEDDING_ID}
sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"]
stock: 20
isFeatured: true
```
📝 **Save ID as:** `PROD_3_ID`

### Product 4: Golden Shimmer Party Dress
```
name: Golden Shimmer Party Dress
description: Stunning golden party dress with shimmer fabric and layered tulle skirt
price: 1599
category: {PARTY_CAT_ID}
sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"]
stock: 35
isFeatured: false
```

---

## Step 4️⃣: Customer Registration ✅

**POST** `http://localhost:5001/api/auth/register`

```json
{
  "name": "Priya Sharma",
  "email": "priya.sharma@example.com",
  "password": "priya123",
  "phone": "9876543210",
  "address": {
    "street": "123 MG Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

📝 **Save token as:** `CUSTOMER_TOKEN`

---

## Step 5️⃣: Browse Products (Public) ✅

**GET** `http://localhost:5001/api/categories` - View all categories  
**GET** `http://localhost:5001/api/products` - View all products  
**GET** `http://localhost:5001/api/products/featured` - Featured products  
**GET** `http://localhost:5001/api/products/{PROD_1_ID}` - Single product

---

## Step 6️⃣: Add to Wishlist ✅

**POST** `http://localhost:5001/api/wishlist`  
**Header:** `Authorization: Bearer CUSTOMER_TOKEN`

```json
{
  "productId": "{PROD_1_ID}"
}
```

**GET** `http://localhost:5001/api/wishlist` - View wishlist

---

## Step 7️⃣: Add to Cart ✅

**POST** `http://localhost:5001/api/cart`  
**Header:** `Authorization: Bearer CUSTOMER_TOKEN`

### Add Item 1
```json
{
  "productId": "{PROD_1_ID}",
  "quantity": 2,
  "size": "6-7Y"
}
```

### Add Item 2
```json
{
  "productId": "{PROD_3_ID}",
  "quantity": 2,
  "size": "8-9Y"
}
```

**GET** `http://localhost:5001/api/cart` - View cart

---

## Step 8️⃣: Place Order (COD) ✅

**POST** `http://localhost:5001/api/orders`  
**Header:** `Authorization: Bearer CUSTOMER_TOKEN`

```json
{
  "items": [
    {
      "product": "{PROD_1_ID}",
      "quantity": 2,
      "size": "6-7Y"
    },
    {
      "product": "{PROD_3_ID}",
      "quantity": 2,
      "size": "8-9Y"
    }
  ],
  "shippingAddress": {
    "name": "Priya Sharma",
    "phone": "9876543210",
    "street": "123 MG Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "COD"
}
```

**Expected Total:** ₹9,396 (2499×2 + 2199×2)

📝 **Save order ID as:** `ORDER_ID`

---

## Step 9️⃣: View Orders ✅

**GET** `http://localhost:5001/api/orders/my-orders`  
**Header:** `Authorization: Bearer CUSTOMER_TOKEN`

---

## Step 🔟: Admin Order Management ✅

**GET** `http://localhost:5001/api/admin/orders`  
**Header:** `Authorization: Bearer ADMIN_TOKEN`

### Update Order Status
**PATCH** `http://localhost:5001/api/admin/orders/{ORDER_ID}/status`

```json
{
  "orderStatus": "Processing"
}
```

---

## Step 1️⃣1️⃣: Admin Dashboard ✅

**GET** `http://localhost:5001/api/admin/dashboard`  
**Header:** `Authorization: Bearer ADMIN_TOKEN`

Should show:
- Total Products: 4
- Total Orders: 1
- Total Categories: 3
- Total Customers: 1

---

## ✅ All Tests Complete!

If everything works, you should have:
- ✅ 1 Admin account
- ✅ 3 Categories
- ✅ 4 Girl wedding dress products
- ✅ 1 Customer account
- ✅ Items in wishlist
- ✅ 1 Order placed with COD
- ✅ Order visible in admin panel

🎉 **Backend is fully functional!**
