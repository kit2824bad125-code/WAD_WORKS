import { Server as SocketIOServer } from 'socket.io';
import { verifyAccessToken } from '../utils/security.js';
import { StoreService } from '../services/store.service.js';
let io = null;
export function initSocketServer(httpServer) {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    const store = StoreService.getInstance();
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        if (!token || typeof token !== 'string') {
            return next(new Error('Authentication token required for WebSocket'));
        }
        const payload = verifyAccessToken(token);
        if (!payload) {
            return next(new Error('Invalid or expired WebSocket authentication token'));
        }
        socket.user = payload;
        next();
    });
    io.on('connection', (socket) => {
        const user = socket.user;
        console.log(`[Socket] User connected: ${user.name} (${user.userId}, ${user.role})`);
        // Join personal notification channel
        socket.join(`user_${user.userId}`);
        // Join booking chat room
        socket.on('join_booking_chat', ({ bookingId }) => {
            const booking = store.bookings.get(bookingId);
            if (!booking) {
                socket.emit('error', { message: 'Booking not found' });
                return;
            }
            // Check permission: only customer, provider or admin can join
            const providerProfile = store.providerProfiles.get(booking.providerId);
            const isAuthorized = user.role === 'ADMIN' ||
                user.userId === booking.customerId ||
                user.userId === providerProfile?.userId;
            if (!isAuthorized) {
                socket.emit('error', { message: 'Unauthorized to join this booking chat' });
                return;
            }
            socket.join(`booking_${bookingId}`);
            console.log(`[Socket] User ${user.name} joined room booking_${bookingId}`);
        });
        // Leave booking chat room
        socket.on('leave_booking_chat', ({ bookingId }) => {
            socket.leave(`booking_${bookingId}`);
        });
        // Handle real-time messaging
        socket.on('send_message', (data) => {
            const booking = store.bookings.get(data.bookingId);
            if (!booking)
                return;
            const providerProfile = store.providerProfiles.get(booking.providerId);
            const receiverId = user.userId === booking.customerId ? providerProfile?.userId : booking.customerId;
            if (!receiverId)
                return;
            const convId = `conv-${data.bookingId}`;
            const msgList = store.messages.get(convId) || [];
            const newMsg = {
                id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                conversationId: convId,
                senderId: user.userId,
                receiverId,
                content: data.content,
                imageUrl: data.imageUrl,
                isRead: false,
                createdAt: new Date().toISOString(),
            };
            msgList.push(newMsg);
            store.messages.set(convId, msgList);
            const conv = store.conversations.get(convId);
            if (conv) {
                conv.lastMessage = newMsg;
                conv.updatedAt = new Date().toISOString();
            }
            // Broadcast message to everyone in the room
            io?.to(`booking_${data.bookingId}`).emit('new_message', newMsg);
            // Notify recipient if they are in their personal channel
            io?.to(`user_${receiverId}`).emit('notification', {
                id: `notif-${Date.now()}`,
                userId: receiverId,
                type: 'NEW_MESSAGE',
                title: `Message from ${user.name}`,
                message: data.content.substring(0, 80),
                data: { bookingId: data.bookingId, messageId: newMsg.id },
                isRead: false,
                createdAt: new Date().toISOString(),
            });
        });
        // Typing indicator
        socket.on('typing', ({ bookingId, isTyping }) => {
            socket.to(`booking_${bookingId}`).emit('user_typing', {
                userId: user.userId,
                userName: user.name,
                isTyping,
            });
        });
        socket.on('disconnect', () => {
            console.log(`[Socket] User disconnected: ${user.name}`);
        });
    });
    return io;
}
export function getSocketServer() {
    return io;
}
//# sourceMappingURL=socket.handler.js.map