import { User, ProviderProfile, CustomerProfile, Category, Service, ProviderService, Booking, Review, Favorite, Conversation, Message, Notification, Dispute, AdminAction, Address, WorkingDayHour, Quote, Payment } from '@fixnear/shared';
export declare class StoreService {
    private static instance;
    users: Map<string, User & {
        passwordHash: string;
    }>;
    customerProfiles: Map<string, CustomerProfile>;
    providerProfiles: Map<string, ProviderProfile>;
    categories: Map<string, Category>;
    services: Map<string, Service>;
    providerServices: Map<string, ProviderService>;
    addresses: Map<string, Address>;
    workingHours: Map<string, WorkingDayHour[]>;
    bookings: Map<string, Booking>;
    reviews: Map<string, Review>;
    favorites: Map<string, Favorite>;
    conversations: Map<string, Conversation>;
    messages: Map<string, Message[]>;
    notifications: Map<string, Notification[]>;
    disputes: Map<string, Dispute>;
    payments: Map<string, Payment>;
    quotes: Map<string, Quote>;
    adminActions: AdminAction[];
    private isInitialized;
    private constructor();
    static getInstance(): StoreService;
    initialize(): Promise<void>;
    private seedData;
}
//# sourceMappingURL=store.service.d.ts.map