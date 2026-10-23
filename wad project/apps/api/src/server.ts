import http from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { checkDatabaseConnection } from './config/db.js';
import { StoreService } from './services/store.service.js';
import { initSocketServer } from './sockets/socket.handler.js';

async function bootstrap() {
  console.log('🚀 Starting FixNear API server...');

  // Initialize persistent store and seed data
  const store = StoreService.getInstance();
  await store.initialize();

  // Test database connection
  await checkDatabaseConnection();

  const app = createApp();
  const httpServer = http.createServer(app);

  // Initialize Socket.IO
  initSocketServer(httpServer);

  httpServer.listen(env.PORT, () => {
    console.log(`
=====================================================
  FIXNEAR API Server is Live!
  Port:        ${env.PORT}
  Environment: ${env.NODE_ENV}
  API Docs:    http://localhost:${env.PORT}/api/docs
  Health:      http://localhost:${env.PORT}/api/health
=====================================================
    `);
  });
}

bootstrap().catch(err => {
  console.error('Fatal error during startup:', err);
  process.exit(1);
});
