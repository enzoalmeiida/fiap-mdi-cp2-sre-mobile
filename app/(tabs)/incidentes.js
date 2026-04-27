import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function IncidentesScreen() {
  const [loading, setLoading] = useState(true);
  const [incidentes, setIncidentes] = useState([
    { id: 'INC-1001', titulo: 'Latencia alta no portal academico', status: 'Aberto' },
    { id: 'INC-1002', titulo: 'Perda intermitente de conexao Wi-Fi', status: 'Aberto' },
    { id: 'INC-1003', titulo: 'Leitor de catraca sem resposta', status: 'Aberto' },
  ]);
  const pathname = usePathname();

  useEffect(() => {
    // Diferencial: loading de 2 segundos ao abrir ou trocar de rota.
    setLoading(true);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  const reconhecerFalha = (idIncidente) => {
    setIncidentes((estadoAtual) =>
      estadoAtual.map((incidente) =>
        incidente.id === idIncidente
          ? { ...incidente, status: 'Reconhecido' }
          : incidente,
      ),
    );

    // Diferencial: feedback explícito após o reconhecimento da falha.
    Alert.alert('Sucesso', 'Incidente assumido pela equipe');
  };

  const resolverTodos = () => {
    setIncidentes([]);
  };

  const todosReconhecidos =
    incidentes.length > 0 && incidentes.every((incidente) => incidente.status === 'Reconhecido');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ED145B" />
        <Text style={styles.loadingText}>Buscando incidentes abertos...</Text>
      </View>
    );
  }

  if (incidentes.length === 0 || todosReconhecidos) {
    return (
      <View style={styles.emptyContainer}>
        {/* Diferencial: empty state amigável quando não existe incidente crítico. */}
        <Ionicons name="checkmark-circle-outline" size={72} color="#ED145B" />
        <Text style={styles.emptyTitle}>Nenhum incidente crítico no momento. Tudo operando perfeitamente!</Text>
        <Text style={styles.emptySubtitle}>
          O ambiente está saudável e a equipe pode seguir acompanhando os sinais de observabilidade.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incidentes Abertos</Text>

      {incidentes.map((incidente) => {
        const reconhecido = incidente.status === 'Reconhecido';

        return (
          <View key={incidente.id} style={styles.card}>
            <Text style={styles.id}>{incidente.id}</Text>
            <Text style={styles.titulo}>{incidente.titulo}</Text>
            <Text
              style={[
                styles.status,
                reconhecido ? styles.statusReconhecido : styles.statusAberto,
              ]}
            >
              {incidente.status}
            </Text>

            <Pressable
              onPress={() => reconhecerFalha(incidente.id)}
              disabled={reconhecido}
              style={({ pressed }) => [
                styles.botao,
                reconhecido ? styles.botaoDesabilitado : styles.botaoAtivo,
                pressed && !reconhecido && styles.botaoPressionado,
              ]}
            >
              <Text style={styles.botaoTexto}>Reconhecer Falha</Text>
            </Pressable>
          </View>
        );
      })}

      <Pressable onPress={resolverTodos} style={styles.linkButton}>
        <Text style={styles.linkButtonText}>Simular lista vazia</Text>
      </Pressable>
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
});
