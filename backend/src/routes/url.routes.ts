import express from 'express';
import { createShortUrl, redirectToOriginalUrl, getUserUrls } from '../controllers/url.controller';
import { protect, optionalAuth } from '../middleware/auth.middleware';
import { apiLimiter, shortenLimiter } from '../middleware/rateLimit.middleware';

const router = express.Router();

// Public routes with rate limiting
router.post('/shorten', shortenLimiter, optionalAuth, createShortUrl);

// Protected routes with API rate limiting
router.get('/urls', apiLimiter, protect, getUserUrls);

// Redirect route - no rate limiting to ensure good user experience
router.get('/:slug', redirectToOriginalUrl);

export default router;
