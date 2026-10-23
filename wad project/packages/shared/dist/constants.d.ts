import { BookingStatus } from './types.js';
export declare const PLATFORM_FEE_INR = 49;
export declare const PLATFORM_COMMISSION_PERCENT = 5;
export declare const VALID_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]>;
export declare const CITIES: {
    name: string;
    state: string;
    lat: number;
    lng: number;
}[];
export declare const DEMO_CREDENTIALS: {
    customer: {
        email: string;
        password: string;
        name: string;
        role: string;
    };
    provider: {
        email: string;
        password: string;
        name: string;
        businessName: string;
        role: string;
    };
    admin: {
        email: string;
        password: string;
        name: string;
        role: string;
    };
};
//# sourceMappingURL=constants.d.ts.map