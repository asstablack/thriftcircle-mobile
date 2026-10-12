import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';
import { fonts } from '@/constants/fonts';
export const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  logo: { width: 180, height: 60 },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 14.5,
    color: colors.textSecondary,
  },
  link: {
    marginTop: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: colors.primary,
    color: colors.white,
    fontFamily: fonts.semiBold,
    fontSize: 14.5,
    overflow: 'hidden',
  },
});
