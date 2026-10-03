import { Stack } from 'expo-router';

export default function OrganizerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="organizer-dashboard"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}