import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { createGroupStyles as styles } from '@/styles/createGroupStyles';
import { colors } from '@/constants/color';
import { createGroup } from '@/services/groupApi';

export default function CreateGroupScreen() {
  const [groupName, setGroupName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('Monthly');

  const [startDate, setStartDate] = useState('');
  const [contributionDeadline, setContributionDeadline] = useState('');

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);

  const [loading, setLoading] = useState(false);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleStartDateChange = (
    event: any,
    selectedDate?: Date,
  ) => {
    setShowStartPicker(false);

    if (selectedDate) {
      setStartDate(formatDate(selectedDate));
    }
  };

  const handleDeadlineChange = (
    event: any,
    selectedDate?: Date,
  ) => {
    setShowDeadlinePicker(false);

    if (selectedDate) {
      setContributionDeadline(formatDate(selectedDate));
    }
  };

  const handleCreateGroup = async () => {
    if (
      !groupName.trim() ||
      !amount.trim() ||
      !frequency.trim() ||
      !startDate.trim() ||
      !contributionDeadline.trim()
    ) {
      Alert.alert(
        'Required fields',
        'Please fill in all fields before creating the group.',
      );
      return;
    }

    const contributionAmount = Number(amount.replace(/,/g, ''));

    if (Number.isNaN(contributionAmount) || contributionAmount <= 0) {
      Alert.alert(
        'Invalid amount',
        'Please enter a valid contribution amount.',
      );
      return;
    }

    try {
      setLoading(true);

      await createGroup({
        groupName: groupName.trim(),
        contributionAmount,
        frequency: frequency.toLowerCase(),
        startDate: startDate.trim(),
        contributionDeadline: contributionDeadline.trim(),
      });

      Alert.alert(
        'Group Created',
        'Your savings group has been created successfully.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/group-selection'),
          },
        ],
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to create the group. Please try again.';

      Alert.alert('Create Group Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Create a Group</Text>

        <Text style={styles.subtitle}>
          Set up your savings group and invite members to start saving together.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Group Name</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Lagos Creatives Circle"
            placeholderTextColor={colors.textSecondary}
            value={groupName}
            onChangeText={setGroupName}
          />

          <Text style={styles.label}>Contribution Amount</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 25000"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.label}>Contribution Frequency</Text>

          <View style={styles.frequencyRow}>
            <Pressable
              style={[
                styles.frequencyButton,
                frequency === 'Weekly' && styles.frequencyButtonActive,
              ]}
              onPress={() => setFrequency('Weekly')}
            >
              <Text
                style={[
                  styles.frequencyText,
                  frequency === 'Weekly' && styles.frequencyTextActive,
                ]}
              >
                Weekly
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.frequencyButton,
                frequency === 'Monthly' && styles.frequencyButtonActive,
              ]}
              onPress={() => setFrequency('Monthly')}
            >
              <Text
                style={[
                  styles.frequencyText,
                  frequency === 'Monthly' && styles.frequencyTextActive,
                ]}
              >
                Monthly
              </Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Start Date</Text>

          <Pressable
            style={styles.input}
            onPress={() => setShowStartPicker(true)}
          >
            <Text
        style={
         startDate
         ? styles.dateInputText
         : styles.datePlaceholderText
            }>
        {startDate || 'Select start date'}
        </Text>
          </Pressable>

          {showStartPicker && (
            <DateTimePicker
              value={startDate ? new Date(startDate) : new Date()}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}

          <Text style={styles.label}>Contribution Deadline</Text>

          <Pressable
            style={styles.input}
            onPress={() => setShowDeadlinePicker(true)}
          >
            <Text
            style={
            contributionDeadline
            ? styles.dateInputText
            : styles.datePlaceholderText
            }>
        {contributionDeadline || 'Select contribution deadline'}
            </Text>
          </Pressable>

          {showDeadlinePicker && (
            <DateTimePicker
              value={
                contributionDeadline
                  ? new Date(contributionDeadline)
                  : new Date()
              }
              mode="date"
              display="default"
              onChange={handleDeadlineChange}
            />
          )}

          <Pressable
            style={styles.createButton}
            onPress={handleCreateGroup}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? 'Creating...' : 'Create Group'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}