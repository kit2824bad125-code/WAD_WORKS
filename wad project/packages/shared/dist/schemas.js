import { z } from 'zod';
// Auth Schemas
export const registerCustomerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number').optional().or(z.literal('')),
});
export const registerProviderSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'),
    businessName: z.string().min(2, 'Business name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    experienceYears: z.number().int().min(0).max(50),
    serviceRadiusKm: z.number().min(1).max(100).default(15),
    street: z.string().min(3),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit PIN code'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    categoryIds: z.array(z.string()).min(1, 'Select at least one category'),
});
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});
export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});
export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});
// Category & Service Schemas
export const createCategorySchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be kebab-case'),
    description: z.string().min(5),
    iconName: z.string().default('Wrench'),
    imageUrl: z.string().url().optional().or(z.literal('')),
    displayOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
});
export const updateCategorySchema = createCategorySchema.partial();
export const createServiceSchema = z.object({
    categoryId: z.string().uuid().or(z.string().min(1)),
    name: z.string().min(2),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be kebab-case'),
    description: z.string().min(5),
    basePrice: z.number().min(0),
    pricingType: z.enum(['FIXED_PRICE', 'STARTING_FROM', 'HOURLY', 'QUOTE_REQUIRED']),
    estimatedDurationMinutes: z.number().int().min(15).max(1440).default(60),
    imageUrl: z.string().url().optional().or(z.literal('')),
    isActive: z.boolean().default(true),
});
export const updateServiceSchema = createServiceSchema.partial();
// Provider Profile Schemas
export const updateProviderProfileSchema = z.object({
    businessName: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    experienceYears: z.number().int().min(0).max(50).optional(),
    serviceRadiusKm: z.number().min(1).max(100).optional(),
    isAvailable: z.boolean().optional(),
    isEmergencyAvailable: z.boolean().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});
export const updateWorkingHoursSchema = z.object({
    workingHours: z.array(z.object({
        day: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
        isOpen: z.boolean(),
        openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format must be HH:mm'),
        closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format must be HH:mm'),
    })).min(1),
});
// Booking Schemas
export const createBookingSchema = z.object({
    providerId: z.string().min(1),
    serviceId: z.string().min(1),
    scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
    street: z.string().min(3),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().regex(/^\d{6}$/, 'Please enter a valid 6-digit PIN code'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    contactPhone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'),
    problemDescription: z.string().min(10, 'Please describe the problem in at least 10 characters'),
    additionalNotes: z.string().optional(),
    problemImages: z.array(z.string().url()).optional().default([]),
    isEmergency: z.boolean().optional().default(false),
    paymentMethod: z.enum(['RAZORPAY', 'UPI', 'CARD', 'NET_BANKING', 'WALLET', 'CASH_ON_SERVICE']).default('RAZORPAY'),
});
export const updateBookingStatusSchema = z.object({
    status: z.enum([
        'PENDING', 'ACCEPTED', 'REJECTED', 'CONFIRMED',
        'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED',
        'CANCELLED', 'DISPUTED'
    ]),
    comment: z.string().optional(),
    cancellationReason: z.string().optional(),
    completionImages: z.array(z.string()).optional(),
    finalAmount: z.number().min(0).optional(),
});
// Quotes
export const createQuoteSchema = z.object({
    estimatedAmount: z.number().min(1),
    description: z.string().min(5),
    breakdown: z.array(z.object({
        item: z.string().min(1),
        cost: z.number().min(0)
    })).optional().default([]),
});
// Reviews
export const createReviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(5, 'Review must be at least 5 characters long'),
    images: z.array(z.string().url()).optional().default([]),
});
// Disputes
export const createDisputeSchema = z.object({
    bookingId: z.string().min(1),
    reason: z.string().min(3),
    description: z.string().min(10),
    evidenceImages: z.array(z.string().url()).optional().default([]),
});
export const resolveDisputeSchema = z.object({
    status: z.enum(['RESOLVED', 'REJECTED']),
    resolution: z.string().min(5),
    adminNotes: z.string().optional(),
    refundAmount: z.number().min(0).optional(),
});
// Search & Filtering
export const searchProvidersQuerySchema = z.object({
    query: z.string().optional(),
    categoryId: z.string().optional(),
    serviceId: z.string().optional(),
    city: z.string().optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    maxDistanceKm: z.coerce.number().positive().optional().default(25),
    minRating: z.coerce.number().min(0).max(5).optional(),
    maxPrice: z.coerce.number().positive().optional(),
    minExperience: z.coerce.number().min(0).optional(),
    verifiedOnly: z.enum(['true', 'false']).transform(v => v === 'true').optional().default('false'),
    emergencyOnly: z.enum(['true', 'false']).transform(v => v === 'true').optional().default('false'),
    openNow: z.enum(['true', 'false']).transform(v => v === 'true').optional().default('false'),
    sortBy: z.enum(['recommended', 'nearest', 'rating', 'price_asc', 'experience']).optional().default('recommended'),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(50).optional().default(12),
});
//# sourceMappingURL=schemas.js.map