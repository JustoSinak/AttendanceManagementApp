import { StatusBar } from 'expo-status-bar';

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight,faArrowLeft, faCalendarWeek } from '@fortawesome/free-solid-svg-icons';
// import Icon from 'react-native-vector-icons/MaterialIcons'; // Or any icon library you prefer

import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Workers from './Workers';

const AttendanceBoard = () => {
  const navigation = useNavigation();

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


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Ionicons name="menu" size={34} color="black" />
        <Text style={styles.headerText}>Attendance Board</Text>
        <Ionicons name="settings" size={28} color="black" />
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card} onPress={handleWorkers}>
        <FontAwesome name="calendar-check-o" size={34} color="white" />
          <View>
          <Text style={styles.cardNumber}>32</Text>
          <Text style={styles.cardLabel}>Total workers present</Text>
          </View>
          {/* Date of today */}
        </TouchableOpacity>
        
      </View>
      <View style={styles.cardsContainer}>
        
        <TouchableOpacity style={styles.card} onPress={hanWorkers}>
        <FontAwesome name="calendar-times-o" size={34} color="white" />
          <View>
          <Text style={styles.cardNumber}>5</Text>
          <Text style={styles.cardLabel}>Total workers absent</Text>
          </View>
          {/* Date of today */}
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
});

export default AttendanceBoard;