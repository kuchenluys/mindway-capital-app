import React, { useState, useEffect } from 'react';
import useWebSocket from '@hooks/useWebSocket';
import { Card } from '@components/Card';

interface Notification {
  id: string;
  type: 'position' | 'course' | 'notification' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  icon?: string;
}

export const RealtimeNotificationsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { socket } = useWebSocket(
    process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:5000'
  );

  useEffect(() => {
    if (!socket) return;

    const handlePositionUpdate = (data: any) => {
      const pips = data.pips || 0;
      setNotifications(prev => [{
        id: `pos-${Date.now()}`,
        type: 'position',
        title: data.symbol,
        message: `${pips > 0 ? '+' : ''}${pips} pips`,
        timestamp: new Date().toLocaleTimeString(),
        icon: pips > 0 ? '📈' : '📉'
      }, ...prev].slice(0, 10));
    };

    const handleCourseUpdate = (data: any) => {
      setNotifications(prev => [{
        id: `course-${Date.now()}`,
        type: 'course',
        title: data.courseName,
        message: `Progreso: ${data.progress}%`,
        timestamp: new Date().toLocaleTimeString(),
        icon: '📚'
      }, ...prev].slice(0, 10));
    };

    const handleNotification = (data: any) => {
      setNotifications(prev => [{
        id: `notif-${Date.now()}`,
        type: 'notification',
        title: data.title,
        message: data.message,
        timestamp: new Date().toLocaleTimeString(),
        icon: '🔔'
      }, ...prev].slice(0, 10));
    };

    socket.on('position:updated', handlePositionUpdate);
    socket.on('course:updated', handleCourseUpdate);
    socket.on('notification:receive', handleNotification);

    return () => {
      socket.off('position:updated', handlePositionUpdate);
      socket.off('course:updated', handleCourseUpdate);
      socket.off('notification:receive', handleNotification);
    };
  }, [socket]);

  return (
    <Card className="border-cyan-600/30 bg-gradient-to-br from-cyan-900/10 to-blue-900/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-cyan-400">
          🔔 Notificaciones en Tiempo Real
        </h3>
        <span className="text-xs bg-cyan-900/50 px-2 py-1 rounded-full text-cyan-300">
          {notifications.length}
        </span>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            Esperando notificaciones...
          </p>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30 hover:border-cyan-600/50 transition-colors"
            >
              <span className="text-lg mt-1">{notif.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-white truncate">{notif.title}</p>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default RealtimeNotificationsPanel;
