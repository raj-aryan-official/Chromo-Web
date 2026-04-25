📋 ADMIN SETUP & DUPLICATE PREVENTION GUIDE
============================================

## ✅ PART 1: UPDATE USER TO ADMIN ROLE

### Step 1: Find Your User's Email
First, identify which user you want to make an admin. This could be:
- Your email
- A test user email
- Example: "admin@example.com", "user@gmail.com", etc.

### Step 2: Run the Update Script

Option A: Update a Specific User
-----------------------------------
Open PowerShell in the backend directory and run:

```bash
cd backend
node updateUserRole.js
```

This script will:
✅ Connect to MongoDB
✅ Show all users in the database with their emails and current roles
✅ Ask you to update a specific email to admin

The first time you run it, edit the file to change this line:
  const adminEmail = 'admin@example.com'; // Change this to your email

Example:
  const adminEmail = 'raj@gmail.com';

Then run again.

### Step 3: Verify Admin Status
After running the script, you should see:
✅ User "Your Name" (your@email.com) is now ADMIN
   Previous role: user
   New role: admin

---

## ✅ PART 2: DUPLICATE PRODUCT PREVENTION

### What Changed?
The addProduct function now prevents duplicate products by checking:
✅ Product Name (case-insensitive)
✅ Company Name (case-insensitive)  
✅ Product Type (Interior/Exterior/Primer)

### How It Works:
1. When you try to add a product:
   - Name: "Premium Paint"
   - Company: "Asian Paints"
   - Type: "Interior"

2. System checks if a product with SAME name, company, and type exists

3. If duplicate found:
   ❌ Error Message: "Product 'Premium Paint' by 'Asian Paints' (Interior) already exists"
   ⚠️ Yellow/Red alert shown in UI

4. If unique:
   ✅ Product added successfully
   ✅ Green success message shown

### Example Scenarios:

✅ ALLOWED (Different - will be added):
- Name: "Premium Paint", Company: "Asian Paints", Type: "Interior"
- Name: "Premium Paint", Company: "Asian Paints", Type: "Exterior"  ← Different type
- Name: "Premium Paint", Company: "Berger", Type: "Interior"      ← Different company

❌ BLOCKED (Duplicate - will show error):
- Name: "Premium Paint", Company: "Asian Paints", Type: "Interior" (already exists)
- Name: "PREMIUM PAINT", Company: "asian paints", Type: "Interior" ← Case-insensitive match

---

## 🚀 TESTING THE ADMIN SYSTEM

### Test Flow:
1. Update a user to admin using updateUserRole.js
2. Log in with that admin user
3. Navigate to /admin in your browser
4. Try adding products with duplicate details - you'll see the error
5. Change one detail (name/company/type) and it will be allowed

### Error Messages You'll See:

✅ Success:
   "Product added successfully!"

❌ Duplicate Error:
   "⚠️ Product 'Paint Name' by 'Company' (Type) already exists"

❌ Validation Error:
   "Please fill in all required fields"

---

## 📊 QUICK COMMAND REFERENCE

Update user to admin:
```bash
cd backend
node updateUserRole.js
```

Start backend (if not already running):
```bash
npm start
```

Start frontend:
```bash
cd frontend
npm run dev
```

Access admin panel:
```
http://localhost:5173/admin
```

---

## 🔒 SECURITY CHECK

✅ Backend validates admin role on EVERY request
✅ Frontend protects route with role check
✅ Non-admin users redirected to home
✅ Duplicate products prevented at database level

---

Need help? Check the error messages in:
- Backend terminal: Shows MongoDB and API errors
- Browser console: Shows frontend errors
- AdminProducts component: Shows duplicate product errors
