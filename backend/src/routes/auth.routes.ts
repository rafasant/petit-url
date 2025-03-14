import express from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { authLimiter, apiLimiter } from '../middleware/rateLimit.middleware';

const router = express.Router();

// Public routes with auth rate limiting
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Protected routes with general API rate limiting
router.get('/profile', apiLimiter, protect, getProfile);

export default router;
