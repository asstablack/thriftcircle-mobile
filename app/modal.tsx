import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { modalStyles as styles } from '@/styles/modalStyles';
export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'ThriftCircle' }} />
      <Image
        source={require('@/assets/figma/94eba.png')}
        contentFit="contain"
        style={styles.logo}
      />
      <Text style={styles.title}>Your savings circle</Text>
      <Text style={styles.body}>
        Save together. Grow together.
      </Text>
      <Link
        href="/group-selection"
        dismissTo
        style={styles.link}
      >
        Return to your groups
      </Link>
    </View>
  );
}
