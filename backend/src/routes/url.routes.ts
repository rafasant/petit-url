import express from 'express';
import { createShortUrl, redirectToOriginalUrl } from '../controllers/url.controller';

const router = express.Router();

// Create a short URL
router.post('/shorten', createShortUrl);

// Redirect to the original URL
router.get('/:slug', redirectToOriginalUrl);

export default router;
