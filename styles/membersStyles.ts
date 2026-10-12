import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const membersStyles = StyleSheet.create({
  requestLink: {
    marginHorizontal: 20,
    paddingVertical: 12,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  topHeader: {
    height: 70,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },

  logoText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.extraBold,
  },

  logoName: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.extraBold,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerIcon: {
    fontFamily: fonts.regular,
    fontSize: 20,
    color: colors.textSecondary,
  },

  profileCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileText: {
    fontSize: 13,
    fontFamily: fonts.extraBold,
    color: colors.white,
  },

  chevron: {
    fontFamily: fonts.regular,
    fontSize: 18,
    color: colors.textSecondary,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  pageHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  pageTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.white,
  },

  pageSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
  },

  groupCard: {
    marginHorizontal: 20,
    marginTop: 14,
    padding: 15,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  groupName: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  groupDetails: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },

  activeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 9,
  },

  activeBadgeText: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fonts.extraBold,
  },

  inviteButton: {
    marginHorizontal: 20,
    marginTop: 16,
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.white,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    marginTop: 12,
    gap: 8,
  },
  filter: {
    minHeight: 44,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
  },
  filterActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 7,
    flexWrap: 'wrap',
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    paddingVertical: 10,
    alignItems: 'center',
  },

  statValue: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },

  statLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },

  searchBox: {
    marginHorizontal: 20,
    marginTop: 15,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  searchIcon: {
    fontFamily: fonts.regular,
    fontSize: 19,
    color: colors.textSecondary,
    marginRight: 8,
  },

  searchText: {
    flex: 1,
    padding: 10,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },

  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  sectionTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  memberCount: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },

  memberCard: {
    marginHorizontal: 20,
    marginBottom: 0,
    backgroundColor: colors.white,
    borderWidth: 0,
    borderColor: colors.border,
    borderRadius: 0,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    gap: 8,
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
    fontSize: 13,
    fontFamily: fonts.extraBold,
    color: colors.primary,
  },

  memberInfo: {
    flex: 1,
    marginLeft: 0,
    minWidth: 0,
  },

  memberName: {
    fontSize: 13.5,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  memberAmount: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },

  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: 110,
  },

  paidBadge: {
    backgroundColor: colors.primaryLight,
  },

  pendingBadge: {
    backgroundColor: '#FFF7D6',
  },

  overdueBadge: {
    backgroundColor: '#FDECEC',
  },

  statusText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.primary,
  },

  paidText: {
    fontFamily: fonts.medium,
    color: colors.primary,
    fontSize: 14,
  },

  pendingText: {
    color: colors.warning,
  },

  overdueText: {
    color: colors.error,
  },

  arrow: {
    fontFamily: fonts.regular,
    fontSize: 20,
    color: colors.textSecondary,
    marginLeft: 7,
  },

  bottomNav: {
    height: 68,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navItemActive: {
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    paddingVertical: 5,
  },

  navIcon: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 2,
  },

  navText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },

  navTextActive: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fonts.bold,
  },
});
