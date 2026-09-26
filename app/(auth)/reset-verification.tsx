 import { View, Text, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { resetVerificationStyles } from '@/styles/resetVerificationStyles';

export default function ResetVerification() {
  return (
    <View style={resetVerificationStyles.container}>
 

      <View style={resetVerificationStyles.card}>
        <Text style={resetVerificationStyles.cardTitle}>
          Verify your account
        </Text>

        <Text style={resetVerificationStyles.label}>
          Verification Code
        </Text>

        <TextInput
          style={resetVerificationStyles.input}
          placeholder="Enter verification code"
          placeholderTextColor="#6B7280"
          keyboardType="number-pad"
        />

        <Pressable
          style={resetVerificationStyles.verifyButton}
          onPress={() => router.push('/new-password')}
        >
          <Text style={resetVerificationStyles.verifyButtonText}>
            Verify
          </Text>
        </Pressable>

        <Pressable
          style={resetVerificationStyles.backButton}
          onPress={() => router.back()}
        >
          <Text style={resetVerificationStyles.backButtonText}>
            Back
          </Text>
        </Pressable>
      </View>
    </View>
  );
}