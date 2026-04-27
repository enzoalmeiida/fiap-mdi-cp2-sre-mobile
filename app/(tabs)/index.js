import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

export default function UptimeScreen() {
  const [loading, setLoading] = useState(true);
  const [servicos, setServicos] = useState([
    { id: '1', nome: 'Portal do Aluno', status: 'Operacional' },
    { id: '2', nome: 'FIAP ON', status: 'Operacional' },
    { id: '3', nome: 'Wi-Fi', status: 'Operacional' },
    { id: '4', nome: 'Catracas', status: 'Operacional' },
  ]);
  const pathname = usePathname();

  useEffect(() => {
    // Diferencial: loading de 2 segundos quando a rota é aberta ou trocada.
    setLoading(true);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  useEffect(() => {
    // Simula uma falha em um servico 5s apos abrir a tela.
    const timeoutId = setTimeout(() => {
      setServicos((estadoAtual) =>
        estadoAtual.map((servico, index) =>
          index === 2 ? { ...servico, status: 'Falha' } : servico,
        ),
      );
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  const renderItem = ({ item }) => {
    const isOperational = item.status === 'Operacional';

    return (
      <View style={styles.card}>
        <Text style={styles.nome}>{item.nome}</Text>
        <View
          style={[
            styles.statusBadge,
            isOperational ? styles.statusOk : styles.statusFalha,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {/* Diferencial: feedback visual com ActivityIndicator na cor oficial da FIAP. */}
        <ActivityIndicator size="large" color="#ED145B" />
        <Text style={styles.loadingText}>Carregando telemetria dos sistemas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Status dos Sistemas Críticos</Text>
      <FlatList
        data={servicos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingTop: 16,
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
  title: {
    color: '#F5F5F5',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderColor: '#ED145B',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nome: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusOk: {
    backgroundColor: '#ED145B',
  },
  statusFalha: {
    backgroundColor: '#5A102C',
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
