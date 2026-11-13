import prisma from '../utils/prisma.js';

// Assuming your Prisma singleton is exported from a global DB config file. 
// It is: src/utils/prisma.js. Using that singleton keeps one MySQL connection
// per serverless instance instead of a new one per module.

// ==========================================
// 1. CREATE PROPERTY
// ==========================================
export const createProperty = async (req, res, next) => {
  try {
    // 🚨 req.body is already sanitized and validated by Zod at this point
    const { amenities, ...propertyData } = req.body;

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        ownerId: req.user.id, // Injected securely by the protect middleware

        // Map the array of amenity IDs to the implicit Many-to-Many relation
        ...(amenities && amenities.length > 0 && {
          amenities: {
            connect: amenities.map((id) => ({ id }))
          }
        })
      },
      // Return the populated amenities in the response
      include: { amenities: true }
    });

    res.status(201).json({
      status: 'success',
      message: 'Property listed successfully',
      data: { property }
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. GET ALL PROPERTIES (Advanced & Master Search)
// ==========================================
export const getAllProperties = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc',
      city, locality, propertyType, propertyFor, minPrice, maxPrice, bhk,
      search // ✨ NAYA PARAMETER MASTER SEARCH KE LIYE
    } = req.query;

    // 🏗️ Build Dynamic Query
    const where = { deletedAt: null };

    // Standard Filters
    if (city) where.city = { contains: city };
    if (locality) where.locality = { contains: locality };
    if (propertyType) where.propertyType = propertyType;
    if (propertyFor) where.propertyFor = propertyFor;

    // Price Range Filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Exact BHK Filter
    if (bhk) where.bedrooms = parseInt(bhk, 10);

   
    // 🧠 ✨ MASTER SEARCH LOGIC ✨
    if (search) {
      // 1. URL encoding (jaise %20) aur '+' signs ko normal spaces mein badlo
      const searchLower = decodeURIComponent(search).replace(/\+/g, ' ').toLowerCase();
      
      console.log("🔍 --- MASTER SEARCH DEBUG ---");
      console.log("-> Raw search received:", search);
      console.log("-> Cleaned string:", searchLower);

      // 2. BHK extract karein (Ab yeh '1bhk', '1 bhk', '1-bhk' sabko pakad lega)
      const bhkMatch = searchLower.match(/(\d+)[\s\-_]*bhk/);
      if (bhkMatch) {
        where.bedrooms = parseInt(bhkMatch[1], 10);
        console.log("-> BHK Filter Applied:", where.bedrooms);
      }

      // 3. String se filler words aur special characters hatao
      let cleanSearchTerm = searchLower
        .replace(/(\d+)[\s\-_]*bhk/g, '') // BHK number hatao
        .replace(/\b(in|at|near|for|with|around)\b/g, '') // Filler words hatao
        .replace(/[^a-z0-9\s]/g, ' ') // Comma, dash jaise symbols hatao
        .replace(/\s+/g, ' ') // Extra spaces hatao
        .trim(); 
      
      console.log("-> Final Location Search:", cleanSearchTerm ? `"${cleanSearchTerm}"` : "(None)");

      if (cleanSearchTerm) {
        where.OR = [
          { city: { contains: cleanSearchTerm } },
          { locality: { contains: cleanSearchTerm } },
          { title: { contains: cleanSearchTerm } },
          { address: { contains: cleanSearchTerm } }
        ];
      }
      console.log("-> Prisma Database Query:", JSON.stringify(where, null, 2));
      console.log("-------------------------------");
    }

    // 📊 Pagination Math
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);

    // 🚀 Execute parallel queries
    const [properties, totalCount] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          images: { where: { isCover: true }, take: 1 },
          owner: { select: { id: true, name: true, profilePictureUrl: true, role: true } }
        }
      }),
      prisma.property.count({ where })
    ]);

    res.status(200).json({
      status: 'success',
      results: properties.length,
      pagination: {
        total: totalCount,
        page: parseInt(page, 10),
        pages: Math.ceil(totalCount / take)
      },
      data: { properties }
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. GET SINGLE PROPERTY (Full Details)
// ==========================================
export const getPropertyById = async (req, res, next) => {
  try {
    const propertyId = parseInt(req.params.id, 10);

    const property = await prisma.property.findFirst({
      where: { id: propertyId, deletedAt: null },
      include: {
        images: true, // Fetch ALL images for the detail page
        amenities: true,
        owner: {
          select: { id: true, name: true, phone: true, email: true, role: true, companyName: true }
        }
      }
    });

    if (!property) {
      return res.status(404).json({ status: 'fail', message: 'Property not found' });
    }

    res.status(200).json({ status: 'success', data: { property } });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. UPDATE PROPERTY (With Ownership Auth)
// ==========================================
export const updateProperty = async (req, res, next) => {
  try {
    const propertyId = parseInt(req.params.id, 10);
    const { amenities, ...updateData } = req.body;

    // 1. Verify existence & ownership
    const existingProperty = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!existingProperty || existingProperty.deletedAt) {
      return res.status(404).json({ status: 'fail', message: 'Property not found' });
    }

    // 2. Authorization check: Only Owner or ADMIN can update
    if (existingProperty.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ status: 'fail', message: 'Not authorized to update this property' });
    }

    // 3. Execute Update
    const property = await prisma.property.update({
      where: { id: propertyId },
      data: {
        ...updateData,
        // If amenities are provided, replace the existing relations
        ...(amenities && {
          amenities: {
            set: amenities.map((id) => ({ id })) // `set` clears old connections and creates new ones
          }
        })
      },
      include: { amenities: true }
    });

    res.status(200).json({ status: 'success', message: 'Property updated successfully', data: { property } });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. DELETE PROPERTY (Soft Delete)
// ==========================================
export const deleteProperty = async (req, res, next) => {
  try {
    const propertyId = parseInt(req.params.id, 10);

    const existingProperty = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!existingProperty || existingProperty.deletedAt) {
      return res.status(404).json({ status: 'fail', message: 'Property not found' });
    }

    if (existingProperty.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ status: 'fail', message: 'Not authorized to delete this property' });
    }

    // 🛑 Soft Delete Strategy: We don't drop the row, we mark it as deleted to preserve history/leads.
    await prisma.property.update({
      where: { id: propertyId },
      data: { deletedAt: new Date() }
    });

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};