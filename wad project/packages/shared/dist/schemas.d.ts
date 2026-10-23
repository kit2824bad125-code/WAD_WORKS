import { z } from 'zod';
export declare const registerCustomerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    phone?: string | undefined;
}, {
    name: string;
    email: string;
    password: string;
    phone?: string | undefined;
}>;
export declare const registerProviderSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodString;
    businessName: z.ZodString;
    description: z.ZodString;
    experienceYears: z.ZodNumber;
    serviceRadiusKm: z.ZodDefault<z.ZodNumber>;
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodString;
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    categoryIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    phone: string;
    businessName: string;
    description: string;
    experienceYears: number;
    serviceRadiusKm: number;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    categoryIds: string[];
}, {
    name: string;
    email: string;
    password: string;
    phone: string;
    businessName: string;
    description: string;
    experienceYears: number;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    categoryIds: string[];
    serviceRadiusKm?: number | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    token: string;
}, {
    password: string;
    token: string;
}>;
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodString;
    iconName: z.ZodDefault<z.ZodString>;
    imageUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    displayOrder: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    slug: string;
    iconName: string;
    displayOrder: number;
    isActive: boolean;
    imageUrl?: string | undefined;
}, {
    name: string;
    description: string;
    slug: string;
    iconName?: string | undefined;
    imageUrl?: string | undefined;
    displayOrder?: number | undefined;
    isActive?: boolean | undefined;
}>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    iconName: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    imageUrl: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    displayOrder: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    iconName?: string | undefined;
    imageUrl?: string | undefined;
    displayOrder?: number | undefined;
    isActive?: boolean | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    iconName?: string | undefined;
    imageUrl?: string | undefined;
    displayOrder?: number | undefined;
    isActive?: boolean | undefined;
}>;
export declare const createServiceSchema: z.ZodObject<{
    categoryId: z.ZodUnion<[z.ZodString, z.ZodString]>;
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodString;
    basePrice: z.ZodNumber;
    pricingType: z.ZodEnum<["FIXED_PRICE", "STARTING_FROM", "HOURLY", "QUOTE_REQUIRED"]>;
    estimatedDurationMinutes: z.ZodDefault<z.ZodNumber>;
    imageUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    slug: string;
    isActive: boolean;
    categoryId: string;
    basePrice: number;
    pricingType: "FIXED_PRICE" | "STARTING_FROM" | "HOURLY" | "QUOTE_REQUIRED";
    estimatedDurationMinutes: number;
    imageUrl?: string | undefined;
}, {
    name: string;
    description: string;
    slug: string;
    categoryId: string;
    basePrice: number;
    pricingType: "FIXED_PRICE" | "STARTING_FROM" | "HOURLY" | "QUOTE_REQUIRED";
    imageUrl?: string | undefined;
    isActive?: boolean | undefined;
    estimatedDurationMinutes?: number | undefined;
}>;
export declare const updateServiceSchema: z.ZodObject<{
    categoryId: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    basePrice: z.ZodOptional<z.ZodNumber>;
    pricingType: z.ZodOptional<z.ZodEnum<["FIXED_PRICE", "STARTING_FROM", "HOURLY", "QUOTE_REQUIRED"]>>;
    estimatedDurationMinutes: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    imageUrl: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    imageUrl?: string | undefined;
    isActive?: boolean | undefined;
    categoryId?: string | undefined;
    basePrice?: number | undefined;
    pricingType?: "FIXED_PRICE" | "STARTING_FROM" | "HOURLY" | "QUOTE_REQUIRED" | undefined;
    estimatedDurationMinutes?: number | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    imageUrl?: string | undefined;
    isActive?: boolean | undefined;
    categoryId?: string | undefined;
    basePrice?: number | undefined;
    pricingType?: "FIXED_PRICE" | "STARTING_FROM" | "HOURLY" | "QUOTE_REQUIRED" | undefined;
    estimatedDurationMinutes?: number | undefined;
}>;
export declare const updateProviderProfileSchema: z.ZodObject<{
    businessName: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    experienceYears: z.ZodOptional<z.ZodNumber>;
    serviceRadiusKm: z.ZodOptional<z.ZodNumber>;
    isAvailable: z.ZodOptional<z.ZodBoolean>;
    isEmergencyAvailable: z.ZodOptional<z.ZodBoolean>;
    street: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    postalCode: z.ZodOptional<z.ZodString>;
    latitude: z.ZodOptional<z.ZodNumber>;
    longitude: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    businessName?: string | undefined;
    description?: string | undefined;
    experienceYears?: number | undefined;
    serviceRadiusKm?: number | undefined;
    street?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    postalCode?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    isAvailable?: boolean | undefined;
    isEmergencyAvailable?: boolean | undefined;
}, {
    businessName?: string | undefined;
    description?: string | undefined;
    experienceYears?: number | undefined;
    serviceRadiusKm?: number | undefined;
    street?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    postalCode?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    isAvailable?: boolean | undefined;
    isEmergencyAvailable?: boolean | undefined;
}>;
export declare const updateWorkingHoursSchema: z.ZodObject<{
    workingHours: z.ZodArray<z.ZodObject<{
        day: z.ZodEnum<["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]>;
        isOpen: z.ZodBoolean;
        openTime: z.ZodString;
        closeTime: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
        isOpen: boolean;
        openTime: string;
        closeTime: string;
    }, {
        day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
        isOpen: boolean;
        openTime: string;
        closeTime: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    workingHours: {
        day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
        isOpen: boolean;
        openTime: string;
        closeTime: string;
    }[];
}, {
    workingHours: {
        day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
        isOpen: boolean;
        openTime: string;
        closeTime: string;
    }[];
}>;
export declare const createBookingSchema: z.ZodObject<{
    providerId: z.ZodString;
    serviceId: z.ZodString;
    scheduledAt: z.ZodEffects<z.ZodString, string, string>;
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodString;
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    contactPhone: z.ZodString;
    problemDescription: z.ZodString;
    additionalNotes: z.ZodOptional<z.ZodString>;
    problemImages: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    isEmergency: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    paymentMethod: z.ZodDefault<z.ZodEnum<["RAZORPAY", "UPI", "CARD", "NET_BANKING", "WALLET", "CASH_ON_SERVICE"]>>;
}, "strip", z.ZodTypeAny, {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    providerId: string;
    serviceId: string;
    scheduledAt: string;
    contactPhone: string;
    problemDescription: string;
    problemImages: string[];
    isEmergency: boolean;
    paymentMethod: "RAZORPAY" | "UPI" | "CARD" | "NET_BANKING" | "WALLET" | "CASH_ON_SERVICE";
    additionalNotes?: string | undefined;
}, {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    providerId: string;
    serviceId: string;
    scheduledAt: string;
    contactPhone: string;
    problemDescription: string;
    additionalNotes?: string | undefined;
    problemImages?: string[] | undefined;
    isEmergency?: boolean | undefined;
    paymentMethod?: "RAZORPAY" | "UPI" | "CARD" | "NET_BANKING" | "WALLET" | "CASH_ON_SERVICE" | undefined;
}>;
export declare const updateBookingStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["PENDING", "ACCEPTED", "REJECTED", "CONFIRMED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "DISPUTED"]>;
    comment: z.ZodOptional<z.ZodString>;
    cancellationReason: z.ZodOptional<z.ZodString>;
    completionImages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    finalAmount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "REJECTED" | "ACCEPTED" | "CONFIRMED" | "EN_ROUTE" | "ARRIVED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DISPUTED";
    comment?: string | undefined;
    cancellationReason?: string | undefined;
    completionImages?: string[] | undefined;
    finalAmount?: number | undefined;
}, {
    status: "PENDING" | "REJECTED" | "ACCEPTED" | "CONFIRMED" | "EN_ROUTE" | "ARRIVED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DISPUTED";
    comment?: string | undefined;
    cancellationReason?: string | undefined;
    completionImages?: string[] | undefined;
    finalAmount?: number | undefined;
}>;
export declare const createQuoteSchema: z.ZodObject<{
    estimatedAmount: z.ZodNumber;
    description: z.ZodString;
    breakdown: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        item: z.ZodString;
        cost: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        item: string;
        cost: number;
    }, {
        item: string;
        cost: number;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    estimatedAmount: number;
    breakdown: {
        item: string;
        cost: number;
    }[];
}, {
    description: string;
    estimatedAmount: number;
    breakdown?: {
        item: string;
        cost: number;
    }[] | undefined;
}>;
export declare const createReviewSchema: z.ZodObject<{
    rating: z.ZodNumber;
    comment: z.ZodString;
    images: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    comment: string;
    rating: number;
    images: string[];
}, {
    comment: string;
    rating: number;
    images?: string[] | undefined;
}>;
export declare const createDisputeSchema: z.ZodObject<{
    bookingId: z.ZodString;
    reason: z.ZodString;
    description: z.ZodString;
    evidenceImages: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    bookingId: string;
    reason: string;
    evidenceImages: string[];
}, {
    description: string;
    bookingId: string;
    reason: string;
    evidenceImages?: string[] | undefined;
}>;
export declare const resolveDisputeSchema: z.ZodObject<{
    status: z.ZodEnum<["RESOLVED", "REJECTED"]>;
    resolution: z.ZodString;
    adminNotes: z.ZodOptional<z.ZodString>;
    refundAmount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "REJECTED" | "RESOLVED";
    resolution: string;
    adminNotes?: string | undefined;
    refundAmount?: number | undefined;
}, {
    status: "REJECTED" | "RESOLVED";
    resolution: string;
    adminNotes?: string | undefined;
    refundAmount?: number | undefined;
}>;
export declare const searchProvidersQuerySchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    serviceId: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    latitude: z.ZodOptional<z.ZodNumber>;
    longitude: z.ZodOptional<z.ZodNumber>;
    maxDistanceKm: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    minRating: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    minExperience: z.ZodOptional<z.ZodNumber>;
    verifiedOnly: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">>>;
    emergencyOnly: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">>>;
    openNow: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">>>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<["recommended", "nearest", "rating", "price_asc", "experience"]>>>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    maxDistanceKm: number;
    verifiedOnly: boolean;
    emergencyOnly: boolean;
    openNow: boolean;
    sortBy: "rating" | "recommended" | "nearest" | "price_asc" | "experience";
    page: number;
    limit: number;
    city?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    categoryId?: string | undefined;
    serviceId?: string | undefined;
    query?: string | undefined;
    minRating?: number | undefined;
    maxPrice?: number | undefined;
    minExperience?: number | undefined;
}, {
    city?: string | undefined;
    latitude?: number | undefined;
    longitude?: number | undefined;
    categoryId?: string | undefined;
    serviceId?: string | undefined;
    query?: string | undefined;
    maxDistanceKm?: number | undefined;
    minRating?: number | undefined;
    maxPrice?: number | undefined;
    minExperience?: number | undefined;
    verifiedOnly?: "true" | "false" | undefined;
    emergencyOnly?: "true" | "false" | undefined;
    openNow?: "true" | "false" | undefined;
    sortBy?: "rating" | "recommended" | "nearest" | "price_asc" | "experience" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
//# sourceMappingURL=schemas.d.ts.map