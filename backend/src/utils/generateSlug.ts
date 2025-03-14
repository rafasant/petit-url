import { nanoid } from 'nanoid';
import Url from '../models/url.model';

export const generateSlug = async (): Promise<string> => {
  // Generate a short slug (6 characters)
  const slug = nanoid(6);
  
  // Check if slug already exists
  const existingUrl = await Url.findOne({ slug });
  
  // If slug exists, generate a new one recursively
  if (existingUrl) {
    return generateSlug();
  }
  
  return slug;
};
