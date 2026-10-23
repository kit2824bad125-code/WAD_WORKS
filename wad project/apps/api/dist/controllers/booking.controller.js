import { StoreService } from '../services/store.service.js';
import { BookingService } from '../services/booking.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
export class BookingController {
    store;
    bookingService;
    constructor() {
        this.store = StoreService.getInstance();
        this.bookingService = new BookingService();
    }
    create = async (req, res) => {
        if (!req.user) {
            sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
            return;
        }
        try {
            const booking = await this.bookingService.createBooking({
                customerId: req.user.userId,
                ...req.body,
            });
            sendSuccess(res, booking, 'Booking request submitted successfully', 201);
        }
        catch (err) {
            sendError(res, 'BOOKING_FAILED', err.message || 'Failed to create booking', 400);
        }
    };
    getUserBookings = async (req, res) => {
        if (!req.user) {
            sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
            return;
        }
        const { status } = req.query;
        let list = Array.from(this.store.bookings.values());
        if (req.user.role === 'CUSTOMER') {
            list = list.filter(b => b.customerId === req.user?.userId);
        }
        else if (req.user.role === 'SERVICE_PROVIDER') {
            const provider = Array.from(this.store.providerProfiles.values()).find(p => p.userId === req.user?.userId);
            if (!provider) {
                sendSuccess(res, []);
                return;
            }
            list = list.filter(b => b.providerId === provider.id);
        }
        if (status) {
            list = list.filter(b => b.status === status);
        }
        list.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
        sendSuccess(res, list);
    };
    getById = async (req, res) => {
        if (!req.user) {
            sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
            return;
        }
        const { id } = req.params;
        const booking = this.store.bookings.get(id);
        if (!booking) {
            sendError(res, 'BOOKING_NOT_FOUND', 'Booking not found', 404);
            return;
        }
        const providerProfile = this.store.providerProfiles.get(booking.providerId);
        const isOwner = req.user.role === 'ADMIN' ||
            booking.customerId === req.user.userId ||
            providerProfile?.userId === req.user.userId;
        if (!isOwner) {
            sendError(res, 'FORBIDDEN', 'Access denied to this booking', 403);
            return;
        }
        // Attach timeline history
        const timeline = [
            { status: 'PENDING', label: 'Request Submitted', timestamp: booking.createdAt, done: true },
            { status: 'ACCEPTED', label: 'Provider Accepted', timestamp: booking.createdAt, done: ['ACCEPTED', 'CONFIRMED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'].includes(booking.status) },
            { status: 'CONFIRMED', label: 'Booking Confirmed', timestamp: booking.scheduledAt, done: ['CONFIRMED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'].includes(booking.status) },
            { status: 'EN_ROUTE', label: 'Provider En Route', done: ['EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'].includes(booking.status) },
            { status: 'ARRIVED', label: 'Provider Arrived', done: ['ARRIVED', 'IN_PROGRESS', 'COMPLETED'].includes(booking.status) },
            { status: 'IN_PROGRESS', label: 'Service Started', done: ['IN_PROGRESS', 'COMPLETED'].includes(booking.status) },
            { status: 'COMPLETED', label: 'Service Completed', done: booking.status === 'COMPLETED' },
        ];
        if (booking.status === 'CANCELLED') {
            timeline.push({ status: 'CANCELLED', label: `Cancelled: ${booking.cancelledReason || 'By user'}`, done: true });
        }
        else if (booking.status === 'DISPUTED') {
            timeline.push({ status: 'DISPUTED', label: 'Dispute Raised', done: true });
        }
        const quote = this.store.quotes.get(booking.id);
        const payment = Array.from(this.store.payments.values()).find(p => p.bookingId === booking.id);
        const review = Array.from(this.store.reviews.values()).find(r => r.bookingId === booking.id);
        sendSuccess(res, {
            ...booking,
            timeline,
            quote: quote || null,
            payment: payment || null,
            review: review || null,
        });
    };
    updateStatus = async (req, res) => {
        if (!req.user) {
            sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
            return;
        }
        const { id } = req.params;
        const { status, comment, cancellationReason, completionImages } = req.body;
        try {
            const updated = await this.bookingService.transitionBookingStatus(id, status, req.user.userId, comment || cancellationReason, completionImages);
            if (status === 'CANCELLED') {
                updated.cancelledAt = new Date().toISOString();
                updated.cancelledReason = cancellationReason || comment || 'User cancellation';
                updated.cancelledByUserId = req.user.userId;
            }
            sendSuccess(res, updated, `Booking status changed to ${status}`);
        }
        catch (err) {
            sendError(res, 'STATUS_TRANSITION_FAILED', err.message || 'Failed to update booking status', 400);
        }
    };
    createQuote = async (req, res) => {
        if (!req.user || req.user.role !== 'SERVICE_PROVIDER') {
            sendError(res, 'FORBIDDEN', 'Only service providers can issue quotes', 403);
            return;
        }
        const { id } = req.params;
        const { estimatedAmount, description, breakdown } = req.body;
        const booking = this.store.bookings.get(id);
        if (!booking) {
            sendError(res, 'BOOKING_NOT_FOUND', 'Booking not found', 404);
            return;
        }
        const quote = {
            id: `quote-${Date.now()}`,
            bookingId: id,
            estimatedAmount,
            description,
            breakdown,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.store.quotes.set(id, quote);
        booking.quote = quote;
        sendSuccess(res, quote, 'Quote submitted to customer', 201);
    };
    respondQuote = async (req, res) => {
        if (!req.user) {
            sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
            return;
        }
        const { id } = req.params; // quote id or booking id
        const { action } = req.body; // 'accept' or 'reject'
        const quote = Array.from(this.store.quotes.values()).find(q => q.id === id || q.bookingId === id);
        if (!quote) {
            sendError(res, 'QUOTE_NOT_FOUND', 'Quote not found', 404);
            return;
        }
        quote.status = action === 'accept' ? 'ACCEPTED' : 'REJECTED';
        quote.updatedAt = new Date().toISOString();
        const booking = this.store.bookings.get(quote.bookingId);
        if (booking && action === 'accept') {
            booking.servicePrice = quote.estimatedAmount;
            booking.totalPrice = quote.estimatedAmount + booking.platformFee;
        }
        sendSuccess(res, quote, `Quote ${action}ed successfully`);
    };
}
//# sourceMappingURL=booking.controller.js.map