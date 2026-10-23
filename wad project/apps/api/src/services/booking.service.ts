import { StoreService } from './store.service.js';
import { Booking, BookingStatus, VALID_STATUS_TRANSITIONS, PLATFORM_FEE_INR } from '@fixnear/shared';
import { getSocketServer } from '../sockets/socket.handler.js';

export class BookingService {
  private store: StoreService;

  constructor() {
    this.store = StoreService.getInstance();
  }

  public async createBooking(params: {
    customerId: string;
    providerId: string;
    serviceId: string;
    scheduledAt: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    contactPhone: string;
    problemDescription: string;
    additionalNotes?: string;
    problemImages?: string[];
    isEmergency?: boolean;
  }): Promise<Booking> {
    const customer = this.store.users.get(params.customerId);
    if (!customer) throw new Error('Customer account not found');

    const provider = this.store.providerProfiles.get(params.providerId);
    if (!provider) throw new Error('Provider not found');

    if (provider.status !== 'VERIFIED') {
      throw new Error('This service professional is currently not accepting new bookings.');
    }

    const service = this.store.services.get(params.serviceId);
    if (!service) throw new Error('Selected service not found');

    // Check if provider offers this service
    const ps = Array.from(this.store.providerServices.values()).find(
      p => p.providerId === params.providerId && p.serviceId === params.serviceId
    );
    const servicePrice = ps ? ps.customPrice : service.basePrice;
    const platformFee = PLATFORM_FEE_INR;
    const emergencySurcharge = params.isEmergency ? 150 : 0;
    const totalPrice = servicePrice + platformFee + emergencySurcharge;

    const bookingId = `bk-${Date.now()}`;
    const booking: Booking = {
      id: bookingId,
      customerId: params.customerId,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        avatarUrl: customer.avatarUrl,
      },
      providerId: params.providerId,
      provider: {
        id: provider.id,
        businessName: provider.businessName,
        rating: provider.rating,
        reviewCount: provider.reviewCount,
        user: {
          name: provider.user?.name || provider.businessName,
          email: provider.user?.email || '',
          phone: provider.user?.phone,
          avatarUrl: provider.user?.avatarUrl,
        },
      },
      serviceId: params.serviceId,
      service,
      status: 'PENDING',
      scheduledAt: params.scheduledAt,
      estimatedDurationMinutes: service.estimatedDurationMinutes,
      street: params.street,
      city: params.city,
      state: params.state,
      postalCode: params.postalCode,
      latitude: params.latitude,
      longitude: params.longitude,
      contactPhone: params.contactPhone,
      problemDescription: params.problemDescription,
      additionalNotes: params.additionalNotes,
      problemImages: params.problemImages || [],
      completionImages: [],
      servicePrice,
      platformFee,
      discountAmount: 0,
      totalPrice,
      isEmergency: !!params.isEmergency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.store.bookings.set(bookingId, booking);

    // Create or find conversation
    const convId = `conv-${bookingId}`;
    this.store.conversations.set(convId, {
      id: convId,
      bookingId,
      customerId: params.customerId,
      providerId: provider.userId,
      customer,
      provider: provider.user,
      lastMessage: null,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    this.store.messages.set(convId, []);

    // Notify provider in real-time
    this.notifyUser(provider.userId, {
      type: 'BOOKING_REQUEST',
      title: 'New Service Request!',
      message: `${customer.name} requested ${service.name} for ${params.city}.`,
      data: { bookingId },
    });

    return booking;
  }

  public async transitionBookingStatus(
    bookingId: string,
    nextStatus: BookingStatus,
    userId: string,
    comment?: string,
    completionImages?: string[]
  ): Promise<Booking> {
    const booking = this.store.bookings.get(bookingId);
    if (!booking) throw new Error('Booking not found');

    const allowedTransitions = VALID_STATUS_TRANSITIONS[booking.status] || [];
    if (!allowedTransitions.includes(nextStatus)) {
      throw new Error(`Invalid status transition from ${booking.status} to ${nextStatus}.`);
    }

    booking.status = nextStatus;
    booking.updatedAt = new Date().toISOString();

    if (completionImages && completionImages.length > 0) {
      booking.completionImages = completionImages;
    }

    if (nextStatus === 'COMPLETED') {
      // Increment completed jobs count for provider
      const provider = this.store.providerProfiles.get(booking.providerId);
      if (provider) {
        provider.completedJobsCount += 1;
      }
    }

    this.store.bookings.set(bookingId, booking);

    // Notify both customer and provider
    const providerProfile = this.store.providerProfiles.get(booking.providerId);
    const targetUserId = userId === booking.customerId ? providerProfile?.userId : booking.customerId;

    if (targetUserId) {
      this.notifyUser(targetUserId, {
        type: `BOOKING_${nextStatus}` as any,
        title: `Booking Status: ${nextStatus.replace('_', ' ')}`,
        message: comment || `Booking for ${booking.service?.name} updated to ${nextStatus}.`,
        data: { bookingId, status: nextStatus },
      });
    }

    return booking;
  }

  private notifyUser(userId: string, notif: { type: string; title: string; message: string; data?: any }): void {
    const list = this.store.notifications.get(userId) || [];
    const record = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      type: notif.type as any,
      title: notif.title,
      message: notif.message,
      data: notif.data,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    list.unshift(record);
    this.store.notifications.set(userId, list);

    // Emit over Socket.IO if connected
    const io = getSocketServer();
    if (io) {
      io.to(`user_${userId}`).emit('notification', record);
    }
  }
}
