import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { Conversation, Message, Booking } from '@fixnear/shared';
import { Send, MessageSquare, Image, Check, CheckCheck, Clock, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const CustomerMessages: React.FC = () => {
  const [searchParams] = useSearchParams();
  const requestedBookingId = searchParams.get('bookingId');
  const { user } = useAuth();
  const {
    socket,
    joinBookingChat,
    leaveBookingChat,
    sendMessage: socketSendMessage,
    sendTyping,
    lastIncomingMessage,
    typingUser,
  } = useSocket();

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch conversations
  const { data: conversations = [], isLoading, refetch } = useQuery<any[]>({
    queryKey: ['user-conversations'],
    queryFn: () => api.get('/messages/conversations'),
  });

  // Set initial active conversation
  useEffect(() => {
    if (conversations.length > 0 && !activeConvId) {
      if (requestedBookingId) {
        const found = conversations.find(c => c.bookingId === requestedBookingId);
        if (found) setActiveConvId(found.id);
        else setActiveConvId(conversations[0].id);
      } else {
        setActiveConvId(conversations[0].id);
      }
    }
  }, [conversations, requestedBookingId, activeConvId]);

  const activeConversation = conversations.find(c => c.id === activeConvId);

  // 2. Fetch messages for active conversation
  useEffect(() => {
    if (!activeConvId) return;

    api.get<{ messages: Message[] }>(`/messages/conversations/${activeConvId}/messages`)
      .then(res => {
        setLocalMessages(res.messages || []);
      })
      .catch(console.error);

    if (activeConversation?.bookingId) {
      joinBookingChat(activeConversation.bookingId);
    }

    return () => {
      if (activeConversation?.bookingId) {
        leaveBookingChat(activeConversation.bookingId);
      }
    };
  }, [activeConvId, activeConversation?.bookingId]);

  // 3. Listen to incoming real-time socket messages
  useEffect(() => {
    if (lastIncomingMessage && lastIncomingMessage.conversationId === activeConvId) {
      setLocalMessages(prev => {
        // Prevent duplicate append
        if (prev.some(m => m.id === lastIncomingMessage.id)) return prev;
        return [...prev, lastIncomingMessage];
      });
    }
  }, [lastIncomingMessage, activeConvId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, typingUser]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    const content = inputText.trim();
    setInputText('');

    // Send over WebSocket
    socketSendMessage(activeConversation.bookingId, content);

    // Also call REST fallback to ensure storage
    api.post(`/messages/conversations/${activeConversation.id}/messages`, { content })
      .catch(console.error);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (activeConversation) {
      sendTyping(activeConversation.bookingId, e.target.value.length > 0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        {/* Conversations Sidebar */}
        <div className="lg:col-span-4 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-900">Conversations</h2>
            <p className="text-xs text-slate-500">Chats linked to your verified bookings</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active conversations yet.
              </div>
            ) : (
              conversations.map(conv => {
                const isActive = conv.id === activeConvId;
                const other = conv.otherUser;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${
                      isActive ? 'bg-primary-50/70 border-l-4 border-primary-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm flex-shrink-0">
                      {other?.name?.charAt(0) || 'U'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {other?.name || 'Technician'}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate">
                        {conv.booking?.service?.name || 'Booking Service'}
                      </p>

                      <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                        {conv.lastMessage?.content || 'Started chat'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-8 flex flex-col justify-between h-full bg-slate-50/30">
          {activeConversation ? (
            <>
              {/* Header */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                    {activeConversation.otherUser?.name?.charAt(0) || 'T'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {activeConversation.otherUser?.name || 'Technician'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Booking: {activeConversation.booking?.service?.name} (Status: {activeConversation.booking?.status})
                    </p>
                  </div>
                </div>

                <Link
                  to={user?.role === 'SERVICE_PROVIDER' ? `/provider/bookings/${activeConversation.bookingId}` : `/customer/bookings/${activeConversation.bookingId}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  View Booking
                </Link>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[500px]">
                {localMessages.map(msg => {
                  const isMe = msg.senderId === user?.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl px-4 py-2.5 text-xs shadow-xs space-y-1 ${
                          isMe
                            ? 'bg-primary-600 text-white rounded-br-none'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.content}</p>
                        <div
                          className={`text-[10px] flex items-center justify-end gap-1 ${
                            isMe ? 'text-primary-200' : 'text-slate-400'
                          }`}
                        >
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {typingUser && typingUser.isTyping && (
                  <div className="text-xs text-slate-400 italic flex items-center gap-1.5 animate-pulse">
                    <span>{typingUser.userName} is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={handleTyping}
                  placeholder="Type a message or question..."
                  className="flex-1 px-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />

                <Button type="submit" variant="primary" size="md" icon={<Send className="w-4 h-4" />}>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 mb-2 text-slate-300" />
              <p className="text-sm font-semibold">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
