import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 24,
    
    paddingTop: 40,
    paddingBottom: 30,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 50,
  },

  backText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  logo: {
    width: 110,
    height: 82,
    alignSelf: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 22,
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 13,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 13,
  },

  placeholder: {
    color: colors.textSecondary,
  },

  registerButton: {
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  registerButtonDisabled: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  loginText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  loginLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 5,
  },

  passwordContainer: {
  position: 'relative',
  marginBottom: 13,
},

passwordInput: {
  height: 46,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 8,
  backgroundColor: colors.white,
  paddingHorizontal: 13,
  paddingRight: 60,
  fontSize: 13,
  color: colors.textPrimary,
},

eyeButton: {
  position: 'absolute',
  right: 13,
  top: 0,
  height: 46,
  justifyContent: 'center',
},

eyeText: {
  fontSize: 11,
  fontWeight: '600',
  color: colors.primary,
},

termsRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginTop: 4,
  marginBottom: 18,
},

checkbox: {
  width: 18,
  height: 18,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 4,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 8,
  backgroundColor: colors.white,
},

checkboxChecked: {
  backgroundColor: colors.primary,
  borderColor: colors.primary,
},

checkmark: {
  color: colors.white,
  fontSize: 12,
  fontWeight: '700',
},

termsText: {
  flex: 1,
  fontSize: 10,
  lineHeight: 15,
  color: colors.textSecondary,
},

termsLink: {
  color: colors.primary,
  fontWeight: '600',
},
});