import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';               // 🆕 Added Logger
import compression from 'compression';     // 🆕 Added Compression
import cookieParser from 'cookie-parser';  // 🆕 Added Cookie Parser
import errorHandler from './middlewares/errorHandler.js';
import AppError from './utils/AppError.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import propertyRoutes from './routes/property.routes.js';

const app = express();

// --- 1. Global Security & Utility Middlewares ---

// Set security HTTP headers
app.use(helmet());

// HTTP Request Logger (Dev format for local, can be combined with Winston for prod)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined')); // Production format
}

// Compress all responses
app.use(compression());

// Restrict CORS to frontend domains or Vercel deployments
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Rate Limiting: Ek IP se 15 minute mein max 100 requests
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in 15 minutes!',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter);

// Body & Cookie parsers
app.use(express.json({ limit: '10kb' })); // Payload size limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());                  // Parse cookies for Auth JWTs

// --- 2. API Routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/properties', propertyRoutes);

// --- 3. Health Check Endpoint (For AWS ALB / Docker / K8s) ---
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Real Estate API is securely running!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// --- 4. 404 Route Not Found ---
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// --- 5. Global Error Handler ---
app.use(errorHandler);

export default app;