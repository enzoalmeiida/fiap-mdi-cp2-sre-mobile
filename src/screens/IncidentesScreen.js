import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function IncidentesScreen() {
  const [incidentes, setIncidentes] = useState([
    { id: 'INC-1001', titulo: 'Latência alta no portal acadêmico', status: 'Aberto' },
    { id: 'INC-1002', titulo: 'Perda intermitente de conexão Wi-Fi', status: 'Aberto' },
    { id: 'INC-1003', titulo: 'Leitor de catraca sem resposta', status: 'Aberto' },
  ]);

  const reconhecerFalha = (idIncidente) => {
    setIncidentes((estadoAtual) =>
      estadoAtual.map((incidente) =>
        incidente.id === idIncidente
          ? { ...incidente, status: 'Reconhecido' }
          : incidente,
      ),
    );
  };

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
    padding: 16,
  },
  title: {
    color: '#E6EDF3',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#121A24',
    borderColor: '#1F2A37',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  id: {
    color: '#00FF9C',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '700',
  },
  titulo: {
    color: '#E6EDF3',
    fontSize: 15,
    marginBottom: 8,
  },
  status: {
    fontWeight: '700',
    marginBottom: 10,
  },
  statusAberto: {
    color: '#F87171',
  },
  statusReconhecido: {
    color: '#34D399',
  },
  botao: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  botaoAtivo: {
    backgroundColor: '#1D4ED8',
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
});
