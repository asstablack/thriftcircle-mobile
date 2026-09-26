import { View, Text, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { newPasswordStyles } from '@/styles/newPasswordStyles';

export default function NewPassword() {
  return (
    <View style={newPasswordStyles.container}>
 

      <View style={newPasswordStyles.card}>
        <Text style={newPasswordStyles.cardTitle}>
          Set a new password
        </Text>

        <Text style={newPasswordStyles.label}>
          New Password
        </Text>

        <TextInput
          style={newPasswordStyles.input}
          placeholder="Enter your new password"
          placeholderTextColor="#6B7280"
          secureTextEntry
        />

        <Text style={newPasswordStyles.label}>
          Confirm Password
        </Text>

        <TextInput
          style={newPasswordStyles.input}
          placeholder="Confirm your new password"
          placeholderTextColor="#6B7280"
          secureTextEntry
        />

        <Pressable style={newPasswordStyles.resetButton}>
          <Text style={newPasswordStyles.resetButtonText}>
            Reset Password
          </Text>
        </Pressable>

        <Pressable
          style={newPasswordStyles.backButton}
          onPress={() => router.back()}
        >
          {/* <Text style={newPasswordStyles.backButtonText}>
            Back
          </Text> */}
        </Pressable>
      </View>
    </View>
  );
}