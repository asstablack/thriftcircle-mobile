import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const memberDashboardStyles = StyleSheet.create({
  underReview: {
    backgroundColor: '#EFF6FF',
    color: '#315B8B',
  },
  filterControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 14,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.subtleBackground,
  },
  correctionCard: {
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#F6D28B',
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    marginBottom: 16,
  },
  correctionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: '#92400E',
  },
  issue: { backgroundColor: '#FFF0F2', color: '#AD3045' },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
    minHeight: 56,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.primary,
  },

  headerName: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },

  content: {
    padding: 16,
    paddingBottom: 32,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },

  secondaryText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },

  summary: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },

  groupName: {
    flexShrink: 1,
    fontSize: 20,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 16,
  },

  summaryColumn: {
    flex: 1,
  },

  summaryLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#DCEAE4',
  },

  summaryValue: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.medium,
    color: colors.white,
    marginTop: 6,
  },

  outstandingLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#477E6D',
    paddingTop: 16,
  },

  whiteText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: fonts.semiBold,
  },

  heading: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },

  historyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 16,
  },

  linkText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },

  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 0,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  amount: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    marginTop: 8,
  },

  paymentStatus: {
    alignItems: 'flex-end',
    flexShrink: 1,
  },

  badge: {
    fontFamily: fonts.regular,
    fontSize: 12,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },

  confirmed: {
    backgroundColor: colors.primaryLight,
    color: colors.primary,
  },

  pending: {
    backgroundColor: '#FFFBEB',
    color: '#92400E',
  },

  stateCard: {
    padding: 22,
    gap: 14,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
  },

  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 14,
  },

  skeletonSummary: {
    height: 190,
    borderRadius: 16,
    backgroundColor: colors.border,
    marginBottom: 24,
  },

  skeletonCard: {
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.border,
    marginBottom: 14,
  },

  historyHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.primary,
    borderRadius: 0,
    padding: 16,
    marginBottom: 0,
    minHeight: 56,
  },

  search: {
    fontFamily: fonts.regular,
    height: 44,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    color: colors.textPrimary,
    fontSize: 14,
  },

  filters: {
    gap: 8,
    paddingVertical: 12,
  },

  filter: {
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
});
