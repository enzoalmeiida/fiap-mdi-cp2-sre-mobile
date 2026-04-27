import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../src/context/AuthContext';

export default function BiometricScreen() {
  const router = useRouter();
  const { unlockWithBiometrics, signOut } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [message, setMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authenticate = useCallback(async () => {
    try {
      setMessage('');
      setIsAuthenticating(true);

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setMessage('Biometria indisponível neste dispositivo.');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Libere o acesso ao FIAP Status & SRE Mobile',
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar senha',
        disableDeviceFallback: false,
      });

      if (!result.success) {
        setMessage('Falha na autenticação biométrica. Tente novamente.');
        return;
      }

      await unlockWithBiometrics();
      router.replace('/(tabs)');
    } catch {
      setMessage('Não foi possível validar a biometria agora.');
    } finally {
      setIsAuthenticating(false);
      setIsChecking(false);
    }
  }, [router, unlockWithBiometrics]);

  useEffect(() => {
    void authenticate();
  }, [authenticate]);

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="finger-print-outline" size={56} color="#ED145B" />
        <Text style={styles.title}>Desbloqueio Biométrico</Text>
        <Text style={styles.subtitle}>
          Use Face ID ou Touch ID para liberar o dashboard operacional.
        </Text>

        {(isChecking || isAuthenticating) && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#ED145B" />
            <Text style={styles.loadingText}>Validando identidade segura...</Text>
          </View>
        )}

        {!!message && <Text style={styles.errorText}>{message}</Text>}

        <Pressable onPress={authenticate} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Tentar novamente</Text>
        </Pressable>

        <Pressable onPress={handleSignOut} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Trocar de conta</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderColor: '#ED145B',
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    marginTop: 16,
    color: '#F5F5F5',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    color: '#B8B8B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  loadingText: {
    color: '#F5F5F5',
    fontSize: 14,
  },
  errorText: {
    marginTop: 14,
    color: '#F87171',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  primaryButton: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#ED145B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  secondaryButton: {
    marginTop: 12,
    width: '100%',
    backgroundColor: 'transparent',
    borderColor: '#ED145B',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#ED145B',
    fontWeight: '800',
  },
});
