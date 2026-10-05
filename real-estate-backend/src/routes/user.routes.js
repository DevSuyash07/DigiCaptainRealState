import express from 'express';
import { 
  getMe, 
  updateMe, 
  updatePassword, 
  deleteMe, 
  getAllUsers, 
  updateUserStatus 
} from '../controllers/user.controller.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { 
  updatePasswordSchema, 
  updateMeSchema, 
  updateUserStatusSchema // ✨ ADDED
} from '../validators/user.validator.js';

const router = express.Router();

// ==========================================
// 🛡️ GLOBAL MIDDLEWARE FOR THIS ROUTER
// ==========================================
// All routes below this line require authentication
router.use(protect);

// ==========================================
// 👤 LOGGED-IN USER ROUTES
// ==========================================
router.get('/me', getMe);
router.patch('/update-me', validateRequest(updateMeSchema), updateMe);
router.patch('/update-password', validateRequest(updatePasswordSchema), updatePassword);
router.delete('/delete-me', deleteMe);

// ==========================================
// 👑 ADMIN ONLY ROUTES
// ==========================================
// Middleware: Only users with 'ADMIN' role can access routes below this line
router.use(restrictTo('ADMIN'));

router.get('/', getAllUsers);

// ✨ ADDED: Validation for Admin updating user status
router.patch('/:userId/status', validateRequest(updateUserStatusSchema), updateUserStatus);

export default router;