import { SafeAreaView } from 'react-native-safe-area-context';
import { GroupScreenHeader } from '@/components/group-screen-header';
import { getMyGroups } from '@/services/groupApi';
import { useAuthStore } from '@/store/authStore';
import { groupSelectionStyles as styles } from '@/styles/groupSelectionStyles';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

type Group = {
  _id: string;
  groupName: string;
  contributionAmount: number;
  frequency: string;
  startDate: string;
  contributionDeadline: string;
  inviteCode: string;
  status: string;
  role: 'organizer' | 'member';
  joinedAt: string;
};

export default function GroupSelectionScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [error, setError] = useState<string | null>(null);
  const requestVersion = useRef(0);
  const [loading, setLoading] = useState(true);
  const { setSelectedGroup } = useAuthStore();

  const loadGroups = useCallback(async () => {
    const version = ++requestVersion.current;
    try {
      setLoading(true);
      setError(null);

      const result = await getMyGroups();
      if (version !== requestVersion.current) return;

      setGroups(result);
    } catch (error) {
      if (version !== requestVersion.current) return;
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load your groups.';

      setError(message);
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadGroups();
      return () => {
        requestVersion.current++;
      };
    }, [loadGroups]),
  );

  const handleGroupPress = (group: Group) => {
    setSelectedGroup({
      id: group._id,
      groupName: group.groupName,
      role: group.role,
    });

    if (group.role === 'organizer') {
      router.replace('/organizer-dashboard');
    } else if (group.role === 'member') {
      router.replace('/member-dashboard');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GroupScreenHeader
        title="My Groups"
        subtitle="Select a group to continue."
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.emptyTitle}>
            My profile and logout
          </Text>
        </Pressable>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={styles.loadingColor.color}
            />

            <Text style={styles.loadingText}>
              Loading your groups...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Text
              accessibilityRole="alert"
              style={styles.emptyText}
            >
              {error}
            </Text>
            <Pressable onPress={() => void loadGroups()}>
              <Text style={styles.emptyTitle}>Try Again</Text>
            </Pressable>
          </View>
        ) : groups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No groups yet</Text>

            <Text style={styles.emptyText}>
              You don&apos;t belong to any groups yet. Create a
              group or join one using an invite code.
            </Text>
          </View>
        ) : (
          <View>
            {groups.map((group) => (
              <Pressable
                key={group._id}
                onPress={() => handleGroupPress(group)}
                style={styles.groupCard}
              >
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>
                    {group.groupName}
                  </Text>

                  <Text style={styles.groupDetails}>
                    ₦{group.contributionAmount.toLocaleString()}{' '}
                    • {group.frequency}
                  </Text>
                </View>

                <View
                  style={[
                    styles.roleBadge,
                    group.role === 'organizer'
                      ? styles.organizerBadge
                      : styles.memberBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.roleText,
                      group.role === 'organizer'
                        ? styles.organizerText
                        : styles.memberText,
                    ]}
                  >
                    {group.role}
                  </Text>
                </View>

                <Text style={styles.arrow}>›</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <Pressable
            style={styles.createButton}
            onPress={() => router.push('/create-group')}
          >
            <Text style={styles.createButtonText}>
              Create a Group
            </Text>
          </Pressable>

          <Pressable
            style={styles.joinButton}
            onPress={() => router.push('/join-group')}
          >
            <Text style={styles.joinButtonText}>
              Join a Group
            </Text>
          </Pressable>
          <Pressable
            style={styles.inviteButton}
            onPress={() => router.push('/invite-members')}
          >
            <Text style={styles.inviteButtonText}>
              Invite Members
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
