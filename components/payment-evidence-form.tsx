import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { Feather } from '@expo/vector-icons';
import {
  EVIDENCE_TYPES,
  submitPaymentEvidence,
  checkEvidenceFile,
  EvidenceFileError,
} from '@/services/evidenceApi';
import { contributionReviewStyles as styles } from '@/styles/contributionReviewStyles';
import { colors } from '@/constants/color';

type Props = {
  contributionId: string;
  correction: boolean;
  onBusyChange: (busy: boolean) => void;
  onSubmitted: () => void;
  onRefresh?: () => void;
  initialNote?: string;
  onReviewChange?: (review: boolean) => void;
};

export function PaymentEvidenceForm({
  contributionId,
  correction,
  onBusyChange,
  onSubmitted,
  onReviewChange,
  onRefresh,
  initialNote = '',
}: Props) {
  const [file, setFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(
      null,
    );
  const [note, setNote] = useState(initialNote);
  const [review, updateReview] = useState(false);
  const setReview = (value: boolean) => { updateReview(value); onReviewChange?.(value); };
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);
  const selecting = useRef(false);
  const [picking, setPicking] = useState(false);

  const selectFile = async () => {
    if (submitting.current || selecting.current) return;
    selecting.current = true;
    setPicking(true);
    setError(null);
    try {
      let selected: DocumentPicker.DocumentPickerAsset;
      if (Platform.OS === 'web') {
        const result = await DocumentPicker.getDocumentAsync({
          type: EVIDENCE_TYPES, multiple: false,
        });
        if (result.canceled) return;
        selected = result.assets[0];
      } else {
        // The file-system picker retains access to Android document-provider URIs.
        const result = await File.pickFileAsync({ mimeTypes: EVIDENCE_TYPES });
        if (result.canceled) return;
        const source = result.result;
        selected = {
          uri: source.uri, name: source.name, mimeType: source.type,
          size: source.size, lastModified: Date.now(),
        };
        await checkEvidenceFile(selected);
        const cached = new File(Paths.cache, 'evidence-' + Date.now() + '-' + source.name.replace(/[^a-zA-Z0-9._-]/g, '_'));
        await source.copy(cached);
        selected = { ...selected, uri: cached.uri };
      }
      await checkEvidenceFile(selected);
      setFile(selected);
      setReview(false);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to choose this file.',
      );
    } finally {
      selecting.current = false;
      setPicking(false);
    }
  };
  const submit = async () => {
    if (!file || submitting.current || selecting.current || needsRefresh) return;
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
      if (reason instanceof EvidenceFileError) {
        setFile(null);
        setReview(false);
        setError(reason.message);
        return;
      }
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
      {!review && <>
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
      </>}
      <Pressable
        style={[
          styles.uploadBox,
          file && styles.selectedUpload,
          review && styles.reviewFile,
        ]}
        onPress={() => void selectFile()}
        disabled={picking || busy || review || needsRefresh}
        accessibilityRole="button"
        accessibilityLabel="Choose payment evidence"
      >
        <Feather
          name={review ? 'file-text' : 'upload'}
          size={26}
          color={colors.primary}
        />
        <Text numberOfLines={2} style={[styles.fileName, review && styles.optionContent]}>
          {file ? file.name : 'Upload payment evidence'}
        </Text>
        <Text style={styles.detailLabel}>
          {file
            ? review
              ? ((file.size !== undefined ? (file.size / 1048576).toFixed(2) + ' MB · ' : '') + 'Ready to submit')
              : 'Selected · tap to replace file'
            : 'JPEG, PNG or PDF · Maximum 5 MB'}
        </Text>
      </Pressable>
      {file && !review && (
        <Pressable
          disabled={picking || busy}
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
      {!review && <Text style={styles.sectionTitle}>
        Note (optional)
      </Text>}
      {!review ? <TextInput
        accessibilityLabel="Payment evidence note"
        multiline
        editable={!busy && !review && !needsRefresh}
        value={note}
        onChangeText={setNote}
        style={styles.reviewInput}
        placeholder="Add a payment reference or explanation"
        placeholderTextColor={colors.textSecondary}
      /> : note.trim() ? <View style={styles.noteBox}><Text style={styles.noteText}>{note}</Text></View> : null}
      {error && (
        <Text
          accessibilityRole="alert"
          style={styles.errorText}
        >
          {error}
        </Text>
      )}
      <Pressable
        accessibilityRole="button"
        style={[
          styles.primaryButton,
          (!file || picking || busy || needsRefresh) &&
            styles.disabledButton,
        ]}
        disabled={!file || picking || busy || needsRefresh}
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
          onPress={onRefresh ?? onSubmitted}
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

