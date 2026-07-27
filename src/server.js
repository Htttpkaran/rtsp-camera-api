import app from './app.js';
import { config } from './config/index.js';
import logger from './utils/logger.js';

const server = app.listen(config.port, () => {
  logger.info(`Camera Management Service is running on port ${config.port}`);
});

// Graceful shutdown on uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Server shutting down...', err);
  process.exit(1);
});

// Graceful shutdown on unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Server shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});
