import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Booking } from '@fixnear/shared';
import { BookingCard } from '../../components/domain/BookingCard';
import { PaymentModal } from '../../components/domain/PaymentModal';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CustomerBookings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [payingBooking, setPayingBooking] = useState<Booking | null>(null);

  const { data: bookings = [], isLoading, refetch } = useQuery<Booking[]>({
    queryKey: ['customer-all-bookings'],
    queryFn: () => api.get('/bookings'),
  });

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ACTIVE') return ['CONFIRMED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS'].includes(b.status);
    if (activeTab === 'PENDING') return ['PENDING', 'ACCEPTED'].includes(b.status);
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED' || b.status === 'REJECTED';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Service Bookings
          </h1>
          <p className="text-sm text-slate-500">
            View booking history, track active appointments, and complete payments.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs font-semibold">
        {(['ALL', 'ACTIVE', 'PENDING', 'COMPLETED', 'CANCELLED'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-primary-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-8 h-8" />}
          title={`No ${activeTab.toLowerCase()} bookings found`}
          description="Schedule a trusted professional near you in just a few clicks."
          actionText="Find Services"
          onAction={() => navigate('/services')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map(b => (
            <BookingCard
              key={b.id}
              booking={b}
              userRole="CUSTOMER"
              onPayNow={booking => setPayingBooking(booking)}
            />
          ))}
        </div>
      )}

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
