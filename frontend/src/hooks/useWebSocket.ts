import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketOptions {
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionDelay?: number;
  reconnectionDelayMax?: number;
  reconnectionAttempts?: number;
}

export const useWebSocket = (url: string, options: WebSocketOptions = {}) => {
  const socketRef = useRef<Socket | null>(null);
  const isConnected = useRef(false);

  const defaultOptions: WebSocketOptions = {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    ...options
  };

  useEffect(() => {
    if (socketRef.current) return;

    socketRef.current = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: defaultOptions.reconnection,
      reconnectionDelay: defaultOptions.reconnectionDelay,
      reconnectionDelayMax: defaultOptions.reconnectionDelayMax,
      reconnectionAttempts: defaultOptions.reconnectionAttempts
    });

    socketRef.current.on('connect', () => {
      console.log('✅ WebSocket conectado:', socketRef.current?.id);
      isConnected.current = true;
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ WebSocket desconectado');
      isConnected.current = false;
    });

    socketRef.current.on('error', (error) => {
      console.error('🚨 WebSocket error:', error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [url]);

  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback((event: string, callback?: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected: isConnected.current,
    emit,
    on,
    off
  };
};

export default useWebSocket;
