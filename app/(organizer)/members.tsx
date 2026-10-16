import { GroupScreenHeader } from '@/components/group-screen-header';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, Stack, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { OrganizerBottomNavigation } from '@/components/organizer-chrome';
import {
  getGroupDetails,

  getCurrentCycle,
} from '@/services/groupApi';
import { useAuthStore } from '@/store/authStore';
import { membersStyles as styles } from '@/styles/membersStyles';
import { colors } from '@/constants/color';

type Member = {
  userId: {
    _id: string;
    fullName: string;
    phoneNumber?: string;
  };
  payoutOrder?: number;
  status: string;
};
type Details = {
  group: {
    groupName: string;
    contributionAmount: number;
    frequency: string;
    status: string;
  };
  members: Member[];
};
type Cycle = { cycleNumber: number; openedAt?: string };

export default function MembersScreen() {
  const group = useAuthStore(
    (state) => state.selectedGroup,
  );
  const [details, setDetails] = useState<Details | null>(
    null,
  );
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [grid, setGrid] = useState(false);
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (!group || group.role !== 'organizer') {
        router.replace('/group-selection');
        return;
      }
      setLoading(true);
      setError(null);
      Promise.all([
        getGroupDetails(group.id),

        getCurrentCycle(group.id),
      ])
        .then(
          ([result, cycle]: [
            Details,

            Cycle | null,
          ]) => {
            if (!active) return;
            setDetails(result);
            setCurrentCycle(cycle);
            setPage(1);
          },
        )
        .catch((reason: unknown) => {
          if (active)
            setError(
              reason instanceof Error
                ? reason.message
                : 'Unable to load members.',
            );
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
      // Retry reloads the same selected group.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group?.id, group?.role, reload]),
  );
  const members = (details?.members || []).filter(
    (member) =>
      Boolean(member.userId) &&
      (
        (member.userId?.fullName || '') +
        ' ' +
        (member.userId?.phoneNumber || '')
      )
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const filteredMembers = members.filter(member => statusFilter === 'All' || member.status.toLowerCase() === statusFilter.toLowerCase());
  const pageCount = Math.max(1, Math.ceil(filteredMembers.length / 7));
  const activePage = Math.min(page, pageCount);
  const visibleMembers = filteredMembers.slice((activePage - 1) * 7, activePage * 7);
  const openMember = (id: string) => router.push({ pathname: '/member-detail', params: { memberId: id } });
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <GroupScreenHeader
        variant="plain"
        title="Member List"

      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : error ? (
          <View style={styles.groupCard}>
            <Text style={styles.groupDetails}>{error}</Text>
            <Pressable
              onPress={() =>
                setReload((value) => value + 1)
              }
            >
              <Text style={styles.paidText}>Try Again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.cycleStrip}>
              <View><Text style={styles.statLabel}>Current Cycle</Text><Text style={styles.groupName}>{currentCycle ? (currentCycle.openedAt ? new Date(currentCycle.openedAt).toLocaleDateString('en-NG', {month:'long',year:'numeric'}) + ' Cycle' : 'Cycle ' + currentCycle.cycleNumber) : 'No active cycle'}</Text></View>
              {currentCycle && <Text style={styles.activeBadgeText}>Active</Text>}
            </View>
            <View style={styles.statsRow}>
              {[['Total Members', details?.members.length || 0], ['Active Members', details?.members.filter(m=>m.status==='active').length || 0], ['Inactive Members', details?.members.filter(m=>m.status==='inactive').length || 0]].map(([label,value],index)=><View key={label} style={styles.statCard}><Text style={[styles.statValue,index===0 ? styles.infoText : index===1 ? styles.activeText : null]}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>)}
            </View>
            <Pressable
              accessibilityRole="button"
              style={styles.inviteButton}
              onPress={() => router.push('/invite-members')}
            >
              <Text style={styles.inviteButtonText}>
                Add new member
              </Text>
            </Pressable>
            <View style={styles.searchBox}>
              <Feather
                name="search"
                size={18}
                color={colors.textSecondary}
              />
              <TextInput
                style={styles.searchText}
                accessibilityLabel="Search members"
                placeholder="Search name or phone number"
                value={query}
                onChangeText={(value) => { setQuery(value); setPage(1); }}
              />
            </View>
            <View style={styles.filters}>
              <Pressable accessibilityRole="button" accessibilityLabel="Filter membership status" accessibilityState={{expanded:filterOpen}} style={styles.filter} onPress={()=>setFilterOpen(!filterOpen)}><Text style={styles.memberAmount}>{statusFilter === 'All' ? 'All Status' : statusFilter}</Text><Feather name="chevron-down" size={16} color={colors.textSecondary}/></Pressable>
              <View style={styles.viewControls}>{[false,true].map(value=><Pressable key={String(value)} accessibilityRole="button" accessibilityLabel={value ? 'Grid view' : 'List view'} accessibilityState={{selected:grid===value}} style={[styles.viewButton,grid===value && styles.filterActive]} onPress={()=>setGrid(value)}><Feather name={value?'grid':'list'} size={18} color={colors.primary}/></Pressable>)}</View>
            </View>
            {filterOpen && <View style={styles.filters}>{['All','Active','Inactive'].map(label=><Pressable key={label} accessibilityRole="button" style={styles.filter} onPress={()=>{setStatusFilter(label);setPage(1);setFilterOpen(false)}}><Text style={styles.memberAmount}>{label}</Text></Pressable>)}</View>}
            {!grid && <View style={styles.tableHeader}><Text style={styles.nameCell}>Member</Text><Text style={styles.phoneCell}>Phone Number</Text><Text style={styles.statusCell}>Status</Text><Text style={styles.actionCell}> </Text></View>}
            {!filteredMembers.length && <Text style={styles.emptyText}>No matching members.</Text>}
            <View style={grid ? styles.grid : undefined}>
            {visibleMembers.map(member=><Pressable key={member.userId._id} accessibilityRole="button" accessibilityLabel={'View '+member.userId.fullName} style={grid ? styles.gridCard : styles.memberCard} onPress={()=>openMember(member.userId._id)}>
              <Text style={grid ? styles.memberName : styles.nameCell}>{member.userId.fullName}</Text>
              <Text style={grid ? styles.memberAmount : styles.phoneCell}>{member.userId.phoneNumber || 'Not provided'}</Text>
              <View style={styles.statusCell}><Text style={[styles.statusBadge,member.status==='active'?styles.paidBadge:styles.inactiveBadge,styles.statusText]}>{member.status==='active'?'Active':member.status.charAt(0).toUpperCase()+member.status.slice(1)}</Text></View>
              {!grid && <Feather name="chevron-right" size={16} color={colors.textSecondary}/>}
            </Pressable>)}
            </View>
            <View style={styles.pagination}><Text style={styles.statLabel}>Showing {filteredMembers.length ? (activePage-1)*7+1 : 0}–{Math.min(activePage*7,filteredMembers.length)} of {filteredMembers.length} members</Text><Pressable accessibilityRole="button" accessibilityLabel="Previous page" disabled={activePage===1} onPress={()=>setPage(activePage-1)} style={styles.viewButton}><Feather name="chevron-left" size={16} color={colors.textSecondary}/></Pressable><Text style={styles.statLabel}>{activePage} / {pageCount}</Text><Pressable accessibilityRole="button" accessibilityLabel="Next page" disabled={activePage===pageCount} onPress={()=>setPage(activePage+1)} style={styles.viewButton}><Feather name="chevron-right" size={16} color={colors.textSecondary}/></Pressable></View>
            <Pressable accessibilityRole="button" style={styles.requestLink} onPress={()=>router.push('/join-requests')}><Text style={styles.paidText}>Review pending join requests</Text></Pressable>
          </>
        )}
      </ScrollView>
      <OrganizerBottomNavigation active="Groups" />
    </SafeAreaView>
  );
}
