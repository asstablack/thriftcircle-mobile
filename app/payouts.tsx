import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Redirect, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GroupScreenHeader } from '@/components/group-screen-header';
import { colors } from '@/constants/color';
import {
  getCurrentCycle,
  getGroupDetails,
} from '@/services/groupApi';
import {
  getGroupPayouts,
  recordPayout,
  type Payout,
} from '@/services/payoutApi';
import { useAuthStore } from '@/store/authStore';
import { accountStyles as styles } from '@/styles/accountStyles';

type GroupDetails = {
  callerRole: 'organizer' | 'member';
  members: {
    _id: string;
    payoutOrder: number;
    userId: { _id: string; fullName: string } | null;
  }[];
};

type CurrentCycle = {
  cycleNumber: number;
  recipientId: string;
  payoutId: string | null;
};

export default function PayoutsScreen() {
  const group = useAuthStore((state) => state.selectedGroup);
  const user = useAuthStore((state) => state.user);
  const [details, setDetails] = useState<GroupDetails | null>(
    null,
  );
  const [cycle, setCycle] = useState<CurrentCycle | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(
    null,
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const version = useRef(0);
  const submitting = useRef(false);

  const load = useCallback(async () => {
    if (!group?.id) return;
    const current = ++version.current;
    setLoading(true);
    setError(null);
    setDetails(null);
    try {
      const [groupData, activeCycle, history] =
        await Promise.all([
          getGroupDetails(group.id),
          getCurrentCycle(group.id),
          getGroupPayouts(group.id),
        ]);
      if (current !== version.current) return;
      setDetails(groupData);
      setCycle(activeCycle);
      setPayouts(history);
    } catch (reason) {
      if (current === version.current) {
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load payouts.',
        );
      }
    } finally {
      if (current === version.current) setLoading(false);
    }
  }, [group?.id]);

  useFocusEffect(
    useCallback(() => {
      setAmount('');
      setNote('');
      setConfirmed(false);
      setFormError(null);
      setNotice(null);
      void load();
      return () => {
        version.current++;
      };
    }, [load]),
  );

  const isOrganizer = details?.callerRole === 'organizer';
  const canRecord =
    isOrganizer &&
    cycle &&
    !cycle.payoutId &&
    !payouts.some(
      (payout) => payout.cycleNumber === cycle.cycleNumber,
    );
  const members = [...(details?.members || [])].sort(
    (first, second) => first.payoutOrder - second.payoutOrder,
  );
  const recipientName =
    members.find(
      (member) => member.userId?._id === cycle?.recipientId,
    )?.userId?.fullName || 'Recipient unavailable';
  const history = isOrganizer
    ? payouts
    : payouts.filter((payout) => {
        const recipientId =
          typeof payout.recipientId === 'string'
            ? payout.recipientId
            : payout.recipientId?._id;
        return recipientId === user?.id;
      });

  const handleRecord = async () => {
    if (submitting.current || !canRecord || !group || !cycle)
      return;
    if (!confirmed) {
      setFormError('Confirm that the payout already happened.');
      return;
    }
    submitting.current = true;
    setBusy(true);
    setFormError(null);
    const current = version.current;
    try {
      const saved = await recordPayout(group.id, {
        cycleNumber: cycle.cycleNumber,
        amount: Number(amount),
        note,
      });
      if (current !== version.current) return;
      setPayouts((previous) => [saved, ...previous]);
      setCycle(
        (previous) =>
          previous && {
            ...previous,
            payoutId: saved._id,
          },
      );
      setAmount('');
      setNote('');
      setConfirmed(false);
      setNotice(
        'Payout recorded. The cycle closes automatically once all required contributions are confirmed.',
      );
      await load();
    } catch (reason) {
      if (current === version.current) {
        setFormError(
          reason instanceof Error
            ? reason.message
            : 'Unable to confirm the result. Refresh payout history before retrying.',
        );
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
        title="Payouts"
        subtitle={group.groupName}
        disabled={busy}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.body}>
            ThriftCircle records payouts made outside the app. It
            does not hold or transfer money.
          </Text>
          {notice && (
            <Text
              accessibilityLiveRegion="polite"
              style={styles.body}
            >
              {notice}
            </Text>
          )}
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : error ? (
            <View style={styles.card}>
              <Text
                accessibilityRole="alert"
                style={styles.error}
              >
                {error}
              </Text>
              <Pressable onPress={() => void load()}>
                <Text style={styles.link}>Try Again</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.card}>
                <Text style={styles.title}>Current cycle</Text>
                <Text style={styles.body}>
                  {cycle
                    ? `Cycle ${cycle.cycleNumber} · ${recipientName}`
                    : 'No active cycle'}
                </Text>
                {cycle?.payoutId && (
                  <Text style={styles.body}>
                    Payout recorded
                  </Text>
                )}
              </View>
              <View style={styles.card}>
                <Text style={styles.title}>Payout order</Text>
                <Text style={styles.body}>
                  Current positions recorded for active members.
                  These positions do not specify transfer dates.
                </Text>
                {members.length ? (
                  members.map((member) => (
                    <Text
                      key={member._id}
                      style={styles.body}
                    >
                      {member.payoutOrder}.{' '}
                      {member.userId?.fullName ||
                        'Member unavailable'}
                      {member.userId?._id === user.id
                        ? ' (You)'
                        : ''}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.body}>
                    No payout order available.
                  </Text>
                )}
              </View>
              {canRecord && (
                <View style={styles.card}>
                  <Text style={styles.title}>
                    Record completed payout
                  </Text>
                  <Text style={styles.body}>
                    Cycle {cycle.cycleNumber} · {recipientName}
                  </Text>
                  <Text style={styles.label}>
                    Amount paid in NGN
                  </Text>
                  <TextInput
                    accessibilityLabel="Amount paid in NGN"
                    style={styles.input}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    editable={!busy}
                    placeholder="Enter actual amount paid"
                  />
                  <Text style={styles.label}>Note optional</Text>
                  <TextInput
                    accessibilityLabel="Payout note"
                    style={styles.input}
                    value={note}
                    onChangeText={setNote}
                    editable={!busy}
                    maxLength={500}
                    multiline
                    placeholder="Add a reference or note"
                  />
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: confirmed }}
                    style={styles.checkbox}
                    disabled={busy}
                    onPress={() =>
                      setConfirmed((value) => !value)
                    }
                  >
                    <Feather
                      name={
                        confirmed ? 'check-square' : 'square'
                      }
                      size={22}
                      color={colors.primary}
                    />
                    <Text style={styles.checkboxText}>
                      I confirm this payout was made to the named
                      recipient outside ThriftCircle.
                    </Text>
                  </Pressable>
                  {formError && (
                    <Text
                      accessibilityRole="alert"
                      style={styles.error}
                    >
                      {formError}
                    </Text>
                  )}
                  <Pressable
                    accessibilityRole="button"
                    disabled={busy || !confirmed}
                    style={[
                      styles.button,
                      (busy || !confirmed) && styles.disabled,
                    ]}
                    onPress={() => void handleRecord()}
                  >
                    <Text style={styles.buttonText}>
                      {busy ? 'Saving…' : 'Save payout record'}
                    </Text>
                  </Pressable>
                </View>
              )}
              <View style={styles.card}>
                <Text style={styles.title}>
                  {isOrganizer
                    ? 'Payout history'
                    : 'My payout history'}
                </Text>
                {history.length ? (
                  history.map((payout) => (
                    <View
                      key={payout._id}
                      style={styles.card}
                    >
                      <Text style={styles.label}>
                        Cycle {payout.cycleNumber} ·{' '}
                        {payout.currency}{' '}
                        {payout.amount.toLocaleString('en-NG')}
                      </Text>
                      <Text style={styles.body}>
                        {typeof payout.recipientId === 'object'
                          ? payout.recipientId?.fullName ||
                            'Recipient unavailable'
                          : members.find(
                              (member) =>
                                member.userId?._id ===
                                payout.recipientId,
                            )?.userId?.fullName ||
                            'Recipient unavailable'}
                      </Text>
                      <Text style={styles.body}>
                        Status: {payout.status} · Recorded{' '}
                        {new Date(
                          payout.createdAt,
                        ).toLocaleDateString('en-NG')}
                      </Text>
                      {payout.note && (
                        <Text style={styles.body}>
                          {payout.note}
                        </Text>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.body}>
                    No payout records yet.
                  </Text>
                )}
              </View>
              <Pressable
                disabled={busy}
                onPress={() => void load()}
              >
                <Text style={styles.link}>Refresh payouts</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
