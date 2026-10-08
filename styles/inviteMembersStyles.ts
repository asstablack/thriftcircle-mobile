import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const inviteMembersStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  backButton: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: fonts.semiBold,
    marginBottom: 24,
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
    fontSize: 18,
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
    marginBottom: 20,
  },

  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  createButtonText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.bold,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },

  groupCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
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

  checkmark: {
    fontSize: 20,
    fontFamily: fonts.bold,
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
    fontFamily: fonts.bold,
    color: colors.textSecondary,
    marginBottom: 6,
  },

  inviteDescription: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 18,
  },

  codeBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 14,
  },

  inviteCode: {
    fontSize: 26,
    fontFamily: fonts.extraBold,
    letterSpacing: 4,
    color: colors.primary,
  },

  copyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  copyButtonText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.bold,
  },
});
