import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Service } from '@fixnear/shared';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Wrench, CheckCircle2 } from 'lucide-react';

export const ProviderServices: React.FC = () => {
  const { providerProfile } = useAuth();
  const [savedMessage, setSavedMessage] = useState(false);

  const { data: allServices = [], isLoading } = useQuery<Service[]>({
    queryKey: ['all-standard-services'],
    queryFn: () => api.get('/services'),
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Services Offered & Rate Card
        </h1>
        <p className="text-xs text-slate-500">Configure your standard diagnostic fees and custom hourly rates</p>
      </div>

      {savedMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl font-medium">
          Service rate cards updated successfully!
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
          {allServices.slice(0, 8).map(s => (
            <div key={s.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-lg">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{s.name}</h3>
                  <Badge variant="primary" size="sm">{s.pricingType.replace('_', ' ')}</Badge>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{s.description}</p>
                <span className="text-[11px] text-slate-400">Duration: ~{s.estimatedDurationMinutes} mins</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Base Price</span>
                  <span className="text-base font-black text-slate-900">₹{s.basePrice}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSavedMessage(true);
                    setTimeout(() => setSavedMessage(false), 2500);
                  }}
                >
                  Enabled
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
