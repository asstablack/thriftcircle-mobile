import { fonts } from '@/constants/fonts';
import { StyleSheet, type ViewStyle } from 'react-native';
import { colors } from '@/constants/color';

export const dashboardProgressStyle = (
  progress: number,
): ViewStyle => ({
  width: `${Math.max(0, Math.min(progress, 100))}%`,
});

export const organizerDashboardStyles = StyleSheet.create({
  confirmedText: {
    color: colors.primary,
  },
  pendingText: {
    color: '#8B581C',
  },
  overdueText: {
    color: '#AD3045',
  },
  membersText: {
    color: '#2458B5',
  },
  attentionHeader: {
    marginHorizontal: 18,
    marginBottom: 0,
    padding: 10,
    backgroundColor: '#FFFAE8',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  skeletonSummary: {
    marginHorizontal: 18,
    marginBottom: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  skeletonLine: {
    height: 10,
    width: '90%',
    borderRadius: 6,
    marginVertical: 7,
    backgroundColor: colors.border,
  },
  skeletonShortLine: {
    height: 10,
    width: '55%',
    borderRadius: 6,
    marginVertical: 7,
    backgroundColor: colors.border,
  },
  skeletonButton: {
    height: 42,
    marginTop: 20,
    backgroundColor: colors.border,
    borderRadius: 6,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skeletonTextBlock: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* =========================
     HEADER
  ========================= */

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

  headerLogo: {
    width: 115,
    height: 38,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  notificationButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerIcon: {
    fontFamily: fonts.regular,
    fontSize: 21,
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

  /* =========================
     CONTENT
  ========================= */

  scrollContent: {
    paddingBottom: 24,
  },

  welcomeBanner: {
    backgroundColor: colors.primaryLight,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 15,
  },

  greeting: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    marginBottom: 4,
  },

  welcomeText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    opacity: 0.9,
  },

  /* =========================
     CYCLE
  ========================= */

  cycleHeader: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cycleDate: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 3,
  },

  cycleTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  activeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  activeBadgeText: {
    color: colors.primary,
    fontSize: 9,
    fontFamily: fonts.extraBold,
  },

  /* =========================
     CONTRIBUTION SUMMARY
  ========================= */

  summaryCard: {
    marginHorizontal: 18,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  summaryLabel: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  summaryCount: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
  },

  summaryAmount: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.primary,
  },

  summaryTarget: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },

  confirmedLabel: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 3,
  },

  progressTrack: {
    height: 7,
    backgroundColor: colors.subtleBackground,
    borderRadius: 5,
    marginTop: 12,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },

  progressText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },

  summaryStats: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 14,
  },

  summaryStat: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
  },
  confirmedStat: {
    backgroundColor: colors.primaryLight,
  },
  pendingStat: {
    backgroundColor: '#FFFAE8',
  },
  overdueStat: {
    backgroundColor: '#FFF0F2',
  },
  membersStat: {
    backgroundColor: '#EFF6FF',
  },

  summaryStatValue: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  summaryStatLabel: {
    fontFamily: fonts.regular,
    fontSize: 9,
    color: colors.textDark,
    marginTop: 2,
  },

  viewButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  viewButtonText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.bold,
  },

  /* =========================
     SECTION HEADERS
  ========================= */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginTop: 22,
    marginBottom: 10,
  },

  sectionHeaderTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    paddingHorizontal: 18,
    marginTop: 22,
    marginBottom: 10,
  },

  sectionArrow: {
    fontFamily: fonts.regular,
    fontSize: 20,
    color: colors.primary,
    paddingRight: 18,
  },

  viewAll: {
    fontSize: 11,
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },

  /* =========================
     LIST CARDS
  ========================= */

  listCard: {
    marginHorizontal: 18,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  listRow: {
    minHeight: 58,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  listInfo: {
    flex: 1,
    marginLeft: 10,
  },

  listTitle: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },

  listSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 3,
  },

  rowArrow: {
    fontFamily: fonts.regular,
    fontSize: 19,
    color: colors.textSecondary,
    marginLeft: 8,
  },

  emptyListText: {
    padding: 16,
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  /* =========================
     NEEDS ATTENTION
  ========================= */

  statusIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusIconPending: {
    backgroundColor: '#FFF4D6',
  },

  statusIconDanger: {
    backgroundColor: '#FDE8E8',
  },

  statusIconText: {
    fontSize: 12,
    fontFamily: fonts.extraBold,
    color: colors.primary,
  },

  /* =========================
     DEADLINES
  ========================= */

  deadlineRow: {
    minHeight: 62,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  todayBadge: {
    backgroundColor: colors.subtleBackground,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 5,
  },

  todayText: {
    fontSize: 9,
    color: colors.textSecondary,
    fontFamily: fonts.semiBold,
  },

  /* =========================
     ACTIVITIES
  ========================= */

  activityRow: {
    minHeight: 64,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  memberAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  memberAvatarText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.primary,
  },

  /* =========================
     NO ACTIVE CYCLE
  ========================= */

  noCycleCard: {
    marginHorizontal: 20,
    marginTop: 80,
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'center',
  },

  noCycleIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  noCycleIconText: {
    fontFamily: fonts.regular,
    fontSize: 18,
    color: colors.primary,
  },

  noCycleTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 6,
  },

  noCycleText: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 15,
  },

  createCycleButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  createCycleButtonText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: fonts.bold,
  },

  quickActionIcon: {
    width: 30,
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.primary,
  },

  /* =========================
     OLD QUICK ACTION STYLES
     Kept because other dashboard
     states/components may still use them.
  ========================= */

  quickActions: {
    paddingHorizontal: 18,
  },

  quickAction: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  quickActionTitle: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: fonts.semiBold,
  },

  quickActionArrow: {
    fontFamily: fonts.regular,
    fontSize: 20,
    color: colors.textSecondary,
  },

  /* =========================
     OLD REVIEW STYLES
     Kept for compatibility.
  ========================= */

  reviewCard: {
    marginHorizontal: 18,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  reviewInfo: {
    flex: 1,
    marginLeft: 10,
  },

  memberName: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  reviewDetails: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 3,
  },

  reviewArrow: {
    fontFamily: fonts.regular,
    fontSize: 20,
    color: colors.textSecondary,
  },

  /* =========================
     OLD ACTIVITY CARD STYLES
     Kept for compatibility.
  ========================= */

  activityCard: {
    marginHorizontal: 18,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },

  activityInfo: {
    marginLeft: 10,
    flex: 1,
  },

  activityTitle: {
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: fonts.semiBold,
  },

  activityTime: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 3,
  },

  /* =========================
     BOTTOM NAVIGATION
  ========================= */

  bottomNav: {
    height: 76,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    minHeight: 76,
    paddingVertical: 8,
  },

  navItem: {
    flex: 1,
    minHeight: 58,
    gap: 4,
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
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textSecondary,
  },

  navTextActive: {
    color: colors.primary,
    fontFamily: fonts.medium,
    fontSize: 11,
  },

  /* =========================
     LOADING
  ========================= */

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  loadingText: {
    marginTop: 12,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },

  skeletonCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.subtleBackground,
  },

  skeletonProfile: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.subtleBackground,
  },

  skeletonWelcomeLine: {
    width: 145,
    height: 13,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: 7,
  },

  skeletonWelcomeSmall: {
    width: 220,
    height: 9,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  skeletonCycle: {
    width: 150,
    height: 18,
    borderRadius: 6,
    backgroundColor: colors.subtleBackground,
    marginHorizontal: 18,
    marginTop: 20,
    marginBottom: 12,
  },

  skeletonCard: {
    height: 190,
    marginHorizontal: 18,
    backgroundColor: colors.subtleBackground,
    borderRadius: 12,
    marginBottom: 14,
  },

  skeletonCardSmall: {
    height: 80,
    marginHorizontal: 18,
    backgroundColor: colors.subtleBackground,
    borderRadius: 10,
    marginBottom: 10,
  },

  /* =========================
     GENERIC EMPTY STATE
  ========================= */

  emptyState: {
    marginHorizontal: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },

  emptyStateTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 5,
  },

  emptyStateText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
