import { config } from '../config/env.config.js';

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 1. Development Environment: Send detailed error including stack trace
  if (config.nodeEnv === 'development') {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} >> StatusCode:: ${err.statusCode}, Message:: ${err.message}`);
    
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  // 2. Production Environment: Sanitize the output
  if (config.nodeEnv === 'production') {
    // Operational, trusted error: send message to client safely
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        errors: err.errors || undefined,
      });
    }

    // Programming or other unknown error: don't leak error details
    console.error('CRITICAL ERROR 💥', err);
    return res.status(500).json({
      success: false,
      status: 'error',
      message: 'Something went wrong on the server!',
    });
  }
};