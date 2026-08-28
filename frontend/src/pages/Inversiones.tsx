import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardBody, CardFooter } from '@components/Card';
import Button from '@components/Button';
import Input from '@components/Input';
import TradingViewChart from '@components/TradingViewChart';
import MarketData from '@components/MarketData';
import TechnicalAnalysis from '@components/TechnicalAnalysis';
import useWebSocket from '@hooks/useWebSocket';
import tradingViewService from '@services/tradingViewService';

interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  entry: number;
  stop: number;
  tp: number;
  current?: number;
  pips?: number;
  status: 'open' | 'closed' | 'pending';
  createdAt: string;
}

const Inversiones: React.FC = () => {
  const { emit } = useWebSocket(process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:5000');

  const [positions, setPositions] = useState<Position[]>([
    {
      id: '1',
      symbol: 'XAUUSD',
      type: 'short',
      entry: 2450,
      stop: 2470,
      tp: 2420,
      current: 2440,
      pips: 100,
      status: 'open',
      createdAt: '2026-08-20',
    },
    {
      id: '2',
      symbol: 'EURUSD',
      type: 'long',
      entry: 1.0950,
      stop: 1.0920,
      tp: 1.1000,
      current: 1.0960,
      pips: 100,
      status: 'open',
      createdAt: '2026-08-22',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'long' as 'long' | 'short',
    entry: '',
    stop: '',
    tp: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add new position
    const newPosition: Position = {
      id: String(positions.length + 1),
      symbol: formData.symbol,
      type: formData.type,
      entry: parseFloat(formData.entry),
      stop: parseFloat(formData.stop),
      tp: parseFloat(formData.tp),
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPositions([...positions, newPosition]);

    // Emit WebSocket event
    emit('position:update', {
      symbol: formData.symbol,
      type: formData.type,
      entry: parseFloat(formData.entry),
      stop: parseFloat(formData.stop),
      tp: parseFloat(formData.tp),
      pips: 0
    });

    setFormData({ symbol: '', type: 'long', entry: '', stop: '', tp: '' });
    setShowForm(false);
  };

  const stats = {
    openPositions: positions.filter((p) => p.status === 'open').length,
    totalProfit: positions.reduce((sum, p) => sum + (p.pips || 0), 0),
    winRate: '68%',
    riskReward: '1:2.5',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-dark-100 mb-2">💰 Mis Inversiones</h1>
        <p className="text-dark-400">Gestiona tus posiciones de trading</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Posiciones Abiertas', value: stats.openPositions, icon: '📊' },
          { label: 'Ganancias Totales', value: `${stats.totalProfit} pips`, icon: '📈' },
          { label: 'Win Rate', value: stats.winRate, icon: '🎯' },
          { label: 'Risk/Reward', value: stats.riskReward, icon: '⚖️' },
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

      {/* TradingView Chart */}
      <div>
        <h2 className="text-2xl font-bold text-dark-100 mb-4">📊 Gráfico de XAUUSD</h2>
        <TradingViewChart symbol="XAUUSD" interval="15" height={500} />
      </div>

      {/* Market Data & Technical Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketData symbol="XAUUSD" />
        <TechnicalAnalysis symbol="XAUUSD" />
      </div>

      {/* Add Position Button */}
      <Button onClick={() => setShowForm(!showForm)} size="lg">
        ➕ Nueva Posición
      </Button>

      {/* New Position Form */}
      {showForm && (
        <Card>
          <CardHeader title="Abrir Nueva Posición" icon="🎯" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Símbolo"
                placeholder="XAUUSD"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                required
              />
              <div>
                <label className="block text-dark-300 text-sm font-medium mb-2">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'long' | 'short' })}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100"
                >
                  <option value="long">📈 Long</option>
                  <option value="short">📉 Short</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Entrada"
                type="number"
                step="0.0001"
                placeholder="2450"
                value={formData.entry}
                onChange={(e) => setFormData({ ...formData, entry: e.target.value })}
                required
              />
              <Input
                label="Stop Loss"
                type="number"
                step="0.0001"
                placeholder="2470"
                value={formData.stop}
                onChange={(e) => setFormData({ ...formData, stop: e.target.value })}
                required
              />
              <Input
                label="Take Profit"
                type="number"
                step="0.0001"
                placeholder="2420"
                value={formData.tp}
                onChange={(e) => setFormData({ ...formData, tp: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" size="lg">
                Abrir Posición
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Positions Table */}
      <div className="space-y-3">
        {positions.map((pos) => (
          <Card key={pos.id} hover>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-xl font-bold text-dark-100">{pos.symbol}</div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      pos.type === 'long'
                        ? 'bg-accent-500/20 text-accent-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {pos.type === 'long' ? '📈 LONG' : '📉 SHORT'}
                  </span>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      pos.status === 'open'
                        ? 'bg-accent-500/20 text-accent-400'
                        : 'bg-dark-700 text-dark-400'
                    }`}
                  >
                    {pos.status === 'open' ? '🟢 Abierta' : '⚪ Cerrada'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm text-dark-400">
                  <div>
                    Entrada: <span className="text-dark-100 font-medium">{pos.entry}</span>
                  </div>
                  <div>
                    Stop: <span className="text-dark-100 font-medium">{pos.stop}</span>
                  </div>
                  <div>
                    TP: <span className="text-dark-100 font-medium">{pos.tp}</span>
                  </div>
                  <div>
                    Actual: <span className="text-dark-100 font-medium">{pos.current}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-2xl font-bold ${
                    (pos.pips || 0) >= 0 ? 'text-accent-400' : 'text-red-400'
                  }`}
                >
                  {(pos.pips || 0) >= 0 ? '+' : ''}{pos.pips} pips
                </div>
                <p className="text-xs text-dark-400">{pos.createdAt}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Inversiones;
