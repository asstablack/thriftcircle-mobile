import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function MemberLayout() {
  const group = useAuthStore(
    (state) => state.selectedGroup,
  );
  if (!group) return <Redirect href="/group-selection" />;
  if (group.role !== 'member')
    return <Redirect href="/organizer-dashboard" />;
  return (
    <Stack>
      <Stack.Screen
        name="member-dashboard"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
