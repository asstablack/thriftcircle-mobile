import { goBackOrReplace } from '@/utils/navigation';
import { FigmaIcon } from '@/components/figma-icon';
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

import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { resetVerificationStyles as styles } from '@/styles/resetVerificationStyles';
import { forgotPassword } from '@/services/authApi';
import { colors } from '@/constants/color';

export default function ResetVerification() {
  const { identifier } = useLocalSearchParams<{
    identifier?: string;
  }>();

  const [verificationCode, setVerificationCode] =
    useState('');

  const [resending, setResending] = useState(false);
  const handleResend = async () => {
    if (!identifier || resending) return;
    try {
      setResending(true);
      await forgotPassword(identifier.includes('@') ? { email: identifier } : { phoneNumber: identifier });
      Alert.alert('Code sent', 'A new verification code has been sent.');
    } catch (error) {
      Alert.alert('Unable to resend', error instanceof Error ? error.message : 'Please try again.');
    } finally { setResending(false); }
  };

  const handleVerify = () => {
    if (!identifier) {
      Alert.alert(
        'Reset information missing',
        'Please restart the password reset process.',
      );
      return;
    }

    if (!verificationCode.trim()) {
      Alert.alert(
        'Required field',
        'Please enter the verification code.',
      );
      return;
    }

    if (verificationCode.trim().length !== 6) {
      Alert.alert(
        'Invalid code',
        'Please enter the 6-digit verification code.',
      );
      return;
    }

    router.push({
      pathname: '/new-password',
      params: {
        identifier,
        code: verificationCode.trim(),
      },
    });
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

          <Text style={styles.title}>{identifier?.includes('@') ? 'Check your email' : 'Check your messages'}</Text>

          <Text style={styles.subtitle}>
            Enter the verification code sent to your email
            or phone number.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>
              Verification Code
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter verification code"
              placeholderTextColor={colors.textDisabled}
              keyboardType="number-pad"
              maxLength={6}
              value={verificationCode}
              onChangeText={setVerificationCode}
            />

            <Pressable
              style={styles.verifyButton}
              accessibilityRole="button"
              onPress={handleVerify}
            >
              <Text style={styles.verifyButtonText}>
                Verify
              </Text>
            </Pressable>
          </View>

          <View style={styles.resendRow}>
            <Text style={styles.resendText}>
              Didn&apos;t receive the code?
            </Text>

            <Pressable accessibilityRole="button" disabled={resending || !identifier} onPress={handleResend}>
              <Text style={styles.resendLink}>{resending ? 'Sending...' : 'Resend Code'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
