import React, { useState, useEffect } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,FlatList,Image,ScrollView} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDatabaseContext } from '../contexts/DatabaseContext';
import { Worker, AttendanceRecord } from '../services/database';
import LoadingScreen from './LoadingScreen';
import Workers from './Workers';

interface WorkerWeeklyCardProps {
  worker: Worker;
  weeklyAttendance: AttendanceRecord[];
}

const WorkerCard: React.FC<WorkerWeeklyCardProps> = ({ worker, weeklyAttendance }) => {
  const getDaysPresent = () => {
    return weeklyAttendance.filter(record => record.status === 'present').length;
  };

  const getTotalHours = () => {
    return weeklyAttendance.reduce((total, record) => {
      return total + (record.hoursWorked || 0);
    }, 0);
  };

  const getWeekStatus = () => {
    const daysPresent = getDaysPresent();
    const totalDays = weeklyAttendance.length;

    if (daysPresent === totalDays) return { text: 'Perfect', color: '#28a745' };
    if (daysPresent >= totalDays * 0.8) return { text: 'Good', color: '#ffc107' };
    return { text: 'Poor', color: '#dc3545' };
  };

  const status = getWeekStatus();

  return (
    <View style={styles.workerCard}>
      <Image
        style={styles.workerImage}
        source={{ uri: 'https://via.placeholder.com/50' }}
      />
      <View style={styles.workerInfo}>
        <Text style={styles.workerName}>{worker.name}</Text>
        <Text style={styles.workerRole}>{worker.role}</Text>
        <Text style={styles.workerDetails}>
          Days Present: {getDaysPresent()}/{weeklyAttendance.length}
        </Text>
        <Text style={styles.workerDetails}>
          Total Hours: {getTotalHours().toFixed(1)}h
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
          <Text style={styles.statusText}>{status.text}</Text>
        </View>
      </View>
    </View>
  );
};




const weekAttend = () => {
  const navigation = useNavigation();
  const { workers, getWorkerAttendance, isLoading } = useDatabaseContext();

  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
  const [workersWithAttendance, setWorkersWithAttendance] = useState<Array<{
    worker: Worker;
    attendance: AttendanceRecord[];
  }>>([]);

  const handleHome = () => {
    navigation.navigate("AttendanceBoard");
  };

  // Helper function to get the start of the week (Monday)
  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  // Helper function to get the end of the week (Sunday)
  function getWeekEnd(weekStart: Date): Date {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  }

  const loadWeeklyData = async () => {
    if (workers.length === 0) return;

    const weekEnd = getWeekEnd(currentWeekStart);
    const startDate = currentWeekStart.toISOString().split('T')[0];
    const endDate = weekEnd.toISOString().split('T')[0];

    const workersData = await Promise.all(
      workers.map(async (worker) => {
        const attendance = await getWorkerAttendance(worker.id!, startDate, endDate);
        return { worker, attendance };
      })
    );

    setWorkersWithAttendance(workersData);
  };

  useEffect(() => {
    loadWeeklyData();
  }, [workers, currentWeekStart]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(currentWeekStart);
    if (direction === 'prev') {
      newWeekStart.setDate(newWeekStart.getDate() - 7);
    } else {
      newWeekStart.setDate(newWeekStart.getDate() + 7);
    }
    setCurrentWeekStart(newWeekStart);
  };

  const getWeekRange = (weekStart: Date) => {
    const weekEnd = getWeekEnd(weekStart);
    return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  if (isLoading) {
    return <LoadingScreen message="Loading weekly attendance..." />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="arrow-back" size={30} color="black" onPress={handleHome}/>
        <Text style={styles.headerText}>Weekly Attendance</Text>
        <TouchableOpacity onPress={loadWeeklyData}>
          <Ionicons name="refresh" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Week Navigation */}
      <View style={styles.weekNavigation}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateWeek('prev')}
        >
          <Ionicons name="chevron-back" size={24} color="#028831" />
        </TouchableOpacity>

        <Text style={styles.weekText}>{getWeekRange(currentWeekStart)}</Text>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateWeek('next')}
        >
          <Ionicons name="chevron-forward" size={24} color="#028831" />
        </TouchableOpacity>
      </View>

      {/* Workers List */}
      {workersWithAttendance.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No attendance data</Text>
          <Text style={styles.emptySubtext}>
            No workers or attendance records found for this week
          </Text>
        </View>
      ) : (
        <FlatList
          data={workersWithAttendance}
          keyExtractor={(item) => item.worker.id!.toString()}
          renderItem={({ item }) => (
            <WorkerCard
              worker={item.worker}
              weeklyAttendance={item.attendance}
            />
          )}
          contentContainerStyle={styles.workerList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScrollView>
  );
};

export default weekAttend

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  weekText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  workerList: {
    paddingBottom: 20,
  },
  workerCard: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
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
  workerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  workerRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  workerDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
});