import { useState } from 'react';
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import {
  resetVerificationStyles as styles,
} from '@/styles/resetVerificationStyles';
import { colors } from '@/constants/color';

export default function ResetVerification() {
  const { identifier } =
    useLocalSearchParams<{
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
          Check your email
        </Text>

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
            Didn't receive the code?
          </Text>

          <Pressable>
            <Text style={styles.resendLink}>
              Resend
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}