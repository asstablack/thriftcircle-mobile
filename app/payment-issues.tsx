import { useCallback, useState } from 'react';
import {
  Redirect,
  router,
  useLocalSearchParams,
} from 'expo-router';
import {
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { WorkflowScreen } from '@/components/workflow-screen';
import {
  getContributionDetails,
  getGroupDetails,
} from '@/services/groupApi';
import {
  getPaymentIssues,
  reportPaymentIssue,
  updatePaymentIssue,
  type PaymentIssue,
  type WorkflowGroup,
} from '@/services/groupWorkflowApi';
import { useWorkflowResource } from '@/hooks/use-workflow-resource';
import { useAuthStore } from '@/store/authStore';
import { accountStyles as styles } from '@/styles/accountStyles';

type Contribution = {
  _id: string;
  groupId: string;
  memberId: string;
  status: string;
  issueReason?: string | null;
};
const labels = {
  REPORTED: 'Reported',
  UNDER_REVIEW: 'Under review',
  CORRECTION_REQUIRED: 'Correction required',
  RESOLVED: 'Resolved',
};
function IssueCard({
  issue,
  disabled,
  update,
}: {
  issue: PaymentIssue;
  disabled: boolean;
  update: (
    status: 'UNDER_REVIEW' | 'CORRECTION_REQUIRED',
    note: string,
  ) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  return (
    <View style={styles.card}>
      <Text style={styles.status}>
        {labels[issue.status]}
      </Text>
      <Text style={styles.body}>{issue.description}</Text>
      <Text style={styles.body}>
        Reported by{' '}
        {typeof issue.raisedBy === 'object'
          ? issue.raisedBy?.fullName || 'Unavailable member'
          : 'Member'}{' '}
        ·{' '}
        {new Date(issue.createdAt).toLocaleDateString(
          'en-NG',
        )}
      </Text>
      {!!issue.resolutionNote && (
        <Text style={styles.body}>
          Organizer note: {issue.resolutionNote}
        </Text>
      )}
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={() =>
          router.push({
            pathname: '/contribution-review',
            params: {
              contributionId: issue.contributionId,
            },
          })
        }
      >
        <Text style={styles.link}>
          View contribution and evidence
        </Text>
      </Pressable>
      {issue.status !== 'RESOLVED' && (
        <>
          <Pressable
            accessibilityRole="button"
            disabled={disabled}
            onPress={() => setEditing(!editing)}
          >
            <Text style={styles.link}>
              {editing ? 'Cancel update' : 'Review issue'}
            </Text>
          </Pressable>
          {editing && (
            <>
              <Text style={styles.body}>
                The issue resolves automatically when
                corrected evidence is approved.
              </Text>
              <TextInput
                accessibilityLabel="Issue review note"
                multiline
                value={note}
                onChangeText={setNote}
                editable={!disabled}
                placeholder="Explain your review or the correction needed"
                style={styles.input}
              />
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
                style={[
                  styles.button,
                  disabled && styles.disabled,
                ]}
                onPress={() => update('UNDER_REVIEW', note)}
              >
                <Text style={styles.buttonText}>
                  Mark under review
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={disabled}
                style={[
                  styles.button,
                  disabled && styles.disabled,
                ]}
                onPress={() => {
                  if (!note.trim()) {
                    setError(
                      'Explain what the member needs to correct.',
                    );
                    return;
                  }
                  setError('');
                  update('CORRECTION_REQUIRED', note);
                }}
              >
                <Text style={styles.buttonText}>
                  Request correction
                </Text>
              </Pressable>
            </>
          )}
        </>
      )}
    </View>
  );
}
export default function PaymentIssuesScreen() {
  const group = useAuthStore(
    (state) => state.selectedGroup,
  );
  const userId = useAuthStore((state) => state.user?.id);
  const { contributionId } = useLocalSearchParams<{
    contributionId?: string;
  }>();
  const [description, setDescription] = useState('');
  const [validation, setValidation] = useState('');
  const loader = useCallback(async () => {
    if (!group) throw new Error('Choose a group first.');
    const details: WorkflowGroup = await getGroupDetails(
      group.id,
    );
    const contribution: Contribution | null = contributionId
      ? await getContributionDetails(contributionId)
      : null;
    if (contribution && contribution.groupId !== group.id)
      throw new Error(
        'Select the group this contribution belongs to before reporting an issue.',
      );
    const issues =
      details.callerRole === 'organizer'
        ? await getPaymentIssues(group.id)
        : [];
    return { details, contribution, issues };
  }, [group, contributionId]);
  const state = useWorkflowResource(loader);
  if (!group) return <Redirect href="/group-selection" />;
  const data = state.data;
  const disabled = state.busy || state.needsRefresh;
  const canReport =
    data?.contribution?.status === 'PENDING_REVIEW' &&
    (data.details.callerRole === 'organizer' ||
      data.contribution.memberId === userId);
  return (
    <WorkflowScreen
      title="Payment issues"
      subtitle={group.groupName}
      state={state}
    >
      {data && (
        <>
          {data.contribution && (
            <View style={styles.card}>
              <Text style={styles.title}>
                Selected contribution
              </Text>
              {!!data.contribution.issueReason && (
                <Text style={styles.body}>
                  {data.contribution.issueReason}
                </Text>
              )}
              {canReport ? (
                <>
                  <Text style={styles.body}>
                    Explain the issue with this submitted
                    payment. Reporting flags it for review;
                    it does not confirm or reverse a
                    payment.
                  </Text>
                  <TextInput
                    accessibilityLabel="Payment issue description"
                    multiline
                    value={description}
                    onChangeText={setDescription}
                    editable={!disabled}
                    style={styles.input}
                    placeholder="Describe the payment issue"
                  />
                  {!!validation && (
                    <Text
                      accessibilityRole="alert"
                      style={styles.error}
                    >
                      {validation}
                    </Text>
                  )}
                  <Pressable
                    accessibilityRole="button"
                    disabled={disabled}
                    style={[
                      styles.button,
                      disabled && styles.disabled,
                    ]}
                    onPress={() => {
                      if (!description.trim()) {
                        setValidation(
                          'Describe the issue first.',
                        );
                        return;
                      }
                      setValidation('');
                      void state.save(
                        () =>
                          reportPaymentIssue(
                            data.contribution!._id,
                            description,
                          ),
                        'Issue reported. The contribution has been flagged for review.',
                      );
                    }}
                  >
                    <Text style={styles.buttonText}>
                      Submit issue report
                    </Text>
                  </Pressable>
                </>
              ) : (
                <Text style={styles.body}>
                  New issues can be reported only while a
                  contribution is awaiting review. Open the
                  contribution to see its current status and
                  any requested correction.
                </Text>
              )}
              <Pressable
                accessibilityRole="button"
                disabled={disabled}
                onPress={() =>
                  router.push({
                    pathname: '/contribution-review',
                    params: {
                      contributionId:
                        data.contribution!._id,
                    },
                  })
                }
              >
                <Text style={styles.link}>
                  Back to contribution
                </Text>
              </Pressable>
            </View>
          )}
          {data.details.callerRole === 'organizer' ? (
            <>
              <Text style={styles.title}>
                Group issue records
              </Text>
              {!data.issues.length && (
                <Text style={styles.body}>
                  No payment issues have been reported.
                </Text>
              )}
              {data.issues.map((issue) => (
                <IssueCard
                  key={issue._id + issue.updatedAt}
                  issue={issue}
                  disabled={disabled}
                  update={(status, note) =>
                    void state.save(
                      () =>
                        updatePaymentIssue(
                          issue._id,
                          status,
                          note,
                        ),
                      'Issue updated. The member will see the latest contribution status.',
                    )
                  }
                />
              ))}
            </>
          ) : (
            !data.contribution && (
              <Text style={styles.body}>
                Open one of your contributions awaiting
                review to report an issue. Your contribution
                details show correction requests and payment
                status.
              </Text>
            )
          )}
        </>
      )}
    </WorkflowScreen>
  );
}
