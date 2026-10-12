import { useCallback, useState } from 'react';
import { Redirect, router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { WorkflowScreen } from '@/components/workflow-screen';
import {
  getCurrentCycle,
  getGroupContributions,
  getGroupDetails,
} from '@/services/groupApi';
import {
  getOutstanding,
  type Obligation,
  type WorkflowGroup,
} from '@/services/groupWorkflowApi';
import { useWorkflowResource } from '@/hooks/use-workflow-resource';
import { useAuthStore } from '@/store/authStore';
import { accountStyles as styles } from '@/styles/accountStyles';

const labels: Record<string, string> = {
  DUE: 'Due',
  OVERDUE: 'Overdue',
  PENDING_REVIEW: 'Under review',
  CONFIRMED: 'Confirmed',
  ISSUE: 'Payment issue',
};
export default function GroupScheduleScreen() {
  const group = useAuthStore(
    (state) => state.selectedGroup,
  );
  const [outstandingOnly, setOutstandingOnly] =
    useState(false);
  const [cycleFilter, setCycleFilter] = useState<
    number | null
  >(null);
  const loader = useCallback(async () => {
    if (!group) throw new Error('Choose a group first.');
    const [details, records, outstanding, cycle]: [
      WorkflowGroup,
      Obligation[],
      Obligation[],
      { cycleNumber: number; status: string } | null,
    ] = await Promise.all([
      getGroupDetails(group.id),
      getGroupContributions(group.id),
      getOutstanding(group.id),
      getCurrentCycle(group.id),
    ]);
    return { details, records, outstanding, cycle };
  }, [group]);
  const state = useWorkflowResource(loader);
  if (!group) return <Redirect href="/group-selection" />;
  const data = state.data;
  const cycles = [
    ...new Set(
      (data?.records || []).map((item) => item.cycleNumber),
    ),
  ].sort((a, b) => b - a);
  const records =
    (outstandingOnly ? data?.outstanding : data?.records)
      ?.filter(
        (item) =>
          cycleFilter === null ||
          item.cycleNumber === cycleFilter,
      )
      .sort(
        (a, b) =>
          Date.parse(a.dueDate) - Date.parse(b.dueDate),
      ) || [];
  return (
    <WorkflowScreen
      title="Contribution obligations"
      subtitle={group.groupName}
      state={state}
    >
      {data && (
        <>
          <View style={styles.card}>
            <Text style={styles.title}>
              {data.cycle
                ? `Current cycle ${data.cycle.cycleNumber}`
                : 'No active cycle'}
            </Text>
            <Text style={styles.body}>
              {data.cycle?.status.replaceAll('_', ' ') ||
                'Existing contribution records remain available.'}
            </Text>
            <Text style={styles.body}>
              These are obligations already scheduled by
              your group. Future dates appear once the
              server creates them.
            </Text>
          </View>
          <View style={styles.checkbox}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{
                selected: !outstandingOnly,
              }}
              onPress={() => setOutstandingOnly(false)}
            >
              <Text style={styles.link}>
                All obligations
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{
                selected: outstandingOnly,
              }}
              onPress={() => setOutstandingOnly(true)}
            >
              <Text style={styles.link}>Due & overdue</Text>
            </Pressable>
          </View>
          <Text style={styles.label}>
            {outstandingOnly
              ? 'Due and overdue contributions'
              : 'All scheduled contributions'}
          </Text>
          <View style={styles.card}>
            <Text style={styles.label}>
              Filter by cycle
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{
                selected: cycleFilter === null,
              }}
              onPress={() => setCycleFilter(null)}
            >
              <Text style={styles.link}>
                All cycles{cycleFilter === null ? ' ✓' : ''}
              </Text>
            </Pressable>
            {cycles.map((number) => (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  selected: cycleFilter === number,
                }}
                key={number}
                onPress={() => setCycleFilter(number)}
              >
                <Text style={styles.link}>
                  Cycle {number}
                  {cycleFilter === number ? ' ✓' : ''}
                </Text>
              </Pressable>
            ))}
          </View>
          {!records.length && (
            <Text style={styles.body}>
              No contributions match this view.
            </Text>
          )}
          {records.map((item) => {
            const id =
              typeof item.memberId === 'string'
                ? item.memberId
                : item.memberId?._id;
            const name =
              typeof item.memberId === 'object'
                ? item.memberId?.fullName
                : data.details.members.find(
                    (member) => member.userId?._id === id,
                  )?.userId?.fullName;
            return (
              <Pressable
                key={item._id}
                accessibilityRole="button"
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: '/contribution-review',
                    params: { contributionId: item._id },
                  })
                }
              >
                {data.details.callerRole ===
                  'organizer' && (
                  <Text style={styles.label}>
                    {name || 'Member unavailable'}
                  </Text>
                )}
                <Text style={styles.title}>
                  ₦{item.amount.toLocaleString('en-NG')}
                </Text>
                <Text style={styles.body}>
                  Cycle {item.cycleNumber} · Due{' '}
                  {new Date(
                    item.dueDate,
                  ).toLocaleDateString('en-NG')}
                </Text>
                <Text style={styles.label}>
                  {labels[item.status] || item.status}
                </Text>
                <Text style={styles.link}>
                  View contribution
                </Text>
              </Pressable>
            );
          })}
        </>
      )}
    </WorkflowScreen>
  );
}
