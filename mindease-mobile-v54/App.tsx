import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import Cadastro from "./src/components/Cadastro";
import Dashboard from "./src/components/Dashboard";
import Kanban from "./src/components/Kanban";
import Login from "./src/components/Login";
import Pomodoro from "./src/components/Pomodoro";
import Preferences from "./src/components/Preferences";

import GlobalTimerBar from "./src/components/GlobalTimerBar";

import { TimerProvider } from "./src/context/TimerContext";
import { AuthProvider } from "./src/infra/context/AuthContext";
import { ThemeProvider } from "./src/infra/context/ThemeContext";
import ToastProvider from "./src/shared/ToastProvider";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <TimerProvider>
        <AuthProvider>
          <NavigationContainer>
            <GlobalTimerBar />
            <ToastProvider />

            <Stack.Navigator>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Cadastro" component={Cadastro} />
              <Stack.Screen name="Dashboard" component={Dashboard} />
              <Stack.Screen name="Kanban" component={Kanban} />
              <Stack.Screen name="Pomodoro" component={Pomodoro} />
              <Stack.Screen name="Preferences" component={Preferences} />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </TimerProvider>
    </ThemeProvider>
  );
}
