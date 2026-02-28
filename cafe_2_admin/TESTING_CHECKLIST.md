# Testing Checklist

## Backend Setup
- [ ] Backend running on port 3006
- [ ] Supabase connected
- [ ] WebSocket service initialized
- [ ] Admin routes accessible

## Authentication
- [ ] Send OTP to phone number
- [ ] Receive OTP via SMS
- [ ] Verify OTP successfully
- [ ] Non-admin users rejected
- [ ] Token stored in AsyncStorage
- [ ] Auto-login on app restart
- [ ] Logout functionality

## Menu Management
- [ ] View all menu items
- [ ] Add new menu item
  - [ ] Name and price required
  - [ ] Optional fields work
  - [ ] Available toggle works
  - [ ] Image URL saves correctly
- [ ] Edit existing item
  - [ ] Form pre-fills with current data
  - [ ] Changes save correctly
- [ ] Delete menu item
  - [ ] Confirmation dialog appears
  - [ ] Item removed from database
- [ ] Real-time sync to student app
  - [ ] New items appear instantly
  - [ ] Updated items reflect changes
  - [ ] Deleted items disappear

## Orders Management
- [ ] View all paid orders
- [ ] Orders sorted by date (newest first)
- [ ] Order card shows:
  - [ ] Order ID/number
  - [ ] Total amount
  - [ ] Customer name
  - [ ] Date/time
  - [ ] Item count
- [ ] Tap order to view details
- [ ] Order details show:
  - [ ] Customer info (name, phone)
  - [ ] All order items
  - [ ] Item quantities
  - [ ] Item prices
  - [ ] Total amount
- [ ] Close details modal

## QR Scanner
- [ ] Camera permission requested
- [ ] Camera permission granted
- [ ] QR code scanning works
- [ ] Valid order QR shows bill
- [ ] Bill displays:
  - [ ] Order ID
  - [ ] Customer details
  - [ ] All items with quantities
  - [ ] Individual item totals
  - [ ] Grand total
- [ ] Invalid QR shows error
- [ ] "Scan Again" resets scanner
- [ ] Multiple scans work correctly

## Analytics
- [ ] Week filter works
- [ ] Month filter works
- [ ] Year filter works
- [ ] Products sorted by revenue
- [ ] Shows correct data:
  - [ ] Product name
  - [ ] Category
  - [ ] Units sold
  - [ ] Total revenue
- [ ] Ranking numbers correct
- [ ] Empty state for no data
- [ ] Data updates when filter changes

## Real-time Features
- [ ] WebSocket connects on app start
- [ ] Menu updates broadcast correctly
- [ ] Student app receives updates
- [ ] Multiple clients sync properly
- [ ] Connection resilient to network issues

## Error Handling
- [ ] Network errors show alerts
- [ ] Invalid data shows validation
- [ ] API errors handled gracefully
- [ ] Loading states display
- [ ] Empty states show messages

## UI/UX
- [ ] Navigation works smoothly
- [ ] Tabs switch correctly
- [ ] Modals open/close properly
- [ ] Forms validate input
- [ ] Buttons disabled during loading
- [ ] Success feedback shown
- [ ] Error messages clear

## Performance
- [ ] App loads quickly
- [ ] Lists scroll smoothly
- [ ] Images load efficiently
- [ ] No memory leaks
- [ ] WebSocket stable

## Security
- [ ] Only admins can login
- [ ] JWT tokens required for API
- [ ] Tokens stored securely
- [ ] Unauthorized requests blocked
- [ ] Admin middleware enforced
