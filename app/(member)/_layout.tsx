import { Stack } from 'expo-router';

export default function MemberLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="member-dashboard"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}