import React, { useState, useEffect } from 'react';
import { Card } from '@components/Card';
import tradingViewService, { ChartData } from '@services/tradingViewService';

interface TechnicalIndicators {
  sma20: number;
  sma50: number;
  rsi: number;
  macd: {
    macd: number;
    signal: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
}

export const TechnicalAnalysis: React.FC<{ symbol?: string }> = ({ symbol = 'XAUUSD' }) => {
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        const data = await tradingViewService.getOHLCData(symbol);
        const technicals = tradingViewService.calculateTechnicals(data);
        setIndicators(technicals);
        setLoading(false);
      } catch (error) {
        console.error('Error calculating technical analysis:', error);
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [symbol]);

  if (loading) {
    return <div className="text-gray-400">Calculando indicadores técnicos...</div>;
  }

  if (!indicators) {
    return <div className="text-red-400">Error al cargar análisis</div>;
  }

  const getRSIColor = (rsi: number) => {
    if (rsi > 70) return 'text-red-400';
    if (rsi < 30) return 'text-green-400';
    return 'text-yellow-400';
  };

  const getRSILabel = (rsi: number) => {
    if (rsi > 70) return 'Sobrecomprado';
    if (rsi < 30) return 'Sobrevendido';
    return 'Neutro';
  };

  return (
    <Card className="border-blue-600/30 bg-gradient-to-br from-blue-900/10 to-indigo-900/10">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-blue-400">📊 Análisis Técnico</h3>

        {/* Medias Móviles */}
        <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
          <p className="text-sm font-semibold text-gray-300">Medias Móviles</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-400">SMA 20:</span>
              <p className="text-cyan-400 font-semibold">${indicators.sma20.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-gray-400">SMA 50:</span>
              <p className="text-purple-400 font-semibold">${indicators.sma50.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* RSI */}
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-sm font-semibold text-gray-300 mb-2">Índice de Fuerza Relativa (RSI)</p>
          <div className="flex items-end justify-between">
            <div>
              <p className={`text-2xl font-bold ${getRSIColor(indicators.rsi)}`}>
                {indicators.rsi.toFixed(2)}
              </p>
              <p className={`text-xs ${getRSIColor(indicators.rsi)}`}>
                {getRSILabel(indicators.rsi)}
              </p>
            </div>
            <div className="w-full max-w-xs h-2 bg-gray-700 rounded-full ml-4">
              <div
                className={`h-full rounded-full ${
                  indicators.rsi > 70
                    ? 'bg-red-500'
                    : indicators.rsi < 30
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
                }`}
                style={{ width: `${indicators.rsi}%` }}
              />
            </div>
          </div>
        </div>

        {/* MACD */}
        <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
          <p className="text-sm font-semibold text-gray-300">MACD</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-400">MACD:</span>
              <p className={`font-semibold ${indicators.macd.macd > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {indicators.macd.macd.toFixed(4)}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Signal:</span>
              <p className="text-orange-400 font-semibold">{indicators.macd.signal.toFixed(4)}</p>
            </div>
          </div>
        </div>

        {/* Bandas de Bollinger */}
        <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
          <p className="text-sm font-semibold text-gray-300">Bandas de Bollinger</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Superior:</span>
              <span className="text-red-400 font-semibold">${indicators.bollingerBands.upper.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Media:</span>
              <span className="text-blue-400 font-semibold">${indicators.bollingerBands.middle.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Inferior:</span>
              <span className="text-green-400 font-semibold">${indicators.bollingerBands.lower.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TechnicalAnalysis;
