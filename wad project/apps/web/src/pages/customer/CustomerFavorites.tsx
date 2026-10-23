import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Favorite, ProviderSearchResult } from '@fixnear/shared';
import { ProviderCard } from '../../components/domain/ProviderCard';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Heart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CustomerFavorites: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery<Favorite[]>({
    queryKey: ['customer-favorites'],
    queryFn: () => api.get('/favorites'),
  });

  const removeMutation = useMutation({
    mutationFn: (providerId: string) => api.delete(`/favorites/${providerId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customer-favorites'] }),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Saved Professionals
        </h1>
        <p className="text-sm text-slate-500">
          Your bookmarked service pros for quick rebooking and easy access.
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-8 h-8 text-rose-500" />}
          title="No saved professionals yet"
          description="Browse nearby verified electricians, plumbers, and mechanics and click the heart icon to save them."
          actionText="Discover Professionals"
          onAction={() => navigate('/providers')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(fav => {
            const p = fav.provider;
            if (!p) return null;

            const searchResultFormat: ProviderSearchResult = {
              id: p.id,
              userId: p.userId,
              businessName: p.businessName,
              description: p.description,
              avatarUrl: p.user?.avatarUrl,
              rating: p.rating,
              reviewCount: p.reviewCount,
              experienceYears: p.experienceYears,
              completedJobsCount: p.completedJobsCount,
              responseRatePercent: p.responseRatePercent,
              cancellationRatePercent: p.cancellationRatePercent,
              status: p.status,
              isAvailable: p.isAvailable,
              isEmergencyAvailable: p.isEmergencyAvailable,
              distanceKm: 2.4,
              distanceScore: 0.9,
              rankingScore: 88,
              startingPrice: 299,
              services: [],
              city: p.address?.city || 'Chennai',
              state: p.address?.state || 'Tamil Nadu',
              serviceRadiusKm: p.serviceRadiusKm,
            };

            return (
              <div key={fav.id} className="relative group">
                <button
                  onClick={() => removeMutation.mutate(p.id)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 shadow-md text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ProviderCard provider={searchResultFormat} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
