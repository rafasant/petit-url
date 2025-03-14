import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User from '../models/user.model';

// Extend the Express Request type to include the user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Not authorized to access this route' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      res.status(401).json({ error: 'Not authorized to access this route' });
      return;
    }
    
    // Check if user still exists
    const user = await User.findById(decoded.id);
    
    if (!user) {
      res.status(401).json({ error: 'User no longer exists' });
      return;
    }
    
    // Set user on request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized to access this route' });
  }
};

// Optional auth that doesn't require authentication but includes user if logged in
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return next();
    }
    
    // Check if user still exists
    const user = await User.findById(decoded.id);
    
    if (user) {
      // Set user on request
      req.user = user;
    }
    
    next();
  } catch (error) {
    next();
  }
};
