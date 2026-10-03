import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const inviteMembersStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  backButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 28,
  },

  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },

  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },

  createButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
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

  groupCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },

  groupInfo: {
    flex: 1,
  },

  groupName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  groupDetails: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    textTransform: 'capitalize',
  },

  checkmark: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },

  inviteCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
  },

  inviteLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
  },

  inviteDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 18,
  },

  codeBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 14,
  },

  inviteCode: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 4,
    color: colors.primary,
  },

  copyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  copyButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});