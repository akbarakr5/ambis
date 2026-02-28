import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getToken } from '../src/services/authService';
import SplashScreen from '../src/components/SplashScreen';

export default function Index() {
  const router = useRouter();

  // index no longer handles navigation; RootLayout takes care of auth redirect
  useEffect(() => {
    console.log('Index mounted, showing splash');
  }, []);

  return <SplashScreen />;
}
