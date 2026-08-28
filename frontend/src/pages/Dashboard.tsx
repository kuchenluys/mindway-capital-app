import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { useApi } from '@hooks/useApi';
import TradingViewChart from '@components/TradingViewChart';
import MarketData from '@components/MarketData';
import TechnicalAnalysis from '@components/TechnicalAnalysis';
import RealtimeNotificationsPanel from '@components/RealtimeNotificationsPanel';
import useRealtimeNotifications from '@hooks/useRealtimeNotifications';

interface DashboardStats {
  portfolio: number;
  monthlyProgress: number;
  streak: number;
  community: number;
}

interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  entry: number;
  pips: number;
  status: 'open' | 'closed';
}

const Dashboard: React.FC = () => {
  useRealtimeNotifications();
  const user = useSelector((state: RootState) => state.auth.user);
  const [stats] = useState<DashboardStats>({
    portfolio: 12450,
    monthlyProgress: 87,
    streak: 15,
    community: 1248,
  });

  const [positions] = useState<Position[]>([
    {
      id: '1',
      symbol: 'XAUUSD',
      type: 'short',
      entry: 2450,
      pips: 180,
      status: 'open',
    },
  ]);

  const [tasks] = useState([
    { id: '1', title: 'Meditar 20 min', completed: true },
    { id: '2', title: 'Leer 30 min', completed: true },
    { id: '3', title: 'Hacer ejercicio', completed: false },
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-100 mb-2">
          ¡Bienvenido de vuelta, {user?.name}! 🎯
        </h1>
        <p className="text-dark-400">
          Aquí está tu resumen de hoy. Continúa tu progreso en los 4 pilares
        </p>
      </div>

      {/* Plan Banner */}
      <div className="bg-gradient-primary/10 border border-primary-500/20 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-primary-400 font-semibold uppercase mb-2">
              💎 Plan {user?.plan === 'elite' ? 'Elite' : user?.plan === 'premium' ? 'Premium' : 'Free'}
            </div>
            <h2 className="text-2xl font-bold text-dark-100">
              Acceso {user?.plan === 'elite' ? 'Total' : user?.plan === 'premium' ? 'Completo' : 'Limitado'}
            </h2>
            <p className="text-dark-400 text-sm mt-1">
              Próxima renovación: 15 de Septiembre 2026
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary-500">100%</div>
            <div className="text-sm text-dark-400">Progreso este mes</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Mi Portfolio', value: `$${stats.portfolio.toLocaleString()}`, icon: '💰' },
          { label: 'Progreso Mes', value: `${stats.monthlyProgress}%`, icon: '📈' },
          { label: 'Racha Actual', value: `${stats.streak} días`, icon: '🔥' },
          { label: 'Comunidad', value: `${stats.community.toLocaleString()}`, icon: '👥' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-dark-600 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-dark-400 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-dark-100">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Trading View Chart */}
      <div>
        <h2 className="text-2xl font-bold text-dark-100 mb-4">📊 Gráfico de Trading</h2>
        <TradingViewChart symbol="XAUUSD" interval="15" height={500} />
      </div>

      {/* Market Data & Technical Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketData symbol="XAUUSD" />
        <TechnicalAnalysis symbol="XAUUSD" />
      </div>

      {/* Notifications Panel */}
      <RealtimeNotificationsPanel />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Positions */}
        <div className="lg:col-span-1 bg-dark-800 border border-dark-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-dark-100 mb-4">📈 Mis Posiciones</h3>
          <div className="space-y-3">
            {positions.map((pos) => (
              <div
                key={pos.id}
                className="p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-dark-100">
                      {pos.symbol} - {pos.type.toUpperCase()}
                    </div>
                    <div className="text-xs text-dark-400">
                      Entrada: ${pos.entry}
                    </div>
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      pos.pips >= 0 ? 'text-accent-400' : 'text-red-400'
                    }`}
                  >
                    {pos.pips >= 0 ? '+' : ''}{pos.pips} pips
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs bg-accent-500/20 text-accent-400 px-2 py-1 rounded">
                    {pos.status === 'open' ? '🟢 Abierta' : '⚪ Cerrada'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="lg:col-span-1 bg-dark-800 border border-dark-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-dark-100 mb-4">🎯 Objetivos Hoy</h3>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${
                    task.completed
                      ? 'bg-accent-500 border-accent-500'
                      : 'border-dark-600'
                  }`}
                >
                  {task.completed && <span className="text-white text-sm">✓</span>}
                </div>
                <span
                  className={`text-sm ${
                    task.completed
                      ? 'text-dark-400 line-through'
                      : 'text-dark-100'
                  }`}
                >
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div className="lg:col-span-1 bg-dark-800 border border-dark-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-dark-100 mb-4">📚 En Progreso</h3>
          <div className="space-y-4">
            {[
              { title: 'Trading Avanzado', progress: 40 },
              { title: 'Mindfulness', progress: 37 },
            ].map((course, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-dark-300">{course.title}</span>
                  <span className="text-sm font-bold text-primary-400">
                    {course.progress}%
                  </span>
                </div>
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
