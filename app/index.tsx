import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { router } from 'expo-router';
import { splashStyles as styles } from '@/styles/splashStyles';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require('@/assets/images/thrift-circle-logo-stacked.png')}
        style={styles.logo}
        contentFit="contain"
      />
    </View>
  );
}
