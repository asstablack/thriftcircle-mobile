import { useCallback, useState } from 'react';
import { Redirect, router } from 'expo-router';
import {
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { WorkflowScreen } from '@/components/workflow-screen';
import { getGroupDetails } from '@/services/groupApi';
import {
  getGroupRules,
  saveGroupRules,
  type GroupRules,
  type WorkflowGroup,
} from '@/services/groupWorkflowApi';
import { useWorkflowResource } from '@/hooks/use-workflow-resource';
import { useAuthStore } from '@/store/authStore';
import { accountStyles as styles } from '@/styles/accountStyles';
import { colors } from '@/constants/color';

function RulesEditor({
  rules,
  memberCount,
  disabled,
  onSave,
}: {
  rules: GroupRules;
  memberCount: number;
  disabled: boolean;
  onSave: (rules: GroupRules) => void;
}) {
  const [grace, setGrace] = useState(
    String(rules.gracePeriodDays),
  );
  const [late, setLate] = useState(
    rules.allowLateSubmission,
  );
  const [limit, setLimit] = useState(
    rules.maxMembers === null
      ? ''
      : String(rules.maxMembers),
  );
  const [error, setError] = useState('');
  const submit = () => {
    if (!/^\d+$/.test(grace.trim()) || Number(grace) > 30) {
      setError(
        'Grace period must be a whole number from 0 to 30.',
      );
      return;
    }
    if (
      limit.trim() &&
      (!/^\d+$/.test(limit.trim()) ||
        Number(limit) < Math.max(2, memberCount))
    ) {
      setError(
        `Member limit must be at least ${Math.max(2, memberCount)}, or blank for no limit.`,
      );
      return;
    }
    setError('');
    onSave({
      gracePeriodDays: Number(grace),
      allowLateSubmission: late,
      maxMembers: limit.trim() ? Number(limit) : null,
    });
  };
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Edit group rules</Text>
      <Text style={styles.label}>Grace period in days</Text>
      <TextInput
        accessibilityLabel="Grace period in days"
        keyboardType="number-pad"
        value={grace}
        onChangeText={setGrace}
        editable={!disabled}
        style={styles.input}
      />
      <Text style={styles.body}>
        Choose 0–30 days after the contribution deadline.
      </Text>
      <View style={styles.checkbox}>
        <Text style={styles.checkboxText}>
          Allow late evidence submission
        </Text>
        <Switch
          accessibilityLabel="Allow late evidence submission"
          value={late}
          onValueChange={setLate}
          disabled={disabled}
          trackColor={{ true: colors.primary }}
        />
      </View>
      <Text style={styles.label}>
        Maximum active members
      </Text>
      <TextInput
        accessibilityLabel="Maximum active members"
        keyboardType="number-pad"
        placeholder="No limit"
        value={limit}
        onChangeText={setLimit}
        editable={!disabled}
        style={styles.input}
      />
      <Text style={styles.body}>
        Leave blank for no limit. There are {memberCount}{' '}
        active members.
      </Text>
      {!!error && (
        <Text
          accessibilityRole="alert"
          style={styles.error}
        >
          {error}
        </Text>
      )}
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        style={[styles.button, disabled && styles.disabled]}
        onPress={submit}
      >
        <Text style={styles.buttonText}>Save rules</Text>
      </Pressable>
    </View>
  );
}
export default function GroupDetailsScreen() {
  const group = useAuthStore(
    (state) => state.selectedGroup,
  );
  const loader = useCallback(async () => {
    if (!group) throw new Error('Choose a group first.');
    const [details, rules]: [WorkflowGroup, GroupRules] =
      await Promise.all([
        getGroupDetails(group.id),
        getGroupRules(group.id),
      ]);
    return { details, rules };
  }, [group]);
  const state = useWorkflowResource(loader);
  if (!group) return <Redirect href="/group-selection" />;
  const data = state.data;
  return (
    <WorkflowScreen
      title="Group details & rules"
      subtitle={group.groupName}
      state={state}
    >
      {data && (
        <>
          <View style={styles.card}>
            <Text style={styles.title}>
              {data.details.group.groupName}
            </Text>
            <Text style={styles.body}>
              Contribution: ₦
              {data.details.group.contributionAmount.toLocaleString(
                'en-NG',
              )}{' '}
              · {data.details.group.frequency}
            </Text>
            <Text style={styles.body}>
              Start:{' '}
              {new Date(
                data.details.group.startDate,
              ).toLocaleDateString('en-NG')}
            </Text>
            <Text style={styles.body}>
              Deadline:{' '}
              {new Date(
                data.details.group.contributionDeadline,
              ).toLocaleDateString('en-NG')}
            </Text>
            <Text style={styles.body}>
              {data.details.members.length} active members
            </Text>
            <Pressable
              accessibilityRole="button"
              disabled={state.busy}
              onPress={() => router.push('/group-schedule')}
            >
              <Text style={styles.link}>
                View obligations and outstanding
                contributions
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={state.busy}
              onPress={() => router.push('/payouts')}
            >
              <Text style={styles.link}>
                View payout positions
              </Text>
            </Pressable>
            {data.details.callerRole === 'organizer' && (
              <Pressable
                accessibilityRole="button"
                disabled={state.busy}
                onPress={() =>
                  router.push('/payment-issues')
                }
              >
                <Text style={styles.link}>
                  Review payment issues
                </Text>
              </Pressable>
            )}
          </View>
          {data.details.callerRole === 'organizer' && (
            <View style={styles.card}>
              <Text style={styles.title}>
                Complete your group setup
              </Text>
              <Text style={styles.body}>
                Save the rules below, invite members, then
                review their payout positions after
                approval.
              </Text>
              <Pressable
                accessibilityRole="button"
                disabled={state.busy}
                onPress={() =>
                  router.push('/invite-members')
                }
              >
                <Text style={styles.link}>
                  Invite members
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={state.busy}
                onPress={() => router.push('/payout-order')}
              >
                <Text style={styles.link}>
                  Review payout order
                </Text>
              </Pressable>
            </View>
          )}
          <View style={styles.card}>
            <Text style={styles.title}>Current rules</Text>
            <Text style={styles.body}>
              Grace period: {data.rules.gracePeriodDays}{' '}
              days
            </Text>
            <Text style={styles.body}>
              Late evidence:{' '}
              {data.rules.allowLateSubmission
                ? 'Allowed'
                : 'Not allowed when overdue'}
            </Text>
            <Text style={styles.body}>
              Member limit:{' '}
              {data.rules.maxMembers ?? 'No limit'}
            </Text>
          </View>
          {data.details.callerRole === 'organizer' && (
            <RulesEditor
              key={JSON.stringify(data.rules)}
              rules={data.rules}
              memberCount={data.details.members.length}
              disabled={state.busy || state.needsRefresh}
              onSave={(rules) =>
                void state.save(
                  () => saveGroupRules(group.id, rules),
                  'Group rules saved.',
                )
              }
            />
          )}
        </>
      )}
    </WorkflowScreen>
  );
}
