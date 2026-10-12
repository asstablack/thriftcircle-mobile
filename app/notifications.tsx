import { GroupScreenHeader } from '@/components/group-screen-header';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { router, Stack, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrganizerBottomNavigation } from '@/components/organizer-chrome';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type AppNotification,
} from '@/services/notificationApi';
import { memberDashboardStyles as styles } from '@/styles/memberDashboardStyles';
import { notificationDestination } from '@/services/notificationDestination';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/color';

export default function NotificationsScreen() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const opening = useRef(false);
  const version = useRef(0);
  const loadingMore = useRef(false);

  useFocusEffect(
    useCallback(() => {
      const current = ++version.current;
      setLoading(true);
      setError(null);
      getNotifications()
        .then((result) => {
          if (version.current !== current) return;
          setItems(result.notifications);
          setPage(1);
          setTotal(result.total);
          setUnread(result.unreadCount);
        })
        .catch((reason: unknown) => {
          if (version.current === current)
            setError(
              reason instanceof Error
                ? reason.message
                : 'Unable to load notifications.',
            );
        })
        .finally(() => {
          if (version.current === current)
            setLoading(false);
        });
      return () => {
        version.current++;
      };
      // Reload retries the same feed.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload]),
  );

  const loadMore = async () => {
    if (loadingMore.current || opening.current || loading)
      return;
    loadingMore.current = true;
    setBusyId('more');
    setError(null);
    const current = version.current;
    try {
      const result = await getNotifications(page + 1);
      if (current !== version.current) return;
      setItems((previous) => [
        ...previous,
        ...result.notifications.filter(
          (item) =>
            !previous.some((old) => old._id === item._id),
        ),
      ]);
      setPage(result.page);
      setTotal(result.total);
      setUnread(result.unreadCount);
    } catch (reason) {
      if (current === version.current)
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load more notifications.',
        );
    } finally {
      loadingMore.current = false;
      setBusyId(null);
    }
  };
  const markAll = async () => {
    if (
      opening.current ||
      loadingMore.current ||
      loading ||
      unread === 0
    )
      return;
    opening.current = true;
    const current = version.current;
    setBusyId('all');
    setError(null);
    try {
      await markAllNotificationsRead();
      if (current !== version.current) return;
      setItems((previous) =>
        previous.map((item) => ({ ...item, isRead: true })),
      );
      setUnread(0);
      setReload((value) => value + 1);
    } catch (reason) {
      if (current === version.current)
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to mark notifications as read.',
        );
    } finally {
      opening.current = false;
      setBusyId(null);
    }
  };
  const openNotification = async (
    item: AppNotification,
  ) => {
    if (opening.current || loadingMore.current || loading)
      return;
    opening.current = true;
    const current = version.current;
    setBusyId(item._id);
    setError(null);
    try {
      const destination =
        await notificationDestination(item);
      if (current !== version.current) return;
      if (!item.isRead) {
        const updated = await markNotificationRead(
          item._id,
        );
        if (current !== version.current) return;
        setUnread((count) => Math.max(0, count - 1));
        setItems((previous) =>
          previous.map((entry) =>
            entry._id === updated._id ? updated : entry,
          ),
        );
      }
      if (destination) {
        useAuthStore
          .getState()
          .setSelectedGroup(destination.group);
        router.push(destination.href);
      }
    } catch (reason) {
      if (current === version.current)
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to open this update.',
        );
    } finally {
      opening.current = false;
      setBusyId(null);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <GroupScreenHeader
        variant="plain"
        title="Notifications"
        subtitle="Stay up to date with your savings circle."
      />
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            {error && (
              <View style={styles.stateCard}>
                <Text
                  accessibilityRole="alert"
                  style={styles.secondaryText}
                >
                  {error}
                </Text>
                <Pressable
                  onPress={() =>
                    setReload((value) => value + 1)
                  }
                >
                  <Text style={styles.linkText}>
                    Try Again
                  </Text>
                </Pressable>
              </View>
            )}
            {!error && !items.length && (
              <View style={styles.stateCard}>
                <Text style={styles.heading}>
                  You are all caught up
                </Text>
                <Text style={styles.secondaryText}>
                  Your group updates will appear here.
                </Text>
              </View>
            )}
            <Text style={styles.secondaryText}>
              {unread} unread notifications
            </Text>
            {unread > 0 && (
              <Pressable
                accessibilityRole="button"
                disabled={!!busyId || !!error}
                onPress={() => void markAll()}
              >
                <Text style={styles.linkText}>
                  {busyId === 'all'
                    ? 'Updating…'
                    : 'Mark all as read'}
                </Text>
              </Pressable>
            )}
            {items.map((item) => (
              <Pressable
                key={item._id}
                style={styles.paymentCard}
                onPress={() => void openNotification(item)}
                disabled={
                  !!busyId ||
                  (item.isRead &&
                    !['Group', 'Contribution'].includes(
                      item.relatedModel ?? '',
                    ))
                }
                accessibilityRole="button"
                accessibilityLabel={
                  item.title +
                  (item.isRead
                    ? ', open update'
                    : ', open and mark as read')
                }
              >
                <View style={styles.headerName}>
                  <Text style={styles.name}>
                    {item.title}
                  </Text>
                  <Text style={styles.secondaryText}>
                    {item.message}
                  </Text>
                  <Text style={styles.secondaryText}>
                    {new Date(
                      item.createdAt,
                    ).toLocaleString('en-NG')}
                  </Text>
                  {!item.isRead && (
                    <Text style={styles.linkText}>
                      {busyId === item._id
                        ? 'Updating…'
                        : [
                              'Group',
                              'Contribution',
                            ].includes(
                              item.relatedModel ?? '',
                            )
                          ? 'Open update'
                          : 'Mark as read'}
                    </Text>
                  )}
                </View>
              </Pressable>
            ))}
            {items.length < total && (
              <Pressable
                style={styles.retryButton}
                disabled={!!busyId}
                onPress={() => void loadMore()}
              >
                <Text style={styles.whiteText}>
                  {busyId === 'more'
                    ? 'Loading…'
                    : 'Load more'}
                </Text>
              </Pressable>
            )}
          </>
        )}
      </ScrollView>
      <OrganizerBottomNavigation active="Activity" />
    </SafeAreaView>
  );
}
