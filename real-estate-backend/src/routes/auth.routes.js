import express from 'express';
import rateLimit from 'express-rate-limit';

import { 
  register, 
  login, 
  logout, 
  verifyEmail, 
  verifyPhone, 
  resendEmailOtp,
  resendPhoneOtp,
  refreshToken, 
  forgotPassword, 
  resetPassword
} from '../controllers/auth.controller.js';

import { 
  registerSchema, 
  loginSchema, 
  verifyEmailSchema, 
  verifyPhoneSchema, 
  resendEmailOtpSchema,   // ✨ ADDED
  resendPhoneOtpSchema,   // ✨ ADDED
  forgotPasswordSchema, 
  resetPasswordSchema 
} from '../validators/auth.validator.js';

import { requestPhoneOtp, confirmPhoneOtp } from '../controllers/otp.controller.js';
import { phoneOtpRequestSchema, phoneOtpVerifySchema } from '../validators/otp.validator.js';

import { validateRequest } from '../middlewares/validateRequest.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Auth Rate Limiter (Brute-force protection)
const authLimiter = rateLimit({
  max: 5,
  windowMs: 15 * 60 * 1000,
  message: {
    status: 'fail',
    message: 'Too many requests. Please try again in 15 minutes.'
  }
});

// ==========================================
// PUBLIC AUTH ROUTES
// ==========================================
router.post('/register', authLimiter, validateRequest(registerSchema), register);
router.post('/signup', authLimiter, validateRequest(registerSchema), register);
router.post('/login', authLimiter, validateRequest(loginSchema), login);

// Verification Routes
router.post('/verify-email', authLimiter, validateRequest(verifyEmailSchema), verifyEmail);
router.post('/verify-phone', authLimiter, validateRequest(verifyPhoneSchema), verifyPhone);

// STANDALONE PHONE OTP (real SMS) — used by the mobile verification widget
const otpLimiter = rateLimit({
  max: 8,
  windowMs: 15 * 60 * 1000,
  message: {
    status: 'fail',
    message: 'Too many OTP requests from this device. Please try again in 15 minutes.'
  }
});

router.post('/phone-otp/request', otpLimiter, validateRequest(phoneOtpRequestSchema), requestPhoneOtp);
router.post('/phone-otp/verify', otpLimiter, validateRequest(phoneOtpVerifySchema), confirmPhoneOtp);

// RESEND OTP ROUTES (✨ Protected with Validation Middleware)
router.post('/resend-email-otp', authLimiter, validateRequest(resendEmailOtpSchema), resendEmailOtp);
router.post('/resend-phone-otp', authLimiter, validateRequest(resendPhoneOtpSchema), resendPhoneOtp);

// Token Refresh Route (Frontend uses this when access token expires)
router.post('/refresh-token', refreshToken);

// Password Recovery Routes
router.post('/forgot-password', authLimiter, validateRequest(forgotPasswordSchema), forgotPassword);
router.patch('/reset-password/:token', authLimiter, validateRequest(resetPasswordSchema), resetPassword);


// ==========================================
// PROTECTED AUTH ROUTES
// ==========================================
// 🛡️ Middleware: All routes below this line require a valid JWT Access Token
router.use(protect);

// Logout Route
router.post('/logout', logout);

export default router;