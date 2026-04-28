import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const INCIDENTS_KEY = '@fiap-status:incidents';

// 2 Incidentes pré-registrados para demonstração
const INITIAL_INCIDENTS = [
  { 
    id: 'INC-1001', 
    titulo: 'Falha de comunicação com o banco de dados principal', 
    gravidade: 'Crítica', 
    status: 'Aberto',
    dataCriacao: '28/04/2026 às 19:30'
  },
  { 
    id: 'INC-1002', 
    titulo: 'Latência alta no serviço de autenticação', 
    gravidade: 'Média', 
    status: 'Aberto',
    dataCriacao: '28/04/2026 às 20:00'
  },
];

function triggerSuccessFeedback() {
  return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export default function IncidentesScreen() {
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [incidentes, setIncidentes] = useState(INITIAL_INCIDENTS);
  const [novoIncidente, setNovoIncidente] = useState({ titulo: '', gravidade: 'Alta' });
  const [evidenceUri, setEvidenceUri] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadIncidents() {
      try {
        const storedIncidents = await AsyncStorage.getItem(INCIDENTS_KEY);
        if (storedIncidents && isMounted) {
          setIncidentes(JSON.parse(storedIncidents));
        }
      } catch {
        if (isMounted) setIncidentes(INITIAL_INCIDENTS);
      } finally {
        if (isMounted) {
          setHydrated(true);
          setLoading(false);
        }
      }
    }
    loadIncidents();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidentes)).catch(() => {});
  }, [hydrated, incidentes]);

  const filteredIncidents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return incidentes;
    return incidentes.filter((incident) => {
      return [incident.id, incident.titulo, incident.status]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [incidentes, searchQuery]);

  async function salvarIncidente() {
    if (!novoIncidente.titulo.trim()) return;
    const item = {
      id: `INC-${Date.now()}`,
      titulo: novoIncidente.titulo.trim(),
      gravidade: novoIncidente.gravidade,
      status: 'Aberto',
      evidenceUri,
      dataCriacao: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setIncidentes((current) => [item, ...current]);
    setNovoIncidente({ titulo: '', gravidade: 'Alta' });
    setEvidenceUri('');
    await triggerSuccessFeedback();
  }

  async function excluirIncidente(idIncidente) {
    setIncidentes((current) => current.filter((incident) => incident.id !== idIncidente));
    await triggerSuccessFeedback();
  }

  async function anexarEvidencia(source) {
    const result = source === 'camera' 
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setEvidenceUri(result.assets[0].uri);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ED145B" />
        <Text style={styles.loadingText}>Restaurando estado...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={filteredIncidents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Gestão de Incidentes</Text>
            <View style={styles.formCard}>
              <Text style={styles.formLabel}>Registrar Novo Incidente</Text>
              <TextInput
                placeholder="O que aconteceu?"
                placeholderTextColor="#6B7280"
                value={novoIncidente.titulo}
                onChangeText={(text) => setNovoIncidente((current) => ({ ...current, titulo: text }))}
                style={styles.input}
              />
              <TextInput
                placeholder="Gravidade (Ex: Crítica, Alta, Média)"
                placeholderTextColor="#6B7280"
                value={novoIncidente.gravidade}
                onChangeText={(text) => setNovoIncidente((current) => ({ ...current, gravidade: text }))}
                style={styles.input}
              />
              <View style={styles.evidenceRow}>
                <Pressable onPress={() => anexarEvidencia('camera')} style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Câmera</Text>
                </Pressable>
                <Pressable onPress={() => anexarEvidencia('library')} style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Galeria</Text>
                </Pressable>
              </View>
              {!!evidenceUri && <Image source={{ uri: evidenceUri }} style={styles.previewImage} />}
              <Pressable 
                onPress={salvarIncidente} 
                style={[styles.primaryButton, !novoIncidente.titulo.trim() && styles.botaoDesabilitado]}
                disabled={!novoIncidente.titulo.trim()}
              >
                <Text style={styles.primaryButtonText}>Salvar Incidente</Text>
              </Pressable>
            </View>
            <TextInput
              placeholder="Pesquisar incidentes..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
             <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.id}>{item.id}</Text>
                <Pressable onPress={() => excluirIncidente(item.id)}>
                   <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </Pressable>
             </View>
             {!!item.evidenceUri && <Image source={{ uri: item.evidenceUri }} style={styles.cardImage} />}
             <Text style={styles.titulo}>{item.titulo}</Text>
             <Text style={styles.gravidade}>Gravidade: {item.gravidade}</Text>
             {item.dataCriacao && <Text style={styles.dateText}>🕒 {item.dataCriacao}</Text>}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={60} color="#ED145B" />
            <Text style={styles.emptyTitle}>Ambiente Saudável</Text>
            <Text style={styles.emptySubtitle}>Não há incidentes registrados no momento.</Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  loadingContainer: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#F5F5F5' },
  title: { color: '#F5F5F5', fontSize: 22, fontWeight: '800', marginBottom: 15 },
  formCard: { backgroundColor: '#1E1E1E', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  formLabel: { color: '#ED145B', fontWeight: 'bold', marginBottom: 12, fontSize: 16 },
  input: { backgroundColor: '#121212', borderRadius: 10, color: '#F5F5F5', padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  evidenceRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  secondaryButton: { flex: 1, borderColor: '#ED145B', borderWidth: 1, borderRadius: 10, padding: 12, alignItems: 'center' },
  secondaryButtonText: { color: '#ED145B', fontWeight: 'bold' },
  primaryButton: { backgroundColor: '#ED145B', borderRadius: 10, padding: 15, alignItems: 'center' },
  primaryButtonText: { color: '#FFF', fontWeight: 'bold' },
  botaoDesabilitado: { opacity: 0.5 },
  searchInput: { backgroundColor: '#1E1E1E', borderRadius: 10, color: '#F5F5F5', padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#334155' },
  card: { backgroundColor: '#1E1E1E', borderRadius: 12, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: '#ED145B' },
  id: { color: '#ED145B', fontWeight: 'bold', fontSize: 12, marginBottom: 5 },
  titulo: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  gravidade: { color: '#B8B8B8', fontSize: 14, marginBottom: 5 },
  dateText: { color: '#9CA3AF', fontSize: 12 },
  previewImage: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10 },
  cardImage: { width: '100%', height: 150, borderRadius: 10, marginBottom: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyTitle: { color: '#F5F5F5', fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  emptySubtitle: { color: '#B8B8B8', textAlign: 'center', marginTop: 5 },
  listContent: { paddingBottom: 30 }
});