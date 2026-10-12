import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_BASE_URL } from '@/config/api';
import { useAuthStore } from '@/store/authStore';

type SavedUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
};
type Session = {
  accessToken: string;
  refreshToken: string;
  savedAt: number;
  user?: SavedUser;
};
const KEY = 'thriftcircle.session.v1';
let generation = 0;
let mutations: Promise<unknown> = Promise.resolve();
function mutate<T>(action: () => Promise<T>): Promise<T> {
  const next = mutations.then(action, action);
  mutations = next.catch(() => {});
  return next;
}
let renewal: Promise<Session> | null = null;
const read = async (key: string) =>
  Platform.OS === 'web'
    ? (globalThis.localStorage?.getItem(key) ?? null)
    : SecureStore.getItemAsync(key);
const write = async (key: string, value: string) => {
  if (Platform.OS === 'web')
    globalThis.localStorage.setItem(key, value);
  else await SecureStore.setItemAsync(key, value);
};
const remove = async (key: string) => {
  if (Platform.OS === 'web')
    globalThis.localStorage?.removeItem(key);
  else await SecureStore.deleteItemAsync(key);
};
async function stored(): Promise<Session | null> {
  const text = await read(KEY);
  if (text) {
    const value = JSON.parse(text);
    if (
      typeof value.accessToken !== 'string' ||
      typeof value.refreshToken !== 'string' ||
      typeof value.savedAt !== 'number'
    )
      throw new Error(
        'Saved session is unreadable. Please sign in again.',
      );
    return value;
  }
  const [accessToken, refreshToken] = await Promise.all([
    read('accessToken'),
    read('refreshToken'),
  ]);
  return accessToken && refreshToken
    ? { accessToken, refreshToken, savedAt: 0 }
    : null;
}
export async function saveTokens(
  accessToken: string,
  refreshToken: string,
  user?: SavedUser,
) {
  generation++;
  await mutate(() =>
    write(
      KEY,
      JSON.stringify({
        accessToken,
        refreshToken,
        user,
        savedAt: Date.now(),
      }),
    ),
  );
}
export async function getStoredTokens() {
  const session = await stored();
  return {
    accessToken: session?.accessToken ?? null,
    refreshToken: session?.refreshToken ?? null,
  };
}
async function renew(session: Session): Promise<Session> {
  const current = generation;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(
      `${API_BASE_URL}/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refreshToken: session.refreshToken,
        }),
        signal: controller.signal,
      },
    );
    if (current !== generation)
      throw new Error('Session changed. Please try again.');
    if (response.status === 401) {
      useAuthStore.getState().clearAuth();
      await clearTokens();
      throw new Error(
        'Your session has expired. Please sign in again.',
      );
    }
    if (!response.ok)
      throw new Error(
        'Unable to renew your session. Check your connection and retry.',
      );
    const result = await response.json();
    if (
      typeof result.accessToken !== 'string' ||
      typeof result.refreshToken !== 'string'
    )
      throw new Error(
        'Unable to renew your session. Please sign in again.',
      );
    if (current !== generation)
      throw new Error('Session changed. Please try again.');
    const next = {
      ...session,
      ...result,
      savedAt: Date.now(),
    };
    await mutate(async () => {
      if (current !== generation)
        throw new Error(
          'Session changed. Please sign in again.',
        );
      await write(KEY, JSON.stringify(next));
    });
    if (current !== generation)
      throw new Error(
        'Session changed. Please sign in again.',
      );
    return next;
  } finally {
    clearTimeout(timer);
  }
}
export async function getTokens() {
  const current = generation;
  let session = await stored();
  if (current !== generation)
    throw new Error('Session changed. Please try again.');
  if (!session)
    return { accessToken: null, refreshToken: null };
  // Backend access tokens last 20 minutes; renew conservatively before that window.
  if (
    Date.now() - session.savedAt >= 15 * 60 * 1000 ||
    session.savedAt > Date.now()
  ) {
    if (!renewal)
      renewal = renew(session).finally(() => {
        renewal = null;
      });
    session = await renewal;
  }
  if (current !== generation)
    throw new Error('Session changed. Please try again.');
  return {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  };
}
export async function restoreSession() {
  const current = generation;
  const session = await stored();
  if (
    !session?.user ||
    typeof session.user.id !== 'string' ||
    typeof session.user.fullName !== 'string'
  )
    return null;
  try {
    await getTokens();
  } catch (error) {
    // A network failure must not discard a saved identity. Requests still require
    // a successful token renewal; a rejected refresh clears the session above.
    if (current !== generation) return null;
    const remaining = await stored();
    if (
      !remaining?.user ||
      remaining.user.id !== session.user.id
    )
      throw error;
  }
  return current === generation ? session.user : null;
}
export async function clearTokens() {
  generation++;
  const results = await mutate(() =>
    Promise.allSettled([
      remove(KEY),
      remove('accessToken'),
      remove('refreshToken'),
    ]),
  );
  if (
    results.some((result) => result.status === 'rejected')
  )
    throw new Error(
      'Unable to clear saved sign-in details. Please retry logout.',
    );
}
