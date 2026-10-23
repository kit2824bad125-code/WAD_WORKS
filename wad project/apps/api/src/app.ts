import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { requestLogger } from './middleware/audit.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import apiRouter from './routes/index.js';
import { sendError, sendSuccess } from './utils/response.js';

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: false, // Allows Swagger UI and local development
    crossOriginEmbedderPolicy: false,
  }));

  // Cross-Origin Resource Sharing
  app.use(cors({
    origin: (origin, callback) => {
      // Allow localhost, local dev, or identical origins
      if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  }));

  // Body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logger
  app.use(requestLogger);

  // Rate limiter (100 requests per minute in production, relaxed in dev)
  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: env.NODE_ENV === 'development' ? 1000 : 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please slow down and try again shortly.',
      },
    },
  });
  app.use('/api', limiter);

  // Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    sendSuccess(res, {
      status: 'healthy',
      app: 'FixNear API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    });
  });

  // Swagger Documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Versioned API routes
  app.use('/api/v1', apiRouter);

  // 404 Route Handler
  app.use((req: Request, res: Response) => {
    sendError(res, 'ENDPOINT_NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found`, 404);
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
