import { Request, Response } from 'express';
import { StoreService } from '../services/store.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { getSocketServer } from '../sockets/socket.handler.js';
import { Message } from '@fixnear/shared';

export class MessageController {
  private store: StoreService;

  constructor() {
    this.store = StoreService.getInstance();
  }

  public getConversations = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
      return;
    }

    const convs = Array.from(this.store.conversations.values()).filter(c => {
      const providerProfile = this.store.providerProfiles.get(c.providerId);
      return (
        c.customerId === req.user?.userId ||
        c.providerId === req.user?.userId ||
        providerProfile?.userId === req.user?.userId ||
        req.user?.role === 'ADMIN'
      );
    });

    const list = convs.map(c => {
      const booking = this.store.bookings.get(c.bookingId);
      const otherUser = c.customerId === req.user?.userId ? c.provider : c.customer;
      return {
        ...c,
        booking,
        otherUser,
      };
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    sendSuccess(res, list);
  };

  public getMessages = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
      return;
    }

    const { id } = req.params; // conversationId or bookingId
    let convId = id;
    if (!this.store.conversations.has(id)) {
      // Try finding by bookingId
      const conv = Array.from(this.store.conversations.values()).find(c => c.bookingId === id);
      if (conv) convId = conv.id;
    }

    const conv = this.store.conversations.get(convId);
    if (!conv) {
      sendError(res, 'CONVERSATION_NOT_FOUND', 'Conversation not found', 404);
      return;
    }

    const msgs = this.store.messages.get(convId) || [];

    // Mark messages as read for current user
    for (const m of msgs) {
      if (m.receiverId === req.user.userId) {
        m.isRead = true;
      }
    }

    sendSuccess(res, {
      conversation: conv,
      messages: msgs,
    });
  };

  public sendMessage = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
      return;
    }

    const { id } = req.params; // conversationId or bookingId
    const { content, imageUrl } = req.body;

    let conv = this.store.conversations.get(id);
    if (!conv) {
      conv = Array.from(this.store.conversations.values()).find(c => c.bookingId === id);
    }

    if (!conv) {
      sendError(res, 'CONVERSATION_NOT_FOUND', 'Conversation not found', 404);
      return;
    }

    const booking = this.store.bookings.get(conv.bookingId);
    const providerProfile = this.store.providerProfiles.get(conv.providerId);
    const receiverId = req.user.userId === conv.customerId ? (providerProfile?.userId || conv.providerId) : conv.customerId;

    const newMsg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId: conv.id,
      senderId: req.user.userId,
      receiverId,
      content,
      imageUrl: imageUrl || null,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const msgs = this.store.messages.get(conv.id) || [];
    msgs.push(newMsg);
    this.store.messages.set(conv.id, msgs);

    conv.lastMessage = newMsg;
    conv.updatedAt = new Date().toISOString();

    // Broadcast via socket
    const io = getSocketServer();
    if (io) {
      io.to(`booking_${conv.bookingId}`).emit('new_message', newMsg);
      io.to(`user_${receiverId}`).emit('notification', {
        id: `notif-${Date.now()}`,
        userId: receiverId,
        type: 'NEW_MESSAGE',
        title: `Message from ${req.user.name}`,
        message: content.substring(0, 80),
        data: { bookingId: conv.bookingId },
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    sendSuccess(res, newMsg, 'Message sent', 201);
  };
}
