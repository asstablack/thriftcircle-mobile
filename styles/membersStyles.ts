import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const membersStyles = StyleSheet.create({
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

  pageHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },

  pageSubtitle: {
    fontSize: 10,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
  },

  groupCard: {
    marginHorizontal: 18,
    marginTop: 14,
    padding: 15,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  groupName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  groupDetails: {
    fontSize: 9,
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
    fontSize: 8,
    color: colors.primary,
    fontWeight: '800',
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginTop: 10,
    gap: 7,
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
    fontWeight: '800',
    color: colors.textPrimary,
  },

  statLabel: {
    fontSize: 8,
    color: colors.textSecondary,
    marginTop: 3,
  },

  searchBox: {
    marginHorizontal: 18,
    marginTop: 15,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  searchIcon: {
    fontSize: 19,
    color: colors.textSecondary,
    marginRight: 8,
  },

  searchText: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  sectionHeader: {
    marginHorizontal: 18,
    marginTop: 22,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  memberCount: {
    fontSize: 9,
    color: colors.textSecondary,
  },

  memberCard: {
    marginHorizontal: 18,
    marginBottom: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 11,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
  },

  memberInfo: {
    flex: 1,
    marginLeft: 10,
  },

  memberName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  memberAmount: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 3,
  },

  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
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
    fontSize: 7,
    fontWeight: '700',
  },

  paidText: {
    color: colors.primary,
  },

  pendingText: {
    color: colors.warning,
  },

  overdueText: {
    color: colors.error,
  },

  arrow: {
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
});