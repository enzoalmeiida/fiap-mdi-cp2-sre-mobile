import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const INCIDENTS_KEY = '@fiap-status:incidents';

const INITIAL_INCIDENTS = [
  { id: 'INC-1001', titulo: 'Latencia alta no portal academico', status: 'Aberto' },
  { id: 'INC-1002', titulo: 'Perda intermitente de conexao Wi-Fi', status: 'Aberto' },
  { id: 'INC-1003', titulo: 'Leitor de catraca sem resposta', status: 'Aberto' },
];

function triggerSuccessFeedback() {
  return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export default function IncidentesScreen() {
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [incidentes, setIncidentes] = useState(INITIAL_INCIDENTS);

  useEffect(() => {
    let isMounted = true;

    async function loadIncidents() {
      try {
        const storedIncidents = await AsyncStorage.getItem(INCIDENTS_KEY);

        if (storedIncidents && isMounted) {
          setIncidentes(JSON.parse(storedIncidents));
        }
      } catch {
        if (isMounted) {
          setIncidentes(INITIAL_INCIDENTS);
        }
      } finally {
        if (isMounted) {
          setHydrated(true);
          setLoading(false);
        }
      }
    }

    loadIncidents();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    AsyncStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidentes)).catch(() => {});
  }, [hydrated, incidentes]);

  const filteredIncidents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return incidentes;
    }

    return incidentes.filter((incident) => {
      return [incident.id, incident.titulo, incident.status]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [incidentes, searchQuery]);

  const allRecognized = incidentes.length > 0 && incidentes.every((incident) => incident.status === 'Reconhecido');

  async function reconhecerFalha(idIncidente) {
    setIncidentes((current) =>
      current.map((incident) =>
        incident.id === idIncidente ? { ...incident, status: 'Reconhecido' } : incident,
      ),
    );

    await triggerSuccessFeedback();
  }

  async function resolverTodos() {
    setIncidentes([]);
    await triggerSuccessFeedback();
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ED145B" />
        <Text style={styles.loadingText}>Buscando incidentes e restaurando o estado...</Text>
      </View>
    );
  }

  if (incidentes.length === 0 || allRecognized) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="checkmark-circle-outline" size={72} color="#ED145B" />
        <Text style={styles.emptyTitle}>Nenhum incidente crítico no momento.</Text>
        <Text style={styles.emptySubtitle}>
          O ambiente está saudável e a equipe pode seguir acompanhando os sinais de observabilidade.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incidentes Abertos</Text>

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Pesquisar por ID, status ou descrição"
        placeholderTextColor="#6B7280"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredIncidents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={filteredIncidents.length === 0 ? styles.listEmptyContent : styles.listContent}
        renderItem={({ item }) => {
          const recognized = item.status === 'Reconhecido';

          return (
            <View style={styles.card}>
              <Text style={styles.id}>{item.id}</Text>
              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text style={[styles.status, recognized ? styles.statusReconhecido : styles.statusAberto]}>
                {item.status}
              </Text>

              <Pressable
                onPress={() => reconhecerFalha(item.id)}
                disabled={recognized}
                style={({ pressed }) => [
                  styles.botao,
                  recognized ? styles.botaoDesabilitado : styles.botaoAtivo,
                  pressed && !recognized && styles.botaoPressionado,
                ]}
              >
                <Text style={styles.botaoTexto}>Reconhecer Falha</Text>
              </Pressable>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.noResultsCard}>
            <Ionicons name="search-outline" size={42} color="#ED145B" />
            <Text style={styles.noResultsTitle}>Nenhum incidente encontrado</Text>
            <Text style={styles.noResultsSubtitle}>Ajuste o termo de busca para localizar outra ocorrência.</Text>
          </View>
        }
        ListFooterComponent={
          <Pressable onPress={resolverTodos} style={styles.linkButton}>
            <Text style={styles.linkButtonText}>Simular lista vazia</Text>
          </Pressable>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#F5F5F5',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    marginTop: 16,
    color: '#F5F5F5',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 10,
    color: '#B8B8B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  title: {
    color: '#F5F5F5',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#1E1E1E',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    color: '#F5F5F5',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  listContent: {
    paddingBottom: 16,
  },
  listEmptyContent: {
    flexGrow: 1,
    paddingBottom: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderColor: '#ED145B',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  id: {
    color: '#ED145B',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '700',
  },
  titulo: {
    color: '#F5F5F5',
    fontSize: 15,
    marginBottom: 8,
  },
  status: {
    fontWeight: '700',
    marginBottom: 10,
  },
  statusAberto: {
    color: '#F5F5F5',
  },
  statusReconhecido: {
    color: '#ED145B',
  },
  botao: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  botaoAtivo: {
    backgroundColor: '#ED145B',
  },
  botaoDesabilitado: {
    backgroundColor: '#334155',
  },
  botaoPressionado: {
    opacity: 0.8,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  linkButton: {
    marginTop: 8,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  linkButtonText: {
    color: '#ED145B',
    fontWeight: '700',
  },
  noResultsCard: {
    backgroundColor: '#1E1E1E',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  noResultsTitle: {
    marginTop: 12,
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  noResultsSubtitle: {
    marginTop: 8,
    color: '#B8B8B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});
