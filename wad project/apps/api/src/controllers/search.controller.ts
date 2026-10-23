import { Request, Response } from 'express';
import { SearchService } from '../services/search.service.js';
import { sendPaginated, sendSuccess } from '../utils/response.js';

export class SearchController {
  private searchService: SearchService;

  constructor() {
    this.searchService = new SearchService();
  }

  public search = async (req: Request, res: Response): Promise<void> => {
    const {
      query,
      categoryId,
      serviceId,
      city,
      latitude,
      longitude,
      maxDistanceKm,
      minRating,
      maxPrice,
      minExperience,
      verifiedOnly,
      emergencyOnly,
      openNow,
      sortBy,
      page,
      limit,
    } = req.query;

    const results = this.searchService.searchProviders({
      query: query as string,
      categoryId: categoryId as string,
      serviceId: serviceId as string,
      city: city as string,
      latitude: latitude ? parseFloat(latitude as string) : undefined,
      longitude: longitude ? parseFloat(longitude as string) : undefined,
      maxDistanceKm: maxDistanceKm ? parseFloat(maxDistanceKm as string) : undefined,
      minRating: minRating ? parseFloat(minRating as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      minExperience: minExperience ? parseInt(minExperience as string, 10) : undefined,
      verifiedOnly: verifiedOnly === 'true',
      emergencyOnly: emergencyOnly === 'true',
      openNow: openNow === 'true',
      sortBy: (sortBy as any) || 'recommended',
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 12,
    });

    sendPaginated(
      res,
      results.results,
      {
        page: results.page,
        limit: limit ? parseInt(limit as string, 10) : 12,
        total: results.total,
        totalPages: results.totalPages,
      },
      'Providers fetched successfully'
    );
  };
}
