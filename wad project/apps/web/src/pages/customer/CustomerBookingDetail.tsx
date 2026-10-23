import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Booking, BookingStatus } from '@fixnear/shared';
import { StatusTimeline } from '../../components/domain/StatusTimeline';
import { PaymentModal } from '../../components/domain/PaymentModal';
import { RatingStars } from '../../components/ui/RatingStars';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  XCircle,
  FileText,
  Star,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

export const CustomerBookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('Change of plans');

  // Dispute form
  const [disputeReason, setDisputeReason] = useState('Service not completed to satisfaction');
  const [disputeDescription, setDisputeDescription] = useState('');
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const { data: booking, isLoading, refetch } = useQuery<Booking & { timeline: any[] }>({
    queryKey: ['booking-detail', id],
    queryFn: () => api.get(`/bookings/${id}`),
    refetchInterval: 4000, // Live poll for real-time status progression
  });

  const handleCancelBooking = async () => {
    try {
      await api.patch(`/bookings/${id}/status`, {
        status: 'CANCELLED',
        cancellationReason,
      });
      setCancelModalOpen(false);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking');
    }
  };

  const handleQuoteResponse = async (action: 'accept' | 'reject') => {
    try {
      await api.post(`/bookings/${id}/quote/respond`, { action });
      refetch();
    } catch (err: any) {
      alert(err.message || `Failed to ${action} quote`);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmittingReview(true);
      await api.post(`/reviews/${id}`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSuccess(true);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSubmitDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmittingDispute(true);
      await api.post('/disputes', {
        bookingId: id,
        reason: disputeReason,
        description: disputeDescription,
      });
      setDisputeModalOpen(false);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to submit dispute');
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingSkeleton type="card" count={2} />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Booking Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/customer/bookings')}>Back to Bookings</Button>
      </div>
    );
  }

  const isCompleted = booking.status === 'COMPLETED';
  const isPaid = booking.payment?.status === 'PAID';
  const canCancel = ['PENDING', 'ACCEPTED', 'CONFIRMED'].includes(booking.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button & Title */}
      <div>
        <Link to="/customer/bookings" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Bookings
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {booking.service?.name}
              </h1>
              <Badge variant={booking.status === 'COMPLETED' ? 'success' : booking.status === 'CANCELLED' ? 'danger' : 'primary'}>
                {booking.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1">Booking Reference: #{booking.id}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/customer/messages?bookingId=${booking.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-primary-600" />
              Chat with Pro
            </Link>

            {!isPaid && ['CONFIRMED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'].includes(booking.status) && (
              <Button
                variant="success"
                size="md"
                icon={<CreditCard className="w-4 h-4" />}
                onClick={() => setPaymentModalOpen(true)}
              >
                Pay ₹{booking.totalPrice}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Visual Live Status Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Service Status Progress</h3>
        <StatusTimeline currentStatus={booking.status} timeline={booking.timeline} />
      </div>

      {/* Quote Banner (if quote pending) */}
      {booking.quote && (
        <div className="bg-gradient-to-r from-indigo-50 to-primary-50 rounded-3xl p-6 border border-primary-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              <h3 className="text-base font-bold text-slate-900">Custom Quote from Technician</h3>
            </div>
            <Badge variant={booking.quote.status === 'ACCEPTED' ? 'success' : booking.quote.status === 'REJECTED' ? 'danger' : 'warning'}>
              Quote: {booking.quote.status}
            </Badge>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">{booking.quote.description}</p>

          <div className="flex items-center justify-between pt-2 border-t border-primary-200/60">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Estimated Quote Total</span>
              <span className="text-xl font-black text-slate-900">₹{booking.quote.estimatedAmount}</span>
            </div>

            {booking.quote.status === 'PENDING' && (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleQuoteResponse('reject')}>
                  Reject Quote
                </Button>
                <Button size="sm" variant="primary" onClick={() => handleQuoteResponse('accept')}>
                  Accept Quote
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Grid: Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Provider Card Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Assigned Professional</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={booking.provider?.user?.avatarUrl || `https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=150`}
                  alt={booking.provider?.businessName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900">{booking.provider?.businessName}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <RatingStars rating={booking.provider?.rating || 4.8} showNumber size="sm" />
                    <span>•</span>
                    <span>{booking.provider?.reviewCount || 50}+ reviews</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/providers/${booking.providerId}`}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg"
              >
                View Profile
              </Link>
            </div>
          </div>

          {/* Problem description & location */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Appointment & Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl">
                <span className="text-slate-400 block font-semibold">Scheduled Date & Time</span>
                <span className="text-sm font-bold text-slate-900">
                  {new Date(booking.scheduledAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at{' '}
                  {new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="space-y-1 bg-slate-50 p-3.5 rounded-xl">
                <span className="text-slate-400 block font-semibold">Service Address</span>
                <span className="text-sm font-bold text-slate-900 truncate block">
                  {booking.street}, {booking.city} - {booking.postalCode}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1">Issue Description</span>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl leading-relaxed">
                {booking.problemDescription}
              </p>
            </div>
          </div>

          {/* Review Submission Section (If completed and not reviewed yet) */}
          {isCompleted && !booking.review && !reviewSuccess && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                Rate & Review Your Technician
              </h3>
              <p className="text-xs text-slate-500">
                How was the service? Your feedback helps keep FixNear reliable for everyone.
              </p>

              <form onSubmit={handleSubmitReview} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700">Rating:</span>
                  <RatingStars
                    rating={reviewRating}
                    size="lg"
                    interactive
                    onRatingChange={r => setReviewRating(r)}
                  />
                </div>

                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Was the technician punctual, clean, and courteous? Share your experience..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-primary-500 focus:outline-none"
                  required
                />

                <Button type="submit" variant="primary" size="md" isLoading={isSubmittingReview}>
                  Publish Review
                </Button>
              </form>
            </div>
          )}

          {/* Review already submitted */}
          {(booking.review || reviewSuccess) && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Thank you for your review!
              </div>
              <p className="text-xs text-emerald-800">
                "{booking.review?.comment || reviewComment}" — Rating: {booking.review?.rating || reviewRating} / 5
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Price breakdown card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Payment Summary</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Service Base Price</span>
                <span className="font-semibold text-slate-800">₹{booking.servicePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Convenience Fee</span>
                <span className="font-semibold text-slate-800">₹{booking.platformFee}</span>
              </div>
              {booking.isEmergency && (
                <div className="flex justify-between text-amber-600 font-medium">
                  <span>Emergency Surcharge</span>
                  <span>₹150</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="text-primary-600 text-base">₹{booking.totalPrice}</span>
              </div>
              <div className="pt-2 flex justify-between items-center text-xs">
                <span>Payment Status:</span>
                <Badge variant={isPaid ? 'success' : 'warning'} size="sm">
                  {isPaid ? '✓ Paid' : 'Pending Payment'}
                </Badge>
              </div>
            </div>

            {!isPaid && (
              <Button
                variant="success"
                size="lg"
                className="w-full"
                onClick={() => setPaymentModalOpen(true)}
              >
                Pay Now with Razorpay
              </Button>
            )}
          </div>

          {/* Safety & Cancellation Actions */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Help & Support</h4>
            {canCancel && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="w-full text-left text-xs font-semibold text-rose-600 hover:text-rose-700 py-1.5 block"
              >
                Cancel Appointment
              </button>
            )}
            <button
              onClick={() => setDisputeModalOpen(true)}
              className="w-full text-left text-xs font-semibold text-amber-700 hover:text-amber-800 py-1.5 block"
            >
              Report an Issue / Open Dispute
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModalOpen && (
        <PaymentModal
          isOpen={true}
          onClose={() => setPaymentModalOpen(false)}
          booking={booking}
          onPaymentSuccess={() => {
            refetch();
            setPaymentModalOpen(false);
          }}
        />
      )}

      {/* Cancel Modal */}
      <Modal isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)} title="Cancel Appointment">
        <div className="space-y-4">
          <p className="text-xs text-slate-500">Are you sure you want to cancel this booking?</p>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Cancellation</label>
            <select
              value={cancellationReason}
              onChange={e => setCancellationReason(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-primary-500"
            >
              <option value="Change of plans">Change of plans</option>
              <option value="Technician delayed">Technician delayed</option>
              <option value="Found alternative solution">Found alternative solution</option>
              <option value="Price concerns">Price concerns</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setCancelModalOpen(false)}>Keep Booking</Button>
            <Button variant="danger" size="sm" onClick={handleCancelBooking}>Confirm Cancellation</Button>
          </div>
        </div>
      </Modal>

      {/* Dispute Modal */}
      <Modal isOpen={disputeModalOpen} onClose={() => setDisputeModalOpen(false)} title="Open Dispute Case">
        <form onSubmit={handleSubmitDispute} className="space-y-4">
          <p className="text-xs text-slate-500">
            FixNear Admin investigates all complaints directly. If the work was unsatisfactory or technician did not complete the job, we ensure prompt resolution and refund.
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Dispute</label>
            <select
              value={disputeReason}
              onChange={e => setDisputeReason(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none"
            >
              <option value="Service not completed">Service not completed</option>
              <option value="Poor workmanship / issue recurred">Poor workmanship / issue recurred</option>
              <option value="Incorrect charges / billing issue">Incorrect charges / billing issue</option>
              <option value="Provider did not arrive">Provider did not arrive</option>
              <option value="Damage caused during repair">Damage caused during repair</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description of Issue</label>
            <textarea
              rows={3}
              value={disputeDescription}
              onChange={e => setDisputeDescription(e.target.value)}
              placeholder="Provide details about what happened..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setDisputeModalOpen(false)}>Cancel</Button>
            <Button variant="danger" size="sm" type="submit" isLoading={isSubmittingDispute}>Submit Dispute</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
