
import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function Preferences() {
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferências de Acessibilidade</Text>

      <View style={styles.option}>
        <Text>Alto Contraste</Text>
        <Switch value={highContrast} onValueChange={setHighContrast} />
      </View>

      <View style={styles.option}>
        <Text>Modo Dislexia</Text>
        <Switch value={dyslexiaMode} onValueChange={setDyslexiaMode} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  option: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }
});
