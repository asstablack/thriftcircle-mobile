import { File, UploadType } from 'expo-file-system';
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

export class EvidenceFileError extends Error {}

export async function checkEvidenceFile(file: DocumentPickerAsset) {
  validateEvidence(file);
  if (Platform.OS === 'web') return;
  try {
    const localFile = new File(file.uri);
    if (!localFile.exists) throw new Error('Missing file');
    validateEvidence({ ...file, size: localFile.size });
    // Verify actual read access before presenting the file as ready to submit.
    await localFile.bytes();
  } catch {
    throw new EvidenceFileError('This file cannot be read. Select a downloaded JPEG, PNG or PDF no larger than 5 MB again.');
  }
}

export async function submitPaymentEvidence(
  contributionId: string,
  file: DocumentPickerAsset,
  note: string,
) {
  await checkEvidenceFile(file);

  const { accessToken } = await getTokens();
  if (!accessToken) {
    throw new Error('You are not logged in.');
  }

  const url =
    `${API_ROOT_URL}/contributions/` +
    `${encodeURIComponent(contributionId)}/evidence`;

  // Web uses the browser's native File and FormData support.
  if (Platform.OS === 'web') {
    if (!file.file) {
      throw new Error('Please select the file again.');
    }

    const body = new FormData();
    body.append('file', file.file, file.name);

    if (note.trim()) {
      body.append('note', note.trim());
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || 'Evidence upload failed.',
      );
    }

    return result;
  }

  // Android/iOS: let Expo construct the multipart request.
  const response = await new File(file.uri).upload(url,
    {
      httpMethod: 'POST',
      uploadType: UploadType.MULTIPART,
      fieldName: 'file',
      mimeType: file.mimeType ?? 'application/octet-stream',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      parameters: note.trim()
        ? { note: note.trim() }
        : {},
    },
  );

  let result: { message?: string; [key: string]: unknown };

  try {
    result = JSON.parse(response.body);
  } catch {
    throw new Error(
      `Upload returned an unreadable response (HTTP ${response.status}).`,
    );
  }

  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      result.message || `Evidence upload failed (HTTP ${response.status}).`,
    );
  }

  return result;
}
