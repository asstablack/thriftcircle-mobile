import { Image } from 'expo-image';
import { figmaIconStyles as styles } from '@/styles/figmaIconStyles';

const assets = {
  back: require('@/assets/figma/d675c.svg'),
  organizer: require('@/assets/figma/6f3ba.svg'),
  member: require('@/assets/figma/22859.svg'),
  home: require('@/assets/figma/6048b.svg'),
  groups: require('@/assets/figma/a8f18.svg'),
  contributions: require('@/assets/figma/ef07a.svg'),
  activity: require('@/assets/figma/e9fd5.svg'),
  profile: require('@/assets/figma/2e8ad.svg'),
  copy: require('@/assets/figma/6dd9c.svg'),
  more: require('@/assets/figma/21abb.svg'),
};

export function FigmaIcon({
  name,
  size = 'small',
  color,
}: {
  name: keyof typeof assets;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}) {
  return (
    <Image
      source={assets[name]}
      style={[styles[size], name === 'back' && styles.back]}
      contentFit="contain"
      tintColor={color}
      accessible={false}
    />
  );
}
