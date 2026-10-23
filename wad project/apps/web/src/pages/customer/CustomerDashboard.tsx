import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Booking, Favorite } from '@fixnear/shared';
import { BookingCard } from '../../components/domain/BookingCard';
import { ProviderCard } from '../../components/domain/ProviderCard';
import { PaymentModal } from '../../components/domain/PaymentModal';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Zap,
  ArrowRight,
  Sparkles,
  Heart,
  Search,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payingBooking, setPayingBooking] = useState<Booking | null>(null);

  const { data: bookings = [], isLoading: loadingBookings, refetch } = useQuery<Booking[]>({
    queryKey: ['customer-bookings'],
    queryFn: () => api.get('/bookings'),
  });

  const { data: favorites = [] } = useQuery<Favorite[]>({
    queryKey: ['customer-favorites'],
    queryFn: () => api.get('/favorites'),
  });

  // Active bookings: CONFIRMED, EN_ROUTE, ARRIVED, IN_PROGRESS
  const activeBookings = bookings.filter(b =>
    ['CONFIRMED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
  );

  // Pending requests: PENDING, ACCEPTED
  const pendingBookings = bookings.filter(b => ['PENDING', 'ACCEPTED'].includes(b.status));

  // Completed bookings
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Hello, {user?.name || 'Homeowner'}! 👋
          </h1>
          <p className="text-sm text-slate-500">
            Welcome to your FixNear customer hub. Track live jobs and manage upcoming home visits.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          icon={<Search className="w-4 h-4" />}
          onClick={() => navigate('/providers')}
        >
          Book a Service
        </Button>
      </div>

      {/* Primary Active Booking Spotlight (if any active job exists) */}
      {activeBookings.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-600 animate-ping" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Active Job in Progress
            </h2>
          </div>

          <div className="bg-gradient-to-r from-primary-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs uppercase font-bold text-primary-300 tracking-wider">
                  Status: {activeBookings[0].status.replace('_', ' ')}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {activeBookings[0].service?.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Technician: {activeBookings[0].provider?.businessName} ({activeBookings[0].provider?.user?.phone || 'Contactable via chat'})
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/customer/bookings/${activeBookings[0].id}`}
                  className="px-5 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  Track Technician Live <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm space-y-1">
                <span className="text-slate-400 block">Appointment Slot</span>
                <span className="font-semibold text-white">
                  {new Date(activeBookings[0].scheduledAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} at{' '}
                  {new Date(activeBookings[0].scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm space-y-1">
                <span className="text-slate-400 block">Service Address</span>
                <span className="font-semibold text-white truncate block">
                  {activeBookings[0].street}, {activeBookings[0].city}
                </span>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm space-y-1">
                <span className="text-slate-400 block">Total Amount</span>
                <span className="font-semibold text-white text-sm">
                  ₹{activeBookings[0].totalPrice} ({activeBookings[0].payment?.status === 'PAID' ? '✓ Paid' : 'Payment on completion'})
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bookings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Bookings */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Your Appointments</h2>
            <Link to="/customer/bookings" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
              View All ({bookings.length})
            </Link>
          </div>

          {loadingBookings ? (
            <LoadingSkeleton type="card" count={3} />
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={<Calendar className="w-8 h-8" />}
              title="You don't have any bookings yet."
              description="Browse our trusted local electricians, plumbers, and mechanics to schedule your first visit."
              actionText="Find Services"
              onAction={() => navigate('/services')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.slice(0, 4).map(b => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  userRole="CUSTOMER"
                  onPayNow={booking => setPayingBooking(booking)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Saved Providers & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Saved Providers Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                Favorite Professionals
              </h3>
              <Link to="/customer/favorites" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                View All
              </Link>
            </div>

            {favorites.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                You haven't saved any professionals yet. Click the heart icon on any provider profile to bookmark them.
              </p>
            ) : (
              <div className="space-y-3">
                {favorites.slice(0, 3).map(fav => (
                  <Link
                    key={fav.id}
                    to={`/providers/${fav.providerId}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{fav.provider?.businessName}</h4>
                      <p className="text-[11px] text-slate-500">⭐ {fav.provider?.rating.toFixed(1)} • {fav.provider?.address?.city}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Emergency Service Banner */}
          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              Need Urgent Help?
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Burst pipes, power cuts, or vehicle breakdowns? Filter for "Emergency Ready" technicians for 30-minute rapid arrival.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-white text-amber-900 border-amber-300 hover:bg-amber-100"
              onClick={() => navigate('/providers?emergencyOnly=true')}
            >
              Browse Emergency Pros
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {payingBooking && (
        <PaymentModal
          isOpen={true}
          onClose={() => setPayingBooking(null)}
          booking={payingBooking}
          onPaymentSuccess={() => {
            refetch();
            setPayingBooking(null);
          }}
        />
      )}
    </div>
  );
};
