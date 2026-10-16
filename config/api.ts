export const API_ROOT_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  'https://thriftcircle-api.onrender.com/api'
).replace(/\/+$/, '');

export const API_BASE_URL = `${API_ROOT_URL}/auth`;
