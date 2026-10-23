import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { ProviderSearchResult, Category } from '@fixnear/shared';
import { ProviderCard } from '../../components/domain/ProviderCard';
import { ProviderMap } from '../../components/map/ProviderMap';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Search, MapPin, SlidersHorizontal, Star, ShieldCheck, Zap, ArrowUpDown, Map as MapIcon, List } from 'lucide-react';
import { CITIES } from '@fixnear/shared';

export const ProviderSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search filter states from URL query
  const queryParam = searchParams.get('query') || '';
  const cityParam = searchParams.get('city') || 'Chennai';
  const categoryIdParam = searchParams.get('categoryId') || '';
  const sortByParam = searchParams.get('sortBy') || 'recommended';
  const verifiedOnlyParam = searchParams.get('verifiedOnly') === 'true';
  const emergencyOnlyParam = searchParams.get('emergencyOnly') === 'true';
  const openNowParam = searchParams.get('openNow') === 'true';
  const minRatingParam = searchParams.get('minRating') || '';
  const maxDistanceKmParam = searchParams.get('maxDistanceKm') || '25';

  const [query, setQuery] = useState(queryParam);
  const [city, setCity] = useState(cityParam);
  const [categoryId, setCategoryId] = useState(categoryIdParam);
  const [sortBy, setSortBy] = useState(sortByParam);
  const [verifiedOnly, setVerifiedOnly] = useState(verifiedOnlyParam);
  const [emergencyOnly, setEmergencyOnly] = useState(emergencyOnlyParam);
  const [openNow, setOpenNow] = useState(openNowParam);
  const [minRating, setMinRating] = useState(minRatingParam);
  const [maxDistanceKm, setMaxDistanceKm] = useState(maxDistanceKmParam);
  const [selectedProviderId, setSelectedProviderId] = useState<string | undefined>(undefined);
  const [mobileViewMode, setMobileViewMode] = useState<'list' | 'map'>('list');

  // Lookup city coordinates
  const currentCityObj = CITIES.find(c => c.name.toLowerCase() === city.toLowerCase()) || CITIES[0];

  const updateSearchUrl = () => {
    const params: Record<string, string> = {};
    if (query) params.query = query;
    if (city) params.city = city;
    if (categoryId) params.categoryId = categoryId;
    if (sortBy !== 'recommended') params.sortBy = sortBy;
    if (verifiedOnly) params.verifiedOnly = 'true';
    if (emergencyOnly) params.emergencyOnly = 'true';
    if (openNow) params.openNow = 'true';
    if (minRating) params.minRating = minRating;
    if (maxDistanceKm !== '25') params.maxDistanceKm = maxDistanceKm;

    setSearchParams(params);
  };

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories-list'],
    queryFn: () => api.get('/categories'),
  });

  const { data: providerResponse, isLoading } = useQuery<{
    data: ProviderSearchResult[];
    pagination: { total: number; page: number; totalPages: number };
  }>({
    queryKey: ['providers-search', query, city, categoryId, sortBy, verifiedOnly, emergencyOnly, openNow, minRating, maxDistanceKm],
    queryFn: async () => {
      const res: any = await api.get('/search/providers', {
        query,
        city,
        categoryId,
        latitude: currentCityObj.lat,
        longitude: currentCityObj.lng,
        sortBy,
        verifiedOnly: verifiedOnly ? 'true' : undefined,
        emergencyOnly: emergencyOnly ? 'true' : undefined,
        openNow: openNow ? 'true' : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
        maxDistanceKm: parseFloat(maxDistanceKm),
        limit: 20,
      });
      return {
        data: res || [],
        pagination: { total: res?.length || 0, page: 1, totalPages: 1 },
      };
    },
  });

  const providers = providerResponse?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Query input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && updateSearchUrl()}
              placeholder="Search service name, technician or skill..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* City selector */}
          <div className="relative w-full lg:w-48">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-600" />
            <select
              value={city}
              onChange={e => {
                setCity(e.target.value);
                setTimeout(updateSearchUrl, 50);
              }}
              className="w-full pl-10 pr-6 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              {CITIES.map(c => (
                <option key={c.name} value={c.name}>
                  {c.name}, {c.state}
                </option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div className="w-full lg:w-52">
            <select
              value={categoryId}
              onChange={e => {
                setCategoryId(e.target.value);
                setTimeout(updateSearchUrl, 50);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="w-full lg:w-48">
            <select
              value={sortBy}
              onChange={e => {
                setSortBy(e.target.value);
                setTimeout(updateSearchUrl, 50);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <option value="recommended">⭐ Recommended</option>
              <option value="nearest">📍 Nearest Distance</option>
              <option value="rating">🏆 Highest Rated</option>
              <option value="price_asc">💰 Lowest Price</option>
              <option value="experience">🎖️ Most Experienced</option>
            </select>
          </div>
        </div>

        {/* Second Row: Toggle pills */}
        <div className="flex items-center justify-between gap-3 flex-wrap pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setVerifiedOnly(!verifiedOnly);
                setTimeout(updateSearchUrl, 50);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                verifiedOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Only
            </button>

            <button
              onClick={() => {
                setEmergencyOnly(!emergencyOnly);
                setTimeout(updateSearchUrl, 50);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                emergencyOnly
                  ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Emergency Available
            </button>

            <button
              onClick={() => {
                setOpenNow(!openNow);
                setTimeout(updateSearchUrl, 50);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                openNow
                  ? 'bg-primary-50 border-primary-300 text-primary-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Available Now
            </button>

            {/* Distance slider / select */}
            <div className="flex items-center gap-1.5 pl-2 text-slate-500">
              <span>Radius:</span>
              <select
                value={maxDistanceKm}
                onChange={e => {
                  setMaxDistanceKm(e.target.value);
                  setTimeout(updateSearchUrl, 50);
                }}
                className="bg-transparent border-b border-slate-300 font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="5">5 km</option>
                <option value="15">15 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
              </select>
            </div>
          </div>

          {/* Mobile view toggle */}
          <div className="lg:hidden flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMobileViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold ${
                mobileViewMode === 'list' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setMobileViewMode('map')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold ${
                mobileViewMode === 'map' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" /> Map
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Provider List */}
        <div
          className={`lg:col-span-7 space-y-4 ${
            mobileViewMode === 'map' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-900">{providers.length}</strong> service professionals in {city}
            </span>
            <span className="hidden sm:inline">
              Sorted by: <strong className="text-primary-600 capitalize">{sortBy.replace('_', ' ')}</strong>
            </span>
          </div>

          {isLoading ? (
            <LoadingSkeleton type="card" count={4} />
          ) : providers.length === 0 ? (
            <EmptyState
              icon={<Search className="w-8 h-8" />}
              title="No professionals found nearby"
              description="Try increasing your search radius, selecting a different city, or clearing some filters."
              actionText="Reset Search Radius to 50 km"
              onAction={() => {
                setMaxDistanceKm('50');
                setVerifiedOnly(false);
                setEmergencyOnly(false);
                updateSearchUrl();
              }}
            />
          ) : (
            <div className="space-y-4">
              {providers.map(p => (
                <div
                  key={p.id}
                  className={selectedProviderId === p.id ? 'ring-2 ring-primary-500 rounded-2xl' : ''}
                  onMouseEnter={() => setSelectedProviderId(p.id)}
                >
                  <ProviderCard provider={p} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Sticky Interactive Leaflet Map */}
        <div
          className={`lg:col-span-5 lg:sticky lg:top-24 ${
            mobileViewMode === 'list' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between px-1 text-xs text-slate-500">
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary-600" />
                Live Map in {city}
              </span>
              <span className="text-[11px] text-slate-400">Click a pin to view rates</span>
            </div>
            <ProviderMap
              providers={providers}
              centerLat={currentCityObj.lat}
              centerLng={currentCityObj.lng}
              selectedProviderId={selectedProviderId}
              onSelectProvider={id => setSelectedProviderId(id)}
              className="h-[580px] w-full rounded-xl overflow-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
