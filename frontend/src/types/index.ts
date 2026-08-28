export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'editor' | 'moderator';
  plan: 'free' | 'premium' | 'elite';
  avatar?: string;
  preferences?: Record<string, any>;
  lastLogin?: string;
}

export interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  entry: number;
  stop: number;
  tp: number;
  current?: number;
  pips?: number;
  status: 'open' | 'closed' | 'pending';
  createdAt: string;
  updatedAt?: string;
  exitPrice?: number;
  pnl?: number;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  category: string;
  instructor: string;
  duration: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  modules: number;
  price: number;
  rating?: number;
  enrolledCount?: number;
  image?: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  currentModule: number;
  status: 'active' | 'completed' | 'paused';
  enrolledAt: string;
  completedAt?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  section: string;
  tags: string[];
  views: number;
  likes: number;
  published: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  type: 'subscription' | 'one_time' | 'upgrade';
  stripePaymentIntentId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'premium' | 'elite';
  status: 'active' | 'canceled' | 'expired';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart?: string;
  trialEnd?: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: User['role'];
  plan: User['plan'];
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
