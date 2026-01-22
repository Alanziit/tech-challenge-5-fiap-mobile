import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Keyboard } from 'react-native';
import { useTimer } from '../context/TimerContext';
import { useTheme, themes } from '../context/ThemeContext';

export default function Pomodoro({ navigation }: any) {
  const [minutes, setMinutes] = useState('25');
  const { time, running, start, pause } = useTimer();
  const { mode } = useTheme();
  const theme = themes[mode];

  const m = Math.floor(time / 60);
  const s = time % 60;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>Pomodoro</Text>

      {/* Entrada de tempo (sempre visível) */}
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={minutes}
        onChangeText={setMinutes}
        placeholder="Minutos"
      />

      <Button
        title="Confirmar tempo"
        onPress={() => Keyboard.dismiss()}
      />

      {/* Timer */}
      <Text style={[styles.timer, { color: theme.text }]}>
        {m}:{s.toString().padStart(2, '0')}
      </Text>

      <Button
        title={running ? "Pausar" : "Iniciar"}
        onPress={() =>
          running ? pause() : start(Number(minutes) * 60)
        }
      />

      {/* Botão explícito para sair */}
      <Button
        title="Voltar para o Dashboard"
        onPress={() => navigation.navigate('Dashboard')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, width: 120, textAlign: 'center', marginBottom: 10 },
  timer: { fontSize: 48, marginBottom: 20 }
});
