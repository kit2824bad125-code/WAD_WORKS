import React from 'react';
import { Link } from 'react-router-dom';
import { Booking, BookingStatus } from '@fixnear/shared';
import { Calendar, Clock, MapPin, ArrowRight, ShieldAlert, CreditCard, MessageSquare, Star } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface BookingCardProps {
  booking: Booking;
  userRole: 'CUSTOMER' | 'SERVICE_PROVIDER' | 'ADMIN';
  onPayNow?: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, userRole, onPayNow }) => {
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">Request Pending</Badge>;
      case 'ACCEPTED':
        return <Badge variant="primary">Accepted</Badge>;
      case 'CONFIRMED':
        return <Badge variant="indigo">Confirmed</Badge>;
      case 'EN_ROUTE':
        return <Badge variant="primary">Technician En Route</Badge>;
      case 'ARRIVED':
        return <Badge variant="primary">Technician Arrived</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="primary">Work In Progress</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      case 'DISPUTED':
        return <Badge variant="warning">Dispute Active</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const isCompleted = booking.status === 'COMPLETED';
  const isPaid = booking.payment?.status === 'PAID';
  const targetDetailLink = userRole === 'SERVICE_PROVIDER' ? `/provider/bookings/${booking.id}` : `/customer/bookings/${booking.id}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-mono text-slate-400">
            #{booking.id.substring(0, 10)}
          </span>
          {getStatusBadge(booking.status)}
        </div>

        <h4 className="text-base font-bold text-slate-900 mb-1">
          {booking.service?.name || 'Local Service'}
        </h4>

        <p className="text-xs text-slate-500 mb-3">
          {userRole === 'CUSTOMER' ? (
            <>Professional: <span className="font-semibold text-slate-700">{booking.provider?.businessName || 'Assigned Technician'}</span></>
          ) : (
            <>Customer: <span className="font-semibold text-slate-700">{booking.customer?.name || 'Customer'}</span></>
          )}
        </p>

        <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{new Date(booking.scheduledAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{booking.street}, {booking.city}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Amount</span>
          <span className="text-base font-bold text-slate-900">
            ₹{booking.totalPrice}
          </span>
          {isPaid && (
            <span className="text-[10px] text-emerald-600 font-semibold block">✓ Paid</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {userRole === 'CUSTOMER' && !isPaid && ['CONFIRMED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'].includes(booking.status) && (
            <Button
              size="sm"
              variant="success"
              icon={<CreditCard className="w-3.5 h-3.5" />}
              onClick={() => onPayNow?.(booking)}
            >
              Pay Now
            </Button>
          )}

          <Link
            to={targetDetailLink}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
          >
            Manage
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
