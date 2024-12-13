import { StatusBar } from 'expo-status-bar';

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight,faArrowLeft, faCalendarWeek } from '@fortawesome/free-solid-svg-icons';
// import Icon from 'react-native-vector-icons/MaterialIcons'; // Or any icon library you prefer

import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Workers from './Workers';
import AttendanceBoard from './AttendanceBoard';


const WorkersList = () => {

    const navigation = useNavigation();
        
      const handleHome = () => {
        navigation.navigate("AttendanceBoard");
      };

  return (
     <View style={styles.container}>
        <View style={styles.headerContainer}>
        <Ionicons name="arrow-back" size={30} color="black" onPress={handleHome}/>
        <Text style={styles.headerText}>Workers List</Text>
        {/* <Ionicons name="settings" size={28} color="black" /> */}
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card}>
        <Image style={styles.workerImage}
                source={{ uri: 'https://via.placeholder.com/50' }} // Placeholder image
            />
          <View>
          <Text style={styles.cardNumber}>John Doe</Text>
          <Text style={styles.cardLabel}>Engineer</Text>
          </View>
          {/* Date of today */}
        </TouchableOpacity>
        
      </View>
      <View style={styles.cardsContainer}>
        
      <TouchableOpacity style={styles.card}>
        <Image style={styles.workerImage}
                source={{ uri: 'https://via.placeholder.com/50' }} // Placeholder image
            />
          <View>
          <Text style={styles.cardNumber}>Justo Sinak</Text>
          <Text style={styles.cardLabel}>Engineer</Text>
          </View>
          {/* Date of today */}
        </TouchableOpacity>
        
      </View>
    </View>
  )
}

export default WorkersList

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 16,
        paddingVertical: 60,
      },
      headerContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        gap: 30,
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
        fontSize: 25,
        fontWeight: 'bold',
        color: "white",
      },
      cardLabel: {
        fontSize: 14,
        color: 'white',
      },
      workerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 8,
      },
});