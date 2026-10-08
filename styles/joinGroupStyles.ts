import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const joinGroupStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 24,
  },

  backButton: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: fonts.semiBold,
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },

  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 30,
  },

  form: {
    gap: 8,
  },

  label: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.textDark,
    marginTop: 12,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textPrimary,
  },

  joinButton: {
    height: 54,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },

  joinButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.bold,
  },

  joinButtonDisabled: {
    opacity: 0.6,
  },
});
