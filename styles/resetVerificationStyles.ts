import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const resetVerificationStyles = StyleSheet.create({
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
    marginBottom: 32,
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
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 12,
    lineHeight: 16,
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
    paddingHorizontal: 12,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 18,
  },

  verifyButton: {
    minHeight: 48,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  verifyButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },

  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  resendText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },

  resendLink: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.primary,
    marginLeft: 5,
  },
});
