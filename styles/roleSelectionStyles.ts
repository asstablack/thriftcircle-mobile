import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const roleSelectionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
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
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 21,
  },

  roleCard: {
    minHeight: 160,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 24,
  },

  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },

  roleIcon: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    backgroundColor: colors.primaryLight,
  },

  roleIconText: {
    fontFamily: fonts.regular,
    fontSize: 20,
    color: colors.primary,
  },

  roleInfo: {
    flex: 1,
    paddingRight: 8,
  },

  roleTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },

  roleDescription: {
    fontFamily: fonts.regular,
    fontSize: 14.5,
    lineHeight: 21,
    color: colors.textSecondary,
  },

  radio: {
    width: 17,
    height: 17,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },

  radioSelected: {
    borderColor: colors.primary,
  },

  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  continueButton: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },

  continueButtonDisabled: {
    opacity: 0.45,
  },

  continueText: {
    color: colors.white,
    fontSize: 14.5,
    fontFamily: fonts.bold,
  },
});
