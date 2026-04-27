import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function UptimeScreen() {
  const [servicos, setServicos] = useState([
    { id: '1', nome: 'Portal do Aluno', status: 'Operacional' },
    { id: '2', nome: 'FIAP ON', status: 'Operacional' },
    { id: '3', nome: 'Wi-Fi', status: 'Operacional' },
    { id: '4', nome: 'Catracas', status: 'Operacional' },
  ]);

  useEffect(() => {
    // Simula uma falha assíncrona após 5 segundos de monitoramento.
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
    backgroundColor: '#0B0F14',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    color: '#E6EDF3',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#121A24',
    borderColor: '#1F2A37',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nome: {
    color: '#E6EDF3',
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusOk: {
    backgroundColor: '#0F5132',
  },
  statusFalha: {
    backgroundColor: '#7F1D1D',
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
