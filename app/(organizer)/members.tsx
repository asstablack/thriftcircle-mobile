import { GroupScreenHeader } from '@/components/group-screen-header';
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
import { OrganizerBottomNavigation } from '@/components/organizer-chrome';
import {
  getGroupDetails,
  getGroupContributions,
  getCurrentCycle,
} from '@/services/groupApi';
import { useAuthStore } from '@/store/authStore';
import { membersStyles as styles } from '@/styles/membersStyles';
import { colors } from '@/constants/color';

type Member = {
  userId: {
    _id: string;
    fullName: string;
    phoneNumber?: string;
  };
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

export default function MembersScreen() {
  const group = useAuthStore(
    (state) => state.selectedGroup,
  );
  const [details, setDetails] = useState<Details | null>(
    null,
  );
  const [records, setRecords] = useState<Contribution[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All');
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
                      item.cycleNumber ===
                      cycle.cycleNumber,
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
  const members = (details?.members || []).filter(
    (member) =>
      Boolean(member.userId) &&
      (
        (member.userId?.fullName || '') +
        ' ' +
        (member.userId?.phoneNumber || '')
      )
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const filteredMembers = members.filter(
    (member) =>
      paymentFilter === 'All' ||
      records.some(
        (record) =>
          record.memberId === member.userId._id &&
          record.status ===
            (
              {
                Confirmed: 'CONFIRMED',
                'Pending review': 'PENDING_REVIEW',
                Overdue: 'OVERDUE',
              } as Record<string, string>
            )[paymentFilter],
      ),
  );
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <GroupScreenHeader
        variant="plain"
        title="Member List"
        subtitle="Manage members and view their contribution status."
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          style={styles.requestLink}
          onPress={() => router.push('/join-requests')}
        >
          <Text style={styles.paidText}>
            Review pending join requests
          </Text>
        </Pressable>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : error ? (
          <View style={styles.groupCard}>
            <Text style={styles.groupDetails}>{error}</Text>
            <Pressable
              onPress={() =>
                setReload((value) => value + 1)
              }
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
                    (item) =>
                      item.status === 'PENDING_REVIEW',
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
            <Pressable
              accessibilityRole="button"
              style={styles.inviteButton}
              onPress={() => router.push('/invite-members')}
            >
              <Text style={styles.inviteButtonText}>
                Add new member
              </Text>
            </Pressable>
            <View style={styles.searchBox}>
              <Feather
                name="search"
                size={18}
                color={colors.textSecondary}
              />
              <TextInput
                style={styles.searchText}
                accessibilityLabel="Search members"
                placeholder="Search name or phone number"
                value={query}
                onChangeText={setQuery}
              />
            </View>
            <View style={styles.filters}>
              {[
                'All',
                'Confirmed',
                'Pending review',
                'Overdue',
              ].map((label) => (
                <Pressable
                  key={label}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: paymentFilter === label,
                  }}
                  style={[
                    styles.filter,
                    paymentFilter === label &&
                      styles.filterActive,
                  ]}
                  onPress={() => setPaymentFilter(label)}
                >
                  <Text style={styles.memberAmount}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                All Members
              </Text>
              <Pressable
                onPress={() =>
                  router.push('/invite-members')
                }
              >
                <Text style={styles.paidText}>
                  Invite members
                </Text>
              </Pressable>
            </View>
            {!filteredMembers.length && (
              <Text style={styles.groupDetails}>
                No matching members.
              </Text>
            )}
            {filteredMembers.map((member) => {
              return (
                <Pressable
                  key={member.userId._id}
                  style={styles.memberCard}
                  onPress={() =>
                    router.push({
                      pathname: '/member-detail',
                      params: {
                        memberId: member.userId._id,
                      },
                    })
                  }
                >
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.userId.fullName}
                    </Text>
                    <Text style={styles.memberAmount}>
                      {member.userId.phoneNumber ||
                        'Phone not provided'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      member.status === 'active'
                        ? styles.paidBadge
                        : styles.pendingBadge,
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {member.status === 'active'
                        ? 'Active'
                        : member.status}
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
