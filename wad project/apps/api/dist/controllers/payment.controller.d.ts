import { Request, Response } from 'express';
export declare class PaymentController {
    private paymentService;
    private store;
    constructor();
    createOrder: (req: Request, res: Response) => Promise<void>;
    verify: (req: Request, res: Response) => Promise<void>;
    getPayment: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=payment.controller.d.ts.map