import React, { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  height?: number;
  showToolbar?: boolean;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol = 'XAUUSD',
  interval = '15',
  height = 500,
  showToolbar = true
}) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      new window.TradingView.widget({
        autosize: false,
        width: '100%',
        height: height,
        symbol: symbol,
        interval: interval,
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'es',
        toolbar_bg: '#0f172a',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: 'tradingview-widget-container'
      });
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, interval, height]);

  return (
    <div
      className="w-full rounded-lg border border-gold-600/30 bg-gray-900/50 overflow-hidden"
      style={{ height: `${height}px` }}
    >
      <div
        id="tradingview-widget-container"
        ref={container}
        className="w-full h-full"
      />
    </div>
  );
};

export default TradingViewChart;
