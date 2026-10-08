import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Redirect, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GroupScreenHeader } from '@/components/group-screen-header';
import { colors } from '@/constants/color';
import { useAuthStore } from '@/store/authStore';
import { getPendingMembers, reviewMembership, type PendingMember } from '@/services/membershipApi';
import { accountStyles as styles } from '@/styles/accountStyles';

export default function JoinRequestsScreen() {
  const group = useAuthStore((state) => state.selectedGroup);
  const [items, setItems] = useState<PendingMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decision, setDecision] = useState<{
    member: PendingMember;
    action: 'approve' | 'reject';
  } | null>(null);
  const version = useRef(0);
  const submitting = useRef(false);

  const load = useCallback(async () => {
    if (!group || group.role !== 'organizer') return;
    const current = ++version.current;
    setLoading(true);
    setError(null);
    setItems([]);
    try {
      const result = await getPendingMembers(group.id);
      if (current === version.current) setItems(result);
    } catch (reason) {
      if (current === version.current) {
        setError(reason instanceof Error ? reason.message : 'Unable to load requests.');
      }
    } finally {
      if (current === version.current) setLoading(false);
    }
  }, [group]);

  useFocusEffect(useCallback(() => {
    setDecision(null);
    void load();
    return () => { version.current++; };
  }, [load]));

  const submit = async () => {
    if (!decision?.member.userId || !group || group.role !== 'organizer' || submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError(null);
    const current = version.current;
    try {
      await reviewMembership(group.id, decision.member.userId._id, decision.action);
      if (current !== version.current) return;
      setDecision(null);
      await load();
    } catch (reason) {
      if (current === version.current) {
        setError(reason instanceof Error ? reason.message : 'Unable to update this request. Refresh before retrying.');
        setDecision(null);
      }
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  if (!group || group.role !== 'organizer') {
    return <Redirect href="/group-selection" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <GroupScreenHeader title="Join Requests" subtitle={group.groupName} disabled={busy} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.body}>Review requests before granting group access. Approval may create a contribution for the current active cycle.</Text>
        {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        {loading ? <ActivityIndicator color={colors.primary} /> : (
          <>
            {!error && !items.length && <Text style={styles.body}>No pending requests.</Text>}
            {items.map((member) => (
              <View key={member._id} style={styles.card}>
                <Text style={styles.title}>{member.userId?.fullName || 'Account unavailable'}</Text>
                <Text style={styles.body}>{member.userId?.email}</Text>
                <Text style={styles.body}>Awaiting approval</Text>
                <Pressable disabled={busy || !member.userId} onPress={() => setDecision({ member, action: 'approve' })}>
                  <Text style={styles.link}>Approve request</Text>
                </Pressable>
                <Pressable disabled={busy || !member.userId} onPress={() => setDecision({ member, action: 'reject' })}>
                  <Text style={styles.link}>Reject request</Text>
                </Pressable>
                {decision?.member._id === member._id && (
                  <View style={styles.card}>
                    <Text style={styles.body}>
                      {decision.action === 'approve' ? 'Grant group access to' : 'Reject the request from'} {member.userId?.fullName}?
                    </Text>
                    <Pressable accessibilityRole="button" disabled={busy} style={styles.button} onPress={() => void submit()}>
                      <Text style={styles.buttonText}>{busy ? 'Saving…' : 'Confirm decision'}</Text>
                    </Pressable>
                    <Pressable disabled={busy} onPress={() => setDecision(null)}>
                      <Text style={styles.link}>Cancel</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
          </>
        )}
        <Pressable disabled={busy || loading} onPress={() => { setDecision(null); void load(); }}>
          <Text style={styles.link}>Refresh requests</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
