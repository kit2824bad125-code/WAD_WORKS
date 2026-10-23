import { Request, Response } from 'express';
export declare class FavoriteController {
    private store;
    constructor();
    getFavorites: (req: Request, res: Response) => Promise<void>;
    addFavorite: (req: Request, res: Response) => Promise<void>;
    removeFavorite: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=favorite.controller.d.ts.map