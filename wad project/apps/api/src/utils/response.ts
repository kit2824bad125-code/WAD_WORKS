import { Response } from 'express';
import { ApiResponse, PaginatedResponse, PaginationMeta } from '@fixnear/shared';

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode = 200
): Response {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode = 400,
  details?: any
): Response {
  const body: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
  return res.status(statusCode).json(body);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message?: string,
  statusCode = 200
): Response {
  const body: PaginatedResponse<T> = {
    success: true,
    data,
    pagination,
  };
  return res.status(statusCode).json(body);
}
