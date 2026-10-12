import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function OrganizerLayout() {
  const group = useAuthStore(
    (state) => state.selectedGroup,
  );
  if (!group) return <Redirect href="/group-selection" />;
  if (group.role !== 'organizer')
    return <Redirect href="/member-dashboard" />;
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
