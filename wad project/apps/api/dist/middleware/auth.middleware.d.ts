import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../utils/security.js';
import { UserRole } from '@fixnear/shared';
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}
export declare function authenticateToken(req: Request, res: Response, next: NextFunction): void;
export declare function requireRoles(...allowedRoles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map