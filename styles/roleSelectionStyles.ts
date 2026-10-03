import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const roleSelectionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 28,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 18,
  },

  backText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  logo: {
    width: 125,
    height: 100,
    alignSelf: 'center',
    marginBottom: 5,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },

  roleCard: {
  minHeight: 104,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.white,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 14,
  marginBottom: 14,
},

  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },

  roleIcon: {
  width: 42,
  height: 42,
  borderWidth: 1,
  borderColor: colors.primary,
  borderRadius: 9,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 13,
},

  roleIconText: {
    fontSize: 20,
    color: colors.primary,
  },

  roleInfo: {
    flex: 1,
    paddingRight: 8,
  },

  roleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 3,
  },

  roleDescription: {
  fontSize: 10,
  lineHeight: 15,
  color: colors.textSecondary,
},

  radio: {
    width: 17,
    height: 17,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    borderColor: colors.primary,
  },

  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  continueButton: {
  height: 52,
  backgroundColor: colors.primary,
  borderRadius: 9,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 6,
},

  continueButtonDisabled: {
    opacity: 0.45,
  },

  continueText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
});