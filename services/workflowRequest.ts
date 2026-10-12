import { API_ROOT_URL } from '@/config/api';
import { getTokens } from './authStorage';

export async function workflowRequest<T>(
  path: string,
  method = 'GET',
  data?: unknown,
): Promise<T> {
  const { accessToken } = await getTokens();
  if (!accessToken)
    throw new Error(
      'You are not logged in. Please sign in again.',
    );
  let response: Response;
  try {
    response = await fetch(API_ROOT_URL + path, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      ...(data === undefined
        ? {}
        : { body: JSON.stringify(data) }),
    });
  } catch {
    throw new Error(
      'Unable to reach the server. Check your connection and refresh before trying again.',
    );
  }
  const result = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(
      result?.message ||
        `Request failed (${response.status}). Please refresh and try again.`,
    );
  if (result === null)
    throw new Error(
      'The server returned an unreadable response. Refresh before trying again.',
    );
  return result as T;
}
