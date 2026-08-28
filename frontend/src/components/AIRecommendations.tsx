import React, { useEffect, useState } from 'react';
import mlService, { TradingSignal } from '@services/mlService';
import { ChartData } from '@services/tradingViewService';

interface AIRecommendationsProps {
  data: ChartData[];
  symbol: string;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ data, symbol }) => {
  const [signal, setSignal] = useState<TradingSignal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSignal = async () => {
      try {
        const signal = await mlService.generateSignal(symbol, data);
        setSignal(signal);
      } catch (error) {
        console.error('Error generating signal:', error);
      } finally {
        setLoading(false);
      }
    };

    if (data.length > 0) {
      loadSignal();
    }
  }, [data, symbol]);

  if (loading || !signal) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <p className="text-slate-400">Cargando análisis...</p>
      </div>
    );
  }

  const actionColor = {
    BUY: 'bg-green-500/20 border-green-500 text-green-400',
    SELL: 'bg-red-500/20 border-red-500 text-red-400',
    HOLD: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
  };

  const riskColor = {
    LOW: 'text-green-400',
    MEDIUM: 'text-yellow-400',
    HIGH: 'text-red-400',
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-4">🤖 Recomendaciones IA</h3>

      <div className={`border rounded-lg p-4 mb-4 ${actionColor[signal.action]}`}>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg">{signal.action}</span>
          <span className="text-sm font-medium">Fortaleza: {signal.strength.toFixed(0)}/100</span>
        </div>
      </div>

      <div className="mb-4 p-3 bg-slate-800 rounded-lg">
        <p className="text-sm text-slate-300 mb-2">
          <span className="font-semibold">Nivel de Riesgo:</span>{' '}
          <span className={`font-bold ${riskColor[signal.riskLevel]}`}>{signal.riskLevel}</span>
        </p>
        <p className="text-xs text-slate-400">
          Basado en volatilidad actual del instrumento
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-300 mb-3">Razones del análisis:</p>
        {signal.reasons.map((reason, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
            <span className="text-amber-400 font-bold mt-0.5">✓</span>
            <span>{reason}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
        <p className="text-xs text-blue-300">
          💡 Tip: Combina esta recomendación con tu análisis manual y gestión de riesgo
        </p>
      </div>
    </div>
  );
};

export default AIRecommendations;
