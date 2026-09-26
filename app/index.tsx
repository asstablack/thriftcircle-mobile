 import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { welcomeStyles } from '@/styles/welcomeStyles';

export default function WelcomeScreen() {
  return (
    <View style={welcomeStyles.container}>
      
              <View style={welcomeStyles.content}>
        <Text style={welcomeStyles.title}>
          Welcome to ThriftCircle
        </Text>

        <Text style={welcomeStyles.subtitle}>
          Save together. Grow together.
        </Text>

        <View style={welcomeStyles.actionGrid}>
          <Pressable
            style={welcomeStyles.primaryButton}
            onPress={() => router.push('/register')}
          >
            <Text style={welcomeStyles.primaryButtonText}>
              Create Account
            </Text>
          </Pressable>

          <Pressable
            style={welcomeStyles.secondaryButton}
            onPress={() => router.push('/login')}
          >
            <Text style={welcomeStyles.secondaryButtonText}>
              Log In
            </Text>
          </Pressable>

          <Pressable style={welcomeStyles.organizerButton}>
            <Text style={welcomeStyles.organizerButtonText}>
              Organizer
            </Text>
          </Pressable>

          <Pressable style={welcomeStyles.memberButton}>
            <Text style={welcomeStyles.memberButtonText}>
              Member
            </Text>
          </Pressable>
      </View>

        </View>
      </View>
  
  );
}