import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { User } from '@fixnear/shared';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Shield, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, refetch } = useQuery<User[]>({
    queryKey: ['admin-users-list'],
    queryFn: () => api.get('/admin/users'),
  });

  const suspendMutation = useMutation({
    mutationFn: (userId: string) => api.patch(`/admin/users/${userId}/suspend`),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Registered Users Directory
        </h1>
        <p className="text-xs text-slate-500">
          Consumer and service provider accounts with audit status and suspension tools
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="p-4">
                    <Badge variant={u.role === 'ADMIN' ? 'indigo' : u.role === 'SERVICE_PROVIDER' ? 'success' : 'primary'}>
                      {u.role.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="p-4 font-mono">{u.phone || '—'}</td>
                  <td className="p-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => suspendMutation.mutate(u.id)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700"
                      >
                        Toggle Suspension
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
