import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { initSupabase } from '../src/constants/supabase';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getToken } from '../src/services/authService';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    try {
      initSupabase();
    } catch (e) {
      console.warn('Supabase init error:', e);
    }

    const check = async () => {
      try {
        const token = await getToken();
        if (token) {
          router.replace('/(tabs)/menu');
        } else {
          router.replace('/(auth)/login');
        }
      } catch (e) {
        console.warn('auth redirect failed', e);
      }
    };
    // delay to ensure layout mounted
    setTimeout(check, 800);
  }, [router]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
