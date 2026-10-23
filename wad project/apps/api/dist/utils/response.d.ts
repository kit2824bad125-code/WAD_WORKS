import { Response } from 'express';
import { PaginationMeta } from '@fixnear/shared';
export declare function sendSuccess<T>(res: Response, data?: T, message?: string, statusCode?: number): Response;
export declare function sendError(res: Response, code: string, message: string, statusCode?: number, details?: any): Response;
export declare function sendPaginated<T>(res: Response, data: T[], pagination: PaginationMeta, message?: string, statusCode?: number): Response;
//# sourceMappingURL=response.d.ts.map