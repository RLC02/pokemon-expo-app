import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Platform, KeyboardAvoidingView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useRouteContext } from './_layout';

export default function LoginScreen() {
  const { login, register } = useAuth();
  const { setCurrentRoute } = useRouteContext();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRotating, setIsRotating] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Por favor, preencha usuário e senha.');
      return;
    }

    setError('');
    setIsRotating(true);
    
    try {
      if (isLoginMode) {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), password);
      }
      // O roteamento é lidado automaticamente no _layout baseado no isLoggedIn
      setCurrentRoute('pokedex');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
      setIsRotating(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setPassword('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.loginCard}>
        {/* Animação Pokébola */}
        <Pressable 
          onPress={() => setIsRotating(!isRotating)}
          style={[styles.pokeBallWrapper]}
        >
          <View style={[
            styles.pokeBall,
            isRotating && styles.pokeBallSpin
          ]}>
            <View style={styles.pokeBallTop} />
            <View style={styles.pokeBallLine} />
            <View style={styles.pokeBallCenterButtonOuter}>
              <View style={styles.pokeBallCenterButtonInner} />
            </View>
          </View>
        </Pressable>

        <Text style={styles.welcomeTitle}>
          {isLoginMode ? 'Bem-vindo de Volta!' : 'Novo Treinador!'}
        </Text>
        <Text style={styles.subtitle}>
          {isLoginMode ? 'Faça login para continuar sua jornada pokémon.' : 'Crie o seu perfil e monte sua equipe pokémon lendária.'}
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome de Treinador</Text>
            <TextInput
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (error) setError('');
              }}
              placeholder="Ex: kleber"
              placeholderTextColor="#8B949E"
              style={[styles.input, error ? styles.inputError : null]}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError('');
              }}
              placeholder="••••••••"
              placeholderTextColor="#8B949E"
              secureTextEntry
              style={[styles.input, error ? styles.inputError : null]}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
            ]}
          >
            <Text style={styles.submitButtonText}>
              {isRotating ? 'Carregando...' : (isLoginMode ? 'Entrar' : 'Criar Conta')}
            </Text>
          </Pressable>

          <Pressable onPress={toggleMode} style={styles.toggleModeButton}>
            <Text style={styles.toggleModeText}>
              {isLoginMode ? 'Ainda não tem conta? Crie uma.' : 'Já tem uma conta? Faça login.'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footerText}>
          Temos que pegar! © 2026 PokeWeb
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loginCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(26, 28, 35, 0.75)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(12px)',
      } as any,
    }),
  },
  pokeBallWrapper: {
    marginBottom: 24,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      } as any,
    }),
  },
  pokeBall: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 5,
    borderColor: '#1A1C23',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#FF3E3E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  pokeBallSpin: {
    ...Platform.select({
      web: {
        animationKeyframes: 'pokeball-spin',
        animationDuration: '1s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
      } as any,
    }),
  },
  pokeBallTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '46%',
    backgroundColor: '#FF3E3E',
  },
  pokeBallLine: {
    position: 'absolute',
    top: '46%',
    left: 0,
    right: 0,
    height: '8%',
    backgroundColor: '#1A1C23',
  },
  pokeBallCenterButtonOuter: {
    position: 'absolute',
    top: '32%',
    left: '32%',
    width: '36%',
    height: '36%',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#1A1C23',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  pokeBallCenterButtonInner: {
    width: '50%',
    height: '50%',
    borderRadius: 5,
    backgroundColor: '#FF3E3E',
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#8B949E',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  form: {
    width: '100%',
    gap: 16,
  },
  inputGroup: {
    width: '100%',
    gap: 8,
  },
  label: {
    color: '#E6EDF3',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 15,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        transition: 'all 0.2s',
      } as any,
    }),
  },
  inputError: {
    borderColor: '#FF3E3E',
  },
  errorText: {
    color: '#FF6464',
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF3E3E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FF3E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      } as any,
    }),
  },
  submitButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  toggleModeButton: {
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      } as any,
    }),
  },
  toggleModeText: {
    color: '#4D90E2',
    fontSize: 14,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 32,
    color: '#525866',
    fontSize: 11,
    fontWeight: '500',
  },
});
