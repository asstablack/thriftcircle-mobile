import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 32,
  paddingTop: 20,
  paddingBottom: 60,
},

  logo: {
    width: 125,
    height: 48,
    marginBottom: 8,
  },

  illustration: {
    width: '100%',
    height: 220,
    marginBottom: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 28,
  },

  titleAccent: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.accent,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 9,
  },

  description: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 310,
    marginBottom: 22,
  },

  actions: {
    width: '100%',
    gap: 9,
  },

  primaryButton: {
    width: '100%',
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },

  secondaryButton: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },

  secondaryButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});