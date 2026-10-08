import { SafeAreaView } from 'react-native-safe-area-context';
import { GroupScreenHeader } from '@/components/group-screen-header';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
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
        'Request sent',
        'Your request is awaiting organizer approval. The group will appear in My Groups once approved.',
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
    <SafeAreaView style={styles.container}>
      <GroupScreenHeader
        title="Join a Group"
        subtitle="Enter the invite code shared by your organizer."
      />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
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
              {loading ? 'Sending request...' : 'Request to join'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
