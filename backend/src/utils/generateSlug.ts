import Url from '../models/url.model';
import { customAlphabet } from 'nanoid';

// Define the alphabet for the slug (avoiding similar-looking characters)
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 6); // Generate 6-character slugs

export const generateSlug = async (): Promise<string> => {
  // Generate a short slug (6 characters)
  const slug = nanoid();
  
  // Check if slug already exists
  const existingUrl = await Url.findOne({ slug });
  
  // If slug exists, generate a new one recursively
  if (existingUrl) {
    return generateSlug();
  }
  
  return slug;
};
