import { View, Text, Pressable } from 'react-native';
import { memberDashboardStyles } from '@/styles/memberDashboardStyles';

export default function MemberDashboard() {
  return (
    <View style={memberDashboardStyles.container}>

      <View style={memberDashboardStyles.header}>
        <View>
          <Text style={memberDashboardStyles.greeting}>
            Good afternoon 👋
          </Text>

          <Text style={memberDashboardStyles.subtitle}>
            Here's your savings overview
          </Text>
        </View>

        <Pressable style={memberDashboardStyles.notificationButton}>
          <Text style={memberDashboardStyles.notificationIcon}>
            🔔
          </Text>
        </Pressable>
      </View>

    </View>
  );
}