import React, { useState } from 'react';
import Card, { CardHeader, CardBody } from '@components/Card';
import Button from '@components/Button';

interface MetricLog {
  date: string;
  weight: number;
  sleep: number;
  energy: number;
  mood: number;
}

const Biohacking: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricLog[]>([
    { date: '2026-08-24', weight: 82, sleep: 7.5, energy: 8, mood: 9 },
    { date: '2026-08-23', weight: 82.3, sleep: 7, energy: 7, mood: 8 },
    { date: '2026-08-22', weight: 82.5, sleep: 8, energy: 8, mood: 8 },
  ]);

  const [newMetric, setNewMetric] = useState({
    weight: '',
    sleep: '',
    energy: '5',
    mood: '5',
  });

  const handleAddMetric = () => {
    if (newMetric.weight && newMetric.sleep) {
      setMetrics([
        {
          date: new Date().toISOString().split('T')[0],
          weight: parseFloat(newMetric.weight),
          sleep: parseFloat(newMetric.sleep),
          energy: parseInt(newMetric.energy),
          mood: parseInt(newMetric.mood),
        },
        ...metrics,
      ]);
      setNewMetric({ weight: '', sleep: '', energy: '5', mood: '5' });
    }
  };

  const currentMetric = metrics[0];
  const stats = {
    avgWeight: (metrics.reduce((sum, m) => sum + m.weight, 0) / metrics.length).toFixed(1),
    avgSleep: (metrics.reduce((sum, m) => sum + m.sleep, 0) / metrics.length).toFixed(1),
    avgEnergy: Math.round(metrics.reduce((sum, m) => sum + m.energy, 0) / metrics.length),
    avgMood: Math.round(metrics.reduce((sum, m) => sum + m.mood, 0) / metrics.length),
  };

  const protocols = [
    { name: 'Ayuno Intermitente', icon: '⏰', status: 'active' },
    { name: 'Cold Exposure', icon: '❄️', status: 'active' },
    { name: 'Sauna', icon: '🌡️', status: 'scheduled' },
    { name: 'Meditación Profunda', icon: '🧠', status: 'active' },
    { name: 'Suplementación', icon: '💊', status: 'active' },
    { name: 'Optimización del Sueño', icon: '🌙', status: 'active' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-100 mb-2">💪 Biohacking</h1>
        <p className="text-dark-400">
          Optimiza tu cuerpo y mente para sostener la vida que estás construyendo
        </p>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Peso', value: `${currentMetric?.weight} kg`, icon: '⚖️' },
          { label: 'Sueño', value: `${currentMetric?.sleep} h`, icon: '😴' },
          { label: 'Energía', value: `${currentMetric?.energy}/10`, icon: '⚡' },
          { label: 'Ánimo', value: `${currentMetric?.mood}/10`, icon: '😊' },
        ].map((stat, i) => (
          <Card key={i} hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-dark-100 mt-1">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Metric */}
      <Card>
        <CardHeader title="Registrar Métricas de Hoy" icon="📊" />
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm text-dark-300 mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                value={newMetric.weight}
                onChange={(e) => setNewMetric({ ...newMetric, weight: e.target.value })}
                placeholder="82"
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-dark-100"
              />
            </div>
            <div>
              <label className="block text-sm text-dark-300 mb-1">Sueño (h)</label>
              <input
                type="number"
                step="0.5"
                value={newMetric.sleep}
                onChange={(e) => setNewMetric({ ...newMetric, sleep: e.target.value })}
                placeholder="8"
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-dark-100"
              />
            </div>
            <div>
              <label className="block text-sm text-dark-300 mb-1">Energía ({newMetric.energy}/10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={newMetric.energy}
                onChange={(e) => setNewMetric({ ...newMetric, energy: e.target.value })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-dark-300 mb-1">Ánimo ({newMetric.mood}/10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={newMetric.mood}
                onChange={(e) => setNewMetric({ ...newMetric, mood: e.target.value })}
                className="w-full"
              />
            </div>
          </div>
          <Button onClick={handleAddMetric} fullWidth>
            Guardar Métricas
          </Button>
        </CardBody>
      </Card>

      {/* Protocols */}
      <div>
        <h2 className="text-2xl font-bold text-dark-100 mb-4">🔬 Protocolos Activos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {protocols.map((protocol, i) => (
            <Card key={i} hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{protocol.icon}</span>
                  <div>
                    <p className="font-bold text-dark-100">{protocol.name}</p>
                    <p className={`text-xs ${protocol.status === 'active' ? 'text-accent-400' : 'text-dark-400'}`}>
                      {protocol.status === 'active' ? '🟢 Activo' : '🟡 Programado'}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Metrics History */}
      <Card>
        <CardHeader title="Historial de Métricas" icon="📈" />
        <CardBody>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {metrics.map((metric, i) => (
              <div key={i} className="flex items-center justify-between p-2 hover:bg-dark-700 rounded transition">
                <div className="text-sm">
                  <p className="font-medium text-dark-100">{metric.date}</p>
                </div>
                <div className="flex gap-4 text-sm text-dark-400">
                  <span>⚖️ {metric.weight}kg</span>
                  <span>😴 {metric.sleep}h</span>
                  <span>⚡ {metric.energy}</span>
                  <span>😊 {metric.mood}</span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Average Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Peso Promedio', value: `${stats.avgWeight} kg`, icon: '⚖️' },
          { label: 'Sueño Promedio', value: `${stats.avgSleep} h`, icon: '😴' },
          { label: 'Energía Promedio', value: `${stats.avgEnergy}/10`, icon: '⚡' },
          { label: 'Ánimo Promedio', value: `${stats.avgMood}/10`, icon: '😊' },
        ].map((stat, i) => (
          <Card key={i}>
            <div className="text-center">
              <span className="text-3xl block mb-2">{stat.icon}</span>
              <p className="text-xs text-dark-400 mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-dark-100">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Biohacking;
