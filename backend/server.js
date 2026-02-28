require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// WebSocket connections
const clients = new Set();
wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected');
  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

function broadcast(data) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Auth endpoints
app.post('/auth/send-otp', async (req, res) => {
  const { phone } = req.body;
  console.log('OTP request for:', phone);
  // Mock OTP - in production, integrate with SMS service
  res.json({ success: true, message: 'OTP sent', otp: '123456' });
});

app.post('/auth/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  try {
    // Check if user exists and is admin
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error || !user) {
      // Create user if doesn't exist
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ phone, is_admin: false }])
        .select()
        .single();
      
      if (createError) throw createError;
      return res.status(403).json({ error: 'Not authorized as admin' });
    }

    if (!user.is_admin) {
      return res.status(403).json({ error: 'Not authorized as admin' });
    }

    // Mock token - in production, use JWT
    const token = `token_${phone}_${Date.now()}`;
    res.json({ success: true, token, user });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Menu endpoints
app.get('/menu', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Menu fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/admin/menu', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([req.body])
      .select()
      .single();
    
    if (error) throw error;
    broadcast({ type: 'menu_update', action: 'add', item: data });
    res.json(data);
  } catch (error) {
    console.error('Menu add error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/admin/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('menu_items')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    broadcast({ type: 'menu_update', action: 'update', item: data });
    res.json(data);
  } catch (error) {
    console.error('Menu update error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/admin/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    broadcast({ type: 'menu_update', action: 'delete', id });
    res.json({ success: true });
  } catch (error) {
    console.error('Menu delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Orders endpoints
app.get('/admin/orders', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        users (phone, name),
        order_items (
          *,
          menu_items (name, price)
        )
      `)
      .eq('status', 'paid')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/admin/orders/:id/bill', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        users (phone, name),
        order_items (
          *,
          menu_items (name, price)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Order bill fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analytics endpoint
app.get('/admin/analytics', async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    let startDate = new Date();
    
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const { data, error } = await supabase
      .from('order_items')
      .select(`
        quantity,
        menu_items (id, name, price),
        orders!inner (created_at, status)
      `)
      .eq('orders.status', 'paid')
      .gte('orders.created_at', startDate.toISOString());
    
    if (error) throw error;

    // Aggregate data
    const analytics = {};
    (data || []).forEach(item => {
      const menuItem = item.menu_items;
      if (!menuItem) return;
      
      if (!analytics[menuItem.id]) {
        analytics[menuItem.id] = {
          name: menuItem.name,
          price: menuItem.price,
          units: 0,
          revenue: 0
        };
      }
      analytics[menuItem.id].units += item.quantity;
      analytics[menuItem.id].revenue += item.quantity * menuItem.price;
    });

    const result = Object.values(analytics)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    res.json(result);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3006;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
