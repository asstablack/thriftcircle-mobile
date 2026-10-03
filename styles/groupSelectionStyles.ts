import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const groupSelectionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },

  subtitle: {
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
    fontSize: 14,
    color: colors.textSecondary,
  },

  emptyContainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
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

  groupCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
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
    fontWeight: '700',
    color: colors.textPrimary,
  },

  groupDetails: {
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
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  organizerText: {
    color: colors.primary,
  },

  memberText: {
    color: colors.textSecondary,
  },

  arrow: {
    fontSize: 22,
    color: colors.textSecondary,
  },

  actions: {
    marginTop: 20,
  },

  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },

  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },

  joinButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  joinButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },

  inviteButton: {
  borderWidth: 1,
  borderColor: colors.primary,
  backgroundColor: colors.primaryLight,
  paddingVertical: 15,
  borderRadius: 12,
  alignItems: 'center',
  marginTop: 12,
},

inviteButtonText: {
  color: colors.primary,
  fontSize: 16,
  fontWeight: '700',
},
});