import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../infra/context/AuthContext";
import { themes, useTheme } from "../infra/context/ThemeContext";

export default function Cadastro({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mode } = useTheme();
  const theme = themes[mode];
  const { signup } = useAuth();

  const handleSubmit = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não conferem");
      return;
    }

    const res = await signup(email, password);
    if (res) {
      Alert.alert("Sucesso", "Cadastro realizado com sucesso");
      navigation.navigate("Login");
    } else {
      Alert.alert("Erro", "Não foi possível realizar o cadastro");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        MindEase - Cadastro
      </Text>

      <TextInput
        placeholder="Nome de usuário"
        value={username}
        onChangeText={setUsername}
        style={[styles.input, { borderColor: "#159fd7" }]}
        placeholderTextColor="#777"
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[styles.input, { borderColor: "#159fd7" }]}
        placeholderTextColor="#777"
      />

      <View style={{ width: "100%" }}>
        <TextInput
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={[styles.input, { borderColor: "#159fd7" }]}
          placeholderTextColor="#777"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.togglePassword}
        >
          <Text>{showPassword ? "Ocultar" : "Mostrar"}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Confirmar senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
        style={[styles.input, { borderColor: "#159fd7" }]}
        placeholderTextColor="#777"
      />

      <Button title="Realizar Cadastro" onPress={handleSubmit} />

      <View style={{ marginTop: 12 }} />

      <Button
        title="Voltar para Login"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 22, marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    width: "100%",
    marginBottom: 10,
    borderRadius: 6,
  },
  togglePassword: { position: "absolute", right: 10, top: 12 },
});
