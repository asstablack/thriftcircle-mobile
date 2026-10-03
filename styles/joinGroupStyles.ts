import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const joinGroupStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    padding: 20,
    paddingTop: 55,
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
    marginBottom: 30,
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
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    fontSize: 15,
    color: colors.textPrimary,
  },

  joinButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },

  joinButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },

  joinButtonDisabled: {
  opacity: 0.6,
  },
});