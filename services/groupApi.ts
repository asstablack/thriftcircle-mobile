import { API_ROOT_URL } from '../config/api';
import { getTokens } from './authStorage';

export async function getMyGroups() {
  const { accessToken } = await getTokens();

  if (!accessToken) {
    throw new Error('You are not logged in.');
  }

  const response = await fetch(`${API_ROOT_URL}/groups/mine`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to load your groups.',
    );
  }

  return result;
}

export async function createGroup(data: {
  groupName: string;
  contributionAmount: number;
  frequency: string;
  startDate: string;
  contributionDeadline: string;
}) {
  const { accessToken } = await getTokens();

  if (!accessToken) {
    throw new Error('You are not logged in.');
  }

  const response = await fetch(`${API_ROOT_URL}/groups`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create group.');
  }

  return result;
}

export async function joinGroup(data: { inviteCode: string }) {
  const { accessToken } = await getTokens();

  if (!accessToken) {
    throw new Error('You are not logged in.');
  }

  const response = await fetch(`${API_ROOT_URL}/groups/join`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to join group.');
  }

  return result;
}

export async function getGroupDetails(groupId: string) {
  const { accessToken } = await getTokens();

  if (!accessToken) {
    throw new Error('You are not logged in.');
  }

  const response = await fetch(
    `${API_ROOT_URL}/groups/${groupId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to load group details.',
    );
  }

  return result;
}

export async function getGroupContributions(groupId: string) {
  const { accessToken } = await getTokens();

  if (!accessToken) {
    throw new Error('You are not logged in.');
  }

  const response = await fetch(
    `${API_ROOT_URL}/groups/${groupId}/contributions`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to load contributions.',
    );
  }

  return result;
}

export async function getCurrentCycle(groupId: string) {
  const { accessToken } = await getTokens();

  if (!accessToken) {
    throw new Error('You are not logged in.');
  }

  const response = await fetch(
    `${API_ROOT_URL}/groups/${groupId}/cycles/current`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const result = await response.json();

  // The backend uses 404 specifically when this group has no active cycle.
  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to load current cycle.',
    );
  }

  return result;
}

export async function getContributionDetails(
  contributionId: string,
) {
  const { accessToken } = await getTokens();

  if (!accessToken) {
    throw new Error('You are not logged in.');
  }

  const response = await fetch(
    `${API_ROOT_URL}/contributions/${contributionId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to load contribution details.',
    );
  }

  return result;
}

export async function reviewPaymentEvidence(
  evidenceId: string,
  decision: 'APPROVED' | 'REJECTED',
  reviewNote?: string,
) {
  const { accessToken } = await getTokens();

  if (!accessToken) {
    throw new Error('You are not logged in.');
  }

  const response = await fetch(
    `${API_ROOT_URL}/evidence/${evidenceId}/review`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        decision,
        ...(reviewNote ? { reviewNote } : {}),
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to review payment evidence.',
    );
  }

  return result;
}
