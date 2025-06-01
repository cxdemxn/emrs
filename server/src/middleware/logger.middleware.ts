import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';

/**
 * Middleware to log request and response details
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, originalUrl } = req;
  
  // Log request
  Logger.info(`${method} ${originalUrl}`);
  
  // Capture the original end function
  const originalEnd = res.end;
  
  // Override the end function to log response
  res.end = function(chunk?: any, encoding?: any, callback?: any) {
    const responseTime = Date.now() - start;
    const statusCode = res.statusCode;
    
    // Log response status and time
    if (statusCode >= 400) {
      Logger.warn(`${method} ${originalUrl} - ${statusCode} (${responseTime}ms)`);
    } else {
      Logger.info(`${method} ${originalUrl} - ${statusCode} (${responseTime}ms)`);
    }
    
    // Call the original end function
    return originalEnd.call(this, chunk, encoding, callback);
  };
  
  next();
};

/**
 * Error handling middleware
 */
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  Logger.error(`Error processing ${req.method} ${req.originalUrl}: ${err.message}`);
  Logger.error(err.stack || 'No stack trace available');
  
  res.status(500).json({
    message: 'Internal server error'
  });
};
