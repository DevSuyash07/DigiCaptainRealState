import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { promisify } from 'util';
import prisma from '../utils/prisma.js';
import { cookieBaseOptions } from '../utils/cookieOptions.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendEmail } from '../utils/email.js';
import { sendSms } from '../utils/sendSms.js';

// --- Dual Token Helper Functions ---
const signAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
  });
};

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });
};

// ==========================================
// 1. REGISTER CONTROLLER
// ==========================================
export const register = catchAsync(async (req, res, next) => {
  console.log('--------------------------------------------------');
  console.log('🚀 [DEBUG] Register controller hit!');
  console.log('📥 [DEBUG] Request Body received:', JSON.stringify(req.body, null, 2));

  const { name, email, phone, password, role } = req.body;

  if (!email || !password || !name) {
    return next(new AppError('Please provide name, email, and password', 400));
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { phone: phone || undefined }
      ]
    }
  });

  if (existingUser) {
    const field = existingUser.email === email ? 'Email' : 'Phone number';
    return next(new AppError(`${field} is already in use`, 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const emailOtp = crypto.randomInt(100000, 999999).toString();
  const hashedEmailOtp = crypto.createHash('sha256').update(emailOtp).digest('hex');
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  let phoneOtp = null;
  let hashedPhoneOtp = null;
  if (phone) {
    phoneOtp = crypto.randomInt(100000, 999999).toString();
    hashedPhoneOtp = crypto.createHash('sha256').update(phoneOtp).digest('hex');
  }

  const newUser = await prisma.user.create({
    data: {
      name, email, phone, password: hashedPassword, role: role || 'USER',
      emailVerified: false, emailVerificationOtp: hashedEmailOtp, emailVerificationExpiresAt: otpExpires,
      phoneVerified: false, phoneVerificationOtp: hashedPhoneOtp, phoneVerificationExpiresAt: phone ? otpExpires : null
    }
  });

  sendEmail({
    email: newUser.email,
    subject: 'Verify your 99acres clone account',
    message: `Hello ${newUser.name},\n\nYour verification OTP is: ${emailOtp}\nIt is valid for 10 minutes.`,
    html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Welcome to 99acres Clone, ${newUser.name}!</h2>
            <p>Your verification code is:</p>
            <div style="background: #f4f4f4; padding: 10px 20px; font-size: 24px; font-weight: bold; letter-spacing: 2px; display: inline-block; margin: 10px 0;">
              ${emailOtp}
            </div>
          </div>`
  }).catch(err => console.error('⚠️ [DEBUG] Email failed:', err.message));

  if (phone && phoneOtp) {
    sendSms({
      phone: newUser.phone,
      message: `Hello ${newUser.name}, your phone verification OTP is: ${phoneOtp}. Valid for 10 minutes.`
    }).catch(err => console.error('⚠️ SMS failed:', err.message));
  }

  newUser.password = undefined;
  newUser.emailVerificationOtp = undefined;
  newUser.phoneVerificationOtp = undefined;

  const accessToken = signAccessToken(newUser.id);
  const refreshToken = signRefreshToken(newUser.id);

  res.cookie('accessToken', accessToken, { expires: new Date(Date.now() + 15 * 60 * 1000), httpOnly: true, ...cookieBaseOptions() });
  res.cookie('refreshToken', refreshToken, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), httpOnly: true, ...cookieBaseOptions() });

  res.status(201).json({
    status: 'success',
    message: 'Registered successfully. Please check your email and phone to verify your account.',
    accessToken, 
    data: { user: newUser }
  });
});

// ==========================================
// 2. LOGIN CONTROLLER
// ==========================================
export const login = catchAsync(async (req, res, next) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) return next(new AppError('Please provide email/phone and password', 400));

  const isEmail = emailOrPhone.includes('@');
  const user = await prisma.user.findFirst({
    where: isEmail ? { email: emailOrPhone } : { phone: emailOrPhone }
  });

  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email/phone or password', 401));
  }

  if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
    return next(new AppError('Your account has been suspended or banned. Please contact support.', 403));
  }

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  res.cookie('accessToken', accessToken, { expires: new Date(Date.now() + 15 * 60 * 1000), httpOnly: true, ...cookieBaseOptions() });
  res.cookie('refreshToken', refreshToken, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), httpOnly: true, ...cookieBaseOptions() });

  user.password = undefined;
  user.emailVerificationOtp = undefined;

  res.status(200).json({ status: 'success', accessToken, data: { user } });
});

// ==========================================
// 3. LOGOUT CONTROLLER
// ==========================================
export const logout = (req, res) => {
  res.cookie('accessToken', 'loggedout', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true, ...cookieBaseOptions() });
  res.cookie('refreshToken', 'loggedout', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true, ...cookieBaseOptions() });
  res.status(200).json({ status: 'success' });
};

// ==========================================
// 4. REFRESH TOKEN CONTROLLER
// ==========================================
export const refreshToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return next(new AppError('You are not logged in! Please log in again.', 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  
  if (!user || user.status === 'BANNED' || user.status === 'SUSPENDED') {
    return next(new AppError('User belonging to this token no longer exists or is banned.', 401));
  }

  const newAccessToken = signAccessToken(user.id);
  res.cookie('accessToken', newAccessToken, { expires: new Date(Date.now() + 15 * 60 * 1000), httpOnly: true, ...cookieBaseOptions() });
  res.status(200).json({ status: 'success', accessToken: newAccessToken });
});

// ==========================================
// 5. VERIFY EMAIL OTP
// ==========================================
export const verifyEmail = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) return next(new AppError('Please provide email and OTP', 400));

  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) return next(new AppError('No user found with this email', 404));
  if (user.emailVerified) return next(new AppError('Email is already verified', 400));
  if (user.emailVerificationOtp !== hashedOtp) return next(new AppError('Invalid OTP provided', 400));
  if (user.emailVerificationExpiresAt && user.emailVerificationExpiresAt < new Date()) {
    return next(new AppError('OTP has expired. Please request a new one', 400));
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, emailVerifiedAt: new Date(), emailVerificationOtp: null, emailVerificationExpiresAt: null }
  });

  res.status(200).json({ status: 'success', message: 'Email verified successfully!' });
});

// ==========================================
// 6. VERIFY PHONE OTP
// ==========================================
export const verifyPhone = catchAsync(async (req, res, next) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return next(new AppError('Please provide phone number and OTP', 400));

  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  const user = await prisma.user.findFirst({
    where: { phone, phoneVerificationOtp: hashedOtp, phoneVerificationExpiresAt: { gt: new Date() } }
  });

  if (!user) return next(new AppError('Invalid or expired phone verification OTP', 400));

  await prisma.user.update({
    where: { id: user.id },
    data: { phoneVerified: true, phoneVerifiedAt: new Date(), phoneVerificationOtp: null, phoneVerificationExpiresAt: null }
  });

  res.status(200).json({ status: 'success', message: 'Phone number verified successfully!' });
});

// ==========================================
// 7. RESEND EMAIL OTP
// ==========================================
export const resendEmailOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError('Please provide your email address', 400));

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) return next(new AppError('No user found with this email', 404));
  if (user.emailVerified) return next(new AppError('Email is already verified', 400));

  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerificationOtp: hashedOtp, emailVerificationExpiresAt: new Date(Date.now() + 10 * 60 * 1000) }
  });

  sendEmail({ email: user.email, subject: 'New Verification OTP', message: `Your new OTP is: ${otp}` }).catch(() => {});
  res.status(200).json({ status: 'success', message: 'New email OTP sent.' });
});

// ==========================================
// 8. RESEND PHONE OTP
// ==========================================
export const resendPhoneOtp = catchAsync(async (req, res, next) => {
  const { phone } = req.body;
  if (!phone) return next(new AppError('Please provide your phone number', 400));

  const user = await prisma.user.findFirst({ where: { phone } });
  if (!user) return next(new AppError('No user found with this phone number', 404));
  if (user.phoneVerified) return next(new AppError('Phone number is already verified', 400));

  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  
  await prisma.user.update({
    where: { id: user.id },
    data: { phoneVerificationOtp: hashedOtp, phoneVerificationExpiresAt: new Date(Date.now() + 10 * 60 * 1000) }
  });

  sendSms({ phone: user.phone, message: `Your new phone OTP is: ${otp}` }).catch(() => {});
  res.status(200).json({ status: 'success', message: 'New phone OTP sent.' });
});

// ==========================================
// 9. FORGOT PASSWORD
// ==========================================
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError('Please provide your email address', 400));

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return next(new AppError('There is no user with that email address.', 404));

  const resetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetTokenHash, passwordResetExpiresAt: new Date(Date.now() + 10 * 60 * 1000) }
  });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  res.status(200).json({ status: 'success', message: 'Token sent to email!' });

  sendEmail({
    email: user.email, subject: 'Password Reset', message: `Forgot your password? Submit a PATCH request to: ${resetURL}`
  }).catch(async () => {
    await prisma.user.update({ where: { id: user.id }, data: { passwordResetTokenHash: null, passwordResetExpiresAt: null } });
  });
});

// ==========================================
// 10. RESET PASSWORD
// ==========================================
export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password) return next(new AppError('Please provide a new password', 400));

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await prisma.user.findFirst({
    where: { passwordResetTokenHash: hashedToken, passwordResetExpiresAt: { gt: new Date() } }
  });

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  const hashedPassword = await bcrypt.hash(password, 12);
  
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
      passwordChangedAt: new Date()
    }
  });

  res.status(200).json({ status: 'success', message: 'Password updated successfully. Please log in.' });
});