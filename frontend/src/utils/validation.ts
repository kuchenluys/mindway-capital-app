import { z } from 'zod';

// ============ Auth Validation ============
export const LoginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email es requerido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, 'Contraseña actual requerida'),
    newPassword: z.string().min(6, 'Nueva contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// ============ Position Validation ============
export const PositionSchema = z.object({
  symbol: z.string().min(3, 'Símbolo requerido').toUpperCase(),
  type: z.enum(['long', 'short'], {
    errorMap: () => ({ message: 'Tipo de posición inválido' }),
  }),
  entry: z.number().positive('Precio de entrada debe ser positivo'),
  stop: z.number().positive('Stop loss debe ser positivo'),
  tp: z.number().positive('Take profit debe ser positivo'),
});

// ============ Course Validation ============
export const CourseSchema = z.object({
  title: z.string().min(3, 'Título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'Descripción debe tener al menos 10 caracteres').optional(),
  category: z.enum(['Inversiones', 'Personal', 'Biohacking', 'Educación'], {
    errorMap: () => ({ message: 'Categoría inválida' }),
  }),
  instructor: z.string().min(2, 'Instructor requerido'),
  duration: z.string().min(1, 'Duración requerida'),
  level: z.enum(['Principiante', 'Intermedio', 'Avanzado'], {
    errorMap: () => ({ message: 'Nivel inválido' }),
  }),
  price: z.number().nonnegative('Precio debe ser no-negativo'),
});

// ============ Article Validation ============
export const ArticleSchema = z.object({
  title: z.string().min(5, 'Título debe tener al menos 5 caracteres'),
  content: z.string().min(50, 'Contenido debe tener al menos 50 caracteres'),
  section: z.enum(['Inversiones', 'Personal', 'Biohacking', 'Educación', 'Comunidad'], {
    errorMap: () => ({ message: 'Sección inválida' }),
  }),
  tags: z.array(z.string()).optional(),
});

// ============ Payment Validation ============
export const CardSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, 'Número de tarjeta debe tener 16 dígitos'),
  expiryDate: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, 'Fecha de expiración debe ser MM/YY'),
  cvc: z.string().regex(/^\d{3,4}$/, 'CVC debe tener 3 o 4 dígitos'),
  cardholderName: z.string().min(2, 'Nombre del titular requerido'),
});

// ============ Profile Validation ============
export const ProfileSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  bio: z.string().max(500, 'Biografía no puede exceder 500 caracteres').optional(),
});

// ============ Biohacking Metrics Validation ============
export const BiohackingMetricsSchema = z.object({
  weight: z.number().positive('Peso debe ser positivo'),
  sleep: z.number().min(0, 'Sueño no puede ser negativo').max(24, 'Sueño no puede exceder 24 horas'),
  energy: z.number().min(1, 'Energía debe estar entre 1-10').max(10, 'Energía debe estar entre 1-10'),
  mood: z.number().min(1, 'Ánimo debe estar entre 1-10').max(10, 'Ánimo debe estar entre 1-10'),
});

// ============ Search & Filter Validation ============
export const SearchSchema = z.object({
  query: z.string().min(1, 'Búsqueda requerida').max(100, 'Búsqueda muy larga'),
  category: z.string().optional(),
  sortBy: z.enum(['recent', 'popular', 'trending']).optional(),
});

// Type exports for use with react-hook-form
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type PositionInput = z.infer<typeof PositionSchema>;
export type CourseInput = z.infer<typeof CourseSchema>;
export type ArticleInput = z.infer<typeof ArticleSchema>;
export type CardInput = z.infer<typeof CardSchema>;
export type ProfileInput = z.infer<typeof ProfileSchema>;
export type BiohackingMetricsInput = z.infer<typeof BiohackingMetricsSchema>;
export type SearchInput = z.infer<typeof SearchSchema>;
