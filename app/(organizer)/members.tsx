import { ScrollView, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { membersStyles as styles } from '@/styles/membersStyles';

const members = [
  {
    id: '1',
    name: 'Ada Okafor',
    initials: 'AO',
    status: 'Paid',
    amount: '₦10,000',
  },
  {
    id: '2',
    name: 'Michael Yusuf',
    initials: 'MY',
    status: 'Paid',
    amount: '₦10,000',
  },
  {
    id: '3',
    name: 'Tunde Yusuf',
    initials: 'TY',
    status: 'Pending',
    amount: '₦10,000',
  },
  {
    id: '4',
    name: 'Amaka Okafor',
    initials: 'AO',
    status: 'Paid',
    amount: '₦10,000',
  },
  {
    id: '5',
    name: 'David Ali',
    initials: 'DA',
    status: 'Overdue',
    amount: '₦10,000',
  },
];

export default function MembersScreen() {
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
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Members</Text>

          <Text style={styles.pageSubtitle}>
            Manage members and view their contribution status.
          </Text>
        </View>

        <View style={styles.groupCard}>
          <View>
            <Text style={styles.groupName}>
              My Family Ajo
            </Text>

            <Text style={styles.groupDetails}>
              10 members • Monthly • ₦10,000
            </Text>
          </View>

          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>ACTIVE</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>10</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Paid</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Overdue</Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>

          <Text style={styles.searchText}>
            Search members
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Members</Text>

          <Text style={styles.memberCount}>10 members</Text>
        </View>

        {members.map((member) => (
          <Pressable
            key={member.id}
            style={styles.memberCard}
            onPress={() =>
              router.push({
                pathname: '/member-detail',
                params: { memberId: member.id },
              })
            }
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {member.initials}
              </Text>
            </View>

            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>
                {member.name}
              </Text>

              <Text style={styles.memberAmount}>
                {member.amount} contribution
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                member.status === 'Paid'
                  ? styles.paidBadge
                  : member.status === 'Pending'
                    ? styles.pendingBadge
                    : styles.overdueBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  member.status === 'Paid'
                    ? styles.paidText
                    : member.status === 'Pending'
                      ? styles.pendingText
                      : styles.overdueText,
                ]}
              >
                {member.status}
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}
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