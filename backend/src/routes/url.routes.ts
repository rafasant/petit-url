import express from 'express';
import { createShortUrl, redirectToOriginalUrl, getUserUrls } from '../controllers/url.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/shorten', createShortUrl);

// Protected routes
router.get('/urls', protect, getUserUrls);

// Redirect route
router.get('/:slug', redirectToOriginalUrl);

export default router;
