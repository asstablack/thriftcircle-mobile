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
  variant = 'brand',
}: {
  title: string;
  subtitle: string;
  disabled?: boolean;
  variant?: 'brand' | 'plain';
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
        {variant === 'brand' ? (
          <Image
            source={require('@/assets/figma/94eba.png')}
            contentFit="contain"
            style={styles.logo}
          />
        ) : (
          <Text style={styles.plainTitle}>{title}</Text>
        )}
      </View>
      <View
        style={[
          styles.banner,
          variant === 'plain' && styles.plainBanner,
        ]}
      >
        {variant === 'brand' && (
          <Text style={styles.title}>{title}</Text>
        )}
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </>
  );
}
