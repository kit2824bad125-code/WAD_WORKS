import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { StoreService } from '../services/store.service.js';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/security.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { User, UserRole, ProviderStatus } from '@fixnear/shared';

export class AuthController {
  private store: StoreService;

  constructor() {
    this.store = StoreService.getInstance();
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, name, phone, role = 'CUSTOMER', ...rest } = req.body;

    // Check if email already exists
    const existing = Array.from(this.store.users.values()).find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      sendError(res, 'USER_EXISTS', 'An account with this email address already exists', 409);
      return;
    }

    const passwordHash = await hashPassword(password);
    const userId = `usr-${Date.now()}`;

    const newUser: User & { passwordHash: string } = {
      id: userId,
      email: email.toLowerCase(),
      passwordHash,
      name,
      phone: phone || null,
      role: role as UserRole,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      isEmailVerified: true,
      isPhoneVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.store.users.set(userId, newUser);

    if (role === 'CUSTOMER') {
      this.store.customerProfiles.set(`cp-${userId}`, {
        id: `cp-${userId}`,
        userId,
        preferredLanguage: 'English',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else if (role === 'SERVICE_PROVIDER') {
      const providerId = `prov-${Date.now()}`;
      const providerProfile = {
        id: providerId,
        userId,
        user: newUser,
        businessName: rest.businessName || name,
        description: rest.description || 'Dedicated local service professional on FixNear.',
        status: 'PENDING' as ProviderStatus, // Requires admin verification
        isAvailable: true,
        isEmergencyAvailable: false,
        experienceYears: rest.experienceYears || 1,
        serviceRadiusKm: rest.serviceRadiusKm || 15,
        rating: 0,
        reviewCount: 0,
        completedJobsCount: 0,
        responseRatePercent: 100,
        cancellationRatePercent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (rest.street && rest.city) {
        const addrId = `addr-${providerId}`;
        const addr = {
          id: addrId,
          street: rest.street,
          city: rest.city,
          state: rest.state || 'Tamil Nadu',
          postalCode: rest.postalCode || '600001',
          country: 'India',
          latitude: rest.latitude || 13.0827,
          longitude: rest.longitude || 80.2707,
        };
        this.store.addresses.set(addrId, addr);
        (providerProfile as any).address = addr;
      }

      this.store.providerProfiles.set(providerId, providerProfile as any);

      // Add default working hours
      const defaultHours = [
        { day: 'MONDAY', isOpen: true, openTime: '09:00', closeTime: '18:00' },
        { day: 'TUESDAY', isOpen: true, openTime: '09:00', closeTime: '18:00' },
        { day: 'WEDNESDAY', isOpen: true, openTime: '09:00', closeTime: '18:00' },
        { day: 'THURSDAY', isOpen: true, openTime: '09:00', closeTime: '18:00' },
        { day: 'FRIDAY', isOpen: true, openTime: '09:00', closeTime: '18:00' },
        { day: 'SATURDAY', isOpen: true, openTime: '09:00', closeTime: '18:00' },
        { day: 'SUNDAY', isOpen: false, openTime: '09:00', closeTime: '18:00' },
      ];
      this.store.workingHours.set(providerId, defaultHours as any);

      // Attach selected categories/services if provided
      if (rest.categoryIds && Array.isArray(rest.categoryIds)) {
        for (const catId of rest.categoryIds) {
          const srvs = Array.from(this.store.services.values()).filter(s => s.categoryId === catId);
          for (const s of srvs) {
            this.store.providerServices.set(`ps-${providerId}-${s.id}`, {
              id: `ps-${providerId}-${s.id}`,
              providerId,
              serviceId: s.id,
              service: s,
              customPrice: s.basePrice,
              pricingType: s.pricingType,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        }
      }
    }

    const payload = {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const { passwordHash: _, ...safeUser } = newUser;

    sendSuccess(
      res,
      {
        user: safeUser,
        accessToken,
        refreshToken,
      },
      'Registration successful! Welcome to FixNear.',
      201
    );
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = Array.from(this.store.users.values()).find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      sendError(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
      return;
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      sendError(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
      return;
    }

    // Check if provider is suspended
    if (user.role === 'SERVICE_PROVIDER') {
      const provider = Array.from(this.store.providerProfiles.values()).find(p => p.userId === user.id);
      if (provider && provider.status === 'SUSPENDED') {
        sendError(res, 'ACCOUNT_SUSPENDED', 'Your service provider account has been suspended. Please contact support.', 403);
        return;
      }
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const { passwordHash: _, ...safeUser } = user;
    const providerProfile = Array.from(this.store.providerProfiles.values()).find(p => p.userId === user.id);

    sendSuccess(
      res,
      {
        user: safeUser,
        providerProfile: providerProfile || null,
        accessToken,
        refreshToken,
      },
      'Logged in successfully'
    );
  };

  public me = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      sendError(res, 'UNAUTHORIZED', 'Not authenticated', 401);
      return;
    }

    const user = this.store.users.get(req.user.userId);
    if (!user) {
      sendError(res, 'USER_NOT_FOUND', 'User profile not found', 404);
      return;
    }

    const { passwordHash: _, ...safeUser } = user;
    const providerProfile = Array.from(this.store.providerProfiles.values()).find(p => p.userId === user.id);

    sendSuccess(res, {
      user: safeUser,
      providerProfile: providerProfile || null,
    });
  };

  public refresh = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      sendError(res, 'TOKEN_REQUIRED', 'Refresh token is required', 400);
      return;
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      sendError(res, 'INVALID_REFRESH_TOKEN', 'Refresh token expired or invalid', 401);
      return;
    }

    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    });

    sendSuccess(res, { accessToken: newAccessToken });
  };
}
