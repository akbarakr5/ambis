-- Cafe Admin Database Setup Script
-- Run this in Supabase SQL Editor

-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category TEXT,
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  order_number SERIAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON order_items(menu_item_id);

-- 6. Create admin user (REPLACE '1234567890' with your phone number)
INSERT INTO users (phone, name, is_admin)
VALUES ('1234567890', 'Admin User', TRUE)
ON CONFLICT (phone) DO UPDATE SET is_admin = TRUE;

-- 7. Insert sample menu items (optional)
INSERT INTO menu_items (name, description, price, category, available) VALUES
('Cappuccino', 'Classic Italian coffee with steamed milk', 80, 'Coffee', TRUE),
('Espresso', 'Strong black coffee', 60, 'Coffee', TRUE),
('Latte', 'Smooth coffee with milk', 90, 'Coffee', TRUE),
('Sandwich', 'Grilled vegetable sandwich', 120, 'Food', TRUE),
('Burger', 'Cheese burger with fries', 150, 'Food', TRUE),
('Pasta', 'Italian pasta with sauce', 180, 'Food', TRUE)
ON CONFLICT DO NOTHING;

-- 8. Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 9. Create policies for service role access (allows admin app to access all data)
CREATE POLICY "Service role can do everything on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do everything on menu_items" ON menu_items
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do everything on orders" ON orders
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do everything on order_items" ON order_items
  FOR ALL USING (true) WITH CHECK (true);

-- Done! Your database is ready.
