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
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [note, setNote] = useState('');
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
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to choose this file.',
      );
    }
  };
  const submit = async () => {
    if (!file || submitting.current) return;
    submitting.current = true;
    setBusy(true);
    onBusyChange(true);
    setError(null);
    try {
      await submitPaymentEvidence(contributionId, file, note);
      onSubmitted();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to submit evidence.',
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
        {correction
          ? 'Submit corrected evidence'
          : 'Submit payment evidence'}
      </Text>
      <Text style={styles.noteText}>
        Upload proof of the payment you made outside
        ThriftCircle. Your organizer will review it.
      </Text>
      <Pressable
        style={styles.uploadBox}
        onPress={() => void selectFile()}
        disabled={busy}
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
            ? 'Tap to replace file'
            : 'JPEG, PNG or PDF · Maximum 5 MB'}
        </Text>
      </Pressable>
      {file && (
        <Pressable
          disabled={busy}
          onPress={() => setFile(null)}
        >
          <Text style={styles.secondaryButtonText}>
            Remove file
          </Text>
        </Pressable>
      )}
      <Text style={styles.sectionTitle}>Note (optional)</Text>
      <TextInput
        accessibilityLabel="Payment evidence note"
        multiline
        editable={!busy}
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
          (!file || busy) && styles.disabledButton,
        ]}
        disabled={!file || busy}
        onPress={() => void submit()}
      >
        {busy ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.primaryButtonText}>
            Submit for Review
          </Text>
        )}
      </Pressable>
      {busy && (
        <Text style={styles.noteText}>
          Uploading evidence… Please keep this screen open.
        </Text>
      )}
    </View>
  );
}
