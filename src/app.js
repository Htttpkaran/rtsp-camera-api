import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import requestLogger from './middleware/requestLogger.js';
import rateLimiter from './middleware/rateLimiter.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';
import cameraRoutes from './routes/cameraRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger.js';

const app = express();
app.set('trust proxy', 1); // Trust first proxy (Nginx)

// Clear any previously cached security headers in the browser (like HSTS) that force HTTPS
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=0');
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('Cross-Origin-Opener-Policy');
  res.removeHeader('Cross-Origin-Embedder-Policy');
  next();
});

// Enable CORS
app.use(cors());

// Global Rate Limiting
app.use(rateLimiter);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom request logger
app.use(requestLogger);

// Routes
app.use('/health', healthRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/cameras', cameraRoutes);

// Handle 404 routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
