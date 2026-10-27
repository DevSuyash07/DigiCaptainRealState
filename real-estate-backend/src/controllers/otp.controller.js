import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendSms, smsConfigStatus } from '../utils/sendSms.js';

// ==========================================
// STANDALONE PHONE OTP (real SMS)
// Signup, post-property aur inquiry forms isi ko use karte hain.
// OTP kabhi response me nahi jata — sirf SMS me.
// ==========================================

const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 10);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);
const OTP_RESEND_SECONDS = Number(process.env.OTP_RESEND_SECONDS || 30);
const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_COUNTRY_CODE || '+91';
const PHONE_TOKEN_EXPIRES_IN = process.env.PHONE_TOKEN_EXPIRES_IN || '15m';

const hashOtp = (otp) => crypto.createHash('sha256').update(String(otp)).digest('hex');

const phoneTokenSecret = () => process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || null;

/** 9876543210 / 09876543210 / +91 98765 43210 → +919876543210 */
export const normalisePhone = (raw) => {
  const value = String(raw || '').trim();
  if (!value) return null;

  if (value.startsWith('+')) {
    const digits = value.slice(1).replace(/\D/g, '');
    return digits.length >= 10 ? `+${digits}` : null;
  }

  let digits = value.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 10) return `${DEFAULT_COUNTRY_CODE}${digits}`;
  if (digits.length > 10) return `+${digits}`;
  return null;
};

const sameHash = (a, b) => {
  const bufA = Buffer.from(String(a), 'utf8');
  const bufB = Buffer.from(String(b), 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

/** Form submit par phone verification dobara check karne ke liye. */
export const verifyPhoneToken = (token, phone) => {
  const secret = phoneTokenSecret();
  if (!secret || !token) return false;
  try {
    const decoded = jwt.verify(token, secret);
    return decoded.scope === 'phone_verified' && decoded.phone === normalisePhone(phone);
  } catch {
    return false;
  }
};

// ------------------------------------------
// 1. REQUEST OTP
// ------------------------------------------
export const requestPhoneOtp = catchAsync(async (req, res, next) => {
  const phone = normalisePhone(req.body.phone);
  const purpose = String(req.body.purpose || 'GENERIC').toUpperCase().slice(0, 32);

  if (!phone) return next(new AppError('Please provide a valid mobile number', 400));

  // SMS configured hai ya nahi — agar nahi, to saaf error, fake success nahi.
  const { mock, configured, missing } = smsConfigStatus();
  if (!mock && !configured) {
    return next(
      new AppError(
        `SMS service is not configured on the server, so no OTP could be sent. Missing environment variables: ${missing.join(', ')}.`,
        503
      )
    );
  }

  // Resend throttle
  const recent = await prisma.phoneOtp.findFirst({
    where: { phone, consumedAt: null },
    orderBy: { createdAt: 'desc' }
  });

  if (recent) {
    const ageSeconds = Math.floor((Date.now() - new Date(recent.createdAt).getTime()) / 1000);
    if (ageSeconds < OTP_RESEND_SECONDS) {
      return next(
        new AppError(
          `Please wait ${OTP_RESEND_SECONDS - ageSeconds} seconds before requesting another OTP.`,
          429
        )
      );
    }
  }

  // Purane pending codes ko expire kar do — ek waqt me ek hi valid code.
  await prisma.phoneOtp.updateMany({
    where: { phone, consumedAt: null },
    data: { expiresAt: new Date(Date.now() - 1000) }
  });

  const otp = crypto.randomInt(100000, 1000000).toString();
  const record = await prisma.phoneOtp.create({
    data: {
      phone,
      purpose,
      otpHash: hashOtp(otp),
      expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000)
    }
  });

  try {
    await sendSms({
      phone,
      message: `${otp} is your DigiCaptain verification code. Valid for ${OTP_TTL_MINUTES} minutes. Do not share it with anyone.`
    });
  } catch (error) {
    // Code bheja nahi gaya to use valid chhodna galat hai.
    await prisma.phoneOtp.delete({ where: { id: record.id } }).catch(() => {});
    return next(new AppError(`Could not send the OTP SMS: ${error.message}`, 502));
  }

  res.status(200).json({
    status: 'success',
    message: `OTP sent to ${phone}`,
    data: {
      phone,
      otpLength: 6,
      expiresInSeconds: OTP_TTL_MINUTES * 60,
      resendAfterSeconds: OTP_RESEND_SECONDS,
      channel: mock ? 'mock-console' : 'sms'
    }
  });
});

// ------------------------------------------
// 2. VERIFY OTP
// ------------------------------------------
export const confirmPhoneOtp = catchAsync(async (req, res, next) => {
  const phone = normalisePhone(req.body.phone);
  const otp = String(req.body.otp || '').trim();

  if (!phone) return next(new AppError('Please provide a valid mobile number', 400));
  if (!/^\d{6}$/.test(otp)) return next(new AppError('Please enter the 6-digit OTP', 400));

  const record = await prisma.phoneOtp.findFirst({
    where: { phone, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' }
  });

  if (!record) {
    return next(new AppError('This OTP has expired or was never requested. Please request a new one.', 400));
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    return next(new AppError('Too many wrong attempts for this code. Please request a new OTP.', 429));
  }

  if (!sameHash(record.otpHash, hashOtp(otp))) {
    const updated = await prisma.phoneOtp.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } }
    });
    const attemptsLeft = Math.max(0, OTP_MAX_ATTEMPTS - updated.attempts);
    return next(
      new AppError(`Incorrect OTP. ${attemptsLeft} attempt(s) left before you need a new code.`, 400)
    );
  }

  await prisma.phoneOtp.update({
    where: { id: record.id },
    data: { consumedAt: new Date() }
  });

  // Agar is phone ka user hai to uska phoneVerified bhi sach kar do.
  const user = await prisma.user.findFirst({ where: { phone } });
  if (user && !user.phoneVerified) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        phoneVerified: true,
        phoneVerifiedAt: new Date(),
        phoneVerificationOtp: null,
        phoneVerificationExpiresAt: null
      }
    });
  }

  const secret = phoneTokenSecret();
  const phoneToken = secret
    ? jwt.sign({ phone, scope: 'phone_verified', purpose: record.purpose }, secret, {
        expiresIn: PHONE_TOKEN_EXPIRES_IN
      })
    : null;

  res.status(200).json({
    status: 'success',
    message: 'Mobile number verified successfully',
    data: { phone, phoneToken }
  });
});
