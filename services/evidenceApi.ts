import type { DocumentPickerAsset } from 'expo-document-picker';
import { Platform } from 'react-native';
import { API_ROOT_URL } from '@/config/api';
import { getTokens } from '@/services/authStorage';

export const MAX_EVIDENCE_BYTES = 5 * 1024 * 1024;
export const EVIDENCE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
];

export function validateEvidence(file: DocumentPickerAsset) {
  if (
    !file.mimeType ||
    !EVIDENCE_TYPES.includes(file.mimeType)
  ) {
    throw new Error('Choose a JPEG, PNG or PDF file.');
  }
  const size = file.size ?? file.file?.size;
  if (
    size !== undefined &&
    (size <= 0 || size > MAX_EVIDENCE_BYTES)
  ) {
    throw new Error(
      'Choose a non-empty file no larger than 5 MB.',
    );
  }
}

export async function submitPaymentEvidence(
  contributionId: string,
  file: DocumentPickerAsset,
  note: string,
) {
  validateEvidence(file);
  const { accessToken } = await getTokens();
  if (!accessToken) throw new Error('You are not logged in.');
  const body = new FormData();
  if (Platform.OS === 'web') {
    if (!file.file)
      throw new Error('Please select the file again.');
    body.append('file', file.file, file.name);
  } else {
    // React Native FormData accepts a local file descriptor.
    body.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    } as unknown as Blob);
  }
  if (note.trim()) body.append('note', note.trim());
  const response = await fetch(
    API_ROOT_URL +
      '/contributions/' +
      encodeURIComponent(contributionId) +
      '/evidence',
    {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + accessToken },
      body,
    },
  );
  const result = await response.json();
  if (!response.ok)
    throw new Error(
      result.message ||
        'Evidence upload failed. Please try again.',
    );
  return result;
}
