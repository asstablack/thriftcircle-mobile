import { API_ROOT_URL } from '@/config/api';
import { getTokens } from './authStorage';

export type Payout = {
  _id: string;
  cycleNumber: number;
  recipientId: { _id: string; fullName: string } | string | null;
  amount: number;
  currency: string;
  status:
    | 'pending_approval'
    | 'approved'
    | 'completed'
    | 'reversed'
    | 'failed';
  createdAt: string;
  note: string | null;
};

export type PayoutInput = {
  cycleNumber: number;
  note?: string;
};

async function payoutRequest(
  path: string,
  method: 'GET' | 'POST' | 'PATCH',
  data?: PayoutInput,
) {
  const { accessToken } = await getTokens();
  if (!accessToken) throw new Error('You are not logged in.');

  const response = await fetch(
    `${API_ROOT_URL}/groups/${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      ...(data ? { body: JSON.stringify(data) } : {}),
    },
  );
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Unable to load payouts.');
  }
  return result;
}

export function getGroupPayouts(
  groupId: string,
): Promise<Payout[]> {
  return payoutRequest(`${encodeURIComponent(groupId)}/payouts`, 'GET');
}

export function recordPayout(
  groupId: string,
  data: PayoutInput,
): Promise<Payout> {
  if (
    !Number.isInteger(data.cycleNumber) ||
    data.cycleNumber < 1
  ) {
    throw new Error('A valid cycle is required.');
  }
  return payoutRequest(`${encodeURIComponent(groupId)}/payouts`, 'POST', {
    cycleNumber: data.cycleNumber,
    note: data.note?.trim(),
  });
}

export function approvePayout(payoutId: string): Promise<Payout> {
  // payoutRoutes is mounted under /groups in the current backend.
  return payoutRequest(
    `payouts/${encodeURIComponent(payoutId)}/approve`,
    'PATCH',
  );
}
