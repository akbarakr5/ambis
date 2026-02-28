import { getSupabase } from '../constants/supabase';

export const getMenuItems = async () => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.warn('Supabase not initialized - returning empty menu');
      return [];
    }
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Menu fetch error:', error);
    return [];
  }
};

export const addMenuItem = async (item: any) => {
  try {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase
      .from('menu_items')
      .insert([item])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateMenuItem = async (id: string, item: any) => {
  try {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase
      .from('menu_items')
      .update(item)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteMenuItem = async (id: string) => {
  try {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not initialized');
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
};
