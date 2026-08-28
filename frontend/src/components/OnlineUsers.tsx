import React, { useState, useEffect } from 'react';
import useWebSocket from '@hooks/useWebSocket';

interface OnlineUser {
  userId: string;
  email: string;
  socketId: string;
}

export const OnlineUsers: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const { socket } = useWebSocket(
    process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:5000'
  );

  useEffect(() => {
    if (!socket) return;

    const handleUsersOnline = (users: OnlineUser[]) => {
      setOnlineUsers(users);
    };

    socket.on('users:online', handleUsersOnline);

    return () => {
      socket.off('users:online', handleUsersOnline);
    };
  }, [socket]);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-full border border-green-600/30">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-sm font-medium text-green-300">
        {onlineUsers.length} online
      </span>
    </div>
  );
};

export default OnlineUsers;
