import { ScrollView, Text, View, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { memberDetailStyles as styles } from '@/styles/memberDetailStyles';

export default function MemberDetailScreen() {
  const { memberId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>T</Text>
          </View>

          <Text style={styles.logoName}>ThriftCircle</Text>
        </View>

        <View style={styles.headerActions}>
          <Text style={styles.headerIcon}>♧</Text>

          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>OR</Text>
          </View>

          <Text style={styles.chevron}>⌄</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>
            ← Back to Member List
          </Text>
        </Pressable>

        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AO</Text>
          </View>

          <Text style={styles.memberName}>Ada Okafor</Text>

          <Text style={styles.memberMeta}>
            Member ID: {memberId || '001'}
          </Text>

          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>ACTIVE</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Member Overview
        </Text>

        <View style={styles.overviewCard}>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Position</Text>
            <Text style={styles.overviewValue}>1 of 10</Text>
          </View>

          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Contribution</Text>
            <Text style={styles.overviewValue}>₦10,000</Text>
          </View>

          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Status</Text>
            <Text style={styles.confirmedText}>Confirmed</Text>
          </View>

          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Joined</Text>
            <Text style={styles.overviewValue}>June 2026</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Contribution Progress
        </Text>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Current Cycle
            </Text>

            <Text style={styles.progressAmount}>
              ₦80,000 / ₦100,000
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <Text style={styles.progressPercentage}>
            80% completed
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Contribution History
        </Text>

        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyHeaderText}>Cycle</Text>
            <Text style={styles.historyHeaderText}>Amount</Text>
            <Text style={styles.historyHeaderText}>Status</Text>
          </View>

          <View style={styles.historyRow}>
            <Text style={styles.historyText}>August 2026</Text>
            <Text style={styles.historyText}>₦10,000</Text>

            <View style={styles.confirmedBadge}>
              <Text style={styles.confirmedBadgeText}>
                Confirmed
              </Text>
            </View>
          </View>

          <View style={styles.historyRow}>
            <Text style={styles.historyText}>July 2026</Text>
            <Text style={styles.historyText}>₦10,000</Text>

            <View style={styles.confirmedBadge}>
              <Text style={styles.confirmedBadgeText}>
                Confirmed
              </Text>
            </View>
          </View>

          <View style={styles.historyRow}>
            <Text style={styles.historyText}>June 2026</Text>
            <Text style={styles.historyText}>₦10,000</Text>

            <View style={styles.confirmedBadge}>
              <Text style={styles.confirmedBadgeText}>
                Confirmed
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>⌂</Text>
          <Text style={styles.navText}>Home</Text>
        </View>

        <View style={[styles.navItem, styles.navItemActive]}>
          <Text style={styles.navIcon}>▦</Text>
          <Text style={styles.navTextActive}>Groups</Text>
        </View>

        <View style={styles.navItem}>
          <Text style={styles.navIcon}>▣</Text>
          <Text style={styles.navText}>Contributions</Text>
        </View>

        <View style={styles.navItem}>
          <Text style={styles.navIcon}>◷</Text>
          <Text style={styles.navText}>Activity</Text>
        </View>

        <View style={styles.navItem}>
          <Text style={styles.navIcon}>○</Text>
          <Text style={styles.navText}>Profile</Text>
        </View>
      </View>
    </View>
  );
}
