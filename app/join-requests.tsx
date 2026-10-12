import { OrganizerBottomNavigation } from '@/components/organizer-chrome';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Redirect, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GroupScreenHeader } from '@/components/group-screen-header';
import { colors } from '@/constants/color';
import { useAuthStore } from '@/store/authStore';
import { getGroupDetails } from '@/services/groupApi';
import {
  getPendingMembers,
  reviewMembership,
  type PendingMember,
} from '@/services/membershipApi';
import { accountStyles as styles } from '@/styles/accountStyles';

export default function JoinRequestsScreen() {
  const group = useAuthStore(
    (state) => state.selectedGroup,
  );
  const user = useAuthStore((state) => state.user);
  const [items, setItems] = useState<PendingMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [decision, setDecision] = useState<{
    member: PendingMember;
    action: 'approve' | 'reject';
  } | null>(null);
  const version = useRef(0);
  const submitting = useRef(false);

  const load = useCallback(async () => {
    if (!group) return;
    const current = ++version.current;
    setLoading(true);
    setError(null);
    setItems([]);
    setDecision(null);
    setAuthorized(false);
    try {
      const details = await getGroupDetails(group.id);
      if (current !== version.current) return;
      if (details.callerRole !== 'organizer') {
        throw new Error(
          'Only group organizers can review join requests.',
        );
      }
      const result = await getPendingMembers(group.id);
      if (current !== version.current) return;
      setItems(result);
      setAuthorized(true);
    } catch (reason) {
      if (current === version.current) {
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load requests.',
        );
      }
    } finally {
      if (current === version.current) setLoading(false);
    }
  }, [group]);

  useFocusEffect(
    useCallback(() => {
      setNotice(null);
      void load();
      return () => {
        version.current++;
      };
    }, [load]),
  );

  const submit = async () => {
    if (
      !decision?.member.userId ||
      !group ||
      !authorized ||
      error ||
      loading ||
      submitting.current
    )
      return;
    submitting.current = true;
    setBusy(true);
    setError(null);
    setNotice(null);
    const current = version.current;
    try {
      await reviewMembership(
        group.id,
        decision.member.userId._id,
        decision.action,
      );
      if (current !== version.current) return;
      setNotice(
        decision.action === 'approve'
          ? `${decision.member.userId.fullName} now has group access.`
          : `The request from ${decision.member.userId.fullName} was rejected.`,
      );
      setDecision(null);
      await load();
    } catch (reason) {
      if (current === version.current) {
        setError(
          `${reason instanceof Error ? reason.message : 'Unable to confirm the decision.'} Refresh requests before trying again.`,
        );
        setDecision(null);
        setAuthorized(false);
      }
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  if (!user) return <Redirect href="/login" />;
  if (!group) return <Redirect href="/group-selection" />;

  return (
    <SafeAreaView style={styles.container}>
      <GroupScreenHeader
        variant="plain"
        title="Join Requests"
        subtitle={group.groupName}
        disabled={busy}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.info}>
          Review requests before granting group access.
          Approval may create a contribution for the current
          active cycle.
        </Text>
        {notice && (
          <Text
            accessibilityLiveRegion="polite"
            style={styles.notice}
          >
            {notice}
          </Text>
        )}
        {error && (
          <Text
            accessibilityRole="alert"
            style={styles.error}
          >
            {error}
          </Text>
        )}
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            {!error && !items.length && (
              <Text style={styles.body}>
                No pending requests.
              </Text>
            )}
            {items.map((member) => (
              <View key={member._id} style={styles.card}>
                <Text style={styles.title}>
                  {member.userId?.fullName ||
                    'Account unavailable'}
                </Text>
                <Text style={styles.body}>
                  {member.userId?.email}
                </Text>
                <Text style={styles.status}>
                  Awaiting approval
                </Text>
                {!member.userId && (
                  <Text style={styles.body}>
                    This account cannot be reviewed. Contact
                    the organizer responsible for group
                    support.
                  </Text>
                )}
                <Pressable
                  accessibilityRole="button"
                  disabled={
                    busy || !authorized || !member.userId
                  }
                  onPress={() =>
                    setDecision({
                      member,
                      action: 'approve',
                    })
                  }
                >
                  <Text style={styles.link}>
                    Approve request
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={
                    busy || !authorized || !member.userId
                  }
                  onPress={() =>
                    setDecision({
                      member,
                      action: 'reject',
                    })
                  }
                >
                  <Text style={styles.link}>
                    Reject request
                  </Text>
                </Pressable>
                {decision?.member._id === member._id && (
                  <View style={styles.card}>
                    <Text style={styles.body}>
                      {decision.action === 'approve'
                        ? 'Grant group access to'
                        : 'Reject the request from'}{' '}
                      {member.userId?.fullName}?
                    </Text>
                    {decision.action === 'reject' && (
                      <Text style={styles.body}>
                        Rejection prevents this account from
                        requesting to join again after
                        rejection.
                      </Text>
                    )}
                    <Pressable
                      accessibilityRole="button"
                      disabled={busy || !authorized}
                      style={[
                        styles.button,
                        busy && styles.disabled,
                      ]}
                      onPress={() => void submit()}
                    >
                      <Text style={styles.buttonText}>
                        {busy
                          ? 'Saving…'
                          : 'Confirm decision'}
                      </Text>
                    </Pressable>
                    <Pressable
                      disabled={busy}
                      onPress={() => setDecision(null)}
                    >
                      <Text style={styles.link}>
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
          </>
        )}
        <Pressable
          accessibilityRole="button"
          disabled={busy || loading}
          onPress={() => void load()}
        >
          <Text style={styles.link}>Refresh requests</Text>
        </Pressable>
      </ScrollView>
      {!busy && (
        <OrganizerBottomNavigation active="Groups" />
      )}
    </SafeAreaView>
  );
}
