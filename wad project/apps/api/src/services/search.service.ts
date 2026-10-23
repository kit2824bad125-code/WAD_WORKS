import { StoreService } from './store.service.js';
import {
  calculateHaversineDistance,
  calculateProviderRankingScore,
  ProviderSearchResult,
  PricingType
} from '@fixnear/shared';

export interface SearchQueryInput {
  query?: string;
  categoryId?: string;
  serviceId?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  maxDistanceKm?: number;
  minRating?: number;
  maxPrice?: number;
  minExperience?: number;
  verifiedOnly?: boolean;
  emergencyOnly?: boolean;
  openNow?: boolean;
  sortBy?: 'recommended' | 'nearest' | 'rating' | 'price_asc' | 'experience';
  page?: number;
  limit?: number;
}

export class SearchService {
  private store: StoreService;

  constructor() {
    this.store = StoreService.getInstance();
  }

  public searchProviders(params: SearchQueryInput): {
    results: ProviderSearchResult[];
    total: number;
    page: number;
    totalPages: number;
  } {
    const page = params.page || 1;
    const limit = params.limit || 12;
    const maxDistanceKm = params.maxDistanceKm || 25;

    // Default reference coordinate: Chennai Anna Nagar (13.0850, 80.2100) if no coords supplied
    const userLat = params.latitude || 13.0850;
    const userLng = params.longitude || 80.2100;

    const allProviders = Array.from(this.store.providerProfiles.values());

    const matched: ProviderSearchResult[] = [];

    for (const provider of allProviders) {
      // Role & status filter
      if (params.verifiedOnly && provider.status !== 'VERIFIED') {
        continue;
      }
      if (provider.status === 'REJECTED' || provider.status === 'SUSPENDED') {
        continue;
      }

      // City filter
      if (params.city && provider.address?.city.toLowerCase() !== params.city.toLowerCase()) {
        continue;
      }

      // Emergency filter
      if (params.emergencyOnly && !provider.isEmergencyAvailable) {
        continue;
      }

      // Open now / available filter
      if (params.openNow && !provider.isAvailable) {
        continue;
      }

      // Minimum rating
      if (params.minRating && provider.rating < params.minRating) {
        continue;
      }

      // Minimum experience
      if (params.minExperience && provider.experienceYears < params.minExperience) {
        continue;
      }

      // Distance calculation
      const provLat = provider.address?.latitude || 13.08;
      const provLng = provider.address?.longitude || 80.22;
      const distanceKm = calculateHaversineDistance(userLat, userLng, provLat, provLng);

      // Exceeds max search radius or provider's own service radius
      const effectiveMaxDistance = Math.min(maxDistanceKm, provider.serviceRadiusKm * 1.5);
      if (distanceKm > effectiveMaxDistance) {
        continue;
      }

      // Retrieve provider services
      const providerServicesList = Array.from(this.store.providerServices.values()).filter(
        ps => ps.providerId === provider.id && ps.isActive
      );

      // Category / Service filtering
      if (params.categoryId) {
        const matchesCategory = providerServicesList.some(
          ps => ps.service?.categoryId === params.categoryId
        );
        if (!matchesCategory) continue;
      }

      if (params.serviceId) {
        const matchesService = providerServicesList.some(
          ps => ps.serviceId === params.serviceId
        );
        if (!matchesService) continue;
      }

      // Query text search
      if (params.query) {
        const q = params.query.toLowerCase();
        const matchesBusiness = provider.businessName.toLowerCase().includes(q);
        const matchesDescription = provider.description.toLowerCase().includes(q);
        const matchesServices = providerServicesList.some(
          ps => ps.service?.name.toLowerCase().includes(q) || ps.service?.description.toLowerCase().includes(q)
        );
        if (!matchesBusiness && !matchesDescription && !matchesServices) {
          continue;
        }
      }

      // Price filter
      const prices = providerServicesList.map(ps => ps.customPrice);
      const startingPrice = prices.length > 0 ? Math.min(...prices) : 299;
      if (params.maxPrice && startingPrice > params.maxPrice) {
        continue;
      }

      // Compute Ranking Score
      const rankingScore = calculateProviderRankingScore({
        distanceKm,
        serviceRadiusKm: provider.serviceRadiusKm,
        rating: provider.rating,
        isAvailableNow: provider.isAvailable,
        isEmergencyAvailable: provider.isEmergencyAvailable,
        experienceYears: provider.experienceYears,
        responseRatePercent: provider.responseRatePercent,
        completedJobsCount: provider.completedJobsCount,
      });

      const distanceScore = Math.max(0, 1 - (distanceKm / provider.serviceRadiusKm));

      matched.push({
        id: provider.id,
        userId: provider.userId,
        businessName: provider.businessName,
        description: provider.description,
        avatarUrl: provider.user?.avatarUrl,
        rating: provider.rating,
        reviewCount: provider.reviewCount,
        experienceYears: provider.experienceYears,
        completedJobsCount: provider.completedJobsCount,
        responseRatePercent: provider.responseRatePercent,
        cancellationRatePercent: provider.cancellationRatePercent,
        status: provider.status,
        isAvailable: provider.isAvailable,
        isEmergencyAvailable: provider.isEmergencyAvailable,
        distanceKm,
        distanceScore: Math.round(distanceScore * 100) / 100,
        rankingScore,
        startingPrice,
        services: providerServicesList.map(ps => ({
          id: ps.serviceId,
          name: ps.service?.name || '',
          price: ps.customPrice,
          pricingType: ps.pricingType,
          categoryName: ps.service?.category?.name || '',
        })),
        city: provider.address?.city || 'Chennai',
        state: provider.address?.state || 'Tamil Nadu',
        serviceRadiusKm: provider.serviceRadiusKm,
      });
    }

    // Sort results
    const sortBy = params.sortBy || 'recommended';
    matched.sort((a, b) => {
      switch (sortBy) {
        case 'nearest':
          return a.distanceKm - b.distanceKm;
        case 'rating':
          return b.rating - a.rating;
        case 'price_asc':
          return a.startingPrice - b.startingPrice;
        case 'experience':
          return b.experienceYears - a.experienceYears;
        case 'recommended':
        default:
          return b.rankingScore - a.rankingScore;
      }
    });

    const total = matched.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedResults = matched.slice(startIndex, startIndex + limit);

    return {
      results: paginatedResults,
      total,
      page,
      totalPages,
    };
  }
}
