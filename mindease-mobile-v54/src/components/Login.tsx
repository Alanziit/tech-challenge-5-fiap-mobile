import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../infra/context/AuthContext";
import { themes, useTheme } from "../infra/context/ThemeContext";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const { mode } = useTheme();
  const theme = themes[mode];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>MindEase</Text>
      <TextInput
        placeholder="Email"
        style={[styles.input, { borderColor: "#159fd7" }]}
        onChangeText={setEmail}
        value={email}
        placeholderTextColor="#777"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        style={[styles.input, { borderColor: "#159fd7" }]}
        onChangeText={setPassword}
        value={password}
        placeholderTextColor="#777"
      />
      <Button
        title="Entrar"
        onPress={async () => {
          const ok = await login(email, password);
          if (ok) navigation.navigate("Dashboard");
          else Alert.alert("Erro", "Email ou senha incorretos");
        }}
      />

      <View style={{ height: 12 }} />

      <Button
        title="Ainda não tenho cadastro"
        onPress={() => navigation.navigate("Cadastro")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 6 },
});
