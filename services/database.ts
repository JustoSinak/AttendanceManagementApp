import * as SQLite from 'expo-sqlite';

export interface Worker {
  id?: number;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  hourlyRate?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceRecord {
  id?: number;
  workerId: number;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  hoursWorked?: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceStats {
  totalWorkers: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initializeDatabase(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('attendance.db');
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Create workers table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS workers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        hourlyRate REAL DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create attendance_records table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS attendance_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workerId INTEGER NOT NULL,
        date TEXT NOT NULL,
        checkInTime TEXT,
        checkOutTime TEXT,
        hoursWorked REAL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'absent',
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workerId) REFERENCES workers (id) ON DELETE CASCADE,
        UNIQUE(workerId, date)
      );
    `);

    // Create indexes for better performance
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
      CREATE INDEX IF NOT EXISTS idx_attendance_worker ON attendance_records(workerId);
      CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance_records(status);
    `);
  }

  // Worker CRUD operations
  async addWorker(worker: Omit<Worker, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.runAsync(
      'INSERT INTO workers (name, role, email, phone, hourlyRate) VALUES (?, ?, ?, ?, ?)',
      [worker.name, worker.role, worker.email || null, worker.phone || null, worker.hourlyRate || 0]
    );

    return result.lastInsertRowId;
  }

  async getAllWorkers(): Promise<Worker[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync('SELECT * FROM workers ORDER BY name ASC');
    return result as Worker[];
  }

  async getWorkerById(id: number): Promise<Worker | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync('SELECT * FROM workers WHERE id = ?', [id]);
    return result as Worker | null;
  }

  async updateWorker(id: number, worker: Partial<Worker>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = [];
    const values = [];

    if (worker.name) {
      fields.push('name = ?');
      values.push(worker.name);
    }
    if (worker.role) {
      fields.push('role = ?');
      values.push(worker.role);
    }
    if (worker.email !== undefined) {
      fields.push('email = ?');
      values.push(worker.email);
    }
    if (worker.phone !== undefined) {
      fields.push('phone = ?');
      values.push(worker.phone);
    }
    if (worker.hourlyRate !== undefined) {
      fields.push('hourlyRate = ?');
      values.push(worker.hourlyRate);
    }

    fields.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);

    await this.db.runAsync(
      `UPDATE workers SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteWorker(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.runAsync('DELETE FROM workers WHERE id = ?', [id]);
  }

  async searchWorkers(query: string): Promise<Worker[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync(
      'SELECT * FROM workers WHERE name LIKE ? OR role LIKE ? ORDER BY name ASC',
      [`%${query}%`, `%${query}%`]
    );
    return result as Worker[];
  }

  // Attendance CRUD operations
  async recordAttendance(attendance: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.runAsync(
      `INSERT OR REPLACE INTO attendance_records 
       (workerId, date, checkInTime, checkOutTime, hoursWorked, status, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        attendance.workerId,
        attendance.date,
        attendance.checkInTime || null,
        attendance.checkOutTime || null,
        attendance.hoursWorked || 0,
        attendance.status,
        attendance.notes || null
      ]
    );

    return result.lastInsertRowId;
  }

  async getAttendanceByDate(date: string): Promise<(AttendanceRecord & { workerName: string; workerRole: string })[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync(`
      SELECT ar.*, w.name as workerName, w.role as workerRole
      FROM attendance_records ar
      JOIN workers w ON ar.workerId = w.id
      WHERE ar.date = ?
      ORDER BY w.name ASC
    `, [date]);

    return result as (AttendanceRecord & { workerName: string; workerRole: string })[];
  }

  async getWorkerAttendance(workerId: number, startDate: string, endDate: string): Promise<AttendanceRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync(
      'SELECT * FROM attendance_records WHERE workerId = ? AND date BETWEEN ? AND ? ORDER BY date DESC',
      [workerId, startDate, endDate]
    );

    return result as AttendanceRecord[];
  }

  async getTodayAttendanceStats(): Promise<AttendanceStats> {
    if (!this.db) throw new Error('Database not initialized');

    const today = new Date().toISOString().split('T')[0];
    
    const totalWorkers = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM workers');
    const presentToday = await this.db.getFirstAsync(
      'SELECT COUNT(*) as count FROM attendance_records WHERE date = ? AND status = ?',
      [today, 'present']
    );
    const absentToday = await this.db.getFirstAsync(
      'SELECT COUNT(*) as count FROM attendance_records WHERE date = ? AND status = ?',
      [today, 'absent']
    );
    const lateToday = await this.db.getFirstAsync(
      'SELECT COUNT(*) as count FROM attendance_records WHERE date = ? AND status = ?',
      [today, 'late']
    );

    return {
      totalWorkers: (totalWorkers as any)?.count || 0,
      presentToday: (presentToday as any)?.count || 0,
      absentToday: (absentToday as any)?.count || 0,
      lateToday: (lateToday as any)?.count || 0,
    };
  }

  async getMonthlyAttendanceStats(workerId: number, year: number, month: number): Promise<{
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
  }> {
    if (!this.db) throw new Error('Database not initialized');

    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

    const stats = await this.db.getAllAsync(`
      SELECT 
        status,
        COUNT(*) as count
      FROM attendance_records 
      WHERE workerId = ? AND date BETWEEN ? AND ?
      GROUP BY status
    `, [workerId, startDate, endDate]);

    const result = {
      totalDays: 0,
      presentDays: 0,
      absentDays: 0,
      lateDays: 0,
    };

    stats.forEach((stat: any) => {
      result.totalDays += stat.count;
      if (stat.status === 'present') result.presentDays = stat.count;
      if (stat.status === 'absent') result.absentDays = stat.count;
      if (stat.status === 'late') result.lateDays = stat.count;
    });

    return result;
  }

  async checkIn(workerId: number, time?: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const today = new Date().toISOString().split('T')[0];
    const checkInTime = time || new Date().toTimeString().split(' ')[0];

    await this.recordAttendance({
      workerId,
      date: today,
      checkInTime,
      status: 'present'
    });
  }

  async checkOut(workerId: number, time?: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const today = new Date().toISOString().split('T')[0];
    const checkOutTime = time || new Date().toTimeString().split(' ')[0];

    // Get existing record
    const existing = await this.db.getFirstAsync(
      'SELECT * FROM attendance_records WHERE workerId = ? AND date = ?',
      [workerId, today]
    ) as AttendanceRecord | null;

    if (existing && existing.checkInTime) {
      // Calculate hours worked
      const checkIn = new Date(`${today}T${existing.checkInTime}`);
      const checkOut = new Date(`${today}T${checkOutTime}`);
      const hoursWorked = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

      await this.db.runAsync(
        'UPDATE attendance_records SET checkOutTime = ?, hoursWorked = ?, updatedAt = CURRENT_TIMESTAMP WHERE workerId = ? AND date = ?',
        [checkOutTime, hoursWorked, workerId, today]
      );
    }
  }
}

export const databaseService = new DatabaseService();
