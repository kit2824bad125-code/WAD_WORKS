import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { ProviderProfile } from '@fixnear/shared';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ShieldCheck, XCircle, AlertTriangle, Eye, FileText, CheckCircle2, UserCheck } from 'lucide-react';

export const AdminProviders: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';

  const [activeTab, setActiveTab] = useState<string>(initialStatus);
  const [selectedProvider, setSelectedProvider] = useState<ProviderProfile | null>(null);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [actionComment, setActionComment] = useState('');

  const { data: providers = [], isLoading, refetch } = useQuery<ProviderProfile[]>({
    queryKey: ['admin-providers-list'],
    queryFn: () => api.get('/admin/providers'),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, status, comment }: { id: string; status: string; comment?: string }) =>
      api.patch(`/admin/providers/${id}/verify`, { status, comment }),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['admin-providers-list'] });
      setVerificationModalOpen(false);
      setSelectedProvider(null);
    },
  });

  const filtered = providers.filter(p => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return p.status === 'PENDING' || p.status === 'UNDER_REVIEW';
    if (activeTab === 'VERIFIED') return p.status === 'VERIFIED';
    if (activeTab === 'SUSPENDED') return p.status === 'SUSPENDED';
    return true;
  });

  const handleOpenReview = (p: ProviderProfile) => {
    setSelectedProvider(p);
    setActionComment('');
    setVerificationModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Service Provider Management & Verification
          </h1>
          <p className="text-xs text-slate-500">
            Inspect identity documents, police background clearances, and approve tradesmen to accept live bookings.
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        {['ALL', 'PENDING', 'VERIFIED', 'SUSPENDED'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === tab
                ? 'bg-primary-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab === 'PENDING' ? 'Pending Review' : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Provider / Business</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Rating & Jobs</th>
                  <th className="p-4">Verification Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.user?.avatarUrl || `https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=100`}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{p.businessName}</div>
                          <div className="text-[11px] text-slate-400">{p.user?.name} • {p.user?.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-slate-800">{p.address?.city}</div>
                      <div className="text-[11px] text-slate-400">{p.address?.state} (Radius: {p.serviceRadiusKm} km)</div>
                    </td>

                    <td className="p-4 font-semibold text-slate-800">
                      {p.experienceYears}+ years
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900">⭐ {p.rating.toFixed(1)} ({p.reviewCount})</div>
                      <div className="text-[11px] text-slate-400">{p.completedJobsCount} jobs completed</div>
                    </td>

                    <td className="p-4">
                      <Badge
                        variant={
                          p.status === 'VERIFIED'
                            ? 'success'
                            : p.status === 'PENDING' || p.status === 'UNDER_REVIEW'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>

                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => handleOpenReview(p)}
                      >
                        Review Documents
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedProvider && (
        <Modal
          isOpen={verificationModalOpen}
          onClose={() => setVerificationModalOpen(false)}
          title={`Verify Partner: ${selectedProvider.businessName}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs text-slate-700">
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Applicant Name:</span>
                <span className="font-bold text-slate-900">{selectedProvider.user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Business Title:</span>
                <span className="font-bold text-slate-900">{selectedProvider.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Email & Contact:</span>
                <span>{selectedProvider.user?.email} ({selectedProvider.user?.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Service Coverage:</span>
                <span>{selectedProvider.address?.city} ({selectedProvider.serviceRadiusKm} km radius)</span>
              </div>
            </div>

            {/* Document inspection */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Uploaded Verification Documents
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="font-semibold text-slate-700 block">1. Government Identity (Aadhaar/PAN)</span>
                  <img
                    src={selectedProvider.identityDocumentUrl || 'https://images.unsplash.com/photo-1618042164219-62c820f10723?w=400'}
                    alt="Identity Document"
                    className="w-full h-32 object-cover rounded-lg border border-slate-200"
                  />
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="font-semibold text-slate-700 block">2. Trade License / Certificate</span>
                  <img
                    src={selectedProvider.licenseDocumentUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400'}
                    alt="Trade License"
                    className="w-full h-32 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Audit Notes / Rationale
              </label>
              <textarea
                rows={2}
                value={actionComment}
                onChange={e => setActionComment(e.target.value)}
                placeholder="Reason for approval, rejection, or suspension..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button
                variant="danger"
                size="sm"
                onClick={() =>
                  verifyMutation.mutate({
                    id: selectedProvider.id,
                    status: 'SUSPENDED',
                    comment: actionComment || 'Account suspended by admin',
                  })
                }
              >
                Suspend Account
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    verifyMutation.mutate({
                      id: selectedProvider.id,
                      status: 'REJECTED',
                      comment: actionComment || 'Credentials rejected',
                    })
                  }
                >
                  Reject
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() =>
                    verifyMutation.mutate({
                      id: selectedProvider.id,
                      status: 'VERIFIED',
                      comment: actionComment || 'Credentials and identity verified',
                    })
                  }
                >
                  Approve & Verify Partner
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
