import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { colors } from '@/constants/color';
import { useAuthStore } from '@/store/authStore';
import { organizerDashboardStyles as styles } from '@/styles/organizerDashboardStyles';

export function OrganizerHeader() {
  const user = useAuthStore((state) => state.user);
  const initials = (user?.fullName || 'Organizer')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  return (
    <View style={styles.topHeader}>
      <Image
        source={require('@/assets/images/thriftcirlce-official-logo.png')}
        style={styles.headerLogo}
        resizeMode="contain"
        accessibilityLabel="ThriftCircle"
      />
      <View style={styles.headerActions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open notifications"
          hitSlop={12}
          onPress={() => router.push('/notifications')}
        >
          <Feather
            name="bell"
            size={21}
            color={colors.textDark}
          />
        </Pressable>
        <View style={styles.profileCircle}>
          <Text style={styles.profileText}>{initials}</Text>
        </View>
        <Feather
          name="chevron-down"
          size={20}
          color={colors.textDark}
        />
      </View>
    </View>
  );
}

export function OrganizerBottomNavigation({
  active = 'Home',
}: {
  active?:
    'Home' | 'Groups' | 'Contributions' | 'Activity' | 'Profile';
}) {
  const isMember = useAuthStore(
    (state) => state.selectedGroup?.role === 'member',
  );
  const items = [
    {
      label: 'Home',
      icon: 'home',
      route: isMember
        ? '/member-dashboard'
        : '/organizer-dashboard',
    },
    {
      label: 'Groups',
      icon: 'users',
      route: '/group-selection',
    },
    {
      label: 'Contributions',
      icon: 'file-text',
      route: isMember
        ? '/member-dashboard?view=history'
        : '/contributions',
    },
    { label: 'Activity', icon: 'bell', route: '/notifications' },
    { label: 'Profile', icon: 'user', route: '/profile' },
  ] as const;
  return (
    <View style={styles.bottomNav}>
      {items.map((item) => {
        const selected = active === item.label;
        const content = (
          <>
            <Feather
              name={item.icon}
              size={20}
              color={selected ? colors.primary : colors.textDark}
            />
            <Text
              style={[
                styles.navText,
                selected && styles.navTextActive,
              ]}
            >
              {item.label}
            </Text>
          </>
        );
        return (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[
              styles.navItem,
              selected && styles.navItemActive,
            ]}
            onPress={() =>
              router.navigate(
                item.route as import('expo-router').Href,
              )
            }
          >
            {content}
          </Pressable>
        );
      })}
    </View>
  );
}
