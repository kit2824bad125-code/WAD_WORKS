export type UserRole = 'CUSTOMER' | 'SERVICE_PROVIDER' | 'ADMIN';
export type ProviderStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CONFIRMED' | 'EN_ROUTE' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
export type PaymentMethod = 'RAZORPAY' | 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET' | 'CASH_ON_SERVICE';
export type PricingType = 'FIXED_PRICE' | 'STARTING_FROM' | 'HOURLY' | 'QUOTE_REQUIRED';
export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
export type ReportStatus = 'PENDING' | 'INVESTIGATING' | 'DISMISSED' | 'ACTION_TAKEN';
export type QuoteStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
export type NotificationType = 'BOOKING_REQUEST' | 'BOOKING_ACCEPTED' | 'BOOKING_REJECTED' | 'BOOKING_CONFIRMED' | 'BOOKING_EN_ROUTE' | 'BOOKING_ARRIVED' | 'BOOKING_STARTED' | 'BOOKING_COMPLETED' | 'BOOKING_CANCELLED' | 'PAYMENT_RECEIVED' | 'NEW_MESSAGE' | 'NEW_REVIEW' | 'QUOTE_RECEIVED' | 'QUOTE_ACCEPTED' | 'QUOTE_REJECTED' | 'PROVIDER_VERIFIED' | 'PROVIDER_REJECTED' | 'DISPUTE_OPENED' | 'DISPUTE_RESOLVED' | 'SYSTEM_ALERT';
export interface User {
    id: string;
    email: string;
    phone?: string | null;
    name: string;
    role: UserRole;
    avatarUrl?: string | null;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    latitude: number;
    longitude: number;
    landmark?: string | null;
}
export interface CustomerProfile {
    id: string;
    userId: string;
    preferredLanguage?: string | null;
    addresses?: Address[];
    createdAt: string;
    updatedAt: string;
}
export interface WorkingDayHour {
    day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    isOpen: boolean;
    openTime: string;
    closeTime: string;
}
export interface ProviderProfile {
    id: string;
    userId: string;
    user?: User;
    businessName: string;
    description: string;
    status: ProviderStatus;
    isAvailable: boolean;
    isEmergencyAvailable: boolean;
    experienceYears: number;
    serviceRadiusKm: number;
    rating: number;
    reviewCount: number;
    completedJobsCount: number;
    responseRatePercent: number;
    cancellationRatePercent: number;
    address?: Address | null;
    workingHours?: WorkingDayHour[];
    identityDocumentUrl?: string | null;
    licenseDocumentUrl?: string | null;
    portfolioImages?: string[];
    createdAt: string;
    updatedAt: string;
}
export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    iconName: string;
    imageUrl?: string | null;
    isActive: boolean;
    displayOrder: number;
    serviceCount?: number;
    createdAt: string;
    updatedAt: string;
}
export interface Service {
    id: string;
    categoryId: string;
    category?: Category;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    pricingType: PricingType;
    estimatedDurationMinutes: number;
    imageUrl?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface ProviderService {
    id: string;
    providerId: string;
    serviceId: string;
    service?: Service;
    customPrice: number;
    pricingType: PricingType;
    isActive: boolean;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface Booking {
    id: string;
    customerId: string;
    customer?: {
        id: string;
        name: string;
        email: string;
        phone?: string | null;
        avatarUrl?: string | null;
    };
    providerId: string;
    provider?: {
        id: string;
        businessName: string;
        rating: number;
        reviewCount: number;
        user?: {
            name: string;
            email: string;
            phone?: string | null;
            avatarUrl?: string | null;
        };
    };
    serviceId: string;
    service?: Service;
    status: BookingStatus;
    scheduledAt: string;
    estimatedDurationMinutes?: number;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    contactPhone: string;
    address?: Address;
    problemDescription: string;
    additionalNotes?: string | null;
    problemImages: string[];
    completionImages: string[];
    servicePrice: number;
    platformFee: number;
    discountAmount: number;
    totalPrice: number;
    isEmergency: boolean;
    cancelledAt?: string | null;
    cancelledReason?: string | null;
    cancelledByUserId?: string | null;
    quote?: Quote | null;
    payment?: Payment | null;
    review?: Review | null;
    createdAt: string;
    updatedAt: string;
}
export interface BookingStatusHistory {
    id: string;
    bookingId: string;
    status: BookingStatus;
    comment?: string | null;
    createdById: string;
    createdAt: string;
}
export interface Quote {
    id: string;
    bookingId: string;
    estimatedAmount: number;
    breakdown?: {
        item: string;
        cost: number;
    }[];
    description: string;
    status: QuoteStatus;
    createdAt: string;
    updatedAt: string;
}
export interface Payment {
    id: string;
    bookingId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    razorpayOrderId?: string | null;
    razorpayPaymentId?: string | null;
    razorpaySignature?: string | null;
    platformFee: number;
    providerEarnings: number;
    createdAt: string;
    updatedAt: string;
}
export interface Review {
    id: string;
    bookingId: string;
    customerId: string;
    customerName?: string;
    customerAvatar?: string | null;
    providerId: string;
    rating: number;
    comment: string;
    images?: string[];
    createdAt: string;
    updatedAt: string;
}
export interface Favorite {
    id: string;
    customerId: string;
    providerId: string;
    provider?: ProviderProfile;
    createdAt: string;
}
export interface Conversation {
    id: string;
    bookingId: string;
    customerId: string;
    providerId: string;
    customer?: User;
    provider?: User;
    lastMessage?: Message | null;
    unreadCount?: number;
    createdAt: string;
    updatedAt: string;
}
export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    content: string;
    imageUrl?: string | null;
    isRead: boolean;
    createdAt: string;
}
export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    isRead: boolean;
    createdAt: string;
}
export interface Dispute {
    id: string;
    bookingId: string;
    booking?: Booking;
    raisedById: string;
    raisedBy?: User;
    reason: string;
    description: string;
    evidenceImages: string[];
    status: DisputeStatus;
    adminNotes?: string | null;
    resolution?: string | null;
    resolvedAt?: string | null;
    resolvedById?: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface AdminAction {
    id: string;
    adminId: string;
    action: string;
    targetType: 'PROVIDER' | 'USER' | 'BOOKING' | 'PAYMENT' | 'DISPUTE' | 'CATEGORY';
    targetId: string;
    details?: Record<string, any>;
    createdAt: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: PaginationMeta;
}
export interface ProviderSearchResult {
    id: string;
    userId: string;
    businessName: string;
    description: string;
    avatarUrl?: string | null;
    rating: number;
    reviewCount: number;
    experienceYears: number;
    completedJobsCount: number;
    responseRatePercent: number;
    cancellationRatePercent: number;
    status: ProviderStatus;
    isAvailable: boolean;
    isEmergencyAvailable: boolean;
    distanceKm: number;
    distanceScore: number;
    rankingScore: number;
    startingPrice: number;
    services: {
        id: string;
        name: string;
        price: number;
        pricingType: PricingType;
        categoryName: string;
    }[];
    city: string;
    state: string;
    serviceRadiusKm: number;
}
//# sourceMappingURL=types.d.ts.map