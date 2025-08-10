// app.js
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/v1/api/auth', authRoutes);
app.use('/v1/api/bookings', bookingRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('Welcome to Servano Backend API');
});

export default app;
