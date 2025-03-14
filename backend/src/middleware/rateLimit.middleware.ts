import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Determine if we should use Redis or not
const useRedisStore = process.env.USE_REDIS === 'true' || false;

let redisStore: any = undefined;
let redisClient: any = undefined;

// Only try to set up Redis if needed
if (useRedisStore) {
  try {
    const Redis = require('ioredis');
    
    // Create Redis client
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      // Add connection timeout
      connectTimeout: 5000,
      maxRetriesPerRequest: 1,
    });
    
    // Log Redis connection status
    redisClient.on('connect', () => {
      console.log('Connected to Redis successfully');
    });
    
    redisClient.on('error', (err: Error) => {
      console.warn('Redis connection issue:', err.message);
      console.log('Falling back to memory store for rate limiting');
      redisStore = undefined;
    });
    
    // Only set up Redis store if connection is successful
    redisStore = {
      // Increment key and return current value
      incr: (key: string, cb: Function) => {
        redisClient.multi()
          .incr(key)
          .expire(key, 60) // 60 seconds expiry
          .exec((err: Error | null, replies: any[] | null) => {
            if (err) {
              return cb(err);
            }
            
            // Handle null or undefined replies
            if (!replies || replies.length === 0) {
              return cb(new Error('Redis returned no data'));
            }
            
            // Check the first reply is an array with a second element
            if (!Array.isArray(replies[0]) || replies[0].length < 2) {
              return cb(new Error('Invalid Redis response format'));
            }
            
            // Return the value
            cb(null, replies[0][1]);
          });
      },
      // Decrement key
      decrement: (key: string) => {
        redisClient.decr(key);
      },
      // Reset key
      resetKey: (key: string) => {
        redisClient.del(key);
      }
    };
  } catch (error) {
    console.warn('Failed to initialize Redis:', error);
    console.log('Using memory store for rate limiting');
  }
} else {
  console.log('Redis is disabled, using memory store for rate limiting');
}

// General API rate limiter (100 requests per 15 minutes)
export const apiLimiter = rateLimit({
  store: redisStore, // Will use memory store if redisStore is undefined
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// URL shortening rate limiter (10 URLs per hour)
export const shortenLimiter = rateLimit({
  store: redisStore, // Will use memory store if redisStore is undefined
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 shortening operations per hour
  message: {
    error: 'You have created too many URLs. Please try again after an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication rate limiter (5 attempts per hour)
export const authLimiter = rateLimit({
  store: redisStore, // Will use memory store if redisStore is undefined
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 auth attempts per hour
  message: {
    error: 'Too many login attempts. Please try again after an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
