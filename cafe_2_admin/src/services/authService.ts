import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSupabase, initSupabase } from '../constants/supabase';

export const sendOTP = async (phone: string) => {
  console.log('OTP sent to:', phone, '- Use: 123456');
  return { success: true, message: 'OTP: 123456' };
};

export const verifyOTP = async (phone: string, otp: string) => {
  console.log('authService.verifyOTP called', { phone, otp });
  try {
    if (otp !== '123456') {
      console.warn('otp mismatch', otp);
      throw new Error('Invalid OTP. Use: 123456');
    }

    let supabase = getSupabase();
    if (!supabase) {
      console.log('Supabase not initialized, attempting to initialize...');
      supabase = initSupabase();
    }
    
    if (!supabase) {
      console.warn('Supabase unavailable - using mock admin user');
      const mockUser = { id: `user_${phone}`, phone, is_admin: true, name: 'Admin User' };
      const token = `token_${phone}_${Date.now()}`;
      await AsyncStorage.setItem('adminToken', token);
      await AsyncStorage.setItem('adminUser', JSON.stringify(mockUser));
      console.log('verifyOTP mock success', { token, user: mockUser });
      return { success: true, token, user: mockUser };
    }
    
    console.log('Querying Supabase for user...');
    
    let user = null;
    let queryError = null;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();
      
      user = data;
      queryError = error;
    } catch (queryErr) {
      console.warn('Supabase query failed:', queryErr);
      queryError = queryErr;
    }

    console.log('supabase user query result', { user, queryError });

    if (queryError || !user) {
      console.log('User not found - creating as admin');
      try {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([{ phone, is_admin: true, name: 'Admin User' }])
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating user:', createError);
          // Fallback to mock user when Supabase create fails
          throw createError;
        }
        
        const token = `token_${phone}_${Date.now()}`;
        await AsyncStorage.setItem('adminToken', token);
        await AsyncStorage.setItem('adminUser', JSON.stringify(newUser));
        return { success: true, token, user: newUser };
      } catch (createErr) {
        // Fallback to mock user on any error
        console.warn('Supabase operation failed, using mock admin user');
        const mockUser = { id: `user_${phone}`, phone, is_admin: true, name: 'Admin User' };
        const token = `token_${phone}_${Date.now()}`;
        await AsyncStorage.setItem('adminToken', token);
        await AsyncStorage.setItem('adminUser', JSON.stringify(mockUser));
        return { success: true, token, user: mockUser };
      }
    }

    if (!user.is_admin) {
      console.log('User exists but not admin - updating to admin');
      try {
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ is_admin: true })
          .eq('phone', phone)
          .select()
          .single();
        
        if (updateError) {
          console.error('Error updating user:', updateError);
          throw updateError;
        }
        
        const token = `token_${phone}_${Date.now()}`;
        await AsyncStorage.setItem('adminToken', token);
        await AsyncStorage.setItem('adminUser', JSON.stringify(updatedUser));
        return { success: true, token, user: updatedUser };
      } catch (updateErr) {
        // Fallback to mock user when Supabase update fails
        console.warn('Supabase update failed, using mock admin user');
        const mockUser = { id: `user_${phone}`, phone, is_admin: true, name: 'Admin User' };
        const token = `token_${phone}_${Date.now()}`;
        await AsyncStorage.setItem('adminToken', token);
        await AsyncStorage.setItem('adminUser', JSON.stringify(mockUser));
        return { success: true, token, user: mockUser };
      }
    }

    const token = `token_${phone}_${Date.now()}`;
    await AsyncStorage.setItem('adminToken', token);
    await AsyncStorage.setItem('adminUser', JSON.stringify(user));
    console.log('verifyOTP success', { token, user });
    return { success: true, token, user };
  } catch (error) {
    console.error('verifyOTP caught error', error);
    throw error;
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem('adminToken');
  await AsyncStorage.removeItem('adminUser');
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('adminToken');
  } catch (e) {
    return null;
  }
};

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};
