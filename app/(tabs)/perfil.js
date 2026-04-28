import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useAuth } from '../../src/context/AuthContext'; 

export default function PerfilScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Ionicons name="person-circle-outline" size={100} color="#ED145B" />
        <Text style={styles.name}>{user?.name || 'Operador SRE'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Status da Sessão</Text>
        <Text style={styles.infoText}>Sessão local ativa e autenticada com SecureStore.</Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={signOut}>
        <Ionicons name="log-out-outline" size={24} color="#FFF" />
        <Text style={styles.logoutText}>Sair da Conta (Logout)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center', padding: 20 },
  profileCard: { alignItems: 'center', marginBottom: 40 },
  name: { color: '#F5F5F5', fontSize: 26, fontWeight: '800', marginTop: 15 },
  email: { color: '#B8B8B8', fontSize: 16, marginTop: 5 },
  infoSection: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#334155', width: '100%', marginBottom: 30 },
  infoTitle: { color: '#F5F5F5', fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  infoText: { color: '#9CA3AF', lineHeight: 20 },
  logoutButton: { flexDirection: 'row', backgroundColor: '#ED145B', padding: 16, borderRadius: 12, alignItems: 'center', width: '100%', justifyContent: 'center' },
  logoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }
});