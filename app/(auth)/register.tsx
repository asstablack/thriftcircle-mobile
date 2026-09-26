import { Text, TextInput, View, Pressable } from 'react-native';
import { registerStyles } from '@/styles/registerStyles';
import { router } from 'expo-router';

export default function RegisterScreen() {
  return (
    <View style={registerStyles.container}>
      <Text style={registerStyles.title}>Create An Account</Text>

      <TextInput
        style={registerStyles.input}
        placeholder="Enter your full name"
        placeholderTextColor={registerStyles.placeholder.color}
      />

      <TextInput
        style={registerStyles.input}
        placeholder="Enter your email"
        placeholderTextColor={registerStyles.placeholder.color}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={registerStyles.input}
        placeholder="Enter your phone number"
        placeholderTextColor={registerStyles.placeholder.color}
        keyboardType="phone-pad"
      />

      <TextInput
        style={registerStyles.input}
        placeholder="Enter your password"
        placeholderTextColor={registerStyles.placeholder.color}
        secureTextEntry
      />

      <TextInput
        style={registerStyles.input}
        placeholder="Confirm password"
        placeholderTextColor={registerStyles.placeholder.color}
        secureTextEntry
      />

      <Pressable style={registerStyles.registerButton}>
        <Text style={registerStyles.registerButtonText}>
          Create Account
        </Text>
      </Pressable>

      <View style={registerStyles.loginRow}>
        <Text style={registerStyles.loginText}>
          Already have an account?
        </Text>

        <Pressable onPress={() => router.back()}>
          <Text style={registerStyles.loginLink}>
            Login
          </Text>
        </Pressable>
      </View>
    </View>
  );
}