🧪 ADMIN SYSTEM - TESTING GUIDE
================================

## ✅ ADMIN CREDENTIALS (Ready to Use)

Email: rajaryan620666@gmail.com
Password: [Your Firebase password]
Role: admin 👑
Status: ✅ Verified

---

## 🎬 TEST SCENARIO 1: LOGIN & ACCESS ADMIN PANEL

### Steps:
1. Go to http://localhost:5173
2. Click Login
3. Enter: rajaryan620666@gmail.com
4. Enter your Firebase password
5. Click the "Admin Dashboard" link (appears in navigation for admins only)
6. Or go directly to: http://localhost:5173/admin

### Expected Results:
✅ Page loads with Products & Orders tabs
✅ "Admin Dashboard" header visible
✅ Two tabs: "📦 Manage Products" and "🧾 Manage Orders"
✅ Welcome message with your name

---

## 🎬 TEST SCENARIO 2: ADD UNIQUE PRODUCT

### Steps:
1. On Admin Dashboard, go to "Manage Products" tab
2. Click "+ Add New Product"
3. Fill the form:
   - Product Name: "Premium Interior Paint"
   - Company: "Asian Paints"
   - Type: "Interior"
   - Color: #E74C3C (Red)
   - Description: "High-quality interior paint"
   - Tags: "premium, water-resistant"
   - Variants:
     * Variant 1: Weight="1 Litre", Price="500"
     * Variant 2: Weight="4 Litre", Price="1800"
4. Click "Add Product"

### Expected Results:
✅ Green success message: "Product added successfully!"
✅ Product appears in "All Products" list
✅ Form resets
✅ Product shows with color preview and variants

---

## 🎬 TEST SCENARIO 3: DUPLICATE PRODUCT PREVENTION

### Part A: Try to Add Same Product Again
1. Go to "Manage Products" tab
2. Click "+ Add New Product"
3. Use EXACT same details:
   - Product Name: "Premium Interior Paint"
   - Company: "Asian Paints"
   - Type: "Interior"
4. Click "Add Product"

### Expected Results:
❌ Red error message: 
   "⚠️ Product 'Premium Interior Paint' by 'Asian Paints' (Interior) already exists"
❌ Product NOT added
❌ Form stays open

### Part B: Try with Different Company (Should Work)
1. Same product form but change:
   - Company: "Berger"
2. Click "Add Product"

### Expected Results:
✅ Green success message: "Product added successfully!"
✅ New product added (same name but different company)

### Part C: Try with Different Type (Should Work)
1. Same product form but change:
   - Type: "Exterior"
   - Company: "Asian Paints"
2. Click "Add Product"

### Expected Results:
✅ Green success message: "Product added successfully!"
✅ New product added (same name/company but different type)

### Part D: Case-Insensitive Check (Should Block)
1. Same product form but change:
   - Product Name: "premium interior paint" (lowercase)
   - Company: "asian paints" (lowercase)
   - Type: "Interior"
2. Click "Add Product"

### Expected Results:
❌ Red error message: (Block duplicates case-insensitively)
   "⚠️ Product 'premium interior paint' by 'asian paints' (Interior) already exists"

---

## 🎬 TEST SCENARIO 4: EDIT PRODUCT

### Steps:
1. In "Manage Products" tab, find a product card
2. Click "Edit" button
3. Change some details:
   - Product Name: "Premium Interior Paint Pro"
   - Price: "2000" (change a variant)
4. Click "Update Product"

### Expected Results:
✅ Green success message: "Product updated successfully!"
✅ Product card updates with new details
✅ Product list refreshes

---

## 🎬 TEST SCENARIO 5: DELETE PRODUCT

### Steps:
1. In "Manage Products" tab, find a product card
2. Click "Delete" button
3. Confirm deletion dialog

### Expected Results:
✅ Green success message: "Product deleted successfully!"
✅ Product disappears from list
✅ Order count decreases

---

## 🎬 TEST SCENARIO 6: VIEW & MANAGE ORDERS

### Steps:
1. Go to "Manage Orders" tab
2. View statistics cards:
   - Total Orders
   - Total Revenue
   - Order statuses breakdown

### Expected Results:
✅ Statistics show correctly
✅ Order table displays with columns:
   - Order ID
   - Customer info (name, email, phone)
   - Items ordered
   - Amount
   - Current Status
   - Update Status dropdown
   - Date

---

## 🎬 TEST SCENARIO 7: UPDATE ORDER STATUS

### Steps:
1. On "Manage Orders" tab
2. Find an order with status "Processing"
3. Click the dropdown in "Update Status" column
4. Select "Shipped"
5. Wait 1-2 seconds

### Expected Results:
✅ Status badge changes from "Processing" to "Shipped"
✅ Green success message: "Order status updated successfully!"
✅ Statistics update to reflect new status

---

## 🎬 TEST SCENARIO 8: FILTER ORDERS BY STATUS

### Steps:
1. On "Manage Orders" tab
2. Click filter buttons:
   - Click "Shipped" button
   - Only shipped orders should show

### Expected Results:
✅ Orders filtered correctly
✅ Table shows only orders with selected status
✅ Count updates in filter button

---

## 🎬 TEST SCENARIO 9: NON-ADMIN USER BLOCKED

### Steps:
1. Log out from admin account
2. Log in with a non-admin user: "raj@gmail.com"
3. Try to go to http://localhost:5173/admin

### Expected Results:
❌ "Access Denied" message
❌ "You do not have admin privileges"
❌ "Return to Home" button shown
❌ Cannot access admin panel

---

## 🎬 TEST SCENARIO 10: ROLE-BASED NAVIGATION

### Steps:
1. Log in as admin (rajaryan620666@gmail.com)
2. Check navigation bar
3. Look for "Admin Dashboard" link
4. Log out
5. Log in as non-admin
6. Check navigation bar again

### Expected Results:
✅ Admin user: "Admin Dashboard" link visible
❌ Non-admin user: "Admin Dashboard" link NOT visible

---

## 📊 EXPECTED PRODUCT STRUCTURE

When you add a product, it should have:
```
{
  _id: ObjectId
  name: "Product Name"
  company: "Company Name"
  type: "Interior|Exterior|Primer"
  colorHex: "#HEX_COLOR"
  description: "Product description"
  tags: ["tag1", "tag2"]
  variants: [
    { weight: "1L", price: 500, stock: 100 },
    { weight: "4L", price: 1800, stock: 100 }
  ]
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔍 HOW TO TEST IN POSTMAN

### 1. Get Auth Token
- Login on frontend at http://localhost:5173
- Open browser DevTools → Application → Local Storage
- Find "firebase_token" value
- Copy it

### 2. Add Product (with Postman)
- Method: POST
- URL: http://localhost:5000/api/admin/products
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer {your_firebase_uid}
- Body:
```json
{
  "name": "Test Paint",
  "company": "Test Company",
  "type": "Interior",
  "colorHex": "#3498DB",
  "description": "Test description",
  "tags": ["test"],
  "variants": [
    {"weight": "1L", "price": 299}
  ]
}
```

### 3. Try Duplicate (should get 409 error)
- Same request again
- Expected response: 409 Conflict
- Error message: "Product already exists"

---

## ✅ CHECKLIST

- [ ] Admin user updated successfully
- [ ] Can login as admin
- [ ] Can access /admin page
- [ ] Can see Products tab
- [ ] Can see Orders tab
- [ ] Can add product
- [ ] Duplicate product blocked
- [ ] Can edit product
- [ ] Can delete product
- [ ] Can view all orders
- [ ] Can change order status
- [ ] Can filter orders
- [ ] Non-admin user blocked
- [ ] Admin link visible for admin only
- [ ] Statistics show correctly

---

## 🎉 All Tests Pass?
Great! Your admin system is working perfectly! 🚀
