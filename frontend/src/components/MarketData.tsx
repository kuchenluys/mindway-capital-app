import React, { useState, useEffect } from 'react';
import { Card } from '@components/Card';

interface MarketPrice {
  symbol: string;
  bid: number;
  ask: number;
  last: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export const MarketData: React.FC<{ symbol?: string }> = ({ symbol = 'XAUUSD' }) => {
  const [marketData, setMarketData] = useState<MarketPrice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Mock data - en producción usaría WebSocket de TradingView o API
        const mockData: MarketPrice = {
          symbol: symbol,
          bid: 2045.32,
          ask: 2045.42,
          last: 2045.37,
          change: 12.45,
          changePercent: 0.61,
          timestamp: new Date().toLocaleTimeString()
        };
        setMarketData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching market data:', error);
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5000);

    return () => clearInterval(interval);
  }, [symbol]);

  if (loading) {
    return <div className="text-gray-400">Cargando datos de mercado...</div>;
  }

  if (!marketData) {
    return <div className="text-red-400">Error al cargar datos</div>;
  }

  const isPositive = marketData.change >= 0;

  return (
    <Card className="border-green-600/30 bg-gradient-to-br from-green-900/10 to-emerald-900/10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{marketData.symbol}</h3>
          <span className="text-xs bg-green-900/50 px-2 py-1 rounded-full text-green-300">
            VIVO
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Último</p>
            <p className="text-2xl font-bold text-white">${marketData.last.toFixed(2)}</p>
          </div>

          <div className={`rounded-lg p-3 ${isPositive ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
            <p className="text-xs text-gray-400 mb-1">Cambio</p>
            <p className={`text-2xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(2)}%)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-800/30 rounded p-2">
            <p className="text-gray-400">Oferta (Bid)</p>
            <p className="text-cyan-400 font-semibold">${marketData.bid.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800/30 rounded p-2">
            <p className="text-gray-400">Demanda (Ask)</p>
            <p className="text-yellow-400 font-semibold">${marketData.ask.toFixed(2)}</p>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-700/30">
          Actualizado: {marketData.timestamp}
        </div>
      </div>
    </Card>
  );
};

export default MarketData;
