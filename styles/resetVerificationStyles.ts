 import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const resetVerificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 70,
  },

  pageHeader: {
    marginBottom: 28,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 6,
  },

  pageSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 30,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 28,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 22,
  },

  verifyButton: {
    height: 50,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  verifyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },

  backButton: {
    alignItems: 'center',
  },

  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});