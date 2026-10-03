import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const contributionsStyles = StyleSheet.create({
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
    fontWeight: '800',
  },

  logoName: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerIcon: {
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
    fontWeight: '800',
    color: colors.white,
  },

  chevron: {
    fontSize: 18,
    color: colors.textSecondary,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  backButton: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
    fontSize: 11,
    color: colors.textSecondary,
  },

  greenHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 15,
  },

  pageTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },

  pageSubtitle: {
    color: colors.white,
    opacity: 0.9,
    fontSize: 10,
    marginTop: 4,
  },

  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  filterButton: {
    flex: 1,
    minHeight: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  filterIcon: {
    fontSize: 13,
    color: colors.primary,
    marginRight: 6,
  },

  filterText: {
    flex: 1,
    fontSize: 10,
    color: colors.textDark,
  },

  filterArrow: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  summaryCard: {
    marginHorizontal: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    padding: 15,
  },

  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  summarySubtext: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 3,
  },

  summaryMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  progressCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 7,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },

  amountSection: {
    marginLeft: 15,
  },

  amount: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  expected: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 3,
  },

  statusList: {
    marginTop: 12,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  confirmedDot: {
    backgroundColor: colors.primary,
  },

  pendingDot: {
    backgroundColor: colors.warning,
  },

  overdueDot: {
    backgroundColor: colors.error,
  },

  memberDot: {
    backgroundColor: colors.info,
  },

  statusLabel: {
    flex: 1,
    fontSize: 10,
    color: colors.textSecondary,
  },

  statusValue: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 18,
    marginTop: 10,
  },

  smallStatCard: {
    width: '48%',
    marginRight: '2%',
    marginBottom: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 11,
  },

  smallStatNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  smallStatLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 2,
  },

  tabs: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  tab: {
    paddingHorizontal: 9,
    paddingVertical: 9,
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },

  tabText: {
    fontSize: 9,
    color: colors.textSecondary,
  },

  activeTabText: {
    color: colors.primary,
    fontWeight: '700',
  },

  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: colors.subtleBackground,
  },

  tableHeaderText: {
    flex: 1,
    fontSize: 8,
    color: colors.textSecondary,
    fontWeight: '700',
  },

  contributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  memberText: {
    flex: 1,
    fontSize: 9,
    color: colors.textPrimary,
    fontWeight: '600',
  },

  rowText: {
    flex: 1,
    fontSize: 8,
    color: colors.textSecondary,
  },

  statusBadge: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 8,
  },

  confirmedBadge: {
    backgroundColor: colors.primaryLight,
  },

  pendingBadge: {
    backgroundColor: '#FFF7D6',
  },

  overdueBadge: {
    backgroundColor: '#FDECEC',
  },

  statusBadgeText: {
    fontSize: 7,
    fontWeight: '700',
  },

  confirmedText: {
    color: colors.primary,
  },

  pendingText: {
    color: colors.warning,
  },

  overdueText: {
    color: colors.error,
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
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 2,
  },

  navText: {
    fontSize: 9,
    color: colors.textSecondary,
  },

  navTextActive: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: '700',
  },
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

retryButton: {
  marginTop: 16,
  backgroundColor: colors.primary,
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 10,
},

retryButtonText: {
  color: colors.white,
  fontSize: 14,
  fontWeight: '700',
},

emptyContainer: {
  backgroundColor: colors.white,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 14,
  padding: 24,
  alignItems: 'center',
  marginTop: 12,
},

emptyTitle: {
  fontSize: 17,
  fontWeight: '700',
  color: colors.textPrimary,
  marginBottom: 8,
},

emptyText: {
  fontSize: 14,
  lineHeight: 21,
  color: colors.textSecondary,
  textAlign: 'center',
},
});