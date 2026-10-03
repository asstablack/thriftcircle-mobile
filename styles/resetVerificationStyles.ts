import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const resetVerificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 30,
    justifyContent: 'center',
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },

  backText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  logo: {
    width: 110,
    height: 82,
    alignSelf: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 22,
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 13,
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 18,
  },

  verifyButton: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  verifyButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },

  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  resendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  resendLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 5,
  },
});