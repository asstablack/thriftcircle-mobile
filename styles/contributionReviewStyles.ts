import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const contributionReviewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  header: {
    height: 64,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    fontSize: 30,
    color: colors.textPrimary,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  headerSpacer: {
    width: 36,
  },

  summaryCard: {
    marginHorizontal: 18,
    marginTop: 18,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },

  sectionLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
  },

  amount: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 14,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  detailLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  detailValue: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  statusBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },

  statusText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginHorizontal: 18,
    marginTop: 22,
    marginBottom: 10,
  },

  evidenceCard: {
    marginHorizontal: 18,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },

  evidenceImage: {
    width: '100%',
    height: 280,
    borderRadius: 8,
    backgroundColor: colors.subtleBackground,
  },

  pdfButton: {
    minHeight: 130,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pdfIcon: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
  },

  pdfText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },

  noteBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.subtleBackground,
    borderRadius: 8,
  },

  noteLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
  },

  noteText: {
    fontSize: 11,
    color: colors.textPrimary,
    lineHeight: 16,
  },

  reviewInput: {
    marginHorizontal: 18,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: 12,
    fontSize: 12,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },

  primaryButton: {
    marginHorizontal: 18,
    marginTop: 14,
    backgroundColor: colors.primary,
    borderRadius: 9,
    paddingVertical: 13,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },

  secondaryButton: {
    marginHorizontal: 18,
    marginTop: 9,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 9,
    paddingVertical: 13,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '700',
  },

  disabledButton: {
    opacity: 0.6,
  },

  emptyCard: {
    marginHorizontal: 18,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 5,
  },

  emptyText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },

  issueCard: {
    marginHorizontal: 18,
    marginTop: 20,
    backgroundColor: '#FDE8E8',
    borderRadius: 10,
    padding: 14,
  },

  issueTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.error,
    marginBottom: 5,
  },

  issueText: {
    fontSize: 11,
    color: colors.textPrimary,
    lineHeight: 16,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: colors.textSecondary,
  },
});