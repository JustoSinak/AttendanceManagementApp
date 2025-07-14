import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { databaseService, Worker, AttendanceRecord, AttendanceStats } from '../services/database';

interface DatabaseContextType {
  // Database state
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;

  // Workers
  workers: Worker[];
  addWorker: (worker: Omit<Worker, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateWorker: (id: number, worker: Partial<Worker>) => Promise<void>;
  deleteWorker: (id: number) => Promise<void>;
  searchWorkers: (query: string) => Promise<Worker[]>;
  refreshWorkers: () => Promise<void>;

  // Attendance
  attendanceStats: AttendanceStats;
  todayAttendance: (AttendanceRecord & { workerName: string; workerRole: string })[];
  recordAttendance: (attendance: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  checkIn: (workerId: number, time?: string) => Promise<void>;
  checkOut: (workerId: number, time?: string) => Promise<void>;
  getWorkerAttendance: (workerId: number, startDate: string, endDate: string) => Promise<AttendanceRecord[]>;
  getMonthlyStats: (workerId: number, year: number, month: number) => Promise<{
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
  }>;
  refreshAttendanceData: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabaseContext must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    totalWorkers: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
  });
  const [todayAttendance, setTodayAttendance] = useState<(AttendanceRecord & { workerName: string; workerRole: string })[]>([]);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await databaseService.initializeDatabase();
      setIsInitialized(true);
      
      // Load initial data
      await Promise.all([
        refreshWorkers(),
        refreshAttendanceData(),
      ]);
      
    } catch (err) {
      console.error('Database initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize database');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWorkers = async () => {
    try {
      const workersData = await databaseService.getAllWorkers();
      setWorkers(workersData);
    } catch (err) {
      console.error('Error refreshing workers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load workers');
    }
  };

  const refreshAttendanceData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [stats, attendance] = await Promise.all([
        databaseService.getTodayAttendanceStats(),
        databaseService.getAttendanceByDate(today),
      ]);
      
      setAttendanceStats(stats);
      setTodayAttendance(attendance);
    } catch (err) {
      console.error('Error refreshing attendance data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load attendance data');
    }
  };

  const addWorker = async (worker: Omit<Worker, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      await databaseService.addWorker(worker);
      await refreshWorkers();
      await refreshAttendanceData(); // Refresh stats as total workers changed
    } catch (err) {
      console.error('Error adding worker:', err);
      setError(err instanceof Error ? err.message : 'Failed to add worker');
      throw err;
    }
  };

  const updateWorker = async (id: number, worker: Partial<Worker>) => {
    try {
      setError(null);
      await databaseService.updateWorker(id, worker);
      await refreshWorkers();
    } catch (err) {
      console.error('Error updating worker:', err);
      setError(err instanceof Error ? err.message : 'Failed to update worker');
      throw err;
    }
  };

  const deleteWorker = async (id: number) => {
    try {
      setError(null);
      await databaseService.deleteWorker(id);
      await refreshWorkers();
      await refreshAttendanceData(); // Refresh stats as total workers changed
    } catch (err) {
      console.error('Error deleting worker:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete worker');
      throw err;
    }
  };

  const searchWorkers = async (query: string): Promise<Worker[]> => {
    try {
      setError(null);
      return await databaseService.searchWorkers(query);
    } catch (err) {
      console.error('Error searching workers:', err);
      setError(err instanceof Error ? err.message : 'Failed to search workers');
      return [];
    }
  };

  const recordAttendance = async (attendance: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      await databaseService.recordAttendance(attendance);
      await refreshAttendanceData();
    } catch (err) {
      console.error('Error recording attendance:', err);
      setError(err instanceof Error ? err.message : 'Failed to record attendance');
      throw err;
    }
  };

  const checkIn = async (workerId: number, time?: string) => {
    try {
      setError(null);
      await databaseService.checkIn(workerId, time);
      await refreshAttendanceData();
    } catch (err) {
      console.error('Error checking in:', err);
      setError(err instanceof Error ? err.message : 'Failed to check in');
      throw err;
    }
  };

  const checkOut = async (workerId: number, time?: string) => {
    try {
      setError(null);
      await databaseService.checkOut(workerId, time);
      await refreshAttendanceData();
    } catch (err) {
      console.error('Error checking out:', err);
      setError(err instanceof Error ? err.message : 'Failed to check out');
      throw err;
    }
  };

  const getWorkerAttendance = async (workerId: number, startDate: string, endDate: string): Promise<AttendanceRecord[]> => {
    try {
      setError(null);
      return await databaseService.getWorkerAttendance(workerId, startDate, endDate);
    } catch (err) {
      console.error('Error getting worker attendance:', err);
      setError(err instanceof Error ? err.message : 'Failed to get worker attendance');
      return [];
    }
  };

  const getMonthlyStats = async (workerId: number, year: number, month: number) => {
    try {
      setError(null);
      return await databaseService.getMonthlyAttendanceStats(workerId, year, month);
    } catch (err) {
      console.error('Error getting monthly stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to get monthly stats');
      return {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
      };
    }
  };

  const contextValue: DatabaseContextType = {
    isInitialized,
    isLoading,
    error,
    workers,
    addWorker,
    updateWorker,
    deleteWorker,
    searchWorkers,
    refreshWorkers,
    attendanceStats,
    todayAttendance,
    recordAttendance,
    checkIn,
    checkOut,
    getWorkerAttendance,
    getMonthlyStats,
    refreshAttendanceData,
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};
