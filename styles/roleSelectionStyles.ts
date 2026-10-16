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
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    width: 116,
    height: 116,
    alignSelf: 'center',
    marginBottom: 8,
  },

  title: {
    fontSize: 32,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 40,
  },

  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
    lineHeight: 20,
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
    backgroundColor: colors.successSurface,
  },

  roleIcon: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24,
    backgroundColor: colors.primaryLight,
  },

  roleIconText: {
    fontFamily: fonts.regular,
    fontSize: 20,
    color: colors.primary,
  },

  roleInfo: {
    flex: 1,
    paddingRight: 0,
  },

  roleTitle: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    marginBottom: 8,
  },

  roleDescription: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },

  radio: {
    position: 'absolute',
    top: 20,
    right: 24,
    width: 17,
    height: 17,
    borderWidth: 1,
    borderColor: colors.textTertiary,
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
    minHeight: 48,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },

  continueButtonDisabled: {
    backgroundColor: colors.border,
  },

  continueTextDisabled: { color: colors.textDisabled },

  continueText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
});

