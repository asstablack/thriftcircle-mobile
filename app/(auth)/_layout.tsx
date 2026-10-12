import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function AuthLayout() {
  const authenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  if (authenticated)
    return <Redirect href="/group-selection" />;
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="register"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="reset-verification"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="new-password"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
