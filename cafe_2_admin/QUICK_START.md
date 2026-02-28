# 🚀 CAFE ADMIN - QUICK START GUIDE

## ✅ What's Fixed
- ✅ All services now use Supabase directly (no backend needed)
- ✅ Fixed routing issues
- ✅ Fixed analytics data properties
- ✅ Simplified authentication
- ✅ All errors resolved

## 📋 Setup Steps (5 Minutes)

### 1️⃣ Setup Supabase Database

1. Go to https://supabase.com/dashboard
2. Open your project: https://csymdwzebhkfxjdyykrb.supabase.co
3. Click "SQL Editor" in left sidebar
4. Copy and paste the contents of `database_setup.sql`
5. **IMPORTANT**: On line 61, change `'1234567890'` to YOUR phone number
6. Click "Run" to execute

### 2️⃣ Start the Application

**Option A: Double-click**
```
Double-click START_HERE.bat
```

**Option B: Command Line**
```bash
cd cafe_2_admin
npm install
npm start
```

### 3️⃣ Login to App

1. Scan QR code with **Expo Go** app on your phone
2. Enter your phone number (the one you set as admin)
3. Enter OTP: **123456**
4. You're in! 🎉

## 📱 Features

### ✅ Menu Management
- Add new items
- Edit existing items
- Delete items
- Toggle availability

### ✅ Orders
- View all paid orders
- See customer details
- View order items

### ✅ QR Scanner
- Scan QR codes from orders
- View order bills

### ✅ Analytics
- View top products by week/month/year
- See revenue and units sold

### ✅ Settings
- View profile
- Logout

## 🔧 Configuration

### Your Supabase Credentials (Already Set)
```
SUPABASE_URL=https://csymdwzebhkfxjdyykrb.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Set Admin User
Run this in Supabase SQL Editor:
```sql
-- Replace with YOUR phone number
UPDATE users SET is_admin = TRUE WHERE phone = '1234567890';
```

### Check Admin Status
```sql
SELECT phone, name, is_admin FROM users WHERE phone = 'YOUR_PHONE';
```

## 🐛 Troubleshooting

### "Not authorized as admin"
**Solution**: Run this in Supabase SQL Editor:
```sql
UPDATE users SET is_admin = TRUE WHERE phone = 'YOUR_PHONE_NUMBER';
```

### "Table does not exist"
**Solution**: Run the `database_setup.sql` script in Supabase SQL Editor

### "Supabase client not initialized"
**Solution**: 
1. Check `.env` file has correct credentials
2. Check `app.json` has same credentials in `extra` section
3. Restart app

### Camera not working
**Solution**: Grant camera permission in phone settings

### Port already in use
**Solution**: 
```bash
npx expo start --port 8085
```

## 📊 Database Tables

### users
- id, phone, name, email, is_admin

### menu_items
- id, name, description, price, category, image_url, available

### orders
- id, user_id, total_amount, status, order_number

### order_items
- id, order_id, menu_item_id, quantity, price

## 🔐 Security

- Using Supabase Service Role Key (full access)
- Admin check on login (is_admin = TRUE required)
- OTP: 123456 (hardcoded for demo)

## 📝 Important Notes

1. **OTP is hardcoded to `123456`** for demo
2. **No real-time sync** without WebSocket (pull to refresh)
3. **Service role key** has full database access
4. **Admin flag required** in users table

## ✅ Success Checklist

- [ ] Supabase tables created
- [ ] Admin user set (is_admin = TRUE)
- [ ] Dependencies installed
- [ ] App started successfully
- [ ] Logged in with OTP 123456
- [ ] Can view menu items
- [ ] Can add/edit menu items
- [ ] Can view orders
- [ ] Analytics working

## 🎉 You're Ready!

Your cafe admin app is now running with Supabase!

**Login OTP: 123456**

Need help? Check:
- SUPABASE_SETUP.md - Detailed Supabase guide
- database_setup.sql - Database schema
- .env - Your credentials
