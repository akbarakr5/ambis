import { getSupabase } from '../constants/supabase';

export const getAnalytics = async (period: 'week' | 'month' | 'year') => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not initialized - returning empty analytics');
      return [];
    }
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
    const analytics: any = {};
    (data || []).forEach((item: any) => {
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
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);

    return result;
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return [];
  }
};
