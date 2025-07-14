import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDatabaseContext } from '../contexts/DatabaseContext';
import { Worker } from '../services/database';
import LoadingScreen from './LoadingScreen';

interface AttendanceWorkerCardProps {
  worker: Worker;
  attendanceInfo?: {
    checkInTime?: string;
    checkOutTime?: string;
    status: string;
    hoursWorked?: number;
  };
  onCheckIn: (worker: Worker) => void;
  onCheckOut: (worker: Worker) => void;
  onMarkAbsent: (worker: Worker) => void;
}

const AttendanceWorkerCard: React.FC<AttendanceWorkerCardProps> = ({
  worker,
  attendanceInfo,
  onCheckIn,
  onCheckOut,
  onMarkAbsent,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#28a745';
      case 'absent': return '#dc3545';
      case 'late': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return 'checkmark-circle';
      case 'absent': return 'close-circle';
      case 'late': return 'time';
      default: return 'help-circle';
    }
  };

  return (
    <View style={styles.workerCard}>
      <View style={styles.workerHeader}>
        <Text style={styles.workerName}>{worker.name}</Text>
        <Text style={styles.workerRole}>{worker.role}</Text>
      </View>

      {attendanceInfo && (
        <View style={styles.attendanceInfo}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(attendanceInfo.status) }]}>
            <Ionicons 
              name={getStatusIcon(attendanceInfo.status)} 
              size={16} 
              color="white" 
            />
            <Text style={styles.statusText}>{attendanceInfo.status.toUpperCase()}</Text>
          </View>
          
          {attendanceInfo.checkInTime && (
            <Text style={styles.timeText}>In: {attendanceInfo.checkInTime}</Text>
          )}
          
          {attendanceInfo.checkOutTime && (
            <Text style={styles.timeText}>Out: {attendanceInfo.checkOutTime}</Text>
          )}
          
          {attendanceInfo.hoursWorked && (
            <Text style={styles.hoursText}>
              Hours: {attendanceInfo.hoursWorked.toFixed(1)}h
            </Text>
          )}
        </View>
      )}

      <View style={styles.actionButtons}>
        {!attendanceInfo || attendanceInfo.status === 'absent' ? (
          <>
            <TouchableOpacity 
              style={[styles.actionButton, styles.checkInButton]} 
              onPress={() => onCheckIn(worker)}
            >
              <Ionicons name="log-in" size={16} color="white" />
              <Text style={styles.buttonText}>Check In</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.absentButton]} 
              onPress={() => onMarkAbsent(worker)}
            >
              <Ionicons name="close" size={16} color="white" />
              <Text style={styles.buttonText}>Absent</Text>
            </TouchableOpacity>
          </>
        ) : attendanceInfo.status === 'present' && !attendanceInfo.checkOutTime ? (
          <TouchableOpacity 
            style={[styles.actionButton, styles.checkOutButton]} 
            onPress={() => onCheckOut(worker)}
          >
            <Ionicons name="log-out" size={16} color="white" />
            <Text style={styles.buttonText}>Check Out</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-done" size={16} color="#28a745" />
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const AttendanceManager = () => {
  const navigation = useNavigation();
  const { 
    workers, 
    todayAttendance, 
    checkIn, 
    checkOut, 
    recordAttendance,
    isLoading,
    refreshWorkers,
    refreshAttendanceData 
  } = useDatabaseContext();

  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [actionType, setActionType] = useState<'checkin' | 'checkout'>('checkin');
  const [customTime, setCustomTime] = useState('');

  useEffect(() => {
    refreshWorkers();
    refreshAttendanceData();
  }, []);

  useEffect(() => {
    // Set current time as default
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format
    setCustomTime(timeString);
  }, [showTimeModal]);

  const handleBack = () => {
    navigation.goBack();
  };

  const getWorkerAttendanceInfo = (workerId: number) => {
    return todayAttendance.find(attendance => attendance.workerId === workerId);
  };

  const handleCheckIn = (worker: Worker) => {
    setSelectedWorker(worker);
    setActionType('checkin');
    setShowTimeModal(true);
  };

  const handleCheckOut = (worker: Worker) => {
    setSelectedWorker(worker);
    setActionType('checkout');
    setShowTimeModal(true);
  };

  const handleMarkAbsent = async (worker: Worker) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await recordAttendance({
        workerId: worker.id!,
        date: today,
        status: 'absent',
      });
      Alert.alert('Success', `${worker.name} marked as absent`);
    } catch (error) {
      Alert.alert('Error', 'Failed to mark worker as absent');
    }
  };

  const confirmTimeAction = async () => {
    if (!selectedWorker || !customTime) return;

    try {
      const timeWithSeconds = `${customTime}:00`;
      
      if (actionType === 'checkin') {
        await checkIn(selectedWorker.id!, timeWithSeconds);
        Alert.alert('Success', `${selectedWorker.name} checked in at ${customTime}`);
      } else {
        await checkOut(selectedWorker.id!, timeWithSeconds);
        Alert.alert('Success', `${selectedWorker.name} checked out at ${customTime}`);
      }
      
      setShowTimeModal(false);
      setSelectedWorker(null);
    } catch (error) {
      Alert.alert('Error', `Failed to ${actionType === 'checkin' ? 'check in' : 'check out'} worker`);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading attendance data..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Manage Attendance</Text>
        <TouchableOpacity onPress={refreshAttendanceData}>
          <Ionicons name="refresh" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Today's Date */}
      <View style={styles.dateContainer}>
        <FontAwesome name="calendar" size={20} color="#028831" />
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      {/* Workers List */}
      {workers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No workers found</Text>
          <Text style={styles.emptySubtext}>Add workers first to manage attendance</Text>
        </View>
      ) : (
        <FlatList
          data={workers}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={({ item }) => (
            <AttendanceWorkerCard
              worker={item}
              attendanceInfo={getWorkerAttendanceInfo(item.id!)}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              onMarkAbsent={handleMarkAbsent}
            />
          )}
          contentContainerStyle={styles.workersList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Time Selection Modal */}
      <Modal
        visible={showTimeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {actionType === 'checkin' ? 'Check In' : 'Check Out'} Time
            </Text>
            <Text style={styles.modalSubtitle}>
              {selectedWorker?.name}
            </Text>
            
            <TextInput
              style={styles.timeInput}
              value={customTime}
              onChangeText={setCustomTime}
              placeholder="HH:MM"
              keyboardType="numeric"
              maxLength={5}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowTimeModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={confirmTimeAction}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  workersList: {
    paddingBottom: 20,
  },
  workerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#028831',
  },
  workerHeader: {
    marginBottom: 12,
  },
  workerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  workerRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  attendanceInfo: {
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  hoursText: {
    fontSize: 14,
    color: '#028831',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  checkInButton: {
    backgroundColor: '#28a745',
  },
  checkOutButton: {
    backgroundColor: '#007bff',
  },
  absentButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  completedText: {
    color: '#28a745',
    fontSize: 14,
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#028831',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AttendanceManager;
