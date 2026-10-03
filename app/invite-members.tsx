import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
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
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  const loadGroups = async () => {
    try {
      setLoading(true);

      const result = await getMyGroups();

      const organizerGroups = result.filter(
        (group: Group) => group.role === 'organizer',
      );

      setGroups(organizerGroups);

      if (organizerGroups.length === 1) {
        setSelectedGroup(organizerGroups[0]);
      }
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

  const handleCopyCode = async () => {
    if (!selectedGroup) return;

    await Clipboard.setStringAsync(selectedGroup.inviteCode);

    Alert.alert(
      'Copied',
      'The invite code has been copied to your clipboard.',
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Invite Members</Text>

        <Text style={styles.subtitle}>
          Share your group invite code with people you want to add.
        </Text>

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
        ) : groups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No organizer groups
            </Text>

            <Text style={styles.emptyText}>
              You need to create a group before you can invite members.
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
                    ₦{group.contributionAmount.toLocaleString()} •{' '}
                    {group.frequency}
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
    </View>
  );
}