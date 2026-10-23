import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response.js';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        sendError(res, 'VALIDATION_ERROR', 'Validation failed for request body', 400, details);
        return;
      }
      sendError(res, 'BAD_REQUEST', 'Malformed request body', 400);
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        sendError(res, 'VALIDATION_ERROR', 'Validation failed for query parameters', 400, details);
        return;
      }
      sendError(res, 'BAD_REQUEST', 'Malformed query parameters', 400);
    }
  };
}
