import { getMyGroups } from '@/services/groupApi';
import { useAuthStore } from '@/store/authStore';
import { groupSelectionStyles as styles } from '@/styles/groupSelectionStyles';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View, } from 'react-native';

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
  const [loading, setLoading] = useState(true);
  const { setSelectedGroup } = useAuthStore();

  const loadGroups = async () => {
    try {
      setLoading(true);

      const result = await getMyGroups();

      setGroups(result);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load your groups.';

      Alert.alert('Unable to load groups', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

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
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>My Groups</Text>

        <Text style={styles.subtitle}>
          Select a group to continue
        </Text>

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
        ) : groups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No groups yet
            </Text>

            <Text style={styles.emptyText}>
              You don't belong to any groups yet. Create a group
              or join one using an invite code.
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
                    ₦{group.contributionAmount.toLocaleString()} •{' '}
                    {group.frequency}
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
    </View>
  );
}