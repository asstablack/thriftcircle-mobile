import { goBackOrReplace } from '@/utils/navigation';
import { FigmaIcon } from '@/components/figma-icon';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
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
  const [confirmPassword, setConfirmPassword] =
    useState('');
  const [passwordVisible, setPasswordVisible] =
    useState(false);
  const [
    confirmPasswordVisible,
    setConfirmPasswordVisible,
  ] = useState(false);
  const [completed, setCompleted] = useState(false);
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

      setCompleted(true);
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
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={() =>
              goBackOrReplace('/forgot-password')
            }
          >
            <FigmaIcon name="back" size="small" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Image
            source={require('@/assets/figma/ec34e.png')}
            style={styles.logo}
            contentFit="contain"
          />

          <Text style={styles.title}>Reset Password</Text>

          <Text style={styles.subtitle}>
            Create a new password for your ThriftCircle
            account.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>New Password</Text>

            <View style={[styles.passwordContainer, styles.firstPasswordContainer]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your new password"
                placeholderTextColor={colors.textDisabled}
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
                  size={20}
                  color={colors.primary}
                />
              </Pressable>
            </View>

<Text style={styles.label}>
              Confirm New Password
            </Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your new password"
                placeholderTextColor={colors.textDisabled}
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
                    confirmPasswordVisible
                      ? 'eye-off'
                      : 'eye'
                  }
                  size={20}
                  color={colors.primary}
                />
              </Pressable>
            </View>
            <Text style={styles.helperText}>Use at least 8 characters</Text>


            <Pressable
              style={[
                styles.resetButton,
                loading && styles.resetButtonDisabled,
              ]}
              accessibilityRole="button"
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text style={styles.resetButtonText}>
                {loading
                  ? 'Resetting...'
                  : 'Reset Password'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal visible={completed} transparent animationType="fade" onRequestClose={() => router.replace('/login')}>
        <View style={styles.modalOverlay}>
          <View style={styles.successCard} accessibilityViewIsModal>
            <Text style={styles.successTitle}>Password updated</Text>
            <Text style={styles.successMessage}>Your password has been reset successfully.</Text>
            <Pressable accessibilityRole="button" style={styles.resetButton} onPress={() => router.replace('/login')}>
              <Text style={styles.resetButtonText}>Back to Log In</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
