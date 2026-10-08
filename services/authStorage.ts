import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export async function saveTokens(
  accessToken: string,
  refreshToken: string,
) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(
    REFRESH_TOKEN_KEY,
    refreshToken,
  );
}

export async function getTokens() {
  const accessToken =
    await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

  const refreshToken = await SecureStore.getItemAsync(
    REFRESH_TOKEN_KEY,
  );

  return {
    accessToken,
    refreshToken,
  };
}

export async function clearTokens() {
  const results = await Promise.allSettled([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);

  if (results.some((result) => result.status === 'rejected')) {
    throw new Error(
      'Unable to clear saved sign-in details. Please retry logout.',
    );
  }
}
