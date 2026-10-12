import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';
import { GroupScreenHeader } from './group-screen-header';
import { OrganizerBottomNavigation } from './organizer-chrome';
import { colors } from '@/constants/color';
import { accountStyles as styles } from '@/styles/accountStyles';

export function WorkflowScreen({
  title,
  subtitle,
  state,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  state: {
    loading: boolean;
    busy: boolean;
    error: string | null;
    notice: string | null;
    refresh: () => Promise<void>;
  };
}) {
  return (
    <SafeAreaView style={styles.container}>
      <GroupScreenHeader
        variant="plain"
        title={title}
        subtitle={subtitle}
        disabled={state.busy}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {state.notice && (
          <Text
            accessibilityRole="alert"
            style={styles.notice}
          >
            {state.notice}
          </Text>
        )}
        {state.error && (
          <Text
            accessibilityRole="alert"
            style={styles.error}
          >
            {state.error}
          </Text>
        )}
        {state.loading ? (
          <ActivityIndicator
            color={colors.primary}
            accessibilityLabel="Loading"
          />
        ) : (
          children
        )}
        <Pressable
          accessibilityRole="button"
          disabled={state.loading || state.busy}
          onPress={() => void state.refresh()}
        >
          <Text style={styles.link}>Refresh</Text>
        </Pressable>
      </ScrollView>
      {!state.busy && (
        <OrganizerBottomNavigation active="Groups" />
      )}
    </SafeAreaView>
  );
}
