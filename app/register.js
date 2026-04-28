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

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState(''); // Novo campo obrigatório
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameError = useMemo(() => errors.name || '', [errors.name]);
  const emailError = useMemo(() => errors.email || '', [errors.email]);
  const passwordError = useMemo(() => errors.password || '', [errors.password]);
  const confirmPasswordError = useMemo(() => errors.confirmPassword || '', [errors.confirmPassword]);

  // Regra CP2: O botão não funciona se houver campos vazios
  const isButtonDisabled = isSubmitting || !name.trim() || !email.trim() || !password || !confirmPassword;

  function validateForm() {
    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'O nome completo é obrigatório.';
    }

    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = 'Informe um e-mail válido.';
    }

    if (password.length < 6) {
      nextErrors.password = 'A senha deve ter no mínimo 6 caracteres.';
    }

    if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'A confirmação de senha deve ser idêntica.';
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
      // Passando o name também para o contexto
      const result = await register({ name, email, password });

      if (!result.success) {
        setFormError(result.message || 'Falha ao criar a conta.');
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
          <Ionicons name="person-add-outline" size={54} color="#ED145B" />
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>
            Cadastre o acesso local do app para liberar o ambiente de operação.
          </Text>

          {/* NOVO CAMPO: NOME COMPLETO */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              autoCapitalize="words"
              placeholder="Seu nome completo"
              placeholderTextColor="#6B7280"
              style={[styles.input, nameError ? styles.inputError : null]}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) setErrors((current) => ({ ...current, name: '' }));
                if (formError) setFormError('');
              }}
            />
            {!!nameError && <Text style={styles.errorText}>{nameError}</Text>}
          </View>

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
              placeholder="Mínimo de 6 caracteres"
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

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirmar senha</Text>
            <TextInput
              placeholder="Repita a senha"
              placeholderTextColor="#6B7280"
              secureTextEntry
              style={[styles.input, confirmPasswordError ? styles.inputError : null]}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmPasswordError) {
                  setErrors((current) => ({ ...current, confirmPassword: '' }));
                }
                if (formError) {
                  setFormError('');
                }
              }}
            />
            {!!confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}
          </View>

          {!!formError && <Text style={styles.errorText}>{formError}</Text>}

          <Pressable 
            onPress={handleSubmit} 
            style={[styles.primaryButton, isButtonDisabled && styles.buttonDisabled]} 
            disabled={isButtonDisabled}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Cadastrar e entrar</Text>
            )}
          </Pressable>

          <Pressable onPress={() => router.replace('/login')} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Já tenho conta</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#1E1E1E', borderRadius: 20, borderWidth: 1, borderColor: '#ED145B', padding: 24 },
  title: { marginTop: 16, color: '#F5F5F5', fontSize: 24, fontWeight: '800', textAlign: 'center' },
  subtitle: { marginTop: 10, marginBottom: 24, color: '#B8B8B8', textAlign: 'center', lineHeight: 20 },
  fieldGroup: { marginBottom: 16 },
  label: { marginBottom: 8, color: '#F5F5F5', fontWeight: '700' },
  input: { backgroundColor: '#121212', borderColor: '#334155', borderWidth: 1, borderRadius: 12, color: '#F5F5F5', paddingHorizontal: 14, paddingVertical: 12 },
  inputError: { borderColor: '#EF4444' },
  errorText: { marginTop: 6, color: '#EF4444', fontSize: 13 },
  primaryButton: { backgroundColor: '#ED145B', borderRadius: 12, minHeight: 48, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: '#555555', opacity: 0.7 }, // Estilo do botão desativado
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800' },
  secondaryButton: { marginTop: 12, alignItems: 'center', paddingVertical: 8 },
  secondaryButtonText: { color: '#ED145B', fontWeight: '700' },
});