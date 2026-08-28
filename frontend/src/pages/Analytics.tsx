import React, { useState } from 'react';
import Card, { CardHeader, CardBody } from '@components/Card';
import Tabs from '@components/Tabs';

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'revenue', label: 'Ingresos', icon: '💰' },
    { id: 'engagement', label: 'Engagement', icon: '📈' },
  ];

  const stats = [
    { label: 'Usuarios Totales', value: '1,248', change: '+12% este mes', icon: '👥' },
    { label: 'Ingresos MES', value: '$24,560', change: '+23% vs mes pasado', icon: '💰' },
    { label: 'Tasa Retención', value: '87%', change: '+5% este mes', icon: '📈' },
    { label: 'Posiciones Activas', value: '342', change: '+8 hoy', icon: '💹' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-100 mb-2">📊 Analytics</h1>
        <p className="text-dark-400">Dashboard de métricas y rendimiento</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-dark-100 mt-2">{stat.value}</p>
                <p className="text-xs text-accent-400 mt-1">{stat.change}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 bg-dark-700 rounded-lg">
                <h3 className="font-bold text-dark-100 mb-3">Usuarios Nuevos (últimos 7 días)</h3>
                <div className="space-y-2">
                  {[
                    { day: 'Lunes', count: 45, bar: 45 },
                    { day: 'Martes', count: 52, bar: 52 },
                    { day: 'Miércoles', count: 48, bar: 48 },
                    { day: 'Jueves', count: 61, bar: 61 },
                    { day: 'Viernes', count: 73, bar: 73 },
                    { day: 'Sábado', count: 89, bar: 89 },
                    { day: 'Domingo', count: 67, bar: 67 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-dark-300">{item.day}</span>
                        <span className="font-bold text-primary-400">{item.count}</span>
                      </div>
                      <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary"
                          style={{ width: `${item.bar}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-dark-700 rounded-lg">
                <h3 className="font-bold text-dark-100 mb-3">Suscripciones por Plan</h3>
                <div className="space-y-2">
                  {[
                    { plan: 'Free', count: 542, percent: 43 },
                    { plan: 'Premium', count: 512, percent: 41 },
                    { plan: 'Elite', count: 194, percent: 16 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-dark-300">{item.plan}</span>
                        <span className="font-bold text-dark-100">
                          {item.count} ({item.percent}%)
                        </span>
                      </div>
                      <div className="h-3 bg-dark-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-500"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="p-4 bg-dark-700 rounded-lg">
              <p className="text-dark-400">Tabla de usuarios detallada - Próxima página</p>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="p-4 bg-dark-700 rounded-lg">
              <p className="text-dark-400">Gráficos de ingresos y proyecciones - Próxima página</p>
            </div>
          )}

          {activeTab === 'engagement' && (
            <div className="p-4 bg-dark-700 rounded-lg">
              <p className="text-dark-400">Métricas de engagement y actividad - Próxima página</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader title="Actividad Reciente" icon="🕐" />
        <CardBody>
          <div className="space-y-3">
            {[
              { action: 'Nuevo usuario registrado', user: 'Carlos M.', time: 'Hace 5 min' },
              { action: 'Posición abierta', user: 'Juan G.', time: 'Hace 12 min' },
              { action: 'Curso completado', user: 'María L.', time: 'Hace 23 min' },
              { action: 'Plan actualizado a Premium', user: 'Pedro R.', time: 'Hace 1 hora' },
              { action: 'Pago procesado', user: 'Ana G.', time: 'Hace 2 horas' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-dark-700 rounded-lg">
                <div>
                  <p className="text-dark-100 text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-dark-400">{item.user}</p>
                </div>
                <span className="text-xs text-dark-500">{item.time}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Analytics;
