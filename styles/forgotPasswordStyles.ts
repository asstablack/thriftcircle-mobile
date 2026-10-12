import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const forgotPasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 48,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
  },

  backText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },

  logo: {
    width: 115,
    height: 96,
    alignSelf: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 33,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 40,
  },

  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14.5,
    lineHeight: 21,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 13.5,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    marginBottom: 8,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 13,
    fontFamily: fonts.regular,
    fontSize: 14.5,
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
    fontSize: 14.5,
    fontFamily: fonts.bold,
    color: colors.white,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 32,
  },

  loginText: {
    fontFamily: fonts.regular,
    fontSize: 14.5,
    color: colors.textSecondary,
  },

  loginLink: {
    fontSize: 14.5,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginLeft: 5,
  },
});
