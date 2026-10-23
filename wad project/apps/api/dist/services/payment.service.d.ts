import { Payment, PaymentMethod } from '@fixnear/shared';
export interface CreateOrderParams {
    bookingId: string;
    amount: number;
    paymentMethod: PaymentMethod;
}
export declare class PaymentService {
    private store;
    constructor();
    /**
     * Generates a payment order compatible with Razorpay
     */
    createPaymentOrder(params: CreateOrderParams): Promise<{
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
    }>;
    /**
     * Server-side Razorpay signature verification
     */
    verifyPaymentSignature(params: {
        orderId: string;
        paymentId: string;
        signature: string;
    }): boolean;
    /**
     * Completes the payment after signature verification
     */
    confirmPayment(params: {
        bookingId: string;
        orderId: string;
        paymentId: string;
        signature: string;
    }): Promise<Payment>;
}
//# sourceMappingURL=payment.service.d.ts.map