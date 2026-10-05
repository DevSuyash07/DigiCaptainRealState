import { z } from 'zod';

// Regex for standard phone numbers (Allows optional '+' and 10-15 digits)
const phoneRegex = /^\+?[1-9]\d{9,14}$/;

// ==========================================
// 1. REGISTER VALIDATION SCHEMA
// ==========================================
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address format"),
    phone: z.string()
      .regex(phoneRegex, "Invalid phone number format. Include country code if necessary.")
      .optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(['USER', 'OWNER', 'AGENT', 'BUILDER', 'ADMIN']).optional()
  })
});

// ==========================================
// 2. LOGIN VALIDATION SCHEMA
// ==========================================
export const loginSchema = z.object({
  body: z.object({
    emailOrPhone: z.string().min(1, "Email or Phone number is required"),
    password: z.string().min(1, "Password is required")
  })
});

// ==========================================
// 3. VERIFY EMAIL OTP SCHEMA
// ==========================================
export const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address format"),
    otp: z.string().length(6, "OTP must be exactly 6 digits")
  })
});

// ==========================================
// 4. VERIFY PHONE OTP SCHEMA
// ==========================================
export const verifyPhoneSchema = z.object({
  body: z.object({
    phone: z.string().regex(phoneRegex, "Invalid phone number format"),
    otp: z.string().length(6, "OTP must be exactly 6 digits")
  })
});

// ==========================================
// 5. RESEND EMAIL OTP SCHEMA (✨ Added)
// ==========================================
export const resendEmailOtpSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address format")
  })
});

// ==========================================
// 6. RESEND PHONE OTP SCHEMA (✨ Added)
// ==========================================
export const resendPhoneOtpSchema = z.object({
  body: z.object({
    phone: z.string().regex(phoneRegex, "Invalid phone number format")
  })
});

// ==========================================
// 7. FORGOT PASSWORD SCHEMA
// ==========================================
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address format")
  })
});

// ==========================================
// 8. RESET PASSWORD SCHEMA (🛡️ Fixed: Added params validation)
// ==========================================
export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(8, "New password must be at least 8 characters")
  }),
  params: z.object({
    token: z.string().min(1, "Reset token is required in URL")
  })
});