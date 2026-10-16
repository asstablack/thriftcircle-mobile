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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },

  logo: {
    width: 130,
    height: 44,
    marginBottom: 24,
  },

  illustration: {
    width: '100%',
    height: 310,
    marginBottom: 24,
    maxWidth: 310,
  },

  title: {
    fontSize: 40,
    fontFamily: fonts.bold,
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 44,
  },

  titleAccent: {
    fontSize: 40,
    fontFamily: fonts.bold,
    color: colors.accent,
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 8,
  },

  description: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 362,
    marginBottom: 24,
  },

  actions: {
    width: '100%',
    gap: 16,
  },

  primaryButton: {
    width: '100%',
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonPressed: { backgroundColor: colors.primaryDark },

  primaryButtonText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
  },

  secondaryButton: {
    width: '100%',
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },

  secondaryButtonPressed: { backgroundColor: colors.primaryLight },

  secondaryButtonText: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
  },
});
