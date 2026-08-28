import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { AsyncLocalStorage } from 'async_hooks';

export const requestContext = new AsyncLocalStorage<{ correlationId: string }>();

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
  
  res.setHeader('X-Correlation-ID', correlationId);

  requestContext.run({ correlationId }, () => {
    // We log the incoming request
    logger.info(`Incoming Request`, {
      method: req.method,
      url: req.url,
      ip: req.ip,
      correlationId
    });

    const start = Date.now();
    
    // Log the response on finish
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`Request Completed`, {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        durationMs: duration,
        correlationId
      });
    });

    next();
  });
};
