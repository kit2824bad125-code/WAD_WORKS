import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Category } from '@fixnear/shared';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Wrench');

  const { data: categories = [], isLoading, refetch } = useQuery<Category[]>({
    queryKey: ['admin-categories-list'],
    queryFn: () => api.get('/categories?all=true'),
  });

  const saveMutation = useMutation({
    mutationFn: (catData: any) => {
      if (editingCategory) {
        return api.patch(`/categories/${editingCategory.id}`, catData);
      }
      return api.post('/categories', catData);
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['admin-categories-list'] });
      setModalOpen(false);
      setEditingCategory(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['admin-categories-list'] });
    },
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setIconName('Wrench');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setIconName(cat.iconName);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      iconName,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Service Categories Management
          </h1>
          <p className="text-xs text-slate-500">
            Create, edit, activate/deactivate database-driven categories across the marketplace.
          </p>
        </div>

        <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />} onClick={handleOpenCreate}>
          Add New Category
        </Button>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Category Name & Slug</th>
                <th className="p-4">Description</th>
                <th className="p-4">Icon</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{cat.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">/services/{cat.slug}</div>
                  </td>
                  <td className="p-4 max-w-sm text-slate-600 line-clamp-2">
                    {cat.description}
                  </td>
                  <td className="p-4 font-mono font-semibold text-primary-600">
                    {cat.iconName}
                  </td>
                  <td className="p-4">
                    <Badge variant={cat.isActive ? 'success' : 'neutral'}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-slate-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(cat.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Category Edit/Create Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Category Title</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Slug (URL identifier)</label>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="e.g. electrical"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Save Category</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
