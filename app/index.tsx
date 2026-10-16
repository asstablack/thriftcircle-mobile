import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import { splashStyles as styles } from '@/styles/splashStyles';

export default function SplashScreen() {
  const authenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(
        authenticated ? '/group-selection' : '/welcome',
      );
    }, 1800);

    return () => clearTimeout(timer);
  }, [authenticated]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Image
        source={require('@/assets/figma/ec34e.png')}
        style={styles.logo}
        contentFit="contain"
      />
    </View>
  );
}
