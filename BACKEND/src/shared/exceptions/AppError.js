export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // Identifies this as an expected application error, not an unhandled exception
    this.isOperational = true; 

    // Captures the stack trace, excluding the constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}