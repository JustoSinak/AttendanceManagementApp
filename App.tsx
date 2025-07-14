import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DatabaseProvider } from './contexts/DatabaseContext';
import AttendanceBoard from './components/AttendanceBoard';
import Workers from './components/Workers';
import abWorkers from './components/abWorkers';
import monthAttend from './components/monthAttend';
import weekAttend from './components/weekAttend';
import WorkersList from './components/WorkersList';
import AddWorkerForm from './components/AddWorkerForm';
import AttendanceManager from './components/AttendanceManager';
import Settings from './components/Settings';

const Stack = createStackNavigator();

const App = () => {
  return (
    <DatabaseProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="AttendanceBoard">
          <Stack.Screen name="AttendanceBoard" component={AttendanceBoard} />
          <Stack.Screen name="Workers" component={Workers} />
          <Stack.Screen name="abWorkers" component={abWorkers} />
          <Stack.Screen name="monthAttend" component={monthAttend} />
          <Stack.Screen name="weekAttend" component={weekAttend} />
          <Stack.Screen name="WorkersList" component={WorkersList} />
          <Stack.Screen name="AddWorkerForm" component={AddWorkerForm} />
          <Stack.Screen name="AttendanceManager" component={AttendanceManager} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </DatabaseProvider>
  );
};

export default App;
