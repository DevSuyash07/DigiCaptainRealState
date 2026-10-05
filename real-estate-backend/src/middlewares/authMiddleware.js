import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import prisma from '../utils/prisma.js'; // ✨ FIXED: Using the singleton Prisma instance
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

// ==========================================
// 1. PROTECT MIDDLEWARE (Authentication Check)
// ==========================================
export const protect = catchAsync(async (req, res, next) => {
  let token;

  // 1a. Extract Token from Headers or Cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 1b. Verify Token (With fallback to JWT_SECRET)
  const decoded = await promisify(jwt.verify)(
    token, 
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET
  );

  // 1c. Check if user still exists in DB
  const currentUser = await prisma.user.findUnique({
    where: { id: decoded.id }
  });

  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // 1d. Check if user is banned/suspended
  if (currentUser.status === 'BANNED' || currentUser.status === 'SUSPENDED') {
    return next(new AppError('Your account is blocked. Please contact support.', 403));
  }

  // 1e. Check if user changed password AFTER token was issued
  if (currentUser.passwordChangedAt) {
    const changedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
    // If token was issued before the password was changed, reject it
    if (decoded.iat < changedTimestamp) {
      return next(new AppError('User recently changed password! Please log in again.', 401));
    }
  }

  // SUCCESS: Attach user object to request
  req.user = currentUser;
  next();
});

// ==========================================
// 2. ROLE AUTHORIZATION MIDDLEWARE (RBAC)
// ==========================================
// Example: router.delete('/property/:id', protect, restrictTo('ADMIN'), deleteProperty)
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user comes from the 'protect' middleware
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

// ==========================================
// 3. STRICT VERIFICATION MIDDLEWARE (For Core Features)
// ==========================================
// Example: router.post('/property', protect, requireVerification, createProperty)
export const requireVerification = catchAsync(async (req, res, next) => {
  // Ensure email is verified
  if (!req.user.emailVerified) {
    return next(new AppError('Action restricted. Please verify your email address first.', 403));
  }
  
  // Optional: Uncomment below if phone verification is also strictly required
  /*
  if (!req.user.phoneVerified) {
    return next(new AppError('Action restricted. Please verify your phone number first.', 403));
  }
  */
  
  next();
});