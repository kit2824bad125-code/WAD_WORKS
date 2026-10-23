import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/security.js';
import { sendError } from '../utils/response.js';
import { UserRole } from '@fixnear/shared';

// Extend Express Request interface to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'UNAUTHORIZED', 'Authentication token required', 401);
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    sendError(res, 'INVALID_TOKEN', 'Token is expired or invalid', 401);
    return;
  }

  req.user = payload;
  next();
}

export function requireRoles(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        'FORBIDDEN',
        `Access denied. Requires one of: ${allowedRoles.join(', ')}`,
        403
      );
      return;
    }

    next();
  };
}
