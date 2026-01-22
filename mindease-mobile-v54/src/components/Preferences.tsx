import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Preferences() {
  const { mode, setMode } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferências de Acessibilidade</Text>

      <View style={styles.option}>
        <Text>Alto Contraste</Text>
        <Switch
          value={mode === 'contrast'}
          onValueChange={(v) => setMode(v ? 'contrast' : 'default')}
        />
      </View>

      <View style={styles.option}>
        <Text>Modo Dislexia</Text>
        <Switch
          value={mode === 'dyslexia'}
          onValueChange={(v) => setMode(v ? 'dyslexia' : 'default')}
        />
      </View>

      <View style={styles.option}>
        <Text>Modo TEA</Text>
        <Switch
          value={mode === 'tea'}
          onValueChange={(v) => setMode(v ? 'tea' : 'default')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  option: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }
});
