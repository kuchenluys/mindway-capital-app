import { describe, it, expect } from 'vitest';
import {
  LoginSchema,
  RegisterSchema,
  PositionSchema,
  CardSchema,
  BiohackingMetricsSchema,
} from '../validation';

describe('Validation Schemas', () => {
  describe('LoginSchema', () => {
    it('validates correct login', () => {
      const data = { email: 'test@example.com', password: 'password123' };
      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const data = { email: 'invalid', password: 'password123' };
      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('rejects short password', () => {
      const data = { email: 'test@example.com', password: '123' };
      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('requires email', () => {
      const data = { email: '', password: 'password123' };
      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('RegisterSchema', () => {
    it('validates correct registration', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects mismatched passwords', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'different',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('rejects short name', () => {
      const data = {
        name: 'J',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('PositionSchema', () => {
    it('validates correct position', () => {
      const data = {
        symbol: 'xauusd',
        type: 'short',
        entry: 2450,
        stop: 2470,
        tp: 2420,
      };
      const result = PositionSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('converts symbol to uppercase', () => {
      const data = {
        symbol: 'xauusd',
        type: 'long',
        entry: 100,
        stop: 90,
        tp: 110,
      };
      const result = PositionSchema.safeParse(data);
      if (result.success) {
        expect(result.data.symbol).toBe('XAUUSD');
      }
    });

    it('rejects invalid type', () => {
      const data = {
        symbol: 'XAUUSD',
        type: 'invalid',
        entry: 2450,
        stop: 2470,
        tp: 2420,
      };
      const result = PositionSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('rejects negative prices', () => {
      const data = {
        symbol: 'XAUUSD',
        type: 'long',
        entry: -100,
        stop: 90,
        tp: 110,
      };
      const result = PositionSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('CardSchema', () => {
    it('validates correct card', () => {
      const data = {
        cardNumber: '4532015112830366',
        expiryDate: '12/25',
        cvc: '123',
        cardholderName: 'John Doe',
      };
      const result = CardSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects invalid card number', () => {
      const data = {
        cardNumber: '1234',
        expiryDate: '12/25',
        cvc: '123',
        cardholderName: 'John Doe',
      };
      const result = CardSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('rejects invalid expiry date', () => {
      const data = {
        cardNumber: '4532015112830366',
        expiryDate: '13/25',
        cvc: '123',
        cardholderName: 'John Doe',
      };
      const result = CardSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('rejects invalid CVC', () => {
      const data = {
        cardNumber: '4532015112830366',
        expiryDate: '12/25',
        cvc: '12',
        cardholderName: 'John Doe',
      };
      const result = CardSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('BiohackingMetricsSchema', () => {
    it('validates correct metrics', () => {
      const data = {
        weight: 82,
        sleep: 7.5,
        energy: 8,
        mood: 9,
      };
      const result = BiohackingMetricsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects energy out of range', () => {
      const data = {
        weight: 82,
        sleep: 7.5,
        energy: 15,
        mood: 9,
      };
      const result = BiohackingMetricsSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('rejects negative weight', () => {
      const data = {
        weight: -82,
        sleep: 7.5,
        energy: 8,
        mood: 9,
      };
      const result = BiohackingMetricsSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('rejects sleep over 24 hours', () => {
      const data = {
        weight: 82,
        sleep: 25,
        energy: 8,
        mood: 9,
      };
      const result = BiohackingMetricsSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
