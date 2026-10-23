import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/ui/Button';
import { Bell, CheckCheck, Calendar, ShieldCheck, CreditCard, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerNotifications: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();

  const getNotifIcon = (type: string) => {
    if (type.includes('BOOKING')) return <Calendar className="w-4 h-4 text-primary-600" />;
    if (type.includes('PAYMENT')) return <CreditCard className="w-4 h-4 text-emerald-600" />;
    if (type.includes('MESSAGE')) return <MessageSquare className="w-4 h-4 text-indigo-600" />;
    return <Bell className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-xs text-slate-500">Live booking updates, technician arrival alerts, and receipts</p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" icon={<CheckCheck className="w-4 h-4" />} onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Bell className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-semibold">No notifications yet</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                !n.isRead ? 'bg-primary-50/40' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  {getNotifIcon(n.type)}
                </div>
                <div className="space-y-0.5">
                  <h4 className={`text-xs ${!n.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                    {n.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {!n.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-primary-600 flex-shrink-0 mt-1" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
