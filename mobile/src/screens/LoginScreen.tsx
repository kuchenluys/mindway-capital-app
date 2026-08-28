import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '@hooks/useAuth';

const LoginScreen = () => {
  const [email, setEmail] = useState('demo@mindway.com');
  const [password, setPassword] = useState('demo123');
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      Alert.alert('Éxito', 'Sesión iniciada correctamente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name);
      Alert.alert('Éxito', 'Cuenta creada correctamente');
      setIsSignup(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>💎</Text>
          <Text style={styles.title}>Mindway Capital</Text>
          <Text style={styles.subtitle}>Plataforma de Trading & Desarrollo</Text>
        </View>

        <View style={styles.form}>
          {isSignup && (
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={setName}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={isSignup ? handleSignup : handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0f172a" />
            ) : (
              <Text style={styles.buttonText}>
                {isSignup ? 'Crear Cuenta' : 'Iniciar Sesión'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
            <Text style={styles.link}>
              {isSignup
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿No tienes cuenta? Regístrate'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demo}>
          <Text style={styles.demoTitle}>Demo Credentials:</Text>
          <Text style={styles.demoText}>Email: demo@mindway.com</Text>
          <Text style={styles.demoText}>Password: demo123</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  form: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 8,
    color: '#e2e8f0',
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#fbbf24',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
  demo: {
    backgroundColor: '#1e293b',
    borderLeftColor: '#fbbf24',
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 4,
  },
  demoTitle: {
    color: '#fbbf24',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  demoText: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
});

export default LoginScreen;
