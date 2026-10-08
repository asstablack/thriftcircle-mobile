import { SafeAreaView } from 'react-native-safe-area-context';
import { GroupScreenHeader } from '@/components/group-screen-header';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { router, useFocusEffect } from 'expo-router';
import { getMyGroups } from '@/services/groupApi';
import { inviteMembersStyles as styles } from '@/styles/inviteMembersStyles';
import { colors } from '@/constants/color';

type Group = {
  _id: string;
  groupName: string;
  contributionAmount: number;
  frequency: string;
  inviteCode: string;
  role: 'organizer' | 'member';
};

export default function InviteMembersScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] =
    useState<Group | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestVersion = useRef(0);
  const [loading, setLoading] = useState(true);

  const loadGroups = useCallback(async () => {
    const version = ++requestVersion.current;
    try {
      setLoading(true);
      setError(null);

      const result = await getMyGroups();
      if (version !== requestVersion.current) return;

      const organizerGroups = result.filter(
        (group: Group) => group.role === 'organizer',
      );

      setGroups(organizerGroups);

      setSelectedGroup(
        (previous) =>
          organizerGroups.find(
            (group: Group) => group._id === previous?._id,
          ) ||
          (organizerGroups.length === 1
            ? organizerGroups[0]
            : null),
      );
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

  const handleCopyCode = async () => {
    if (!selectedGroup) return;

    await Clipboard.setStringAsync(selectedGroup.inviteCode);

    Alert.alert(
      'Copied',
      'The invite code has been copied to your clipboard.',
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GroupScreenHeader
        title="Invite Members"
        subtitle="Share your group code with the people you want to invite."
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
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
            <Text style={styles.emptyTitle}>
              No organizer groups
            </Text>

            <Text style={styles.emptyText}>
              You need to create a group before you can invite
              members.
            </Text>

            <Pressable
              style={styles.createButton}
              onPress={() => router.push('/create-group')}
            >
              <Text style={styles.createButtonText}>
                Create a Group
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              Select a Group
            </Text>

            {groups.map((group) => (
              <Pressable
                key={group._id}
                style={[
                  styles.groupCard,
                  selectedGroup?._id === group._id &&
                    styles.groupCardSelected,
                ]}
                onPress={() => setSelectedGroup(group)}
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

                {selectedGroup?._id === group._id && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>
            ))}

            {selectedGroup && (
              <View style={styles.inviteCard}>
                <Text style={styles.inviteLabel}>
                  Invite Code
                </Text>

                <Text style={styles.inviteDescription}>
                  Share this code with members so they can join
                  this group.
                </Text>

                <View style={styles.codeBox}>
                  <Text style={styles.inviteCode}>
                    {selectedGroup.inviteCode}
                  </Text>
                </View>

                <Pressable
                  style={styles.copyButton}
                  onPress={handleCopyCode}
                >
                  <Text style={styles.copyButtonText}>
                    Copy Invite Code
                  </Text>
                </Pressable>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
