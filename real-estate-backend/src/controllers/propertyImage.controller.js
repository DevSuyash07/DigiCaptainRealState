import { PrismaClient } from '@prisma/client';
import cloudinary from '../config/cloudinary.js';

const prisma = new PrismaClient();

// Helper function to handle Cloudinary stream upload using Promises
const uploadStream = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: '99acres_clone/properties' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    // Write the buffer to the stream
    stream.end(buffer);
  });
};

export const uploadPropertyImages = async (req, res, next) => {
  try {
    const propertyId = parseInt(req.params.id, 10);

    // 1. Validate property existence and ownership
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    
    if (!property || property.deletedAt) {
      return res.status(404).json({ status: 'fail', message: 'Property not found' });
    }
    if (property.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ status: 'fail', message: 'Not authorized to add images to this property' });
    }

    // 2. Ensure files exist in the request
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: 'fail', message: 'No images provided' });
    }

    // 3. Upload all images to Cloudinary concurrently
    const uploadPromises = req.files.map((file) => uploadStream(file.buffer));
    const cloudinaryResults = await Promise.all(uploadPromises);

    // 4. Check if the property already has a cover image
    const existingCover = await prisma.propertyImage.findFirst({
      where: { propertyId, isCover: true }
    });

    // 5. Prepare Prisma payload and set the first image as cover if none exists
    let hasCover = !!existingCover;
    const imageData = cloudinaryResults.map((result) => {
      const isCover = !hasCover; 
      hasCover = true; // Only the first one gets to be true if no cover existed
      
      return {
        propertyId,
        url: result.secure_url,
        isCover
      };
    });

    // 6. Bulk insert into database
    await prisma.propertyImage.createMany({ data: imageData });

    // Fetch the updated images to return to the client
    const updatedImages = await prisma.propertyImage.findMany({
      where: { propertyId }
    });

    res.status(201).json({
      status: 'success',
      message: `${cloudinaryResults.length} images uploaded successfully`,
      data: { images: updatedImages }
    });
  } catch (error) {
    next(error);
  }
};