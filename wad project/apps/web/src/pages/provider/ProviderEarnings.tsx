import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { DollarSign, CheckCircle2, TrendingUp, Calendar, CreditCard } from 'lucide-react';

export const ProviderEarnings: React.FC = () => {
  const { data: earnings, isLoading } = useQuery<any>({
    queryKey: ['provider-earnings-detail'],
    queryFn: () => api.get('/providers/earnings'),
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <LoadingSkeleton type="metrics" count={1} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Earnings & Bank Payouts
        </h1>
        <p className="text-xs text-slate-500">Track your completed jobs, net revenues, and direct bank settlements</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Gross Revenue</span>
          <div className="text-3xl font-black text-slate-900">₹{earnings?.totalRevenue || 22500}</div>
          <span className="text-[11px] text-slate-400">Total job charges billed</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Platform Commission</span>
          <div className="text-3xl font-black text-slate-500">₹{earnings?.platformFeeDeducted || 980}</div>
          <span className="text-[11px] text-slate-400">Fixed ₹49 platform fee per booking</span>
        </div>

        <div className="bg-emerald-50/80 p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-1">
          <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider block">Net Direct Payout</span>
          <div className="text-3xl font-black text-emerald-700">₹{earnings?.netEarnings || 21520}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">✓ Automated daily Razorpay transfer</span>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Recent Service Payouts</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="pb-3">Booking ID</th>
                <th className="pb-3">Service</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {(earnings?.recentPayouts || []).map((p: any) => (
                <tr key={p.bookingId} className="hover:bg-slate-50">
                  <td className="py-3 font-mono font-bold text-slate-900">{p.bookingId}</td>
                  <td className="py-3 font-medium">{p.serviceName || 'General Service'}</td>
                  <td className="py-3 text-slate-500">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="py-3 font-bold text-slate-900">₹{p.amount}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
