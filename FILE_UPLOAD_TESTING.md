# Multer File Upload - Quick Reference

## 📤 Upload Endpoints

### Category Image Upload
- **Endpoint:** `POST /api/admin/categories`
- **Field Name:** `image` (single file)
- **Content-Type:** `multipart/form-data`

### Product Images Upload
- **Endpoint:** `POST /api/admin/products`
- **Field Name:** `images` (multiple files, max 5)
- **Content-Type:** `multipart/form-data`

## ✅ Validation Rules

- **Allowed Formats:** jpeg, jpg, png, gif, webp
- **Max File Size:** 5MB per file
- **Max Product Images:** 5 per product
- **Category Images:** 1 per category

## 📁 Storage Locations

- **Categories:** `uploads/categories/`
- **Products:** `uploads/products/`
- **URL Format:** `/uploads/categories/category-1234567890.jpg`

## 🧪 Testing in Postman

1. **Select Request Type:** POST/PUT
2. **Set URL:** `http://localhost:5000/api/admin/categories` or `/products`
3. **Add Header:** `Authorization: Bearer <your_admin_token>`
4. **Select Body Type:** form-data
5. **Add Text Fields:** name, description, price, etc.
6. **Add File Field:** 
   - Categories: Use key `image` and select 1 file
   - Products: Use key `images` and select up to 5 files
7. **Send Request**

## 💡 Form-Data Field Examples

### Category
```
name: "Dresses"
description: "Beautiful dresses"
isActive: "true"
image: [file]
```

### Product
```
name: "Summer Dress"
description: "Floral print dress"
price: "1299"
category: "65abc123..."
sizes: ["S", "M", "L", "XL"]
stock: "50"
isFeatured: "true"
images: [file1]
images: [file2]
images: [file3]
```

## 🔍 Response Format

Images are returned as relative paths:

```json
{
  "success": true,
  "data": {
    "name": "Summer Dress",
    "images": [
      "/uploads/products/product-1737046149123-987654321.jpg",
      "/uploads/products/product-1737046149456-123456789.jpg"
    ]
  }
}
```

## 🌐 Accessing Images

Images are served as static files:
```
http://localhost:5000/uploads/categories/category-123456.jpg
http://localhost:5000/uploads/products/product-789012.jpg
```

## ⚠️ Common Errors

**Error:** "Only image files are allowed"
- **Fix:** Upload only jpeg, jpg, png, gif, or webp files

**Error:** "File too large"
- **Fix:** Ensure file is under 5MB

**Error:** "Field name must be 'images'"
- **Fix:** Use correct field name (singular `image` for category, plural `images` for products)
