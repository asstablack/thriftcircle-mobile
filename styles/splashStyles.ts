import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 190,
    height: 190,
  },
});