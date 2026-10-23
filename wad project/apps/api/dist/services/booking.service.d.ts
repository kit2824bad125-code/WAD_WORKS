import { Booking, BookingStatus } from '@fixnear/shared';
export declare class BookingService {
    private store;
    constructor();
    createBooking(params: {
        customerId: string;
        providerId: string;
        serviceId: string;
        scheduledAt: string;
        street: string;
        city: string;
        state: string;
        postalCode: string;
        latitude: number;
        longitude: number;
        contactPhone: string;
        problemDescription: string;
        additionalNotes?: string;
        problemImages?: string[];
        isEmergency?: boolean;
    }): Promise<Booking>;
    transitionBookingStatus(bookingId: string, nextStatus: BookingStatus, userId: string, comment?: string, completionImages?: string[]): Promise<Booking>;
    private notifyUser;
}
//# sourceMappingURL=booking.service.d.ts.map