import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const memberDashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 18,
    backgroundColor: colors.white,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  content: {
    padding: 22,
    paddingBottom: 32,
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
    padding: 20,
    marginBottom: 28,
  },

  groupName: {
    fontSize: 21,
    fontFamily: fonts.bold,
    color: colors.white,
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 24,
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
    fontFamily: fonts.bold,
    color: colors.white,
    marginTop: 8,
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
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  historyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    marginBottom: 20,
  },

  linkText: {
    fontSize: 13,
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
    padding: 18,
    marginBottom: 14,
  },

  amount: {
    fontSize: 21,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginTop: 12,
  },

  paymentStatus: {
    alignItems: 'flex-end',
    flexShrink: 1,
  },

  badge: {
    fontFamily: fonts.regular,
    fontSize: 11,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
  },

  confirmed: {
    backgroundColor: colors.primaryLight,
    color: colors.primary,
  },

  pending: {
    backgroundColor: '#FFF2D5',
    color: '#805F12',
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
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
  },

  search: {
    fontFamily: fonts.regular,
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    color: colors.textPrimary,
  },

  filters: {
    gap: 8,
    paddingVertical: 16,
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
