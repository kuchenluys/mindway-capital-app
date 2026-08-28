import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

interface UseApiOptions {
  autoFetch?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: AxiosError) => void;
}

interface UseApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: () => Promise<T>;
  reset: () => void;
}

export const useApi = <T = any>(
  url: string,
  options: UseApiOptions = {}
): UseApiResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(options.autoFetch || false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<T>(url);
      setData(response.data);
      options.onSuccess?.(response.data);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage = axiosError.response?.data?.message || 'An error occurred';
      setError(String(errorMessage));
      options.onError?.(axiosError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

export default useApi;
