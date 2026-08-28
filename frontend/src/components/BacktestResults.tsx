import React, { useEffect, useState } from 'react';
import mlService, { BacktestResult } from '@services/mlService';
import { ChartData } from '@services/tradingViewService';

interface BacktestResultsProps {
  data: ChartData[];
  symbol: string;
}

export const BacktestResults: React.FC<BacktestResultsProps> = ({ data, symbol }) => {
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runBacktest = async () => {
      try {
        const backtest = await mlService.backtest(symbol, data);
        setResult(backtest);
      } catch (error) {
        console.error('Error running backtest:', error);
      } finally {
        setLoading(false);
      }
    };

    if (data.length > 20) {
      runBacktest();
    }
  }, [data, symbol]);

  if (loading || !result) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <p className="text-slate-400">Ejecutando backtesting...</p>
      </div>
    );
  }

  const profitColor = result.totalProfit >= 0 ? 'text-green-400' : 'text-red-400';
  const drawdownColor = result.maxDrawdown > 20 ? 'text-red-400' : 'text-amber-400';

  const stats = [
    {
      label: 'Operaciones Totales',
      value: result.totalTrades,
      unit: '',
    },
    {
      label: 'Operaciones Ganadoras',
      value: result.winningTrades,
      unit: `(${result.winRate.toFixed(1)}%)`,
    },
    {
      label: 'Ganancia Total',
      value: `$${result.totalProfit.toFixed(2)}`,
      color: profitColor,
    },
    {
      label: 'Máximo Drawdown',
      value: `${result.maxDrawdown.toFixed(2)}%`,
      color: drawdownColor,
    },
    {
      label: 'Factor de Ganancia',
      value: result.profitFactor.toFixed(2),
      unit: 'x',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-4">📊 Resultados de Backtesting</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
            <p className={`text-lg font-bold ${stat.color || 'text-amber-400'}`}>
              {stat.value} <span className="text-sm text-slate-400">{stat.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Performance Gauge */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-300">Rendimiento General</span>
          <span className="text-xs text-slate-400">
            {result.profitFactor > 1.5 ? '🟢 Excelente' : result.profitFactor > 1 ? '🟡 Bueno' : '🔴 Bajo'}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              result.profitFactor > 1.5 ? 'bg-green-500' : result.profitFactor > 1 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min((result.profitFactor / 3) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Analysis */}
      <div className="space-y-3 text-sm">
        <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-slate-300 mb-1">
            <span className="font-semibold text-white">Tasa de Ganancia:</span> {result.winRate.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-400">
            {result.winRate > 50 ? '✓ Por encima del 50%' : '⚠ Bajo 50%, requiere análisis'}
          </p>
        </div>

        <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-slate-300 mb-1">
            <span className="font-semibold text-white">Factor de Ganancia:</span> {result.profitFactor.toFixed(2)}x
          </p>
          <p className="text-xs text-slate-400">
            {result.profitFactor > 1.5 ? '✓ Excelente relación' : '⚠ Revisión recomendada'}
          </p>
        </div>

        <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-slate-300 mb-1">
            <span className="font-semibold text-white">Máximo Drawdown:</span> {result.maxDrawdown.toFixed(2)}%
          </p>
          <p className="text-xs text-slate-400">
            {result.maxDrawdown < 10 ? '✓ Muy controlado' : '⚠ Considerar stop-loss más agresivo'}
          </p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-900/30 border border-purple-700/50 rounded-lg">
        <p className="text-xs text-purple-300">
          📌 Los resultados de backtesting son históricos. El rendimiento pasado no garantiza resultados futuros.
        </p>
      </div>
    </div>
  );
};

export default BacktestResults;
