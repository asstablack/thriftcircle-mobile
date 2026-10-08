import {
  getOrganizerDashboard,
  type OrganizerDashboardData,
} from '@/services/dashboardApi';
import {
  getCurrentCycle,
  getGroupContributions,
  getGroupDetails,
} from '@/services/groupApi';
import { useAuthStore } from '@/store/authStore';
import {
  organizerDashboardStyles as styles,
  dashboardProgressStyle,
} from '@/styles/organizerDashboardStyles';
import { router, useFocusEffect } from 'expo-router';
import {
  OrganizerHeader,
  OrganizerBottomNavigation,
} from '@/components/organizer-chrome';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/constants/color';
import { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Contribution = {
  _id: string;
  memberId: string;
  amount: number;
  dueDate: string;
  cycleNumber: number;
  status:
    'DUE' | 'PENDING_REVIEW' | 'CONFIRMED' | 'ISSUE' | 'OVERDUE';
  submittedAt: string | null;
  confirmedAt: string | null;
};

type Member = {
  userId: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
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

type Cycle = {
  cycleNumber: number;
  status: 'ACTIVE' | 'PAYOUT_PHASE' | 'COMPLETED';
  openedAt: string;
  closedAt: string | null;
};

export default function OrganizerDashboard() {
  const user = useAuthStore((state) => state.user);
  const selectedGroup = useAuthStore(
    (state) => state.selectedGroup,
  );

  const [groupDetails, setGroupDetails] =
    useState<GroupDetails | null>(null);

  const [contributions, setContributions] = useState<
    Contribution[]
  >([]);

  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(
    null,
  );

  const [summary, setSummary] =
    useState<OrganizerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const requestVersion = useRef(0);

  const loadDashboard = useCallback(async () => {
    const version = ++requestVersion.current;
    if (!selectedGroup?.id) {
      Alert.alert(
        'No group selected',
        'Please select a group before opening the dashboard.',
      );
      router.replace('/group-selection');
      return;
    }

    try {
      setLoading(true);

      const [details, contributionData, cycle, dashboard] =
        await Promise.all([
          getGroupDetails(selectedGroup.id),
          getGroupContributions(selectedGroup.id),
          getCurrentCycle(selectedGroup.id),
          getOrganizerDashboard(selectedGroup.id),
        ]);

      if (version !== requestVersion.current) return;
      setGroupDetails(details);
      setContributions(contributionData);
      setCurrentCycle(cycle);
      setSummary(dashboard);
    } catch (error) {
      if (version !== requestVersion.current) return;
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load dashboard data.';

      setGroupDetails(null);
      Alert.alert('Unable to load dashboard', message);
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, [selectedGroup]);

  useFocusEffect(
    useCallback(() => {
      void loadDashboard();
      return () => {
        requestVersion.current++;
      };
    }, [loadDashboard]),
  );

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMemberName = (memberId: string) => {
    const member = groupDetails?.members.find(
      (item) => item.userId._id === memberId,
    );

    return member?.userId.fullName || 'Member';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <OrganizerHeader />

        <View style={styles.welcomeBanner}>
          <View style={styles.skeletonWelcomeLine} />
          <View style={styles.skeletonWelcomeSmall} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.skeletonCycle} />
          <View
            style={styles.skeletonSummary}
            accessible
            accessibilityLabel="Loading dashboard"
            accessibilityState={{ busy: true }}
          >
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonShortLine} />
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonButton} />
          </View>
          {[0, 1].map((key) => (
            <View
              key={key}
              style={styles.skeletonSummary}
            >
              <View style={styles.skeletonShortLine} />
              {[0, 1].map((row) => (
                <View
                  key={row}
                  style={styles.skeletonRow}
                >
                  <View style={styles.skeletonCircle} />
                  <View style={styles.skeletonTextBlock}>
                    <View style={styles.skeletonShortLine} />
                    <View style={styles.skeletonLine} />
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>

        <OrganizerBottomNavigation />
      </SafeAreaView>
    );
  }

  if (!groupDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyStateTitle}>
            Dashboard unavailable
          </Text>

          <Text style={styles.emptyStateText}>
            We could not load your group information.
          </Text>

          <Pressable
            style={styles.viewButton}
            onPress={loadDashboard}
          >
            <Text style={styles.viewButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const currentCycleContributions = currentCycle
    ? contributions.filter(
        (item) => item.cycleNumber === currentCycle.cycleNumber,
      )
    : [];

  const confirmedContributions =
    currentCycleContributions.filter(
      (item) => item.status === 'CONFIRMED',
    );

  const pendingContributions = currentCycleContributions.filter(
    (item) => item.status === 'PENDING_REVIEW',
  );

  const overdueContributions = currentCycleContributions.filter(
    (item) => item.status === 'OVERDUE',
  );

  const totalAmount = currentCycleContributions.reduce(
    (total, item) => total + item.amount,
    0,
  );

  const confirmedAmount = confirmedContributions.reduce(
    (total, item) => total + item.amount,
    0,
  );

  const progress =
    totalAmount > 0
      ? Math.min((confirmedAmount / totalAmount) * 100, 100)
      : 0;

  const attentionItems = [
    ...pendingContributions.map((item) => ({
      id: `pending-${item._id}`,
      memberId: item.memberId,
      title: 'Payment awaiting review',
      subtitle: `₦${item.amount.toLocaleString()}`,
      type: 'pending',
    })),
    ...overdueContributions.map((item) => ({
      id: `overdue-${item._id}`,
      memberId: item.memberId,
      title: 'Overdue contribution',
      subtitle: `₦${item.amount.toLocaleString()}`,
      type: 'overdue',
    })),
  ].slice(0, 3);

  const upcomingDeadlines = [...currentCycleContributions]
    .filter(
      (item) =>
        item.status === 'DUE' || item.status === 'OVERDUE',
    )
    .sort(
      (a, b) =>
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime(),
    )
    .slice(0, 2);

  const recentActivities = [
    ...contributions
      .filter((item) => item.submittedAt)
      .map((item) => ({
        id: `submitted-${item._id}`,
        initials: getInitials(getMemberName(item.memberId)),
        text: `${getMemberName(item.memberId)} submitted payment evidence`,
        date: item.submittedAt as string,
      })),
    ...contributions
      .filter((item) => item.confirmedAt)
      .map((item) => ({
        id: `confirmed-${item._id}`,
        initials: getInitials(getMemberName(item.memberId)),
        text: `${getMemberName(item.memberId)}'s payment was confirmed`,
        date: item.confirmedAt as string,
      })),
  ]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <OrganizerHeader />
      {/* Welcome */}
      <View style={styles.welcomeBanner}>
        <Text style={styles.greeting}>
          Good morning,{' '}
          {user?.fullName?.split(' ')[0] || 'Organizer'}
        </Text>

        <Text style={styles.welcomeText}>
          Here is what’s happening with your savings group.
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable
          accessibilityRole="button"
          style={styles.viewButton}
          onPress={() => router.push('/payouts')}
        >
          <Text style={styles.viewButtonText}>
            View payout order and history
          </Text>
        </Pressable>
        {summary && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>
              Across all cycles
            </Text>
            <Text style={styles.emptyStateText}>
              {summary.memberCount} active members ·{' '}
              {summary.confirmedContributions} confirmed
            </Text>
            <Text style={styles.emptyStateText}>
              {summary.outstandingContributions} outstanding ·{' '}
              {summary.awaitingVerification} awaiting
              verification · {summary.paymentIssues} payment
              issues
            </Text>
            {summary.currentCycle && (
              <Text style={styles.emptyStateText}>
                Current recipient:{' '}
                {getMemberName(summary.currentCycle.recipientId)}
              </Text>
            )}
          </View>
        )}
        {/* Active Cycle */}
        {currentCycle ? (
          <>
            <View style={styles.cycleHeader}>
              <View>
                <Text style={styles.cycleDate}>
                  Current Cycle
                </Text>

                <Text style={styles.cycleTitle}>
                  {new Date(
                    currentCycle.openedAt,
                  ).toLocaleDateString('en-NG', {
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  Cycle
                </Text>
              </View>

              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>
                  {currentCycle.status === 'PAYOUT_PHASE'
                    ? '• Payout Phase'
                    : '• Active Cycle'}
                </Text>
              </View>
            </View>

            {/* Contribution Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>
                Contribution Summary
              </Text>

              <Text style={styles.summaryCount}>
                {confirmedContributions.length} of{' '}
                {currentCycleContributions.length} contributions
                confirmed
              </Text>

              <Text style={styles.summaryAmount}>
                ₦{confirmedAmount.toLocaleString()}
                <Text style={styles.summaryTarget}>
                  {' '}
                  / ₦{totalAmount.toLocaleString()}
                </Text>
              </Text>

              <Text style={styles.confirmedLabel}>
                Confirmed contributions
              </Text>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    dashboardProgressStyle(progress),
                  ]}
                />
              </View>

              <Text style={styles.progressText}>
                {Math.round(progress)}%
              </Text>

              <View style={styles.summaryStats}>
                <View
                  style={[
                    styles.summaryStat,
                    styles.confirmedStat,
                  ]}
                >
                  <Text
                    style={[
                      styles.summaryStatValue,
                      styles.confirmedText,
                    ]}
                  >
                    {confirmedContributions.length}
                  </Text>
                  <Text style={styles.summaryStatLabel}>
                    Confirmed
                  </Text>
                </View>

                <View
                  style={[
                    styles.summaryStat,
                    styles.pendingStat,
                  ]}
                >
                  <Text
                    style={[
                      styles.summaryStatValue,
                      styles.pendingText,
                    ]}
                  >
                    {pendingContributions.length}
                  </Text>
                  <Text style={styles.summaryStatLabel}>
                    Pending Verification
                  </Text>
                </View>

                <View
                  style={[
                    styles.summaryStat,
                    styles.overdueStat,
                  ]}
                >
                  <Text
                    style={[
                      styles.summaryStatValue,
                      styles.overdueText,
                    ]}
                  >
                    {overdueContributions.length}
                  </Text>
                  <Text style={styles.summaryStatLabel}>
                    Overdue
                  </Text>
                </View>

                <View
                  style={[
                    styles.summaryStat,
                    styles.membersStat,
                  ]}
                >
                  <Text
                    style={[
                      styles.summaryStatValue,
                      styles.membersText,
                    ]}
                  >
                    {groupDetails.members.length}
                  </Text>
                  <Text style={styles.summaryStatLabel}>
                    Total Members
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.viewButton}
                onPress={() => router.push('/contributions')}
              >
                <Text style={styles.viewButtonText}>
                  View Contributions
                </Text>
              </Pressable>
            </View>

            {/* Needs Your Attention */}
            <View
              style={[
                styles.sectionHeader,
                styles.attentionHeader,
              ]}
            >
              <Text style={styles.sectionHeaderTitle}>
                Needs your attention
              </Text>

              <Text style={styles.sectionArrow}>›</Text>
            </View>

            <View style={styles.listCard}>
              {attentionItems.length === 0 ? (
                <Text style={styles.emptyListText}>
                  Nothing needs your attention right now.
                </Text>
              ) : (
                attentionItems.map((item) => (
                  <Pressable
                    key={item.id}
                    style={styles.listRow}
                    onPress={() =>
                      router.push({
                        pathname: '/contributions',
                        params: { memberId: item.memberId },
                      })
                    }
                  >
                    <View
                      style={[
                        styles.statusIcon,
                        item.type === 'overdue'
                          ? styles.statusIconDanger
                          : styles.statusIconPending,
                      ]}
                    >
                      <Text style={styles.statusIconText}>
                        {item.type === 'overdue' ? '!' : '✓'}
                      </Text>
                    </View>

                    <View style={styles.listInfo}>
                      <Text style={styles.listTitle}>
                        {item.title}
                      </Text>
                      <Text style={styles.listSubtitle}>
                        {item.subtitle}
                      </Text>
                    </View>

                    <Text style={styles.rowArrow}>›</Text>
                  </Pressable>
                ))
              )}
            </View>

            {/* Upcoming Deadlines */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderTitle}>
                Upcoming Deadlines
              </Text>

              <Pressable
                onPress={() => router.push('/contributions')}
              >
                <Text style={styles.viewAll}>View all ›</Text>
              </Pressable>
            </View>

            <View style={styles.listCard}>
              {upcomingDeadlines.length === 0 ? (
                <Text style={styles.emptyListText}>
                  No upcoming deadlines.
                </Text>
              ) : (
                upcomingDeadlines.map((item) => (
                  <Pressable
                    key={item._id}
                    style={styles.deadlineRow}
                    onPress={() =>
                      router.push({
                        pathname: '/contributions',
                        params: { memberId: item.memberId },
                      })
                    }
                  >
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayText}>
                        {new Date(
                          item.dueDate,
                        ).toDateString() ===
                        new Date().toDateString()
                          ? 'Today'
                          : item.status === 'OVERDUE'
                            ? 'Overdue'
                            : 'Due'}
                      </Text>
                    </View>

                    <View style={styles.listInfo}>
                      <Text style={styles.listTitle}>
                        {formatDate(item.dueDate)}
                      </Text>

                      <Text style={styles.listSubtitle}>
                        {item.status === 'OVERDUE'
                          ? 'Contribution overdue'
                          : 'Contribution due'}
                      </Text>
                    </View>

                    <Text style={styles.rowArrow}>›</Text>
                  </Pressable>
                ))
              )}
            </View>

            {/* Recent Activities */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderTitle}>
                Recent Activities
              </Text>

              <Pressable
                onPress={() => router.push('/notifications')}
              >
                <Text style={styles.viewAll}>View all ›</Text>
              </Pressable>
            </View>

            <View style={styles.listCard}>
              {recentActivities.length === 0 ? (
                <Text style={styles.emptyListText}>
                  No recent activities.
                </Text>
              ) : (
                recentActivities.map((activity) => (
                  <View
                    key={activity.id}
                    style={styles.activityRow}
                  >
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberAvatarText}>
                        {activity.initials}
                      </Text>
                    </View>

                    <View style={styles.listInfo}>
                      <Text style={styles.listTitle}>
                        {activity.text}
                      </Text>

                      <Text style={styles.listSubtitle}>
                        {formatDate(activity.date)}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        ) : (
          <>
            {/* No Active Cycle */}
            <View style={styles.noCycleCard}>
              <View style={styles.noCycleIcon}>
                <Feather
                  name="calendar"
                  size={22}
                  color={colors.primary}
                />
              </View>

              <Text style={styles.noCycleTitle}>
                No Active Cycle
              </Text>

              <Text style={styles.noCycleText}>
                There is no active cycle right now. New cycles
                follow the group schedule. You can still view
                contributions and recorded payouts.
              </Text>

              <Pressable
                style={styles.createCycleButton}
                onPress={() => router.push('/payouts')}
              >
                <Text style={styles.createCycleButtonText}>
                  View payouts
                </Text>
              </Pressable>
            </View>

            {/* Quick Actions */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderTitle}>
                Quick Actions
              </Text>
            </View>

            <View style={styles.listCard}>
              <Pressable
                style={styles.listRow}
                onPress={() => router.push('/members')}
              >
                <Text style={styles.quickActionIcon}>♙</Text>

                <Text style={styles.listTitle}>
                  Manage Members
                </Text>

                <Text style={styles.rowArrow}>›</Text>
              </Pressable>

              <Pressable
                style={styles.listRow}
                onPress={() => router.push('/group-selection')}
              >
                <Text style={styles.quickActionIcon}>▦</Text>

                <Text style={styles.listTitle}>View Groups</Text>

                <Text style={styles.rowArrow}>›</Text>
              </Pressable>

              <View style={styles.listRow}>
                <Text style={styles.quickActionIcon}>⚙</Text>

                <Text style={styles.listTitle}>
                  Group Settings
                </Text>

                <Text style={styles.rowArrow}>›</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <OrganizerBottomNavigation />
    </SafeAreaView>
  );
}
