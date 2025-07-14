import React, { useState, useEffect } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,FlatList,Image,ScrollView} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDatabaseContext } from '../contexts/DatabaseContext';
import { Worker } from '../services/database';
import LoadingScreen from './LoadingScreen';
import Workers from './Workers';

interface WorkerMonthlyCardProps {
  worker: Worker;
  monthlyStats: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
  };
}

const WorkerCard: React.FC<WorkerMonthlyCardProps> = ({ worker, monthlyStats }) => {
  const attendancePercentage = monthlyStats.totalDays > 0
    ? ((monthlyStats.presentDays / monthlyStats.totalDays) * 100).toFixed(1)
    : '0.0';

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return '#28a745';
    if (percentage >= 75) return '#ffc107';
    return '#dc3545';
  };

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
          Present: {monthlyStats.presentDays}/{monthlyStats.totalDays} days
        </Text>
        <Text style={styles.workerDetails}>
          Absent: {monthlyStats.absentDays} days
        </Text>
        {monthlyStats.lateDays > 0 && (
          <Text style={styles.workerDetails}>
            Late: {monthlyStats.lateDays} days
          </Text>
        )}
        <View style={styles.percentageContainer}>
          <Text style={[
            styles.percentageText,
            { color: getPercentageColor(parseFloat(attendancePercentage)) }
          ]}>
            {attendancePercentage}% Attendance
          </Text>
        </View>
      </View>
    </View>
  );
};




const monthAttend = () => {
  const navigation = useNavigation();
  const { workers, getMonthlyStats, isLoading } = useDatabaseContext();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [workersWithStats, setWorkersWithStats] = useState<Array<{
    worker: Worker;
    stats: {
      totalDays: number;
      presentDays: number;
      absentDays: number;
      lateDays: number;
    };
  }>>([]);

  const handleHome = () => {
    navigation.navigate("AttendanceBoard");
  };

  const loadMonthlyData = async () => {
    if (workers.length === 0) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const workersData = await Promise.all(
      workers.map(async (worker) => {
        const stats = await getMonthlyStats(worker.id!, year, month);
        return { worker, stats };
      })
    );

    setWorkersWithStats(workersData);
  };

  useEffect(() => {
    loadMonthlyData();
  }, [workers, currentDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return <LoadingScreen message="Loading monthly attendance..." />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="arrow-back" size={30} color="black" onPress={handleHome}/>
        <Text style={styles.headerText}>Monthly Attendance</Text>
        <TouchableOpacity onPress={loadMonthlyData}>
          <Ionicons name="refresh" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Month Navigation */}
      <View style={styles.monthNavigation}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('prev')}
        >
          <Ionicons name="chevron-back" size={24} color="#028831" />
        </TouchableOpacity>

        <Text style={styles.monthText}>{getMonthName(currentDate)}</Text>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('next')}
        >
          <Ionicons name="chevron-forward" size={24} color="#028831" />
        </TouchableOpacity>
      </View>

      {/* Workers List */}
      {workersWithStats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No attendance data</Text>
          <Text style={styles.emptySubtext}>
            No workers or attendance records found for this month
          </Text>
        </View>
      ) : (
        <FlatList
          data={workersWithStats}
          keyExtractor={(item) => item.worker.id!.toString()}
          renderItem={({ item }) => (
            <WorkerCard
              worker={item.worker}
              monthlyStats={item.stats}
            />
          )}
          contentContainerStyle={styles.workerList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScrollView>
  );
};

export default monthAttend

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
  monthNavigation: {
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
  monthText: {
    fontSize: 18,
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
  percentageContainer: {
    marginTop: 8,
  },
  percentageText: {
    fontSize: 16,
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