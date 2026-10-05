import { z } from 'zod';

// ==========================================
// 1. ENUMS (Strictly mirroring Prisma)
// ==========================================
const PropertyForEnum = z.enum(['SALE', 'RENT']);
const PropertyTypeEnum = z.enum([
  'APARTMENT', 'INDEPENDENT_HOUSE', 'VILLA', 'PLOT', 'BUILDER_FLOOR',
  'OFFICE_SPACE', 'SHOP', 'SHOWROOM', 'WAREHOUSE', 'INDUSTRIAL_SHED',
  'AGRICULTURAL_LAND', 'OTHER'
]);
const PropertyStatusEnum = z.enum(['READY_TO_MOVE', 'UNDER_CONSTRUCTION', 'NEW_LAUNCH']);
const TransactionTypeEnum = z.enum(['NEW_PROPERTY', 'RESALE']);
const FurnishingStatusEnum = z.enum(['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED']);
const OwnershipTypeEnum = z.enum(['FREEHOLD', 'LEASEHOLD', 'CO_OPERATIVE_SOCIETY', 'POWER_OF_ATTORNEY']);
const FacingDirectionEnum = z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST']);

// ==========================================
// 2. BASE SCHEMA (Zero-Trust)
// ==========================================
const propertyBaseSchema = z.object({
  // Basic Details
  title: z.string().trim().min(10, 'Title must be at least 10 characters').max(150),
  description: z.string().trim().max(5000, 'Description is too long').optional(),
  propertyFor: PropertyForEnum,
  propertyType: PropertyTypeEnum,
  propertyStatus: PropertyStatusEnum.optional(),
  transactionType: TransactionTypeEnum.optional(),
  ownershipType: OwnershipTypeEnum.optional(),

  // Pricing (Coerced from FormData strings to numbers)
  price: z.coerce.number().positive('Price must be greater than 0').max(9999999999),
  maintenanceFee: z.coerce.number().nonnegative().max(99999999).optional(),
  bookingAmount: z.coerce.number().nonnegative().max(99999999).optional(),

  // Areas
  carpetArea: z.coerce.number().positive().optional(),
  builtUpArea: z.coerce.number().positive().optional(),
  superBuiltUpArea: z.coerce.number().positive().optional(),
  plotArea: z.coerce.number().positive().optional(),

  // Configuration
  bedrooms: z.coerce.number().int().nonnegative().max(50).optional(),
  bathrooms: z.coerce.number().int().nonnegative().max(50).optional(),
  balconies: z.coerce.number().int().nonnegative().max(20).optional(),
  furnishingStatus: FurnishingStatusEnum.optional(),
  
  // Floor & Parking Details
  floorNumber: z.coerce.number().int().min(-5).max(200).optional(), // Allows basements (-1)
  totalFloors: z.coerce.number().int().positive().max(200).optional(),
  coveredParking: z.coerce.number().int().nonnegative().default(0),
  openParking: z.coerce.number().int().nonnegative().default(0),

  // Features
  facing: FacingDirectionEnum.optional(),
  ageOfProperty: z.coerce.number().int().nonnegative().max(200).optional(),
  reraId: z.string().trim().max(100).optional(),

  // Location
  address: z.string().trim().min(5).max(255),
  locality: z.string().trim().min(2).max(100),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().regex(/^[1-9][0-9]{5}$/, 'Invalid Indian Postal Code').optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),

  // Relations mapping for payload (Client will send an array of Amenity IDs)
  amenities: z.array(z.coerce.number().int()).optional().default([]),
}).strict(); // Block any undocumented fields (like ownerId)

// ==========================================
// 3. CREATE VALIDATOR WITH BUSINESS LOGIC
// ==========================================
const createPayload = propertyBaseSchema.superRefine((data, ctx) => {
  const residentialBuiltTypes = ['APARTMENT', 'INDEPENDENT_HOUSE', 'VILLA', 'BUILDER_FLOOR'];
  const landTypes = ['PLOT', 'AGRICULTURAL_LAND'];

  // Rule 1: Residential properties MUST have bedrooms and bathrooms
  if (residentialBuiltTypes.includes(data.propertyType)) {
    if (!data.bedrooms) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bedrooms are required for this property type", path: ["bedrooms"] });
    }
    if (!data.bathrooms) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bathrooms are required for this property type", path: ["bathrooms"] });
    }
  }

  // Rule 2: Land/Plots must have a plotArea, but should NOT have building features
  if (landTypes.includes(data.propertyType)) {
    if (!data.plotArea) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Plot area is required for land properties", path: ["plotArea"] });
    }
    if (data.bedrooms || data.carpetArea || data.floorNumber) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Land properties cannot have bedrooms, carpet area, or floors", path: ["propertyType"] });
    }
  }

  // Rule 3: Total floors must be >= floor number
  if (data.floorNumber !== undefined && data.totalFloors !== undefined) {
    if (data.floorNumber > data.totalFloors) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Floor number cannot be greater than total floors", path: ["floorNumber"] });
    }
  }
});

// ✨ FIX: Wrap the payload in a 'body' key to match your validateRequest.js middleware requirements
export const createPropertySchema = z.object({
  body: createPayload
});

// ==========================================
// 4. UPDATE VALIDATOR
// ==========================================
// We forbid changing 'propertyType' and 'propertyFor' after creation.
const updatePayload = propertyBaseSchema
  .omit({ propertyType: true, propertyFor: true })
  .partial()
  .strict();

// ✨ FIX: Wrap the payload in a 'body' key to match your validateRequest.js middleware requirements
export const updatePropertySchema = z.object({
  body: updatePayload
});