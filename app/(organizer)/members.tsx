import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, Stack, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  OrganizerHeader,
  OrganizerBottomNavigation,
} from '@/components/organizer-chrome';
import {
  getGroupDetails,
  getGroupContributions,
  getCurrentCycle,
} from '@/services/groupApi';
import { useAuthStore } from '@/store/authStore';
import { membersStyles as styles } from '@/styles/membersStyles';
import { colors } from '@/constants/color';

type Member = {
  userId: { _id: string; fullName: string };
  payoutOrder?: number;
  status: string;
};
type Details = {
  group: {
    groupName: string;
    contributionAmount: number;
    frequency: string;
    status: string;
  };
  members: Member[];
};
type Contribution = {
  memberId: string;
  cycleNumber: number;
  status: string;
};
const labels: Record<string, string> = {
  CONFIRMED: 'Confirmed',
  DUE: 'Due',
  OVERDUE: 'Overdue',
  PENDING_REVIEW: 'Under review',
  ISSUE: 'Correction requested',
};

export default function MembersScreen() {
  const group = useAuthStore((state) => state.selectedGroup);
  const [details, setDetails] = useState<Details | null>(null);
  const [records, setRecords] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [reload, setReload] = useState(0);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (!group || group.role !== 'organizer') {
        router.replace('/group-selection');
        return;
      }
      setLoading(true);
      setError(null);
      Promise.all([
        getGroupDetails(group.id),
        getGroupContributions(group.id),
        getCurrentCycle(group.id),
      ])
        .then(
          ([result, contributions, cycle]: [
            Details,
            Contribution[],
            { cycleNumber: number } | null,
          ]) => {
            if (!active) return;
            setDetails(result);
            setRecords(
              cycle
                ? contributions.filter(
                    (item) =>
                      item.cycleNumber === cycle.cycleNumber,
                  )
                : [],
            );
          },
        )
        .catch((reason: unknown) => {
          if (active)
            setError(
              reason instanceof Error
                ? reason.message
                : 'Unable to load members.',
            );
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
      // Retry reloads the same selected group.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group?.id, group?.role, reload]),
  );
  const members = (details?.members || []).filter((member) =>
    member.userId?.fullName
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <OrganizerHeader />
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Members</Text>
        <Text style={styles.pageSubtitle}>
          Manage members and view their contribution status.
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.push('/join-requests')}>
          <Text style={styles.paidText}>Review pending join requests</Text>
        </Pressable>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : error ? (
          <View style={styles.groupCard}>
            <Text style={styles.groupDetails}>{error}</Text>
            <Pressable
              onPress={() => setReload((value) => value + 1)}
            >
              <Text style={styles.paidText}>Try Again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.groupCard}>
              <View>
                <Text style={styles.groupName}>
                  {details?.group.groupName}
                </Text>
                <Text style={styles.groupDetails}>
                  {details?.members.length} members ·{' '}
                  {details?.group.frequency} · ₦
                  {details?.group.contributionAmount.toLocaleString(
                    'en-NG',
                  )}
                </Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              {[
                {
                  label: 'Members',
                  value: details?.members.length || 0,
                },
                {
                  label: 'Confirmed',
                  value: records.filter(
                    (item) => item.status === 'CONFIRMED',
                  ).length,
                },
                {
                  label: 'Review',
                  value: records.filter(
                    (item) => item.status === 'PENDING_REVIEW',
                  ).length,
                },
                {
                  label: 'Overdue',
                  value: records.filter(
                    (item) => item.status === 'OVERDUE',
                  ).length,
                },
              ].map((item) => (
                <View
                  key={item.label}
                  style={styles.statCard}
                >
                  <Text style={styles.statValue}>
                    {item.value}
                  </Text>
                  <Text style={styles.statLabel}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.searchBox}>
              <Feather
                name="search"
                size={18}
                color={colors.textSecondary}
              />
              <TextInput
                style={styles.searchText}
                accessibilityLabel="Search members"
                placeholder="Search members"
                value={query}
                onChangeText={setQuery}
              />
            </View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                All Members
              </Text>
              <Pressable
                onPress={() => router.push('/invite-members')}
              >
                <Text style={styles.paidText}>
                  Invite members
                </Text>
              </Pressable>
            </View>
            {!members.length && (
              <Text style={styles.groupDetails}>
                No matching members.
              </Text>
            )}
            {members.map((member) => {
              const record = records.find(
                (item) => item.memberId === member.userId._id,
              );
              return (
                <Pressable
                  key={member.userId._id}
                  style={styles.memberCard}
                  onPress={() =>
                    router.push({
                      pathname: '/member-detail',
                      params: { memberId: member.userId._id },
                    })
                  }
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {member.userId.fullName
                        .trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join('')}
                    </Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.userId.fullName}
                    </Text>
                    <Text style={styles.memberAmount}>
                      {member.payoutOrder
                        ? 'Position ' + member.payoutOrder
                        : 'Position not assigned'}{' '}
                      · {member.status}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      record?.status === 'CONFIRMED'
                        ? styles.paidBadge
                        : styles.pendingBadge,
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {record
                        ? labels[record.status]
                        : 'No obligation'}
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={18}
                    color={colors.textSecondary}
                  />
                </Pressable>
              );
            })}
          </>
        )}
      </ScrollView>
      <OrganizerBottomNavigation active="Groups" />
    </SafeAreaView>
  );
}
