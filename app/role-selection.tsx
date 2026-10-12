import { goBackOrReplace } from '@/utils/navigation';
import { FigmaIcon } from '@/components/figma-icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { roleSelectionStyles as styles } from '@/styles/roleSelectionStyles';

export default function RoleSelectionScreen() {
  const selectedRole = useAuthStore(
    (state) => state.selectedRole,
  );

  const setRole = useAuthStore((state) => state.setRole);

  const handleContinue = () => {
    if (!selectedRole) {
      return;
    }

    router.push('/register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => goBackOrReplace('/welcome')}
        >
          <FigmaIcon name="back" size="medium" />
        </Pressable>

        <Image
          source={require('@/assets/figma/ec34e.png')}
          style={styles.logo}
          contentFit="contain"
        />

        <Text style={styles.title}>Choose a role</Text>

        <Text style={styles.subtitle}>
          Select how you want to use ThriftCircle.
        </Text>

        {/* Organizer */}
        <Pressable
          style={[
            styles.roleCard,
            selectedRole === 'organizer' &&
              styles.roleCardSelected,
          ]}
          accessibilityRole="radio"
          accessibilityState={{
            checked: selectedRole === 'organizer',
          }}
          onPress={() => setRole('organizer')}
        >
          <View style={styles.roleIcon}>
            <FigmaIcon name="organizer" size="large" />
          </View>

          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Organizer</Text>

            <Text style={styles.roleDescription}>
              Create and manage savings groups, invite
              members, and track contributions.
            </Text>
          </View>

          <View
            style={[
              styles.radio,
              selectedRole === 'organizer' &&
                styles.radioSelected,
            ]}
          >
            {selectedRole === 'organizer' && (
              <View style={styles.radioDot} />
            )}
          </View>
        </Pressable>

        {/* Member */}
        <Pressable
          style={[
            styles.roleCard,
            selectedRole === 'member' &&
              styles.roleCardSelected,
          ]}
          accessibilityRole="radio"
          accessibilityState={{
            checked: selectedRole === 'member',
          }}
          onPress={() => setRole('member')}
        >
          <View style={styles.roleIcon}>
            <FigmaIcon name="member" size="large" />
          </View>

          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Member</Text>

            <Text style={styles.roleDescription}>
              Join a savings group, make contributions, and
              track your progress.
            </Text>
          </View>

          <View
            style={[
              styles.radio,
              selectedRole === 'member' &&
                styles.radioSelected,
            ]}
          >
            {selectedRole === 'member' && (
              <View style={styles.radioDot} />
            )}
          </View>
        </Pressable>

        <Pressable
          style={[
            styles.continueButton,
            !selectedRole && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedRole}
        >
          <Text style={styles.continueText}>Continue</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
