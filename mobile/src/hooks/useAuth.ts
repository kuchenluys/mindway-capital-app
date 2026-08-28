import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { setUser, setLoading, setError, logout } from '@store/authSlice';
import { RootState } from '@store/index';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { user, token } = response.data;

      // Save token securely
      await SecureStore.setItemAsync('authToken', token);

      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch(setUser({ ...user, token }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch(setError(message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        name,
      });

      const { user, token } = response.data;

      // Save token securely
      await SecureStore.setItemAsync('authToken', token);

      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch(setUser({ ...user, token }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch(setError(message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      delete axios.defaults.headers.common['Authorization'];
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [dispatch]);

  const getCurrentUser = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${API_URL}/auth/me`);
      dispatch(setUser(response.data));
    } catch (error: any) {
      console.error('Get current user error:', error);
      dispatch(setError('Failed to fetch user'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    user: auth.user,
    isLoading: auth.loading,
    error: auth.error,
    login,
    register,
    logout,
    getCurrentUser,
  };
};

export default useAuth;
