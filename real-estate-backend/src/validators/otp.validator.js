import { z } from 'zod';

// 10 digit Indian number, ya country code ke saath 10-15 digits.
const phoneInput = z
  .string()
  .min(10, 'Please enter a valid mobile number')
  .regex(/^\+?[0-9\s-]{10,20}$/, 'Invalid mobile number format');

export const phoneOtpRequestSchema = z.object({
  body: z.object({
    phone: phoneInput,
    purpose: z.string().max(32).optional()
  })
});

export const phoneOtpVerifySchema = z.object({
  body: z.object({
    phone: phoneInput,
    otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits')
  })
});
