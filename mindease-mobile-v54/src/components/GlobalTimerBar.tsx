
import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { useTimer } from '../context/TimerContext';

export default function GlobalTimerBar() {
  const { time, running } = useTimer();

  if (!running) return null;

  const m = Math.floor(time / 60);
  const s = time % 60;

  return (
    <View style={styles.bar} pointerEvents="none">
      <Text style={styles.text}>⏱ {m}:{s.toString().padStart(2, '0')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    width: '100%',
    backgroundColor: '#111',
    padding: 12,
    zIndex: 9999,
    elevation: 10
  },
  text: { color: '#fff', textAlign: 'center', fontSize: 18 }
});
