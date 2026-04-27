import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';

const SESSION_KEY = '@fiap-status:session';
const USER_KEY = '@fiap-status:registered-user';

const AuthContext = createContext(null);

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function createSessionToken() {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [isBiometricVerified, setIsBiometricVerified] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const [storedSession, storedUser] = await Promise.all([
          SecureStore.getItemAsync(SESSION_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);

        if (!storedSession || !storedUser) {
          return;
        }

        const parsedSession = JSON.parse(storedSession);
        const parsedUser = JSON.parse(storedUser);

        if (parsedSession?.token && parsedSession?.email === parsedUser?.email) {
          setUser(parsedUser);
          setSessionToken(parsedSession.token);
          setIsBiometricVerified(false);
          return;
        }

        await SecureStore.deleteItemAsync(SESSION_KEY);
      } catch {
        await SecureStore.deleteItemAsync(SESSION_KEY);
      } finally {
        if (isMounted) {
          setIsHydrating(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active' && sessionToken) {
        setIsBiometricVerified(false);
      }
    });

    return () => subscription.remove();
  }, [sessionToken]);

  const persistSession = async (account) => {
    const token = createSessionToken();

    await SecureStore.setItemAsync(
      SESSION_KEY,
      JSON.stringify({ token, email: account.email }),
    );

    setUser(account);
    setSessionToken(token);
    setIsBiometricVerified(true);

    return { success: true };
  };

  const register = async ({ email, password }) => {
    const normalizedEmail = normalizeEmail(email);
    const account = {
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(account));
    return persistSession(account);
  };

  const signIn = async ({ email, password }) => {
    const storedUser = await AsyncStorage.getItem(USER_KEY);

    if (!storedUser) {
      return {
        success: false,
        message: 'Nenhuma conta cadastrada. Faça seu cadastro primeiro.',
      };
    }

    const account = JSON.parse(storedUser);
    const normalizedEmail = normalizeEmail(email);

    if (normalizedEmail !== account.email || password !== account.password) {
      return {
        success: false,
        message: 'E-mail ou senha inválidos.',
      };
    }

    return persistSession(account);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    setUser(null);
    setSessionToken(null);
    setIsBiometricVerified(false);
  };

  const unlockWithBiometrics = async () => {
    setIsBiometricVerified(true);
    return { success: true };
  };

  const value = {
    user,
    sessionToken,
    isAuthenticated: Boolean(sessionToken),
    isBiometricVerified,
    isHydrating,
    register,
    signIn,
    signOut,
    unlockWithBiometrics,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
