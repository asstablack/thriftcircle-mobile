import { useState } from 'react';
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { joinGroupStyles as styles } from '@/styles/joinGroupStyles';
import { colors } from '@/constants/color';
import { joinGroup } from '@/services/groupApi';

export default function JoinGroupScreen() {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) {
      Alert.alert(
        'Required field',
        'Please enter the group invite code.',
      );
      return;
    }

    try {
      setLoading(true);

      await joinGroup({
        inviteCode: inviteCode.trim().toUpperCase(),
      });

      Alert.alert(
        'Group Joined',
        'You have successfully joined the savings group.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/group-selection'),
          },
        ],
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to join the group. Please try again.';

      Alert.alert('Join Group Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Join a Group</Text>

        <Text style={styles.subtitle}>
          Enter the invite code shared with you to join a savings group.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Invite Code</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. A1B2C3"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="characters"
            autoCorrect={false}
            value={inviteCode}
            onChangeText={setInviteCode}
          />

          <Pressable
            style={[
              styles.joinButton,
              loading && styles.joinButtonDisabled,
            ]}
            onPress={handleJoinGroup}
            disabled={loading}
          >
            <Text style={styles.joinButtonText}>
              {loading ? 'Joining...' : 'Join Group'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}