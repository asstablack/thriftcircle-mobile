import { StyleSheet, type ViewStyle } from 'react-native';
import { colors } from '@/constants/color';
import { fonts } from '@/constants/fonts';
export const progressWidth = (
  value: number,
): ViewStyle => ({
  width: `${Math.max(0, Math.min(100, value))}%`,
});
export const memberDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 8,
    gap: 16,
    paddingBottom: 32,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  card: {
    padding: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    gap: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileInfo: { flex: 1, gap: 5 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    color: colors.primary,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 17.5,
    color: colors.textPrimary,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  activeBadge: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  contact: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  contactText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 13.5,
    color: colors.textPrimary,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 11.5,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.subtleBackground,
    borderRadius: 4,
  },
  cell: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
    gap: 4,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  badge: {
    fontFamily: fonts.regular,
    fontSize: 12,
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: '45%',
  },
  confirmed: {
    backgroundColor: colors.primaryLight,
    color: colors.primary,
  },
  pending: { backgroundColor: '#FFFBEB', color: '#92400E' },
  issue: { backgroundColor: '#FFF0F2', color: '#AD3045' },
  link: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.primary,
    paddingVertical: 12,
  },
});
