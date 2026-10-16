import { PaymentDetailsCard } from '@/components/payment-details';
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
  paymentInstructions?: {bankName:string;accountName:string;accountNumber:string;reference:string} | null;
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
const labels = {
  DUE: 'Due',
  PENDING_REVIEW: 'Under review',
  CONFIRMED: 'Confirmed',
  ISSUE: 'Payment issue',
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
  const { contributionId } = useLocalSearchParams<{ contributionId: string }>();
  return <ContributionReviewContent key={contributionId} />;
}

function ContributionReviewContent() {
  const groupName = useAuthStore((state) => state.selectedGroup?.groupName);
  const [resubmitted, setResubmitted] = useState(false);
  const [memberStep, setMemberStep] = useState<'details' | 'instructions' | 'upload' | 'review'>('details');
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
  const [actionError, setActionError] = useState<
    string | null
  >(null);
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
    if (!isOrganizer && memberStep !== 'details') {
      setMemberStep(contribution?.status === 'ISSUE' || memberStep === 'instructions' ? 'details' : 'instructions');
    } else if (editingStatus) {
      setEditingStatus(false);
      setActionError(null);
    } else if (router.canGoBack()) router.back();
    else
      router.replace(
        isOrganizer
          ? '/contributions'
          : '/member-dashboard',
      );
  };
  const statusStyle =
    contribution?.status === 'CONFIRMED'
      ? styles.confirmed
      : contribution?.status === 'ISSUE' ||
          contribution?.status === 'OVERDUE'
        ? styles.issue
        : contribution?.status === 'PENDING_REVIEW'
          ? styles.underReview
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
    latestEvidence?.fileUrl
      .split('/')
      .pop()
      ?.split('?')[0] ||
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
          {!isOrganizer && resubmitted ? 'Review Submission' : !isOrganizer && canSubmit ? (contribution?.status === 'ISSUE' ? ({details:'Correction Required',instructions:'Correction Required',upload:'Update Submission',review:reviewing?'Resubmit Evidence':'Review'}[memberStep]) : ({details:'Contribution Details',instructions:'Payment Instructions',upload:'Upload Evidence',review:'Review submission'}[memberStep])) : 'Contribution Details'}
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
              onPress={() =>
                setReload((value) => value + 1)
              }
            >
              <Text style={styles.primaryButtonText}>
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : !isOrganizer && (canSubmit || resubmitted) ? (
          <>
            {resubmitted && <View style={[styles.noteBox,styles.confirmedBackground]}><Feather name="check-circle" size={24} color={colors.primary}/><Text style={styles.optionTitle}>Submission successful</Text><Text style={styles.noteText}>{contribution.status === 'PENDING_REVIEW' ? 'Your evidence has been successfully resubmitted and is under review.' : 'Your evidence has been successfully resubmitted.'}</Text></View>}
            {!resubmitted && contribution.status==='ISSUE' && <View style={[styles.noteBox,memberStep==='details'?styles.correctionWarning:styles.informationBox]}><Text style={styles.optionTitle}>{memberStep==='details'?'Correction required':memberStep==='review'?'Ready for review':'Update your evidence'}</Text><Text style={styles.noteText}>{memberStep==='details' ? (latestEvidence?.reviewNote || contribution.issueReason || 'Review your evidence before resubmitting.') : memberStep==='review' ? 'Your updated submission will be sent for review. You will be notified if further action is required.' : 'Replace the incorrect evidence below. Contribution details stay linked to the original record.'}</Text></View>}
            {memberStep === 'instructions' && <View style={styles.detailsCard}><Text style={styles.optionTitle}>Payment happens outside ThriftCircle</Text><Text style={styles.noteText}>Pay using the method agreed by {groupName || 'your group'}. ThriftCircle only records your contribution and evidence; it does not process the payment.</Text></View>}
            <View style={styles.detailsCard}>
              {[['Group',groupName || 'Your group'],['Amount','₦'+contribution.amount.toLocaleString('en-NG')],['Cycle','Cycle '+contribution.cycleNumber],['Due Date',formatDate(contribution.dueDate)]].map(([label,value])=><View key={label} style={styles.detailRow}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>)}
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Payment Status</Text><Text style={[styles.statusBadge,contribution.status === 'ISSUE' ? styles.pending : statusStyle]}>{contribution.status==='ISSUE'?'Correction Required':labels[contribution.status]}</Text></View>
            </View>
            {resubmitted && <>{latestEvidence && <Pressable accessibilityRole="button" accessibilityLabel="Open resubmitted evidence" style={styles.evidenceCard} onPress={openEvidence}><Feather name="file-text" size={26} color={colors.primary}/><View style={styles.optionContent}><Text style={styles.fileName}>{evidenceName}</Text><Text style={styles.detailLabel}>Uploaded · Open evidence</Text></View></Pressable>}{actionError && <Text accessibilityRole="alert" style={styles.errorText}>{actionError}</Text>}<Pressable accessibilityRole="button" style={styles.primaryButton} onPress={()=>router.replace('/member-dashboard')}><Text style={styles.primaryButtonText}>Back home</Text></Pressable></>}
            {!resubmitted && memberStep==='details' && contribution.status==='ISSUE' && <><Text style={styles.sectionTitle}>What to fix</Text><View style={styles.instructionRow}><Text style={styles.stepNumber}>1</Text><Text style={[styles.noteText,styles.optionContent]}>Review the organizer’s reason above and check the details on your receipt.</Text></View><View style={styles.instructionRow}><Text style={styles.stepNumber}>2</Text><Text style={[styles.noteText,styles.optionContent]}>Upload clear evidence showing the correct payment details.</Text></View><Pressable accessibilityRole="button" style={styles.primaryButton} onPress={()=>setMemberStep('upload')}><Text style={styles.primaryButtonText}>Update Submission</Text></Pressable></>}
            {!resubmitted && memberStep === 'details' && contribution.status!=='ISSUE' && <>
              <Text style={styles.sectionTitle}>Payment Instructions</Text>
              <View style={styles.paymentDetailsContainer}><PaymentDetailsCard details={contribution.paymentInstructions ? {...contribution.paymentInstructions,referenceNote:contribution.paymentInstructions.reference} : null}/></View>
              <View style={[styles.noteBox,styles.informationBox]}><Text style={styles.noteLabel}>Note</Text><Text style={styles.noteText}>Upload proof after payment.</Text></View>
              <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={()=>setMemberStep('instructions')}><Text style={styles.primaryButtonText}>View Payment Instructions</Text></Pressable>
              <Pressable accessibilityRole="button" style={styles.secondaryButton} onPress={()=>setMemberStep('upload')}><Text style={styles.secondaryButtonText}>Submit Payment Evidence</Text></Pressable>
              <Pressable accessibilityRole="button" style={styles.issueLink} onPress={()=>router.push({pathname:'/contributions',params:{memberId:userId}})}><Text style={styles.secondaryButtonText}>View Contribution History →</Text></Pressable>
            </>}
            {memberStep === 'instructions' && <>
              <View style={styles.paymentDetailsContainer}><PaymentDetailsCard details={contribution.paymentInstructions ? {...contribution.paymentInstructions,referenceNote:contribution.paymentInstructions.reference} : null}/></View>
              <Text style={styles.sectionTitle}>How to pay</Text>
              {['Pay using the group’s agreed method (e.g. bank transfer).','Keep your payment proof (screenshot or receipt).','Return to ThriftCircle to submit your evidence.'].map((text,index)=><View key={text} style={styles.instructionRow}><Text style={styles.stepNumber}>{index+1}</Text><Text style={[styles.noteText,styles.optionContent]}>{text}</Text></View>)}
              <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={()=>setMemberStep('upload')}><Text style={styles.primaryButtonText}>I have made the payment</Text></Pressable>
            </>}
            {!resubmitted && (memberStep === 'upload' || memberStep === 'review') && <PaymentEvidenceForm contributionId={contribution._id} correction={contribution.status==='ISSUE'} initialNote={latestEvidence?.note || ''} onRefresh={()=>setReload(value=>value+1)} onBusyChange={setReviewing} onReviewChange={value=>setMemberStep(value?'review':'upload')} onSubmitted={()=>{setResubmitted(contribution.status==='ISSUE');setMemberStep('details');setReload(value=>value+1)}}/>}
          </>
        ) : (
          <>
            <View style={styles.banner}>
              <View>
                <Text style={styles.bannerDate}>
                  {formatDate(contribution.dueDate)}
                </Text>
                <Text style={styles.amount}>
                  ₦
                  {contribution.amount.toLocaleString(
                    'en-NG',
                  )}
                </Text>
              </View>
              <Text
                style={[styles.statusBadge, statusStyle]}
              >
                {labels[contribution.status]}
              </Text>
            </View>
            {editingStatus ? (
              <>
                <Text style={styles.sectionTitle}>
                  Review payment evidence
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
                            <View
                              style={styles.radioSelected}
                            />
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
                  placeholderTextColor={
                    colors.textSecondary
                  }
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
                    <ActivityIndicator
                      color={colors.white}
                    />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      {decision === 'APPROVED'
                        ? 'Confirm Payment'
                        : 'Request Correction'}
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
                      {formatSubmitted(
                        contribution.submittedAt,
                      )}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      Status
                    </Text>
                    <Text
                      style={[
                        styles.statusBadge,
                        statusStyle,
                      ]}
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
                      {latestEvidence.fileType ===
                        'image' && !imageFailed ? (
                        <Image
                          source={{
                            uri: latestEvidence.fileUrl,
                          }}
                          style={styles.evidenceImage}
                          resizeMode="cover"
                          onError={() =>
                            setImageFailed(true)
                          }
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
                              latestEvidence.fileSize /
                              1048576
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
                      No payment evidence has been submitted
                      for this contribution.
                    </Text>
                  </View>
                )}
                {canSubmit && contribution && (
                  <PaymentEvidenceForm
                    key={contribution._id}
                    contributionId={contribution._id}
                    correction={
                      contribution.status === 'ISSUE'
                    }
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
                      placeholderTextColor={
                        colors.textSecondary
                      }
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
                      <Text
                        style={styles.primaryButtonText}
                      >
                        Review payment
                      </Text>
                    </Pressable>
                    <Pressable
                      style={styles.secondaryButton}
                      accessibilityRole="button"
                      onPress={back}
                    >
                      <Text
                        style={styles.secondaryButtonText}
                      >
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
        {contribution?.status === 'PENDING_REVIEW' &&
          (isOrganizer ||
            contribution.memberId === userId) && (
            <Pressable
              style={styles.issueLink}
              accessibilityRole="button"
              disabled={reviewing}
              onPress={() =>
                router.push({
                  pathname: '/payment-issues',
                  params: {
                    contributionId: contribution._id,
                  },
                })
              }
            >
              <Text style={styles.secondaryButtonText}>
                Report a payment issue
              </Text>
            </Pressable>
          )}
      </ScrollView>
      {!reviewing && (
        <OrganizerBottomNavigation active="Contributions" />
      )}
    </SafeAreaView>
  );
}
