import {
  getMemberDashboard,
  type MemberDashboardData,
} from '@/services/dashboardApi';
import { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrganizerBottomNavigation } from '@/components/organizer-chrome';
import { getGroupContributions } from '@/services/groupApi';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/color';
import { memberDashboardStyles as styles } from '@/styles/memberDashboardStyles';

type Contribution = {
  _id: string;
  memberId: string;
  amount: number;
  dueDate: string;
  status:
    'DUE' | 'PENDING_REVIEW' | 'CONFIRMED' | 'ISSUE' | 'OVERDUE';
};
const labels = {
  DUE: 'Due',
  PENDING_REVIEW: 'Under review',
  CONFIRMED: 'Confirmed',
  ISSUE: 'Correction requested',
  OVERDUE: 'Overdue',
};
const money = (amount: number) =>
  '₦' + amount.toLocaleString('en-NG');
const date = (value: string) =>
  new Date(value).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export default function MemberDashboard() {
  const user = useAuthStore((state) => state.user);
  const group = useAuthStore((state) => state.selectedGroup);
  const { view } = useLocalSearchParams<{ view?: string }>();
  const historyView = view === 'history';
  const [summary, setSummary] =
    useState<MemberDashboardData | null>(null);
  const [records, setRecords] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (!group?.id) {
        router.replace('/group-selection');
        return;
      }
      setLoading(true);
      setError(null);
      Promise.all([
        getGroupContributions(group.id),
        getMemberDashboard(group.id),
      ])
        .then(
          ([result, dashboard]: [
            Contribution[],
            MemberDashboardData,
          ]) => {
            if (!active) return;
            setRecords(result);
            setSummary(dashboard);
          },
        )
        .catch((reason: unknown) => {
          if (active)
            setError(
              reason instanceof Error
                ? reason.message
                : 'Unable to load your contributions.',
            );
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
      // Retry refreshes the focused screen without changing the selected group.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group?.id, reload]),
  );

  const history = records
    .filter((item) => item.memberId === user?.id)
    .sort(
      (a, b) => Date.parse(b.dueDate) - Date.parse(a.dueDate),
    );
  // The summary endpoint currently excludes ISSUE; keep correction requests visible.
  const attention = history.filter(
    (item) => item.status === 'ISSUE',
  );
  const outstanding =
    summary?.currentContribution ||
    attention[attention.length - 1];
  const amountOutstanding = history
    .filter(
      (item) =>
        item.status === 'DUE' || item.status === 'OVERDUE',
    )
    .reduce((total, item) => total + item.amount, 0);
  const payments = history.filter(
    (item) =>
      item.status === 'CONFIRMED' ||
      item.status === 'PENDING_REVIEW',
  );
  const visible = historyView
    ? history.filter(
        (item) =>
          (status === 'All' || labels[item.status] === status) &&
          (
            date(item.dueDate) +
            ' ' +
            item.amount +
            ' ' +
            labels[item.status]
          )
            .toLowerCase()
            .includes(query.toLowerCase()),
      )
    : payments.slice(0, 4);
  const openDetails = (id: string) =>
    router.push({
      pathname: '/contribution-review',
      params: { contributionId: id },
    });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.fullName?.trim().charAt(0).toUpperCase() ||
              'M'}
          </Text>
        </View>
        <View style={styles.headerName}>
          <Text style={styles.secondaryText}>Welcome,</Text>
          <Text style={styles.name}>
            {user?.fullName?.split(' ')[0] || 'Member'}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open notifications"
          hitSlop={12}
          onPress={() => router.push('/notifications')}
        >
          <Feather
            name="bell"
            size={22}
            color={colors.textDark}
          />
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {historyView && (
          <Pressable
            style={styles.historyHeading}
            onPress={() => router.setParams({ view: 'home' })}
            accessibilityRole="button"
            accessibilityLabel="Back to dashboard"
          >
            <Feather
              name="arrow-left"
              size={22}
              color={colors.white}
            />
            <Text style={styles.groupName}>
              Contribution History
            </Text>
          </Pressable>
        )}
        {loading ? (
          <View
            accessibilityLabel="Loading contributions"
            accessibilityState={{ busy: true }}
          >
            <View style={styles.skeletonSummary} />
            {[0, 1, 2].map((item) => (
              <View
                key={item}
                style={styles.skeletonCard}
              />
            ))}
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <Feather
              name="alert-circle"
              size={28}
              color={colors.primary}
            />
            <Text style={styles.heading}>
              Unable to load contributions
            </Text>
            <Text style={styles.secondaryText}>{error}</Text>
            <Pressable
              style={styles.retryButton}
              onPress={() => setReload((value) => value + 1)}
            >
              <Text style={styles.whiteText}>Try Again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {!historyView && (
              <>
                <View style={styles.summary}>
                  <Text style={styles.groupName}>
                    {group?.groupName}
                  </Text>
                  <View style={styles.summaryRow}>
                    <View style={styles.summaryColumn}>
                      <Text style={styles.summaryLabel}>
                        Contribution
                      </Text>
                      <Text style={styles.summaryValue}>
                        {outstanding
                          ? money(outstanding.amount)
                          : money(0)}
                      </Text>
                    </View>
                    <View style={styles.summaryColumn}>
                      <Text style={styles.summaryLabel}>
                        Date Due
                      </Text>
                      <Text style={styles.summaryValue}>
                        {outstanding
                          ? date(outstanding.dueDate)
                          : '—'}
                      </Text>
                    </View>
                    <View style={styles.summaryColumn}>
                      <Text style={styles.summaryLabel}>
                        Status
                      </Text>
                      <Text style={styles.summaryValue}>
                        {outstanding
                          ? labels[outstanding.status]
                          : 'Up to date'}
                      </Text>
                    </View>
                  </View>
                  {outstanding ? (
                    <Pressable
                      style={styles.outstandingLink}
                      onPress={() =>
                        openDetails(outstanding._id)
                      }
                    >
                      <Text style={styles.whiteText}>
                        View Contribution Details
                      </Text>
                      <Feather
                        name="arrow-right"
                        size={17}
                        color={colors.white}
                      />
                    </Pressable>
                  ) : (
                    <Text style={styles.summaryLabel}>
                      No outstanding contributions.
                    </Text>
                  )}
                </View>
                <View style={styles.paymentCard}>
                  <View style={styles.headerName}>
                    <Text style={styles.secondaryText}>
                      Your payout position
                    </Text>
                    <Text style={styles.amount}>
                      {summary?.payoutOrder
                        ? 'Position ' + summary.payoutOrder
                        : 'Not assigned'}
                    </Text>
                    <Text style={styles.secondaryText}>
                      {summary?.isNextRecipient
                        ? 'You are the current cycle recipient.'
                        : 'Payouts are arranged outside ThriftCircle.'}
                    </Text>
                    <Pressable
                      onPress={() => router.push('/payouts')}
                    >
                      <Text style={styles.linkText}>
                        View payout order and history
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <View style={styles.paymentCard}>
                  <View>
                    <Text style={styles.secondaryText}>
                      Outstanding amount
                    </Text>
                    <Text style={styles.amount}>
                      {money(amountOutstanding)}
                    </Text>
                    <Text style={styles.secondaryText}>
                      Due and overdue contributions
                    </Text>
                  </View>
                </View>
                <View style={styles.paymentCard}>
                  <View>
                    <Text style={styles.heading}>
                      Group progress
                    </Text>
                    <Text style={styles.secondaryText}>
                      {summary?.cycleProgress
                        ? 'Cycle ' +
                          summary.cycleProgress.cycleNumber +
                          ': ' +
                          summary.cycleProgress.confirmed +
                          ' of ' +
                          summary.cycleProgress.total +
                          ' contributions confirmed'
                        : 'No active cycle yet.'}
                    </Text>
                  </View>
                </View>
                {attention.map((item) => (
                  <Pressable
                    key={item._id}
                    style={styles.paymentCard}
                    onPress={() => openDetails(item._id)}
                  >
                    <Text style={styles.linkText}>
                      Correction requested · {money(item.amount)}{' '}
                      · View details
                    </Text>
                  </Pressable>
                ))}
                <Text style={styles.heading}>
                  Recent Payments
                </Text>
                <Pressable
                  style={styles.historyLink}
                  onPress={() =>
                    router.setParams({ view: 'history' })
                  }
                >
                  <Text style={styles.linkText}>
                    View Contribution History
                  </Text>
                  <Feather
                    name="chevron-right"
                    size={18}
                    color={colors.primary}
                  />
                </Pressable>
              </>
            )}
            {historyView && (
              <>
                <TextInput
                  style={styles.search}
                  accessibilityLabel="Search contribution history"
                  placeholder="Search by date, amount or status"
                  value={query}
                  onChangeText={setQuery}
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filters}
                >
                  {['All', ...Object.values(labels)].map(
                    (label) => (
                      <Pressable
                        key={label}
                        style={[
                          styles.filter,
                          status === label &&
                            styles.filterSelected,
                        ]}
                        onPress={() => setStatus(label)}
                        accessibilityRole="button"
                        accessibilityState={{
                          selected: status === label,
                        }}
                      >
                        <Text style={styles.linkText}>
                          {label}
                        </Text>
                      </Pressable>
                    ),
                  )}
                </ScrollView>
              </>
            )}
            {visible.length ? (
              visible.map((item) => (
                <Pressable
                  key={item._id}
                  style={styles.paymentCard}
                  onPress={() => openDetails(item._id)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    date(item.dueDate) +
                    ', ' +
                    money(item.amount) +
                    ', ' +
                    labels[item.status]
                  }
                >
                  <View>
                    <Text style={styles.secondaryText}>
                      {date(item.dueDate)}
                    </Text>
                    <Text style={styles.amount}>
                      {money(item.amount)}
                    </Text>
                  </View>
                  <View style={styles.paymentStatus}>
                    <Text style={styles.secondaryText}>
                      Status
                    </Text>
                    <Text
                      style={[
                        styles.badge,
                        item.status === 'CONFIRMED'
                          ? styles.confirmed
                          : styles.pending,
                      ]}
                    >
                      {labels[item.status]}
                    </Text>
                  </View>
                </Pressable>
              ))
            ) : (
              <View style={styles.stateCard}>
                <Feather
                  name="file-text"
                  size={28}
                  color={colors.primary}
                />
                <Text style={styles.heading}>
                  {historyView
                    ? 'No matching contributions'
                    : 'No recent payments'}
                </Text>
                <Text style={styles.secondaryText}>
                  {historyView
                    ? 'Try another search or status filter.'
                    : 'Your submitted and confirmed payments will appear here.'}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
      <OrganizerBottomNavigation
        active={historyView ? 'Contributions' : 'Home'}
      />
    </SafeAreaView>
  );
}
