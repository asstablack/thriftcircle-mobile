import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { GroupScreenHeader } from '@/components/group-screen-header';
import { OrganizerBottomNavigation } from '@/components/organizer-chrome';
import {
  getGroupDetails,
  getGroupContributions,
} from '@/services/groupApi';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/color';
import {
  memberDetailStyles as styles,
  progressWidth,
} from '@/styles/memberDetailStyles';

type Member = {
  userId: {
    _id: string;
    fullName: string;
    email?: string;
    phoneNumber?: string;
  };
  payoutOrder?: number;
  status: string;
  joinedAt?: string;
};
type Contribution = {
  _id: string;
  memberId: string;
  amount: number;
  dueDate: string;
  status: string;
};
const labels: Record<string, string> = {
  CONFIRMED: 'Confirmed',
  DUE: 'Due',
  OVERDUE: 'Overdue',
  PENDING_REVIEW: 'Under review',
  ISSUE: 'Payment issue',
};
const date = (value: string) =>
  new Date(value).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export default function MemberDetailScreen() {
  const { memberId, view } = useLocalSearchParams<{
    view?: string;
    memberId?: string;
  }>();
  const groupId = useAuthStore(
    (state) => state.selectedGroup?.id,
  );
  const [member, setMember] = useState<Member | null>(null);
  const [records, setRecords] = useState<Contribution[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (!groupId || !memberId) {
        router.replace('/group-selection');
        return;
      }
      setLoading(true);
      setError(null);
      setMember(null);
      setRecords([]);
      Promise.all([
        getGroupDetails(groupId),
        getGroupContributions(groupId),
      ])
        .then(
          ([details, contributions]: [
            { callerRole: string; members: Member[] },
            Contribution[],
          ]) => {
            if (!active) return;
            if (details.callerRole !== 'organizer')
              throw new Error(
                'Only organizers can view member details.',
              );
            const found = details.members.find(
              (item) => item.userId?._id === memberId,
            );
            if (!found)
              throw new Error(
                'This member is no longer in the active member list.',
              );
            setMember(found);
            setRecords(
              contributions
                .filter(
                  (item) => item.memberId === memberId,
                )
                .sort(
                  (a, b) =>
                    Date.parse(b.dueDate) -
                    Date.parse(a.dueDate),
                ),
            );
          },
        )
        .catch((reason: unknown) => {
          if (active)
            setError(
              reason instanceof Error
                ? reason.message
                : 'Unable to load this member.',
            );
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
      // Retry intentionally repeats the read-only request.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupId, memberId, reload]),
  );
  const confirmed = records.filter(
    (item) => item.status === 'CONFIRMED',
  ).length;
  const progress = records.length
    ? (confirmed / records.length) * 100
    : 0;
  return (
    <SafeAreaView style={styles.container}>
      <GroupScreenHeader
        variant="plain"
        title={
          view === 'status'
            ? 'Member Status'
            : 'Member Details'
        }
        subtitle="Membership and contribution history"
      />
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator
            color={colors.primary}
            accessibilityLabel="Loading member details"
          />
        ) : error ? (
          <View style={styles.card}>
            <Text
              style={styles.body}
              accessibilityRole="alert"
            >
              {error}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                setReload((value) => value + 1)
              }
            >
              <Text style={styles.link}>Try Again</Text>
            </Pressable>
          </View>
        ) : (
          member && (
            <>
              <View style={styles.card}>
                <View style={styles.profileRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.initials}>
                      {member.userId.fullName
                        .trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join('')}
                    </Text>
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.name}>
                      {member.userId.fullName}
                    </Text>
                    <Text style={styles.body}>
                      {member.payoutOrder
                        ? 'Position ' + member.payoutOrder
                        : 'Position not assigned'}
                    </Text>
                    <Text style={styles.activeBadge}>
                      {member.status === 'active'
                        ? 'Active member'
                        : member.status}
                    </Text>
                  </View>
                </View>
                {member.joinedAt && (
                  <Text style={styles.body}>
                    Member since {date(member.joinedAt)}
                  </Text>
                )}
                <View style={styles.contact}>
                  <Feather
                    name="phone"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.contactText}>
                    {member.userId.phoneNumber ||
                      'Phone not provided'}
                  </Text>
                </View>
                <View style={styles.contact}>
                  <Feather
                    name="mail"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.contactText}>
                    {member.userId.email ||
                      'Email not provided'}
                  </Text>
                </View>
              </View>
              {view === 'status' ? (
                <View style={styles.card}>
                  <Text style={styles.name}>
                    Membership Status
                  </Text>
                  <Text style={styles.body}>
                    {member.status}
                  </Text>
                  <Text style={styles.body}>
                    Membership status changes are not
                    available yet.
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      router.replace({
                        pathname: '/member-detail',
                        params: { memberId },
                      })
                    }
                  >
                    <Text style={styles.link}>
                      Back to Member Details
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      router.push({
                        pathname: '/member-detail',
                        params: {
                          memberId,
                          view: 'status',
                        },
                      })
                    }
                  >
                    <Text style={styles.link}>
                      Manage Member
                    </Text>
                  </Pressable>
                  <View style={styles.card}>
                    <Text style={styles.label}>
                      Contribution progress
                    </Text>
                    <View
                      style={styles.progressTrack}
                      accessibilityRole="progressbar"
                      accessibilityValue={{
                        min: 0,
                        max: records.length || 1,
                        now: confirmed,
                      }}
                    >
                      <View
                        style={[
                          styles.progressFill,
                          progressWidth(progress),
                        ]}
                      />
                    </View>
                    <Text style={styles.caption}>
                      {confirmed} of {records.length}{' '}
                      scheduled contributions confirmed
                    </Text>
                  </View>
                  <View style={styles.card}>
                    <Text style={styles.name}>
                      Contribution History
                    </Text>
                    <View style={styles.tableHeader}>
                      <Text style={styles.cell}>
                        Amount / Due date
                      </Text>
                      <Text style={styles.caption}>
                        Status
                      </Text>
                    </View>
                    {!records.length && (
                      <Text style={styles.body}>
                        No contributions scheduled yet.
                      </Text>
                    )}
                    {records.map((item) => (
                      <Pressable
                        key={item._id}
                        style={styles.historyRow}
                        accessibilityRole="button"
                        accessibilityLabel={
                          'View contribution, ' +
                          labels[item.status] +
                          ', ' +
                          date(item.dueDate)
                        }
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
                        <View style={styles.cell}>
                          <Text style={styles.label}>
                            ₦
                            {item.amount.toLocaleString(
                              'en-NG',
                            )}
                          </Text>
                          <Text style={styles.caption}>
                            {date(item.dueDate)}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.badge,
                            item.status === 'CONFIRMED'
                              ? styles.confirmed
                              : item.status === 'ISSUE' ||
                                  item.status === 'OVERDUE'
                                ? styles.issue
                                : styles.pending,
                          ]}
                        >
                          {labels[item.status] ||
                            item.status}
                        </Text>
                        <Feather
                          name="chevron-right"
                          size={20}
                          color={colors.textSecondary}
                        />
                      </Pressable>
                    ))}
                    <Pressable
                      accessibilityRole="button"
                      onPress={() =>
                        router.push({
                          pathname: '/contributions',
                          params: {
                            memberId,
                            tab: 'Overview',
                          },
                        })
                      }
                    >
                      <Text style={styles.link}>
                        View contribution overview
                      </Text>
                    </Pressable>
                  </View>
                </>
              )}
            </>
          )
        )}
      </ScrollView>
      <OrganizerBottomNavigation active="Groups" />
    </SafeAreaView>
  );
}
