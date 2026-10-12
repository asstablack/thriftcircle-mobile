import { workflowRequest } from './workflowRequest';

export type GroupRules = {
  gracePeriodDays: number;
  allowLateSubmission: boolean;
  maxMembers: number | null;
};
export function getGroupRules(groupId: string) {
  return workflowRequest<GroupRules>(
    `/groups/${encodeURIComponent(groupId)}/rules`,
  );
}
export function saveGroupRules(
  groupId: string,
  rules: GroupRules,
) {
  if (
    !Number.isInteger(rules.gracePeriodDays) ||
    rules.gracePeriodDays < 0 ||
    rules.gracePeriodDays > 30
  )
    throw new Error(
      'Grace period must be a whole number from 0 to 30.',
    );
  if (typeof rules.allowLateSubmission !== 'boolean')
    throw new Error(
      'Choose whether late submission is allowed.',
    );
  if (
    rules.maxMembers !== null &&
    (!Number.isInteger(rules.maxMembers) ||
      rules.maxMembers < 2)
  )
    throw new Error(
      'Member limit must be at least 2, or leave it blank for no limit.',
    );
  return workflowRequest<GroupRules>(
    `/groups/${encodeURIComponent(groupId)}/rules`,
    'PUT',
    rules,
  );
}
export type PaymentIssue = {
  _id: string;
  contributionId: string;
  description: string;
  status:
    | 'REPORTED'
    | 'UNDER_REVIEW'
    | 'CORRECTION_REQUIRED'
    | 'RESOLVED';
  resolutionNote: string | null;
  createdAt: string;
  updatedAt: string;
  raisedBy:
    | { _id: string; fullName: string; email?: string }
    | string
    | null;
};
export function getPaymentIssues(groupId: string) {
  return workflowRequest<PaymentIssue[]>(
    `/groups/${encodeURIComponent(groupId)}/issues`,
  );
}
export function reportPaymentIssue(
  contributionId: string,
  description: string,
) {
  if (!contributionId || !description.trim())
    throw new Error(
      'Describe the payment issue before submitting.',
    );
  return workflowRequest<PaymentIssue>(
    '/issues/report',
    'POST',
    { contributionId, description: description.trim() },
  );
}
export function updatePaymentIssue(
  id: string,
  status: 'UNDER_REVIEW' | 'CORRECTION_REQUIRED',
  resolutionNote: string,
) {
  if (
    !['UNDER_REVIEW', 'CORRECTION_REQUIRED'].includes(
      status,
    )
  )
    throw new Error(
      'Issues resolve when corrected evidence is approved.',
    );
  if (
    status === 'CORRECTION_REQUIRED' &&
    !resolutionNote.trim()
  )
    throw new Error(
      'Explain what the member needs to correct.',
    );
  return workflowRequest<PaymentIssue>(
    `/issues/${encodeURIComponent(id)}/resolve`,
    'PATCH',
    {
      status,
      ...(resolutionNote.trim()
        ? { resolutionNote: resolutionNote.trim() }
        : {}),
    },
  );
}
export type Obligation = {
  _id: string;
  memberId:
    | string
    | { _id: string; fullName: string }
    | null;
  amount: number;
  dueDate: string;
  cycleNumber: number;
  status: string;
};
export function getOutstanding(groupId: string) {
  return workflowRequest<Obligation[]>(
    `/groups/${encodeURIComponent(groupId)}/outstanding`,
  );
}
export type PayoutPosition = {
  userId: string;
  payoutOrder: number;
};
export function savePayoutOrder(
  groupId: string,
  order: PayoutPosition[],
) {
  if (
    !order.length ||
    order.some(
      (item) =>
        !item.userId ||
        !Number.isInteger(item.payoutOrder) ||
        item.payoutOrder < 1,
    ) ||
    new Set(order.map((item) => item.userId)).size !==
      order.length ||
    new Set(order.map((item) => item.payoutOrder)).size !==
      order.length
  )
    throw new Error(
      'Each member must have a unique positive payout position.',
    );
  return workflowRequest<unknown>(
    `/groups/${encodeURIComponent(groupId)}/payouts/order`,
    'PUT',
    { order },
  );
}
export type WorkflowGroup = {
  callerRole: 'organizer' | 'member';
  group: {
    _id: string;
    groupName: string;
    contributionAmount: number;
    frequency: string;
    startDate: string;
    contributionDeadline: string;
    status: string;
  };
  members: {
    _id: string;
    userId: { _id: string; fullName: string } | null;
    payoutOrder: number;
    status: string;
  }[];
};
