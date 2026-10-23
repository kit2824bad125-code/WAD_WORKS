import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Booking, BookingStatus } from '@fixnear/shared';
import { StatusTimeline } from '../../components/domain/StatusTimeline';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import {
  ArrowLeft,
  CheckCircle2,
  Navigation,
  Wrench,
  Clock,
  Phone,
  MessageSquare,
  FileText,
  Camera,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

export const ProviderBookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState(1200);
  const [quoteDesc, setQuoteDesc] = useState('Includes replacement motor capacitor, jet foam cleaning, and pressure testing.');
  const [completionImageUrl, setCompletionImageUrl] = useState('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500');

  const { data: booking, isLoading, refetch } = useQuery<Booking & { timeline: any[] }>({
    queryKey: ['provider-booking-detail', id],
    queryFn: () => api.get(`/bookings/${id}`),
    refetchInterval: 5000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: { status: BookingStatus; comment?: string; completionImages?: string[] }) =>
      api.patch(`/bookings/${id}/status`, data),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['provider-booking-detail', id] });
    },
  });

  const sendQuoteMutation = useMutation({
    mutationFn: () => api.post(`/bookings/${id}/quote`, { estimatedAmount: Number(quoteAmount), description: quoteDesc }),
    onSuccess: () => {
      setQuoteModalOpen(false);
      refetch();
    },
  });

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
        <Button variant="primary" onClick={() => navigate('/provider/bookings')}>Back to Bookings</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div>
        <Link to="/provider/bookings" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Assigned Bookings
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {booking.service?.name}
              </h1>
              <Badge variant={booking.status === 'COMPLETED' ? 'success' : 'primary'}>
                {booking.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1">Booking Ref: #{booking.id}</p>
          </div>

          <Link
            to={`/provider/messages?bookingId=${booking.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-50 text-primary-700 text-xs font-bold hover:bg-primary-100 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Chat with Customer
          </Link>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Live Service State Machine</h3>
        <StatusTimeline currentStatus={booking.status} timeline={booking.timeline} />
      </div>

      {/* Workflow Action Bar (The heart of the provider workflow!) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Next Job Step
          </span>
          <span className="text-xs text-slate-400">Customer will be alerted instantly via push & SMS</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {booking.status === 'PENDING' && (
            <>
              <Button
                variant="success"
                size="lg"
                onClick={() => updateStatusMutation.mutate({ status: 'ACCEPTED', comment: 'Provider accepted request' })}
              >
                Accept Request
              </Button>
              <Button
                variant="danger"
                size="lg"
                onClick={() => updateStatusMutation.mutate({ status: 'REJECTED', comment: 'Technician unavailable' })}
              >
                Reject Request
              </Button>
            </>
          )}

          {booking.status === 'ACCEPTED' && (
            <Button
              variant="primary"
              size="lg"
              onClick={() => updateStatusMutation.mutate({ status: 'CONFIRMED', comment: 'Schedule confirmed' })}
            >
              Confirm Appointment Slot
            </Button>
          )}

          {booking.status === 'CONFIRMED' && (
            <Button
              variant="primary"
              size="lg"
              icon={<Navigation className="w-4 h-4" />}
              onClick={() => updateStatusMutation.mutate({ status: 'EN_ROUTE', comment: 'Technician is traveling to customer location' })}
            >
              Start Travel (Mark En Route)
            </Button>
          )}

          {booking.status === 'EN_ROUTE' && (
            <Button
              variant="primary"
              size="lg"
              icon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => updateStatusMutation.mutate({ status: 'ARRIVED', comment: 'Technician has arrived at doorstep' })}
            >
              I Have Arrived at Doorstep
            </Button>
          )}

          {booking.status === 'ARRIVED' && (
            <Button
              variant="primary"
              size="lg"
              icon={<Wrench className="w-4 h-4" />}
              onClick={() => updateStatusMutation.mutate({ status: 'IN_PROGRESS', comment: 'Commencing repair work' })}
            >
              Commence Service Work
            </Button>
          )}

          {booking.status === 'IN_PROGRESS' && (
            <Button
              variant="success"
              size="lg"
              icon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => setCompleteModalOpen(true)}
            >
              Complete Service & Final Bill
            </Button>
          )}

          {/* Option to send quote if quote-based */}
          {!booking.quote && ['PENDING', 'ACCEPTED', 'CONFIRMED', 'ARRIVED'].includes(booking.status) && (
            <Button
              variant="outline"
              size="lg"
              className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
              icon={<FileText className="w-4 h-4" />}
              onClick={() => setQuoteModalOpen(true)}
            >
              Send Custom Quote
            </Button>
          )}

          {booking.status === 'COMPLETED' && (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5" /> Job is fully completed and registered for payout!
            </div>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Customer info */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Customer Contact & Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="bg-slate-50 p-3.5 rounded-xl space-y-1">
                <span className="text-slate-400 block font-semibold">Customer Name</span>
                <span className="text-sm font-bold text-slate-900">{booking.customer?.name}</span>
                <p className="text-slate-500">{booking.customer?.email}</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl space-y-1">
                <span className="text-slate-400 block font-semibold">Contact Number</span>
                <span className="text-sm font-bold text-slate-900">{booking.contactPhone}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl space-y-1 text-xs">
              <span className="text-slate-400 block font-semibold">Doorstep Navigation Address</span>
              <span className="text-sm font-bold text-slate-900 block">
                {booking.street}, {booking.city}, {booking.state} - {booking.postalCode}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl space-y-1 text-xs">
              <span className="text-slate-400 block font-semibold">Reported Problem</span>
              <p className="text-slate-700 leading-relaxed font-medium">{booking.problemDescription}</p>
            </div>
          </div>
        </div>

        {/* Right column: Earnings & payout */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Payout Breakdown</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Service Charge</span>
                <span className="font-semibold text-slate-900">₹{booking.servicePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee (retained by FixNear)</span>
                <span className="font-semibold text-slate-900">₹{booking.platformFee}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-bold text-emerald-600">
                <span>Your Net Payout</span>
                <span className="text-base">₹{booking.servicePrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      <Modal isOpen={completeModalOpen} onClose={() => setCompleteModalOpen(false)} title="Complete Service & Upload Proof">
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Confirm work completion to generate the customer receipt and trigger payment settlement.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Work Completion Photo (URL)</label>
            <input
              type="url"
              value={completionImageUrl}
              onChange={e => setCompletionImageUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setCompleteModalOpen(false)}>Cancel</Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => {
                updateStatusMutation.mutate({
                  status: 'COMPLETED',
                  completionImages: [completionImageUrl],
                });
                setCompleteModalOpen(false);
              }}
            >
              Confirm Completion
            </Button>
          </div>
        </div>
      </Modal>

      {/* Quote Modal */}
      <Modal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} title="Send Estimated Quote to Customer">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Cost (₹ INR)</label>
            <input
              type="number"
              value={quoteAmount}
              onChange={e => setQuoteAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none"
              min={100}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Itemized Breakdown & Description</label>
            <textarea
              rows={3}
              value={quoteDesc}
              onChange={e => setQuoteDesc(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setQuoteModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={() => sendQuoteMutation.mutate()}>Submit Quote</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
