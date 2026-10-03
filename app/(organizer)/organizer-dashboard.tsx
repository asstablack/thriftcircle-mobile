import {
  getCurrentCycle,
  getGroupContributions,
  getGroupDetails,
} from '@/services/groupApi';
import { useAuthStore } from '@/store/authStore';
import { organizerDashboardStyles as styles } from '@/styles/organizerDashboardStyles';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


type Contribution = {
  _id: string;
  memberId: string;
  amount: number;
  dueDate: string;
  cycleNumber: number;
  status:
    | 'DUE'
    | 'PENDING_REVIEW'
    | 'CONFIRMED'
    | 'ISSUE'
    | 'OVERDUE';
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
  status: 'ACTIVE' | 'COMPLETED';
  openedAt: string;
  closedAt: string | null;
};

export default function OrganizerDashboard() {
  const user = useAuthStore((state) => state.user);
  const selectedGroup = useAuthStore((state) => state.selectedGroup);

  const [groupDetails, setGroupDetails] =
    useState<GroupDetails | null>(null);

  const [contributions, setContributions] =
    useState<Contribution[]>([]);

  const [currentCycle, setCurrentCycle] =
    useState<Cycle | null>(null);

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
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

      const [details, contributionData, cycle] =
        await Promise.all([
          getGroupDetails(selectedGroup.id),
          getGroupContributions(selectedGroup.id),
          getCurrentCycle(selectedGroup.id).catch(() => null),
        ]);

      setGroupDetails(details);
      setContributions(contributionData);
      setCurrentCycle(cycle);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load dashboard data.';

      Alert.alert('Unable to load dashboard', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [selectedGroup?.id]);

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
        <View style={styles.topHeader}>
          <Image
  source={require('@/assets/images/thrift-circle-logo.png')}
  style={styles.headerLogo}
  resizeMode="contain"
/>

          <View style={styles.headerActions}>
            <View style={styles.skeletonCircle} />
            <View style={styles.skeletonProfile} />
          </View>
        </View>

        <View style={styles.welcomeBanner}>
          <View style={styles.skeletonWelcomeLine} />
          <View style={styles.skeletonWelcomeSmall} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.skeletonCycle} />
          <View style={styles.skeletonCard} />
          <View style={styles.skeletonCardSmall} />
          <View style={styles.skeletonCardSmall} />
        </ScrollView>

        <BottomNavigation />
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
            <Text style={styles.viewButtonText}>
              Try Again
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const currentCycleContributions = currentCycle
    ? contributions.filter(
        (item) =>
          item.cycleNumber === currentCycle.cycleNumber,
      )
    : [];

  const confirmedContributions =
    currentCycleContributions.filter(
      (item) => item.status === 'CONFIRMED',
    );

  const pendingContributions =
    currentCycleContributions.filter(
      (item) => item.status === 'PENDING_REVIEW',
    );

  const overdueContributions =
    currentCycleContributions.filter(
      (item) => item.status === 'OVERDUE',
    );

  const totalAmount =
    currentCycleContributions.reduce(
      (total, item) => total + item.amount,
      0,
    );

  const confirmedAmount =
    confirmedContributions.reduce(
      (total, item) => total + item.amount,
      0,
    );

  const progress =
    totalAmount > 0
      ? Math.min(
          (confirmedAmount / totalAmount) * 100,
          100,
        )
      : 0;

  const attentionItems = [
    ...pendingContributions.map((item) => ({
      id: `pending-${item._id}`,
      title: 'Payment awaiting review',
      subtitle: `₦${item.amount.toLocaleString()}`,
      type: 'pending',
    })),
    ...overdueContributions.map((item) => ({
      id: `overdue-${item._id}`,
      title: 'Overdue contribution',
      subtitle: `₦${item.amount.toLocaleString()}`,
      type: 'overdue',
    })),
  ].slice(0, 3);

  const upcomingDeadlines = [...currentCycleContributions]
    .filter(
      (item) =>
        item.status === 'DUE' ||
        item.status === 'OVERDUE',
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
        initials: getInitials(
          getMemberName(item.memberId),
        ),
        text: `${getMemberName(item.memberId)} submitted payment evidence`,
        date: item.submittedAt as string,
      })),
    ...contributions
      .filter((item) => item.confirmedAt)
      .map((item) => ({
        id: `confirmed-${item._id}`,
        initials: getInitials(
          getMemberName(item.memberId),
        ),
        text: `${getMemberName(item.memberId)}'s payment was confirmed`,
        date: item.confirmedAt as string,
      })),
  ]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime(),
    )
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
       <Image
  source={require('@/assets/images/thrift-circle-logo.png')}
  style={styles.headerLogo}
  resizeMode="contain"
/>

        <View style={styles.headerActions}>
          <Pressable style={styles.notificationButton}>
            <Text style={styles.headerIcon}>♧</Text>
          </Pressable>

          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>
              {getInitials(user?.fullName || 'Organizer')}
            </Text>
          </View>

          <Text style={styles.chevron}>⌄</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.greeting}>
            Good morning, {user?.fullName?.split(' ')[0] || 'Organizer'}
          </Text>

          <Text style={styles.welcomeText}>
            Here is what’s happening with your savings group.
          </Text>
        </View>

        {/* Active Cycle */}
        {currentCycle ? (
          <>
            <View style={styles.cycleHeader}>
              <View>
                <Text style={styles.cycleDate}>
                  Cycle {currentCycle.cycleNumber}
                </Text>

                <Text style={styles.cycleTitle}>
                  {formatDate(currentCycle.openedAt)} Cycle
                </Text>
              </View>

              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>
                  • Active Cycle
                </Text>
              </View>
            </View>

            {/* Contribution Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>
                Contribution Summary
              </Text>

              <Text style={styles.summaryAmount}>
                ₦{confirmedAmount.toLocaleString()}
                <Text style={styles.summaryTarget}>
                  {' '}/ ₦{totalAmount.toLocaleString()}
                </Text>
              </Text>

              <Text style={styles.confirmedLabel}>
                Confirmed contributions
              </Text>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress}%` },
                  ]}
                />
              </View>

              <Text style={styles.progressText}>
                {Math.round(progress)}%
              </Text>

              <View style={styles.summaryStats}>
                <View style={styles.summaryStat}>
                  <Text style={styles.summaryStatValue}>
                    {confirmedContributions.length}
                  </Text>
                  <Text style={styles.summaryStatLabel}>
                    Confirmed
                  </Text>
                </View>

                <View style={styles.summaryStat}>
                  <Text style={styles.summaryStatValue}>
                    {pendingContributions.length}
                  </Text>
                  <Text style={styles.summaryStatLabel}>
                    Pending Verification
                  </Text>
                </View>

                <View style={styles.summaryStat}>
                  <Text style={styles.summaryStatValue}>
                    {overdueContributions.length}
                  </Text>
                  <Text style={styles.summaryStatLabel}>
                    Overdue
                  </Text>
                </View>

                <View style={styles.summaryStat}>
                  <Text style={styles.summaryStatValue}>
                    {groupDetails.members.length}
                  </Text>
                  <Text style={styles.summaryStatLabel}>
                    Total Members
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.viewButton}
                onPress={() =>
                  router.push('/contributions')
                }
              >
                <Text style={styles.viewButtonText}>
                  View Contributions
                </Text>
              </Pressable>
            </View>

            {/* Needs Your Attention */}
            <View style={styles.sectionHeader}>
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
                      router.push('/contributions')
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
                        {item.type === 'overdue'
                          ? '!'
                          : '✓'}
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
                onPress={() =>
                  router.push('/contributions')
                }
              >
                <Text style={styles.viewAll}>
                  View all ›
                </Text>
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
                      router.push('/contributions')
                    }
                  >
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayText}>
                        Today
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

              <Text style={styles.viewAll}>
                View all ›
              </Text>
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
                <Text style={styles.noCycleIconText}>
                  ◫
                </Text>
              </View>

              <Text style={styles.noCycleTitle}>
                No Active Cycle
              </Text>

              <Text style={styles.noCycleText}>
                You don't have an active cycle right now.
                You can create one to start collecting
                contributions.
              </Text>

              <Pressable
                style={styles.createCycleButton}
                onPress={() =>
                  Alert.alert(
                    'Create New Cycle',
                    'Cycle creation will be connected when the cycle creation API is available.',
                  )
                }
              >
                <Text style={styles.createCycleButtonText}>
                  Create new cycle
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
                onPress={() =>
                  router.push('/members')
                }
              >
                <Text style={styles.quickActionIcon}>
                  ♙
                </Text>

                <Text style={styles.listTitle}>
                  Manage Members
                </Text>

                <Text style={styles.rowArrow}>›</Text>
              </Pressable>

              <Pressable
                style={styles.listRow}
                onPress={() =>
                  router.push('/group-selection')
                }
              >
                <Text style={styles.quickActionIcon}>
                  ▦
                </Text>

                <Text style={styles.listTitle}>
                  View Groups
                </Text>

                <Text style={styles.rowArrow}>›</Text>
              </Pressable>

              <View style={styles.listRow}>
                <Text style={styles.quickActionIcon}>
                  ⚙
                </Text>

                <Text style={styles.listTitle}>
                  Group Settings
                </Text>

                <Text style={styles.rowArrow}>›</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}

function BottomNavigation() {
  return (
    <View style={styles.bottomNav}>
      <View
        style={[
          styles.navItem,
          styles.navItemActive,
        ]}
      >
        <Text style={styles.navIcon}>⌂</Text>
        <Text
          style={[
            styles.navText,
            styles.navTextActive,
          ]}
        >
          Home
        </Text>
      </View>

      <Pressable
        style={styles.navItem}
        onPress={() =>
          router.push('/group-selection')
        }
      >
        <Text style={styles.navIcon}>♙</Text>
        <Text style={styles.navText}>Groups</Text>
      </Pressable>

      <Pressable
        style={styles.navItem}
        onPress={() =>
          router.push('/contributions')
        }
      >
        <Text style={styles.navIcon}>▣</Text>
        <Text style={styles.navText}>
          Contributions
        </Text>
      </Pressable>

      <View style={styles.navItem}>
        <Text style={styles.navIcon}>◷</Text>
        <Text style={styles.navText}>Activity</Text>
      </View>

      <View style={styles.navItem}>
        <Text style={styles.navIcon}>○</Text>
        <Text style={styles.navText}>Profile</Text>
      </View>
    </View>
  );
}