import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const groupSelectionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },

  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },

  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 24,
  },

  loadingContainer: {
    paddingVertical: 50,
    alignItems: 'center',
  },

  loadingColor: {
    color: colors.primary,
  },

  loadingText: {
    marginTop: 12,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },

  emptyContainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },

  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  groupCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  groupInfo: {
    flex: 1,
  },

  groupName: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },

  groupDetails: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    textTransform: 'capitalize',
  },

  roleBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 9,
    marginRight: 8,
  },

  organizerBadge: {
    backgroundColor: colors.primaryLight,
  },

  memberBadge: {
    backgroundColor: colors.subtleBackground,
  },

  roleText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    textTransform: 'capitalize',
  },

  organizerText: {
    color: colors.primary,
  },

  memberText: {
    color: colors.textSecondary,
  },

  arrow: {
    fontFamily: fonts.regular,
    fontSize: 22,
    color: colors.textSecondary,
  },

  actions: {
    marginTop: 20,
  },

  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },

  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.bold,
  },

  joinButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  joinButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.bold,
  },

  inviteButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },

  inviteButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.bold,
  },
});
