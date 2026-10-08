import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { newPasswordStyles as styles } from '@/styles/newPasswordStyles';
import { colors } from '@/constants/color';
import { resetPassword } from '@/services/authApi';

export default function NewPassword() {
  const { identifier, code } = useLocalSearchParams<{
    identifier?: string;
    code?: string;
  }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!identifier || !code) {
      Alert.alert(
        'Reset information missing',
        'Please restart the password reset process.',
      );
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert(
        'Required fields',
        'Please fill in both password fields.',
      );
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        'Password too short',
        'Password must be at least 8 characters.',
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Password mismatch',
        'Passwords do not match.',
      );
      return;
    }

    try {
      setLoading(true);

      const isEmail = identifier.includes('@');

      await resetPassword(
        isEmail
          ? {
              email: identifier,
              resetCode: code,
              newPassword: password,
            }
          : {
              phoneNumber: identifier,
              resetCode: code,
              newPassword: password,
            },
      );

      Alert.alert(
        'Password updated',
        'Your password has been updated successfully.',
        [
          {
            text: 'Log In',
            onPress: () => router.replace('/login'),
          },
        ],
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.';

      Alert.alert('Reset failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹ Back</Text>
          </Pressable>

          <Image
            source={require('@/assets/images/thrift-circle-logo-stacked.png')}
            style={styles.logo}
            contentFit="contain"
          />

          <Text style={styles.title}>Reset Password</Text>

          <Text style={styles.subtitle}>
            Create a new password for your ThriftCircle account.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>New Password</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your new password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />

              <Pressable
                style={styles.eyeButton}
                accessibilityRole="button"
                accessibilityLabel="Toggle password visibility"
                hitSlop={10}
                onPress={() =>
                  setPasswordVisible(!passwordVisible)
                }
              >
                <Feather
                  name={passwordVisible ? 'eye-off' : 'eye'}
                  size={19}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>

            <Text style={styles.helperText}>
              Use at least 8 characters
            </Text>

            <Text style={styles.label}>
              Confirm New Password
            </Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your new password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!confirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <Pressable
                style={styles.eyeButton}
                accessibilityRole="button"
                accessibilityLabel="Toggle password visibility"
                hitSlop={10}
                onPress={() =>
                  setConfirmPasswordVisible(
                    !confirmPasswordVisible,
                  )
                }
              >
                <Feather
                  name={
                    confirmPasswordVisible ? 'eye-off' : 'eye'
                  }
                  size={19}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>

            <Pressable
              style={[
                styles.resetButton,
                loading && styles.resetButtonDisabled,
              ]}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text style={styles.resetButtonText}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
