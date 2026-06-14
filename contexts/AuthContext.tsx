import React, { createContext, useContext, useState, useEffect } from 'react';
import { pokemonApi } from '../integration/api';
import { saveLoginSession, getLoginSession, clearLoginSession } from '../utils/storage';

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  username: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getLoginSession();
        if (session && session.userId) {
          setUserId(session.userId);
          setUsername(session.username);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error('Failed to load session:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  const login = async (user: string, pass: string) => {
    const res = await pokemonApi.login({ username: user, password: pass });
    // Caso não retorne ID usamos o username como fallback
    const id = String(res.userId || res.id || res['user-id'] || user); // Fallback para usuário
    
    await saveLoginSession({ userId: id, username: user });
    setUserId(id);
    setUsername(user);
    setIsLoggedIn(true);
  };

  const register = async (user: string, pass: string) => {
    const res = await pokemonApi.register({ username: user, password: pass });
    // Efetua login automático após o registro
    const id = String(res.userId || res.id || res['user-id'] || user); 
    
    await saveLoginSession({ userId: id, username: user });
    setUserId(id);
    setUsername(user);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await clearLoginSession();
    setUserId(null);
    setUsername(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, username, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
