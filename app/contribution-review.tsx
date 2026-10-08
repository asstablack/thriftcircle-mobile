import { PaymentEvidenceForm } from '@/components/payment-evidence-form';
import { useAuthStore } from '@/store/authStore';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrganizerBottomNavigation } from '@/components/organizer-chrome';
import {
  getContributionDetails,
  reviewPaymentEvidence,
} from '@/services/groupApi';
import { contributionReviewStyles as styles } from '@/styles/contributionReviewStyles';
import { colors } from '@/constants/color';

type Evidence = {
  _id: string;
  fileUrl: string;
  filePublicId: string;
  fileType: 'image' | 'pdf';
  note: string | null;
  reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedAt: string | null;
  reviewNote: string | null;
  fileName?: string;
  fileSize?: number;
};
type ContributionDetails = {
  _id: string;
  memberId: string;
  amount: number;
  dueDate: string;
  cycleNumber: number;
  status:
    'DUE' | 'PENDING_REVIEW' | 'CONFIRMED' | 'ISSUE' | 'OVERDUE';
  submittedAt: string | null;
  confirmedAt: string | null;
  issueReason: string | null;
  evidence: Evidence[];
};
const labels = {
  DUE: 'Due',
  PENDING_REVIEW: 'Under review',
  CONFIRMED: 'Confirmed',
  ISSUE: 'Correction requested',
  OVERDUE: 'Overdue',
};
const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-NG', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not submitted';
const formatSubmitted = (value?: string | null) =>
  value
    ? `${formatDate(value)}, ${new Date(value).toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' })}`
    : 'Not submitted';

export default function ContributionReviewScreen() {
  const userId = useAuthStore((state) => state.user?.id);
  const isOrganizer = useAuthStore(
    (state) => state.selectedGroup?.role === 'organizer',
  );
  const { contributionId } = useLocalSearchParams<{
    contributionId: string;
  }>();
  const [contribution, setContribution] =
    useState<ContributionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [editingStatus, setEditingStatus] = useState(false);
  const [decision, setDecision] = useState<
    'APPROVED' | 'REJECTED'
  >('APPROVED');
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(
    null,
  );
  const [imageFailed, setImageFailed] = useState(false);
  const [reload, setReload] = useState(0);
  const submitting = useRef(false);
  const requestVersion = useRef(0);

  useFocusEffect(
    useCallback(() => {
      const version = ++requestVersion.current;
      setLoading(true);
      setError(null);
      setImageFailed(false);
      if (!contributionId) {
        setError('No contribution was selected.');
        setLoading(false);
        return;
      }
      getContributionDetails(contributionId)
        .then((result: ContributionDetails) => {
          if (requestVersion.current === version)
            setContribution(result);
        })
        .catch((reason: unknown) => {
          if (requestVersion.current === version)
            setError(
              reason instanceof Error
                ? reason.message
                : 'Unable to load contribution details.',
            );
        })
        .finally(() => {
          if (requestVersion.current === version)
            setLoading(false);
        });
      return () => {
        requestVersion.current++;
      };
      // The retry counter intentionally restarts this focused request.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contributionId, reload]),
  );

  const latestEvidence = contribution?.evidence?.[0];
  const handleReview = async () => {
    if (
      !isOrganizer ||
      submitting.current ||
      !latestEvidence ||
      latestEvidence.reviewStatus !== 'PENDING'
    )
      return;
    if (decision === 'REJECTED' && !reviewNote.trim()) {
      setActionError(
        'Please explain what the member needs to correct.',
      );
      return;
    }
    submitting.current = true;
    setReviewing(true);
    setActionError(null);
    try {
      await reviewPaymentEvidence(
        latestEvidence._id,
        decision,
        reviewNote.trim(),
      );
      setEditingStatus(false);
      setReviewNote('');
      // Render the server-confirmed status and note after a successful review.
      setReload((value) => value + 1);
    } catch (reason) {
      setActionError(
        reason instanceof Error
          ? reason.message
          : 'Unable to update this contribution. Please try again.',
      );
    } finally {
      submitting.current = false;
      setReviewing(false);
    }
  };
  const openEvidence = async () => {
    if (!latestEvidence) return;
    try {
      await Linking.openURL(latestEvidence.fileUrl);
    } catch {
      setActionError(
        'The receipt could not be opened. Please try again.',
      );
    }
  };
  const back = () => {
    if (editingStatus) {
      setEditingStatus(false);
      setActionError(null);
    } else if (router.canGoBack()) router.back();
    else
      router.replace(
        isOrganizer ? '/contributions' : '/member-dashboard',
      );
  };
  const statusStyle =
    contribution?.status === 'CONFIRMED'
      ? styles.confirmed
      : contribution?.status === 'ISSUE' ||
          contribution?.status === 'OVERDUE'
        ? styles.issue
        : styles.pending;
  const canSubmit =
    contribution?.memberId === userId &&
    ['DUE', 'OVERDUE', 'ISSUE'].includes(
      contribution?.status || '',
    );
  const canReview =
    isOrganizer &&
    contribution?.status === 'PENDING_REVIEW' &&
    latestEvidence?.reviewStatus === 'PENDING';
  // The current API has no original filename; display the stored asset basename.
  const evidenceName =
    latestEvidence?.fileName ||
    latestEvidence?.fileUrl.split('/').pop()?.split('?')[0] ||
    'Payment evidence';

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: !reviewing,
        }}
      />
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.backButton}
          disabled={reviewing}
          onPress={back}
        >
          <Feather
            name="arrow-left"
            size={22}
            color={colors.textDark}
          />
        </Pressable>
        <Text style={styles.headerTitle}>
          Contribution Details
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {loading ? (
          <View
            accessible
            accessibilityLabel="Loading contribution details"
            accessibilityState={{ busy: true }}
          >
            <View style={styles.skeletonBanner} />
            <View style={styles.skeletonCard} />
            <View style={styles.skeletonCard} />
            <View style={styles.skeletonLine} />
          </View>
        ) : error || !contribution ? (
          <View style={styles.stateCard}>
            <Feather
              name="alert-circle"
              size={28}
              color={colors.error}
            />
            <Text style={styles.stateTitle}>
              Something went wrong
            </Text>
            <Text style={styles.stateText}>
              {error || 'Contribution details unavailable.'}
            </Text>
            <Pressable
              style={styles.primaryButton}
              onPress={() => setReload((value) => value + 1)}
            >
              <Text style={styles.primaryButtonText}>
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.banner}>
              <View>
                <Text style={styles.bannerDate}>
                  {formatDate(contribution.dueDate)}
                </Text>
                <Text style={styles.amount}>
                  ₦{contribution.amount.toLocaleString('en-NG')}
                </Text>
              </View>
              <Text style={[styles.statusBadge, statusStyle]}>
                {labels[contribution.status]}
              </Text>
            </View>
            {editingStatus ? (
              <>
                <Text style={styles.sectionTitle}>
                  Select new status
                </Text>
                <View style={styles.selectionCard}>
                  {(['APPROVED', 'REJECTED'] as const).map(
                    (value) => (
                      <Pressable
                        key={value}
                        style={styles.option}
                        accessibilityRole="radio"
                        accessibilityState={{
                          checked: value === decision,
                          disabled: reviewing,
                        }}
                        disabled={reviewing}
                        onPress={() => {
                          setDecision(value);
                          setActionError(null);
                        }}
                      >
                        <View style={styles.radio}>
                          {value === decision && (
                            <View style={styles.radioSelected} />
                          )}
                        </View>
                        <View style={styles.optionContent}>
                          <Text style={styles.optionTitle}>
                            {value === 'APPROVED'
                              ? 'Confirm payment'
                              : 'Request correction'}
                          </Text>
                          <Text style={styles.optionText}>
                            {value === 'APPROVED'
                              ? 'Select this as contribution paid.'
                              : 'Ask the member to upload a clearer receipt.'}
                          </Text>
                        </View>
                      </Pressable>
                    ),
                  )}
                </View>
                <Text style={styles.sectionTitle}>
                  Note to the member (
                  {decision === 'REJECTED'
                    ? 'required'
                    : 'optional'}
                  )
                </Text>
                <TextInput
                  accessibilityLabel="Note to the member"
                  value={reviewNote}
                  onChangeText={setReviewNote}
                  editable={!reviewing}
                  placeholder="Add a message to the member..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  style={styles.reviewInput}
                />
                {actionError && (
                  <Text
                    accessibilityRole="alert"
                    style={styles.errorText}
                  >
                    {actionError}
                  </Text>
                )}
                <Pressable
                  accessibilityRole="button"
                  style={[
                    styles.primaryButton,
                    reviewing && styles.disabledButton,
                  ]}
                  disabled={reviewing}
                  onPress={handleReview}
                >
                  {reviewing ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      Update Status
                    </Text>
                  )}
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  style={styles.secondaryButton}
                  disabled={reviewing}
                  onPress={back}
                >
                  <Text style={styles.secondaryButtonText}>
                    Cancel
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.detailsCard}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      Due date
                    </Text>
                    <Text style={styles.detailValue}>
                      {formatDate(contribution.dueDate)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      Date submitted
                    </Text>
                    <Text style={styles.detailValue}>
                      {formatSubmitted(contribution.submittedAt)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      Status
                    </Text>
                    <Text
                      style={[styles.statusBadge, statusStyle]}
                    >
                      {labels[contribution.status]}
                    </Text>
                  </View>
                </View>
                <Text style={styles.sectionTitle}>
                  Payment Evidence
                </Text>
                {latestEvidence ? (
                  <>
                    <Pressable
                      style={styles.evidenceCard}
                      accessibilityRole="button"
                      accessibilityLabel={`Open payment evidence, ${evidenceName}`}
                      onPress={openEvidence}
                    >
                      {latestEvidence.fileType === 'image' &&
                      !imageFailed ? (
                        <Image
                          source={{
                            uri: latestEvidence.fileUrl,
                          }}
                          style={styles.evidenceImage}
                          resizeMode="cover"
                          onError={() => setImageFailed(true)}
                        />
                      ) : (
                        <View style={styles.fileIcon}>
                          <Feather
                            name="file-text"
                            size={26}
                            color={colors.primary}
                          />
                        </View>
                      )}
                      <View style={styles.optionContent}>
                        <Text
                          style={styles.fileName}
                          numberOfLines={2}
                        >
                          {evidenceName}
                        </Text>
                        {latestEvidence.fileSize !==
                          undefined && (
                          <Text style={styles.detailLabel}>
                            {(
                              latestEvidence.fileSize / 1048576
                            ).toFixed(1)}{' '}
                            MB
                          </Text>
                        )}
                        <Text style={styles.detailLabel}>
                          Open{' '}
                          {latestEvidence.fileType === 'pdf'
                            ? 'PDF'
                            : 'receipt'}
                        </Text>
                      </View>
                      <Feather
                        name="maximize"
                        size={19}
                        color={colors.textSecondary}
                      />
                    </Pressable>
                    {latestEvidence.note && (
                      <View style={styles.noteBox}>
                        <Text style={styles.noteLabel}>
                          Member note
                        </Text>
                        <Text style={styles.noteText}>
                          {latestEvidence.note}
                        </Text>
                      </View>
                    )}
                  </>
                ) : (
                  <View style={styles.noteBox}>
                    <Text style={styles.noteText}>
                      No payment evidence has been submitted for
                      this contribution.
                    </Text>
                  </View>
                )}
                {canSubmit && contribution && (
                  <PaymentEvidenceForm
                    key={contribution._id}
                    contributionId={contribution._id}
                    correction={contribution.status === 'ISSUE'}
                    onBusyChange={setReviewing}
                    onSubmitted={() =>
                      setReload((value) => value + 1)
                    }
                  />
                )}
                {canReview && (
                  <>
                    <Text style={styles.sectionTitle}>
                      Add note (optional)
                    </Text>
                    <TextInput
                      accessibilityLabel="Add note (optional)"
                      value={reviewNote}
                      onChangeText={setReviewNote}
                      placeholder="No note added yet."
                      placeholderTextColor={colors.textSecondary}
                      multiline
                      style={[
                        styles.reviewInput,
                        styles.shortInput,
                      ]}
                    />
                    <Pressable
                      style={styles.primaryButton}
                      accessibilityRole="button"
                      onPress={() => {
                        setEditingStatus(true);
                        setActionError(null);
                      }}
                    >
                      <Text style={styles.primaryButtonText}>
                        Update Status
                      </Text>
                    </Pressable>
                    <Pressable
                      style={styles.secondaryButton}
                      accessibilityRole="button"
                      onPress={back}
                    >
                      <Text style={styles.secondaryButtonText}>
                        Cancel
                      </Text>
                    </Pressable>
                  </>
                )}
                {(contribution.status === 'CONFIRMED' ||
                  contribution.status === 'ISSUE') && (
                  <>
                    <Text style={styles.sectionTitle}>
                      {contribution.status === 'ISSUE'
                        ? 'Note to the member'
                        : 'Added note (optional)'}
                    </Text>
                    <View
                      style={[
                        styles.noteBox,
                        contribution.status === 'ISSUE'
                          ? styles.issueBackground
                          : styles.confirmedBackground,
                      ]}
                    >
                      <Text style={styles.noteText}>
                        {latestEvidence?.reviewNote ||
                          contribution.issueReason ||
                          'No note added.'}
                      </Text>
                      {latestEvidence?.reviewedAt && (
                        <Text style={styles.noteDate}>
                          {formatSubmitted(
                            latestEvidence.reviewedAt,
                          )}
                        </Text>
                      )}
                    </View>
                  </>
                )}
                {actionError && (
                  <Text
                    accessibilityRole="alert"
                    style={styles.errorText}
                  >
                    {actionError}
                  </Text>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
      {!reviewing && (
        <OrganizerBottomNavigation active="Contributions" />
      )}{' '}
    </SafeAreaView>
  );
}
