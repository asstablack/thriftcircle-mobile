import { rotationProgress } from '@/utils/payoutRotation';
import { OrganizerBottomNavigation } from '@/components/organizer-chrome';
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
import {
  Redirect,
  router,
  useFocusEffect,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GroupScreenHeader } from '@/components/group-screen-header';
import { colors } from '@/constants/color';
import {
  getCurrentCycle,
  getGroupContributions,
  getGroupDetails,
} from '@/services/groupApi';
import {
  approvePayout,
  getGroupPayouts,
  recordPayout,
  type Payout,
} from '@/services/payoutApi';
import { useAuthStore } from '@/store/authStore';
import { accountStyles as styles } from '@/styles/accountStyles';
import { payoutReadiness } from '@/utils/payoutReadiness';

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
  const group = useAuthStore(
    (state) => state.selectedGroup,
  );
  const user = useAuthStore((state) => state.user);
  const [details, setDetails] =
    useState<GroupDetails | null>(null);
  const [cycle, setCycle] = useState<CurrentCycle | null>(
    null,
  );
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [readiness, setReadiness] = useState({
    ready: false,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(
    null,
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [approvalId, setApprovalId] = useState<
    string | null
  >(null);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const version = useRef(0);
  const submitting = useRef(false);

  const load = useCallback(async () => {
    if (!group?.id) return;
    const current = ++version.current;
    setLoading(true);
    setError(null);
    setDetails(null);
    setApprovalId(null);
    setConfirmed(false);
    try {
      const [groupData, activeCycle, history] =
        await Promise.all([
          getGroupDetails(group.id),
          getCurrentCycle(group.id),
          getGroupPayouts(group.id),
        ]);
      if (current !== version.current) return;
      const contributions =
        groupData.callerRole === 'organizer'
          ? await getGroupContributions(group.id)
          : [];
      if (current !== version.current) return;
      setReadiness(
        activeCycle
          ? payoutReadiness(
              groupData.members,
              contributions,
              activeCycle.cycleNumber,
            )
          : { ready: false, total: 0 },
      );
      setDetails(groupData);
      setCycle(activeCycle);
      setPayouts(history);
      setNeedsRefresh(false);
      setFormError(null);
      return { activeCycle };
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
  }, [group]);

  useFocusEffect(
    useCallback(() => {
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
  const canCalculate =
    isOrganizer &&
    !loading &&
    !error &&
    !needsRefresh &&
    cycle &&
    !cycle.payoutId &&
    !payouts.some(
      (payout) => payout.cycleNumber === cycle.cycleNumber,
    );
  const members = [...(details?.members || [])].sort(
    (first, second) =>
      first.payoutOrder - second.payoutOrder,
  );
  const rotation = rotationProgress(members, payouts);
  const recipientName = (
    recipient: Payout['recipientId'],
  ) => {
    if (typeof recipient === 'object') {
      return recipient?.fullName || 'Recipient unavailable';
    }
    return (
      members.find(
        (member) => member.userId?._id === recipient,
      )?.userId?.fullName || 'Recipient unavailable'
    );
  };
  const history = isOrganizer
    ? payouts
    : payouts.filter((payout) => {
        const recipientId =
          typeof payout.recipientId === 'string'
            ? payout.recipientId
            : payout.recipientId?._id;
        return recipientId === user?.id;
      });

  const submit = async (payout?: Payout) => {
    if (
      submitting.current ||
      !group ||
      !isOrganizer ||
      loading ||
      error ||
      needsRefresh
    )
      return;
    if (payout) {
      if (
        payout.status !== 'pending_approval' ||
        approvalId !== payout._id ||
        !confirmed
      )
        return;
    } else if (
      !canCalculate ||
      !cycle ||
      readiness.total <= 0
    ) {
      return;
    }
    submitting.current = true;
    setBusy(true);
    setFormError(null);
    setNotice(null);
    const current = version.current;
    try {
      const saved = payout
        ? await approvePayout(payout._id)
        : await recordPayout(group.id, {
            cycleNumber: cycle!.cycleNumber,
            note,
          });
      if (current !== version.current) return;
      setPayouts((previous) => [
        saved,
        ...previous.filter(
          (item) => item._id !== saved._id,
        ),
      ]);
      setNote('');
      setApprovalId(null);
      setConfirmed(false);
      setNotice(
        payout
          ? 'Payout approved. The cycle completes when all required contributions are confirmed.'
          : 'Payout calculated. Review the server-calculated amount in payout history before approving.',
      );
      const refreshed = await load();
      if (refreshed && payout) {
        setNotice(
          refreshed.activeCycle
            ? refreshed.activeCycle.cycleNumber ===
              saved.cycleNumber
              ? 'Payout recorded as completed. The cycle remains open until the backend confirms all completion requirements.'
              : 'Payout recorded as completed. A different cycle is now active.'
            : 'Payout recorded as completed. There is currently no active cycle.',
        );
      }
    } catch (reason) {
      if (current === version.current) {
        setNeedsRefresh(true);
        setFormError(
          reason instanceof Error
            ? reason.message
            : 'Unable to confirm the submission result.',
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
        variant="plain"
        title="Payout Schedule"
        subtitle={group.groupName}
        disabled={busy}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.info}>
            ThriftCircle records payouts made outside the
            app. It does not hold or transfer money.
          </Text>
          {notice && (
            <Text
              accessibilityLiveRegion="polite"
              style={styles.notice}
            >
              {notice}
            </Text>
          )}
          {formError && (
            <Text
              accessibilityRole="alert"
              style={styles.error}
            >
              {formError} Refresh payouts before trying
              again.
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
              <Pressable
                disabled={busy}
                onPress={() => void load()}
              >
                <Text style={styles.link}>Try Again</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.card}>
                <Text style={styles.title}>
                  Current payout round
                </Text>
                <Text style={styles.body}>
                  {cycle
                    ? `Cycle ${cycle.cycleNumber} · ${recipientName(cycle.recipientId)}`
                    : 'No active cycle'}
                </Text>
                {cycle?.payoutId && (
                  <Text style={styles.body}>
                    Payout approved
                  </Text>
                )}
              </View>
              <View style={styles.card}>
                <Text style={styles.title}>
                  Full group rotation
                </Text>
                <Text style={styles.body}>
                  {rotation.received} of {rotation.total}{' '}
                  current members have received a completed
                  payout.
                </Text>
                <Text style={styles.body}>
                  {rotation.complete
                    ? 'All current members have received their payout.'
                    : 'The full rotation is complete when every participating member has received their payout.'}
                </Text>
                <Text style={styles.body}>
                  Based on current membership and recorded
                  payouts. Earlier rotations cannot be
                  separated without a saved rotation
                  identifier.
                </Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.title}>
                  Payout order
                </Text>
                <Text style={styles.body}>
                  Current positions recorded for active
                  members. These positions do not specify
                  transfer dates.
                </Text>
                {members.length ? (
                  members.map((member) => (
                    <View
                      key={member._id}
                      style={styles.payoutRow}
                    >
                      <Text style={styles.payoutPosition}>
                        {member.payoutOrder}
                      </Text>
                      <View style={styles.payoutMember}>
                        <Text style={styles.label}>
                          {member.userId?.fullName ||
                            'Member unavailable'}
                          {member.userId?._id === user.id
                            ? ' (You)'
                            : ''}
                        </Text>
                        <Text style={styles.body}>
                          Position {member.payoutOrder}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.body}>
                    No payout order available.
                  </Text>
                )}
              </View>
              {canCalculate && (
                <View style={styles.card}>
                  <Text style={styles.title}>
                    Step 1: Calculate payout
                  </Text>
                  <Text style={styles.body}>
                    Cycle {cycle.cycleNumber} ·{' '}
                    {recipientName(cycle.recipientId)}
                  </Text>
                  <Text style={styles.body}>
                    Confirmed contributions total: NGN{' '}
                    {readiness.total.toLocaleString(
                      'en-NG',
                    )}
                    . The server calculates the final
                    amount. Approval is a separate step.
                  </Text>
                  <Text style={styles.body}>
                    {readiness.ready
                      ? 'All active members have confirmed contributions.'
                      : 'Some active members still need confirmed contributions. Calculating now may produce a partial payout that cannot be recalculated in the app.'}
                  </Text>
                  <Text style={styles.label}>
                    Note optional
                  </Text>
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
                    accessibilityRole="button"
                    disabled={busy || readiness.total <= 0}
                    style={[
                      styles.button,
                      (busy || readiness.total <= 0) &&
                        styles.disabled,
                    ]}
                    onPress={() => void submit()}
                  >
                    <Text style={styles.buttonText}>
                      {busy
                        ? 'Calculating…'
                        : 'Calculate payout'}
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
                        {payout.amount.toLocaleString(
                          'en-NG',
                        )}
                      </Text>
                      <Text style={styles.body}>
                        {recipientName(payout.recipientId)}
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
                      {isOrganizer &&
                        payout.status ===
                          'pending_approval' && (
                          <>
                            <Text style={styles.label}>
                              Step 2: Approve payout
                            </Text>
                            {approvalId === payout._id ? (
                              <>
                                <Pressable
                                  accessibilityRole="checkbox"
                                  accessibilityState={{
                                    checked: confirmed,
                                    disabled:
                                      busy || needsRefresh,
                                  }}
                                  style={styles.checkbox}
                                  disabled={
                                    busy || needsRefresh
                                  }
                                  onPress={() =>
                                    setConfirmed(
                                      (value) => !value,
                                    )
                                  }
                                >
                                  <Feather
                                    name={
                                      confirmed
                                        ? 'check-square'
                                        : 'square'
                                    }
                                    size={22}
                                    color={colors.primary}
                                  />
                                  <Text
                                    style={
                                      styles.checkboxText
                                    }
                                  >
                                    I have reviewed{' '}
                                    {recipientName(
                                      payout.recipientId,
                                    )}{' '}
                                    and {payout.currency}{' '}
                                    {payout.amount.toLocaleString(
                                      'en-NG',
                                    )}
                                    , and confirm this
                                    payout was made outside
                                    ThriftCircle.
                                  </Text>
                                </Pressable>
                                <Pressable
                                  accessibilityRole="button"
                                  disabled={
                                    busy ||
                                    !confirmed ||
                                    needsRefresh
                                  }
                                  style={[
                                    styles.button,
                                    (busy ||
                                      !confirmed ||
                                      needsRefresh) &&
                                      styles.disabled,
                                  ]}
                                  onPress={() =>
                                    void submit(payout)
                                  }
                                >
                                  <Text
                                    style={
                                      styles.buttonText
                                    }
                                  >
                                    {busy
                                      ? 'Approving…'
                                      : 'Confirm payout approval'}
                                  </Text>
                                </Pressable>
                                <Pressable
                                  disabled={busy}
                                  onPress={() => {
                                    setApprovalId(null);
                                    setConfirmed(false);
                                  }}
                                >
                                  <Text style={styles.link}>
                                    Cancel
                                  </Text>
                                </Pressable>
                              </>
                            ) : (
                              <Pressable
                                accessibilityRole="button"
                                disabled={
                                  busy || needsRefresh
                                }
                                onPress={() => {
                                  setApprovalId(payout._id);
                                  setConfirmed(false);
                                }}
                              >
                                <Text style={styles.link}>
                                  Review and approve
                                </Text>
                              </Pressable>
                            )}
                          </>
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
                <Text style={styles.link}>
                  Refresh payouts
                </Text>
              </Pressable>
            </>
          )}
          {isOrganizer && (
            <Pressable
              accessibilityRole="button"
              disabled={busy || loading || needsRefresh}
              onPress={() => router.push('/payout-order')}
            >
              <Text style={styles.link}>
                Configure payout order
              </Text>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {!busy && <OrganizerBottomNavigation />}
    </SafeAreaView>
  );
}
