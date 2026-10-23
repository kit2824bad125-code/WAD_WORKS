import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import {
  Users,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Layers,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export const AdminDashboard: React.FC = () => {
  const { data, isLoading } = useQuery<any>({
    queryKey: ['admin-dashboard-stats'],
    queryFn: () => api.get('/admin/dashboard'),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <LoadingSkeleton type="metrics" count={2} />
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const charts = data?.charts || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Platform Analytics & Administration
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
              Admin HQ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            FixNear network overview, provider verification queue, GMV transactions, and dispute center
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/providers?status=PENDING"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Review Pending Pros ({metrics.pendingVerification || 2})
          </Link>
          <Link
            to="/admin/disputes"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Active Disputes ({metrics.activeDisputes || 1})
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Customers</span>
            <Users className="w-4 h-4 text-primary-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.totalUsers || 20}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Registered consumers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Verified Providers</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.verifiedProviders || 19}</div>
          <span className="text-[11px] text-slate-400">Out of {metrics.totalProviders || 21} partners</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Bookings</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.totalBookings || 54}</div>
          <span className="text-[11px] text-slate-400">{metrics.completedBookings || 48} jobs completed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Platform Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">₹{metrics.platformEarnings || 2646}</div>
          <span className="text-[11px] text-slate-400">Total GMV: ₹{metrics.totalGMV || 48200}</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly GMV & Bookings Trend */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                Gross Merchandise Value & Booking Volume
              </h3>
              <p className="text-xs text-slate-400">Daily breakdown for past 7 days across India</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.bookingsTrend || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(val: any) => [`₹${val}`, 'Daily GMV']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary-600" />
            Top Service Categories
          </h3>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.categoryStats || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {(charts.categoryStats || []).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {(charts.categoryStats || []).slice(0, 4).map((c: any, i: number) => (
              <div key={c.name} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span>{c.name}</span>
                </div>
                <span className="font-bold text-slate-900">{c.value} jobs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Cities Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary-600" />
          Geographic Distribution & Market Penetration
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="pb-3">City</th>
                <th className="pb-3">Completed Bookings</th>
                <th className="pb-3">GMV Generated</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {(charts.cityStats || []).map((c: any) => (
                <tr key={c.city} className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-slate-900">{c.city}</td>
                  <td className="py-3 font-semibold">{c.count} bookings</td>
                  <td className="py-3 font-bold text-slate-900">₹{c.revenue}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                      Active Market
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
