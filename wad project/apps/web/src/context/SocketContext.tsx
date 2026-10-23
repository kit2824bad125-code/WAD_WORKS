import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { Message, Notification } from '@fixnear/shared';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinBookingChat: (bookingId: string) => void;
  leaveBookingChat: (bookingId: string) => void;
  sendMessage: (bookingId: string, content: string, imageUrl?: string) => void;
  sendTyping: (bookingId: string, isTyping: boolean) => void;
  lastIncomingMessage: Message | null;
  lastNotification: Notification | null;
  typingUser: { userName: string; isTyping: boolean } | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastIncomingMessage, setLastIncomingMessage] = useState<Message | null>(null);
  const [lastNotification, setLastNotification] = useState<Notification | null>(null);
  const [typingUser, setTypingUser] = useState<{ userName: string; isTyping: boolean } | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const newSocket = io('/', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('new_message', (msg: Message) => {
      setLastIncomingMessage(msg);
    });

    newSocket.on('notification', (notif: Notification) => {
      setLastNotification(notif);
    });

    newSocket.on('user_typing', (data: { userName: string; isTyping: boolean }) => {
      setTypingUser(data);
      if (data.isTyping) {
        setTimeout(() => setTypingUser(null), 3000);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, isAuthenticated]);

  const joinBookingChat = (bookingId: string) => {
    socket?.emit('join_booking_chat', { bookingId });
  };

  const leaveBookingChat = (bookingId: string) => {
    socket?.emit('leave_booking_chat', { bookingId });
  };

  const sendMessage = (bookingId: string, content: string, imageUrl?: string) => {
    socket?.emit('send_message', { bookingId, content, imageUrl });
  };

  const sendTyping = (bookingId: string, isTyping: boolean) => {
    socket?.emit('typing', { bookingId, isTyping });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinBookingChat,
        leaveBookingChat,
        sendMessage,
        sendTyping,
        lastIncomingMessage,
        lastNotification,
        typingUser,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
