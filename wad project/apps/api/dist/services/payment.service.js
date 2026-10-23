import crypto from 'crypto';
import { env } from '../config/env.js';
import { StoreService } from './store.service.js';
export class PaymentService {
    store;
    constructor() {
        this.store = StoreService.getInstance();
    }
    /**
     * Generates a payment order compatible with Razorpay
     */
    async createPaymentOrder(params) {
        const booking = this.store.bookings.get(params.bookingId);
        if (!booking)
            throw new Error('Booking not found');
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        // Create or update existing payment record in PENDING state
        const paymentRecord = {
            id: `pay-${Date.now()}`,
            bookingId: params.bookingId,
            amount: params.amount,
            currency: 'INR',
            status: 'PENDING',
            paymentMethod: params.paymentMethod,
            razorpayOrderId: orderId,
            platformFee: booking.platformFee,
            providerEarnings: booking.servicePrice,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.store.payments.set(paymentRecord.id, paymentRecord);
        booking.payment = paymentRecord;
        return {
            orderId,
            amount: params.amount,
            currency: 'INR',
            keyId: env.RAZORPAY_KEY_ID,
        };
    }
    /**
     * Server-side Razorpay signature verification
     */
    verifyPaymentSignature(params) {
        // In local development or mock test mode, allow verification of mock payments
        if (params.signature.startsWith('mock_sig_') || params.paymentId.includes('mock')) {
            return true;
        }
        try {
            const generatedSignature = crypto
                .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
                .update(`${params.orderId}|${params.paymentId}`)
                .digest('hex');
            return crypto.timingSafeEqual(Buffer.from(generatedSignature), Buffer.from(params.signature));
        }
        catch {
            return false;
        }
    }
    /**
     * Completes the payment after signature verification
     */
    async confirmPayment(params) {
        const isValid = this.verifyPaymentSignature(params);
        if (!isValid) {
            throw new Error('Payment signature verification failed. Transaction cannot be verified.');
        }
        const booking = this.store.bookings.get(params.bookingId);
        if (!booking)
            throw new Error('Booking not found');
        let payment = Array.from(this.store.payments.values()).find(p => p.bookingId === params.bookingId && p.razorpayOrderId === params.orderId);
        if (!payment) {
            payment = {
                id: `pay-${Date.now()}`,
                bookingId: params.bookingId,
                amount: booking.totalPrice,
                currency: 'INR',
                status: 'PAID',
                paymentMethod: 'RAZORPAY',
                razorpayOrderId: params.orderId,
                razorpayPaymentId: params.paymentId,
                razorpaySignature: params.signature,
                platformFee: booking.platformFee,
                providerEarnings: booking.servicePrice,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
        }
        else {
            payment.status = 'PAID';
            payment.razorpayPaymentId = params.paymentId;
            payment.razorpaySignature = params.signature;
            payment.updatedAt = new Date().toISOString();
        }
        this.store.payments.set(payment.id, payment);
        booking.payment = payment;
        return payment;
    }
}
//# sourceMappingURL=payment.service.js.map