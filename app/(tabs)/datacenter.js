import { usePathname } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function DatacenterScreen() {
  const [loading, setLoading] = useState(true);
  const [temperatura, setTemperatura] = useState(22.0);
  const [umidade] = useState(48);
  const [consumoEnergia] = useState(72);

  const cardWidth = Dimensions.get('window').width * 0.9;
  const pathname = usePathname();

  useEffect(() => {
    // Diferencial: loading de 2 segundos quando a rota fica ativa.
    setLoading(true);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  useEffect(() => {
    // Simula telemetria IoT variando a temperatura em pequenos intervalos.
    const intervalId = setInterval(() => {
      setTemperatura((tempAtual) => {
        const variacao = Math.random() * 1.2 - 0.6;
        const novaTemp = tempAtual + variacao;
        return Number(novaTemp.toFixed(1));
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const alertaAtivo = useMemo(() => temperatura > 25, [temperatura]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {/* Diferencial: ActivityIndicator padronizado com a cor FIAP. */}
        <ActivityIndicator size="large" color="#ED145B" />
        <Text style={styles.loadingText}>Sincronizando sensores do datacenter...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Datacenter</Text>

      <View style={[styles.metricCard, { width: cardWidth }]}>
        <Text style={styles.metricLabel}>Temperatura</Text>
        <Text style={styles.metricValue}>{temperatura.toFixed(1)} °C</Text>
      </View>

      <View style={[styles.metricCard, { width: cardWidth }]}>
        <Text style={styles.metricLabel}>Umidade</Text>
        <Text style={styles.metricValue}>{umidade}%</Text>
      </View>

      <View style={[styles.metricCard, { width: cardWidth }]}>
        <Text style={styles.metricLabel}>Consumo de Energia</Text>
        <Text style={styles.metricValue}>{consumoEnergia} kW</Text>
      </View>

      {alertaAtivo && (
        <View style={styles.alertBox}>
          {/* Diferencial: alerta visual quando a telemetria ultrapassa o limite. */}
          <Text style={styles.alertText}>
            ALERTA: Temperatura acima de 25 °C! Verificar refrigeração.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
    alignSelf: 'flex-start',
  },
  metricCard: {
    backgroundColor: '#1E1E1E',
    borderColor: '#ED145B',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  metricLabel: {
    color: '#B8B8B8',
    fontSize: 14,
    marginBottom: 4,
  },
  metricValue: {
    color: '#F5F5F5',
    fontSize: 26,
    fontWeight: '700',
  },
  alertBox: {
    marginTop: 10,
    backgroundColor: '#ED145B',
    borderRadius: 10,
    padding: 12,
    width: '90%',
  },
  alertText: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
});
