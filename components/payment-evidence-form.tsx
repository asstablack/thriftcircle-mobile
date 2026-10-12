import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Feather } from '@expo/vector-icons';
import {
  EVIDENCE_TYPES,
  submitPaymentEvidence,
  validateEvidence,
} from '@/services/evidenceApi';
import { contributionReviewStyles as styles } from '@/styles/contributionReviewStyles';
import { colors } from '@/constants/color';

type Props = {
  contributionId: string;
  correction: boolean;
  onBusyChange: (busy: boolean) => void;
  onSubmitted: () => void;
};

export function PaymentEvidenceForm({
  contributionId,
  correction,
  onBusyChange,
  onSubmitted,
}: Props) {
  const [file, setFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(
      null,
    );
  const [note, setNote] = useState('');
  const [review, setReview] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);

  const selectFile = async () => {
    if (submitting.current) return;
    setError(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: EVIDENCE_TYPES,
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      validateEvidence(result.assets[0]);
      setFile(result.assets[0]);
      setReview(false);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to choose this file.',
      );
    }
  };
  const submit = async () => {
    if (!file || submitting.current || needsRefresh) return;
    submitting.current = true;
    setBusy(true);
    onBusyChange(true);
    setError(null);
    try {
      await submitPaymentEvidence(
        contributionId,
        file,
        note,
      );
      onSubmitted();
    } catch (reason) {
      setNeedsRefresh(true);
      setError(
        (reason instanceof Error
          ? reason.message
          : 'Unable to submit evidence.') +
          ' Refresh the contribution before trying again.',
      );
    } finally {
      submitting.current = false;
      setBusy(false);
      onBusyChange(false);
    }
  };
  return (
    <View>
      <Text style={styles.sectionTitle}>
        {review
          ? 'Review Submission'
          : correction
            ? 'Update Submission'
            : 'Upload Payment Evidence'}
      </Text>
      <Text style={styles.noteText}>
        Upload proof of the payment you made outside
        ThriftCircle. Your organizer will review it.
      </Text>
      <Pressable
        style={[
          styles.uploadBox,
          file && styles.selectedUpload,
        ]}
        onPress={() => void selectFile()}
        disabled={busy || review || needsRefresh}
        accessibilityRole="button"
        accessibilityLabel="Choose payment evidence"
      >
        <Feather
          name="upload"
          size={26}
          color={colors.primary}
        />
        <Text style={styles.fileName}>
          {file ? file.name : 'Upload payment evidence'}
        </Text>
        <Text style={styles.detailLabel}>
          {file
            ? review
              ? 'Selected · ready to submit'
              : 'Selected · tap to replace file'
            : 'JPEG, PNG or PDF · Maximum 5 MB'}
        </Text>
      </Pressable>
      {file && !review && (
        <Pressable
          disabled={busy}
          onPress={() => {
            setFile(null);
            setReview(false);
          }}
        >
          <Text style={styles.secondaryButtonText}>
            Remove file
          </Text>
        </Pressable>
      )}
      <Text style={styles.sectionTitle}>
        Note (optional)
      </Text>
      <TextInput
        accessibilityLabel="Payment evidence note"
        multiline
        editable={!busy && !review && !needsRefresh}
        value={note}
        onChangeText={setNote}
        style={styles.reviewInput}
        placeholder="Add a payment reference or explanation"
        placeholderTextColor={colors.textSecondary}
      />
      {error && (
        <Text
          accessibilityRole="alert"
          style={styles.errorText}
        >
          {error}
        </Text>
      )}
      <Pressable
        style={[
          styles.primaryButton,
          (!file || busy || needsRefresh) &&
            styles.disabledButton,
        ]}
        disabled={!file || busy || needsRefresh}
        onPress={() =>
          review ? void submit() : setReview(true)
        }
      >
        {busy ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.primaryButtonText}>
            {review
              ? correction
                ? 'Resubmit Evidence'
                : 'Submit'
              : 'Continue to Review'}
          </Text>
        )}
      </Pressable>
      {review && !busy && !needsRefresh && (
        <Pressable
          accessibilityRole="button"
          style={styles.secondaryButton}
          onPress={() => setReview(false)}
        >
          <Text style={styles.secondaryButtonText}>
            Back to Edit
          </Text>
        </Pressable>
      )}
      {needsRefresh && (
        <Pressable
          accessibilityRole="button"
          style={styles.secondaryButton}
          onPress={onSubmitted}
        >
          <Text style={styles.secondaryButtonText}>
            Refresh contribution
          </Text>
        </Pressable>
      )}
      {busy && (
        <Text style={styles.noteText}>
          Uploading evidence… Please keep this screen open.
        </Text>
      )}
    </View>
  );
}
