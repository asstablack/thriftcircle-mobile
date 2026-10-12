import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { accountStyles as styles } from '@/styles/accountStyles';
import { useAuthStore } from '@/store/authStore';

export function GroupTools() {
  const group = useAuthStore(
    (state) => state.selectedGroup,
  );
  if (!group) return null;
  return (
    <View style={styles.tools}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/group-details')}
      >
        <Text style={styles.link}>
          Group details & rules
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/group-schedule')}
      >
        <Text style={styles.link}>
          Obligations & outstanding contributions
        </Text>
      </Pressable>
      {group.role === 'organizer' && (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/payment-issues')}
        >
          <Text style={styles.link}>
            Review payment issues
          </Text>
        </Pressable>
      )}
    </View>
  );
}
