import { Request, Response } from 'express';
export declare class CategoryController {
    private store;
    constructor();
    getAll: (req: Request, res: Response) => Promise<void>;
    getBySlug: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=category.controller.d.ts.map