import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: 'user' | 'admin' | 'editor' | 'moderator' | null;
  plan: 'free' | 'premium' | 'elite' | null;
  loading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin' | 'editor' | 'moderator';
  plan: 'free' | 'premium' | 'elite';
  planExpiry?: Date;
  lastLogin?: Date;
  isActive: boolean;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    darkMode: boolean;
    language: string;
  };
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  role: null,
  plan: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.role = action.payload.user.role;
      state.plan = action.payload.user.plan;
      state.loading = false;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      state.plan = null;
      state.error = null;
      localStorage.removeItem('token');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updatePlan: (state, action: PayloadAction<'free' | 'premium' | 'elite'>) => {
      state.plan = action.payload;
      if (state.user) {
        state.user.plan = action.payload;
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.plan = action.payload.plan;
    },
  },
});

export const {
  setLoading,
  setError,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  updatePlan,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;
