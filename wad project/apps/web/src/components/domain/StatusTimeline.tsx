import React from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { BookingStatus } from '@fixnear/shared';

interface TimelineStep {
  status: string;
  label: string;
  timestamp?: string;
  done: boolean;
}

interface StatusTimelineProps {
  currentStatus: BookingStatus;
  timeline?: TimelineStep[];
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus, timeline }) => {
  const defaultSteps: TimelineStep[] = [
    { status: 'PENDING', label: 'Request Submitted', done: true },
    { status: 'ACCEPTED', label: 'Provider Accepted', done: ['ACCEPTED', 'CONFIRMED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'].includes(currentStatus) },
    { status: 'CONFIRMED', label: 'Booking Confirmed', done: ['CONFIRMED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'].includes(currentStatus) },
    { status: 'EN_ROUTE', label: 'Provider En Route', done: ['EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED'].includes(currentStatus) },
    { status: 'ARRIVED', label: 'Provider Arrived', done: ['ARRIVED', 'IN_PROGRESS', 'COMPLETED'].includes(currentStatus) },
    { status: 'IN_PROGRESS', label: 'Service Started', done: ['IN_PROGRESS', 'COMPLETED'].includes(currentStatus) },
    { status: 'COMPLETED', label: 'Completed', done: currentStatus === 'COMPLETED' },
  ];

  const steps = timeline && timeline.length > 0 ? timeline : defaultSteps;

  if (currentStatus === 'CANCELLED') {
    return (
      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800">
        <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold">Booking Cancelled</p>
          <p className="text-xs text-rose-600">This service booking request was cancelled.</p>
        </div>
      </div>
    );
  }

  if (currentStatus === 'DISPUTED') {
    return (
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-800">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold">Dispute Case Open</p>
          <p className="text-xs text-amber-700">An issue was flagged for this service. FixNear Admin is actively reviewing evidence.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 -z-0 hidden sm:block" />

        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-2">
          {steps.map((step, idx) => {
            const isCurrent = step.status === currentStatus;
            return (
              <div key={idx} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center z-10 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    step.done
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100 shadow-sm'
                      : 'bg-white border-2 border-slate-300 text-slate-300'
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <p
                    className={`text-xs font-semibold ${
                      step.done
                        ? 'text-slate-900'
                        : isCurrent
                        ? 'text-primary-600 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.timestamp && (
                    <p className="text-[10px] text-slate-400">
                      {new Date(step.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
