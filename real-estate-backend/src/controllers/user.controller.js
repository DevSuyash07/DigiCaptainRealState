import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

// Helper function to filter allowed fields during update (Mass Assignment Prevention)
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// ==========================================
// 1. GET CURRENT LOGGED-IN USER PROFILE
// ==========================================
export const getMe = (req, res, next) => {
  // req.user "protect" middleware se milta hai
  const user = req.user;
  
  // Clean sensitive fields before sending
  user.password = undefined;
  user.emailVerificationOtp = undefined;
  user.phoneVerificationOtp = undefined;
  user.passwordResetTokenHash = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
};

// ==========================================
// 2. UPDATE PROFILE (Name, Phone, Company, About, etc.)
// ==========================================
export const updateMe = catchAsync(async (req, res, next) => {
  // 1. Agar user ne password bheja hai, toh error throw karein
  if (req.body.password || req.body.passwordConfirm || req.body.newPassword) {
    return next(new AppError('This route is not for password updates. Please use /update-password.', 400));
  }

  // 2. Sirf allowed fields hi update hone dein
  const filteredBody = filterObj(
    req.body, 
    'name', 
    'phone', 
    'profilePictureUrl', 
    'companyName', 
    'reraId', 
    'experienceYears', 
    'about'
  );

  // 3. Database update
  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: filteredBody
  });

  updatedUser.password = undefined;
  updatedUser.emailVerificationOtp = undefined;
  updatedUser.phoneVerificationOtp = undefined;

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: {
      user: updatedUser
    }
  });
});

// ==========================================
// 3. UPDATE PASSWORD (Logged-in user) - SAFE DEBUG VERSION
// ==========================================
export const updatePassword = catchAsync(async (req, res, next) => {
  console.log("👉 UPDATE PASSWORD ROUTE HIT! req.user:", req.user);
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new AppError('Please provide both current and new password', 400));
    }

    // ✨ CRITICAL FIX: req.user.id ko Integer mein parse kar liya hai taaki type mismatch na ho
    const userId = parseInt(req.user.id, 10);

    // 1. Get user from DB
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return next(new AppError('User not found. Please login again.', 404));
    }

    // Agar user ka password database mein null hai
    if (!user.password) {
      return next(new AppError('Password is not set for this account', 400));
    }

    // 2. Check if current password matches
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return next(new AppError('Your current password is wrong', 401));
    }

    // 3. Hash new password and save
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedNewPassword,
        passwordChangedAt: new Date()
      }
    });

    // 4. Clear Dual Cookies
    res.cookie('accessToken', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.cookie('refreshToken', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully. Please log in again.'
    });

  } catch (err) {
    // 🛑 AB AGAR KUCH BHI FATTA HAI TOH TERMINAL MEIN SAHI ERROR DIKH JAYEGA
    console.error("🔥 ASLI ERROR YAHAN HAI --->", err);
    return next(new AppError(err.message || 'Something went wrong during password update', 500));
  }
});
// ==========================================
// 4. DELETE ACCOUNT (Soft Delete)
// ==========================================
export const deleteMe = catchAsync(async (req, res, next) => {
  await prisma.user.update({
    where: { id: req.user.id },
    data: { 
      status: 'DELETED',
      deletedAt: new Date()
    }
  });

  res.cookie('accessToken', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.cookie('refreshToken', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// ==========================================
// 5. ADMIN: GET ALL USERS
// ==========================================
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await prisma.user.findMany({
    where: { status: { not: 'DELETED' } },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      kycVerified: true,
      createdAt: true
    }
  });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

// ==========================================
// 6. ADMIN: UPDATE USER STATUS (Ban / Suspend / Activate)
// ==========================================
export const updateUserStatus = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { status } = req.body;

  if (!['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED'].includes(status)) {
    return next(new AppError('Invalid status provided', 400));
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(userId, 10) },
    data: { status }
  });

  updatedUser.password = undefined;

  res.status(200).json({
    status: 'success',
    message: `User status updated to ${status}`,
    data: {
      user: updatedUser
    }
  });
});