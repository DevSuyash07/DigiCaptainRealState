import { z } from 'zod';

const phoneRegex = /^\+?[1-9]\d{9,14}$/;

// ==========================================
// 1. UPDATE PROFILE SCHEMA
// ==========================================
export const updateMeSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z.string().regex(phoneRegex, "Invalid phone number format").optional(),
    companyName: z.string().optional(),
    reraId: z.string().optional(),
    experienceYears: z.number().int().min(0).optional(),
    about: z.string().max(500, "About must be under 500 characters").optional(),
    profilePictureUrl: z.string().url("Invalid URL format").optional()
  })
});

// ==========================================
// 2. UPDATE PASSWORD SCHEMA
// ==========================================
export const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters")
  })
});

// ==========================================
// 3. ADMIN: UPDATE USER STATUS SCHEMA
// ==========================================
export const updateUserStatusSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^\d+$/, "User ID must be a valid number")
  }),
  body: z.object({
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED'], {
      errorMap: () => ({ message: "Invalid status provided. Must be ACTIVE, INACTIVE, SUSPENDED, or BANNED." })
    })
  })
});