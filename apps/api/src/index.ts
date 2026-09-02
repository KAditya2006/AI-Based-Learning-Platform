import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { requestLogger } from './middleware/requestLogger';
import { JobService } from './services/JobService';

// Load environment variables
dotenv.config({ path: '../../.env' });

export const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = (process.env.MONGODB_URI || process.env.MONGO_URI) as string;

// Fail-fast production checks
if (!MONGO_URI && process.env.NODE_ENV !== 'test') {
  logger.error('CRITICAL: MONGODB_URI is required to start the application.');
  process.exit(1);
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET) {
    logger.error('CRITICAL: JWT_SECRET is required in production.');
    process.exit(1);
  }
}

// Middleware
app.use(helmet());
app.use(cors());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Structured Request Logging
app.use(requestLogger);

// Health & Readiness Endpoints
app.get('/api/health', (req: Request, res: Response) => {
  // Application process health (is the Node process running?)
  res.status(200).json({
    status: 'up',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/ready', (req: Request, res: Response) => {
  // Readiness to serve traffic (are dependencies healthy?)
  const dbStatus = mongoose.connection.readyState;
  // 1 = connected
  if (dbStatus === 1) {
    res.status(200).json({
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: 'unready',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// Main API Routes
app.use('/api', apiRoutes);

// Basic error handling middleware
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  const connectDB = async (retries = 5, delay = 5000) => {
    while (retries > 0) {
      try {
        await mongoose.connect(MONGO_URI);
        logger.info('MongoDB connection established.');
        return;
      } catch (error) {
        retries -= 1;
        logger.error(`MongoDB connection failed. Retries left: ${retries}`, { error });
        if (retries === 0) {
          logger.error('Could not connect to MongoDB. Exiting...');
          process.exit(1);
        }
        await new Promise(res => setTimeout(res, delay));
      }
    }
  };
  
  connectDB().then(async () => {
    await JobService.recoverStaleJobs();
    
    const server = app.listen(PORT, () => {
      logger.info(`API Server running on port ${PORT}`);
    });

    // Graceful Shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      
      // Stop accepting new connections
      server.close(async () => {
        logger.info('Closed out remaining HTTP connections.');
        try {
          await JobService.drainActiveJobs(10000);
          await mongoose.connection.close(false);
          logger.info('MongoDB connection closed.');
          process.exit(0);
        } catch (error) {
          logger.error('Error closing connections', { error });
          process.exit(1);
        }
      });

      // Force shutdown after timeout
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 15000).unref();
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  });
}
