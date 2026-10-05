import express from 'express';
import { 
  createProperty, 
  getAllProperties, 
  getPropertyById, 
  updateProperty, 
  deleteProperty 
} from '../controllers/property.controller.js';

// Importing middlewares from Phase 1
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { uploadPropertyImages } from '../controllers/propertyImage.controller.js';
import { upload } from '../middlewares/upload.middleware.js';


// Importing the schemas we just created
import { createPropertySchema, updatePropertySchema } from '../validators/property.validator.js';

const router = express.Router();

// ==========================================
// 🌍 PUBLIC ROUTES (No login required)
// ==========================================
// Anyone can search and view properties. 99acres depends on heavy unauthenticated SEO traffic.
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// ==========================================
// 🛡️ PROTECTED ROUTES (Login required from here down)
// ==========================================
router.use(protect);

// 1. Create Property
// Only property owners, builders, agents, or admins can list properties. 
// Regular 'USER' (buyers/tenants) cannot create listings unless they upgrade their account.
router.post(
  '/', 
  restrictTo('OWNER', 'BUILDER', 'AGENT', 'ADMIN'), 
  validateRequest(createPropertySchema), // ✨ Changed here
  createProperty
);

router.patch(
  '/:id', 
  restrictTo('OWNER', 'BUILDER', 'AGENT', 'ADMIN'), 
  validateRequest(updatePropertySchema), // ✨ Changed here
  updateProperty
);
// 3. Delete Property (Soft Delete)
router.delete(
  '/:id', 
  restrictTo('OWNER', 'BUILDER', 'AGENT', 'ADMIN'), 
  deleteProperty
);

// Protected route for uploading images
// `upload.array('images', 10)` accepts up to 10 files sent under the field name 'images'
router.post(
  '/:id/images', 
  restrictTo('OWNER', 'BUILDER', 'AGENT', 'ADMIN'), 
  upload.array('images', 10), 
  uploadPropertyImages
);

export default router;