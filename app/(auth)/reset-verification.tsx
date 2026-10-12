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
import { colors } from '@/constants/color';

export default function ResetVerification() {
  const { identifier } = useLocalSearchParams<{
    identifier?: string;
  }>();

  const [verificationCode, setVerificationCode] =
    useState('');

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
            <FigmaIcon name="back" size="medium" />
          </Pressable>

          <Image
            source={require('@/assets/figma/ec34e.png')}
            style={styles.logo}
            contentFit="contain"
          />

          <Text style={styles.title}>Check your email</Text>

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
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              maxLength={6}
              value={verificationCode}
              onChangeText={setVerificationCode}
            />

            <Pressable
              style={styles.verifyButton}
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

            <Pressable>
              <Text style={styles.resendLink}>Resend</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
