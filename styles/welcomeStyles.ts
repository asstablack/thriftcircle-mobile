import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 32,
  },

  logo: {
    width: 125,
    height: 48,
    marginBottom: 8,
  },

  illustration: {
    width: '100%',
    height: 300,
    marginBottom: 8,
  },

  title: {
    fontSize: 36,
    fontFamily: fonts.extraBold,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 44,
  },

  titleAccent: {
    fontSize: 36,
    fontFamily: fonts.extraBold,
    color: colors.accent,
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 9,
  },

  description: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 310,
    marginBottom: 22,
  },

  actions: {
    width: '100%',
    gap: 9,
  },

  primaryButton: {
    width: '100%',
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: fonts.bold,
  },

  secondaryButton: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },

  secondaryButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fonts.bold,
  },
});
