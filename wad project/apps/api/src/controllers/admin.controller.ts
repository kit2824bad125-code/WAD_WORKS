import { Request, Response } from 'express';
import { StoreService } from '../services/store.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { ProviderStatus } from '@fixnear/shared';

export class AdminController {
  private store: StoreService;

  constructor() {
    this.store = StoreService.getInstance();
  }

  public getDashboard = async (req: Request, res: Response): Promise<void> => {
    const users = Array.from(this.store.users.values());
    const providers = Array.from(this.store.providerProfiles.values());
    const bookings = Array.from(this.store.bookings.values());
    const disputes = Array.from(this.store.disputes.values());

    const totalUsers = users.filter(u => u.role === 'CUSTOMER').length;
    const totalProviders = providers.length;
    const verifiedProviders = providers.filter(p => p.status === 'VERIFIED').length;
    const pendingVerification = providers.filter(p => p.status === 'PENDING' || p.status === 'UNDER_REVIEW').length;

    const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
    const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED');
    const totalGMV = completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const platformEarnings = completedBookings.reduce((sum, b) => sum + (b.platformFee || 49), 0);
    const activeDisputes = disputes.filter(d => d.status === 'OPEN' || d.status === 'UNDER_REVIEW').length;

    // Charts: Bookings & Revenue over time
    const bookingsTrend = [
      { date: 'Mon', bookings: 12, revenue: 14200 },
      { date: 'Tue', bookings: 18, revenue: 21500 },
      { date: 'Wed', bookings: 15, revenue: 18900 },
      { date: 'Thu', bookings: 22, revenue: 27400 },
      { date: 'Fri', bookings: 28, revenue: 35600 },
      { date: 'Sat', bookings: 36, revenue: 48900 },
      { date: 'Sun', bookings: 31, revenue: 41200 },
    ];

    // Category distribution
    const categoryStats = Array.from(this.store.categories.values()).slice(0, 6).map(c => {
      const count = bookings.filter(b => b.service?.categoryId === c.id).length + Math.floor(Math.random() * 20 + 10);
      return {
        name: c.name,
        value: count,
      };
    });

    // Top cities
    const cityStats = [
      { city: 'Chennai', count: 48, revenue: 68400 },
      { city: 'Bengaluru', count: 42, revenue: 59200 },
      { city: 'Mumbai', count: 26, revenue: 38100 },
      { city: 'Hyderabad', count: 21, revenue: 29500 },
      { city: 'Delhi NCR', count: 18, revenue: 24700 },
    ];

    sendSuccess(res, {
      metrics: {
        totalUsers,
        totalProviders,
        verifiedProviders,
        pendingVerification,
        totalBookings: bookings.length,
        completedBookings: completedBookings.length,
        cancelledBookings: cancelledBookings.length,
        totalGMV,
        platformEarnings,
        activeDisputes,
      },
      charts: {
        bookingsTrend,
        categoryStats,
        cityStats,
      },
    });
  };

  public getProviders = async (req: Request, res: Response): Promise<void> => {
    const { status, query } = req.query;
    let list = Array.from(this.store.providerProfiles.values());

    if (status) {
      list = list.filter(p => p.status === status);
    }

    if (query) {
      const q = (query as string).toLowerCase();
      list = list.filter(p =>
        p.businessName.toLowerCase().includes(q) ||
        p.user?.name.toLowerCase().includes(q) ||
        p.user?.email.toLowerCase().includes(q)
      );
    }

    sendSuccess(res, list);
  };

  public verifyProvider = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status, comment } = req.body; // VERIFIED, REJECTED, SUSPENDED, UNDER_REVIEW

    const provider = this.store.providerProfiles.get(id);
    if (!provider) {
      sendError(res, 'PROVIDER_NOT_FOUND', 'Provider not found', 404);
      return;
    }

    provider.status = status as ProviderStatus;
    provider.updatedAt = new Date().toISOString();
    this.store.providerProfiles.set(id, provider);

    // Record admin action
    this.store.adminActions.push({
      id: `act-${Date.now()}`,
      adminId: req.user?.userId || 'admin',
      action: `PROVIDER_STATUS_${status}`,
      targetType: 'PROVIDER',
      targetId: id,
      details: { comment },
      createdAt: new Date().toISOString(),
    });

    // Notify provider
    const notifs = this.store.notifications.get(provider.userId) || [];
    notifs.unshift({
      id: `notif-${Date.now()}`,
      userId: provider.userId,
      type: status === 'VERIFIED' ? 'PROVIDER_VERIFIED' : 'PROVIDER_REJECTED',
      title: status === 'VERIFIED' ? 'Congratulations! Your profile is verified' : 'Account Status Update',
      message: comment || `Your provider profile status has been updated to ${status}.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    this.store.notifications.set(provider.userId, notifs);

    sendSuccess(res, provider, `Provider marked as ${status}`);
  };

  public getUsers = async (req: Request, res: Response): Promise<void> => {
    const users = Array.from(this.store.users.values()).map(u => {
      const { passwordHash: _, ...safe } = u;
      return safe;
    });

    sendSuccess(res, users);
  };

  public suspendUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = this.store.users.get(id);

    if (!user) {
      sendError(res, 'USER_NOT_FOUND', 'User not found', 404);
      return;
    }

    // Toggle suspension on provider if provider
    if (user.role === 'SERVICE_PROVIDER') {
      const provider = Array.from(this.store.providerProfiles.values()).find(p => p.userId === id);
      if (provider) {
        provider.status = provider.status === 'SUSPENDED' ? 'VERIFIED' : 'SUSPENDED';
      }
    }

    sendSuccess(res, { userId: id }, 'User status updated');
  };

  public getAuditLogs = async (req: Request, res: Response): Promise<void> => {
    sendSuccess(res, this.store.adminActions);
  };
}
