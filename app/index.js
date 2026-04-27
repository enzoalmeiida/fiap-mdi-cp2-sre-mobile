import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
  const { isAuthenticated, isBiometricVerified, isHydrating } = useAuth();

  if (isHydrating) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (!isBiometricVerified) {
    return <Redirect href="/biometric" />;
  }

  return <Redirect href="/(tabs)" />;
}
