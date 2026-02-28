# Cafe Admin Panel

Admin panel for managing the cafe management system. Shares the same backend (port 3006) and Supabase database with the student app.

## Features

- **Admin Authentication**: Login with phone OTP (requires is_admin flag in database)
- **Menu Management**: Add, edit, delete menu items with real-time sync to student app
- **Orders Management**: View all paid orders with customer details
- **QR Scanner**: Scan QR codes from student app to view order bills
- **Analytics Dashboard**: View top-selling products by week/month/year

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update API URL in `src/constants/api.ts`:
```typescript
const MANUAL_IP = 'YOUR_COMPUTER_IP'; // e.g., '192.168.1.5'
```

3. Ensure backend is running on port 3006:
```bash
cd ../cafe_2/backend
npm start
```

4. Start the admin app:
```bash
npm start
```

## Admin User Setup

To create an admin user, update the `is_admin` flag in the Supabase `users` table:

```sql
UPDATE users SET is_admin = true WHERE phone = 'YOUR_PHONE_NUMBER';
```

## Usage

### Login
- Enter your phone number
- Receive OTP via SMS
- Enter OTP to login
- Only users with `is_admin = true` can access

### Menu Management
- View all menu items
- Tap "+" button to add new item
- Tap "Edit" to modify existing item
- Tap "Delete" to remove item
- Changes sync instantly to student app via WebSocket

### Orders
- View all paid orders
- Tap order to see full details
- See customer info and order items

### QR Scanner
- Tap "Scanner" tab
- Grant camera permission
- Scan QR code from student app
- View order bill details

### Analytics
- Select time period (Week/Month/Year)
- View top-selling products
- See units sold and revenue

## API Endpoints Used

- `POST /auth/send-otp` - Send OTP
- `POST /auth/verify-otp` - Verify OTP and login
- `GET /menu` - Get all menu items
- `POST /admin/menu` - Add menu item
- `PATCH /admin/menu/:id` - Update menu item
- `DELETE /admin/menu/:id` - Delete menu item
- `GET /admin/orders` - Get all orders
- `GET /admin/orders/:id/bill` - Get order bill for QR scan
- `GET /admin/analytics?period=week` - Get analytics data

## Real-time Sync

When admin adds/updates menu items:
1. Backend saves to database
2. Backend broadcasts via WebSocket
3. Student app receives update
4. Student app UI updates automatically

## Tech Stack

- React Native (Expo)
- expo-router for navigation
- expo-camera for QR scanning
- AsyncStorage for auth persistence
- WebSocket for real-time updates
