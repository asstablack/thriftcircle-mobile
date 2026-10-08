import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const groupScreenHeaderStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 22,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  logo: {
    width: 126,
    height: 34,
  },
  banner: {
    paddingHorizontal: 22,
    paddingVertical: 20,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    color: '#E0EEE8',
  },
});
