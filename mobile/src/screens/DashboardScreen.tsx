import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import useRealtimeNotifications from '@hooks/useRealtimeNotifications';
import { RootState } from '@store/index';

const DashboardScreen = () => {
  useRealtimeNotifications();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>¡Hola, {user?.name}! 👋</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statValue}>$12,450</Text>
            <Text style={styles.statLabel}>Portfolio</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📈</Text>
            <Text style={styles.statValue}>87%</Text>
            <Text style={styles.statLabel}>Progreso</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Racha</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={styles.statValue}>1.2K</Text>
            <Text style={styles.statLabel}>Comunidad</Text>
          </View>
        </View>

        <View style={styles.planBanner}>
          <Text style={styles.planText}>💎 Plan {user?.plan?.toUpperCase()}</Text>
        </View>

        <Text style={styles.sectionTitle}>Actividad Reciente</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>📊 Posición abierta XAUUSD</Text>
          <Text style={styles.activityTime}>+180 pips • Hace 2h</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#fbbf24', marginBottom: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: '#1e293b', borderRadius: 12, 
    padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#334155'
  },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#fbbf24', marginBottom: 4 },
  statLabel: { color: '#94a3b8', fontSize: 12 },
  planBanner: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 20 },
  planText: { color: '#fbbf24', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#e2e8f0', marginBottom: 12 },
  activityCard: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12 },
  activityTitle: { color: '#e2e8f0', fontWeight: '600', marginBottom: 4 },
  activityTime: { color: '#94a3b8', fontSize: 12 },
});

export default DashboardScreen;
