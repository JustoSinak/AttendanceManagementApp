import React from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,FlatList,Image,} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// import { FontAwesome } from '@expo/vector-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight,faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AttendanceBoard from './AttendanceBoard';

const WorkerCard = ({ name, role, hoursWorked, deduction }) => {
  return (
    <View style={styles.workerCard}>
      <Image
        style={styles.workerImage}
        source={{ uri: 'https://via.placeholder.com/50' }} // Placeholder image
      />
      <View style={styles.workerInfo}>
        <Text style={styles.workerName}>{name}</Text>
        <Text style={styles.workerRole}>{role}</Text>
        <Text style={styles.workerDetails}>Hours worked: {hoursWorked}</Text>
        <Text style={styles.workerDetails}>Deduction: {deduction}</Text>
      </View>
    </View>
  );
};

const abWorkers = () => {

  
  
  const workers = [
    { id: '1', name: 'Justo', role: 'Chef-chanter', hoursWorked: '8hrs', deduction: '100FCFA' },
    { id: '2', name: 'Justo', role: 'Chef-chanter', hoursWorked: '8hrs', deduction: '100FCFA' },
    { id: '3', name: 'Justo', role: 'Chef-chanter', hoursWorked: '8hrs', deduction: '100FCFA' },
  ];

  const navigation = useNavigation();
    
  const handleHome = () => {
    navigation.navigate("AttendanceBoard");
  };


  return (
   
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Ionicons name="arrow-back" size={30} color="black" onPress={handleHome}/>
        <Text style={styles.headerText}>Absent Workers</Text>
        {/* <Ionicons name="settings" size={24} color="black" /> */}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search..."
          style={styles.searchInput}
        />
        <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
      </View>

      {/* Worker List */}
      <FlatList
        data={workers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WorkerCard
            name={item.name}
            role={item.role}
            hoursWorked={item.hoursWorked}
            deduction={item.deduction}
          />
        )}
        contentContainerStyle={styles.workerList}
        numColumns={2}
      />

      {/* Add Worker Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add a worker +</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingVertical: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 30,
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  searchIcon: {
    marginLeft: 8,
  },
  workerList: {
    justifyContent: 'space-between',
  },
  workerCard: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 8,
    borderEndColor: 'green',
    borderRadius: 8,
    padding: 12,
    shadowColor: 'green',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  workerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  workerInfo: {
    alignItems: 'flex-start',
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workerRole: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  workerDetails: {
    fontSize: 12,
    color: '#777',
  },
  addButton: {
    backgroundColor: '#028831',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default abWorkers;
