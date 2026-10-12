import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    paddingHorizontal: 20,

    paddingTop: 24,
    paddingBottom: 28,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
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
    marginBottom: 20,
  },

  placeholder: {
    color: colors.textSecondary,
  },

  registerButton: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  registerButtonDisabled: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: colors.white,
    fontSize: 14.5,
    fontFamily: fonts.bold,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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

  passwordContainer: {
    position: 'relative',
    marginBottom: 20,
  },

  passwordInput: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 13,
    paddingRight: 60,
    fontFamily: fonts.regular,
    fontSize: 14.5,
    color: colors.textPrimary,
  },

  eyeButton: {
    position: 'absolute',
    right: 13,
    top: 0,
    height: 44,
    justifyContent: 'center',
  },

  eyeText: {
    fontSize: 14.5,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
    marginBottom: 18,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: colors.white,
  },

  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.bold,
  },

  termsText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14.5,
    lineHeight: 21,
    color: colors.textSecondary,
  },

  termsLink: {
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },
});
