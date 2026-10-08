import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Inter_800ExtraBold } from '@expo-google-fonts/inter/800ExtraBold';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { fonts } from '@/constants/fonts';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from 'expo-router/react-navigation';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/authStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  const [fontsLoaded, fontError] = useFonts({
    [fonts.regular]: Inter_400Regular,
    [fonts.medium]: Inter_500Medium,
    [fonts.semiBold]: Inter_600SemiBold,
    [fonts.bold]: Inter_700Bold,
    [fonts.extraBold]: Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const baseTheme =
    colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = {
    ...baseTheme,
    fonts: {
      regular: {
        fontFamily: fonts.regular,
        fontWeight: 'normal' as const,
      },
      medium: {
        fontFamily: fonts.medium,
        fontWeight: 'normal' as const,
      },
      bold: {
        fontFamily: fonts.bold,
        fontWeight: 'normal' as const,
      },
      heavy: {
        fontFamily: fonts.extraBold,
        fontWeight: 'normal' as const,
      },
    },
  };

  return (
    <ThemeProvider value={theme}>
      <Stack
        screenOptions={{
          headerTitleStyle: { fontFamily: fonts.semiBold },
          headerBackTitleStyle: { fontFamily: fonts.regular },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
        />

        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen
            name="(member)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(organizer)"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="group-selection" />
          <Stack.Screen name="create-group" />
          <Stack.Screen name="join-group" />
          <Stack.Screen name="invite-members" />
          <Stack.Screen name="contribution-review" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="payouts" />
          <Stack.Screen name="join-requests" />
        </Stack.Protected>
        <Stack.Screen
          name="welcome"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
          }}
        />
        <Stack.Screen
          name="role-selection"
          options={{ headerShown: false }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
