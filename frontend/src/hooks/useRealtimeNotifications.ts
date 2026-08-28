import { useEffect } from 'react';
import { toast } from 'sonner';
import useWebSocket from './useWebSocket';
import { useAuth } from './useAuth';

interface RealtimeNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
}

export const useRealtimeNotifications = () => {
  const { user } = useAuth();
  const { socket, emit, on } = useWebSocket(
    process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:5000',
    { autoConnect: true }
  );

  useEffect(() => {
    if (!user?.id || !socket) return;

    // Notificar al servidor que el usuario se conectó
    emit('user:join', {
      userId: user.id,
      email: user.email
    });

    // Escuchar notificaciones
    on('notification:receive', (notification: RealtimeNotification) => {
      toast[notification.type](notification.message, {
        description: notification.title,
        duration: 5000
      });
    });

    // Escuchar actualizaciones de posiciones
    on('position:updated', (positionData) => {
      const symbol = positionData.symbol || 'XAUUSD';
      const pips = positionData.pips || 0;
      const color = pips > 0 ? 'success' : 'error';

      toast[color](`${symbol} actualizado: ${pips > 0 ? '+' : ''}${pips} pips`, {
        duration: 4000
      });
    });

    // Escuchar cambios en cursos
    on('course:updated', (courseData) => {
      toast.info(`Progreso actualizado: ${courseData.progress}%`, {
        description: courseData.courseName,
        duration: 3000
      });
    });

    // Escuchar usuarios online
    on('users:online', (users) => {
      console.log(`👥 ${users.length} usuarios en línea`);
    });

    return () => {
      // Cleanup
    };
  }, [user, socket, emit, on]);

  return { socket };
};

export default useRealtimeNotifications;
