import AppError from '../utils/AppError.js';

/**
 * Zod validation middleware
 * @param {object} schema - Zod schema object
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Zod schema ke against request validate karein
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next(); // Data sahi hai, aage badho
    } catch (error) {
      console.error("🔥 ZOD VALIDATION ERROR:", error);

      // ✨ FIX: ZodError mein .issues hota hai, .errors nahi
      if (error.issues && Array.isArray(error.issues)) {
        const validationErrors = error.issues.map((err) => ({
          field: err.path[err.path.length - 1], 
          message: err.message
        }));

        return res.status(400).json({
          status: 'fail',
          message: 'Invalid input data. Please check the fields.',
          errors: validationErrors
        });
      }

      // Agar koi aur anjaan error ho
      next(new AppError(error.message || 'Internal validation error occurred', 500));
    }
  };
};