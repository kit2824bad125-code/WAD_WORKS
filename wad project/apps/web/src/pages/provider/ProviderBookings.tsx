import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Booking } from '@fixnear/shared';
import { BookingCard } from '../../components/domain/BookingCard';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Briefcase } from 'lucide-react';

export const ProviderBookings: React.FC = () => {
  const [filterTab, setFilterTab] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'COMPLETED'>('ALL');

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['provider-all-bookings'],
    queryFn: () => api.get('/bookings'),
  });

  const filtered = bookings.filter(b => {
    if (filterTab === 'ALL') return true;
    if (filterTab === 'ACTIVE') return ['CONFIRMED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS'].includes(b.status);
    if (filterTab === 'PENDING') return b.status === 'PENDING' || b.status === 'ACCEPTED';
    if (filterTab === 'COMPLETED') return b.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Assigned Service Bookings
        </h1>
        <p className="text-xs text-slate-500">Track and progress job statuses from confirmation to doorstep completion</p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        {(['ALL', 'ACTIVE', 'PENDING', 'COMPLETED'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2 rounded-xl transition-all ${
              filterTab === tab
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
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-8 h-8" />}
          title="No bookings in this category"
          description="New incoming booking requests will automatically appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(b => (
            <BookingCard key={b.id} booking={b} userRole="SERVICE_PROVIDER" />
          ))}
        </div>
      )}
    </div>
  );
};
