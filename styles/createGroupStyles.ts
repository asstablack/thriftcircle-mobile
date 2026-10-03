import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const createGroupStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingTop: 55,
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

  form: {
    gap: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginTop: 12,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    fontSize: 15,
    color: colors.textPrimary,
  },

  frequencyRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },

  frequencyButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  frequencyButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },

  frequencyText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  frequencyTextActive: {
    color: colors.primary,
  },

  createButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },

  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },

  dateInputText: {
  fontSize: 15,
  color: colors.textPrimary,
},

datePlaceholderText: {
  fontSize: 15,
  color: colors.textSecondary,
},
});