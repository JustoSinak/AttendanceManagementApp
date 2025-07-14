# Attendance Management Mobile App

## Project Overview
This is a comprehensive React Native mobile application designed for workforce attendance tracking and management. The app provides real-time attendance monitoring, worker management, and detailed reporting capabilities with SQLite database integration.

## ✨ Features

### 🏠 Dashboard
- **Real-time Statistics**: View current attendance stats (present, absent, late workers)
- **Quick Navigation**: Easy access to all major features
- **Dynamic Data**: Live updates from SQLite database

### 👥 Worker Management
- **Complete CRUD Operations**: Add, edit, delete, and search workers
- **Detailed Profiles**: Store worker information including name, role, email, phone, hourly rate
- **Form Validation**: Comprehensive input validation with error handling
- **Search & Filter**: Real-time search functionality

### ⏰ Attendance Tracking
- **Check-in/Check-out**: Manual time entry with custom time selection
- **Status Management**: Track present, absent, late, and half-day statuses
- **Real-time Updates**: Instant attendance status updates
- **Hours Calculation**: Automatic working hours calculation

### 📊 Reporting & Analytics
- **Monthly Reports**: Detailed monthly attendance with percentage calculations
- **Weekly Reports**: Week-by-week attendance tracking with navigation
- **Performance Indicators**: Color-coded status indicators
- **Historical Data**: Browse past attendance records

### ⚙️ Settings & Configuration
- **App Statistics**: Overview of total workers and attendance metrics
- **Data Management**: Export, backup, and clear data options
- **Preferences**: Notification and backup settings
- **About Information**: App version and help resources

## 🛠 Technologies Used
- **React Native** - Mobile app framework
- **Expo** - Development platform and tools
- **SQLite (expo-sqlite)** - Local database storage
- **React Navigation** - Navigation library
- **TypeScript** - Type safety and better development experience
- **React Context API** - State management
- **Vector Icons** - UI icons and graphics

## 📋 Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

## 🚀 Installation & Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd AttendanceManagementApp
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npx expo start
```

4. **Run on device/simulator**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

## 📱 App Structure
```
AttendanceManagementApp/
├── components/
│   ├── AttendanceBoard.tsx      # Main dashboard
│   ├── AttendanceManager.tsx    # Check-in/out management
│   ├── Workers.tsx              # Present workers list
│   ├── abWorkers.tsx           # Absent workers list
│   ├── WorkersList.tsx         # All workers overview
│   ├── AddWorkerForm.tsx       # Add/edit worker form
│   ├── monthAttend.tsx         # Monthly attendance reports
│   ├── weekAttend.tsx          # Weekly attendance reports
│   ├── Settings.tsx            # App settings
│   └── LoadingScreen.tsx       # Loading component
├── contexts/
│   └── DatabaseContext.tsx     # Database state management
├── services/
│   └── database.ts             # SQLite database service
├── App.tsx                     # Main app component
└── package.json               # Dependencies and scripts
```

## 🗄️ Database Schema

### Workers Table
- `id` (Primary Key)
- `name` (Required)
- `role` (Required)
- `email` (Optional)
- `phone` (Optional)
- `hourlyRate` (Optional)
- `createdAt`, `updatedAt` (Timestamps)

### Attendance Records Table
- `id` (Primary Key)
- `workerId` (Foreign Key)
- `date` (Required)
- `checkInTime`, `checkOutTime` (Optional)
- `hoursWorked` (Calculated)
- `status` (present/absent/late/half-day)
- `notes` (Optional)
- `createdAt`, `updatedAt` (Timestamps)

## 🎯 Key Features Implemented

### ✅ Database Integration
- SQLite database with proper schema design
- CRUD operations for workers and attendance
- Data relationships and constraints
- Automatic database initialization

### ✅ Real-time Data Management
- Context-based state management
- Automatic data refresh
- Error handling and loading states
- Data validation

### ✅ User Experience
- Intuitive navigation flow
- Form validation with error messages
- Loading screens and empty states
- Confirmation dialogs for destructive actions

### ✅ Attendance Features
- Manual check-in/check-out with time selection
- Attendance status tracking
- Working hours calculation
- Historical attendance records

### ✅ Reporting
- Monthly attendance with percentage calculations
- Weekly attendance summaries
- Navigation between time periods
- Performance indicators

## 🔧 Usage Guide

1. **First Launch**: The app will automatically initialize the SQLite database
2. **Add Workers**: Use the "Add Worker" button to create worker profiles
3. **Manage Attendance**: Use "Manage Today's Attendance" to check workers in/out
4. **View Reports**: Access monthly and weekly reports from the dashboard
5. **Settings**: Configure app preferences and manage data

## 🚀 Future Enhancements
- Data export to CSV/Excel
- Cloud backup integration
- Push notifications
- Biometric authentication
- GPS location tracking
- Advanced reporting with charts
- Multi-language support

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License
This project is licensed under the 0BSD License.

## 📞 Support
For support and questions, please create an issue in the repository or contact the development team.

## Screenshots
[Add screenshots of your application here]

## Contribution Guidelines
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License
[Specify your license, e.g., MIT]

## Contact
[Your contact information or project maintainer's details]