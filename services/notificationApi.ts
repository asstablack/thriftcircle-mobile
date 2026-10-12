import { API_ROOT_URL } from '@/config/api';
import { getTokens } from '@/services/authStorage';

export type AppNotification = {
  _id: string;
  type?: string;
  relatedModel?: string;
  relatedId?: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};
export type NotificationPage = {
  notifications: AppNotification[];
  page: number;
  total: number;
  unreadCount: number;
};

async function notificationRequest(
  path: string,
  method = 'GET',
) {
  const { accessToken } = await getTokens();
  if (!accessToken)
    throw new Error('You are not logged in.');
  const response = await fetch(
    API_ROOT_URL + '/notifications' + path,
    {
      method,
      headers: { Authorization: 'Bearer ' + accessToken },
    },
  );
  const result = await response.json();
  if (!response.ok)
    throw new Error(
      result.message || 'Unable to load notifications.',
    );
  return result;
}
export function getNotifications(
  page = 1,
): Promise<NotificationPage> {
  return notificationRequest('?page=' + page + '&limit=20');
}
export function markNotificationRead(
  id: string,
): Promise<AppNotification> {
  return notificationRequest(
    '/' + encodeURIComponent(id) + '/read',
    'PATCH',
  );
}

export function markAllNotificationsRead(): Promise<{
  updated: number;
}> {
  return notificationRequest('/read-all', 'PATCH');
}
