import { Request, Response } from 'express';
import { StoreService } from '../services/store.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { Dispute, DisputeStatus } from '@fixnear/shared';

export class DisputeController {
  private store: StoreService;

  constructor() {
    this.store = StoreService.getInstance();
  }

  public create = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
      return;
    }

    const { bookingId, reason, description, evidenceImages = [] } = req.body;

    const booking = this.store.bookings.get(bookingId);
    if (!booking) {
      sendError(res, 'BOOKING_NOT_FOUND', 'Booking not found', 404);
      return;
    }

    const dispId = `disp-${Date.now()}`;
    const dispute: Dispute = {
      id: dispId,
      bookingId,
      booking,
      raisedById: req.user.userId,
      raisedBy: this.store.users.get(req.user.userId),
      reason,
      description,
      evidenceImages,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.store.disputes.set(dispId, dispute);

    // Update booking status to DISPUTED
    booking.status = 'DISPUTED';
    booking.updatedAt = new Date().toISOString();

    sendSuccess(res, dispute, 'Dispute case opened. FixNear support will review the case.', 201);
  };

  public getAll = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
      return;
    }

    let list = Array.from(this.store.disputes.values());

    if (req.user.role !== 'ADMIN') {
      list = list.filter(d => d.raisedById === req.user?.userId);
    }

    sendSuccess(res, list);
  };

  public resolve = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || req.user.role !== 'ADMIN') {
      sendError(res, 'FORBIDDEN', 'Only administrators can resolve disputes', 403);
      return;
    }

    const { id } = req.params;
    const { status, resolution, adminNotes, refundAmount } = req.body;

    const dispute = this.store.disputes.get(id);
    if (!dispute) {
      sendError(res, 'DISPUTE_NOT_FOUND', 'Dispute not found', 404);
      return;
    }

    dispute.status = status as DisputeStatus;
    dispute.resolution = resolution;
    dispute.adminNotes = adminNotes;
    dispute.resolvedAt = new Date().toISOString();
    dispute.resolvedById = req.user.userId;
    dispute.updatedAt = new Date().toISOString();

    // If refund was approved, update payment status
    if (refundAmount && refundAmount > 0) {
      const payment = Array.from(this.store.payments.values()).find(p => p.bookingId === dispute.bookingId);
      if (payment) {
        payment.status = 'REFUNDED';
      }
    }

    sendSuccess(res, dispute, `Dispute has been ${status.toLowerCase()}`);
  };
}
