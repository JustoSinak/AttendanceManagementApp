import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AttendanceBoard from './components/AttendanceBoard';
import Workers from './components/Workers';
import abWorkers from './components/abWorkers';
import monthAttend from './components/monthAttend';
import weekAttend from './components/weekAttend';
import WorkersList from './components/WorkersList';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="AttendanceBoard">
        <Stack.Screen name="AttendanceBoard" component={AttendanceBoard} />
        <Stack.Screen name="Workers" component={Workers} />
        <Stack.Screen name="abWorkers" component={abWorkers} />
        <Stack.Screen name="monthAttend" component={monthAttend} />
        <Stack.Screen name="weekAttend" component={weekAttend} />
        <Stack.Screen name="WorkersList" component={WorkersList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
