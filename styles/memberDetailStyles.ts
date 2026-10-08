import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const memberDetailStyles = StyleSheet.create({
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
    fontSize: 9,
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

  backButton: {
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 10,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },

  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 18,
    fontFamily: fonts.extraBold,
    color: colors.primary,
  },

  memberName: {
    fontSize: 20,
    fontFamily: fonts.extraBold,
    color: colors.textPrimary,
    marginTop: 10,
  },

  memberMeta: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },

  activeBadge: {
    marginTop: 9,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
  },

  activeBadgeText: {
    fontSize: 8,
    color: colors.primary,
    fontFamily: fonts.extraBold,
  },

  sectionTitle: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginHorizontal: 18,
    marginTop: 20,
    marginBottom: 10,
  },

  overviewCard: {
    marginHorizontal: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 15,
  },

  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  overviewLabel: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textSecondary,
  },

  overviewValue: {
    fontSize: 10,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },

  confirmedText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: colors.primary,
  },

  progressCard: {
    marginHorizontal: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 15,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  progressLabel: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textSecondary,
  },

  progressAmount: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  progressTrack: {
    height: 8,
    backgroundColor: colors.subtleBackground,
    borderRadius: 5,
    marginTop: 12,
    overflow: 'hidden',
  },

  progressFill: {
    width: '80%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },

  progressPercentage: {
    fontFamily: fonts.regular,
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 5,
    textAlign: 'right',
  },

  historyCard: {
    marginHorizontal: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },

  historyHeader: {
    flexDirection: 'row',
    backgroundColor: colors.subtleBackground,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  historyHeaderText: {
    flex: 1,
    fontSize: 9,
    color: colors.textSecondary,
    fontFamily: fonts.bold,
  },

  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  historyText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 9,
    color: colors.textPrimary,
  },

  confirmedBadge: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 7,
    paddingVertical: 4,
  },

  confirmedBadgeText: {
    fontSize: 7,
    fontFamily: fonts.bold,
    color: colors.primary,
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
    fontSize: 9,
    color: colors.textSecondary,
  },

  navTextActive: {
    fontSize: 9,
    color: colors.primary,
    fontFamily: fonts.bold,
  },
});