# Quick Reference Card

## 🚀 Start Commands

```bash
# Install dependencies
npm install

# Start admin app
npm start

# Start backend (from cafe_2/backend)
npm start
```

## 🔑 Create Admin User

```sql
-- In Supabase SQL Editor
UPDATE users SET is_admin = true WHERE phone = '1234567890';
```

## 📱 App Structure

```
Login → Menu → Add/Edit/Delete Items
     ↓
     Orders → View Paid Orders
     ↓
     Scanner → Scan QR → View Bill
     ↓
     Analytics → Week/Month/Year Stats
```

## 🔧 Configuration

**API URL:** `src/constants/api.ts`
```typescript
const MANUAL_IP = 'YOUR_IP_HERE'; // e.g., '192.168.1.5'
```

## 📊 Features Quick Access

| Feature | Location | Action |
|---------|----------|--------|
| Add Product | Menu Tab | Tap "+" button |
| Edit Product | Menu Tab | Tap "Edit" on item |
| Delete Product | Menu Tab | Tap "Delete" on item |
| View Orders | Orders Tab | Tap order for details |
| Scan QR | Scanner Tab | Point at QR code |
| View Analytics | Analytics Tab | Select time period |

## 🔄 Real-time Sync

Admin adds item → Backend saves → WebSocket broadcasts → Student app updates

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect | Check IP in api.ts |
| Login fails | Verify is_admin = true |
| Camera not working | Grant permission |
| Menu not syncing | Restart both apps |

## 📞 Support

- Check SETUP_GUIDE.md for detailed setup
- Check TESTING_CHECKLIST.md for testing
- Check IMPLEMENTATION_SUMMARY.md for architecture
