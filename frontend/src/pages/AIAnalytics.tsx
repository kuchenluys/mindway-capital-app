import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AIRecommendations from '@components/AIRecommendations';
import BacktestResults from '@components/BacktestResults';
import PricePrediction from '@components/PricePrediction';
import TradingViewChart from '@components/TradingViewChart';
import tradingViewService, { ChartData } from '@services/tradingViewService';
import mlService from '@services/mlService';

const AIAnalytics = () => {
  const [symbol, setSymbol] = useState('XAUUSD');
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [positionSize, setPositionSize] = useState(0);

  // Cargar datos cuando cambia el símbolo
  useEffect(() => {
    loadData();
  }, [symbol]);

  const loadData = async () => {
    setLoading(true);
    try {
      const ohlcData = await tradingViewService.getOHLCData(symbol, '15');
      setData(ohlcData);

      // Calcular tamaño de posición recomendado
      const account = 10000; // Balance de cuenta
      const riskPercent = 2; // 2% de riesgo por operación
      const stopLoss = 50; // 50 pips de stop loss
      const size = mlService.calculatePositionSize(account, riskPercent, stopLoss);
      setPositionSize(size);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const symbols = ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD'];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="text-amber-400 hover:text-amber-300 text-sm mb-4 inline-block">
            ← Volver al Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">🤖 Análisis Inteligente</h1>
          <p className="text-slate-400">Predicciones de IA, recomendaciones automáticas y backtesting</p>
        </div>

        {/* Symbol Selector */}
        <div className="mb-8 flex flex-wrap gap-2">
          {symbols.map((sym) => (
            <button
              key={sym}
              onClick={() => setSymbol(sym)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                symbol === sym
                  ? 'bg-amber-500 text-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-700 rounded-lg p-6 h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Chart */}
            <div className="mb-8 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-lg font-bold">📊 Gráfico en Tiempo Real</h2>
              </div>
              <div style={{ height: '500px' }}>
                <TradingViewChart symbol={symbol} interval="15" height={500} />
              </div>
            </div>

            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Predictions */}
              <div>
                <PricePrediction data={data} symbol={symbol} />
              </div>

              {/* Recommendations */}
              <div>
                <AIRecommendations data={data} symbol={symbol} />
              </div>

              {/* Backtest Results */}
              <div className="lg:col-span-2">
                <BacktestResults data={data} symbol={symbol} />
              </div>
            </div>

            {/* Position Sizing & Money Management */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-white mb-4">💰 Gestión de Riesgo</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm text-slate-400 mb-1">Capital de Cuenta</p>
                  <p className="text-2xl font-bold text-green-400">$10,000</p>
                </div>

                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm text-slate-400 mb-1">Riesgo Recomendado</p>
                  <p className="text-2xl font-bold text-amber-400">2%</p>
                  <p className="text-xs text-slate-500 mt-1">= $200 máximo por operación</p>
                </div>

                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <p className="text-sm text-slate-400 mb-1">Tamaño de Posición</p>
                  <p className="text-2xl font-bold text-blue-400">{positionSize.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-1">unidades (SL: 50 pips)</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <p className="font-semibold text-white mb-1">Regla 1% del Capital</p>
                  <p className="text-slate-400">
                    Nunca arriesgues más del 1-2% de tu capital en una sola operación.
                  </p>
                </div>

                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <p className="font-semibold text-white mb-1">Stop Loss Obligatorio</p>
                  <p className="text-slate-400">
                    Usa stop loss automático en todas las operaciones. Utiliza los niveles calculados por IA.
                  </p>
                </div>

                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <p className="font-semibold text-white mb-1">Toma de Ganancias</p>
                  <p className="text-slate-400">
                    Define niveles de profit en 1:2 o 1:3 ratio (riesgo:ganancia).
                  </p>
                </div>
              </div>
            </div>

            {/* Model Information */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">ℹ️ Información del Modelo</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-sm">
                  <p className="text-slate-400">
                    <span className="font-semibold text-white">Tipo de Modelo:</span> Machine Learning + Análisis Técnico
                  </p>
                  <p className="text-slate-400">
                    <span className="font-semibold text-white">Indicadores Utilizados:</span> RSI, MACD, SMA20/50, Bandas Bollinger
                  </p>
                  <p className="text-slate-400">
                    <span className="font-semibold text-white">Período de Análisis:</span> Últimas 100 velas
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-slate-400">
                    <span className="font-semibold text-white">Timeframe Predicción:</span> 15 minutos
                  </p>
                  <p className="text-slate-400">
                    <span className="font-semibold text-white">Actualización:</span> En tiempo real
                  </p>
                  <p className="text-slate-400">
                    <span className="font-semibold text-white">Precisión Histórica:</span> Backtesting disponible
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
                <p className="text-xs text-red-300 font-semibold">
                  ⚠️ DESCARGO DE RESPONSABILIDAD: Estos análisis son solo informativos. No constituyen
                  asesoramiento financiero. Siempre haz tu propia investigación y consulta a un asesor
                  financiero certificado antes de operar.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIAnalytics;
