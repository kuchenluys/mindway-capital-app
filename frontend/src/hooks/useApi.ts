import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from './useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = <T,>(
  initialData: T | null = null
) => {
  const { token } = useAuth();
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const request = useCallback(
    async (
      endpoint: string,
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
      data?: any
    ): Promise<T> => {
      setState({ data: null, loading: true, error: null });

      try {
        const config: any = {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        };

        let response;

        switch (method) {
          case 'GET':
            response = await axios.get<T>(`${API_URL}${endpoint}`, config);
            break;
          case 'POST':
            response = await axios.post<T>(`${API_URL}${endpoint}`, data, config);
            break;
          case 'PUT':
            response = await axios.put<T>(`${API_URL}${endpoint}`, data, config);
            break;
          case 'DELETE':
            response = await axios.delete<T>(`${API_URL}${endpoint}`, config);
            break;
          default:
            throw new Error('Invalid method');
        }

        setState({
          data: response.data,
          loading: false,
          error: null,
        });

        return response.data;
      } catch (error) {
        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || error.message
            : 'An error occurred';

        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });

        throw error;
      }
    },
    [token]
  );

  return {
    ...state,
    request,
  };
};
