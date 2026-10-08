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
import { router } from 'expo-router';
import { loginStyles as styles } from '@/styles/loginStyles';
import { colors } from '@/constants/color';
import { login } from '@/services/authApi';
import { saveTokens } from '@/services/authStorage';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      Alert.alert(
        'Required fields',
        'Please enter your email/phone number and password.',
      );
      return;
    }

    try {
      setLoading(true);

      const isEmail = identifier.includes('@');

      const result = await login(
        isEmail
          ? {
              email: identifier.trim(),
              password,
            }
          : {
              phoneNumber: identifier.trim(),
              password,
            },
      );

      await saveTokens(result.accessToken, result.refreshToken);

      setUser(result.user);

      router.replace('/group-selection');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.';

      Alert.alert('Login failed', message);
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

          <Text style={styles.title}>Welcome back</Text>

          <Text style={styles.subtitle}>
            Log in to your ThriftCircle account.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email Address</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email or phone number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={identifier}
              onChangeText={setIdentifier}
            />

            <Text style={styles.label}>Password</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
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

            <Pressable
              style={styles.forgotButton}
              onPress={() => router.push('/forgot-password')}
            >
              <Text style={styles.forgotPassword}>
                Forgot Password?
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Logging in...' : 'Log In'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>
              Don&apos;t have an account?
            </Text>

            <Pressable
              onPress={() => router.replace('/register')}
            >
              <Text style={styles.registerLink}>Sign Up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
