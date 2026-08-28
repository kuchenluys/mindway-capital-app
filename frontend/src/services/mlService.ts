// Machine Learning Service para predicciones de trading
// Incluye: predicción de precios, recomendaciones, backtesting

import tradingViewService, { ChartData } from './tradingViewService';

export interface PricePrediction {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  direction: 'UP' | 'DOWN' | 'NEUTRAL';
  timeframe: string;
}

export interface TradingSignal {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  strength: number;
  reasons: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface BacktestResult {
  symbol: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfit: number;
  maxDrawdown: number;
  profitFactor: number;
}

class MLService {
  private modelCache: Map<string, any> = new Map();

  // Predicción de precio usando análisis técnico + ML simple
  async predictPrice(symbol: string, data: ChartData[]): Promise<PricePrediction> {
    if (data.length === 0) {
      throw new Error('No data available for prediction');
    }

    const technicals = tradingViewService.calculateTechnicals(data);
    const currentPrice = data[data.length - 1].close;

    // Algoritmo simple pero efectivo
    const rsi = technicals.rsi;
    const macdSignal = technicals.macd.macd > technicals.macd.signal;
    const smaSignal = technicals.sma20 > technicals.sma50;
    const bbSignal = currentPrice < technicals.bollingerBands.middle;

    // Score de predicción (0-100)
    let score = 0;
    let signals = 0;

    if (macdSignal) score += 25;
    if (smaSignal) score += 25;
    if (bbSignal) score += 25;
    if (rsi > 30 && rsi < 70) score += 25;

    signals = [macdSignal, smaSignal, bbSignal, rsi > 30 && rsi < 70].filter(Boolean).length;

    // Predicción de dirección
    const direction = score > 50 ? 'UP' : score < 30 ? 'DOWN' : 'NEUTRAL';
    const predictedPrice = currentPrice * (1 + (score - 50) / 1000);
    const confidence = (signals / 4) * 100;

    return {
      symbol,
      currentPrice,
      predictedPrice,
      confidence,
      direction,
      timeframe: '15min',
    };
  }

  // Generar señales de trading automáticas
  async generateSignal(symbol: string, data: ChartData[]): Promise<TradingSignal> {
    const technicals = tradingViewService.calculateTechnicals(data);
    const currentPrice = data[data.length - 1].close;

    const reasons: string[] = [];
    let signalStrength = 0;

    // Análisis RSI
    if (technicals.rsi < 30) {
      reasons.push('RSI sobrevendido (< 30)');
      signalStrength += 30;
    } else if (technicals.rsi > 70) {
      reasons.push('RSI sobrecomprado (> 70)');
      signalStrength -= 30;
    }

    // Análisis MACD
    if (technicals.macd.macd > technicals.macd.signal) {
      reasons.push('MACD bullish crossover');
      signalStrength += 25;
    } else if (technicals.macd.macd < technicals.macd.signal) {
      reasons.push('MACD bearish crossover');
      signalStrength -= 25;
    }

    // Análisis Medias Móviles
    if (technicals.sma20 > technicals.sma50) {
      reasons.push('SMA20 > SMA50 (tendencia alcista)');
      signalStrength += 20;
    } else if (technicals.sma20 < technicals.sma50) {
      reasons.push('SMA20 < SMA50 (tendencia bajista)');
      signalStrength -= 20;
    }

    // Análisis Bandas de Bollinger
    if (currentPrice < technicals.bollingerBands.lower) {
      reasons.push('Precio debajo de banda inferior');
      signalStrength += 15;
    } else if (currentPrice > technicals.bollingerBands.upper) {
      reasons.push('Precio encima de banda superior');
      signalStrength -= 15;
    }

    // Determinar acción
    let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    if (signalStrength > 40) {
      action = 'BUY';
    } else if (signalStrength < -40) {
      action = 'SELL';
    }

    // Nivel de riesgo basado en volatilidad
    const volatility = this.calculateVolatility(data);
    const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' =
      volatility > 0.03 ? 'HIGH' : volatility > 0.015 ? 'MEDIUM' : 'LOW';

    return {
      symbol,
      action,
      strength: Math.abs(signalStrength),
      reasons,
      riskLevel,
    };
  }

  // Backtesting de estrategia
  async backtest(symbol: string, data: ChartData[]): Promise<BacktestResult> {
    let position: 'LONG' | 'SHORT' | 'NONE' = 'NONE';
    let entryPrice = 0;
    let totalTrades = 0;
    let winningTrades = 0;
    let totalProfit = 0;
    const trades: number[] = [];
    const equity: number[] = [10000]; // Capital inicial

    for (let i = 20; i < data.length; i++) {
      const slicedData = data.slice(0, i + 1);
      const signal = await this.generateSignal(symbol, slicedData);

      const currentPrice = data[i].close;

      // Entry logic
      if (position === 'NONE' && signal.action === 'BUY') {
        position = 'LONG';
        entryPrice = currentPrice;
      } else if (position === 'NONE' && signal.action === 'SELL') {
        position = 'SHORT';
        entryPrice = currentPrice;
      }

      // Exit logic
      if (position === 'LONG' && signal.action === 'SELL') {
        const profit = currentPrice - entryPrice;
        trades.push(profit);
        totalTrades++;
        if (profit > 0) winningTrades++;
        totalProfit += profit;
        position = 'NONE';
        equity.push(equity[equity.length - 1] + profit);
      } else if (position === 'SHORT' && signal.action === 'BUY') {
        const profit = entryPrice - currentPrice;
        trades.push(profit);
        totalTrades++;
        if (profit > 0) winningTrades++;
        totalProfit += profit;
        position = 'NONE';
        equity.push(equity[equity.length - 1] + profit);
      }

      // Stop loss (5% loss)
      if (position === 'LONG' && currentPrice < entryPrice * 0.95) {
        trades.push(entryPrice * -0.05);
        totalTrades++;
        totalProfit -= entryPrice * 0.05;
        position = 'NONE';
      } else if (position === 'SHORT' && currentPrice > entryPrice * 1.05) {
        trades.push(entryPrice * -0.05);
        totalTrades++;
        totalProfit -= entryPrice * 0.05;
        position = 'NONE';
      }
    }

    const losingTrades = totalTrades - winningTrades;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const maxDrawdown = this.calculateMaxDrawdown(equity);
    const profitFactor = this.calculateProfitFactor(trades);

    return {
      symbol,
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      totalProfit,
      maxDrawdown,
      profitFactor,
    };
  }

  // Calcular volatilidad
  private calculateVolatility(data: ChartData[]): number {
    const closes = data.map((d) => d.close);
    const returns = closes.slice(1).map((c, i) => (c - closes[i]) / closes[i]);
    const variance = returns.reduce((sum, r) => sum + r * r, 0) / returns.length;
    return Math.sqrt(variance);
  }

  // Calcular máximo drawdown
  private calculateMaxDrawdown(equity: number[]): number {
    let maxDrawdown = 0;
    let peak = equity[0];

    for (const value of equity) {
      if (value > peak) peak = value;
      const drawdown = ((peak - value) / peak) * 100;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }

    return maxDrawdown;
  }

  // Calcular factor de ganancia
  private calculateProfitFactor(trades: number[]): number {
    const wins = trades.filter((t) => t > 0).reduce((sum, t) => sum + t, 0);
    const losses = Math.abs(trades.filter((t) => t < 0).reduce((sum, t) => sum + t, 0));
    return losses > 0 ? wins / losses : 0;
  }

  // Recomendación de tamaño de posición (Money Management)
  calculatePositionSize(account: number, riskPercent: number, stopLoss: number): number {
    const riskAmount = account * (riskPercent / 100);
    const positionSize = riskAmount / stopLoss;
    return Math.round(positionSize * 100) / 100;
  }

  // Clearance de caché
  clearCache(): void {
    this.modelCache.clear();
  }
}

export default new MLService();
