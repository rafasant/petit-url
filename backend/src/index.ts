import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import urlRoutes from './routes/url.routes';
import authRoutes from './routes/auth.routes';
import { optionalAuth } from './middleware/auth.middleware';

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// Auth routes
app.use('/api/auth', authRoutes);

// URL routes with optional auth
app.use('/api', optionalAuth, urlRoutes);

// Redirect routes (must be after API routes)
app.use('/', urlRoutes);

// Simple error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
