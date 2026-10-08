import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { welcomeStyles as styles } from '@/styles/welcomeStyles';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('@/assets/images/thriftcirlce-official-logo.png')}
          style={styles.logo}
          contentFit="contain"
        />

        <Image
          source={require('@/assets/images/thrift-circle-welcome.png')}
          style={styles.illustration}
          contentFit="contain"
        />

        <Text style={styles.title}>Save Together</Text>

        <Text style={styles.titleAccent}>Grow Together</Text>

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
      </ScrollView>
    </SafeAreaView>
  );
}
