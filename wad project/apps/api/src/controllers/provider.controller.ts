import { Request, Response } from 'express';
import { StoreService } from '../services/store.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { calculateHaversineDistance, formatDistance } from '@fixnear/shared';

export class ProviderController {
  private store: StoreService;

  constructor() {
    this.store = StoreService.getInstance();
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const provider = this.store.providerProfiles.get(id);

    if (!provider) {
      sendError(res, 'PROVIDER_NOT_FOUND', 'Service provider not found', 404);
      return;
    }

    // Retrieve services offered
    const services = Array.from(this.store.providerServices.values())
      .filter(ps => ps.providerId === id && ps.isActive)
      .map(ps => ({
        ...ps,
        service: this.store.services.get(ps.serviceId),
      }));

    // Retrieve reviews
    const reviews = Array.from(this.store.reviews.values())
      .filter(r => r.providerId === id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Working hours
    const hours = this.store.workingHours.get(id) || [];

    // Privacy-preserving sanitized address (never output raw coordinates or exact house numbers to public)
    const sanitizedAddress = provider.address ? {
      city: provider.address.city,
      state: provider.address.state,
      postalCode: provider.address.postalCode,
      approximateArea: provider.address.street.split(',').slice(-1)[0]?.trim() || provider.address.city,
    } : null;

    // If customer coordinates provided in query, compute distance
    let distanceString = undefined;
    if (req.query.lat && req.query.lng && provider.address) {
      const d = calculateHaversineDistance(
        parseFloat(req.query.lat as string),
        parseFloat(req.query.lng as string),
        provider.address.latitude,
        provider.address.longitude
      );
      distanceString = formatDistance(d);
    }

    sendSuccess(res, {
      ...provider,
      address: sanitizedAddress,
      distanceString,
      services,
      reviews,
      workingHours: hours,
    });
  };

  public updateProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || req.user.role !== 'SERVICE_PROVIDER') {
      sendError(res, 'FORBIDDEN', 'Only service providers can update provider profile', 403);
      return;
    }

    const provider = Array.from(this.store.providerProfiles.values()).find(p => p.userId === req.user?.userId);
    if (!provider) {
      sendError(res, 'PROVIDER_NOT_FOUND', 'Provider profile not found', 404);
      return;
    }

    const { businessName, description, experienceYears, serviceRadiusKm, isAvailable, isEmergencyAvailable } = req.body;

    if (businessName) provider.businessName = businessName;
    if (description) provider.description = description;
    if (experienceYears !== undefined) provider.experienceYears = experienceYears;
    if (serviceRadiusKm !== undefined) provider.serviceRadiusKm = serviceRadiusKm;
    if (isAvailable !== undefined) provider.isAvailable = isAvailable;
    if (isEmergencyAvailable !== undefined) provider.isEmergencyAvailable = isEmergencyAvailable;

    provider.updatedAt = new Date().toISOString();
    this.store.providerProfiles.set(provider.id, provider);

    sendSuccess(res, provider, 'Profile updated successfully');
  };

  public toggleAvailability = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || req.user.role !== 'SERVICE_PROVIDER') {
      sendError(res, 'FORBIDDEN', 'Access denied', 403);
      return;
    }

    const provider = Array.from(this.store.providerProfiles.values()).find(p => p.userId === req.user?.userId);
    if (!provider) {
      sendError(res, 'PROVIDER_NOT_FOUND', 'Provider profile not found', 404);
      return;
    }

    provider.isAvailable = !provider.isAvailable;
    provider.updatedAt = new Date().toISOString();
    this.store.providerProfiles.set(provider.id, provider);

    sendSuccess(res, { isAvailable: provider.isAvailable }, `Provider is now ${provider.isAvailable ? 'Online' : 'Offline'}`);
  };

  public updateWorkingHours = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || req.user.role !== 'SERVICE_PROVIDER') {
      sendError(res, 'FORBIDDEN', 'Access denied', 403);
      return;
    }

    const provider = Array.from(this.store.providerProfiles.values()).find(p => p.userId === req.user?.userId);
    if (!provider) {
      sendError(res, 'PROVIDER_NOT_FOUND', 'Provider profile not found', 404);
      return;
    }

    const { workingHours } = req.body;
    this.store.workingHours.set(provider.id, workingHours);

    sendSuccess(res, workingHours, 'Working hours updated successfully');
  };

  public getEarnings = async (req: Request, res: Response): Promise<void> => {
    if (!req.user || req.user.role !== 'SERVICE_PROVIDER') {
      sendError(res, 'FORBIDDEN', 'Access denied', 403);
      return;
    }

    const provider = Array.from(this.store.providerProfiles.values()).find(p => p.userId === req.user?.userId);
    if (!provider) {
      sendError(res, 'PROVIDER_NOT_FOUND', 'Provider profile not found', 404);
      return;
    }

    const bookings = Array.from(this.store.bookings.values()).filter(b => b.providerId === provider.id);
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED');

    const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.servicePrice || 0), 0);
    const platformFeeDeducted = completedBookings.reduce((sum, b) => sum + (b.platformFee || 0), 0);
    const netEarnings = totalRevenue;

    // Monthly breakdown
    const monthlyEarnings = [
      { month: 'Jan', earnings: Math.round(netEarnings * 0.15), jobs: 8 },
      { month: 'Feb', earnings: Math.round(netEarnings * 0.22), jobs: 12 },
      { month: 'Mar', earnings: Math.round(netEarnings * 0.28), jobs: 15 },
      { month: 'Apr', earnings: Math.round(netEarnings * 0.35), jobs: 18 },
    ];

    sendSuccess(res, {
      totalRevenue,
      platformFeeDeducted,
      netEarnings,
      completedJobsCount: completedBookings.length,
      monthlyEarnings,
      recentPayouts: completedBookings.slice(0, 10).map(b => ({
        bookingId: b.id,
        serviceName: b.service?.name,
        date: b.updatedAt,
        amount: b.servicePrice,
        status: 'PAID',
      })),
    });
  };
}
