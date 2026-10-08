import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Stack, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  OrganizerHeader,
  OrganizerBottomNavigation,
} from '@/components/organizer-chrome';
import {
  getNotifications,
  markNotificationRead,
  type AppNotification,
} from '@/services/notificationApi';
import { memberDashboardStyles as styles } from '@/styles/memberDashboardStyles';
import { colors } from '@/constants/color';

export default function NotificationsScreen() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
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
          if (version.current === current) setLoading(false);
        });
      return () => {
        version.current++;
      };
      // Reload retries the same feed.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload]),
  );

  const loadMore = async () => {
    if (loadingMore.current) return;
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
  const markRead = async (item: AppNotification) => {
    if (item.isRead || busyId) return;
    setBusyId(item._id);
    try {
      const updated = await markNotificationRead(item._id);
      setItems((previous) =>
        previous.map((entry) =>
          entry._id === updated._id ? updated : entry,
        ),
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to mark notification as read.',
      );
    } finally {
      setBusyId(null);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <OrganizerHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.historyHeading}>
          <Text style={styles.groupName}>Notifications</Text>
        </View>
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
                  onPress={() => setReload((value) => value + 1)}
                >
                  <Text style={styles.linkText}>Try Again</Text>
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
            {items.map((item) => (
              <Pressable
                key={item._id}
                style={styles.paymentCard}
                onPress={() => void markRead(item)}
                disabled={!!busyId || item.isRead}
                accessibilityLabel={
                  item.title +
                  (item.isRead ? ', read' : ', mark as read')
                }
              >
                <View style={styles.headerName}>
                  <Text style={styles.name}>{item.title}</Text>
                  <Text style={styles.secondaryText}>
                    {item.message}
                  </Text>
                  <Text style={styles.secondaryText}>
                    {new Date(item.createdAt).toLocaleString(
                      'en-NG',
                    )}
                  </Text>
                  {!item.isRead && (
                    <Text style={styles.linkText}>
                      {busyId === item._id
                        ? 'Updating…'
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
                  {busyId === 'more' ? 'Loading…' : 'Load more'}
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
