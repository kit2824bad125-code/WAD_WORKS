import { Request, Response } from 'express';
export declare class AuthController {
    private store;
    constructor();
    register: (req: Request, res: Response) => Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    me: (req: Request, res: Response) => Promise<void>;
    refresh: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map