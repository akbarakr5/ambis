# Cafe Admin - Supabase Direct Setup

## ✅ What Changed
The app now works **directly with Supabase** - no backend server needed!

## 🚀 Quick Setup (5 minutes)

### Step 1: Setup Supabase Database
1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on "SQL Editor" in the left sidebar
3. Copy the contents of `database_setup.sql`
4. Paste into SQL Editor
5. **IMPORTANT**: Change line 61 - replace `'1234567890'` with YOUR phone number
6. Click "Run" to execute

### Step 2: Verify Supabase Credentials
The `.env` file already has your Supabase credentials:
```
SUPABASE_URL=https://csymdwzebhkfxjdyykrb.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are also in `app.json` under `extra` section.

### Step 3: Install Dependencies
```bash
cd cafe_2_admin
npm install
```

### Step 4: Start the App
```bash
npm start
```

Or double-click `start_admin.bat`

### Step 5: Login
1. Scan QR code with Expo Go app on your phone
2. Enter your phone number (the one you set in Step 1)
3. Enter OTP: **123456** (demo OTP)
4. You're in! 🎉

## 📱 Features

### ✅ Working Features:
- **Login**: Phone + OTP authentication
- **Menu Management**: Add, edit, delete menu items
- **Orders**: View all paid orders
- **QR Scanner**: Scan order QR codes
- **Analytics**: View sales data by week/month/year

### ⚠️ Limitations (No Backend):
- No real-time sync between devices (no WebSocket)
- OTP is fixed to `123456` (no SMS integration)
- Pull to refresh to see updates

## 🔧 Configuration

### Change Admin Phone Number
In Supabase SQL Editor, run:
```sql
UPDATE users SET is_admin = TRUE WHERE phone = 'YOUR_PHONE_NUMBER';
```

### Add More Admin Users
```sql
INSERT INTO users (phone, name, is_admin)
VALUES ('9876543210', 'Another Admin', TRUE);
```

## 🧪 Testing

### Test Menu Management:
1. Open Menu tab
2. Tap "+" to add item
3. Fill: Name="Test Coffee", Price=50, Category="Coffee"
4. Save
5. Item appears in list

### Test Orders:
1. Need to create test order in Supabase
2. Go to Table Editor → orders
3. Insert test data
4. View in Orders tab

### Test Analytics:
1. Need orders with status='paid'
2. Open Analytics tab
3. Select period (Week/Month/Year)
4. View top products

## 🐛 Troubleshooting

### "Supabase client not initialized"
**Fix**: The app initializes Supabase on startup. If you see this error:
1. Check `.env` file has correct SUPABASE_URL and SUPABASE_SERVICE_KEY
2. Check `app.json` has the same values in `extra` section
3. Restart the app

### "Not authorized as admin"
**Fix**: Run this in Supabase SQL Editor:
```sql
SELECT * FROM users WHERE phone = 'YOUR_PHONE';
-- Check if is_admin is TRUE
-- If FALSE, run:
UPDATE users SET is_admin = TRUE WHERE phone = 'YOUR_PHONE';
```

### "Table does not exist"
**Fix**: Run the `database_setup.sql` script in Supabase SQL Editor

### Camera not working
**Fix**: Grant camera permission in phone settings

## 📊 Database Structure

```
users
├── id (uuid)
├── phone (text) - unique
├── name (text)
├── is_admin (boolean) - must be TRUE for admin access
└── created_at (timestamp)

menu_items
├── id (uuid)
├── name (text)
├── description (text)
├── price (numeric)
├── category (text)
├── image_url (text)
├── available (boolean)
└── created_at (timestamp)

orders
├── id (uuid)
├── user_id (uuid) → users.id
├── total_amount (numeric)
├── status (text) - 'pending', 'paid', 'cancelled'
└── created_at (timestamp)

order_items
├── id (uuid)
├── order_id (uuid) → orders.id
├── menu_item_id (uuid) → menu_items.id
├── quantity (integer)
└── price (numeric)
```

## 🔐 Security

- Using Supabase Service Role Key (full access)
- Row Level Security (RLS) enabled
- Admin check on login (is_admin = TRUE)
- Token stored in AsyncStorage

## 📝 Notes

- **OTP is hardcoded to `123456`** for demo purposes
- To add real SMS OTP, integrate Twilio/AWS SNS
- No real-time sync without WebSocket server
- Pull to refresh to see latest data
- Service role key has full database access

## ✅ Success Checklist

- [ ] Database tables created in Supabase
- [ ] Admin user created with is_admin = TRUE
- [ ] Dependencies installed (npm install)
- [ ] App started (npm start)
- [ ] Logged in with phone + OTP (123456)
- [ ] Can add/edit/delete menu items
- [ ] Can view orders
- [ ] Analytics showing data

## 🎉 You're Ready!

Your admin app is now running directly with Supabase. No backend server needed!

**Login OTP: 123456**
