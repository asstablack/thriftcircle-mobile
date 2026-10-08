import {
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '@/constants/color';
import { Feather } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { registerStyles as styles } from '@/styles/registerStyles';
import { signup } from '@/services/authApi';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSignup = async () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phoneNumber.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        'Required fields',
        'Please fill in all fields.',
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

    if (!acceptedTerms) {
      Alert.alert(
        'Terms required',
        'Please agree to the Terms of Service and Privacy Policy.',
      );
      return;
    }

    try {
      setLoading(true);

      await signup({
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password,
        confirmPassword,
      });

      Alert.alert(
        'Account Created',
        'Your account has been created successfully.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/login'),
          },
        ],
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.';

      Alert.alert('Signup failed', message);
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
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

          <Text style={styles.title}>Create your account</Text>

          <Text style={styles.subtitle}>
            Set up your ThriftCircle account to get started.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={styles.placeholder.color}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Email</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={styles.placeholder.color}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Phone Number</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor={styles.placeholder.color}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />

            <Text style={styles.label}>Password</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Create a password"
                placeholderTextColor={styles.placeholder.color}
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

            <Text style={styles.label}>Confirm Password</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                placeholderTextColor={styles.placeholder.color}
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
              style={styles.termsRow}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
            >
              <View
                style={[
                  styles.checkbox,
                  acceptedTerms && styles.checkboxChecked,
                ]}
              >
                {acceptedTerms && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>

              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text style={styles.termsLink}>
                  Privacy Policy
                </Text>
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.registerButton,
                loading && styles.registerButtonDisabled,
              ]}
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading
                  ? 'Creating Account...'
                  : 'Create Account'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <Pressable onPress={() => router.replace('/login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
