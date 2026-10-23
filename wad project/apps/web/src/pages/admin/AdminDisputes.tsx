import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Dispute } from '@fixnear/shared';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { AlertCircle, CheckCircle2, ShieldAlert, DollarSign } from 'lucide-react';

export const AdminDisputes: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionText, setResolutionText] = useState('Full refund approved after inspecting evidence.');
  const [refundAmount, setRefundAmount] = useState(1800);

  const { data: disputes = [], isLoading, refetch } = useQuery<Dispute[]>({
    queryKey: ['admin-disputes'],
    queryFn: () => api.get('/disputes'),
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, status, resolution, refundAmount }: any) =>
      api.patch(`/disputes/${id}/resolve`, { status, resolution, refundAmount }),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['admin-disputes'] });
      setSelectedDispute(null);
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Dispute Resolution Center
        </h1>
        <p className="text-xs text-slate-500">
          Arbitrate customer disputes, examine proof of service, and issue refunds
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : disputes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
          <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-2" />
          <p className="font-bold text-slate-800">All clear!</p>
          <p className="text-xs">No active dispute complaints are currently open.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map(d => (
            <div
              key={d.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <h3 className="text-base font-bold text-slate-900">
                    {d.reason}
                  </h3>
                  <Badge variant={d.status === 'RESOLVED' ? 'success' : 'warning'}>
                    {d.status}
                  </Badge>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Case ID: #{d.id} • Booking: #{d.bookingId}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl text-xs text-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Raised By:</span>
                  <span className="font-bold text-slate-900">{d.raisedBy?.name || d.raisedById}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Date Opened:</span>
                  <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-800 pt-1 leading-relaxed border-t border-slate-200/60 font-medium">
                  "{d.description}"
                </p>
              </div>

              {/* Evidence image preview */}
              {d.evidenceImages && d.evidenceImages.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Customer Submitted Evidence:
                  </span>
                  <div className="flex gap-3">
                    {d.evidenceImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Evidence"
                        className="w-24 h-24 rounded-xl object-cover border border-slate-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Resolution details if already resolved */}
              {d.resolution && (
                <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800">
                  <strong>Resolution:</strong> {d.resolution}
                </div>
              )}

              {d.status === 'OPEN' && (
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      resolveMutation.mutate({
                        id: d.id,
                        status: 'REJECTED',
                        resolution: 'Dispute closed after evidence inspection found work met standard specifications.',
                      })
                    }
                  >
                    Dismiss Dispute
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => setSelectedDispute(d)}
                  >
                    Resolve with Customer Refund
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resolution Modal */}
      {selectedDispute && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDispute(null)}
          title={`Resolve Dispute: Case #${selectedDispute.id}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-500">
              Issuing a resolution will notify both the customer and provider, and update the payment escrow status.
            </p>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Refund Amount (₹ INR)</label>
              <input
                type="number"
                value={refundAmount}
                onChange={e => setRefundAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Resolution Explanation</label>
              <textarea
                rows={3}
                value={resolutionText}
                onChange={e => setResolutionText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedDispute(null)}>Cancel</Button>
              <Button
                variant="success"
                size="sm"
                onClick={() =>
                  resolveMutation.mutate({
                    id: selectedDispute.id,
                    status: 'RESOLVED',
                    resolution: resolutionText,
                    refundAmount,
                  })
                }
              >
                Confirm Resolution & Refund
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
