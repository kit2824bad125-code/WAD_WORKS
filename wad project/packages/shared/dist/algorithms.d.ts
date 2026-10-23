/**
 * Calculates great-circle distance between two geographical points using the Haversine formula.
 * @param lat1 Latitude of point 1 in decimal degrees
 * @param lon1 Longitude of point 1 in decimal degrees
 * @param lat2 Latitude of point 2 in decimal degrees
 * @param lon2 Longitude of point 2 in decimal degrees
 * @returns Distance in kilometers
 */
export declare function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
/**
 * Formats distance in a customer-safe, privacy-preserving format.
 * Never outputs raw exact coordinates to customers.
 */
export declare function formatDistance(distanceKm: number): string;
export interface ProviderScoringInput {
    distanceKm: number;
    serviceRadiusKm: number;
    rating: number;
    isAvailableNow: boolean;
    isEmergencyAvailable: boolean;
    experienceYears: number;
    responseRatePercent: number;
    completedJobsCount: number;
}
/**
 * Multi-factor weighted provider search ranking score.
 * Formula:
 * Score = (DistanceScore * 0.30) + (RatingScore * 0.25) + (AvailabilityScore * 0.20) +
 *         (ExperienceScore * 0.10) + (ResponseRateScore * 0.10) + (CompletedJobsScore * 0.05)
 *
 * All factors are normalized to [0, 1]. Result is scaled to [0, 100].
 */
export declare function calculateProviderRankingScore(input: ProviderScoringInput): number;
//# sourceMappingURL=algorithms.d.ts.map