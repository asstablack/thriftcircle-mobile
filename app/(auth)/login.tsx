import { Text, TextInput, View, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { loginStyles } from '@/styles/loginStyles';
import { colors } from '@/constants/color';

export default function LoginScreen() {
  return (
    <View style={loginStyles.container}>

      <View style={loginStyles.pageHeader}>
     

       
      </View>

      <View style={loginStyles.card}>

        <Text style={loginStyles.cardTitle}>
          Welcome back
        </Text>

        <View style={loginStyles.form}>

          <Text style={loginStyles.label}>
            Email or Phone Number
          </Text>

          <TextInput
            style={loginStyles.input}
            placeholder="Enter your email or phone number"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
          />

          <Text style={loginStyles.label}>
            Password
          </Text>

          <TextInput
            style={loginStyles.input}
            placeholder="Enter your password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
          />

          <Pressable
            style={loginStyles.forgotButton}
            onPress={() => router.push('/forgot-password')}
          >
            <Text style={loginStyles.forgotPassword}>
              Forgot Password?
            </Text>
          </Pressable>

          <Pressable style={loginStyles.loginButton}>
            <Text style={loginStyles.loginButtonText}>
              Log In
            </Text>
          </Pressable>

          {/* Temporary UI example
          <Text style={loginStyles.errorText}>
            Error: Invalid email or password.
          </Text> */}

        </View>
      </View>

      <View style={loginStyles.registerRow}>
        <Text style={loginStyles.registerText}>
          Don't have an account?
        </Text>

        <Link
          href="/register"
          style={loginStyles.registerLink}
        >
          Signup
        </Link>
      </View>

    </View>
  );
}