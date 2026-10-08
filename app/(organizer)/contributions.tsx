import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  OrganizerHeader,
  OrganizerBottomNavigation,
} from '@/components/organizer-chrome';
import { contributionsStyles as styles } from '@/styles/contributionsStyles';
import {
  getGroupContributions,
  getGroupDetails,
} from '@/services/groupApi';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/color';

type ContributionStatus =
  'DUE' | 'PENDING_REVIEW' | 'CONFIRMED' | 'ISSUE' | 'OVERDUE';
type Contribution = {
  _id: string;
  memberId: string;
  amount: number;
  dueDate: string;
  cycleNumber: number;
  status: ContributionStatus;
  submittedAt?: string | null;
  confirmedAt?: string | null;
};
type Member = {
  userId: { _id: string; fullName: string };
  payoutOrder?: number;
  status: 'active' | 'pending' | 'removed';
  joinedAt?: string;
};
type GroupDetails = {
  group: {
    _id: string;
    groupName: string;
    contributionAmount: number;
  };
  members: Member[];
  callerRole: 'organizer' | 'member';
};
type Tab = 'Overview' | 'Contributions' | 'Activity';
const money = (amount: number) =>
  `₦${amount.toLocaleString('en-NG')}`;
const date = (value: string) =>
  new Date(value).toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
const labels: Record<ContributionStatus, string> = {
  DUE: 'Due',
  PENDING_REVIEW: 'Under review',
  CONFIRMED: 'Confirmed',
  ISSUE: 'Correction requested',
  OVERDUE: 'Overdue',
};

export default function ContributionsScreen() {
  const selectedGroup = useAuthStore(
    (state) => state.selectedGroup,
  );
  const { memberId, tab } = useLocalSearchParams<{
    memberId?: string;
    tab?: string;
  }>();
  const [groupDetails, setGroupDetails] =
    useState<GroupDetails | null>(null);
  const [contributions, setContributions] = useState<
    Contribution[]
  >([]);
  const [selectedMemberId, setSelectedMemberId] = useState<
    string | undefined
  >(memberId);
  const [choosingMember, setChoosingMember] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(
    tab === 'Overview' ? 'Overview' : 'Contributions',
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (
        !selectedGroup?.id ||
        selectedGroup.role !== 'organizer'
      ) {
        router.replace('/group-selection');
        return;
      }
      setLoading(true);
      setError(null);
      setActiveTab(
        tab === 'Overview' ? 'Overview' : 'Contributions',
      );
      // History includes all cycles, even when the group has no active cycle.
      Promise.all([
        getGroupDetails(selectedGroup.id),
        getGroupContributions(selectedGroup.id),
      ])
        .then(
          ([details, records]: [
            GroupDetails,
            Contribution[],
          ]) => {
            if (!active) return;
            setGroupDetails(details);
            setContributions(records);
            setSelectedMemberId((previous) => {
              const requested = memberId || previous;
              return details.members.some(
                (member) => member.userId?._id === requested,
              )
                ? requested
                : details.members[0]?.userId?._id;
            });
          },
        )
        .catch((reason: unknown) => {
          if (active)
            setError(
              reason instanceof Error
                ? reason.message
                : 'Unable to load contributions.',
            );
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
      // The retry counter intentionally restarts this focused request.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      selectedGroup?.id,
      selectedGroup?.role,
      memberId,
      tab,
      reload,
    ]),
  );

  const member = groupDetails?.members.find(
    (item) => item.userId?._id === selectedMemberId,
  );
  const history = contributions
    .filter((item) => item.memberId === selectedMemberId)
    .sort(
      (a, b) => Date.parse(b.dueDate) - Date.parse(a.dueDate),
    );
  const confirmed = history.filter(
    (item) => item.status === 'CONFIRMED',
  );
  const totalPaid = confirmed.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const totalExpected = history.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const initials = (member?.userId.fullName || 'Member')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const activities = history
    .flatMap((item) => [
      ...(item.submittedAt
        ? [
            {
              id: `${item._id}-submitted`,
              text: 'Payment evidence submitted',
              time: item.submittedAt,
            },
          ]
        : []),
      ...(item.confirmedAt
        ? [
            {
              id: `${item._id}-confirmed`,
              text: 'Payment confirmed',
              time: item.confirmedAt,
            },
          ]
        : []),
    ])
    .sort((a, b) => Date.parse(b.time) - Date.parse(a.time));

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <OrganizerHeader />
      <Pressable
        style={styles.backButton}
        accessibilityRole="button"
        onPress={() => router.navigate('/organizer-dashboard')}
      >
        <Feather
          name="arrow-left"
          size={17}
          color={colors.textSecondary}
        />
        <Text style={styles.secondaryText}>
          Back to dashboard
        </Text>
      </Pressable>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Contributions</Text>
        <Text style={styles.bannerText}>
          Track contributions, verify payments, and manage your
          group’s progress.
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ContributionSkeleton />
        ) : (
          <>
            {member && (
              <>
                <Pressable
                  style={styles.memberSummary}
                  accessibilityRole="button"
                  accessibilityLabel={`Select member, ${member.userId.fullName}`}
                  accessibilityState={{
                    expanded: choosingMember,
                  }}
                  onPress={() =>
                    setChoosingMember(!choosingMember)
                  }
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {initials}
                    </Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.userId.fullName}
                    </Text>
                    <Text style={styles.secondaryText}>
                      {member.payoutOrder
                        ? `Position ${member.payoutOrder}`
                        : 'Position unavailable'}
                    </Text>
                  </View>
                  <Text style={[styles.badge, styles.confirmed]}>
                    {member.status === 'active'
                      ? '• Active'
                      : member.status}
                  </Text>
                  <Feather
                    name="chevron-down"
                    size={16}
                    color={colors.textSecondary}
                  />
                </Pressable>
                {choosingMember && (
                  <View style={styles.memberPicker}>
                    {groupDetails?.members.map((item) => (
                      <Pressable
                        key={item.userId._id}
                        style={styles.pickerRow}
                        accessibilityRole="button"
                        accessibilityState={{
                          selected:
                            selectedMemberId === item.userId._id,
                        }}
                        onPress={() => {
                          setSelectedMemberId(item.userId._id);
                          setChoosingMember(false);
                        }}
                      >
                        <Text style={styles.bodyText}>
                          {item.userId.fullName}
                        </Text>
                        {selectedMemberId ===
                          item.userId._id && (
                          <Feather
                            name="check"
                            size={18}
                            color={colors.primary}
                          />
                        )}
                      </Pressable>
                    ))}
                  </View>
                )}
                <View style={styles.tabs}>
                  {(
                    [
                      'Overview',
                      'Contributions',
                      'Activity',
                    ] as Tab[]
                  ).map((tab) => (
                    <Pressable
                      key={tab}
                      style={[
                        styles.tab,
                        tab === activeTab && styles.activeTab,
                      ]}
                      accessibilityRole="tab"
                      accessibilityState={{
                        selected: activeTab === tab,
                      }}
                      onPress={() => setActiveTab(tab)}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          tab === activeTab &&
                            styles.activeTabText,
                        ]}
                      >
                        {tab}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}
            {error ? (
              <View style={styles.stateCard}>
                <Feather
                  name="alert-circle"
                  size={26}
                  color={colors.error}
                />
                <Text style={styles.stateTitle}>
                  Something went wrong
                </Text>
                <Text style={styles.stateText}>
                  We couldn’t load this member’s contributions.
                  Please try again.
                </Text>
                <Text style={styles.stateText}>{error}</Text>
                <Pressable
                  style={styles.primaryButton}
                  accessibilityRole="button"
                  onPress={() => setReload((value) => value + 1)}
                >
                  <Text style={styles.primaryButtonText}>
                    Try Again
                  </Text>
                </Pressable>
              </View>
            ) : !member ? (
              <View style={styles.stateCard}>
                <Text style={styles.stateTitle}>
                  No members available
                </Text>
                <Text style={styles.stateText}>
                  There are no members to show for this group.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.stats}>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>
                      {money(totalPaid)}
                    </Text>
                    <Text style={styles.secondaryText}>
                      Total Paid
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>
                      {money(totalExpected)}
                    </Text>
                    <Text style={styles.secondaryText}>
                      Total Expected
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>
                      {confirmed.length}/{history.length}
                    </Text>
                    <Text style={styles.secondaryText}>
                      Contributions
                    </Text>
                  </View>
                </View>
                {activeTab === 'Contributions' &&
                  (history.length ? (
                    <>
                      <Text style={styles.sectionTitle}>
                        Contribution History
                      </Text>
                      <View style={styles.historyCard}>
                        <View style={styles.tableHeader}>
                          <Text style={styles.amountColumn}>
                            Amount
                          </Text>
                          <Text style={styles.dateColumn}>
                            Date
                          </Text>
                          <Text style={styles.statusColumn}>
                            Status
                          </Text>
                          <View style={styles.chevronSpace} />
                        </View>
                        {history.map((item) => (
                          <Pressable
                            key={item._id}
                            style={styles.historyRow}
                            accessibilityRole="button"
                            accessibilityLabel={`${money(item.amount)}, ${date(item.dueDate)}, ${labels[item.status]}. View contribution details`}
                            onPress={() =>
                              router.push({
                                pathname: '/contribution-review',
                                params: {
                                  contributionId: item._id,
                                },
                              })
                            }
                          >
                            <Text style={styles.amountColumn}>
                              {money(item.amount)}
                            </Text>
                            <Text style={styles.dateColumn}>
                              {date(item.dueDate)}
                            </Text>
                            <View style={styles.statusColumn}>
                              <Text
                                style={[
                                  styles.badge,
                                  item.status === 'CONFIRMED'
                                    ? styles.confirmed
                                    : item.status ===
                                        'PENDING_REVIEW'
                                      ? styles.pending
                                      : item.status ===
                                            'OVERDUE' ||
                                          item.status === 'ISSUE'
                                        ? styles.issue
                                        : styles.due,
                                ]}
                              >
                                {labels[item.status]}
                              </Text>
                            </View>
                            <Feather
                              name="chevron-right"
                              size={17}
                              color={colors.textSecondary}
                            />
                          </Pressable>
                        ))}
                      </View>
                    </>
                  ) : (
                    <View style={styles.stateCard}>
                      <View style={styles.avatar}>
                        <Feather
                          name="calendar"
                          size={22}
                          color={colors.primary}
                        />
                      </View>
                      <Text style={styles.stateTitle}>
                        No contribution yet
                      </Text>
                      <Text style={styles.stateText}>
                        This member hasn’t made any contribution
                        for this group.
                      </Text>
                    </View>
                  ))}
                {activeTab === 'Overview' && (
                  <View style={styles.historyCard}>
                    <Text style={styles.sectionTitle}>
                      Member Overview
                    </Text>
                    <Text style={styles.overviewText}>
                      Group: {groupDetails?.group.groupName}
                    </Text>
                    <Text style={styles.overviewText}>
                      Contribution amount:{' '}
                      {money(
                        groupDetails?.group.contributionAmount ||
                          0,
                      )}
                    </Text>
                    {member.joinedAt && (
                      <Text style={styles.overviewText}>
                        Joined: {date(member.joinedAt)}
                      </Text>
                    )}
                  </View>
                )}
                {activeTab === 'Activity' && (
                  <View style={styles.historyCard}>
                    <Text style={styles.sectionTitle}>
                      Recent Activities
                    </Text>
                    {activities.length ? (
                      activities.map((item) => (
                        <View
                          key={item.id}
                          style={styles.activityRow}
                        >
                          <Text style={styles.bodyText}>
                            {item.text}
                          </Text>
                          <Text style={styles.secondaryText}>
                            {date(item.time)}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.stateText}>
                        No recent activities.
                      </Text>
                    )}
                  </View>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
      <OrganizerBottomNavigation active="Contributions" />
    </SafeAreaView>
  );
}

function ContributionSkeleton() {
  return (
    <View
      accessible
      accessibilityLabel="Loading contributions"
      accessibilityState={{ busy: true }}
    >
      <View style={styles.memberSummary}>
        <View style={styles.skeletonAvatar} />
        <View style={styles.memberInfo}>
          <View style={styles.skeletonShort} />
          <View style={styles.skeletonLine} />
        </View>
      </View>
      <View style={styles.stats}>
        {[0, 1, 2].map((key) => (
          <View
            key={key}
            style={styles.stat}
          >
            <View style={styles.skeletonShort} />
            <View style={styles.skeletonLine} />
          </View>
        ))}
      </View>
      <View style={styles.historyCard}>
        {[0, 1, 2, 3, 4, 5].map((key) => (
          <View
            key={key}
            style={styles.skeletonRow}
          >
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonShort} />
          </View>
        ))}
      </View>
    </View>
  );
}
