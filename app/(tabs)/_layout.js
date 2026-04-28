import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: '#121212',
        },
        headerTitleStyle: {
          color: '#F5F5F5',
          fontWeight: '700',
        },
        headerTintColor: '#ED145B',
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopColor: '#1E1E1E',
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarActiveTintColor: '#ED145B',
        tabBarInactiveTintColor: '#B8B8B8',
        tabBarIcon: ({ color, size }) => {
          let iconName = 'ellipse';

          // Definindo os ícones baseados no nome da rota
          if (route.name === 'index') {
            iconName = 'pulse-outline';
          } else if (route.name === 'datacenter') {
            iconName = 'server-outline';
          } else if (route.name === 'incidentes') {
            iconName = 'alert-circle-outline';
          } else if (route.name === 'perfil') {
            iconName = 'person-circle-outline'; // Ícone para a aba de Perfil
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Uptime',
        }}
      />
      <Tabs.Screen
        name="datacenter"
        options={{
          title: 'Datacenter',
        }}
      />
      <Tabs.Screen
        name="incidentes"
        options={{
          title: 'Incidentes',
        }}
      />
      {/* Adicionando a nova tela de perfil (Logout) na barra inferior */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
        }}
      />
    </Tabs>
  );
}