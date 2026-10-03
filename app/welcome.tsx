import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { welcomeStyles as styles } from '@/styles/welcomeStyles';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/thrift-circle-logo-stacked.png')}
          style={styles.logo}
          contentFit="contain"
        />

        <Image
          source={require('@/assets/images/thrift-circle-welcome.png')}
          style={styles.illustration}
          contentFit="contain"
        />

        <Text style={styles.title}>
          Save Together
        </Text>

        <Text style={styles.titleAccent}>
          Grow Together
        </Text>

        <Text style={styles.description}>
          Create or join trusted savings groups, track
          contributions, and stay on top of every cycle.
        </Text>

        <View style={styles.actions}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push('/role-selection')}
          >
            <Text style={styles.primaryButtonText}>
              Get Started
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.secondaryButtonText}>
              Log In
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}