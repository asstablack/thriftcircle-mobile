import { useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Redirect, router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GroupScreenHeader } from '@/components/group-screen-header';
import { OrganizerBottomNavigation } from '@/components/organizer-chrome';
import { logoutSession } from '@/services/sessionApi';
import { useAuthStore } from '@/store/authStore';
import { accountStyles as styles } from '@/styles/accountStyles';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const group = useAuthStore((state) => state.selectedGroup);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);

  const handleLogout = async () => {
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError(null);

    try {
      const { serverRevoked } = await logoutSession();
      clearAuth();
      router.replace('/login');
      if (!serverRevoked) {
        Alert.alert(
          'Signed out on this device',
          'The server could not confirm session revocation. Your saved sign-in details have been removed from this device.',
        );
      }
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to sign out. Please retry.',
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  if (!user) return <Redirect href="/login" />;

  return (
    <SafeAreaView style={styles.container}>
      <GroupScreenHeader
        title="My Profile"
        subtitle="Your account and selected group"
        disabled={busy}
      />
      <Stack.Screen options={{ gestureEnabled: !busy }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{user.fullName}</Text>
          <Text style={styles.label}>Email address</Text>
          <Text style={styles.body}>{user.email}</Text>
          <Text style={styles.label}>Phone number</Text>
          <Text style={styles.body}>
            {user.phoneNumber || 'Not provided'}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Selected group</Text>
          <Text style={styles.body}>
            {group?.groupName || 'No group selected'}
          </Text>
          {group && (
            <Text style={styles.body}>
              Role:{' '}
              {group.role === 'organizer'
                ? 'Organizer'
                : 'Member'}
            </Text>
          )}
          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={() => router.push('/group-selection')}
          >
            <Text style={styles.link}>Choose a group</Text>
          </Pressable>
          {group && (
            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={() => router.push('/payouts')}
            >
              <Text style={styles.link}>View payouts</Text>
            </Pressable>
          )}
        </View>
        {error && (
          <Text
            accessibilityRole="alert"
            style={styles.error}
          >
            {error}
          </Text>
        )}
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          style={[styles.button, busy && styles.disabled]}
          onPress={() => void handleLogout()}
        >
          <Text style={styles.buttonText}>
            {busy ? 'Signing out…' : 'Log out'}
          </Text>
        </Pressable>
      </ScrollView>
      {!busy && <OrganizerBottomNavigation active="Profile" />}
    </SafeAreaView>
  );
}
