import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const forgotPasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 30,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 100,
  },

  backText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  logo: {
    width: 110,
    height: 82,
    alignSelf: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 22,
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 13,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 18,
  },

  resetButton: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  resetButtonDisabled: {
    opacity: 0.6,
  },

  resetButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  loginText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  loginLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 5,
  },
});