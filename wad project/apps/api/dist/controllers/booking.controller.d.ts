import { Request, Response } from 'express';
export declare class BookingController {
    private store;
    private bookingService;
    constructor();
    create: (req: Request, res: Response) => Promise<void>;
    getUserBookings: (req: Request, res: Response) => Promise<void>;
    getById: (req: Request, res: Response) => Promise<void>;
    updateStatus: (req: Request, res: Response) => Promise<void>;
    createQuote: (req: Request, res: Response) => Promise<void>;
    respondQuote: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=booking.controller.d.ts.map