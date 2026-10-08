import { API_BASE_URL } from '@/config/api';
import { clearTokens, getTokens } from './authStorage';

export async function logoutSession() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  let serverRevoked = false;

  try {
    const { refreshToken } = await getTokens();
    if (refreshToken) {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        signal: controller.signal,
      });
      serverRevoked = response.ok;
    } else {
      serverRevoked = true;
    }
  } catch {
    // Local logout must still work when the server is unavailable.
  } finally {
    clearTimeout(timeout);
    await clearTokens();
  }

  return { serverRevoked };
}
