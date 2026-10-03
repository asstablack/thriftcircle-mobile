import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { contributionsStyles as styles } from '@/styles/contributionsStyles';
import {
  getCurrentCycle,
  getGroupContributions,
  getGroupDetails,
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
};

type FilterTab = 'All' | 'Confirmed' | 'Pending' | 'Overdue';

export default function ContributionsScreen() {
  const selectedGroup = useAuthStore(
    (state) => state.selectedGroup,
  );

  const [groupDetails, setGroupDetails] =
    useState<GroupDetails | null>(null);

  const [currentCycle, setCurrentCycle] =
    useState<Cycle | null>(null);

  const [contributions, setContributions] = useState<Contribution[]>(
    [],
  );

  const [activeTab, setActiveTab] =
    useState<FilterTab>('All');

  const [loading, setLoading] = useState(true);

  const loadContributions = async () => {
    if (!selectedGroup?.id) {
      Alert.alert(
        'No group selected',
        'Please select a group first.',
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
          getCurrentCycle(selectedGroup.id),
        ]);

      setGroupDetails(details);
      setContributions(contributionData);
      setCurrentCycle(cycle);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load contributions.';

      Alert.alert(
        'Unable to load contributions',
        message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContributions();
  }, [selectedGroup?.id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.loadingText}>
            Loading contributions...
          </Text>
        </View>
      </View>
    );
  }

  if (!groupDetails || !currentCycle) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            Contribution data is unavailable.
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={loadContributions}
          >
            <Text style={styles.retryButtonText}>
              Try Again
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const cycleContributions = contributions.filter(
    (contribution) =>
      contribution.cycleNumber === currentCycle.cycleNumber,
  );

  const confirmedContributions =
    cycleContributions.filter(
      (contribution) =>
        contribution.status === 'CONFIRMED',
    );

  const pendingContributions =
    cycleContributions.filter(
      (contribution) =>
        contribution.status === 'PENDING_REVIEW',
    );

  const overdueContributions =
    cycleContributions.filter(
      (contribution) =>
        contribution.status === 'OVERDUE',
    );

  const totalAmount = cycleContributions.reduce(
    (total, contribution) =>
      total + contribution.amount,
    0,
  );

  const confirmedAmount =
    confirmedContributions.reduce(
      (total, contribution) =>
        total + contribution.amount,
      0,
    );

  const progress =
    totalAmount > 0
      ? Math.min(
          (confirmedAmount / totalAmount) * 100,
          100,
        )
      : 0;

  const filteredContributions =
    activeTab === 'All'
      ? cycleContributions
      : activeTab === 'Confirmed'
        ? confirmedContributions
        : activeTab === 'Pending'
          ? pendingContributions
          : overdueContributions;

  const getMemberName = (memberId: string) => {
    const member = groupDetails.members.find(
      (item) => item.userId._id === memberId,
    );

    return member?.userId.fullName || 'Unknown Member';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return '—';
    }

    return date.toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusLabel = (
    status: ContributionStatus,
  ) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmed';

      case 'PENDING_REVIEW':
        return 'Pending';

      case 'OVERDUE':
        return 'Overdue';

      case 'DUE':
        return 'Due';

      case 'ISSUE':
        return 'Issue';

      default:
        return status;
    }
  };

  const getStatusStyle = (
    status: ContributionStatus,
  ) => {
    switch (status) {
      case 'CONFIRMED':
        return {
          badge: styles.confirmedBadge,
          text: styles.confirmedText,
        };

      case 'PENDING_REVIEW':
        return {
          badge: styles.pendingBadge,
          text: styles.pendingText,
        };

      case 'OVERDUE':
        return {
          badge: styles.overdueBadge,
          text: styles.overdueText,
        };

      default:
        return {
          badge: styles.pendingBadge,
          text: styles.pendingText,
        };
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>T</Text>
          </View>

          <Text style={styles.logoName}>
            ThriftCircle
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Text style={styles.headerIcon}>♧</Text>

          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>
              OR
            </Text>
          </View>

          <Text style={styles.chevron}>⌄</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable
          onPress={() =>
            router.replace('/organizer-dashboard')
          }
        >
          <Text style={styles.backButton}>
            ← Back to dashboard
          </Text>
        </Pressable>

        {/* Page Header */}
        <View style={styles.greenHeader}>
          <Text style={styles.pageTitle}>
            Contributions
          </Text>

          <Text style={styles.pageSubtitle}>
            Track contributions, verify payments, and manage
            your group's progress.
          </Text>
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          <View style={styles.filterButton}>
            <Text style={styles.filterIcon}>
              ♧
            </Text>

            <Text style={styles.filterText}>
              {groupDetails.group.groupName}
            </Text>
          </View>

          <View style={styles.filterButton}>
            <Text style={styles.filterIcon}>
              ▣
            </Text>

            <Text style={styles.filterText}>
              Cycle {currentCycle.cycleNumber}
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            Total Contributions
          </Text>

          <Text style={styles.summarySubtext}>
            {confirmedContributions.length} of{' '}
            {cycleContributions.length} contributions confirmed
          </Text>

          <View style={styles.summaryMain}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressValue}>
                {Math.round(progress)}%
              </Text>
            </View>

            <View style={styles.amountSection}>
              <Text style={styles.amount}>
                ₦{confirmedAmount.toLocaleString()}
              </Text>

              <Text style={styles.expected}>
                of ₦{totalAmount.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.statusList}>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  styles.confirmedDot,
                ]}
              />

              <Text style={styles.statusLabel}>
                Confirmed
              </Text>

              <Text style={styles.statusValue}>
                {confirmedContributions.length}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  styles.pendingDot,
                ]}
              />

              <Text style={styles.statusLabel}>
                Pending verification
              </Text>

              <Text style={styles.statusValue}>
                {pendingContributions.length}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  styles.overdueDot,
                ]}
              />

              <Text style={styles.statusLabel}>
                Overdue
              </Text>

              <Text style={styles.statusValue}>
                {overdueContributions.length}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  styles.memberDot,
                ]}
              />

              <Text style={styles.statusLabel}>
                Total Members
              </Text>

              <Text style={styles.statusValue}>
                {groupDetails.members.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.smallStatCard}>
            <Text style={styles.smallStatNumber}>
              {confirmedContributions.length}
            </Text>

            <Text style={styles.smallStatLabel}>
              Confirmed
            </Text>
          </View>

          <View style={styles.smallStatCard}>
            <Text style={styles.smallStatNumber}>
              {pendingContributions.length}
            </Text>

            <Text style={styles.smallStatLabel}>
              Under Review
            </Text>
          </View>

          <View style={styles.smallStatCard}>
            <Text style={styles.smallStatNumber}>
              {overdueContributions.length}
            </Text>

            <Text style={styles.smallStatLabel}>
              Overdue
            </Text>
          </View>

          <View style={styles.smallStatCard}>
            <Text style={styles.smallStatNumber}>
              {groupDetails.members.length}
            </Text>

            <Text style={styles.smallStatLabel}>
              Members
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(
            ['All', 'Confirmed', 'Pending', 'Overdue'] as FilterTab[]
          ).map((tab) => (
            <Pressable
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab &&
                    styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>
            Member
          </Text>

          <Text style={styles.tableHeaderText}>
            Amount
          </Text>

          <Text style={styles.tableHeaderText}>
            Due Date
          </Text>

          <Text style={styles.tableHeaderText}>
            Status
          </Text>
        </View>

        {/* Contribution Rows */}
        {filteredContributions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No contributions
            </Text>

            <Text style={styles.emptyText}>
              There are no contributions matching this filter
              for the current cycle.
            </Text>
          </View>
        ) : (
          filteredContributions.map((contribution) => {
            const memberName = getMemberName(
              contribution.memberId,
            );

            const statusStyle = getStatusStyle(
              contribution.status,
            );

            return (
              <Pressable
                key={contribution._id}
                style={styles.contributionRow}
              >
                <Text style={styles.memberText}>
                  {memberName}
                </Text>

                <Text style={styles.rowText}>
                  ₦{contribution.amount.toLocaleString()}
                </Text>

                <Text style={styles.rowText}>
                  {formatDate(contribution.dueDate)}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    statusStyle.badge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      statusStyle.text,
                    ]}
                  >
                    {getStatusLabel(
                      contribution.status,
                    )}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.replace('/organizer-dashboard')
          }
        >
          <Text style={styles.navIcon}>⌂</Text>

          <Text style={styles.navText}>
            Home
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.replace('/group-selection')
          }
        >
          <Text style={styles.navIcon}>▦</Text>

          <Text style={styles.navText}>
            Groups
          </Text>
        </Pressable>

        <View
          style={[
            styles.navItem,
            styles.navItemActive,
          ]}
        >
          <Text style={styles.navIcon}>
            ▣
          </Text>

          <Text style={styles.navTextActive}>
            Contributions
          </Text>
        </View>

        <View style={styles.navItem}>
          <Text style={styles.navIcon}>◷</Text>

          <Text style={styles.navText}>
            Activity
          </Text>
        </View>

        <View style={styles.navItem}>
          <Text style={styles.navIcon}>○</Text>

          <Text style={styles.navText}>
            Profile
          </Text>
        </View>
      </View>
    </View>
  );
}