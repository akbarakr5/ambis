// Mock API service for development/testing when backend is unavailable
import { API_BASE_URL } from '../constants/api';

// Mock data
const mockMenuItems = [
  { id: '1', name: 'Espresso', price: 150, category: 'Coffee', image: '☕' },
  { id: '2', name: 'Latte', price: 200, category: 'Coffee', image: '🥛' },
  { id: '3', name: 'Cappuccino', price: 180, category: 'Coffee', image: '☕' },
  { id: '4', name: 'Croissant', price: 120, category: 'Pastry', image: '🥐' },
  { id: '5', name: 'Sandwich', price: 250, category: 'Food', image: '🥪' },
];

const mockOrders = [
  { id: '1', user: 'Admin', total: 350, status: 'paid', items: 2, timestamp: new Date() },
  { id: '2', user: 'User1', total: 200, status: 'delivered', items: 1, timestamp: new Date() },
];

export const isMocked = () => {
  // Use mock API if backend is unreachable or in development
  return process.env.NODE_ENV === 'development' || !API_BASE_URL.includes('http');
};

export const mockFetch = async (url: string, options?: RequestInit) => {
  console.log('[MOCK API]', options?.method || 'GET', url);

  // Mock OTP send
  if (url.includes('/auth/send-otp')) {
    // Return demo OTP for UI display
    return new Response(JSON.stringify({ success: true, message: 'OTP: 123456' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Mock OTP verify
  if (url.includes('/auth/verify-otp')) {
    return new Response(
      JSON.stringify({
        token: 'mock_token_123',
        user: { id: '1', phone: '9876543210', is_admin: true, name: 'Admin' },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Mock menu
  if (url.includes('/menu') || url.includes('/admin/menu')) {
    if (options?.method === 'GET') {
      return new Response(JSON.stringify(mockMenuItems), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (options?.method === 'POST') {
      const item = JSON.parse(options.body as string);
      const newItem = { id: Date.now().toString(), ...item };
      return new Response(JSON.stringify(newItem), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Mock orders
  if (url.includes('/admin/orders')) {
    return new Response(JSON.stringify(mockOrders), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Mock analytics
  if (url.includes('/admin/analytics')) {
    return new Response(
      JSON.stringify([
        { name: 'Espresso', units: 45, revenue: 6750 },
        { name: 'Latte', units: 38, revenue: 7600 },
        { name: 'Cappuccino', units: 32, revenue: 5760 },
      ]),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Default 404
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
};
