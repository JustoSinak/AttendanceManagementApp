# Development Guide

## 🚀 Getting Started

### Development Environment Setup

1. **Install Node.js** (v14 or higher)
   ```bash
   # Check your Node.js version
   node --version
   ```

2. **Install Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

3. **Clone and Setup Project**
   ```bash
   git clone <repository-url>
   cd AttendanceManagementApp
   npm install
   ```

4. **Start Development Server**
   ```bash
   npx expo start
   ```

## 📁 Project Architecture

### Component Structure
```
components/
├── AttendanceBoard.tsx      # Main dashboard with stats
├── AttendanceManager.tsx    # Check-in/out functionality
├── Workers.tsx              # Present workers display
├── abWorkers.tsx           # Absent workers display
├── WorkersList.tsx         # Complete workers list
├── AddWorkerForm.tsx       # Worker creation/editing
├── monthAttend.tsx         # Monthly reports
├── weekAttend.tsx          # Weekly reports
├── Settings.tsx            # App configuration
└── LoadingScreen.tsx       # Loading states
```

### Data Layer
```
services/
└── database.ts             # SQLite operations and models

contexts/
└── DatabaseContext.tsx     # Global state management
```

## 🗄️ Database Design

### Tables Schema

#### Workers Table
```sql
CREATE TABLE workers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  hourlyRate REAL DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Attendance Records Table
```sql
CREATE TABLE attendance_records (
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
```

## 🔧 Development Workflow

### Adding New Features

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Component Development**
   - Create component in `components/` directory
   - Follow TypeScript interfaces
   - Use consistent styling patterns
   - Implement error handling

3. **Database Integration**
   - Add database methods in `services/database.ts`
   - Update context if needed
   - Test database operations

4. **Navigation Setup**
   - Add screen to `App.tsx`
   - Update navigation types if using TypeScript

### Code Style Guidelines

#### Component Structure
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDatabaseContext } from '../contexts/DatabaseContext';

interface ComponentProps {
  // Define props here
}

const ComponentName: React.FC<ComponentProps> = ({ props }) => {
  // State and hooks
  const [state, setState] = useState();
  const { contextMethods } = useDatabaseContext();

  // Effects
  useEffect(() => {
    // Side effects
  }, []);

  // Event handlers
  const handleAction = () => {
    // Handle events
  };

  // Render
  return (
    <View style={styles.container}>
      {/* Component JSX */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles
  },
});

export default ComponentName;
```

#### Database Operations
```typescript
// Always use try-catch for database operations
const addWorker = async (worker: Worker) => {
  try {
    setError(null);
    await databaseService.addWorker(worker);
    await refreshWorkers();
  } catch (err) {
    console.error('Error adding worker:', err);
    setError(err instanceof Error ? err.message : 'Failed to add worker');
    throw err;
  }
};
```

## 🧪 Testing

### Running Tests
```bash
# Run mock tests
node __tests__/database.test.js

# For production, use Jest
npm test
```

### Test Coverage Areas
- Database CRUD operations
- Form validation
- Navigation flow
- Error handling
- State management

## 🎨 UI/UX Guidelines

### Color Scheme
- Primary: `#028831` (Green)
- Secondary: `#4a90e2` (Blue)
- Success: `#28a745`
- Warning: `#ffc107`
- Error: `#dc3545`
- Background: `#fff`
- Text: `#333`

### Component Patterns
- Use consistent padding: `16px`
- Border radius: `8px` or `12px`
- Shadow for cards: `elevation: 3`
- Loading states for async operations
- Empty states for no data
- Error boundaries for error handling

## 🔍 Debugging

### Common Issues

1. **Database Not Initializing**
   - Check expo-sqlite installation
   - Verify database path
   - Check for SQL syntax errors

2. **Navigation Errors**
   - Ensure screen is registered in App.tsx
   - Check navigation prop types
   - Verify screen names match

3. **State Not Updating**
   - Check context provider wrapping
   - Verify useEffect dependencies
   - Check for async/await issues

### Debug Tools
```bash
# View logs
npx expo logs

# Clear cache
npx expo start --clear

# Debug on device
npx expo start --dev-client
```

## 📱 Platform Considerations

### iOS Specific
- Test on iOS Simulator
- Check for iOS-specific styling issues
- Verify safe area handling

### Android Specific
- Test on Android Emulator
- Check elevation vs shadow
- Verify back button handling

## 🚀 Deployment

### Building for Production

1. **Expo Build**
   ```bash
   npx expo build:android
   npx expo build:ios
   ```

2. **EAS Build** (Recommended)
   ```bash
   npm install -g @expo/eas-cli
   eas build --platform android
   eas build --platform ios
   ```

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Database migrations tested
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Navigation flow tested
- [ ] Performance optimized
- [ ] Icons and splash screen updated

## 🤝 Contributing

### Pull Request Process
1. Create feature branch
2. Implement changes
3. Add/update tests
4. Update documentation
5. Submit PR with description
6. Address review feedback

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are included
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Performance considerations

## 📚 Resources

### Documentation
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [SQLite Docs](https://docs.expo.dev/versions/latest/sdk/sqlite/)

### Tools
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)
- [Expo Dev Tools](https://docs.expo.dev/workflow/debugging/)

## 🆘 Support

For development questions:
1. Check existing issues
2. Review documentation
3. Create detailed issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details
