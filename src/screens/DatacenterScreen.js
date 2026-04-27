import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DatacenterScreen() {
  const [temperatura, setTemperatura] = useState(22.0);
  const [umidade] = useState(48);
  const [consumoEnergia] = useState(72);

  useEffect(() => {
    // Emula telemetria IoT variando a temperatura em pequenos passos periódicos.
    const intervalId = setInterval(() => {
      setTemperatura((tempAtual) => {
        const variacao = (Math.random() * 1.2 - 0.6);
        const novaTemp = tempAtual + variacao;
        return Number(novaTemp.toFixed(1));
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const alertaAtivo = useMemo(() => temperatura > 25, [temperatura]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Datacenter</Text>

      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>Temperatura</Text>
        <Text style={styles.metricValue}>{temperatura.toFixed(1)}°C</Text>
      </View>

      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>Umidade</Text>
        <Text style={styles.metricValue}>{umidade}%</Text>
      </View>

      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>Consumo de Energia</Text>
        <Text style={styles.metricValue}>{consumoEnergia} kW</Text>
      </View>

      {alertaAtivo && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            ALERTA: Temperatura acima de 25°C! Verificar refrigeração.
          </Text>
        </View>
      )}
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
  metricCard: {
    backgroundColor: '#121A24',
    borderColor: '#1F2A37',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  metricLabel: {
    color: '#9AA7B5',
    fontSize: 14,
    marginBottom: 4,
  },
  metricValue: {
    color: '#E6EDF3',
    fontSize: 26,
    fontWeight: '700',
  },
  alertBox: {
    marginTop: 10,
    backgroundColor: '#7F1D1D',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F87171',
    padding: 12,
  },
  alertText: {
    color: '#FDECEC',
    fontWeight: '700',
  },
});
