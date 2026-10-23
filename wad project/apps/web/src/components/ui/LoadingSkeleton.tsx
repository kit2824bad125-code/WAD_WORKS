import React from 'react';

export const LoadingSkeleton: React.FC<{
  type?: 'card' | 'list' | 'profile' | 'metrics';
  count?: number;
}> = ({ type = 'card', count = 3 }) => {
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm animate-pulse space-y-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-200 rounded-full flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-200 rounded w-1/4" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-5/6" />
          </div>
          <div className="pt-2 flex justify-between items-center border-t border-slate-100">
            <div className="h-4 bg-slate-200 rounded w-20" />
            <div className="h-8 bg-slate-200 rounded w-28" />
          </div>
        </div>
      ))}
    </div>
  );
};
