import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const groupScreenHeaderStyles = StyleSheet.create({
  plainTitle: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  plainBanner: { paddingTop: 0, paddingBottom: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.background,
    minHeight: 64,
  },
  logo: {
    width: 130,
    height: 44,
  },
  banner: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.background,
    paddingTop: 12,
    paddingBottom: 20,
  },
  title: {
    fontSize: 33,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14.5,
    lineHeight: 21,
    marginTop: 8,
    color: colors.textSecondary,
  },
});
