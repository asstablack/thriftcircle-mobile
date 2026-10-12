import { fonts } from '@/constants/fonts';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const inviteMembersStyles = StyleSheet.create({
  shareButton: {
    minHeight: 48,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 20,
  },
  shareButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.white,
  },
  shareText: {
    fontFamily: fonts.medium,
    fontSize: 14.5,
    color: colors.primary,
  },
  approvalCard: {
    padding: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    marginBottom: 24,
  },
  doneButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
  },

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

  inviteCard: { marginTop: 12 },

  inviteLabel: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    marginBottom: 12,
  },

  inviteDescription: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 18,
  },

  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    gap: 8,
  },

  inviteCode: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 14.5,
    color: colors.textPrimary,
  },

  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },

  copyButtonText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.bold,
  },
});
