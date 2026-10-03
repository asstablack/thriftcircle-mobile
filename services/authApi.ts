import { API_BASE_URL } from '../config/api';

type SignupData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

export async function signup(data: SignupData) {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Signup failed');
  }

  return result;
}

type LoginData = {
  email?: string;
  phoneNumber?: string;
  password: string;
};

export async function login(data: LoginData) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Login failed');
  }

  return result;
}

type ForgotPasswordData = {
  email?: string;
  phoneNumber?: string;
};

export async function forgotPassword(
  data: ForgotPasswordData,
) {
  const response = await fetch(
    `${API_BASE_URL}/forgot-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || 'Password reset request failed',
    );
  }

  return result;
}

type ResetPasswordData = {
  email?: string;
  phoneNumber?: string;
  resetCode: string;
  newPassword: string;
};

export async function resetPassword(
  data: ResetPasswordData,
) {
  const response = await fetch(
    `${API_BASE_URL}/reset-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || 'Password reset failed',
    );
  }

  return result;
}