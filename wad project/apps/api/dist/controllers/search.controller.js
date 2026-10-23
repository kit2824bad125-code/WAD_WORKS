import { SearchService } from '../services/search.service.js';
import { sendPaginated } from '../utils/response.js';
export class SearchController {
    searchService;
    constructor() {
        this.searchService = new SearchService();
    }
    search = async (req, res) => {
        const { query, categoryId, serviceId, city, latitude, longitude, maxDistanceKm, minRating, maxPrice, minExperience, verifiedOnly, emergencyOnly, openNow, sortBy, page, limit, } = req.query;
        const results = this.searchService.searchProviders({
            query: query,
            categoryId: categoryId,
            serviceId: serviceId,
            city: city,
            latitude: latitude ? parseFloat(latitude) : undefined,
            longitude: longitude ? parseFloat(longitude) : undefined,
            maxDistanceKm: maxDistanceKm ? parseFloat(maxDistanceKm) : undefined,
            minRating: minRating ? parseFloat(minRating) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            minExperience: minExperience ? parseInt(minExperience, 10) : undefined,
            verifiedOnly: verifiedOnly === 'true',
            emergencyOnly: emergencyOnly === 'true',
            openNow: openNow === 'true',
            sortBy: sortBy || 'recommended',
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 12,
        });
        sendPaginated(res, results.results, {
            page: results.page,
            limit: limit ? parseInt(limit, 10) : 12,
            total: results.total,
            totalPages: results.totalPages,
        }, 'Providers fetched successfully');
    };
}
//# sourceMappingURL=search.controller.js.map