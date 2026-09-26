import { colors } from '@/constants/color';
import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
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

  form: {
    width: '100%',
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 7,
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
    marginBottom: 20,
  },

  forgotButton: {
    alignItems: 'flex-end',
    marginTop: -5,
    marginBottom: 20,
  },

  forgotPassword: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },

  loginButton: {
    height: 50,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },

  errorText: {
    fontSize: 12,
    color: colors.error,
    textAlign: 'center',
    marginTop: 18,
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },

  registerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  registerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4,
  },
});