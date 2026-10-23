import { Request, Response } from 'express';
import { StoreService } from '../services/store.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { Review } from '@fixnear/shared';

export class ReviewController {
  private store: StoreService;

  constructor() {
    this.store = StoreService.getInstance();
  }

  public create = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
      return;
    }

    const { bookingId } = req.params;
    const { rating, comment, images } = req.body;

    const booking = this.store.bookings.get(bookingId);
    if (!booking) {
      sendError(res, 'BOOKING_NOT_FOUND', 'Booking not found', 404);
      return;
    }

    // Rule 1: Customer ownership check
    if (booking.customerId !== req.user.userId) {
      sendError(res, 'FORBIDDEN', 'You can only review bookings made from your own account', 403);
      return;
    }

    // Rule 2: Booking must be COMPLETED
    if (booking.status !== 'COMPLETED') {
      sendError(res, 'INVALID_BOOKING_STATE', 'Reviews can only be submitted after the service is marked completed', 400);
      return;
    }

    // Rule 3: Prevent duplicate reviews
    const existing = Array.from(this.store.reviews.values()).find(r => r.bookingId === bookingId);
    if (existing) {
      sendError(res, 'DUPLICATE_REVIEW', 'A review has already been submitted for this booking', 409);
      return;
    }

    const customer = this.store.users.get(req.user.userId);
    const revId = `rev-${Date.now()}`;
    const newReview: Review = {
      id: revId,
      bookingId,
      customerId: req.user.userId,
      customerName: customer?.name || 'Customer',
      customerAvatar: customer?.avatarUrl,
      providerId: booking.providerId,
      rating: Math.min(5, Math.max(1, rating)),
      comment,
      images: images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.store.reviews.set(revId, newReview);
    booking.review = newReview;

    // Recalculate provider rating
    const provider = this.store.providerProfiles.get(booking.providerId);
    if (provider) {
      const allReviews = Array.from(this.store.reviews.values()).filter(r => r.providerId === provider.id);
      const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
      provider.rating = Math.round((sum / allReviews.length) * 10) / 10;
      provider.reviewCount = allReviews.length;
      this.store.providerProfiles.set(provider.id, provider);
    }

    sendSuccess(res, newReview, 'Thank you! Your review has been published.', 201);
  };

  public getProviderReviews = async (req: Request, res: Response): Promise<void> => {
    const { providerId } = req.params;

    const list = Array.from(this.store.reviews.values())
      .filter(r => r.providerId === providerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    sendSuccess(res, list);
  };
}
