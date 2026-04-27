import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

function NavigationGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isBiometricVerified, isHydrating } = useAuth();

  useEffect(() => {
    if (isHydrating) {
      return;
    }

    const rootSegment = segments[0];
    const isAuthScreen = rootSegment === 'login' || rootSegment === 'register';
    const isBiometricScreen = rootSegment === 'biometric';
    const isTabsGroup = rootSegment === '(tabs)';

    if (!isAuthenticated) {
      if (!isAuthScreen) {
        router.replace('/login');
      }

      return;
    }

    if (!isBiometricVerified) {
      if (!isBiometricScreen) {
        router.replace('/biometric');
      }

      return;
    }

    if (isAuthScreen || isBiometricScreen || !isTabsGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isBiometricVerified, isHydrating, router, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="biometric" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NavigationGuard />
    </AuthProvider>
  );
}
