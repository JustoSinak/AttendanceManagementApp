import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDatabaseContext } from '../contexts/DatabaseContext';

const Settings = () => {
  const navigation = useNavigation();
  const { workers, attendanceStats } = useDatabaseContext();
  
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This feature will export all attendance data to a CSV file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          // TODO: Implement data export
          Alert.alert('Success', 'Data export feature coming soon!');
        }},
      ]
    );
  };

  const handleBackupData = () => {
    Alert.alert(
      'Backup Data',
      'This will create a backup of all your attendance data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Backup', onPress: () => {
          // TODO: Implement data backup
          Alert.alert('Success', 'Data backup feature coming soon!');
        }},
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all workers and attendance records. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete All', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Confirmation', 'Are you absolutely sure?', [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Yes, Delete All', 
                style: 'destructive',
                onPress: () => {
                  // TODO: Implement data clearing
                  Alert.alert('Info', 'Data clearing feature coming soon!');
                }
              },
            ]);
          }
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showArrow = true,
    rightComponent 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color="#028831" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && !rightComponent && (
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* App Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{workers.length}</Text>
            <Text style={styles.statLabel}>Total Workers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{attendanceStats.presentToday}</Text>
            <Text style={styles.statLabel}>Present Today</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{attendanceStats.absentToday}</Text>
            <Text style={styles.statLabel}>Absent Today</Text>
          </View>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <SettingItem
          icon="notifications"
          title="Notifications"
          subtitle="Get notified about attendance updates"
          showArrow={false}
          rightComponent={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#ccc', true: '#028831' }}
            />
          }
        />

        <SettingItem
          icon="cloud-upload"
          title="Auto Backup"
          subtitle="Automatically backup data daily"
          showArrow={false}
          rightComponent={
            <Switch
              value={autoBackup}
              onValueChange={setAutoBackup}
              trackColor={{ false: '#ccc', true: '#028831' }}
            />
          }
        />
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <SettingItem
          icon="download"
          title="Export Data"
          subtitle="Export attendance data to CSV"
          onPress={handleExportData}
        />

        <SettingItem
          icon="cloud-upload"
          title="Backup Data"
          subtitle="Create a backup of all data"
          onPress={handleBackupData}
        />

        <SettingItem
          icon="trash"
          title="Clear All Data"
          subtitle="Delete all workers and attendance records"
          onPress={handleClearData}
        />
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <SettingItem
          icon="information-circle"
          title="App Version"
          subtitle="1.0.0"
          showArrow={false}
        />

        <SettingItem
          icon="help-circle"
          title="Help & Support"
          subtitle="Get help using the app"
          onPress={() => Alert.alert('Help', 'Help documentation coming soon!')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#028831',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Settings;
