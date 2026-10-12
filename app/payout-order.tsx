import {
  paidRecipients,
  validateRemainingOrder,
} from '@/utils/payoutRotation';
import { useCallback, useState } from 'react';
import { Redirect } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { WorkflowScreen } from '@/components/workflow-screen';
import {
  getGroupDetails,
  getCurrentCycle,
} from '@/services/groupApi';
import { getGroupPayouts } from '@/services/payoutApi';
import {
  savePayoutOrder,
  type WorkflowGroup,
} from '@/services/groupWorkflowApi';
import { useWorkflowResource } from '@/hooks/use-workflow-resource';
import { useAuthStore } from '@/store/authStore';
import { accountStyles as styles } from '@/styles/accountStyles';

type Member = WorkflowGroup['members'][number];
function OrderEditor({
  members,
  locked,
  disabled,
  onSave,
}: {
  members: Member[];
  locked: Set<string>;
  disabled: boolean;
  onSave: (members: Member[]) => void;
}) {
  const [draft, setDraft] = useState(() =>
    [...members].sort(
      (a, b) => a.payoutOrder - b.payoutOrder,
    ),
  );
  const [confirm, setConfirm] = useState(false);
  const movable = draft.filter(
    (item) => item.userId && !locked.has(item.userId._id),
  );
  const change = (id: string, direction: number) => {
    const index = movable.findIndex(
      (item) => item.userId?._id === id,
    );
    const other = movable[index + direction];
    if (!other) return;
    const first = movable[index];
    setDraft((previous) =>
      previous
        .map((item) =>
          item._id === first._id
            ? { ...item, payoutOrder: other.payoutOrder }
            : item._id === other._id
              ? { ...item, payoutOrder: first.payoutOrder }
              : item,
        )
        .sort((a, b) => a.payoutOrder - b.payoutOrder),
    );
    setConfirm(false);
  };
  const changed = draft.some(
    (item) =>
      item.payoutOrder !==
      members.find((original) => original._id === item._id)
        ?.payoutOrder,
  );
  const invalid =
    members.some(
      (item) =>
        !item.userId ||
        !Number.isInteger(item.payoutOrder) ||
        item.payoutOrder < 1,
    ) ||
    new Set(members.map((item) => item.payoutOrder))
      .size !== members.length;
  return (
    <>
      {draft.map((item) => {
        const id = item.userId?._id;
        const fixed = !id || locked.has(id);
        const index = movable.findIndex(
          (member) => member._id === item._id,
        );
        return (
          <View style={styles.card} key={item._id}>
            <Text style={styles.label}>
              {item.payoutOrder}.{' '}
              {item.userId?.fullName ||
                'Member unavailable'}
            </Text>
            {fixed ? (
              <Text style={styles.body}>
                Position locked for a paid or current-cycle
                recipient.
              </Text>
            ) : (
              <View style={styles.checkbox}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    'Move ' +
                    item.userId?.fullName +
                    ' earlier'
                  }
                  disabled={
                    disabled || invalid || index === 0
                  }
                  onPress={() => change(id!, -1)}
                >
                  <Text
                    style={[
                      styles.link,
                      (index === 0 || disabled) &&
                        styles.disabled,
                    ]}
                  >
                    Move up
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    'Move ' +
                    item.userId?.fullName +
                    ' later'
                  }
                  disabled={
                    disabled ||
                    invalid ||
                    index === movable.length - 1
                  }
                  onPress={() => change(id!, 1)}
                >
                  <Text
                    style={[
                      styles.link,
                      (index === movable.length - 1 ||
                        disabled) &&
                        styles.disabled,
                    ]}
                  >
                    Move down
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        );
      })}
      {invalid && (
        <Text style={styles.error}>
          The saved order contains unavailable members or
          invalid positions. Refresh or ask the organizer to
          check the group records before reordering.
        </Text>
      )}
      {confirm && (
        <Text style={styles.body}>
          Save this payout order? Already-paid and
          current-cycle recipients keep their positions. Let
          affected members know about the new arrangement.
        </Text>
      )}
      <Pressable
        accessibilityRole="button"
        disabled={disabled || invalid || !changed}
        style={[
          styles.button,
          (disabled || invalid || !changed) &&
            styles.disabled,
        ]}
        onPress={() =>
          confirm
            ? onSave(
                draft.filter(
                  (item) =>
                    item.userId &&
                    !locked.has(item.userId._id),
                ),
              )
            : setConfirm(true)
        }
      >
        <Text style={styles.buttonText}>
          {confirm
            ? 'Confirm payout order'
            : 'Review payout order'}
        </Text>
      </Pressable>
      {confirm && (
        <Pressable
          disabled={disabled}
          accessibilityRole="button"
          onPress={() => setConfirm(false)}
        >
          <Text style={styles.link}>Cancel</Text>
        </Pressable>
      )}
    </>
  );
}
export default function PayoutOrderScreen() {
  const group = useAuthStore(
    (state) => state.selectedGroup,
  );
  const loader = useCallback(async () => {
    if (!group) throw new Error('Choose a group first.');
    const details: WorkflowGroup = await getGroupDetails(
      group.id,
    );
    if (details.callerRole !== 'organizer')
      throw new Error(
        'Only organizers can change payout order.',
      );
    const [payouts, cycle] = await Promise.all([
      getGroupPayouts(group.id),
      getCurrentCycle(group.id),
    ]);
    const paid = paidRecipients(payouts);
    const locked = new Set(paid);
    const currentId =
      typeof cycle?.recipientId === 'string'
        ? cycle.recipientId
        : cycle?.recipientId?._id;
    if (currentId) locked.add(currentId);
    return {
      details,
      paid,
      locked,
      pending: payouts.some(
        (p) => p.status === 'pending_approval',
      ),
    };
  }, [group]);
  const state = useWorkflowResource(loader);
  if (!group) return <Redirect href="/group-selection" />;
  return (
    <WorkflowScreen
      title="Payout order"
      subtitle={group.groupName}
      state={state}
    >
      {state.data && (
        <>
          <Text style={styles.body}>
            Arrange unpaid members by moving their
            positions. This changes the recorded order; it
            does not transfer funds or change the current
            cycle recipient.
          </Text>
          <Text style={styles.body}>
            Members who have already received a payout are
            excluded. Their saved positions stay fixed.
          </Text>
          {state.data.details.members.every(
            (member) =>
              member.userId &&
              state.data!.paid.has(member.userId._id),
          ) && (
            <Text style={styles.title}>
              All members have received their payout.
            </Text>
          )}
          {state.data.pending && (
            <Text style={styles.body}>
              Approve the pending payout before changing the
              order.
            </Text>
          )}
          <OrderEditor
            key={JSON.stringify([
              state.data.details.members,
              [...state.data.locked],
            ])}
            members={state.data.details.members.filter(
              (member) =>
                !member.userId ||
                !state.data!.paid.has(member.userId._id),
            )}
            locked={state.data.locked}
            disabled={
              state.busy ||
              state.needsRefresh ||
              state.data.pending
            }
            onSave={(members) =>
              void state.save(async () => {
                const latest = await loader();
                if (latest.pending)
                  throw new Error(
                    'A payout is awaiting approval. Refresh before changing the order.',
                  );
                const order = members.map((member) => ({
                  userId: member.userId!._id,
                  payoutOrder: member.payoutOrder,
                }));
                validateRemainingOrder(
                  latest.details.members,
                  order,
                  latest.locked,
                );
                return savePayoutOrder(group.id, order);
              }, 'Payout order saved. Share the updated arrangement with affected members.')
            }
          />
        </>
      )}
    </WorkflowScreen>
  );
}
