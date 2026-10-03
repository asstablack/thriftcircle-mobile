import { useState } from 'react';
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  forgotPasswordStyles as styles,
} from '@/styles/forgotPasswordStyles';
import { colors } from '@/constants/color';
import { forgotPassword } from '@/services/authApi';

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async () => {
    if (!identifier.trim()) {
      Alert.alert(
        'Required field',
        'Please enter your email or phone number.',
      );
      return;
    }

    try {
      setLoading(true);

      const isEmail = identifier.includes('@');

      await forgotPassword(
        isEmail
          ? {
              email: identifier.trim(),
            }
          : {
              phoneNumber: identifier.trim(),
            },
      );

      router.push('/reset-verification');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.';

      Alert.alert(
        'Reset request failed',
        message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
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

        <Text style={styles.title}>
          Forgot Password?
        </Text>

        <Text style={styles.subtitle}>
          Enter your email or phone number and we'll help
          you reset your password.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>
            Email Address
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email or phone number"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            value={identifier}
            onChangeText={setIdentifier}
          />

          <Pressable
            style={[
              styles.resetButton,
              loading && styles.resetButtonDisabled,
            ]}
            onPress={handleResetRequest}
            disabled={loading}
          >
            <Text style={styles.resetButtonText}>
              {loading
                ? 'Sending...'
                : 'Send Reset Link'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>
            Remember your password?
          </Text>

          <Pressable
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.loginLink}>
              Log In
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}