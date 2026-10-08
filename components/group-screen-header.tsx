import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { colors } from '@/constants/color';
import { groupScreenHeaderStyles as styles } from '@/styles/groupScreenHeaderStyles';

export function GroupScreenHeader({
  title,
  subtitle,
  disabled = false,
}: {
  title: string;
  subtitle: string;
  disabled?: boolean;
}) {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: !disabled,
        }}
      />
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={12}
          disabled={disabled}
          onPress={() =>
            router.canGoBack()
              ? router.back()
              : router.replace('/group-selection')
          }
        >
          <Feather
            name="arrow-left"
            size={22}
            color={colors.textDark}
          />
        </Pressable>
        <Image
          source={require('@/assets/images/thriftcirlce-official-logo.png')}
          contentFit="contain"
          style={styles.logo}
        />
      </View>
      <View style={styles.banner}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </>
  );
}
