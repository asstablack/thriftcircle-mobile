import { API_ROOT_URL } from '@/config/api';
import { getTokens } from './authStorage';

export type PendingMember = {
  _id: string;
  status: 'pending';
  createdAt: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  } | null;
};

async function membershipRequest(
  path: string,
  method = 'GET',
) {
  const { accessToken } = await getTokens();
  if (!accessToken)
    throw new Error('You are not logged in.');
  const response = await fetch(
    `${API_ROOT_URL}/groups/${path}`,
    {
      method,
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message || 'Unable to update membership.',
    );
  }
  return result;
}

export function getPendingMembers(
  groupId: string,
): Promise<PendingMember[]> {
  return membershipRequest(
    `${encodeURIComponent(groupId)}/pending`,
  );
}

export function reviewMembership(
  groupId: string,
  userId: string,
  decision: 'approve' | 'reject',
) {
  return membershipRequest(
    `${encodeURIComponent(groupId)}/members/${encodeURIComponent(userId)}/${decision}`,
    'PATCH',
  );
}
