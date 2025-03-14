import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/petit-url?authSource=admin';

// Mongoose connection options
const mongooseOptions = {
  connectTimeoutMS: 5000, // 5 seconds
  serverSelectionTimeoutMS: 5000, // 5 seconds
  socketTimeoutMS: 45000, // 45 seconds
};

// In-memory fallback for testing without MongoDB
const setupMemoryFallback = () => {
  console.log('Using in-memory fallback for MongoDB');
  
  // Create a simple in-memory URL store
  global.urlStore = {
    urls: [],
    users: [],
    findUrls: (query = {}) => {
      return global.urlStore.urls.filter(url => {
        for (const key in query) {
          if (url[key] !== query[key]) return false;
        }
        return true;
      });
    },
    findUsers: (query = {}) => {
      return global.urlStore.users.filter(user => {
        for (const key in query) {
          if (user[key] !== query[key]) return false;
        }
        return true;
      });
    },
    addUrl: (url) => {
      const newUrl = { ...url, _id: Date.now().toString() };
      global.urlStore.urls.push(newUrl);
      return newUrl;
    },
    addUser: (user) => {
      const newUser = { ...user, _id: Date.now().toString() };
      global.urlStore.users.push(newUser);
      return newUser;
    }
  };
};

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.warn('Unable to connect to MongoDB, starting with limited functionality');
    
    // Set up in-memory fallback
    setupMemoryFallback();
    
    // Don't exit the process, let the app continue with limited functionality
  }
};
