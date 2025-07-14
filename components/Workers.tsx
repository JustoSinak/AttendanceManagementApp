import React, { useState, useEffect } from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,FlatList,Image, Alert} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDatabaseContext } from '../contexts/DatabaseContext';
import { Worker } from '../services/database';
import LoadingScreen from './LoadingScreen';


interface WorkerCardProps {
  worker: Worker;
  attendanceInfo?: {
    checkInTime?: string;
    hoursWorked?: number;
    status: string;
  };
  onEdit: (worker: Worker) => void;
  onDelete: (worker: Worker) => void;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker, attendanceInfo, onEdit, onDelete }) => {
  const handleEdit = () => onEdit(worker);
  const handleDelete = () => onDelete(worker);

  return (
    <View style={styles.workerCard}>
      <Image
        style={styles.workerImage}
        source={{ uri: 'https://via.placeholder.com/50' }}
      />
      <View style={styles.workerInfo}>
        <Text style={styles.workerName}>{worker.name}</Text>
        <Text style={styles.workerRole}>{worker.role}</Text>
        {attendanceInfo && (
          <>
            <Text style={styles.workerDetails}>
              Status: {attendanceInfo.status}
            </Text>
            {attendanceInfo.checkInTime && (
              <Text style={styles.workerDetails}>
                Check-in: {attendanceInfo.checkInTime}
              </Text>
            )}
            {attendanceInfo.hoursWorked && (
              <Text style={styles.workerDetails}>
                Hours: {attendanceInfo.hoursWorked.toFixed(1)}h
              </Text>
            )}
          </>
        )}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="pencil" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Workers = () => {
  const navigation = useNavigation();
  const {
    workers,
    todayAttendance,
    deleteWorker,
    isLoading,
    refreshWorkers,
    refreshAttendanceData
  } = useDatabaseContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    refreshWorkers();
    refreshAttendanceData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredWorkers(workers);
    } else {
      const filtered = workers.filter(worker =>
        worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWorkers(filtered);
    }
  }, [workers, searchQuery]);

  const handleHome = () => {
    navigation.navigate("AttendanceBoard");
  };

  const handleAddWorker = () => {
    navigation.navigate("AddWorkerForm");
  };

  const handleEditWorker = (worker: Worker) => {
    navigation.navigate("AddWorkerForm", { worker, isEditing: true });
  };

  const handleDeleteWorker = (worker: Worker) => {
    Alert.alert(
      'Delete Worker',
      `Are you sure you want to delete ${worker.name}? This will also delete all their attendance records.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWorker(worker.id!);
              Alert.alert('Success', 'Worker deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete worker');
            }
          },
        },
      ]
    );
  };

  const getWorkerAttendanceInfo = (workerId: number) => {
    return todayAttendance.find(attendance => attendance.workerId === workerId);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading workers..." />;
  }


  return (
   
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Ionicons name="arrow-back" size={30} color="black" onPress={handleHome}/>
        <Text style={styles.headerText}>Workers Present</Text>
        {/* <Ionicons name="settings" size={24} color="black" /> */}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search workers..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
      </View>

      {/* Worker List */}
      {filteredWorkers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchQuery ? 'No workers found' : 'No workers added yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? 'Try a different search term' : 'Add your first worker to get started'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredWorkers}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={({ item }) => (
            <WorkerCard
              worker={item}
              attendanceInfo={getWorkerAttendanceInfo(item.id!)}
              onEdit={handleEditWorker}
              onDelete={handleDeleteWorker}
            />
          )}
          contentContainerStyle={styles.workerList}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Worker Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddWorker}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Add Worker</Text>
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
    color: '#028831',
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  editButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});

export default Workers;
