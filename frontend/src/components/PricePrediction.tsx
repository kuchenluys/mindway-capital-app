import React, { useEffect, useState } from 'react';
import mlService, { PricePrediction } from '@services/mlService';
import { ChartData } from '@services/tradingViewService';

interface PricePredictionProps {
  data: ChartData[];
  symbol: string;
}

export const PricePrediction: React.FC<PricePredictionProps> = ({ data, symbol }) => {
  const [prediction, setPrediction] = useState<PricePrediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrediction = async () => {
      try {
        const pred = await mlService.predictPrice(symbol, data);
        setPrediction(pred);
      } catch (error) {
        console.error('Error predicting price:', error);
      } finally {
        setLoading(false);
      }
    };

    if (data.length > 0) {
      loadPrediction();
    }
  }, [data, symbol]);

  if (loading || !prediction) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <p className="text-slate-400">Analizando predicción...</p>
      </div>
    );
  }

  const priceDiff = prediction.predictedPrice - prediction.currentPrice;
  const priceDiffPercent = (priceDiff / prediction.currentPrice) * 100;
  const directionColor = {
    UP: 'text-green-400 bg-green-500/10',
    DOWN: 'text-red-400 bg-red-500/10',
    NEUTRAL: 'text-slate-400 bg-slate-500/10',
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-4">🔮 Predicción de Precio</h3>

      {/* Current Price */}
      <div className="mb-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
        <p className="text-xs text-slate-400 mb-1">Precio Actual</p>
        <p className="text-2xl font-bold text-amber-400">${prediction.currentPrice.toFixed(2)}</p>
      </div>

      {/* Predicted Price */}
      <div className="mb-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
        <p className="text-xs text-slate-400 mb-1">Precio Predicho (15min)</p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-blue-400">${prediction.predictedPrice.toFixed(2)}</p>
          <div className={`px-3 py-1 rounded-full font-semibold text-sm ${directionColor[prediction.direction]}`}>
            {prediction.direction === 'UP' && '📈 SUBE'}
            {prediction.direction === 'DOWN' && '📉 BAJA'}
            {prediction.direction === 'NEUTRAL' && '➡️ LATERAL'}
          </div>
        </div>
      </div>

      {/* Change */}
      <div className="mb-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
        <p className="text-xs text-slate-400 mb-2">Cambio Esperado</p>
        <div className="flex items-center gap-4">
          <div>
            <p className={`text-xl font-bold ${priceDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceDiff >= 0 ? '+' : ''}${priceDiff.toFixed(2)}
            </p>
            <p className={`text-sm font-semibold ${priceDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceDiff >= 0 ? '+' : ''}{priceDiffPercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Confidence */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-300">Confianza</span>
          <span className="text-sm font-bold text-amber-400">{prediction.confidence.toFixed(1)}%</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className={`h-full transition-all ${
              prediction.confidence > 75 ? 'bg-green-500' : prediction.confidence > 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${prediction.confidence}%` }}
          />
        </div>
      </div>

      {/* Interpretation */}
      <div className="space-y-2 text-sm">
        <p className="font-semibold text-slate-300 mb-2">Interpretación:</p>
        <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
          {prediction.confidence > 75 ? (
            <p className="text-green-300">
              ✓ <span className="font-semibold">Alta Confianza</span> - Múltiples indicadores alineados
            </p>
          ) : prediction.confidence > 50 ? (
            <p className="text-yellow-300">
              ⚠ <span className="font-semibold">Confianza Media</span> - Algunos indicadores conflictivos
            </p>
          ) : (
            <p className="text-red-300">
              ✗ <span className="font-semibold">Baja Confianza</span> - Indicadores contradictorios
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 p-3 bg-cyan-900/30 border border-cyan-700/50 rounded-lg">
        <p className="text-xs text-cyan-300">
          💡 Las predicciones se basan en análisis técnico. Siempre usa stop-loss en tus operaciones.
        </p>
      </div>
    </div>
  );
};

export default PricePrediction;
