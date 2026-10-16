import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const newPasswordStyles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0,0,0,0.35)' },
  successCard: { width: '100%', maxWidth: 368, alignSelf: 'center', backgroundColor: colors.primaryLight, borderRadius: 16, padding: 24, gap: 16 },
  successTitle: { fontFamily: fonts.semiBold, fontSize: 20, lineHeight: 28, color: colors.textPrimary, textAlign: 'center' },
  successMessage: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.textSecondary, textAlign: 'center' },
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

  firstPasswordContainer: { marginBottom: 24 },
  passwordContainer: {
    position: 'relative',
    marginBottom: 6,
  },

  passwordInput: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingRight: 60,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
  },

  eyeButton: {
    position: 'absolute',
    right: 13,
    top: 0,
    height: 44,
    justifyContent: 'center',
  },

  eyeText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },

  helperText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 16,
  },

  resetButton: {
    minHeight: 48,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  resetButtonDisabled: {
    opacity: 0.6,
  },

  resetButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
});
