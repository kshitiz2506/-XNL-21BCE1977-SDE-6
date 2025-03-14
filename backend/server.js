import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ limit: '10kb' })); // Limit JSON payload size
app.use(cookieParser()); // Parse cookies
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent across origins
}));
app.use(helmet()); // Add security headers

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});



// mongodb+srv://kshitiz2506:kshitiz123@xnl.wqxsg.mongodb.net/