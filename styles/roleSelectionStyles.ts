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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 18,
  },

  backText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },

  logo: {
    width: 125,
    height: 100,
    alignSelf: 'center',
    marginBottom: 5,
  },

  title: {
    fontSize: 22,
    fontFamily: fonts.extraBold,
    color: colors.textPrimary,
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },

  roleCard: {
    minHeight: 150,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 14,
  },

  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },

  roleIcon: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
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
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 3,
  },

  roleDescription: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
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
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },

  continueButtonDisabled: {
    opacity: 0.45,
  },

  continueText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.bold,
  },
});
