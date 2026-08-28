import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@store/index';
import { loginSuccess, logout, setUser } from '@store/authSlice';
import { useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password,
        });

        dispatch(
          loginSuccess({
            user: response.data.user,
            token: response.data.token,
          })
        );

        return response.data;
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const response = await axios.post(`${API_URL}/auth/register`, {
          name,
          email,
          password,
          passwordConfirm: password,
        });

        dispatch(
          loginSuccess({
            user: response.data.user,
            token: response.data.token,
          })
        );

        return response.data;
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      dispatch(setUser(response.data));
      return response.data;
    } catch (error) {
      dispatch(logout());
      throw error;
    }
  }, [auth.token, dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    role: auth.role,
    plan: auth.plan,
    loading: auth.loading,
    error: auth.error,
    login,
    register,
    logout: handleLogout,
    fetchCurrentUser,
  };
};
