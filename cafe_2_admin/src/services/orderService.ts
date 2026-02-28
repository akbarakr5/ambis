import { getSupabase } from '../constants/supabase';

export const getOrders = async () => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not initialized - returning empty orders');
      return [];
    }
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
    return data || [];
  } catch (error) {
    console.error('Orders fetch error:', error);
    return [];
  }
};

export const getOrderBill = async (orderId: string) => {
  try {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not initialized');
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
      .eq('id', orderId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};
