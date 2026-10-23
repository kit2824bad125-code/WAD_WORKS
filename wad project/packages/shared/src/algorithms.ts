/**
 * Calculates great-circle distance between two geographical points using the Haversine formula.
 * @param lat1 Latitude of point 1 in decimal degrees
 * @param lon1 Longitude of point 1 in decimal degrees
 * @param lat2 Latitude of point 2 in decimal degrees
 * @param lon2 Longitude of point 2 in decimal degrees
 * @returns Distance in kilometers
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  // Return rounded to 2 decimal places
  return Math.round(d * 100) / 100;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Formats distance in a customer-safe, privacy-preserving format.
 * Never outputs raw exact coordinates to customers.
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

export interface ProviderScoringInput {
  distanceKm: number;
  serviceRadiusKm: number;
  rating: number; // 0 to 5
  isAvailableNow: boolean;
  isEmergencyAvailable: boolean;
  experienceYears: number; // e.g. 0 to 30
  responseRatePercent: number; // 0 to 100
  completedJobsCount: number; // e.g. 0 to 500
}

/**
 * Multi-factor weighted provider search ranking score.
 * Formula:
 * Score = (DistanceScore * 0.30) + (RatingScore * 0.25) + (AvailabilityScore * 0.20) +
 *         (ExperienceScore * 0.10) + (ResponseRateScore * 0.10) + (CompletedJobsScore * 0.05)
 *
 * All factors are normalized to [0, 1]. Result is scaled to [0, 100].
 */
export function calculateProviderRankingScore(input: ProviderScoringInput): number {
  // 1. Distance score (30%): 1 when distance is 0, decreases as it reaches service radius
  const maxRadius = Math.max(input.serviceRadiusKm, 5);
  const distanceScore = Math.max(0, 1 - (input.distanceKm / maxRadius));

  // 2. Rating score (25%): 0-5 stars normalized to 0-1
  // If no reviews yet (rating 0), default to neutral 3.5 / 5.0 (0.7) for new providers
  const ratingScore = input.rating > 0 ? (input.rating / 5.0) : 0.7;

  // 3. Availability score (20%): Full score if online right now, bonus for emergency ready
  const availabilityScore = input.isAvailableNow 
    ? (input.isEmergencyAvailable ? 1.0 : 0.85) 
    : 0.1;

  // 4. Experience score (10%): Normalized up to 15 years
  const experienceScore = Math.min(1.0, input.experienceYears / 15.0);

  // 5. Response rate score (10%): 0-100% normalized
  const responseScore = Math.min(1.0, Math.max(0, input.responseRatePercent / 100.0));

  // 6. Completed jobs score (5%): Normalized up to 100 jobs
  const completedJobsScore = Math.min(1.0, input.completedJobsCount / 100.0);

  const totalScore =
    (distanceScore * 0.30) +
    (ratingScore * 0.25) +
    (availabilityScore * 0.20) +
    (experienceScore * 0.10) +
    (responseScore * 0.10) +
    (completedJobsScore * 0.05);

  return Math.round(totalScore * 1000) / 10; // e.g. 84.5 out of 100
}
