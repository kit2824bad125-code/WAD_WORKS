import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const userStr = req.user ? `[User: ${req.user.userId} (${req.user.role})]` : '[Guest]';
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms ${userStr}`);
  });
  next();
}
