import { Request, Response } from 'express';
import validUrl from 'valid-url';
import Url from '../models/url.model';
import { generateSlug } from '../utils/generateSlug';

export const createShortUrl = async (req: Request, res: Response): Promise<void> => {
  const { originalUrl, customSlug } = req.body;
  const baseUrl = process.env.BASE_URL || 'http://localhost:3001';

  // Check if the URL is valid
  if (!validUrl.isUri(originalUrl)) {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }

  try {
    let slug: string;
    
    // If user provided a custom slug
    if (customSlug) {
      // Check if custom slug is alphanumeric
      if (!/^[a-zA-Z0-9_-]+$/.test(customSlug)) {
        res.status(400).json({ error: 'Slug must be alphanumeric (letters, numbers, hyphens, or underscores)' });
        return;
      }
      
      // Check if custom slug already exists
      const existingUrlWithSlug = await Url.findOne({ slug: customSlug });
      if (existingUrlWithSlug) {
        res.status(400).json({ error: 'This custom slug is already in use' });
        return;
      }
      
      slug = customSlug;
    } else {
      // Generate a unique slug
      slug = await generateSlug();
    }

    // Get user ID if authenticated
    const userId = req.user ? req.user._id : null;

    // Check if URL already exists for this user (if logged in)
    let url;
    if (userId) {
      url = await Url.findOne({ originalUrl, userId });
    } else {
      // For anonymous users, just create a new URL
      url = null;
    }

    if (url) {
      res.json({
        originalUrl: url.originalUrl,
        shortUrl: `${baseUrl}/${url.slug}`,
        slug: url.slug,
        visits: url.visits,
        createdAt: url.createdAt,
      });
      return;
    }

    // Create a new URL entry
    url = new Url({
      originalUrl,
      slug,
      userId,
    });

    await url.save();

    res.status(201).json({
      originalUrl,
      shortUrl: `${baseUrl}/${slug}`,
      slug,
      visits: 0,
      createdAt: url.createdAt,
    });
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const redirectToOriginalUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const url = await Url.findOne({ slug: req.params.slug });

    if (url) {
      // Increment visit count
      url.visits += 1;
      url.lastVisited = new Date();
      await url.save();
      
      return res.redirect(url.originalUrl);
    } else {
      res.status(404).send('URL not found');
    }
  } catch (error) {
    console.error('Error redirecting to original URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUserUrls = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    
    const urls = await Url.find({ userId }).sort({ createdAt: -1 });
    
    const formattedUrls = urls.map(url => ({
      id: url._id,
      originalUrl: url.originalUrl,
      shortUrl: `${baseUrl}/${url.slug}`,
      slug: url.slug,
      visits: url.visits,
      createdAt: url.createdAt,
      lastVisited: url.lastVisited,
    }));
    
    res.json({
      success: true,
      urls: formattedUrls,
    });
  } catch (error) {
    console.error('Error getting user URLs:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// TODO: Add more advanced stats tracking
// TODO: Implement URL deletion and updating
