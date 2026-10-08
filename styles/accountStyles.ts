import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';
import { fonts } from '@/constants/fonts';

export const accountStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 22,
    gap: 18,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingBottom: 36,
  },
  card: {
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  input: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
    minHeight: 48,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.white,
  },
  link: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.primary,
    paddingVertical: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: '#A32626',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  checkboxText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textPrimary,
  },
});
