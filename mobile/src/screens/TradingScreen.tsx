import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import useWebSocket from '@hooks/useWebSocket';

interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  entry: number;
  pips: number;
  status: 'open' | 'closed';
}

const TradingScreen = () => {
  const { emit } = useWebSocket(process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:5000');
  const [positions, setPositions] = useState<Position[]>([
    {
      id: '1',
      symbol: 'XAUUSD',
      type: 'short',
      entry: 2450,
      pips: 180,
      status: 'open',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: 'XAUUSD',
    type: 'long' as 'long' | 'short',
    entry: '',
  });

  const handleAddPosition = () => {
    if (!formData.symbol || !formData.entry) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    const newPosition: Position = {
      id: String(positions.length + 1),
      symbol: formData.symbol,
      type: formData.type,
      entry: parseFloat(formData.entry),
      pips: 0,
      status: 'open',
    };

    setPositions([...positions, newPosition]);

    // Emit WebSocket event
    emit('position:update', {
      symbol: formData.symbol,
      type: formData.type,
      entry: parseFloat(formData.entry),
      pips: 0,
    });

    setFormData({ symbol: 'XAUUSD', type: 'long', entry: '' });
    setShowForm(false);
    Alert.alert('Éxito', 'Posición creada correctamente');
  };

  const stats = {
    openPositions: positions.filter((p) => p.status === 'open').length,
    totalPips: positions.reduce((sum, p) => sum + p.pips, 0),
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>💹 Trading</Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Posiciones</Text>
            <Text style={styles.statValue}>{stats.openPositions}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Total Pips</Text>
            <Text style={[styles.statValue, { color: stats.totalPips >= 0 ? '#10b981' : '#ef4444' }]}>
              {stats.totalPips >= 0 ? '+' : ''}{stats.totalPips}
            </Text>
          </View>
        </View>

        {/* Add Position Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addButtonText}>
            {showForm ? '✕ Cancelar' : '+ Nueva Posición'}
          </Text>
        </TouchableOpacity>

        {/* Form */}
        {showForm && (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Símbolo (ej: XAUUSD)"
              placeholderTextColor="#94a3b8"
              value={formData.symbol}
              onChangeText={(text) => setFormData({ ...formData, symbol: text.toUpperCase() })}
            />

            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeButton, formData.type === 'long' && styles.typeButtonActive]}
                onPress={() => setFormData({ ...formData, type: 'long' })}
              >
                <Text style={styles.typeButtonText}>📈 LONG</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, formData.type === 'short' && styles.typeButtonActive]}
                onPress={() => setFormData({ ...formData, type: 'short' })}
              >
                <Text style={styles.typeButtonText}>📉 SHORT</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Entrada (ej: 2450)"
              placeholderTextColor="#94a3b8"
              value={formData.entry}
              onChangeText={(text) => setFormData({ ...formData, entry: text })}
              keyboardType="decimal-pad"
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleAddPosition}>
              <Text style={styles.submitButtonText}>Abrir Posición</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Positions List */}
        <Text style={styles.sectionTitle}>Posiciones Activas</Text>
        {positions.map((position) => (
          <View key={position.id} style={styles.positionCard}>
            <View style={styles.positionHeader}>
              <Text style={styles.positionSymbol}>{position.symbol}</Text>
              <Text style={[
                styles.positionType,
                { color: position.type === 'long' ? '#10b981' : '#ef4444' }
              ]}>
                {position.type.toUpperCase()}
              </Text>
            </View>
            <View style={styles.positionDetails}>
              <View>
                <Text style={styles.detailLabel}>Entrada</Text>
                <Text style={styles.detailValue}>${position.entry}</Text>
              </View>
              <View>
                <Text style={styles.detailLabel}>Pips</Text>
                <Text style={[
                  styles.detailValue,
                  { color: position.pips >= 0 ? '#10b981' : '#ef4444' }
                ]}>
                  {position.pips >= 0 ? '+' : ''}{position.pips}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  stat: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 8,
  },
  statValue: {
    color: '#e2e8f0',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  form: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  input: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 8,
    color: '#e2e8f0',
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#fbbf24',
    borderColor: '#fbbf24',
  },
  typeButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#0f172a',
  },
  submitButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  positionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  positionSymbol: {
    color: '#fbbf24',
    fontSize: 18,
    fontWeight: 'bold',
  },
  positionType: {
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#0f172a',
    borderRadius: 4,
  },
  positionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TradingScreen;
