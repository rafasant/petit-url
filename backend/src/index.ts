import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import urlRoutes from './routes/url.routes';

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// API routes
app.use('/api', urlRoutes);

// Redirect routes (must be after API routes)
app.use('/', urlRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
