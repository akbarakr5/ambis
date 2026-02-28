# 🚀 Getting Started - Cafe Admin Panel

## What You Have

A complete admin panel app that:
- ✅ Shares backend (port 3006) with student app
- ✅ Uses same Supabase database
- ✅ Real-time menu sync via WebSocket
- ✅ QR code scanning for order bills
- ✅ Business analytics dashboard
- ✅ Full menu CRUD operations

## 📋 Prerequisites

1. **Backend running** on port 3006
2. **Supabase database** configured
3. **Admin user** with `is_admin = true`
4. **Node.js** installed
5. **Expo CLI** (will be installed with dependencies)

## 🎯 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd cafe_2_admin
npm install
```

### Step 2: Configure IP Address
Open `src/constants/api.ts` and update:
```typescript
const MANUAL_IP = '192.168.1.5'; // ← Your computer's IP
```

**How to find your IP:**
- Windows: Open CMD → Type `ipconfig` → Look for IPv4 Address
- Mac/Linux: Open Terminal → Type `ifconfig` → Look for inet address

### Step 3: Create Admin User
Open Supabase dashboard → SQL Editor → Run:
```sql
UPDATE users SET is_admin = true WHERE phone = '1234567890';
```
Replace `1234567890` with your phone number.

### Step 4: Start Backend
```bash
cd ../cafe_2/backend
npm start
```
You should see: `✅ Server running on http://localhost:3006`

### Step 5: Start Admin App
```bash
cd ../cafe_2_admin
npm start
```
Or double-click `start_admin.bat`

### Step 6: Login
1. Scan QR code with Expo Go app
2. Enter your phone number
3. Enter OTP received via SMS
4. Access admin panel! 🎉

## 📱 Features Overview

### 1️⃣ Menu Management
- **View:** See all menu items
- **Add:** Tap "+" button → Fill form → Save
- **Edit:** Tap "Edit" on any item → Modify → Save
- **Delete:** Tap "Delete" → Confirm
- **Real-time:** Changes appear instantly in student app

### 2️⃣ Orders Management
- **View:** All paid orders listed
- **Details:** Tap order to see full breakdown
- **Info:** Customer name, phone, items, total

### 3️⃣ QR Scanner
- **Scan:** Point camera at QR code from student app
- **View:** See complete order bill
- **Verify:** Check payment status and items

### 4️⃣ Analytics
- **Filter:** Week / Month / Year
- **See:** Top-selling products
- **Data:** Units sold, revenue per product

## 🔄 Real-time Sync Demo

**Test it:**
1. Open admin app → Menu tab
2. Add new item: "Test Coffee - ₹50"
3. Open student app
4. See "Test Coffee" appear instantly! ✨

**How it works:**
```
Admin App → POST /admin/menu → Backend saves to DB
                                    ↓
                          WebSocket broadcasts
                                    ↓
                          Student App receives
                                    ↓
                          UI updates automatically
```

## 🧪 Quick Test Scenarios

### Test 1: Menu Management
```
1. Login to admin app
2. Add item: "Cappuccino - ₹80"
3. Verify it appears in student app
4. Edit price to ₹90
5. Verify student app shows ₹90
6. Delete item
7. Verify it disappears from student app
```

### Test 2: QR Scanner
```
1. Open student app
2. Add items to cart
3. Complete payment
4. View order success (shows QR)
5. Open admin app → Scanner tab
6. Scan QR code
7. Verify bill shows correct details
```

### Test 3: Analytics
```
1. Ensure some orders exist
2. Open Analytics tab
3. Select "Week"
4. Verify top products display
5. Switch to "Month"
6. Verify data updates
```

## 🐛 Common Issues & Fixes

### "Cannot connect to backend"
**Fix:**
- Verify backend is running: `http://localhost:3006`
- Check IP in `src/constants/api.ts`
- Ensure phone and computer on same WiFi

### "Login failed - Not authorized"
**Fix:**
- Check database: `SELECT is_admin FROM users WHERE phone = 'YOUR_PHONE'`
- Should return `true`
- If `false`, run: `UPDATE users SET is_admin = true WHERE phone = 'YOUR_PHONE'`

### "Camera not working"
**Fix:**
- Grant camera permission when prompted
- iOS: Settings → Expo Go → Camera → Allow
- Android: Settings → Apps → Expo Go → Permissions → Camera

### "Menu not syncing"
**Fix:**
- Check backend logs for WebSocket connection
- Restart both apps
- Verify WebSocket service initialized in backend

## 📚 Documentation

- **README.md** - Overview and features
- **SETUP_GUIDE.md** - Detailed setup instructions
- **QUICK_REFERENCE.md** - Quick commands and tips
- **TESTING_CHECKLIST.md** - Complete testing guide
- **IMPLEMENTATION_SUMMARY.md** - Technical architecture

## 🎓 Next Steps

1. **Customize UI:** Modify styles in screen files
2. **Add Features:** Extend functionality as needed
3. **Deploy:** Build for production with `expo build`
4. **Monitor:** Check analytics regularly
5. **Maintain:** Keep menu updated

## 💡 Pro Tips

- **Bulk Operations:** Add multiple items at once for efficiency
- **Analytics:** Check weekly to identify trends
- **QR Scanner:** Use for quick order verification
- **Real-time:** Keep both apps open to see instant sync
- **Backup:** Export data regularly from Supabase

## 🆘 Need Help?

1. Check documentation files
2. Review backend logs
3. Test API endpoints with Postman
4. Verify database schema in Supabase
5. Check network connectivity

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] IP configured correctly
- [ ] Admin user created
- [ ] Backend running
- [ ] Admin app running
- [ ] Login successful
- [ ] Menu management works
- [ ] Orders display correctly
- [ ] QR scanner works
- [ ] Analytics show data
- [ ] Real-time sync working

## 🎉 You're Ready!

Your admin panel is fully functional and ready to manage your cafe. Start by adding some menu items and watch them sync to the student app in real-time!

**Happy Managing! ☕**
