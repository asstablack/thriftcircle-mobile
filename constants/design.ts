import { fonts } from './fonts';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  section: 40,
  control: 48,
  large: 64,
} as const;
export const radius = {
  small: 6,
  medium: 8,
  card: 12,
  large: 16,
  pill: 999,
} as const;
export const typography = {
  display: {
    fontFamily: fonts.semiBold,
    fontSize: 32,
    lineHeight: 40,
  },
  h1: {
    fontFamily: fonts.semiBold,
    fontSize: 28,
    lineHeight: 36,
  },
  h2: {
    fontFamily: fonts.semiBold,
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  bodyLarge: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  labelSmall: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
  },
} as const;
