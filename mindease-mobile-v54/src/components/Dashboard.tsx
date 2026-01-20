
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Dashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
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
