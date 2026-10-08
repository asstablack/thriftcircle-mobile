import { Stack } from 'expo-router';

export default function OrganizerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="organizer-dashboard"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="members"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="contributions"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
