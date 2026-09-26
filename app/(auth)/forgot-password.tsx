import { View, Text, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { forgotPasswordStyles } from '@/styles/forgotPasswordStyles';

export default function ForgotPassword() {
  return (
    <View style={forgotPasswordStyles.container}>
 

      <View style={forgotPasswordStyles.card}>

        <Text style={forgotPasswordStyles.cardTitle}>
          Reset your password
        </Text>

        <Text style={forgotPasswordStyles.label}>
          Email or Phone Number
        </Text>

        <TextInput
          style={forgotPasswordStyles.input}
          placeholder="Enter your email or phone number"
          placeholderTextColor="#6B7280"
          autoCapitalize="none"
        />

        <Pressable style={forgotPasswordStyles.resetButton}
        
        onPress={() => router.push('/reset-verification')}>
          
          <Text style={forgotPasswordStyles.resetButtonText}>
            Continue
          </Text>
        </Pressable>

        <Pressable
          style={forgotPasswordStyles.backButton}
          onPress={() => router.back()}
        >
          <Text style={forgotPasswordStyles.backButtonText}>
            Back to Login
          </Text>
        </Pressable>

      </View>

    </View>
  );
}