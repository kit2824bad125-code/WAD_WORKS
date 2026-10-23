import { test } from 'node:test';
import assert from 'node:assert';
import { calculateHaversineDistance, formatDistance, calculateProviderRankingScore } from './algorithms.js';
import { VALID_STATUS_TRANSITIONS } from './constants.js';

test('Haversine distance calculation produces correct output', () => {
  // Chennai (Central) to Guindy Chennai (~10.5 km)
  const d = calculateHaversineDistance(13.0827, 80.2707, 13.0067, 80.2025);
  assert.ok(d > 9 && d < 12, `Distance should be ~10.5km, got ${d}`);
  assert.strictEqual(formatDistance(d), `${d.toFixed(1)} km away`);
  assert.strictEqual(formatDistance(0.45), '450 m away');
});

test('Search ranking algorithm computes high score for top providers', () => {
  const scoreTop = calculateProviderRankingScore({
    distanceKm: 2,
    serviceRadiusKm: 15,
    rating: 4.9,
    isAvailableNow: true,
    isEmergencyAvailable: true,
    experienceYears: 10,
    responseRatePercent: 98,
    completedJobsCount: 85
  });

  const scoreLow = calculateProviderRankingScore({
    distanceKm: 20,
    serviceRadiusKm: 15,
    rating: 3.2,
    isAvailableNow: false,
    isEmergencyAvailable: false,
    experienceYears: 1,
    responseRatePercent: 50,
    completedJobsCount: 2
  });

  assert.ok(scoreTop > 75, `Top provider score should be high, got ${scoreTop}`);
  assert.ok(scoreLow < 45, `Low provider score should be low, got ${scoreLow}`);
  assert.ok(scoreTop > scoreLow, 'Top provider must outrank low provider');
});

test('State transitions define valid progression', () => {
  assert.ok(VALID_STATUS_TRANSITIONS.PENDING.includes('ACCEPTED'));
  assert.ok(VALID_STATUS_TRANSITIONS.ACCEPTED.includes('CONFIRMED'));
  assert.ok(VALID_STATUS_TRANSITIONS.CONFIRMED.includes('EN_ROUTE'));
  assert.ok(VALID_STATUS_TRANSITIONS.EN_ROUTE.includes('ARRIVED'));
  assert.ok(VALID_STATUS_TRANSITIONS.ARRIVED.includes('IN_PROGRESS'));
  assert.ok(VALID_STATUS_TRANSITIONS.IN_PROGRESS.includes('COMPLETED'));
  assert.strictEqual(VALID_STATUS_TRANSITIONS.COMPLETED.includes('PENDING'), false);
});
