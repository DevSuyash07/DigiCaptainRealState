import AppError from '../utils/AppError.js';

// --- Specific Error Transformers ---

const handlePrismaDuplicateFields = (err) => {
  // Prisma P2002 error return karta hai jab unique field (like email/phone) duplicate ho
  const field = err.meta?.target ? err.meta.target.join(', ') : 'field';
  const message = `Duplicate value entered for ${field}. Please use another value!`;
  return new AppError(message, 400);
};

const handlePrismaValidationError = (err) => {
  return new AppError('Invalid input data provided to the database.', 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again.', 401);
};


// --- Main Error Handler Middleware ---

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // Development: Show everything for easy debugging
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production Mode: Hide stack traces and internal errors
    
    // Create a shallow copy of the error to avoid mutating the original
    let error = Object.assign(err);
    error.message = err.message; // Ensure message is copied correctly

    // 1️⃣ Transform Known Third-Party Errors into Operational Errors
    
    // Prisma Errors
    if (error.code === 'P2002') error = handlePrismaDuplicateFields(error);
    if (error.name === 'PrismaClientValidationError') error = handlePrismaValidationError(error);
    
    // JWT Errors
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    // 2️⃣ Send Response Based on isOperational Flag
    if (error.isOperational) {
      // Operational, trusted error: send specific message to client
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      // Programming or other unknown error: don't leak error details
      
      // A) Log error for developer tracking (AWS CloudWatch / Datadog)
      console.error('ERROR 💥', error);

      // B) Send generic message to client
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong! Our team has been notified.',
      });
    }
  }
};

export default errorHandler;