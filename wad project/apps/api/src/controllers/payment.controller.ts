import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service.js';
import { StoreService } from '../services/store.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class PaymentController {
  private paymentService: PaymentService;
  private store: StoreService;

  constructor() {
    this.paymentService = new PaymentService();
    this.store = StoreService.getInstance();
  }

  public createOrder = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
      return;
    }

    const { bookingId, paymentMethod = 'RAZORPAY' } = req.body;

    const booking = this.store.bookings.get(bookingId);
    if (!booking) {
      sendError(res, 'BOOKING_NOT_FOUND', 'Booking not found', 404);
      return;
    }

    if (booking.customerId !== req.user.userId) {
      sendError(res, 'FORBIDDEN', 'Unauthorized to pay for this booking', 403);
      return;
    }

    try {
      const order = await this.paymentService.createPaymentOrder({
        bookingId,
        amount: booking.totalPrice,
        paymentMethod,
      });

      sendSuccess(res, order, 'Payment order created');
    } catch (err: any) {
      sendError(res, 'ORDER_CREATION_FAILED', err.message, 400);
    }
  };

  public verify = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
      return;
    }

    const { bookingId, orderId, paymentId, signature } = req.body;

    try {
      const payment = await this.paymentService.confirmPayment({
        bookingId,
        orderId,
        paymentId,
        signature,
      });

      sendSuccess(res, payment, 'Payment verified successfully! Thank you.');
    } catch (err: any) {
      sendError(res, 'PAYMENT_VERIFICATION_FAILED', err.message, 400);
    }
  };

  public getPayment = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const payment = Array.from(this.store.payments.values()).find(
      p => p.id === id || p.bookingId === id
    );

    if (!payment) {
      sendError(res, 'PAYMENT_NOT_FOUND', 'Payment not found', 404);
      return;
    }

    sendSuccess(res, payment);
  };
}
