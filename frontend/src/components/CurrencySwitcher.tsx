import React, { useState } from 'react';
import useI18n from '@hooks/useI18n';

const CurrencySwitcher: React.FC = () => {
  const { getSupportedCurrencies } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(() => {
    return localStorage.getItem('currency') || 'USD';
  });

  const currencies = getSupportedCurrencies();
  const current = currencies.find((c) => c.code === selectedCurrency);

  const handleCurrencyChange = (code: string) => {
    setSelectedCurrency(code);
    localStorage.setItem('currency', code);
    setIsOpen(false);

    // Emit event para que otros componentes se actualicen
    window.dispatchEvent(
      new CustomEvent('currencyChanged', { detail: { currency: code } })
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
      >
        <span className="text-sm">{current?.symbol}</span>
        <span className="hidden sm:inline text-sm">{current?.code}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-50 min-w-max max-h-96 overflow-y-auto">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              className={`w-full text-left px-4 py-2 flex items-center gap-2 transition-colors ${
                currency.code === selectedCurrency
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="font-bold">{currency.symbol}</span>
              <span className="flex-1">{currency.code}</span>
              <span className="text-xs text-slate-400">{currency.name}</span>
              {currency.code === selectedCurrency && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySwitcher;
