import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    // Use type assertion to fix the expiresIn type issue
    { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
