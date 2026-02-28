# Quick Setup Guide

## Prerequisites
- Backend running on port 3006
- Admin user in database with `is_admin = true`

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API URL**
   - Open `src/constants/api.ts`
   - Set `MANUAL_IP` to your computer's IP address
   - Example: `const MANUAL_IP = '192.168.1.5';`

3. **Create Admin User**
   - Login to Supabase dashboard
   - Go to Table Editor → users
   - Find your user and set `is_admin = true`
   
   Or run SQL:
   ```sql
   UPDATE users SET is_admin = true WHERE phone = '1234567890';
   ```

4. **Start Backend**
   ```bash
   cd ../cafe_2/backend
   npm start
   ```

5. **Start Admin App**
   ```bash
   npm start
   ```
   Or double-click `start_admin.bat`

6. **Login**
   - Enter your phone number
   - Enter OTP received via SMS
   - Access admin panel

## Testing QR Scanner

1. Open student app
2. Place an order and complete payment
3. Go to order success screen (shows QR code)
4. Open admin app → Scanner tab
5. Scan the QR code
6. View order bill details

## Troubleshooting

**Cannot connect to backend:**
- Check if backend is running on port 3006
- Verify IP address in `src/constants/api.ts`
- Ensure phone and computer are on same network

**Login fails:**
- Verify user has `is_admin = true` in database
- Check OTP is correct
- Ensure backend auth is working

**Camera not working:**
- Grant camera permission when prompted
- Check app.json has camera plugin configured

**Menu updates not syncing:**
- Check WebSocket connection in backend logs
- Verify student app is connected to WebSocket
- Restart both apps if needed
