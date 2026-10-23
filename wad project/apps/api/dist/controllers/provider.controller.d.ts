import { Request, Response } from 'express';
export declare class ProviderController {
    private store;
    constructor();
    getById: (req: Request, res: Response) => Promise<void>;
    updateProfile: (req: Request, res: Response) => Promise<void>;
    toggleAvailability: (req: Request, res: Response) => Promise<void>;
    updateWorkingHours: (req: Request, res: Response) => Promise<void>;
    getEarnings: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=provider.controller.d.ts.map