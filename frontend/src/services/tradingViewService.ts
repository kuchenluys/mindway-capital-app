// TradingView Integration Service
// Maneja la integración con TradingView charts y datos de mercado

export interface TradingViewConfig {
  apiKey?: string;
  baseUrl?: string;
  symbols: string[];
}

export interface ChartData {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
}

export interface RealTimeQuote {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  volume: number;
  timestamp: number;
}

class TradingViewService {
  private config: TradingViewConfig;
  private chartInstance: any = null;

  constructor(config: TradingViewConfig = { symbols: ['XAUUSD'] }) {
    this.config = config;
  }

  // Inicializar widget de TradingView
  initChart(containerId: string, symbol: string = 'XAUUSD', interval: string = '15') {
    const scriptId = 'tradingview-script';

    // Evitar duplicar scripts
    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      if (window.TradingView) {
        // @ts-ignore
        this.chartInstance = new window.TradingView.widget({
          autosize: false,
          width: '100%',
          height: 500,
          symbol: symbol,
          interval: interval,
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'es',
          toolbar_bg: '#0f172a',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerId,
          studies: [
            'Volume@tv-basicstudies',
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies'
          ]
        });
        console.log('✅ TradingView Chart inicializado:', symbol);
      }
    };

    document.body.appendChild(script);
  }

  // Obtener datos de mercado en tiempo real (mock)
  async getQuote(symbol: string): Promise<RealTimeQuote> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          symbol,
          price: 2045.37,
          bid: 2045.32,
          ask: 2045.42,
          volume: 12500,
          timestamp: Date.now()
        });
      }, 500);
    });
  }

  // Obtener datos OHLCV
  async getOHLCData(
    symbol: string,
    interval: string = '15'
  ): Promise<ChartData[]> {
    // Mock data - en producción sería desde API
    const mockData: ChartData[] = [];
    const basePrice = 2045;
    const now = Math.floor(Date.now() / 1000);

    for (let i = 20; i > 0; i--) {
      mockData.push({
        symbol,
        open: basePrice + Math.random() * 10 - 5,
        high: basePrice + Math.random() * 15,
        low: basePrice + Math.random() * 5 - 10,
        close: basePrice + Math.random() * 10 - 5,
        volume: Math.floor(Math.random() * 50000),
        timestamp: now - (i * 60 * parseInt(interval))
      });
    }

    return mockData;
  }

  // Stream de datos en tiempo real
  subscribeToQuotes(
    symbol: string,
    callback: (quote: RealTimeQuote) => void,
    interval: number = 1000
  ) {
    const intervalId = setInterval(async () => {
      const quote = await this.getQuote(symbol);
      callback(quote);
    }, interval);

    // Retornar función para desuscribirse
    return () => clearInterval(intervalId);
  }

  // Calcular técnicos
  calculateTechnicals(data: ChartData[]) {
    return {
      sma20: this.calculateSMA(data, 20),
      sma50: this.calculateSMA(data, 50),
      rsi: this.calculateRSI(data, 14),
      macd: this.calculateMACD(data),
      bollingerBands: this.calculateBollingerBands(data, 20, 2)
    };
  }

  private calculateSMA(data: ChartData[], period: number): number {
    const closes = data.map(d => d.close);
    const sum = closes.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  private calculateRSI(data: ChartData[], period: number): number {
    const closes = data.map(d => d.close);
    let gains = 0, losses = 0;

    for (let i = 1; i < Math.min(period + 1, closes.length); i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff > 0) gains += diff;
      else losses -= diff;
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return Math.round(rsi * 100) / 100;
  }

  private calculateMACD(data: ChartData[]) {
    const ema12 = this.calculateEMA(data, 12);
    const ema26 = this.calculateEMA(data, 26);
    return {
      macd: ema12 - ema26,
      signal: (ema12 - ema26) * 0.9 // Simplified
    };
  }

  private calculateEMA(data: ChartData[], period: number): number {
    const closes = data.map(d => d.close);
    const multiplier = 2 / (period + 1);
    let ema = closes[0];

    for (let i = 1; i < closes.length; i++) {
      ema = closes[i] * multiplier + ema * (1 - multiplier);
    }

    return ema;
  }

  private calculateBollingerBands(data: ChartData[], period: number, stdDev: number) {
    const closes = data.map(d => d.close);
    const sma = this.calculateSMA(data, period);

    const variance = closes
      .slice(-period)
      .reduce((sum, close) => sum + Math.pow(close - sma, 2), 0) / period;

    const deviation = Math.sqrt(variance) * stdDev;

    return {
      upper: sma + deviation,
      middle: sma,
      lower: sma - deviation
    };
  }
}

export default new TradingViewService();
