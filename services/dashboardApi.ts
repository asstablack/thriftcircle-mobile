import { API_ROOT_URL } from '@/config/api';
import { getTokens } from '@/services/authStorage';

export type DashboardContribution = {
  _id: string;
  memberId: string;
  amount: number;
  dueDate: string;
  status:
    'DUE' | 'OVERDUE' | 'PENDING_REVIEW' | 'CONFIRMED' | 'ISSUE';
};

export type CycleProgress = {
  cycleNumber: number;
  cycleStatus: 'ACTIVE' | 'PAYOUT_PHASE' | 'COMPLETED';
  confirmed: number;
  total: number;
};

export type MemberDashboardData = {
  currentContribution: DashboardContribution | null;
  confirmedCount: number;
  outstandingCount: number;
  payoutOrder: number | null;
  isNextRecipient: boolean;
  cycleProgress: CycleProgress | null;
};

export type OrganizerDashboardData = {
  memberCount: number;
  currentCycle: (CycleProgress & { recipientId: string }) | null;
  confirmedContributions: number;
  outstandingContributions: number;
  awaitingVerification: number;
  paymentIssues: number;
};

async function getDashboard<T>(
  groupId: string,
  role: 'organizer' | 'member',
): Promise<T> {
  const { accessToken } = await getTokens();
  if (!accessToken) {
    throw new Error('You are not logged in.');
  }
  const response = await fetch(
    API_ROOT_URL +
      '/groups/' +
      encodeURIComponent(groupId) +
      '/dashboard/' +
      role,
    {
      headers: { Authorization: 'Bearer ' + accessToken },
    },
  );
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message || 'Unable to load dashboard summary.',
    );
  }
  return result;
}

export function getMemberDashboard(groupId: string) {
  return getDashboard<MemberDashboardData>(groupId, 'member');
}

export function getOrganizerDashboard(groupId: string) {
  return getDashboard<OrganizerDashboardData>(
    groupId,
    'organizer',
  );
}
