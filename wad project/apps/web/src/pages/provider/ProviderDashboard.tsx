import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Booking } from '@fixnear/shared';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Briefcase,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  AlertCircle,
  Calendar,
  Zap,
  ArrowRight,
  TrendingUp,
  User,
  Power,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, providerProfile, refreshUser } = useAuth();
  const [isAvailable, setIsAvailable] = useState(providerProfile?.isAvailable ?? true);

  const { data: bookings = [], isLoading, refetch } = useQuery<Booking[]>({
    queryKey: ['provider-bookings'],
    queryFn: () => api.get('/bookings'),
  });

  const { data: earningsData } = useQuery<any>({
    queryKey: ['provider-earnings'],
    queryFn: () => api.get('/providers/earnings'),
  });

  // Toggle availability
  const toggleOnlineMutation = useMutation({
    mutationFn: () => api.patch('/providers/availability/toggle'),
    onSuccess: (res: any) => {
      setIsAvailable(res.isAvailable);
      refreshUser();
    },
  });

  // Accept/reject mutation
  const respondRequestMutation = useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: string }) =>
      api.patch(`/bookings/${bookingId}/status`, { status }),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['provider-bookings'] });
    },
  });

  const pendingRequests = bookings.filter(b => b.status === 'PENDING');
  const activeBookings = bookings.filter(b =>
    ['CONFIRMED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
  );
  const completedJobs = bookings.filter(b => b.status === 'COMPLETED');

  // Chart data
  const chartData = [
    { day: 'Mon', jobs: 3, earnings: 1450 },
    { day: 'Tue', jobs: 5, earnings: 2400 },
    { day: 'Wed', jobs: 4, earnings: 1950 },
    { day: 'Thu', jobs: 6, earnings: 3100 },
    { day: 'Fri', jobs: 7, earnings: 3800 },
    { day: 'Sat', jobs: 8, earnings: 4400 },
    { day: 'Sun', jobs: 4, earnings: 2100 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner with Online/Offline Toggle */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {providerProfile?.businessName || user?.name}
            </h1>
            {providerProfile?.status === 'VERIFIED' ? (
              <Badge variant="success" size="sm">Verified Partner</Badge>
            ) : (
              <Badge variant="warning" size="sm">Status: {providerProfile?.status || 'PENDING'}</Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Doorstep service provider dashboard • Managing bookings and live requests
          </p>
        </div>

        {/* Live Availability Toggle Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleOnlineMutation.mutate()}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs shadow-sm transition-all ${
              isAvailable
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            <Power className="w-4 h-4" />
            {isAvailable ? 'Online & Accepting Jobs' : 'Offline / On Break'}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pending Requests</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{pendingRequests.length}</div>
          <span className="text-[11px] text-amber-600 font-semibold">Requires immediate response</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Appointments</span>
            <Briefcase className="w-4 h-4 text-primary-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeBookings.length}</div>
          <span className="text-[11px] text-slate-400">Scheduled / in progress</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Net Monthly Earnings</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            ₹{earningsData?.netEarnings || '19,250'}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Daily automated payouts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Average Rating</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {providerProfile?.rating ? providerProfile.rating.toFixed(1) : '4.9'}
          </div>
          <span className="text-[11px] text-slate-400">
            From {providerProfile?.reviewCount || 140}+ customer reviews
          </span>
        </div>
      </div>

      {/* Pending Requests Spotlight */}
      {pendingRequests.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
              <h2 className="text-lg font-bold text-amber-900">
                New Customer Requests ({pendingRequests.length})
              </h2>
            </div>
            <span className="text-xs text-amber-700">Prompt responses maintain your 99% ranking score</span>
          </div>

          <div className="divide-y divide-amber-200/60">
            {pendingRequests.map(req => (
              <div key={req.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{req.service?.name}</h4>
                    {req.isEmergency && (
                      <Badge variant="warning" size="sm">⚡ Urgent Emergency</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">
                    Customer: <span className="font-semibold text-slate-800">{req.customer?.name}</span> • {req.street}, {req.city}
                  </p>
                  <p className="text-xs text-slate-500">
                    Slot: {new Date(req.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                    {new Date(req.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-slate-700 italic bg-white/70 p-2 rounded-lg">
                    "{req.problemDescription}"
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 sm:flex-none text-rose-600 border-rose-200 hover:bg-rose-50"
                    onClick={() => respondRequestMutation.mutate({ bookingId: req.id, status: 'REJECTED' })}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    className="flex-1 sm:flex-none"
                    onClick={() => respondRequestMutation.mutate({ bookingId: req.id, status: 'ACCEPTED' })}
                  >
                    Accept Request
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Weekly Performance Chart & Active Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Weekly chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              Weekly Bookings & Earnings
            </h3>
            <span className="text-xs text-slate-400">Past 7 days</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(val: any) => [`₹${val}`, 'Revenue']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="earnings" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Quick Navigation Links */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Partner Controls</h3>
            <div className="space-y-2 text-xs">
              <Link
                to="/provider/bookings"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-slate-900">All Active & Past Bookings</h4>
                  <p className="text-slate-500">Update status, travel live, complete work</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/provider/services"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-slate-900">Services & Rate Cards</h4>
                  <p className="text-slate-500">Add services, edit prices, set quotes</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/provider/availability"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-slate-900">Working Hours & Radius</h4>
                  <p className="text-slate-500">Weekly schedule (09:00 - 18:00), emergency toggle</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/provider/earnings"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-slate-900">Payouts & Financials</h4>
                  <p className="text-slate-500">Completed jobs, platform fees, bank account</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
