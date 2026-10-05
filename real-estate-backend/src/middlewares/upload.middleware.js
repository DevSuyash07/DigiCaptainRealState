import multer from 'multer';

// Use MemoryStorage so the file is kept in RAM as a Buffer, not written to disk
const storage = multer.memoryStorage();

// Security: Only allow specific image mimetypes
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file to prevent memory exhaustion (DoS)
  },
  fileFilter,
});