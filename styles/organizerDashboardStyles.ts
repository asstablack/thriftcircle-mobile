import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const organizerDashboardStyles = StyleSheet.create({
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
    fontWeight: '800',
    color: colors.white,
  },

  chevron: {
    fontSize: 18,
    color: colors.textSecondary,
  },

  /* =========================
     CONTENT
  ========================= */

  scrollContent: {
    paddingBottom: 90,
  },

  welcomeBanner: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 15,
  },

  greeting: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },

  welcomeText: {
    fontSize: 11,
    color: colors.white,
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
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 3,
  },

  cycleTitle: {
    fontSize: 16,
    fontWeight: '700',
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
    fontWeight: '800',
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
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },

  summaryAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  summaryTarget: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  confirmedLabel: {
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
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },

  summaryStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },

  summaryStat: {
    width: '50%',
    paddingVertical: 8,
  },

  summaryStatValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  summaryStatLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },

  viewButton: {
    backgroundColor: colors.primary,
    borderRadius: 9,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },

  viewButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
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
    fontWeight: '700',
    color: colors.textPrimary,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: 18,
    marginTop: 22,
    marginBottom: 10,
  },

  sectionArrow: {
    fontSize: 20,
    color: colors.primary,
    paddingRight: 18,
  },

  viewAll: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
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
    fontWeight: '600',
    color: colors.textPrimary,
  },

  listSubtitle: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 3,
  },

  rowArrow: {
    fontSize: 19,
    color: colors.textSecondary,
    marginLeft: 8,
  },

  emptyListText: {
    padding: 16,
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
    fontWeight: '800',
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
    fontWeight: '600',
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
    fontWeight: '700',
    color: colors.primary,
  },

  /* =========================
     NO ACTIVE CYCLE
  ========================= */

  noCycleCard: {
    marginHorizontal: 18,
    marginTop: 18,
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
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
    fontSize: 18,
    color: colors.primary,
  },

  noCycleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },

  noCycleText: {
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
    paddingVertical: 11,
    alignItems: 'center',
  },

  createCycleButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },

  quickActionIcon: {
    width: 30,
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
    fontWeight: '600',
  },

  quickActionArrow: {
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
    fontWeight: '700',
    color: colors.textPrimary,
  },

  reviewDetails: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 3,
  },

  reviewArrow: {
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
    fontWeight: '600',
  },

  activityTime: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 3,
  },

  /* =========================
     BOTTOM NAVIGATION
  ========================= */

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
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 2,
  },

  navText: {
    fontSize: 9,
    color: colors.textSecondary,
  },

  navTextActive: {
    color: colors.primary,
    fontWeight: '700',
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
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 5,
  },

  emptyStateText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});