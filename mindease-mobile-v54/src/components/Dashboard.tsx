
import React from 'react';
import { useTheme, themes } from '../context/ThemeContext';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Dashboard({ navigation }) {
  const { mode } = useTheme();
  const theme = themes[mode];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>Dashboard</Text>
      <Button title="Kanban" onPress={() => navigation.navigate('Kanban')} />
      <Button title="Pomodoro" onPress={() => navigation.navigate('Pomodoro')} />
      <Button title="Preferências" onPress={() => navigation.navigate('Preferences')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 }
});
