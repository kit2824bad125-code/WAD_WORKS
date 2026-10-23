import { ProviderSearchResult } from '@fixnear/shared';
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
export declare class SearchService {
    private store;
    constructor();
    searchProviders(params: SearchQueryInput): {
        results: ProviderSearchResult[];
        total: number;
        page: number;
        totalPages: number;
    };
}
//# sourceMappingURL=search.service.d.ts.map