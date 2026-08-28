import { AxiosError } from 'axios';
import { showToast } from '@components/Toast';

/**
 * Maneja errores de API y muestra toast notifications
 */
export const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || 'Error en la solicitud';
    const description = error.response?.data?.error;

    showToast.error(message, description);

    return {
      message,
      status: error.response?.status,
      data: error.response?.data,
    };
  }

  if (error instanceof Error) {
    showToast.error('Error inesperado', error.message);
    return { message: error.message };
  }

  showToast.error('Error desconocido', 'Intenta de nuevo más tarde');
  return { message: 'Error desconocido' };
};

/**
 * Maneja respuestas exitosas de API
 */
export const handleApiSuccess = (message: string, description?: string) => {
  showToast.success(message, description);
};

/**
 * Valida que un formulario tenga cambios antes de enviar
 */
export const hasFormChanged = (data: any, initialData: any) => {
  return JSON.stringify(data) !== JSON.stringify(initialData);
};

/**
 * Formatea errores de Zod para mostrar en toast
 */
export const formatZodError = (error: any) => {
  const issues = error.issues || [];
  if (issues.length > 0) {
    const firstIssue = issues[0];
    return {
      field: firstIssue.path[0],
      message: firstIssue.message,
    };
  }
  return { field: 'general', message: 'Validación fallida' };
};

/**
 * Guarda datos en localStorage de forma segura
 */
export const saveToLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Carga datos desde localStorage de forma segura
 */
export const loadFromLocalStorage = (key: string, defaultValue?: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Limpia localStorage
 */
export const removeFromLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Validación personalizada para tarjetas de crédito (Luhn algorithm)
 */
export const validateCreditCard = (cardNumber: string) => {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Formatea número de tarjeta (XXXX XXXX XXXX 1234)
 */
export const formatCardNumber = (value: string) => {
  return value
    .replace(/\s/g, '')
    .replace(/(\d{4})/g, '$1 ')
    .trim();
};

/**
 * Formatea fecha de expiración (MM/YY)
 */
export const formatExpiryDate = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};

/**
 * Retry con exponential backoff
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = delayMs * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}
