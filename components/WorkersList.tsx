import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDatabaseContext } from '../contexts/DatabaseContext';
import LoadingScreen from './LoadingScreen';


const WorkersList = () => {
  const navigation = useNavigation();
  const { workers, isLoading } = useDatabaseContext();

  const handleHome = () => {
    navigation.navigate("AttendanceBoard");
  };

  const handleManageAttendance = () => {
    navigation.navigate("AttendanceManager");
  };

  if (isLoading) {
    return <LoadingScreen message="Loading workers..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="arrow-back" size={30} color="black" onPress={handleHome}/>
        <Text style={styles.headerText}>Workers List</Text>
      </View>

      {/* Manage Attendance Button */}
      <TouchableOpacity style={styles.manageButton} onPress={handleManageAttendance}>
        <Ionicons name="clipboard" size={24} color="white" />
        <Text style={styles.manageButtonText}>Manage Today's Attendance</Text>
      </TouchableOpacity>

      {/* Workers List */}
      {workers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No workers found</Text>
          <Text style={styles.emptySubtext}>Add workers to get started</Text>
        </View>
      ) : (
        <FlatList
          data={workers}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                style={styles.workerImage}
                source={{ uri: 'https://via.placeholder.com/50' }}
              />
              <View style={styles.workerInfo}>
                <Text style={styles.cardNumber}>{item.name}</Text>
                <Text style={styles.cardLabel}>{item.role}</Text>
                {item.email && <Text style={styles.cardDetail}>{item.email}</Text>}
                {item.phone && <Text style={styles.cardDetail}>{item.phone}</Text>}
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default WorkersList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 30,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  manageButton: {
    backgroundColor: '#028831',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  manageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#028831',
  },
  workerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  workerInfo: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  cardDetail: {
    fontSize: 12,
    color: '#999',
    marginBottom: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});