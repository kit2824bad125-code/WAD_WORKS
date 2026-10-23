import { Request, Response } from 'express';
export declare class AdminController {
    private store;
    constructor();
    getDashboard: (req: Request, res: Response) => Promise<void>;
    getProviders: (req: Request, res: Response) => Promise<void>;
    verifyProvider: (req: Request, res: Response) => Promise<void>;
    getUsers: (req: Request, res: Response) => Promise<void>;
    suspendUser: (req: Request, res: Response) => Promise<void>;
    getAuditLogs: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=admin.controller.d.ts.map