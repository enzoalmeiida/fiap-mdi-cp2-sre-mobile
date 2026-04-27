import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../src/context/AuthContext';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailError = useMemo(() => errors.email || '', [errors.email]);
  const passwordError = useMemo(() => errors.password || '', [errors.password]);

  function validateForm() {
    const nextErrors = {};

    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = 'Informe um e-mail válido.';
    }

    if (password.length < 6) {
      nextErrors.password = 'A senha deve ter no mínimo 6 caracteres.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    setFormError('');

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await signIn({ email, password });

      if (!result.success) {
        setFormError(result.message || 'Falha ao autenticar.');
        return;
      }

      router.replace('/(tabs)');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Ionicons name="shield-checkmark-outline" size={54} color="#ED145B" />
          <Text style={styles.title}>FIAP Status & SRE Mobile</Text>
          <Text style={styles.subtitle}>Acesso seguro ao painel de operação e monitoramento.</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="seuemail@fiap.com.br"
              placeholderTextColor="#6B7280"
              style={[styles.input, emailError ? styles.inputError : null]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) {
                  setErrors((current) => ({ ...current, email: '' }));
                }
                if (formError) {
                  setFormError('');
                }
              }}
            />
            {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              placeholder="Sua senha"
              placeholderTextColor="#6B7280"
              secureTextEntry
              style={[styles.input, passwordError ? styles.inputError : null]}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) {
                  setErrors((current) => ({ ...current, password: '' }));
                }
                if (formError) {
                  setFormError('');
                }
              }}
            />
            {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
          </View>

          {!!formError && <Text style={styles.errorText}>{formError}</Text>}

          <Pressable onPress={handleSubmit} style={styles.primaryButton} disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Entrar</Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.push('/register')} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Criar conta</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ED145B',
    padding: 24,
  },
  title: {
    marginTop: 16,
    color: '#F5F5F5',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 24,
    color: '#B8B8B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: '#F5F5F5',
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#121212',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    color: '#F5F5F5',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    marginTop: 6,
    color: '#EF4444',
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#ED145B',
    borderRadius: 12,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  secondaryButton: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: '#ED145B',
    fontWeight: '700',
  },
});
