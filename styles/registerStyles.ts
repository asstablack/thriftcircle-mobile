import { colors } from '@/constants/color';
import { StyleSheet } from 'react-native';

export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 24,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 14,
  },

  placeholder: {
    color: colors.textSecondary,
  },

  registerButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 28,
  },

  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },

  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  loginText: {
    fontSize: 14,
    color: colors.textPrimary,
  },

  loginLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
});