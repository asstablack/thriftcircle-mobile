import { PaymentDetailsFields } from '@/components/payment-details';
import { emptyPaymentDetails, cleanPaymentDetails, paymentDetailsError } from '@/services/paymentDetails';
import * as Clipboard from 'expo-clipboard';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { OrganizerBottomNavigation } from '@/components/organizer-chrome';
import { createGroupStyles as styles } from '@/styles/createGroupStyles';
import { colors } from '@/constants/color';
import { useAuthStore } from '@/store/authStore';
import { createGroup } from '@/services/groupApi';
import { saveGroupRules } from '@/services/groupWorkflowApi';

const titles = [
  'Create a New Group',
  'Contribution Setup',
  'Group Rules',
  'Payout Configuration',
  'Review Group Setup',
];
const descriptions = [
  'Start a savings group and achieve your goals together.',
  'Set the contribution amount, frequency and start date for your group.',
  'Define how your group will work. These rules help everyone stay aligned.',
  'Choose how payout turns will be arranged and recorded.',
  'Please review your group details before creating it. You can edit any section below.',
];
function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T12:00:00');
  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === Number(value.slice(0, 4)) &&
    date.getMonth() + 1 === Number(value.slice(5, 7)) &&
    date.getDate() === Number(value.slice(8, 10))
  );
}
function WizardButton({
  label,
  onPress,
  secondary = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      style={
        secondary
          ? styles.secondaryAction
          : styles.createButton
      }
      onPress={onPress}
    >
      <Text
        style={
          secondary
            ? styles.backButton
            : styles.createButtonText
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function CreateGroupScreen() {
  const [frequencyOpen, setFrequencyOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({...emptyPaymentDetails});
  const [step, setStep] = useState(0);
  const [groupName, setGroupName] = useState('');
  const [limit, setLimit] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [grace, setGrace] = useState('0');
  const [late, setLate] = useState(true);
  const [picker, setPicker] = useState<
    'start' | 'deadline' | null
  >(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<{
    _id: string;
    groupName: string;
    inviteCode?: string;
  } | null>(null);
  const [uncertain, setUncertain] = useState(false);
  const [done, setDone] = useState(false);
  const submitting = useRef(false);
  const scroll = useRef<ScrollView>(null);
  const changeStep = (next: number) => {
    setError('');
    setPicker(null);
    setStep(next);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  const validation = (section: number) => {
    if (section === 0 && !groupName.trim())
      return 'Enter a name for your group.';
    if (
      section === 0 &&
      limit.trim() &&
      (!/^\d+$/.test(limit.trim()) ||
        !Number.isSafeInteger(Number(limit)) ||
        Number(limit) < 2)
    )
      return 'Maximum members must be a whole number of at least 2, or leave it blank.';
    if (
      section === 1 &&
      (!Number.isFinite(Number(amount.replace(/,/g, ''))) ||
        Number(amount.replace(/,/g, '')) < 0.01)
    )
      return 'Enter a contribution amount of at least ₦0.01.';
    if (
      section === 1 &&
      (!validDate(startDate) || !validDate(deadline))
    )
      return 'Choose valid start and deadline dates (YYYY-MM-DD).';
    if (section === 1 && paymentDetailsError(paymentDetails, true)) return paymentDetailsError(paymentDetails, true);
    if (section === 1 && deadline < startDate)
      return 'The deadline must be on or after the start date.';
    if (
      section === 2 &&
      (!/^\d+$/.test(grace.trim()) || Number(grace) > 30)
    )
      return 'Grace period must be a whole number from 0 to 30.';
    return '';
  };
  const continueStep = () => {
    const message = validation(step);
    if (message) setError(message);
    else changeStep(step + 1);
  };
  const submit = async () => {
    if (submitting.current || uncertain) return;
    for (const section of [0, 1, 2]) {
      const message = validation(section);
      if (message) {
        changeStep(section);
        setError(message);
        return;
      }
    }
    submitting.current = true;
    setBusy(true);
    setError('');
    let saved = created;
    try {
      if (!saved) {
        const result = await createGroup({
          groupName: groupName.trim(),
          contributionAmount: Number(
            amount.replace(/,/g, ''),
          ),
          frequency,
          startDate,
          contributionDeadline: deadline,
          ...(Object.values(cleanPaymentDetails(paymentDetails)).some(Boolean) ? {paymentDetails:cleanPaymentDetails(paymentDetails)} : {}),
        });
        if (!result?._id)
          throw new Error(
            'The server did not return the created group.',
          );
        saved = {
          _id: result._id,
          groupName: result.groupName,
          inviteCode: result.inviteCode,
        };
        setCreated(saved);
        useAuthStore.getState().setSelectedGroup({
          id: saved._id,
          groupName: saved.groupName,
          role: 'organizer',
        });
      }
      await saveGroupRules(saved._id, {
        gracePeriodDays: Number(grace),
        allowLateSubmission: late,
        maxMembers: limit.trim() ? Number(limit) : null,
      });
      setDone(true);
    } catch (reason) {
      if (!saved) setUncertain(true);
      setError(
        saved
          ? 'Your group was created, but its rules could not be confirmed. Retry saving the rules, or open the group to check them.'
          : (reason instanceof Error
              ? reason.message
              : 'Unable to confirm group creation.') +
              ' Check your groups before creating another to avoid duplicates.',
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };
  const field = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    numeric = false,
    placeholder = '',
  ) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        style={styles.input}
        value={value}
        onChangeText={(value) => { onChange(value); setError(''); }}
        keyboardType={numeric ? 'decimal-pad' : 'default'}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
      />
    </View>
  );
  const summary = (
    title: string,
    text: string,
    section: number,
    icon: 'users' | 'shield' | 'clock' | 'list',
  ) => (
    <View style={styles.reviewCard}>
      <View style={styles.iconTile}><Feather name={icon} size={24} color={colors.primary}/></View>
      <View style={styles.cardContent}><Text style={styles.reviewTitle}>{title}</Text><Text style={styles.helper}>{text}</Text></View>
      {!created && <Pressable accessibilityRole="button" accessibilityLabel={'Edit '+title} onPress={()=>changeStep(section)}><Text style={styles.editLink}>Edit</Text></Pressable>}
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: !busy,
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }
      >
        {busy ? (
          <View style={styles.saving}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
            />
            <Text style={styles.savingTitle}>
              Creating your group…
            </Text>
            <Text style={styles.savingText}>
              This may take a few moments
            </Text>
            <Text style={styles.savingText}>
              {created
                ? '✓ Group details saved\nSaving group rules…'
                : 'Saving group details…'}
            </Text>
          </View>
        ) : done ? (
          <ScrollView
            contentContainerStyle={styles.success}
          >
            <Feather
              name="check-circle"
              size={64}
              style={styles.successIcon}
              color={colors.primary}
            />
            <Text style={styles.successTitle}>
              Group created successfully!
            </Text>
            <Text
              style={[styles.helper, styles.successMessage]}
            >
              Your savings group has been created. Now invite members to get started!
            </Text>
            <View style={styles.reviewCard}><View style={styles.iconTile}><Feather name="users" size={24} color={colors.primary}/></View><View style={styles.cardContent}><Text style={styles.reviewTitle}>{created?.groupName}</Text><Text style={styles.helper}>{limit ? 'Member limit: '+limit : 'No member limit'}</Text></View></View>
            <Text style={styles.label}>Invite Members</Text>
            <Text style={styles.helper}>Share the group code so others can request to join your savings group.</Text>
            {created?.inviteCode && <Pressable accessibilityRole="button" accessibilityLabel="Copy invite code" style={styles.dateButton} onPress={async()=>{try {await Clipboard.setStringAsync(created.inviteCode!);setCopyMessage('Invite code copied.');}catch{setCopyMessage('Unable to copy. Please use Invite Members.');}}}><Text selectable style={styles.dateInputText}>{created.inviteCode}</Text><Feather name="copy" size={20} color={colors.primary}/></Pressable>}
            {!!copyMessage && <Text accessibilityLiveRegion="polite" style={styles.helper}>{copyMessage}</Text>}
            <WizardButton
              label="Invite Members"
              onPress={() =>
                router.replace('/invite-members')
              }
            />
            <WizardButton label="Done" onPress={()=>router.replace('/organizer-dashboard')}/>
            <WizardButton
              label="View Group"
              onPress={() =>
                router.replace('/group-details')
              }
              secondary
            />
          </ScrollView>
        ) : (
          <>
            <View style={styles.stepHeader}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back"
                disabled={!!created || uncertain}
                onPress={() =>
                  step
                    ? changeStep(step - 1)
                    : router.replace('/group-selection')
                }
              >
                <Feather
                  name="chevron-left"
                  size={24}
                  color={colors.textSecondary}
                />
              </Pressable>
              <Text style={styles.stepTitle}>
                {titles[step]}
              </Text>
            </View>
            <ScrollView
              ref={scroll}
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.helper}>
                {descriptions[step]}
              </Text>
              {step === 0 && (
                <View style={styles.form}>
                  {field(
                    'Group Name',
                    groupName,
                    setGroupName,
                    false,
                    'e.g. Family Savings Circle',
                  )}
                  {field(
                    'Member Count (optional)',
                    limit,
                    setLimit,
                    true,
                    'No limit',
                  )}
                  <Text style={styles.helper}>
                    This limits active membership; members
                    still need organizer approval.
                  </Text>
                </View>
              )}
              {step === 1 && (
                <View style={styles.form}>
                  {field(
                    'Contribution Amount',
                    amount,
                    setAmount,
                    true,
                    'e.g. 50000',
                  )}
                  <Text style={styles.label}>
                    Contribution Frequency
                  </Text>
                  <Pressable accessibilityRole="button" accessibilityLabel="Contribution frequency" accessibilityState={{expanded:frequencyOpen}} style={styles.dateButton} onPress={()=>setFrequencyOpen(!frequencyOpen)}><Text style={styles.dateInputText}>{frequency.charAt(0).toUpperCase()+frequency.slice(1)}</Text><Feather name="chevron-down" size={18} color={colors.textSecondary}/></Pressable>
                  {frequencyOpen && <View style={styles.frequencyRow}>
                    {['daily', 'weekly', 'monthly'].map(
                      (value) => (
                        <Pressable
                          key={value}
                          accessibilityRole="radio"
                          accessibilityState={{
                            checked: frequency === value,
                          }}
                          style={[
                            styles.frequencyButton,
                            frequency === value &&
                              styles.frequencyButtonActive,
                          ]}
                          onPress={() =>
                            { setFrequency(value); setFrequencyOpen(false); }
                          }
                        >
                          <Text
                            style={[
                              styles.frequencyText,
                              frequency === value &&
                                styles.frequencyTextActive,
                            ]}
                          >
                            {value.charAt(0).toUpperCase() +
                              value.slice(1)}
                          </Text>
                        </Pressable>
                      ),
                    )}
                  </View>}
                  {Platform.OS === 'web' ? (
                    <>
                      {field(
                        'Contribution Start Date',
                        startDate,
                        setStartDate,
                        false,
                        'YYYY-MM-DD',
                      )}
                      {field(
                        'Contribution Deadline',
                        deadline,
                        setDeadline,
                        false,
                        'YYYY-MM-DD',
                      )}
                    </>
                  ) : (
                    <>
                      {(['start', 'deadline'] as const).map(
                        (kind) => (
                          <View key={kind}>
                            <Text style={styles.label}>
                              {kind === 'start'
                                ? 'Contribution Start Date'
                                : 'Contribution Deadline'}
                            </Text>
                            <Pressable
                              accessibilityRole="button"
                              style={styles.dateButton}
                              onPress={() =>
                                setPicker(kind)
                              }
                            >
                              <Text
                                style={styles.dateInputText}
                              >
                                {(kind === 'start'
                                  ? startDate
                                  : deadline) ||
                                  'Select date'}
                              </Text>
                              <Feather
                                name="calendar"
                                size={18}
                                color={colors.textSecondary}
                              />
                            </Pressable>
                          </View>
                        ),
                      )}
                      {picker && (
                        <DateTimePicker
                          value={
                            new Date(
                              ((picker === 'start'
                                ? startDate
                                : deadline) ||
                                new Date()
                                  .toISOString()
                                  .slice(0, 10)) +
                                'T12:00:00',
                            )
                          }
                          mode="date"
                          onChange={(_, date) => {
                            const kind = picker;
                            setPicker(null);
                            if (date) {
                              const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                              if (kind === 'start')
                                setStartDate(value);
                              else setDeadline(value);
                            }
                          }}
                        />
                      )}
                    </>
                  )}
                  {Number(amount.replace(/,/g,''))>0 && <View style={styles.ruleRow}><Feather name="info" size={20} color={colors.primary}/><Text style={[styles.helper,styles.cardContent]}>Each member will contribute ₦{Number(amount.replace(/,/g,'')).toLocaleString('en-NG')} {frequency}{startDate ? ' starting '+startDate : ''}.</Text></View>}
                </View>
              )}
              {step === 1 && <><Text style={styles.helper}>Payment details are optional now. If added, complete all three bank fields. You can also add them later in Group details.</Text><PaymentDetailsFields value={paymentDetails} onChange={value=>{setPaymentDetails(value);setError('');}}/></>}
              {step === 2 && (
                <View style={styles.form}>
                  {field(
                    'Grace Period (days)',
                    grace,
                    setGrace,
                    true,
                  )}
                  <Text style={styles.helper}>
                    Choose 0–30 days after the contribution
                    deadline.
                  </Text>
                  <View style={styles.ruleRow}>
                    <Feather
                      name="clock"
                      size={24}
                      color={colors.primary}
                    />
                    <Text style={styles.reviewTitle}>
                      Allow late evidence submission
                    </Text>
                    <Switch
                      accessibilityLabel="Allow late evidence submission"
                      value={late}
                      onValueChange={setLate}
                    />
                  </View>
                  <View style={styles.infoCard}>
                    <Text style={styles.reviewTitle}>
                      Require organizer approval
                    </Text>
                    <Text style={styles.helper}>
                      All new members require organizer
                      approval.
                    </Text>
                  </View>
                </View>
              )}
              {step === 3 && (
                <View style={styles.form}>
                  <Text style={styles.label}>
                    How will members’ payout turns be
                    decided?
                  </Text>
                  <View style={styles.ruleRow}>
                    <Feather
                      name="check-circle"
                      size={22}
                      color={colors.primary}
                    />
                    <Text style={styles.reviewTitle}>
                      By organiser
                    </Text>
                  </View>
                  <Text style={styles.helper}>
                    Review member positions from Payout
                    order after approving their requests.
                  </Text>
                  <Text style={styles.label}>
                    Payout review
                  </Text>
                  <View style={styles.reviewCard}>
                    <Text style={styles.helper}>
                      The organizer reviews the
                      server-calculated amount and
                      separately confirms each payout after
                      paying the recipient outside
                      ThriftCircle.
                    </Text>
                  </View>
                </View>
              )}
              {step === 4 && (
                <View style={styles.form}>
                  {summary(
                    'Group Details',
                    `${groupName}\nMaximum active members: ${limit || 'No limit'}`,
                    0,
                    'users',
                  )}
                  {summary(
                    'Contribution Setup',
                    `₦${Number(amount.replace(/,/g, '')).toLocaleString('en-NG')} · ${frequency}\nStart: ${startDate}\nDeadline: ${deadline}`,
                    1,
                    'shield',
                  )}
                  {summary('Payment Details', Object.values(cleanPaymentDetails(paymentDetails)).some(Boolean) ? [paymentDetails.bankName,paymentDetails.accountName,paymentDetails.accountNumber,paymentDetails.referenceNote].filter(Boolean).join('\n') : 'Not added yet', 1, 'list')}
                  {summary(
                    'Group Rules',
                    `${grace} grace days\nLate evidence: ${late ? 'Allowed' : 'Not allowed when overdue'}\nOrganizer approval required`,
                    2,
                    'clock',
                  )}
                  {summary(
                    'Payout Configuration',
                    'Organizer assigns after members join. Each payout requires separate approval.',
                    3,
                    'list',
                  )}
                </View>
              )}
              {!!error && (
                <Text
                  accessibilityRole="alert"
                  style={styles.error}
                >
                  {error}
                </Text>
              )}
              {uncertain ? (
                <WizardButton
                  label="Check my groups"
                  onPress={() =>
                    router.replace('/group-selection')
                  }
                />
              ) : (
                <WizardButton
                  label={
                    created
                      ? 'Retry saving rules'
                      : step === 4
                        ? 'Create Group'
                        : 'Continue'
                  }
                  onPress={
                    step === 4
                      ? () => void submit()
                      : continueStep
                  }
                />
              )}
              {created && (
                <WizardButton
                  label="Open created group"
                  onPress={() =>
                    router.replace('/group-details')
                  }
                  secondary
                />
              )}
            </ScrollView>
          </>
        )}
      </KeyboardAvoidingView>
      {!busy && (
        <OrganizerBottomNavigation active="Groups" />
      )}
    </SafeAreaView>
  );
}
