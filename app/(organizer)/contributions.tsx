import { GroupScreenHeader } from '@/components/group-screen-header';
import { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
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
import { contributionsStyles as styles } from '@/styles/contributionsStyles';
import {
  getGroupContributions,
  getGroupDetails,
  getCurrentCycle,
} from '@/services/groupApi';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/color';

type ContributionStatus =
  | 'DUE'
  | 'PENDING_REVIEW'
  | 'CONFIRMED'
  | 'ISSUE'
  | 'OVERDUE';
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
  ISSUE: 'Payment issue',
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
  const [choosingMember, setChoosingMember] =
    useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(
    tab === 'Overview' ? 'Overview' : 'Contributions',
  );
  const [filter, setFilter] = useState<
    ContributionStatus | 'All'
  >('All');
  const [cycle, setCycle] = useState<{
    cycleNumber: number;
    status: string;
    openedAt?: string;
  } | null>(null);
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
        getCurrentCycle(selectedGroup.id),
      ])
        .then(
          ([details, records, currentCycle]: [
            GroupDetails,
            Contribution[],
            { cycleNumber: number; status: string; openedAt?: string } | null,
          ]) => {
            if (!active) return;
            if (details.callerRole !== 'organizer')
              throw new Error(
                'Only organizers can view group contributions.',
              );
            setCycle(currentCycle);
            setGroupDetails({
              ...details,
              members: details.members.filter((item) =>
                Boolean(item.userId),
              ),
            });
            setContributions(records);
            setSelectedMemberId((previous) => {
              const requested = memberId || previous;
              return details.members.some(
                (member) =>
                  member.userId?._id === requested,
              )
                ? requested
                : undefined;
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
    .filter(
      (item) =>
        !selectedMemberId ||
        item.memberId === selectedMemberId,
    )
    .sort(
      (a, b) =>
        Date.parse(b.dueDate) - Date.parse(a.dueDate),
    );
  const visibleHistory = history.filter(
    (item) => filter === 'All' || item.status === filter,
  );
  const cycleRecords = contributions.filter(
    (item) => item.cycleNumber === cycle?.cycleNumber,
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
    .sort(
      (a, b) => Date.parse(b.time) - Date.parse(a.time),
    );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <GroupScreenHeader
        variant="plain"
        title="Contributions"
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <ContributionSkeleton />
        ) : (
          <>
            {groupDetails && selectedMemberId && (
              <>
                <Pressable
                  style={styles.memberSummary}
                  accessibilityRole="button"
                  accessibilityLabel={`Select member, ${member?.userId.fullName || 'All members'}`}
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
                      {member?.userId.fullName ||
                        'All members'}
                    </Text>
                    <Text style={styles.secondaryText}>
                      {member?.payoutOrder
                        ? `Position ${member?.payoutOrder}`
                        : member
                          ? 'Position unavailable'
                          : 'Select a member to see individual history'}
                    </Text>
                  </View>
                  <Text
                    style={[styles.badge, styles.confirmed]}
                  >
                    {member?.status === 'active'
                      ? '• Active'
                      : member?.status || 'Group'}
                  </Text>
                  <Feather
                    name="chevron-down"
                    size={16}
                    color={colors.textSecondary}
                  />
                </Pressable>
                {choosingMember && (
                  <View style={styles.memberPicker}>
                    <Pressable
                      style={styles.pickerRow}
                      accessibilityRole="button"
                      onPress={() => {
                        setSelectedMemberId(undefined);
                        setChoosingMember(false);
                        setActiveTab('Contributions');
                        router.setParams({ memberId: '' });
                      }}
                    >
                      <Text style={styles.bodyText}>
                        All members
                      </Text>
                    </Pressable>
                    {groupDetails?.members.map((item) => (
                      <Pressable
                        key={item.userId._id}
                        style={styles.pickerRow}
                        accessibilityRole="button"
                        accessibilityState={{
                          selected:
                            selectedMemberId ===
                            item.userId._id,
                        }}
                        onPress={() => {
                          setSelectedMemberId(
                            item.userId._id,
                          );
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
                        tab === activeTab &&
                          styles.activeTab,
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
                  We couldn’t load the
                  contributions. Please try again.
                </Text>
                <Text style={styles.stateText}>
                  {error}
                </Text>
                <Pressable
                  style={styles.primaryButton}
                  accessibilityRole="button"
                  onPress={() =>
                    setReload((value) => value + 1)
                  }
                >
                  <Text style={styles.primaryButtonText}>
                    Try Again
                  </Text>
                </Pressable>
              </View>
            ) : !cycle && !contributions.length ? (
              <View style={styles.emptyCycle}>
                <View style={styles.avatar}><Feather name="calendar" size={20} color={colors.primary} /></View>
                <Text style={styles.stateTitle}>No contribution yet</Text>
                <Text style={styles.stateText}>There’s currently no active savings cycle running.</Text>
                <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={() => router.push('/organizer-dashboard')}><Text style={styles.primaryButtonText}>Back to dashboard</Text></Pressable>
              </View>
            ) : !groupDetails?.members.length ? (
              <View style={styles.stateCard}>
                <Text style={styles.stateTitle}>
                  No members available
                </Text>
                <Text style={styles.stateText}>
                  There are no members to show for this
                  group.
                </Text>
              </View>
            ) : (
              <>
                {!selectedMemberId && (
                  <View style={styles.cycleStrip}>
                    <View style={styles.memberInfo}>
                      <Text style={styles.secondaryText}>{cycle ? 'Current Cycle' : 'No active cycle'}</Text>
                      <Text style={styles.cycleTitle}>{cycle ? (cycle.openedAt ? new Date(cycle.openedAt).toLocaleDateString('en-NG', {month: 'long', year: 'numeric'}) + ' Cycle' : 'Cycle ' + cycle.cycleNumber) : 'History remains available'}</Text>
                    </View>
                    {cycle && <Text style={[styles.badge, styles.confirmed]}>{cycle.status === 'ACTIVE' ? 'Active' : cycle.status.replaceAll('_', ' ')}</Text>}
                  </View>
                )}
                {!selectedMemberId && (
                  <View style={styles.stats}>
                    {[
                      {
                        label: 'Confirmed', description: 'Payments received from members.', tone: styles.statConfirmed,
                        value: cycleRecords.filter(
                          (item) =>
                            item.status === 'CONFIRMED',
                        ).length,
                      },
                      {
                        label: 'Pending', description: 'Pending verification', tone: styles.statPending,
                        value: cycleRecords.filter(
                          (item) =>
                            item.status ===
                            'PENDING_REVIEW',
                        ).length,
                      },
                      {
                        label: 'Overdue', description: 'Member needs attention', tone: styles.statOverdue,
                        value: cycleRecords.filter(
                          (item) =>
                            item.status === 'OVERDUE',
                        ).length,
                      },
                      {
                        label: 'Total Members', description: 'Members in the group', tone: styles.statMembers,
                        value:
                          groupDetails?.members.length || 0,
                      },
                    ].map((item) => (
                      <View
                        key={item.label}
                        style={styles.stat}
                      >
                        <Text style={[styles.statValue, item.tone]}>{item.value} {item.label}</Text>
                        <Text style={styles.secondaryText}>{item.description}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {selectedMemberId && (
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
                )}
                {activeTab === 'Contributions' && (
                  <>
                  <Text style={styles.sectionTitle}>Contributions history</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filters}
                  >
                    {(
                      [
                        'All',
                        'CONFIRMED',
                        'PENDING_REVIEW',
                        'OVERDUE',
                        'ISSUE',
                        'DUE',
                      ] as const
                    ).map((value) => (
                      <Pressable
                        key={value}
                        accessibilityRole="button"
                        accessibilityState={{
                          selected: filter === value,
                        }}
                        style={[
                          styles.filter,
                          filter === value &&
                            styles.filterSelected,
                        ]}
                        onPress={() => setFilter(value)}
                      >
                        <Text style={styles.bodyText}>
                          {value === 'All'
                            ? 'All'
                            : value === 'PENDING_REVIEW' ? 'Pending' : value === 'ISSUE' ? 'Issue' : labels[value]}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </>
                )}
                {activeTab === 'Contributions' &&
                  (visibleHistory.length ? (
                    <>
                      <View style={styles.historyCard}>
                        {visibleHistory.map((item) => (
                          <Pressable
                            key={item._id}
                            style={styles.historyRow}
                            accessibilityRole="button"
                            accessibilityLabel={`${money(item.amount)}, ${date(item.dueDate)}, ${labels[item.status]}. View contribution details`}
                            onPress={() =>
                              router.push({
                                pathname:
                                  '/contribution-review',
                                params: {
                                  contributionId: item._id,
                                },
                              })
                            }
                          >
                            <Text
                              style={styles.amountColumn}
                            >
                              {money(item.amount)}
                            </Text>
                            <Text style={styles.dateColumn}>
                              {date(item.dueDate)}
                            </Text>
                            <View
                              style={styles.statusColumn}
                            >
                              <Text
                                style={[
                                  styles.badge,
                                  item.status ===
                                  'CONFIRMED'
                                    ? styles.confirmed
                                    : item.status ===
                                        'PENDING_REVIEW'
                                      ? styles.underReview
                                      : item.status ===
                                            'OVERDUE' ||
                                          item.status ===
                                            'ISSUE'
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
                        No matching contributions
                      </Text>
                      <Text style={styles.stateText}>
                        Try a different status filter or
                        member.
                      </Text>
                    </View>
                  ))}
                {activeTab === 'Overview' && (
                  <View style={styles.historyCard}>
                    <Text style={styles.sectionTitle}>
                      {member
                        ? 'Member Overview'
                        : 'Group Overview'}
                    </Text>
                    <Text style={styles.overviewText}>
                      Group: {groupDetails?.group.groupName}
                    </Text>
                    <Text style={styles.overviewText}>
                      Contribution amount:{' '}
                      {money(
                        groupDetails?.group
                          .contributionAmount || 0,
                      )}
                    </Text>
                    {member?.joinedAt && (
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
                          <Text
                            style={styles.secondaryText}
                          >
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
        {[0, 1, 2, 3].map((key) => (
          <View key={key} style={styles.stat}>
            <View style={styles.skeletonShort} />
            <View style={styles.skeletonLine} />
          </View>
        ))}
      </View>
      <View style={styles.historyCard}>
        {[0, 1, 2, 3, 4, 5].map((key) => (
          <View key={key} style={styles.skeletonRow}>
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonShort} />
          </View>
        ))}
      </View>
    </View>
  );
}
