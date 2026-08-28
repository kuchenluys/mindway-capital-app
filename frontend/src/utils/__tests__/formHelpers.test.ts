import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateCreditCard,
  formatCardNumber,
  formatExpiryDate,
  hasFormChanged,
  loadFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
} from '../formHelpers';

describe('Form Helpers', () => {
  describe('validateCreditCard', () => {
    it('validates correct credit card number (Luhn algorithm)', () => {
      expect(validateCreditCard('4532015112830366')).toBe(true);
    });

    it('rejects invalid credit card number', () => {
      expect(validateCreditCard('1234567890123456')).toBe(false);
    });

    it('rejects too short card number', () => {
      expect(validateCreditCard('123')).toBe(false);
    });

    it('rejects too long card number', () => {
      expect(validateCreditCard('12345678901234567890')).toBe(false);
    });

    it('ignores spaces in card number', () => {
      expect(validateCreditCard('4532 0151 1283 0366')).toBe(true);
    });
  });

  describe('formatCardNumber', () => {
    it('formats card number with spaces', () => {
      expect(formatCardNumber('4532015112830366')).toBe('4532 0151 1283 0366');
    });

    it('removes existing spaces before formatting', () => {
      expect(formatCardNumber('4532 0151 1283 0366')).toBe('4532 0151 1283 0366');
    });

    it('handles partial card numbers', () => {
      expect(formatCardNumber('453201')).toBe('4532 01');
    });
  });

  describe('formatExpiryDate', () => {
    it('formats expiry date MM/YY', () => {
      expect(formatExpiryDate('1225')).toBe('12/25');
    });

    it('handles partial entry', () => {
      expect(formatExpiryDate('12')).toBe('12');
    });

    it('stops after 4 digits', () => {
      expect(formatExpiryDate('12256789')).toBe('12/25');
    });

    it('removes non-numeric characters', () => {
      expect(formatExpiryDate('12/25')).toBe('12/25');
    });
  });

  describe('hasFormChanged', () => {
    it('detects when form has changed', () => {
      const initial = { name: 'John', email: 'john@example.com' };
      const current = { name: 'Jane', email: 'john@example.com' };
      expect(hasFormChanged(current, initial)).toBe(true);
    });

    it('returns false when form is unchanged', () => {
      const initial = { name: 'John', email: 'john@example.com' };
      const current = { name: 'John', email: 'john@example.com' };
      expect(hasFormChanged(current, initial)).toBe(false);
    });

    it('detects property addition', () => {
      const initial = { name: 'John' };
      const current = { name: 'John', email: 'john@example.com' };
      expect(hasFormChanged(current, initial)).toBe(true);
    });
  });

  describe('localStorage helpers', () => {
    beforeEach(() => {
      localStorage.clear();
      vi.clearAllMocks();
    });

    it('saves and loads from localStorage', () => {
      const data = { user: 'John', role: 'admin' };
      saveToLocalStorage('testKey', data);
      const loaded = loadFromLocalStorage('testKey');
      expect(loaded).toEqual(data);
    });

    it('returns default value when key not found', () => {
      const defaultValue = { user: null };
      const loaded = loadFromLocalStorage('nonexistent', defaultValue);
      expect(loaded).toEqual(defaultValue);
    });

    it('removes item from localStorage', () => {
      saveToLocalStorage('tempKey', { temp: true });
      removeFromLocalStorage('tempKey');
      const loaded = loadFromLocalStorage('tempKey', null);
      expect(loaded).toBe(null);
    });

    it('handles JSON serialization', () => {
      const complexData = {
        array: [1, 2, 3],
        nested: { deep: { value: true } },
        date: new Date().toISOString(),
      };
      saveToLocalStorage('complex', complexData);
      const loaded = loadFromLocalStorage('complex');
      expect(loaded).toEqual(complexData);
    });
  });
});
