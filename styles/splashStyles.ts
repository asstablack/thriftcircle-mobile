import { StyleSheet } from 'react-native';
import { colors } from '@/constants/color';

export const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 200,
    height: 200,
  },
});
