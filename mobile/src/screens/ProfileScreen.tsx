import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/index';
import useAuth from '@hooks/useAuth';

const ProfileScreen = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { logout } = useAuth();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>👤 Perfil</Text>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👤</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.planBadge}>
              <Text style={styles.planText}>💎 {user?.plan?.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>87%</Text>
            <Text style={styles.statName}>Completión</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statName}>Racha</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>$12.4K</Text>
            <Text style={styles.statName}>Portfolio</Text>
          </View>
        </View>

        {/* Settings Section */}
        <Text style={styles.sectionTitle}>Configuración</Text>

        <View style={styles.settingCard}>
          <View>
            <Text style={styles.settingName}>Notificaciones Push</Text>
            <Text style={styles.settingDesc}>Recibe alertas en tiempo real</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#334155', true: '#22c55e' }}
            thumbColor={notifications ? '#fbbf24' : '#64748b'}
          />
        </View>

        <View style={styles.settingCard}>
          <View>
            <Text style={styles.settingName}>Modo Oscuro</Text>
            <Text style={styles.settingDesc}>Tema oscuro de la app</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#334155', true: '#22c55e' }}
            thumbColor={darkMode ? '#fbbf24' : '#64748b'}
          />
        </View>

        {/* Menu Items */}
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔒</Text>
          <Text style={styles.menuText}>Cambiar Contraseña</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={styles.menuText}>Preferencias de Notificación</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📱</Text>
          <Text style={styles.menuText}>Dispositivos Conectados</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>Ayuda y Soporte</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>🚪 Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.version}>Versión 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fbbf24', marginBottom: 20 },
  userCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: { fontSize: 30 },
  userInfo: { flex: 1 },
  userName: { color: '#e2e8f0', fontWeight: 'bold', fontSize: 18, marginBottom: 4 },
  userEmail: { color: '#94a3b8', fontSize: 12, marginBottom: 8 },
  planBadge: { backgroundColor: 'rgba(251, 191, 36, 0.2)', borderRadius: 6, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4 },
  planText: { color: '#fbbf24', fontWeight: 'bold', fontSize: 11 },
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statNumber: { color: '#fbbf24', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  statName: { color: '#94a3b8', fontSize: 11 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#e2e8f0', marginBottom: 12 },
  settingCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  settingName: { color: '#e2e8f0', fontWeight: '600', marginBottom: 4 },
  settingDesc: { color: '#94a3b8', fontSize: 12 },
  menuItem: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  menuIcon: { fontSize: 18, marginRight: 12 },
  menuText: { flex: 1, color: '#e2e8f0', fontWeight: '500' },
  menuArrow: { color: '#94a3b8', fontSize: 18 },
  logoutBtn: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  version: { textAlign: 'center', color: '#64748b', fontSize: 12 },
});

export default ProfileScreen;
