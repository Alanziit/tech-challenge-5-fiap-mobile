import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/components/Login';
import Dashboard from './src/components/Dashboard';
import Kanban from './src/components/Kanban';
import Pomodoro from './src/components/Pomodoro';
import Preferences from './src/components/Preferences';

import GlobalTimerBar from './src/components/GlobalTimerBar';

import { TimerProvider } from './src/context/TimerContext';
import { ThemeProvider } from './src/context/ThemeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <TimerProvider>
        <NavigationContainer>
          <GlobalTimerBar />

          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Kanban" component={Kanban} />
            <Stack.Screen name="Pomodoro" component={Pomodoro} />
            <Stack.Screen name="Preferences" component={Preferences} />
          </Stack.Navigator>
        </NavigationContainer>
      </TimerProvider>
    </ThemeProvider>
  );
}
