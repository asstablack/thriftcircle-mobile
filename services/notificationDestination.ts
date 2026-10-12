import type { AppNotification } from './notificationApi';
import {
  getContributionDetails,
  getGroupDetails,
} from './groupApi';

// Resolve only IDs whose type is explicit; never treat evidence/payout IDs as group IDs.
export async function notificationDestination(
  item: AppNotification,
) {
  if (
    !item.relatedId ||
    !['Group', 'Contribution'].includes(
      item.relatedModel ?? '',
    )
  )
    return null;
  const contribution =
    item.relatedModel === 'Contribution'
      ? await getContributionDetails(item.relatedId)
      : null;
  const groupId = contribution
    ? contribution.groupId
    : item.relatedId;
  if (typeof groupId !== 'string' || !groupId)
    throw new Error('This update has no available group.');
  const details = await getGroupDetails(groupId);
  if (!['member', 'organizer'].includes(details.callerRole))
    throw new Error(
      'You no longer have access to this group.',
    );
  return {
    group: {
      id: groupId,
      groupName: details.group.groupName as string,
      role: details.callerRole as 'member' | 'organizer',
    },
    href: contribution
      ? {
          pathname: '/contribution-review' as const,
          params: { contributionId: item.relatedId },
        }
      : {
          pathname:
            item.type === 'GROUP_JOIN_REQUEST' &&
            details.callerRole === 'organizer'
              ? ('/join-requests' as const)
              : ('/group-details' as const),
        },
  };
}
