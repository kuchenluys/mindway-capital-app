import { useTranslation } from 'react-i18next';

export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const currencies: Record<string, { code: string; symbol: string; rate: number }> = {
    USD: { code: 'USD', symbol: '$', rate: 1.0 },
    EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
    GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
    JPY: { code: 'JPY', symbol: '¥', rate: 149.5 },
    AUD: { code: 'AUD', symbol: 'A$', rate: 1.52 },
    MXN: { code: 'MXN', symbol: '$', rate: 17.2 },
    ARS: { code: 'ARS', symbol: '$', rate: 835.0 },
    BRL: { code: 'BRL', symbol: 'R$', rate: 4.97 },
  };

  const formatCurrency = (
    value: number,
    currency: string = 'USD',
    locale?: string
  ): string => {
    const currentLocale = locale || i18n.language;
    const currencyData = currencies[currency];

    if (!currencyData) {
      return `${value.toFixed(2)} ${currency}`;
    }

    return new Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const formatDate = (date: Date, locale?: string): string => {
    const currentLocale = locale || i18n.language;
    return new Intl.DateTimeFormat(currentLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatNumber = (value: number, decimals: number = 2, locale?: string): string => {
    const currentLocale = locale || i18n.language;
    return new Intl.NumberFormat(currentLocale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const convertCurrency = (value: number, from: string, to: string): number => {
    const fromRate = currencies[from]?.rate || 1;
    const toRate = currencies[to]?.rate || 1;
    return (value / fromRate) * toRate;
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  const getCurrentLanguage = () => i18n.language;

  const getSupportedLanguages = () => [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const getSupportedCurrencies = () => Object.keys(currencies).map((code) => ({
    code,
    name: t(`currencies.${code.toLowerCase()}`),
    symbol: currencies[code].symbol,
  }));

  return {
    t,
    i18n,
    formatCurrency,
    formatDate,
    formatNumber,
    convertCurrency,
    changeLanguage,
    getCurrentLanguage,
    getSupportedLanguages,
    getSupportedCurrencies,
    currencies,
  };
};

export default useI18n;
