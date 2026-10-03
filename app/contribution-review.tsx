import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  getContributionDetails,
  reviewPaymentEvidence,
} from '@/services/groupApi';
import { contributionReviewStyles as styles } from '@/styles/contributionReviewStyles';
import { colors } from '@/constants/color';

type Evidence = {
  _id: string;
  contributionId: string;
  submittedBy: string;
  fileUrl: string;
  filePublicId: string;
  fileType: 'image' | 'pdf';
  note: string | null;
  reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
};

type ContributionDetails = {
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
  issueReason: string | null;
  evidence: Evidence[];
};

export default function ContributionReviewScreen() {
  const { contributionId } = useLocalSearchParams<{
    contributionId: string;
  }>();

  const [contribution, setContribution] =
    useState<ContributionDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [reviewNote, setReviewNote] = useState('');

  const loadContribution = async () => {
    if (!contributionId) {
      Alert.alert(
        'Missing contribution',
        'No contribution was selected.',
      );
      router.back();
      return;
    }

    try {
      setLoading(true);

      const result = await getContributionDetails(contributionId);

      setContribution(result);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load contribution.';

      Alert.alert('Unable to load contribution', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContribution();
  }, [contributionId]);

  const handleReview = async (
    decision: 'APPROVED' | 'REJECTED',
  ) => {
    if (!contribution?.evidence?.length) {
      Alert.alert(
        'No evidence',
        'There is no payment evidence to review.',
      );
      return;
    }

    const latestEvidence = contribution.evidence[0];

    if (
      decision === 'REJECTED' &&
      !reviewNote.trim()
    ) {
      Alert.alert(
        'Review note required',
        'Please explain why this payment is being flagged.',
      );
      return;
    }

    try {
      setReviewing(true);

      await reviewPaymentEvidence(
        latestEvidence._id,
        decision,
        reviewNote.trim(),
      );

      Alert.alert(
        decision === 'APPROVED'
          ? 'Payment Confirmed'
          : 'Payment Flagged',
        decision === 'APPROVED'
          ? 'The contribution has been confirmed successfully.'
          : 'The contribution has been flagged for the member.',
        [
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to review payment evidence.';

      Alert.alert('Review failed', message);
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
        <Text style={styles.loadingText}>
          Loading payment details...
        </Text>
      </View>
    );
  }

  if (!contribution) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Contribution details unavailable.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={loadContribution}
        >
          <Text style={styles.primaryButtonText}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  const latestEvidence = contribution.evidence?.[0];

  const formattedDueDate = new Date(
    contribution.dueDate,
  ).toLocaleDateString();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            Payment Review
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.sectionLabel}>
            Contribution
          </Text>

          <Text style={styles.amount}>
            ₦{contribution.amount.toLocaleString()}
          </Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Cycle
            </Text>

            <Text style={styles.detailValue}>
              {contribution.cycleNumber}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Due Date
            </Text>

            <Text style={styles.detailValue}>
              {formattedDueDate}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              Status
            </Text>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {contribution.status}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Payment Evidence
        </Text>

        {!latestEvidence ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              No payment evidence
            </Text>

            <Text style={styles.emptyText}>
              The member has not submitted payment evidence
              for this contribution.
            </Text>
          </View>
        ) : (
          <View style={styles.evidenceCard}>
            {latestEvidence.fileType === 'image' ? (
              <Pressable
                onPress={() =>
                  Linking.openURL(latestEvidence.fileUrl)
                }
              >
                <Image
                  source={{
                    uri: latestEvidence.fileUrl,
                  }}
                  style={styles.evidenceImage}
                  resizeMode="cover"
                />
              </Pressable>
            ) : (
              <Pressable
                style={styles.pdfButton}
                onPress={() =>
                  Linking.openURL(latestEvidence.fileUrl)
                }
              >
                <Text style={styles.pdfIcon}>
                  PDF
                </Text>

                <Text style={styles.pdfText}>
                  Open payment evidence
                </Text>
              </Pressable>
            )}

            {latestEvidence.note ? (
              <View style={styles.noteBox}>
                <Text style={styles.noteLabel}>
                  Member Note
                </Text>

                <Text style={styles.noteText}>
                  {latestEvidence.note}
                </Text>
              </View>
            ) : null}
          </View>
        )}

        {contribution.status === 'PENDING_REVIEW' &&
        latestEvidence ? (
          <>
            <Text style={styles.sectionTitle}>
              Review Decision
            </Text>

            <TextInput
              value={reviewNote}
              onChangeText={setReviewNote}
              placeholder="Add a note if you need to flag this payment..."
              placeholderTextColor={colors.textSecondary}
              multiline
              style={styles.reviewInput}
            />

            <Pressable
              style={[
                styles.primaryButton,
                reviewing && styles.disabledButton,
              ]}
              disabled={reviewing}
              onPress={() => handleReview('APPROVED')}
            >
              {reviewing ? (
                <ActivityIndicator
                  color={colors.white}
                />
              ) : (
                <Text style={styles.primaryButtonText}>
                  Confirm Payment
                </Text>
              )}
            </Pressable>

            <Pressable
              style={[
                styles.secondaryButton,
                reviewing && styles.disabledButton,
              ]}
              disabled={reviewing}
              onPress={() => handleReview('REJECTED')}
            >
              <Text style={styles.secondaryButtonText}>
                Flag Issue
              </Text>
            </Pressable>
          </>
        ) : null}

        {contribution.status === 'ISSUE' &&
        contribution.issueReason ? (
          <View style={styles.issueCard}>
            <Text style={styles.issueTitle}>
              Payment Flagged
            </Text>

            <Text style={styles.issueText}>
              {contribution.issueReason}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}