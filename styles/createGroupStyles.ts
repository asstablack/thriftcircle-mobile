import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const createGroupStyles = StyleSheet.create({
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 20,
  },
  stepTitle: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  stepCount: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
    marginVertical: 12,
  },
  helper: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  reviewCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.white,
    gap: 10,
    marginTop: 12,
  },
  reviewHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewTitle: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  editLink: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.primary,
    padding: 8,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    marginTop: 16,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: '#A32626',
    marginTop: 16,
  },
  secondaryAction: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    marginTop: 12,
    padding: 12,
  },
  saving: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 32,
    justifyContent: 'center',
    gap: 24,
  },
  savingTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 24,
    color: colors.white,
  },
  savingText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 26,
    color: colors.white,
  },
  successIcon: { alignSelf: 'center' },
  successMessage: { textAlign: 'center' },
  success: {
    flexGrow: 1,
    padding: 28,
    justifyContent: 'center',
    gap: 20,
  },
  successTitle: {
    textAlign: 'center',
    fontFamily: fonts.semiBold,
    fontSize: 28,
    color: colors.primary,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },

  backButton: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: fonts.semiBold,
    marginBottom: 0,
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
    marginBottom: 28,
  },

  form: {
    gap: 8,
  },

  label: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textDark,
    marginTop: 16,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    fontFamily: fonts.regular,
    fontSize: 14.5,
    color: colors.textPrimary,
  },

  frequencyRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },

  frequencyButton: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  frequencyButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },

  frequencyText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
  },

  frequencyTextActive: {
    color: colors.primary,
  },

  createButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },

  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.bold,
  },

  dateInputText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textPrimary,
  },

  datePlaceholderText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
  },
});
