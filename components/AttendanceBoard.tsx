import { StatusBar } from 'expo-status-bar';

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { useDatabaseContext } from '../contexts/DatabaseContext';
import LoadingScreen from './LoadingScreen';

const AttendanceBoard = () => {
  const navigation = useNavigation();
  const {
    isInitialized,
    isLoading,
    error,
    attendanceStats,
    refreshAttendanceData
  } = useDatabaseContext();

  useEffect(() => {
    if (isInitialized) {
      refreshAttendanceData();
    }
  }, [isInitialized]);

  const handleWorkers = () => {
    navigation.navigate("Workers");
  };
  const hanWorkers = () => {
    navigation.navigate("abWorkers");
  };
  const hanMonth = () => {
    navigation.navigate("monthAttend");
  };
  const hanWeek = () => {
    navigation.navigate("weekAttend");
  };
  const hanWorkersList = () => {
    navigation.navigate("WorkersList");
  };

  const handleSettings = () => {
    navigation.navigate("Settings");
  };

  // Show loading screen while database is initializing
  if (isLoading || !isInitialized) {
    return <LoadingScreen message="Initializing attendance system..." />;
  }

  // Show error if database failed to initialize
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={48} color="#ff6b6b" />
        <Text style={styles.errorText}>Database Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => refreshAttendanceData()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Ionicons name="menu" size={34} color="black" />
        <Text style={styles.headerText}>Attendance Board</Text>
        <TouchableOpacity onPress={handleSettings}>
          <Ionicons name="settings" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card} onPress={handleWorkers}>
        <FontAwesome name="calendar-check-o" size={34} color="white" />
          <View>
          <Text style={styles.cardNumber}>{attendanceStats.presentToday}</Text>
          <Text style={styles.cardLabel}>Total workers present</Text>
          </View>
        </TouchableOpacity>

      </View>
      <View style={styles.cardsContainer}>

        <TouchableOpacity style={styles.card} onPress={hanWorkers}>
        <FontAwesome name="calendar-times-o" size={34} color="white" />
          <View>
          <Text style={styles.cardNumber}>{attendanceStats.absentToday}</Text>
          <Text style={styles.cardLabel}>Total workers absent</Text>
          </View>
        </TouchableOpacity>

      </View>

      {/* Additional Stats Card */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={[styles.card, styles.statsCard]}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{attendanceStats.totalWorkers}</Text>
              <Text style={styles.statLabel}>Total Workers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{attendanceStats.lateToday}</Text>
              <Text style={styles.statLabel}>Late Today</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Placeholder for additional content */}
      <View style={styles.placeholder}>
        <Text style={styles.mytext}>Check Workers Attendance</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={hanMonth}>
        <Ionicons name="calendar-number-sharp" size={32} color="white" />
          <Text style={styles.buttonText}>Monthly </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={hanWeek}>
        <FontAwesomeIcon icon={faCalendarWeek} size={32} color="white" />
          {/* <Ionicons name="bells" size={24} color="white" /> */}
          <Text style={styles.buttonText}>Weekly</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button}>
          <Ionicons name="location-on" size={24} color="white" />
          <Text style={styles.buttonText}>Tracker</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.button}>
        <FontAwesome name="file-text" size={32} color="white" />
          <Text style={styles.buttonText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={hanWorkersList}>
          <Text style={{fontSize: 25, color: 'white', fontWeight: 'bold'}}>Manage Attendance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingVertical: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#70aa70',
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 30,
  },
  cardNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: "white",
  },
  cardLabel: {
    fontSize: 14,
    color: 'white',
  },
  placeholder: {
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 16,
    marginVertical: 30,
  },
  mytext:{
    position: "relative",
    fontSize: 20,
    fontWeight: 500,
    padding: 30,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 40
  },
  button: {
    width: '30%',
    backgroundColor: '#028831',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  button1: {
    width: '100%',
    backgroundColor: '#028831',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 8,
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#028831',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: '#4a90e2',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    marginTop: 4,
  },
});

export default AttendanceBoard;