import Constants from 'expo-constants';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnv = (key: string): string | undefined => {
  try {
    const expoExtra = (Constants.expoConfig && (Constants.expoConfig as any).extra) || (Constants.manifest && (Constants.manifest as any).extra);
    if (expoExtra && expoExtra[key]) return expoExtra[key];
  } catch (e) {}
  return (process.env as any)[key];
};

export const SUPABASE_URL = getEnv('SUPABASE_URL') || '';
export const SUPABASE_KEY = getEnv('SUPABASE_KEY') || '';

let supabase: SupabaseClient | null = null;

export const initSupabase = (apiKey?: string): SupabaseClient | null => {
  try {
    const key = apiKey || SUPABASE_KEY;
    if (!SUPABASE_URL) {
      console.warn('SUPABASE_URL not set - running in fallback mode');
      return null;
    }
    if (!key) {
      console.warn('Supabase key not set - running in fallback mode');
      return null;
    }
    // createClient accepts either anon or service role key; prefer provided apiKey -> SUPABASE_KEY -> SUPABASE_SERVICE_KEY
    supabase = createClient(SUPABASE_URL, key);
    console.log('Supabase initialized successfully');
    return supabase;
  } catch (error) {
    console.error('Supabase initialization error:', error);
    return null;
  }
};

export const getSupabase = (): SupabaseClient | null => {
  if (!supabase) {
    console.warn('Supabase client not initialized');
    return null;
  }
  return supabase as SupabaseClient;
};

export type { SupabaseClient };
