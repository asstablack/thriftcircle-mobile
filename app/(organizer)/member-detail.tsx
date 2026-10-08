import { Redirect, useLocalSearchParams } from 'expo-router';

export default function MemberDetailScreen() {
  const { memberId } = useLocalSearchParams<{
    memberId?: string;
  }>();

  if (!memberId) {
    return <Redirect href="/members" />;
  }

  return (
    <Redirect
      href={{
        pathname: '/contributions',
        params: { memberId, tab: 'Overview' },
      }}
    />
  );
}
